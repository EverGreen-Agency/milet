import test from "node:test";
import assert from "node:assert/strict";
import { DemoEnergyAdapter } from "../src/demo-adapter.js";

test("demo adapter returns a defensive copy", async () => {
  const adapter = new DemoEnergyAdapter({ artificialDelayMs: 0 });
  const first = await adapter.getCase(); first.organization.name = "Alterada";
  const second = await adapter.getCase();
  assert.equal(second.organization.name, "Padaria Horizonte");
  assert.equal(second.runtime.mode, "fixture");
});

test("unsupported invoice format has a user-facing error", async () => {
  const adapter = new DemoEnergyAdapter();
  await assert.rejects(() => adapter.extractInvoice({ name: "conta.txt" }), /Formato não aceito/);
});

test("configured API reads and maps only the synthetic case contract", async () => {
  let requestedUrl = "";
  const adapter = new DemoEnergyAdapter({
    apiBaseUrl: "https://api.example.test/",
    artificialDelayMs: 0,
    fetchImpl: async (url, init) => {
      requestedUrl = url;
      assert.equal(init.headers["x-organization-id"], "ORG-0007");
      assert.equal(init.headers["x-user-id"], "USR-DEMO-0001");
      return {
        ok: true,
        async json() {
          return {
            classification: "synthetic_demo_only",
            caseId: "CASE-UC-MG-00482",
            organization: { publicId: "ORG-0007", legalName: "Padaria API" },
            consumerUnit: { publicId: "UC-MG-00482", voltageGroup: "A4", distributor: "Cemig" },
            invoice: { publicId: "INV-2026-08-00482", period: "2026-08" },
            baseline: { totalCents: 1092000, periodStart: "2025-09-01", periodEnd: "2026-08-31", assumptions: ["sintético"] },
          };
        },
      };
    },
  });
  const result = await adapter.getCase();
  assert.equal(requestedUrl, "https://api.example.test/v1/cases/CASE-UC-MG-00482");
  assert.equal(result.organization.name, "Padaria API");
  assert.equal(result.runtime.mode, "api");
  assert.deepEqual(result.baseline.components, { apiBaseline: 10920 });
});

test("API failure has explicit local fixture fallback", async () => {
  const adapter = new DemoEnergyAdapter({
    apiBaseUrl: "https://api.example.test",
    artificialDelayMs: 0,
    fetchImpl: async () => { throw new TypeError("network details must not reach UI"); },
  });
  const result = await adapter.getCase();
  assert.equal(result.runtime.mode, "fixture_fallback");
  assert.match(result.runtime.message, /Fallback explícito/);
  assert.doesNotMatch(result.runtime.message, /network details/);
});

test("API timeout aborts and falls back to the local fixture", async () => {
  const adapter = new DemoEnergyAdapter({
    apiBaseUrl: "https://api.example.test",
    timeoutMs: 5,
    artificialDelayMs: 0,
    fetchImpl: async (_url, init) => new Promise((_resolve, reject) => {
      init.signal.addEventListener("abort", () => reject(Object.assign(new Error("aborted"), { name: "AbortError" })), { once: true });
    }),
  });
  const result = await adapter.getCase();
  assert.equal(result.runtime.mode, "fixture_fallback");
  assert.match(result.runtime.message, /tempo limite/);
});
