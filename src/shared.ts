import { createMiddleware } from "hono/factory";
import { database, DatabaseType } from "./db/drizzle";
import { Resource } from "sst";
import { ZodSchema } from "zod";
import { ErrorResponse, VALIDATION_FAILURE_KIND } from "./api_types";
import { zValidator } from "@hono/zod-validator";

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

export function createZValidator(schema: ZodSchema) {
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
