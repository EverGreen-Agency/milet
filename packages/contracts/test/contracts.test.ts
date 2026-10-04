import assert from "node:assert/strict";
import test from "node:test";
import { access, readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { syntheticCase } from "@milet/test-fixtures";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";

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
  assert.equal(document.servers.length, 1);
  assert.equal(document.servers[0].url, "http://127.0.0.1:4310");
  assert.deepEqual(
    operation.servers.map((server: { url: string }) => server.url),
    ["https://milet.vercel.app/api", "http://127.0.0.1:4310"],
  );
  assert.equal(document.paths["/health/live"].get.servers, undefined);
  assert.equal(document.paths["/health/ready"].get.servers, undefined);
  const references = JSON.stringify(document).match(/\.\.\/\.\.\/schemas\/v1\/[^"]+/g) ?? [];
  assert.ok(references.length >= 3);
  for (const reference of references) await access(resolve(root, "openapi/v1", reference));
  for (const header of ["x-organization-id", "x-user-id"]) {
    assert.match(JSON.stringify(document.components.parameters), new RegExp(header));
  }
  assert.equal(document.components.parameters.CorrelationId.schema.pattern, "^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$");
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
  const ajv = new Ajv2020({ allErrors: true, strict: true, allowUnionTypes: true });
  addFormats(ajv);
  const validate = ajv.compile(schema);
  assert.equal(validate(syntheticCase), true, ajv.errorsText(validate.errors));
  for (const name of ["health-live", "readiness", "audit-event", "outbox-event"]) {
    const versioned = await readJson(`schemas/v1/${name}.schema.json`);
    assert.match(versioned.$id, /\/schemas\/v1\//);
    assert.equal(versioned.type, "object");
  }
});

test("public build contains OpenAPI and every referenced JSON Schema", async () => {
  const document = await readJson("openapi/v1/openapi.json");
  const operations = Object.values(document.paths).flatMap((pathItem: any) =>
    Object.values(pathItem).filter((operation: any) => operation && typeof operation === "object"),
  );
  const operationIds = operations.map((operation: any) => operation.operationId).filter(Boolean);
  assert.equal(new Set(operationIds).size, operationIds.length, "operationId duplicado");
  const references = JSON.stringify(document).match(/\.\.\/\.\.\/schemas\/v1\/[^\"]+/g) ?? [];
  assert.ok(references.length >= 3);
  for (const reference of references) await access(resolve(root, "openapi/v1", reference));
});
