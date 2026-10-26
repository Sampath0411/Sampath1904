import test from "node:test";
import assert from "node:assert/strict";
import { resolveAdminCredentials } from "../lib/auth-config.js";

test("production admin refuses missing or incomplete credentials", () => {
  assert.deepEqual(resolveAdminCredentials({ NODE_ENV: "production" }), { configured: false, password: "", secret: "" });
  assert.equal(resolveAdminCredentials({ NODE_ENV: "production", ADMIN_PASSWORD: "real-password" }).configured, false);
  assert.equal(resolveAdminCredentials({ NODE_ENV: "production", AUTH_SECRET: "real-secret" }).configured, false);
});

test("production admin uses only explicit password and secret values", () => {
  const password = "a-strong-password-123";
  const secret = "random-secret-with-at-least-32-characters";
  const config = resolveAdminCredentials({ NODE_ENV: "production", ADMIN_PASSWORD: password, AUTH_SECRET: secret });
  assert.deepEqual(config, { configured: true, password, secret });
});

test("production rejects credentials that are too short", () => {
  assert.equal(resolveAdminCredentials({ NODE_ENV: "production", ADMIN_PASSWORD: "short", AUTH_SECRET: "tiny" }).configured, false);
});

test("development retains documented local defaults when environment values are absent", () => {
  const config = resolveAdminCredentials({ NODE_ENV: "development" });
  assert.equal(config.configured, true);
  assert.equal(config.password, "admin123");
  assert.equal(config.secret, "portfolio-dev-secret-change-me");
});
