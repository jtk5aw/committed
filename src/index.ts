import { HTTPException } from "hono/http-exception";
import { logger } from "hono/logger";
import { createMiddleware } from "hono/factory";
import { prettyJSON } from "hono/pretty-json";
import { Resource } from "sst";
import { database, DatabaseType } from "./db/drizzle";
import { zValidator } from "@hono/zod-validator";
import {
  ErrorResponse,
  INCORRECT_USERNAME_PASSWORD_KIND,
  LoginFailedResponse,
  LoginRequestBody,
  LoginSuccessResponse,
  SignUpRequestBody,
  SignUpSuccessResponse,
  USER_NAME_TAKEN_KIND,
  VALIDATION_FAILURE_KIND,
  VERIFICATION_FAILURE_KIND,
  VerifyRequestBody,
  VerifySuccessResponse,
} from "./openapi";
import { eq } from "drizzle-orm";
import { users } from "./db/commits.sql";
import { Hono } from "hono";
import { string, z, ZodSchema } from "zod";

// Constants
const JWT_SIGNING_ALGO = { name: "HMAC", hash: "SHA-256" };
const JWT_HEADER_BASE_64 = base64UrlEncode(
  JSON.stringify({
    alg: "H256",
    typ: "JWT",
  }),
);
const COMMITTED_ISSUER = "committed";

// Custom created Middlewares and Middleware wrappers
const databaseClient = createMiddleware<{ Variables: { db: DatabaseType } }>(
  async (c, next) => {
    // TODO: I think this is creating a new db client even if the worker is warm.
    // Can probably optimize this so only cold starts get a new client
    const db = database(Resource.HonoDatabase);
    c.set("db", db);
    await next();
  },
);

function createZValidator(schema: ZodSchema) {
  return zValidator("json", schema, (result, c) => {
    // Forces TS to believe .error exists
    if (result.success === false) {
      console.log(result.error);
      const errorResponse = {
        code: 422,
        kind: VALIDATION_FAILURE_KIND,
        message: "Failed to parse input",
      };
      const validatedErrorResponse = ErrorResponse.parse(errorResponse);
      return c.json(validatedErrorResponse, 422);
    }
  });
}

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
  .post("/signup", createZValidator(SignUpRequestBody), async (c) => {
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
      const errorResponse = {
        code: 422,
        kind: USER_NAME_TAKEN_KIND,
        message: "Provided username is already taken.",
      };
      const validatedErrorResponse =
        await ErrorResponse.parseAsync(errorResponse);
      return c.json(validatedErrorResponse, 422);
    }

    const response = {
      message: "Success!",
    };
    const validatedResponse = SignUpSuccessResponse.parse(response);
    return c.json(validatedResponse, 200);
  })
  .post("/login", createZValidator(LoginRequestBody), async (c) => {
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
    const jwt = await generateJwt(username, key);

    const response = {
      message: "Successful login!",
      jwt,
    };
    const validatedResponse = LoginSuccessResponse.parse(response);
    return c.json(validatedResponse, 200);
  })
  .post("/verify", createZValidator(VerifyRequestBody), async (c) => {
    const { token } = c.req.valid("json");
    const key = await getJwtSigningKey();
    const result = await verifyJwt(token, key);
    if (result.success === false) {
      return c.json(result.error, 401);
    }
    return c.json(result.data, 200);
  });

/**
 * Any time login fails this should be the response.
 * The only exception is if the payload provided is invalid. Then that will return a specific error */
async function loginFailedResponse(): Promise<
  z.infer<typeof LoginFailedResponse>
> {
  const errorResponse = {
    code: 401,
    reason: INCORRECT_USERNAME_PASSWORD_KIND,
    message: "Provided username/password was incorrect",
  };
  return LoginFailedResponse.parse(errorResponse);
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
async function generateJwt(username: string, key: CryptoKey): Promise<string> {
  const epochSeconds = Math.floor(new Date().getTime() / 1000);
  const claims = {
    iss: COMMITTED_ISSUER,
    sub: username,
    iat: epochSeconds,
    exp: epochSeconds + 1800,
  };
  const claimsBase64 = base64UrlEncode(JSON.stringify(claims));
  const stringToSign = JWT_HEADER_BASE_64 + "." + claimsBase64;
  const encodedStringToSign = new TextEncoder().encode(stringToSign);
  const signature = await crypto.subtle.sign(
    JWT_SIGNING_ALGO,
    key,
    encodedStringToSign,
  );
  const signatureArray = new Uint8Array(signature);
  const signatureString = Array.from(signatureArray)
    .map((b) => String.fromCharCode(b))
    .join("");
  const signatureBase64 = base64UrlEncode(signatureString);
  return stringToSign + "." + signatureBase64;
}

async function verifyJwt(
  token: string,
  key: CryptoKey,
): Promise<
  | { success: true; data: z.infer<typeof VerifySuccessResponse> }
  | { success: false; error: z.infer<typeof ErrorResponse> }
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

  const encoder = new TextEncoder();
  const signature = encoder.encode(token.substring(secondPeriodPos + 1));
  const expectedSigned = encoder.encode(token.substring(0, secondPeriodPos));

  const success = crypto.subtle.verify(
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

  const { sub, exp, iat } = JSON.parse(
    base64UrlDecode(token.substring(firstPeriodPos + 1, secondPeriodPos)),
  );

  // TODO: Validate the claim matches a zod type
  const response = {
    username: sub,
    expires: exp,
    issuedAt: iat,
  };
  console.log(response);
  const validateResponse = VerifySuccessResponse.parse(response);
  return {
    success: true,
    data: validateResponse,
  };
}

async function failedVerificationResponse(): Promise<
  z.infer<typeof ErrorResponse>
> {
  const errorResponse = {
    code: 401,
    kind: VERIFICATION_FAILURE_KIND,
    message: "Failed to verify the token",
  };
  const validatedErrorResponse = ErrorResponse.parse(errorResponse);
  return validatedErrorResponse;
}

/**
 * Taken from https://medium.com/@bagdasaryanaleksandr97/understanding-base64-vs-base64-url-encoding-whats-the-difference-31166755bc26
 */
function base64UrlEncode(str: string): string {
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlDecode(str: string): string {
  str = str.replace(/-/g, "+").replace(/_/g, "/");
  while (str.length % 4) {
    str += "=";
  }
  return atob(str);
}

export default app;
