import { HTTPException } from "hono/http-exception";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { Resource } from "sst";
import {
  Claim,
  ClaimSchema,
  ErrorResponse,
  ErrorResponseEnum,
  LoginFailedEnum,
  LoginFailedResponse,
  LoginRequestBody,
  LoginSuccessResponse,
  SignUpRequestBody,
  SignUpSuccessResponse,
  VerifyRequestBody,
  VerifySuccessResponse,
} from "./api_types";
import { eq } from "drizzle-orm";
import { users } from "./db/commits.sql";
import { Hono } from "hono";
import { createZValidator, databaseClient } from "./shared";
import { hc } from "hono/client";
import { base64url } from "rfc4648";

// TODO: Do some more serious testing of the signing and verification
// all I've tested is just blatantely wrong signatures not slightly modified

// Constants
const JWT_SIGNING_ALGO = { name: "HMAC", hash: "SHA-256" };
const JWT_HEADER_BASE_64 = base64url.stringify(
  new TextEncoder().encode(
    JSON.stringify({
      alg: "H256",
      typ: "JWT",
    }),
  ),
  { pad: false },
);
const COMMITTED_ISSUER = "committed";

/**
 * Type inference is much much better when everything is chained like this rather than on
 * separate lines. I don't understand the mechanics of that and I dislike it visually but
 * my visual preference loses to the type inference benefits
 */
const app = new Hono()
  // Middleware
  .use(logger())
  .use(prettyJSON())
  .use(databaseClient)
  // Routes
  .post("/signup", createZValidator("json", SignUpRequestBody), async (c) => {
    const { username, password, is_public } = c.req.valid("json");

    const salt_arr = new Uint8Array(16);
    crypto.getRandomValues(salt_arr);
    const hashedPasswordArr = await hashPassword(password, salt_arr);

    const saltHex = await converArrToHex(salt_arr);
    const passwordHex = await converArrToHex(hashedPasswordArr);

    const result = await c.var.db
      .insert(users)
      .values({
        username,
        password: passwordHex,
        salt: saltHex,
        deleted: false,
        public: is_public,
      })
      .onConflictDoNothing();

    // NOTE: Assumes that all DB errors except duplicates will thrown an exception above.
    // If other db errors make it here then the returned error will be strange
    if (result.meta.changes == 0) {
      const errorResponse: ErrorResponse = {
        code: 422,
        kind: ErrorResponseEnum.UserNameTakenKind,
        message: "Provided username is already taken.",
      };
      return c.json(errorResponse, 422);
    }

    const response: SignUpSuccessResponse = {
      message: "Success!",
    };
    return c.json(response, 200);
  })
  .post("/login", createZValidator("json", LoginRequestBody), async (c) => {
    const { username, password } = c.req.valid("json");

    const result = await c.var.db.query.users.findFirst({
      where: eq(users.username, username),
    });

    if (!result) {
      return c.json(await loginFailedResponse(), 401);
    }

    const saltHex = result.salt;
    const matchResultPairs = saltHex.match(/.{1,2}/g);
    if (!matchResultPairs) {
      throw new HTTPException(500);
    }
    const salt = new Uint8Array(
      matchResultPairs.map((byte) => parseInt(byte, 16)),
    );

    const providedPasswordHashArr = await hashPassword(password, salt);
    const providedPasswordHex = await converArrToHex(providedPasswordHashArr);

    const passwordHex = result.password;
    if (passwordHex != providedPasswordHex) {
      return c.json(await loginFailedResponse(), 401);
    }

    const key = await getJwtSigningKey();
    // TODO: This username id will be publicly available.
    //  having a auto-increment field for the current users number
    //  and making that public info is #bad. This is left as a string
    //  so that when I fix that issue this is easy to fix
    const jwt = await generateJwt(result.id.toString(), key);

    const response: LoginSuccessResponse = {
      message: "Successful login!",
      jwt,
    };
    return c.json(response, 200);
  })
  .post("/verify", createZValidator("json", VerifyRequestBody), async (c) => {
    const { token } = c.req.valid("json");
    const key = await getJwtSigningKey();
    const result = await verifyJwt(token, key);
    if (result.success === false) {
      return c.json(result.error, 401);
    }
    const data: VerifySuccessResponse = result.data;
    return c.json(data, 200);
  });

/**
 * Any time login fails this should be the response.
 * The only exception is if the payload provided is invalid. Then that will return a specific error */
async function loginFailedResponse(): Promise<LoginFailedResponse> {
  return {
    code: 401,
    reason: LoginFailedEnum.IncorrectUsernamePasswordKind,
    message: "Provided username/password was incorrect",
  };
}

/**
 * Used [this webpage](https://lord.technology/2024/02/21/hashing-passwords-on-cloudflare-workers.html) to come up with this function.
 * Confirmed it made sense overall, didn't blindly copy paste
 */
async function hashPassword(
  providedPassword: string,
  salt: Uint8Array,
): Promise<Uint8Array> {
  const encoder = new TextEncoder();
  const encodedProvidePassword = encoder.encode(providedPassword);

  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encodedProvidePassword,
    // Password-Based key derivation function
    { name: "PBKDF2" },
    false,
    ["deriveBits", "deriveKey"],
  );

  const key = await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    // I don't think this really matters? Since we're just using this as a hash
    { name: "AES-GCM", length: 256 },
    // Marks it as extractable
    true,
    ["encrypt", "decrypt"],
  );
  const exportedKey = (await crypto.subtle.exportKey(
    "raw",
    key,
  )) as ArrayBuffer;
  return new Uint8Array(exportedKey);
}

