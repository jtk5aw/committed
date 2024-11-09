import { HTTPException } from "hono/http-exception";
import { logger } from "hono/logger";
import { createMiddleware } from "hono/factory";
import { Resource } from "sst";
import { notes } from "./db/notes.sql";
import { database, DatabaseType } from "./db/drizzle";
import { OpenAPIHono, z } from "@hono/zod-openapi";
import {
  ErrorResponse,
  INCORRECT_USERNAME_PASSWORD_KIND,
  LoginFailedResponse,
  LoginSuccessResponse,
  SignUpSuccessResponse,
  USER_NAME_TAKEN_KIND,
  VALIDATION_FAILURE_KIND,
  login_route,
  signup_route,
} from "./openapi";
import { eq } from "drizzle-orm";
import { users } from "./db/commits.sql";

const app = new OpenAPIHono({
  defaultHook: (result, c) => {
    if (!result.success) {
      const errorResponse = {
        code: 422,
        kind: VALIDATION_FAILURE_KIND,
        message: "Failed to parse input",
      };
      const validatedErrorResponse = ErrorResponse.parse(errorResponse);
      return c.json(validatedErrorResponse, 422);
    }
  },
});

// Middlewares
app.use(logger());

// Routes
app.openapi(signup_route, async (c) => {
  const db = database(Resource.HonoDatabase);
  const { username, password, is_public } = c.req.valid("json");

  const salt_arr = new Uint8Array(16);
  crypto.getRandomValues(salt_arr);
  const hashedPasswordArr = await hashPassword(password, salt_arr);

  const saltHex = await converArrToHex(salt_arr);
  const passwordHex = await converArrToHex(hashedPasswordArr);

  const result = await db
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
    const validatedErrorResponse = ErrorResponse.parse(errorResponse);
    return c.json(validatedErrorResponse, 422);
  }

  const response = {
    message: "Success!",
  };
  const validatedResponse = SignUpSuccessResponse.parse(response);
  return c.json(validatedResponse, 200);
});

app.openapi(login_route, async (c) => {
  const db = database(Resource.HonoDatabase);
  const { username, password } = c.req.valid("json");

  const result = await db.query.users.findFirst({
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

// Non-openapi Routes
app
  .put("/", async (c) => {
    const key = crypto.randomUUID();
    await Resource.MyBucket.put(key, c.req.raw.body, {
      httpMetadata: {
        contentType: c.req.header("content-type"),
      },
    });
    return new Response(`Object created with key: ${key}`);
  })
  .get("/:id", async (c) => {
    const id: number = parseInt(c.req.param("id"));
    const first = await Resource.MyBucket.list().then((res) => {
      if (id >= res.objects.length) {
        throw new HTTPException(400, { message: "Not an available id." });
      }
      return res.objects.sort(
        (a, b) => a.uploaded.getTime() - b.uploaded.getTime(),
      )[id];
    });
    const result = await Resource.MyBucket.get(first.key);
    c.header("content-type", result.httpMetadata.contentType);
    return c.body(result.body);
  })
  .put("/notes", async (c) => {
    const db = database(Resource.HonoDatabase);
    const body = await c.req.json();
    if (!body.content) {
      throw new HTTPException(400, {
        message: "Did not provide content field",
      });
    }
    const result = await db.insert(notes).values({
      content: body.content,
    });
    return c.body(JSON.stringify(result));
  })
  .get("/notes/:id", async (c) => {});

export default app;
