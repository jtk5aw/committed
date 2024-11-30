import { Hono } from "hono";
import { bearerAuth } from "hono/bearer-auth";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { authClient, createZValidator, databaseClient } from "./shared";
import { LoginRequestBody, NewCommitRequestBody, ParentId } from "./api_types";
import { z } from "zod";
import { commits } from "./db/commits.sql";
import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";

const app = new Hono<{ Variables: { userId: number } }>()
  // Middleware
  .use(logger())
  .use(prettyJSON())
  .use(databaseClient)
  .use(authClient)
  // Can't use bearerauth as this is how a token is received
  // TODO: Determine if this should have its own body that is converted to what the
  // auth client actually needs
  .post("/login", createZValidator(LoginRequestBody), async (c) => {
    const body = c.req.valid("json");
    const result = await c.var.auth.login.$post({ json: { ...body } });
    if (!result.ok) {
      if (result.status == 401) {
        const errorDetails = await result.json();
        console.log(errorDetails);
        return c.json(errorDetails.message, 401);
      } else {
        const errorDetails = await result.text();
        console.log(errorDetails);
        return c.json(errorDetails, 500);
      }
    }
    const successDetails = await result.json();
    return c.json(successDetails, 200);
  })
  // Bearer auth and all remaining endpoints
  .use(
    bearerAuth({
      verifyToken: async (token, c) => {
        const authClient = c.var.auth;
        const result = await authClient.verify.$post({ json: { token } });
        if (!result.ok) {
          if (result.status == 401) {
            const errorDetails = await result.json();
            console.log(errorDetails);
          } else {
            const errorDetails = await result.text();
            console.log(errorDetails);
          }
          return false;
        }
        const data = await result.json();
        c.set("userId", data.userId);
        return true;
      },
    }),
  )
  .post("/ping", async (c) => {
    console.log("auth completed successfully");
    return c.json("success", 200);
  })
  .post("/message", createZValidator(NewCommitRequestBody), async (c) => {
    const databaseClient = c.var.db;

    const { message, parent_id } = c.req.valid("json");
    const convertedParentId = getParentCommitId(parent_id);
    const userId = c.var.userId;

    // TODO: I have no idea why this is a type error
    const result = await databaseClient.insert(commits).values({
      user_id: userId,
      parent_commit_id: convertedParentId,
      content: message,
      deleted: false,
    });

    if (!result.success) {
      console.log(result.error);
      c.json("Failed to post", 500);
    }

    return c.json(201);
  })
  // TODO: Determine if this is useful in any way and if so modify it to be legit
  .get(
    "/message/:id",
    zValidator(
      "param",
      z.object({
        id: z
          .string()
          .transform((v) => parseInt(v))
          .refine((v) => !isNaN(v), { message: "not a number" }),
      }),
    ),
    async (c) => {
      const databaseClient = c.var.db;
      const { id } = c.req.valid("param");

      const result = await databaseClient.query.commits.findFirst({
        where: eq(commits.id, id),
        columns: {
          content: true,
          deleted: true,
        },
        with: {
          users: {
            columns: {
              username: true,
            },
          },
        },
      });

      if (!result) {
        c.json({ code: 400, message: "Specified commit does not exist" }, 400);
      }

      const toReturn = {
        username: result.users.username,
        content: result.content,
        deleted: result.deleted,
      };
      return c.json(toReturn, 200);
    },
  );

function getParentCommitId(parentId: z.infer<typeof ParentId>): number {
  if (parentId.commit_type == "commit") {
    return parentId.commit_id;
  } else {
    return null;
  }
}

export default app;
