import { z } from "@hono/zod-openapi";
import { createRoute } from "@hono/zod-openapi";
import { createMiddleware } from "hono/factory";
import { database, DatabaseType } from "./db/drizzle";
import { Resource } from "sst";

// NOTE: The response schemas are validated "by hand" and not by the middleware

// Shared invalid error response
export const USER_NAME_TAKEN_KIND = "user_name_taken";
export const VALIDATION_FAILURE_KIND = "validation_failure";
export const ErrorResponse = z.object({
  code: z.number().openapi({ example: 400 }),
  kind: z.enum([VALIDATION_FAILURE_KIND, USER_NAME_TAKEN_KIND]),
  message: z.string().openapi({ example: "Bad request" }),
});

export const INCORRECT_USERNAME_PASSWORD_KIND = "incorrect_username_password";
export const LoginFailedResponse = z.object({
  code: z.number().openapi({ example: 401 }),
  reason: z.enum([INCORRECT_USERNAME_PASSWORD_KIND]),
  message: z.string().openapi({ example: "username/password is incorrect" }),
});

// Sign-up Route
export const SignUpRequestBody = z.object({
  username: z.string().max(20).min(3).openapi({ example: "jackson" }),
  password: z.string(),
  is_public: z.boolean(),
});

export const SignUpSuccessResponse = z.object({
  message: z.string().openapi({ example: "Success!" }),
});

export const signup_route = createRoute({
  method: "post",
  path: "/signup",
  request: {
    body: {
      content: {
        "application/json": {
          schema: SignUpRequestBody,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: SignUpSuccessResponse,
        },
      },
      description: "Sign up was completed successfully",
    },
    422: {
      content: {
        "application/json": {
          schema: ErrorResponse,
        },
      },
      description: "Sign up failed. Details provided in the response body",
    },
  },
});

// Login route
export const LoginRequestBody = z.object({
  username: z.string().max(20).min(3).openapi({ example: "jackson" }),
  password: z.string(),
});

export const LoginSuccessResponse = z.object({
  // TODO: Update this to be some token that can be used to make further requests
  message: z.string().openapi({ example: "Success!" }),
});

export const login_route = createRoute({
  method: "post",
  path: "/login",
  request: {
    body: {
      content: {
        "application/json": {
          schema: LoginRequestBody,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: LoginSuccessResponse,
        },
      },
      description: "Login was completed successfully",
    },
    422: {
      content: {
        "application/json": {
          schema: ErrorResponse,
        },
      },
      description:
        "Login failed due to improper inputs. Details provided in the response body",
    },
    401: {
      content: {
        "application/json": {
          schema: LoginFailedResponse,
        },
      },
      description:
        "Login failed due to improper credentials. Details in hte response body",
    },
  },
});
