import assert from "node:assert/strict";
import test from "node:test";
import { loadConfig } from "../src/config/app-config";

test("configuration rejects postgres mode without DATABASE_URL", () => {
  assert.throws(() => loadConfig({ DATABASE_MODE: "postgres", DEMO_DATA_ONLY: "true" }), /DATABASE_URL/);
});

test("configuration keeps real invoice intake disabled", () => {
  assert.throws(() => loadConfig({ DATABASE_MODE: "fake", DEMO_DATA_ONLY: "false" }), /faturas reais/);
});

test("configuration applies safe local CORS defaults and exact allowlist parsing", () => {
  const local = loadConfig({ NODE_ENV: "development", DATABASE_MODE: "fake", DEMO_DATA_ONLY: "true" });
  assert.deepEqual(local.corsOrigins, ["http://127.0.0.1:4173", "http://localhost:4173"]);
  assert.equal(local.bindAddress, "127.0.0.1");

  const production = loadConfig({ NODE_ENV: "production", DATABASE_MODE: "fake", DEMO_DATA_ONLY: "true" });
  assert.deepEqual(production.corsOrigins, []);

  const configured = loadConfig({
    NODE_ENV: "production", DATABASE_MODE: "fake", DEMO_DATA_ONLY: "true",
    CORS_ORIGINS: "https://milet.example,https://ops.example",
  });
  assert.deepEqual(configured.corsOrigins, ["https://milet.example", "https://ops.example"]);
  assert.throws(() => loadConfig({ NODE_ENV: "production", DATABASE_MODE: "fake", DEMO_DATA_ONLY: "true", CORS_ORIGINS: "https://milet.example/path" }), /origens exatas/);
});
