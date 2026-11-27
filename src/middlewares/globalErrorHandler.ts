
import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";

import { AppError } from "../errors/app_error";
import sendResponse, { type FieldError } from "../utils/sendResponse";

function isMalformedJsonError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "type" in error &&
    error.type === "entity.parse.failed"
  );
}

//! Centralized error handler
export const globalErrorHandler: ErrorRequestHandler = (
  err,
  _req,
  res,
  _next
) => {
  let statusCode = 500;
  let message = "Internal Server Error";
  let errors: FieldError[] | undefined;
  let isUnexpectedError = true;

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    isUnexpectedError = false;
  } else if (err instanceof ZodError) {
    statusCode = 400;
    message = "Validation Error";
    errors = err.issues.map((issue) => ({
      field: issue.path.map(String).join(".") || "body",
      message: issue.message,
    }));
    isUnexpectedError = false;
  } else if (isMalformedJsonError(err)) {
    statusCode = 400;
    message = "Invalid JSON request body";
    isUnexpectedError = false;
  }

  if (isUnexpectedError) {
    console.error(err);
  }

  return sendResponse(res, {
    statusCode,
    success: false,
    message,
    ...(errors ? { errors } : {}),
  });
};
