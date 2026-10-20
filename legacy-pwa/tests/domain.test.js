import test from "node:test";
import assert from "node:assert/strict";
import { calculateBaseline, rankProposals, validateInvoice, STORY_IDS } from "../src/domain.js";
import { demoCase } from "../src/fixtures.js";

test("baseline includes every declared cost component", () => {
  assert.equal(calculateBaseline(demoCase.baseline.components), 10920);
});

test("proposal ranking uses all-in cost and shared baseline", () => {
  const ranked = rankProposals(demoCase.proposals, 10920);
  assert.equal(ranked[0].id, "PROP-ALVORADA-01");
  assert.equal(ranked[0].total, 9720);
  assert.equal(ranked[0].monthlySaving, 1200);
  assert.equal(ranked[1].total, 9940);
  assert.equal(ranked[1].costs.financing, 420);
});

test("required invoice gaps are explicit", () => {
  assert.deepEqual(Object.keys(validateInvoice({ period: "", consumptionKwh: 0, total: 0 })), ["consumptionKwh", "total", "period"]);
});

test("requested story identifiers remain traceable", () => {
  assert.deepEqual(STORY_IDS, ["US-001", "US-002", "US-003", "US-006", "US-007", "US-008", "US-009", "US-013"]);
});