async function converArrToHex(arr: Uint8Array): Promise<string> {
  return Array.from(arr)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Gets the JWT signing key.
 * WARNING: Currently only uses one for all requests forever. I want to move away from
 * this but I don't know the best alternative. For now this works and I'll come back to this
 */
async function getJwtSigningKey(): Promise<CryptoKey> {
  const keyMaterial = Resource.CloudflareJwtSecret.value;
  const encoder = new TextEncoder();
  const encodedKeyMaterial = encoder.encode(keyMaterial);
  return crypto.subtle.importKey(
    "raw",
    encodedKeyMaterial,
    JWT_SIGNING_ALGO,
    false,
    ["sign", "verify"],
  );
}

/**
 * Generates a JWT token for the given username and with the provided signing key.
 */
async function generateJwt(userId: string, key: CryptoKey): Promise<string> {
  const epochSeconds = getEpochSeconds();
  const claims: Claim = {
    iss: COMMITTED_ISSUER,
    sub: userId,
    iat: epochSeconds,
    exp: epochSeconds + 1800,
  };
  const claimsBase64Result = base64urlEncode(
    new TextEncoder().encode(JSON.stringify(claims)),
  );
  if (claimsBase64Result.success === false) {
    throw claimsBase64Result.err;
  }
  const stringToSign = JWT_HEADER_BASE_64 + "." + claimsBase64Result.data;
  const encodedStringToSign = new TextEncoder().encode(stringToSign);
  const signature = await crypto.subtle.sign(
    JWT_SIGNING_ALGO,
    key,
    encodedStringToSign,
  );
  const signatureArray = new Uint8Array(signature);
  const signatureEncodeResult = base64urlEncode(signatureArray);
  if (signatureEncodeResult.success === false) {
    throw signatureEncodeResult.err;
  }
  return stringToSign + "." + signatureEncodeResult.data;
}

async function verifyJwt(
  token: string,
  key: CryptoKey,
): Promise<
  | { success: true; data: VerifySuccessResponse }
  | { success: false; error: ErrorResponse }
> {
  const firstPeriodPos = token.indexOf(".");
  if (firstPeriodPos == -1) {
    return {
      success: false,
      error: await failedVerificationResponse(),
    };
  }
  const secondPeriodPos = token.indexOf(".", firstPeriodPos + 1);
  if (secondPeriodPos == -1 || secondPeriodPos == token.length - 1) {
    return {
      success: false,
      error: await failedVerificationResponse(),
    };
  }

  const signatureDecodeResult = base64urlDecode(
    token.substring(secondPeriodPos + 1),
  );
  if (!signatureDecodeResult.success) {
    return {
      success: false,
      error: await failedVerificationResponse(),
    };
  }
  const signature = signatureDecodeResult.data;
  const expectedSigned = new TextEncoder().encode(
    token.substring(0, secondPeriodPos),
  );

  const success: boolean = await crypto.subtle.verify(
    JWT_SIGNING_ALGO,
    key,
    signature,
    expectedSigned,
  );

  if (!success) {
    return {
      success: false,
      error: await failedVerificationResponse(),
    };
  }

  const claimsDecodeResult = base64urlDecode(
    token.substring(firstPeriodPos + 1, secondPeriodPos),
  );
  if (!claimsDecodeResult.success) {
    return {
      success: false,
      error: await failedVerificationResponse(),
    };
  }
  const claimParseResult = ClaimSchema.safeParse(
    JSON.parse(new TextDecoder().decode(claimsDecodeResult.data)),
  );
  if (claimParseResult.success === false) {
    console.log(claimParseResult.error);
    return {
      success: false,
      error: await failedVerificationResponse(),
    };
  }
  const { sub, exp, iat } = claimParseResult.data;

  const currEpochSeconds = getEpochSeconds();
  if (exp <= currEpochSeconds) {
    console.log(
      "Token expired: exp = " + exp + " currEpochSeconds: " + currEpochSeconds,
    );
    return {
      success: false,
      error: await failedVerificationResponse(),
    };
  }

  const response: VerifySuccessResponse = {
    userId: sub,
    expires: exp,
    issuedAt: iat,
  };
  console.log(response);
  return {
    success: true,
    data: response,
  };
}

async function failedVerificationResponse(): Promise<ErrorResponse> {
  return {
    code: 401,
    kind: ErrorResponseEnum.VerificationFailureKind,
    message: "Failed to verify the token",
  };
}

function base64urlEncode(
  array: Uint8Array,
): { success: true; data: string } | { success: false; err: Error } {
  try {
    return {
      success: true,
      data: base64url.stringify(array, { pad: false }),
    };
  } catch (err) {
    console.log("Failed to encode the provided array");
    console.log(err);
    return { success: false, err };
  }
}

function base64urlDecode(
  str: string,
): { success: true; data: Uint8Array } | { success: false; err: Error } {
  try {
    return {
      success: true,
      data: base64url.parse(str, { loose: true }),
    };
  } catch (err) {
    console.log("Failed to decode the provided array");
    console.log(err);
    return { success: false, err };
  }
}

function getEpochSeconds(): number {
  return Math.floor(new Date().getTime() / 1000);
}

const client = hc<typeof app>("");
export type Client = typeof client;
export type AuthClientType = typeof app;
export default app;
