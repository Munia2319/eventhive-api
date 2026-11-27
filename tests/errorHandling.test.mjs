import assert from "node:assert/strict";
import express from "express";
import { createRequire } from "node:module";
import test from "node:test";
import { z } from "zod";

const require = createRequire(import.meta.url);
const { AppError } = require("../src/errors/app_error.ts");
const { globalErrorHandler } = require("../src/middlewares/globalErrorHandler.ts");
const validateRequestModule = require("../src/middlewares/validateRequest.ts");

const validateRequest = validateRequestModule.default;

function createTestApp() {
  const app = express();
  app.use(express.json());

  app.post(
    "/validation",
    validateRequest(z.object({ tickets_booked: z.number().int().min(1) })),
    (_req, res) => res.status(200).json({ success: true })
  );

  app.get("/conflict", (_req, _res, next) => {
    next(new AppError(409, "Already exists"));
  });

  app.get("/unexpected", (_req, _res, next) => {
    next(new Error("private database detail"));
  });

  app.use(globalErrorHandler);
  return app;
}

async function startServer(app) {
  const server = app.listen(0);

  await new Promise((resolve, reject) => {
    server.once("listening", resolve);
    server.once("error", reject);
  });

  return server;
}

test("Zod errors use the required validation error response shape", async (context) => {
  const server = await startServer(createTestApp());
  context.after(() => server.close());

  const address = server.address();
  assert.ok(address && typeof address === "object");

  const response = await fetch(`http://127.0.0.1:${address.port}/validation`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ tickets_booked: 0 }),
  });
  const body = await response.json();

  assert.equal(response.status, 400);
  assert.equal(body.success, false);
  assert.equal(body.message, "Validation Error");
  assert.equal(body.errors[0].field, "tickets_booked");
  assert.equal(typeof body.errors[0].message, "string");
});

test("malformed JSON returns 400 without exposing parser details", async (context) => {
  const server = await startServer(createTestApp());
  context.after(() => server.close());

  const address = server.address();
  assert.ok(address && typeof address === "object");

  const response = await fetch(`http://127.0.0.1:${address.port}/validation`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: "{invalid",
  });
  const body = await response.json();

  assert.equal(response.status, 400);
  assert.equal(body.success, false);
  assert.equal(body.message, "Invalid JSON request body");
});

test("unexpected errors return a generic 500 response", async (context) => {
  const server = await startServer(createTestApp());
  context.after(() => server.close());

  const address = server.address();
  assert.ok(address && typeof address === "object");

  const originalConsoleError = console.error;
  const loggedErrors = [];
  console.error = (...args) => loggedErrors.push(args);

  try {
    const response = await fetch(`http://127.0.0.1:${address.port}/unexpected`);
    const body = await response.json();

    assert.equal(response.status, 500);
    assert.equal(body.message, "Internal Server Error");
    assert.equal(JSON.stringify(body).includes("private database detail"), false);
    assert.equal(loggedErrors.length, 1);
  } finally {
    console.error = originalConsoleError;
  }
});

test("AppError preserves its status and safe message", async (context) => {
  const server = await startServer(createTestApp());
  context.after(() => server.close());

  const address = server.address();
  assert.ok(address && typeof address === "object");

  const response = await fetch(`http://127.0.0.1:${address.port}/conflict`);
  const body = await response.json();

  assert.equal(response.status, 409);
  assert.equal(body.success, false);
  assert.equal(body.message, "Already exists");
});
