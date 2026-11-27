import assert from "node:assert/strict";
import test from "node:test";

process.env.PORT ||= "5000";
process.env.DATABASE_URL ||= "postgresql://postgres:password@localhost:5432/event_hive";
process.env.JWT_SECRET ||= "test-jwt-secret";
process.env.JWT_EXPIRES_IN ||= "7d";

test("GET / returns a successful root response", async (context) => {
  const appModule = await import("../src/app.ts");
  const app = appModule.default?.default ?? appModule.default;
  const server = app.listen(0);

  context.after(() => server.close());

  await new Promise((resolve, reject) => {
    server.once("listening", resolve);
    server.once("error", reject);
  });

  const address = server.address();
  assert.ok(address && typeof address === "object");

  const response = await fetch(`http://127.0.0.1:${address.port}/`);
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.equal(body.success, true);
});
