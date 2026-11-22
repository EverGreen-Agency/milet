import assert from "node:assert/strict";
import test from "node:test";
import {
  isValidSubmarket,
  isValidUserRole,
  PORTAL_ROLES,
  PORTAL_SUBMARKETS,
  validateGenerationAssetInput
} from "../src/portals";

test("validates portal roles and CCEE submarkets strictly", () => {
  for (const role of PORTAL_ROLES) {
    assert.equal(isValidUserRole(role), true);
  }
  assert.equal(isValidUserRole("CORRETOR"), false);
  assert.equal(isValidUserRole(123), false);

  for (const submarket of PORTAL_SUBMARKETS) {
    assert.equal(isValidSubmarket(submarket), true);
  }
  assert.equal(isValidSubmarket("CENTRO"), false);
  assert.equal(isValidSubmarket(null), false);
});

test("validates generation asset payloads and returns localized diagnostics", () => {
  assert.deepEqual(
    validateGenerationAssetInput({
      name: "UFV Cerrado I",
      distributor: "Cemig",
      submarket: "SE/CO",
      capacityKw: 500,
      availableKwhMonth: 45000
    }),
    []
  );

  const errors = validateGenerationAssetInput({
    name: " ",
    distributor: "A",
    submarket: "INVALID" as never,
    capacityKw: 0,
    availableKwhMonth: -1
  });
  assert.equal(errors.length, 5);
});
