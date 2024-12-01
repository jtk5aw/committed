import { z } from "zod";

// Shared invalid error response
export enum ErrorResponseEnum {
  UserNameTakenKind,
  ValidationFailureKind,
  VerificationFailureKind,
}
export interface ErrorResponse {
  code: number;
  kind: ErrorResponseEnum;
  message: string;
}

export enum LoginFailedEnum {
  IncorrectUsernamePasswordKind,
}
export interface LoginFailedResponse {
  code: number;
  reason: LoginFailedEnum;
  message: string;
}

/// API

export const ParentId = z.discriminatedUnion("commit_type", [
  z.object({
    commit_type: z.literal("commit"),
    commit_id: z.number().min(0),
  }),
  z.object({ commit_type: z.literal("empty") }),
]);

// New commit route
export const NewCommitRequestBody = z.object({
  message: z.string().max(128),
  parent_id: ParentId,
});

// Get Message routes
export const GetSingleCommitParam = z.object({
  id: z
    .string()
    .transform((v) => parseInt(v))
    .refine((v) => !isNaN(v), { message: "not a number" }),
});

export const GetManyCommitsQuery = z.object({
  user_id: z
    .string()
    .transform((v) => parseInt(v))
    .refine((v) => !isNaN(v), { message: "not a number" }),
});

/// Auth

export interface Claim {
  // Issuer (default string)
  iss: string;
  // Subject (user_id) (TODO: Technially user_id will be a number but want to move away from user_id so leaving flexibility)
  sub: string;
  // Issued at (epoch second that claim was made)
  iat: number;
  // Expires (epoch second that the claim expires)
  exp: number;
}

// This schema and the Claim interface may not align perfectly. For example,
// right now the userId is a number but claim allows it to be any string.
// Either a new schema will be added to handle any changes to this in the future
// or this schema will just be changed
export const ClaimSchema = z.object({
  iss: z.string(),
  sub: z
    .string()
    .transform((v) => parseInt(v))
    .refine((v) => !isNaN(v), { message: "not a number" }),
  iat: z.number().int().min(0),
  exp: z.number().int().min(0),
});

// Sign-up Route
export const SignUpRequestBody = z.object({
  username: z.string().max(20).min(3),
  password: z.string(),
  is_public: z.boolean(),
});

export interface SignUpSuccessResponse {
  message: string;
}

// Login route
export const LoginRequestBody = z.object({
  username: z.string().max(20).min(3),
  password: z.string(),
});

export interface LoginSuccessResponse {
  message: string;
  jwt: string;
}

// Verify route
export const VerifyRequestBody = z.object({
  token: z.string(),
});

export interface VerifySuccessResponse {
  userId: number;
  expires: number;
  issuedAt: number;
}
