import type { Response } from "express";

export interface FieldError {
  field: string;
  message: string;
}

export interface SuccessResponsePayload<T = unknown> {
  statusCode: number;
  success: true;
  message: string;
  data?: T;
}

export interface ErrorResponsePayload {
  statusCode: number;
  success: false;
  message: string;
  errors?: FieldError[];
}

export default function sendResponse(
  res: Response,
  payload: SuccessResponsePayload | ErrorResponsePayload
): Response {
  if (payload.success) {
    const body: {
      success: true;
      message: string;
      data?: unknown;
    } = {
      success: true,
      message: payload.message,
    };

    if (payload.data !== undefined) {
      body.data = payload.data;
    }

    return res.status(payload.statusCode).json(body);
  }

  const body: {
    success: false;
    message: string;
    errors?: FieldError[];
  } = {
    success: false,
    message: payload.message,
  };

  if (payload.errors !== undefined && payload.errors.length > 0) {
    body.errors = payload.errors;
  }

  return res.status(payload.statusCode).json(body);
}