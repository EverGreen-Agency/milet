import assert from "node:assert/strict";
import test from "node:test";
import { processIntake } from "./intakes.js";

const environment = {
  INTAKE_ENABLED: "true", DEMO_DATA_ONLY: "false", GEMINI_API_KEY: "gemini-test-key", GEMINI_MODEL: "gemini-test-model",
  RESEND_API_KEY: "resend-test-key", RESEND_FROM: "Milet <milet@example.com>", RESEND_REPLY_TO: "owner@example.com", INTAKE_NOTIFICATION_TO: "owner@example.com",
};
const input = { submissionId: "9b9a5b23-13df-4f34-b53e-6bf840be6e76", profile: "home", name: "Ana", email: "ana@example.com", city: "Campinas", state: "SP", distributor: "CPFL", consumptionKwh: "300", objective: "Quero entender a conta.", optInContact: true, consentDataProcessing: true };

test("Vercel intake keeps providers server-side and sends both e-mails", async () => {
  const calls = [];
  const httpFetch = async (url, init) => {
    calls.push({ url, init });
    if (url.includes("generativelanguage.googleapis.com")) return json({ candidates: [{ content: { parts: [{ text: JSON.stringify({ whatWeKnow: ["Consumo informado."], whatToVerify: ["Validar fatura."], nextAction: "Separar uma fatura.", limits: "Não é cotação." }) }] } }] });
    return json({ id: "email_123" });
  };
  const result = await processIntake(input, environment, httpFetch);
  assert.equal(result.acknowledgementSent, true);
  assert.equal(calls.length, 3);
  assert.equal(new Headers(calls[1].init.headers).get("idempotency-key"), `milet-intake/${input.submissionId}`);
  assert.equal(new Headers(calls[2].init.headers).get("idempotency-key"), `milet-intake-ack/${input.submissionId}`);
  assert.doesNotMatch(String(calls[0].init.body), /resend-test-key/);
});

test("Vercel intake fails closed without real-intake flags", async () => {
  await assert.rejects(
    () => processIntake(input, { ...environment, INTAKE_ENABLED: "false" }, async () => { throw new Error("must not run"); }),
    (error) => error?.status === 503 && /não está configurado/.test(error.message),
  );
});

function json(body) { return new Response(JSON.stringify(body), { status: 200, headers: { "content-type": "application/json" } }); }
