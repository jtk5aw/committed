import { Hono } from "hono";
import { bearerAuth } from "hono/bearer-auth";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { authClient, createZValidator, databaseClient } from "./shared";
import {
  GetManyCommitsQuery,
  GetSingleCommitParam,
  LoginRequestBody,
  NewCommitRequestBody,
  ParentId,
} from "./api_types";
import { z } from "zod";
import { commits, COMMON_COMMIT_PARAMS } from "./db/commits.sql";
import { eq } from "drizzle-orm";

// TODO WARNING: No authz exists, need to add that before thsi is actually useful

const app = new Hono<{ Variables: { userId: number } }>()
  // Middleware
  .use(logger())
  .use(prettyJSON())
  .use(databaseClient)
  .use(authClient)
  // Can't use bearerauth as this is how a token is received
  .post("/login", createZValidator("json", LoginRequestBody), async (c) => {
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
  .post(
    "/message",
    createZValidator("json", NewCommitRequestBody),
    async (c) => {
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
    },
  )
  .get(
    "/message",
    createZValidator("query", GetManyCommitsQuery),
    async (c) => {
      const databaseClient = c.var.db;
      const { user_id } = c.req.valid("query");

      const result = await databaseClient.query.commits.findMany({
        where: eq(commits.user_id, user_id),
        columns: {
          content: true,
          deleted: true,
        },
        with: {
          user: {
            columns: {
              username: true,
            },
          },
          parentCommit: {
            with: {
              user: {
                columns: {
                  username: true,
                },
              },
            },
          },
        },
      });
      if (!result) {
        return c.json("Failed to find commits", 400);
      }

      const values = Array.from(result.values()).map((value) => {
        return {
          username: value.user.username,
          parentId: value.parentCommit?.id,
          parentUserName: value.parentCommit?.user.username,
          content: value.content,
          deleted: value.deleted,
        };
      });
      const toReturn = {
        numCommits: values.length,
        values,
      };
      return c.json(toReturn, 200);
    },
  )
  .get(
    "/message/:id",
    createZValidator("param", GetSingleCommitParam),
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
          user: {
            columns: {
              username: true,
            },
          },
          parentCommit: {
            with: {
              user: {
                columns: {
                  username: true,
                },
              },
            },
          },
        },
      });

      if (!result) {
        return c.json(
          { code: 400, message: "Specified commit does not exist" },
          400,
        );
      }

      const toReturn = {
        username: result.user.username,
        parentId: result.parentCommit?.id,
        parentUserName: result.parentCommit?.user.username,
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
