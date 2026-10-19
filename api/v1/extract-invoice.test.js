import assert from "node:assert/strict";
import test from "node:test";
import { processInvoiceExtraction } from "./extract-invoice.js";

const environment = {
  INTAKE_ENABLED: "true",
  DEMO_DATA_ONLY: "false",
  GEMINI_API_KEY: "gemini-test-key",
  GEMINI_MODEL: "gemini-2.5-flash-lite",
  S3_ENDPOINT: "https://iad.railway.app",
  S3_REGION: "iad",
  S3_BUCKET: "milet-invoices",
  S3_ACCESS_KEY_ID: "mock-access-key",
  S3_SECRET_ACCESS_KEY: "mock-secret-key"
};

const validPayload = {
  fileBase64: Buffer.from("mock pdf content").toString("base64"),
  mimeType: "application/pdf",
  fileName: "fatura-cemig-teste.pdf"
};

test("processInvoiceExtraction parses invoice via Gemini multimodal and archives to S3", async () => {
  const calls = [];
  const httpFetch = async (url, init) => {
    calls.push({ url, init });
    if (url.includes("generativelanguage.googleapis.com")) {
      const mockResult = {
        distributor: "CEMIG",
        customerName: "Padaria Modelo Ltda",
        documentNumber: "12.345.678/0001-90",
        installationNumber: "3001234567",
        city: "Belo Horizonte",
        state: "MG",
        postalCode: "30140-071",
        voltageGroup: "A4",
        tariffModality: "Verde",
        contractedDemandKw: 75,
        measuredDemandKw: 68.4,
        consumptionKwh: 12450,
        totalAmount: 10920.50,
        dueDate: "2026-11-15",
        confidence: {
          overall: 0.96,
          fields: { distributor: 0.99, consumptionKwh: 0.98, totalAmount: 0.97 }
        }
      };
      return new Response(JSON.stringify({
        candidates: [{
          content: { parts: [{ text: JSON.stringify(mockResult) }] }
        }]
      }), { status: 200, headers: { "content-type": "application/json" } });
    }
    // S3 Mock response
    return new Response(null, { status: 200 });
  };

  const result = await processInvoiceExtraction(validPayload, environment, httpFetch);
  
  assert.equal(result.data.distributor, "CEMIG");
  assert.equal(result.data.consumptionKwh, 12450);
  assert.equal(result.data.voltageGroup, "A4");
  assert.equal(result.data.totalAmount, 10920.50);
  assert.ok(result.fileKey.startsWith("invoices/"));
  assert.equal(calls.length, 2); // 1 S3 upload + 1 Gemini API call
  assert.ok(calls[0].url.includes("milet-invoices"));
  assert.ok(calls[1].url.includes("generativelanguage.googleapis.com"));
});

test("processInvoiceExtraction rejects invalid mime types or missing files", async () => {
  await assert.rejects(
    () => processInvoiceExtraction({ fileBase64: "", mimeType: "text/plain" }, environment, async () => {}),
    (err) => err?.status === 400
  );
});
