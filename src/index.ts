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
} from "./openapi";
import { eq } from "drizzle-orm";
import { users } from "./db/commits.sql";
import { Hono } from "hono";
import { z, ZodSchema } from "zod";

// Custom created Middlewares and Middleware wrappers
const databaseClient = createMiddleware<{ Variables: { db: DatabaseType } }>(
  async (c, next) => {
    const db = database(Resource.HonoDatabase);
    c.set("db", db);
    await next();
  },
);

function createZValidator(schema: ZodSchema) {
  return zValidator("json", schema, (result, c) => {
    if (!result.success) {
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

    const response = {
      message: "Successful login!",
    };
    const validatedResponse = LoginSuccessResponse.parse(response);
    return c.json(validatedResponse, 200);
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

export default app;
