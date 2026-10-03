import assert from "node:assert/strict";
import test from "node:test";
import { loadConfig } from "../src/config/app-config";

test("configuration rejects postgres mode without DATABASE_URL", () => {
  assert.throws(() => loadConfig({ DATABASE_MODE: "postgres", DEMO_DATA_ONLY: "true" }), /DATABASE_URL/);
});

test("configuration keeps real invoice intake disabled", () => {
  assert.throws(() => loadConfig({ DATABASE_MODE: "fake", DEMO_DATA_ONLY: "false" }), /faturas reais/);
});
