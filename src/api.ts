import { Hono } from "hono";
import { bearerAuth } from "hono/bearer-auth";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { databaseClient } from "./shared";

const app = new Hono()
  // Middleware
  .use(
    bearerAuth({
      verifyToken: async (token, c) => {
        return token === "dynamic-token";
      },
    }),
  )
  .use(logger())
  .use(prettyJSON())
  .use(databaseClient);

export default app;
