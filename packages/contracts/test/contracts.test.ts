import assert from "node:assert/strict";
import test from "node:test";
import { access, readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { syntheticCase } from "@milet/test-fixtures";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");

async function readJson(path: string): Promise<Record<string, any>> {
  return JSON.parse(await readFile(join(root, path), "utf8")) as Record<string, any>;
}

test("versioned OpenAPI exposes health, readiness and tenant-scoped synthetic case", async () => {
  const document = await readJson("openapi/v1/openapi.json");
  assert.equal(document.openapi, "3.1.0");
  assert.equal(document.info.version, "1.0.0");
  assert.ok(document.paths["/health/live"].get);
  assert.ok(document.paths["/health/ready"].get);
  const operation = document.paths["/v1/cases/{caseId}"].get;
  assert.equal(operation.operationId, "getSyntheticCase");
  const references = JSON.stringify(document).match(/\.\.\/\.\.\/schemas\/v1\/[^"]+/g) ?? [];
  assert.ok(references.length >= 3);
  for (const reference of references) await access(resolve(root, "openapi/v1", reference));
  for (const header of ["x-organization-id", "x-user-id"]) {
    assert.match(JSON.stringify(document.components.parameters), new RegExp(header));
  }
});

test("public JSON Schemas are versioned and the fixture keeps the published IDs", async () => {
  const schema = await readJson("schemas/v1/synthetic-case.schema.json");
  assert.equal(schema.$schema, "https://json-schema.org/draft/2020-12/schema");
  assert.match(schema.$id, /\/schemas\/v1\/synthetic-case\.schema\.json$/);
  for (const required of schema.required as string[]) {
    assert.ok(Object.hasOwn(syntheticCase, required), `fixture missing ${required}`);
  }
  assert.match(syntheticCase.organization.publicId, new RegExp(schema.$defs.organization.allOf[1].properties.publicId.pattern));
  assert.match(syntheticCase.consumerUnit.publicId, new RegExp(schema.$defs.consumerUnit.allOf[1].properties.publicId.pattern));
  assert.match(syntheticCase.invoice.publicId, new RegExp(schema.$defs.invoice.allOf[1].properties.publicId.pattern));
  assert.deepEqual(
    [syntheticCase.organization.publicId, syntheticCase.consumerUnit.publicId, syntheticCase.invoice.publicId],
    ["ORG-0007", "UC-MG-00482", "INV-2026-08-00482"],
  );
  assert.equal(syntheticCase.classification, schema.properties.classification.const);
  for (const name of ["health-live", "readiness", "audit-event", "outbox-event"]) {
    const versioned = await readJson(`schemas/v1/${name}.schema.json`);
    assert.match(versioned.$id, /\/schemas\/v1\//);
    assert.equal(versioned.type, "object");
  }
});
