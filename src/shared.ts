import { createMiddleware } from "hono/factory";
import { database, DatabaseType } from "./db/drizzle";
import { Resource } from "sst";
import { ZodSchema } from "zod";
import { ErrorResponse, ErrorResponseEnum } from "./api_types";
import { zValidator } from "@hono/zod-validator";
import { hc } from "hono/client";
import { AuthClientType, Client } from "./auth";

// Custom created Middlewares and Middleware wrappers
export const databaseClient = createMiddleware<{
  Variables: { db: DatabaseType };
}>(async (c, next) => {
  // TODO: I think this is creating a new db client even if the worker is warm.
  // Can probably optimize this so only cold starts get a new client
  const db = database(Resource.HonoDatabase);
  c.set("db", db);
  await next();
});

export const authClient = createMiddleware<{
  Variables: { auth: Client };
}>(async (c, next) => {
  const client = hc<AuthClientType>("https://this.has.to.be.valid/", {
    fetch: Resource.Auth.fetch.bind(Resource.Auth),
  });
  c.set("auth", client);
  await next();
});

export function createZValidator(schema: ZodSchema) {
  return zValidator("json", schema, (result, c) => {
    // Forces TS to believe .error exists
    if (result.success === false) {
      console.log(result.error);
      const errorResponse: ErrorResponse = {
        code: 422,
        kind: ErrorResponseEnum.ValidationFailureKind,
        message: "Failed to parse input",
      };
      return c.json(errorResponse, 422);
    }
  });
}
