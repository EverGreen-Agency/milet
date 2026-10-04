import { randomUUID } from "node:crypto";
import type { IncomingMessage, ServerResponse } from "node:http";
import { isValidTenantId, isValidUserId } from "@milet/domain";
import { DEMO_IDS, syntheticCase } from "@milet/test-fixtures";

type VercelRequest = IncomingMessage & {
  query?: Record<string, string | string[] | undefined>;
};

const SAFE_CORRELATION_ID = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/;

function firstHeader(value: string | readonly string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function caseIdFrom(request: VercelRequest): string {
  const queryValue = request.query?.caseId;
  if (typeof queryValue === "string") return queryValue;
  if (Array.isArray(queryValue)) return queryValue[0] ?? "";
  const pathname = new URL(request.url ?? "/", "http://milet.local").pathname;
  try {
    return decodeURIComponent(pathname.split("/").filter(Boolean).at(-1) ?? "");
  } catch {
    return "";
  }
}

function sendJson(response: ServerResponse, statusCode: number, body: unknown): void {
  response.statusCode = statusCode;
  response.setHeader("content-type", "application/json; charset=utf-8");
  response.end(JSON.stringify(body));
}

export function handleSyntheticCase(request: VercelRequest, response: ServerResponse): void {
  response.setHeader("x-content-type-options", "nosniff");
  response.setHeader("cross-origin-resource-policy", "same-origin");
  response.setHeader("x-milet-data-classification", "synthetic_demo_only");
  response.setHeader("cache-control", "private, no-store");

  const correlationCandidate = firstHeader(request.headers["x-correlation-id"]);
  const correlationId = correlationCandidate && SAFE_CORRELATION_ID.test(correlationCandidate)
    ? correlationCandidate
    : randomUUID();
  response.setHeader("x-correlation-id", correlationId);

  if (request.method !== "GET") {
    response.setHeader("allow", "GET");
    return sendJson(response, 405, { statusCode: 405, message: "método não permitido" });
  }

  const organizationId = firstHeader(request.headers["x-organization-id"]);
  const userId = firstHeader(request.headers["x-user-id"]);
  if (!organizationId || !userId) {
    return sendJson(response, 400, { statusCode: 400, message: "x-organization-id e x-user-id são obrigatórios" });
  }
  if (!isValidTenantId(organizationId) || !isValidUserId(userId)) {
    return sendJson(response, 400, { statusCode: 400, message: "tenant ou usuário em formato inválido" });
  }
  if (organizationId !== DEMO_IDS.organizationPublicId || userId !== DEMO_IDS.userPublicId) {
    return sendJson(response, 403, { statusCode: 403, message: "acesso ao tenant sintético negado" });
  }
  if (caseIdFrom(request) !== DEMO_IDS.caseId) {
    return sendJson(response, 404, { statusCode: 404, message: "caso sintético não encontrado" });
  }

  return sendJson(response, 200, structuredClone(syntheticCase));
}

export default handleSyntheticCase;
