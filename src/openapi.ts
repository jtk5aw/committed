import { z } from "zod";

// Shared invalid error response
export const USER_NAME_TAKEN_KIND = "user_name_taken";
export const VALIDATION_FAILURE_KIND = "validation_failure";
export const ErrorResponse = z.object({
  code: z.number(),
  kind: z.enum([VALIDATION_FAILURE_KIND, USER_NAME_TAKEN_KIND]),
  message: z.string(),
});

export const INCORRECT_USERNAME_PASSWORD_KIND = "incorrect_username_password";
export const LoginFailedResponse = z.object({
  code: z.number(),
  reason: z.enum([INCORRECT_USERNAME_PASSWORD_KIND]),
  message: z.string(),
});

// Sign-up Route
export const SignUpRequestBody = z.object({
  username: z.string().max(20).min(3),
  password: z.string(),
  is_public: z.boolean(),
});

export const SignUpSuccessResponse = z.object({
  message: z.string(),
});

// Login route
export const LoginRequestBody = z.object({
  username: z.string().max(20).min(3),
  password: z.string(),
});

export const LoginSuccessResponse = z.object({
  // TODO: Update this to be some token that can be used to make further requests
  message: z.string(),
});
