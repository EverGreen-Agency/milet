import assert from "node:assert/strict";
import test from "node:test";
import type { IncomingHttpHeaders, ServerResponse } from "node:http";
import { handleSyntheticCase } from "../../../api/v1/cases/[caseId]";
import { DEMO_IDS, syntheticCase } from "@milet/test-fixtures";

class ResponseDouble {
  statusCode = 200;
  readonly headers = new Map<string, string>();
  body = "";

  setHeader(name: string, value: number | string | readonly string[]): this {
    this.headers.set(name.toLowerCase(), Array.isArray(value) ? value.join(", ") : String(value));
    return this;
  }

  end(chunk?: string): this {
    this.body = chunk ?? "";
    return this;
  }
}

function invoke({
  method = "GET",
  caseId = DEMO_IDS.caseId,
  headers = {},
}: {
  method?: string;
  caseId?: string;
  headers?: IncomingHttpHeaders;
} = {}) {
  const response = new ResponseDouble();
  handleSyntheticCase(
    {
      method,
      url: `/api/v1/cases/${caseId}`,
      headers: {
        "x-organization-id": DEMO_IDS.organizationPublicId,
        "x-user-id": DEMO_IDS.userPublicId,
        ...headers,
      },
      query: { caseId },
    } as never,
    response as unknown as ServerResponse,
  );
  return { response, json: JSON.parse(response.body) as Record<string, unknown> };
}

test("public Vercel function serves exactly the canonical synthetic contract", () => {
  const { response, json } = invoke({ headers: { "x-correlation-id": "stage4-test" } });
  assert.equal(response.statusCode, 200);
  assert.deepEqual(json, syntheticCase);
  assert.equal(response.headers.get("x-correlation-id"), "stage4-test");
  assert.equal(response.headers.get("x-milet-data-classification"), "synthetic_demo_only");
  assert.equal(response.headers.get("cross-origin-resource-policy"), "same-origin");
  assert.equal(response.headers.get("cache-control"), "private, no-store");
});

test("public Vercel function preserves tenant-shaped synthetic boundaries", () => {
  assert.equal(invoke({ headers: { "x-organization-id": "" } }).response.statusCode, 400);
  assert.equal(invoke({ headers: { "x-organization-id": "invalid" } }).response.statusCode, 400);
  assert.equal(invoke({ headers: { "x-user-id": "USR-DEMO-9999" } }).response.statusCode, 403);
  assert.equal(invoke({ caseId: "CASE-UNKNOWN" }).response.statusCode, 404);
  assert.equal(invoke({ method: "POST" }).response.statusCode, 405);
});

test("invalid correlation identifiers are replaced without leaking request details", () => {
  const { response, json } = invoke({ headers: { "x-correlation-id": "invalid correlation" } });
  assert.match(response.headers.get("x-correlation-id") ?? "", /^[0-9a-f-]{36}$/);
  assert.equal(json.classification, "synthetic_demo_only");
});

test("malformed encoded paths fail closed instead of raising a server error", () => {
  const response = new ResponseDouble();
  handleSyntheticCase(
    {
      method: "GET",
      url: "/api/v1/cases/%E0%A4%A",
      headers: {
        "x-organization-id": DEMO_IDS.organizationPublicId,
        "x-user-id": DEMO_IDS.userPublicId,
      },
    } as never,
    response as unknown as ServerResponse,
  );
  assert.equal(response.statusCode, 404);
  assert.equal(JSON.parse(response.body).message, "caso sintético não encontrado");
});
