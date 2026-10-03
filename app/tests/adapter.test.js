import test from "node:test";
import assert from "node:assert/strict";
import { DemoEnergyAdapter } from "../src/demo-adapter.js";

test("demo adapter returns a defensive copy", async () => {
  const adapter = new DemoEnergyAdapter();
  const first = await adapter.getCase(); first.organization.name = "Alterada";
  const second = await adapter.getCase();
  assert.equal(second.organization.name, "Padaria Horizonte");
});

test("unsupported invoice format has a user-facing error", async () => {
  const adapter = new DemoEnergyAdapter();
  await assert.rejects(() => adapter.extractInvoice({ name: "conta.txt" }), /Formato não aceito/);
});
