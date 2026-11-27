
import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";

import { AppError } from "../errors/app_error";
import sendResponse from "../utils/sendResponse";

//! Centralized error handler
export const globalErrorHandler: ErrorRequestHandler = (
  err,
  req,
  res,
  next
) => {

  //! Default response for unexpected errors
  let statusCode = 500;
  let message = "Internal Server Error";
  let errorDetails: unknown;

  //! 1. Handle our custom application errors
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  //! 2. Handle Zod validation errors
  else if (err instanceof ZodError) {
    statusCode = 400;
    message = "Validation failed";
    errorDetails = err.issues;
  }

  //! Log the actual error for debugging
  console.error(err);

  //! Send a consistent response to the client
  return sendResponse(res, {
    statusCode,
    success: false,
    message,
    error: errorDetails,
  });
};
