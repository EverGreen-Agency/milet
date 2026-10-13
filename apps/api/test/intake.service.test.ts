import assert from "node:assert/strict";
import test from "node:test";
import type { AppConfig } from "../src/config/app-config";
import { IntakeService } from "../src/intake/intake.service";
import type { ExternalFetch, IntakeRequest } from "../src/intake/intake.types";

const config: AppConfig = {
  nodeEnv: "test", port: 4310, bindAddress: "127.0.0.1", databaseMode: "fake", demoDataOnly: false,
  corsOrigins: ["http://127.0.0.1:4173"], intakeEnabled: true, geminiApiKey: "gemini-test-key", geminiModel: "gemini-test-model",
  resendApiKey: "resend-test-key", resendFrom: "Milet <no-reply@example.com>", intakeNotificationTo: "owner@example.com",
};

const input: IntakeRequest = {
  submissionId: "9b9a5b23-13df-4f34-b53e-6bf840be6e76", profile: "company", name: "Ana", email: "ana@example.com", city: "Campinas", state: "SP",
  distributor: "CPFL", consumptionKwh: "1200", objective: "Quero entender quais dados reunir.", companyName: "Exemplo Ltda",
  optInContact: true, consentDataProcessing: true,
};

test("intake sends structured Gemini request then an idempotent Resend notification", async () => {
  const calls: Array<{ url: string; init?: RequestInit }> = [];
  const http: ExternalFetch = { fetch: async (url, init) => {
    calls.push({ url, init });
    if (url.includes("generativelanguage.googleapis.com")) return jsonResponse({ candidates: [{ content: { parts: [{ text: JSON.stringify({ whatWeKnow: ["Consumo informado."], whatToVerify: ["Validar a fatura."], nextAction: "Separar uma fatura recente.", limits: "Não é cotação." }) }] } }] });
    return jsonResponse({ id: "email_123" });
  } };
  const service = new IntakeService(config, http);

  const result = await service.submit(input);

  assert.equal(result.guidance.nextAction, "Separar uma fatura recente.");
  assert.equal(calls.length, 2);
  assert.match(calls[0]!.url, /gemini-test-model:generateContent$/);
  assert.equal(new Headers(calls[0]!.init!.headers).get("x-goog-api-key"), "gemini-test-key");
  assert.equal(calls[1]!.url, "https://api.resend.com/emails");
  assert.equal(new Headers(calls[1]!.init!.headers).get("idempotency-key"), `milet-intake/${input.submissionId}`);
  assert.match(String(calls[1]!.init!.body), /ana@example\.com/);
});

test("intake rejects missing explicit consent before any external request", async () => {
  const http: ExternalFetch = { fetch: async () => { throw new Error("must not be called"); } };
  const service = new IntakeService(config, http);
  await assert.rejects(() => service.submit({ ...input, consentDataProcessing: false }), /consentimentos/);
});

function jsonResponse(body: unknown): Response {
  return new Response(JSON.stringify(body), { status: 200, headers: { "content-type": "application/json" } });
}
