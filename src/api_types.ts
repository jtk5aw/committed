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

/// Auth

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
