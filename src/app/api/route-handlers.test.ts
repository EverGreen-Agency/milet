import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { POST as extractInvoicePost } from "./extract-invoice/route";
import { POST as intakesPost } from "./intakes/route";

describe("Feature: Next.js Route Handlers", () => {
  const originalEnv = { ...process.env };
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
    globalThis.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  describe("Rule: Invoice Extraction API", () => {
    it("Scenario: Reject request without file data with 400 Bad Request", async () => {
      // Given: An empty request payload
      const req = new Request("http://localhost/api/extract-invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({})
      });

      // When: Handled by extract-invoice route
      const res = await extractInvoicePost(req);

      // Then: Status is 400
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.message).toBe("Conteúdo do arquivo ausente.");
    });

    it("Scenario: Reject unsupported MIME type with 400 Bad Request", async () => {
      // Given: An audio file
      const req = new Request("http://localhost/api/extract-invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileData: "dGVzdA==",
          mimeType: "audio/mp3"
        })
      });

      // When: Handled by extract-invoice route
      const res = await extractInvoicePost(req);

      // Then: Status is 400
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.message).toBe("Tipo de arquivo não suportado.");
    });

    it("Scenario: Gracefully uses synthetic fallback when GEMINI_API_KEY is not configured", async () => {
      // Given: No GEMINI_API_KEY
      delete process.env.GEMINI_API_KEY;
      const req = new Request("http://localhost/api/extract-invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileData: "dGVzdA==",
          mimeType: "application/pdf"
        })
      });

      // When: Handled by extract-invoice route
      const res = await extractInvoicePost(req);

      // Then: Returns synthetic fallback
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.source).toBe("synthetic-intake-fallback");
    });

    it("Scenario: Call Gemini API when GEMINI_API_KEY is configured", async () => {

      // Given: GEMINI_API_KEY set and mocked fetch returning valid candidate JSON
      process.env.GEMINI_API_KEY = "test-gemini-key";
      const mockGeminiResponse = {
        candidates: [
          {
            content: {
              parts: [
                {
                  text: JSON.stringify({
                    distributor: "CPFL",
                    period: "2026-08",
                    consumptionKwh: 5000,
                    total: 4500,
                    contractedDemandKw: 30,
                    voltageGroup: "A4",
                    tariffFlag: "Verde"
                  })
                }
              ]
            }
          }
        ]
      };

      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockGeminiResponse
      } as any);

      const req = new Request("http://localhost/api/extract-invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileData: "dGVzdA==",
          mimeType: "application/pdf",
          fileName: "cpfl.pdf"
        })
      });

      // When: Handled by extract-invoice route
      const res = await extractInvoicePost(req);

      // Then: Returns parsed Gemini data
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.source).toBe("gemini-2.5-flash");
      expect(data.extracted.distributor).toBe("CPFL");
    });

    it("Scenario: Fall back when Gemini returns candidates without text", async () => {
      // Given: Gemini returns empty content parts
      process.env.GEMINI_API_KEY = "test-gemini-key";
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ candidates: [] })
      } as any);

      const req = new Request("http://localhost/api/extract-invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileData: "dGVzdA==",
          mimeType: "application/pdf"
        })
      });

      // When: Handled by extract-invoice route
      const res = await extractInvoicePost(req);

      // Then: Fallback is returned
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.source).toBe("synthetic-intake-fallback");
    });

    it("Scenario: Gracefully falls back when Gemini returns error or non-200", async () => {

      // Given: GEMINI_API_KEY set but fetch fails
      process.env.GEMINI_API_KEY = "test-gemini-key";
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 503
      } as any);

      const req = new Request("http://localhost/api/extract-invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileData: "dGVzdA==",
          mimeType: "application/pdf"
        })
      });

      // When: Handled by extract-invoice route
      const res = await extractInvoicePost(req);

      // Then: Fallback is returned
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.source).toBe("synthetic-intake-fallback");
    });

    it("Scenario: Return 500 when JSON body parsing fails", async () => {
      // Given: Invalid malformed JSON request
      const req = {
        json: vi.fn().mockRejectedValue(new Error("Malformed JSON"))
      } as unknown as Request;

      // When: Handled by extract-invoice route
      const res = await extractInvoicePost(req);

      // Then: Status is 500
      expect(res.status).toBe(500);
      const data = await res.json();
      expect(data.message).toBe("Malformed JSON");
    });
    it("Scenario: Return 500 when JSON body parsing fails without error message", async () => {
      // Given: Error without message property
      const req = {
        json: vi.fn().mockRejectedValue({})
      } as unknown as Request;

      // When: Handled by extract-invoice route
      const res = await extractInvoicePost(req);

      // Then: Status is 500 with default fallback message
      expect(res.status).toBe(500);
      const data = await res.json();
      expect(data.message).toBe("Erro no processamento da fatura.");
    });
  });

  describe("Rule: Intakes API", () => {

    it("Scenario: Reject invalid intake with 400 and validation errors", async () => {
      // Given: Missing required fields
      const req = new Request("http://localhost/api/intakes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          consumptionKwh: 0,
          total: 0
        })
      });

      // When: Handled by intakes route
      const res = await intakesPost(req);

      // Then: Status is 400
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.message).toBe("Dados de fatura inválidos.");
      expect(data.errors).toBeDefined();
    });

    it("Scenario: Accept valid intake with 201 Created", async () => {
      // Given: Valid intake payload
      const req = new Request("http://localhost/api/intakes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          consumptionKwh: 12480,
          total: 10920,
          period: "2026-08",
          distributor: "Cemig",
          contractedDemandKw: 75,
          voltageGroup: "A4",
          consentGranted: true
        })
      });

      // When: Handled by intakes route
      const res = await intakesPost(req);

      // Then: Status is 201
      expect(res.status).toBe(201);
      const data = await res.json();
      expect(data.id).toMatch(/^INT-/);
      expect(data.status).toBe("received");
    });

    it("Scenario: Accept valid intake with 201 Created and default voltageGroup using kwh alias", async () => {
      // Given: Valid intake payload with kwh alias
      const req = new Request("http://localhost/api/intakes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kwh: 5000,
          total: 4200,
          period: "2026-08"
        })
      });

      // When: Handled by intakes route
      const res = await intakesPost(req);

      // Then: Status is 201 and voltageGroup defaults to A4
      expect(res.status).toBe(201);
      const data = await res.json();
      expect(data.invoice.voltageGroup).toBe("A4");
      expect(data.invoice.consumptionKwh).toBe(5000);
    });

    it("Scenario: Return 500 when intake body parsing crashes without error message", async () => {
      // Given: Malformed intake request without message
      const req = {
        json: vi.fn().mockRejectedValue({})
      } as unknown as Request;

      // When: Handled by intakes route
      const res = await intakesPost(req);

      // Then: Status is 500 with default fallback message
      expect(res.status).toBe(500);
      const data = await res.json();
      expect(data.message).toBe("Erro interno ao processar intake.");
    });
  });
});

