import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { POST as extractInvoicePost } from "./extract-invoice/route";
import {
  escapeHtml,
  POST as intakesPost,
  resetIntakeRateLimitForTest
} from "./intakes/route";
import {
  DELETE as portalSessionDelete,
  GET as portalSessionGet,
  POST as portalSessionPost
} from "./portal/session/route";
import {
  GET as experimentsGet,
  POST as experimentsPost
} from "./experiments/route";
import { PORTAL_SESSION_COOKIE } from "@/lib/portal-auth";
import { resetExperimentEventsForTest } from "@/lib/experiment-event-store";

describe("Feature: Next.js Route Handlers", () => {
  const originalEnv = { ...process.env };
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    process.env = { ...originalEnv };
    resetExperimentEventsForTest();
    resetIntakeRateLimitForTest();
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

    it("Scenario: Reject oversized base64 payload with 413 Payload Too Large", async () => {
      const req = new Request("http://localhost/api/extract-invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileBase64: "a".repeat(4_200_001)
        })
      });

      const res = await extractInvoicePost(req);
      expect(res.status).toBe(413);
      const data = await res.json();
      expect(data.message).toBe("Arquivo excede o limite seguro de 3 MB.");
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
      expect(data.isFallback).toBe(true);
      expect(data.extracted.tariffFlag).toBe("Amarela");
      expect(data.extracted.tariffModality).toBe("Horossazonal Verde");
      expect(data.extracted.confidence).toBe(0.98);
    });

    it("Scenario: Call Gemini API when GEMINI_API_KEY is configured", async () => {

      // Given: GEMINI_API_KEY set and mocked fetch returning valid candidate JSON
      delete process.env.GEMINI_MODEL;
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

      const fetchMock = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockGeminiResponse
      } as any);
      globalThis.fetch = fetchMock;

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

      // Then: Returns parsed Gemini data via x-goog-api-key header
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.source).toBe("gemini-3.5-flash-lite");
      expect(data.isFallback).toBe(false);
      expect(data.extracted.distributor).toBe("CPFL");
      const [, fetchInit] = fetchMock.mock.calls[0]!;
      expect((fetchInit.headers as Record<string, string>)["x-goog-api-key"]).toBe("test-gemini-key");
    });

    it("Scenario: Fall back when Gemini returns candidates without text", async () => {
      // Given: Gemini returns empty content parts and custom GEMINI_MODEL override
      process.env.GEMINI_API_KEY = "test-gemini-key";
      process.env.GEMINI_MODEL = "gemini-3.8-flash";
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

    it("Scenario: Escape HTML entities and reject missing LGPD consent in demo and real modes", async () => {
      expect(escapeHtml(`<a href="x" data-x='1'>&</a>`)).toBe(
        "&lt;a href=&quot;x&quot; data-x=&#39;1&#39;&gt;&amp;&lt;/a&gt;"
      );

      const deniedDemo = await intakesPost(
        new Request("http://localhost/api/intakes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            consumptionKwh: 12480,
            total: 10920,
            period: "2026-08",
            consentGranted: false
          })
        })
      );
      expect(deniedDemo.status).toBe(400);

      process.env.INTAKE_ENABLED = "true";
      process.env.DEMO_DATA_ONLY = "true";
      const sanitizedRes = await intakesPost(
        new Request("http://localhost/api/intakes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            consumptionKwh: 12480,
            total: 10920,
            period: "2026-08",
            distributor: "<script>Cemig</script>",
            voltageGroup: "A4",
            tariffFlag: "Amarela",
            tariffModality: "Verde"
          })
        })
      );
      expect(sanitizedRes.status).toBe(201);
      const sanitizedData = await sanitizedRes.json();
      expect(sanitizedData.invoice.distributor).toBe("&lt;script&gt;Cemig&lt;/script&gt;");

      process.env.DEMO_DATA_ONLY = "false";
      const missingOptIn = await intakesPost(
        new Request("http://localhost/api/intakes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            consumptionKwh: 12480,
            total: 10920,
            period: "2026-08",
            consentGranted: true,
            optInContact: false
          })
        })
      );
      expect(missingOptIn.status).toBe(400);

      const payload = {
        consumptionKwh: 12480,
        total: 10920,
        period: "2026-08",
        consentGranted: true,
        optInContact: true
      };

      const ok1 = await intakesPost(
        new Request("http://localhost/api/intakes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-forwarded-for": "198.51.100.42, 10.0.0.1"
          },
          body: JSON.stringify(payload)
        })
      );
      const ok2 = await intakesPost(
        new Request("http://localhost/api/intakes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-forwarded-for": "198.51.100.42"
          },
          body: JSON.stringify(payload)
        })
      );
      const ok3 = await intakesPost(
        new Request("http://localhost/api/intakes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-forwarded-for": "198.51.100.42"
          },
          body: JSON.stringify(payload)
        })
      );
      const rateLimited = await intakesPost(
        new Request("http://localhost/api/intakes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-forwarded-for": "198.51.100.42"
          },
          body: JSON.stringify(payload)
        })
      );

      expect(ok1.status).toBe(201);
      expect(ok2.status).toBe(201);
      expect(ok3.status).toBe(201);
      expect(rateLimited.status).toBe(429);

      const errCrash = await intakesPost({
        json: vi.fn().mockRejectedValue(new Error("Crash explícito"))
      } as unknown as Request);
      expect(errCrash.status).toBe(500);
      expect((await errCrash.json()).message).toBe("Crash explícito");
    });
  });

  describe("Rule: Portal Session API", () => {
    it("Scenario: Handles GET, POST, and DELETE for portal sessions", async () => {
      const unauthRes = await portalSessionGet(
        new Request("http://localhost/api/portal/session")
      );
      expect(unauthRes.status).toBe(401);

      const badJsonRes = await portalSessionPost({
        json: vi.fn().mockRejectedValue(new Error("bad"))
      } as unknown as Request);
      expect(badJsonRes.status).toBe(400);

      const unknownRoleRes = await portalSessionPost(
        new Request("http://localhost/api/portal/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({})
        })
      );
      expect(unknownRoleRes.status).toBe(400);

      const loginRes = await portalSessionPost(
        new Request("http://localhost/api/portal/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ role: "USINA" })
        })
      );
      expect(loginRes.status).toBe(201);
      const loginBody = await loginRes.json();
      expect(loginBody.redirectTo).toBe("/portal/usinas");
      expect(loginBody.auditHash).toHaveLength(64);
      const setCookie = loginRes.headers.get("set-cookie") ?? "";
      expect(setCookie).toContain(`${PORTAL_SESSION_COOKIE}=`);
      expect(setCookie.toLowerCase()).toContain("httponly");

      const cookiePair = setCookie.split(";")[0]!;
      const authGetRes = await portalSessionGet(
        new Request("http://localhost/api/portal/session", {
          headers: { cookie: cookiePair }
        })
      );
      expect(authGetRes.status).toBe(200);
      expect((await authGetRes.json()).session.role).toBe("USINA");

      const logoutRes = await portalSessionDelete();
      expect(logoutRes.status).toBe(200);
      expect(logoutRes.headers.get("set-cookie")).toContain("Max-Age=0");
    });
  });

  describe("Rule: validation telemetry API", () => {
    it("Scenario: records an anonymous PME experiment event", async () => {
      const res = await experimentsPost(
        new Request("http://localhost/api/experiments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            event: "pme_landing_view",
            variant: "A",
            visitorId: "session-8b7e1f2a"
          })
        })
      );

      expect(res.status).toBe(201);
      expect(await res.json()).toEqual({ status: "recorded" });
    });

    it("Scenario: rejects telemetry that contains an e-mail identifier", async () => {
      const res = await experimentsPost(
        new Request("http://localhost/api/experiments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ event: "pme_landing_view", visitorId: "pessoa@empresa.com" })
        })
      );

      expect(res.status).toBe(400);
      expect((await res.json()).errors).toHaveProperty("visitorId");
    });

    it("Scenario: exposes a collecting-data summary without declaring a winner", async () => {
      const res = await experimentsGet();
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.storage).toBe("memory_per_instance");
      expect(data.pme.status).toBe("collecting_data");
      expect(data.totalEvents).toBe(0);
    });

    it("Scenario: rejects malformed telemetry input safely", async () => {
      const res = await experimentsPost({
        json: vi.fn().mockRejectedValue(new Error("bad payload"))
      } as unknown as Request);

      expect(res.status).toBe(400);
      expect((await res.json()).message).toBe("Não foi possível registrar o evento de validação.");
    });
  });
});

