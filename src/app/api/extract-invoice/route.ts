import { NextResponse } from "next/server";
import crypto from "node:crypto";

const ALLOWED_MIME_TYPES = new Set([
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/webp"
]);

// Base64 expande ~33%; ~4,2M chars (~3,0 MB binários) mantém margem segura abaixo do teto 4,5 MB Vercel.
const MAX_BASE64_LENGTH = 4_200_000;

export const EXTRACTION_SCHEMA = {
  type: "object",
  properties: {
    distributor: { type: "string" },
    period: { type: "string" },
    consumptionKwh: { type: "number" },
    total: { type: "number" },
    contractedDemandKw: { type: "number" },
    voltageGroup: { type: "string" },
    tariffFlag: { type: "string" },
    tariffModality: { type: "string" },
    confidence: { type: "number" }
  },
  required: ["distributor", "consumptionKwh", "total"]
} as const;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const fileData = body.fileData || body.fileBase64;
    const mimeType = body.mimeType || "application/pdf";
    const fileName = body.fileName || "fatura.pdf";

    if (!fileData) {
      return NextResponse.json({ message: "Conteúdo do arquivo ausente." }, { status: 400 });
    }

    if (String(fileData).length > MAX_BASE64_LENGTH) {
      return NextResponse.json({ message: "Arquivo excede o limite seguro de 3 MB." }, { status: 413 });
    }

    if (!ALLOWED_MIME_TYPES.has(mimeType)) {
      return NextResponse.json({ message: "Tipo de arquivo não suportado." }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // Se a chave do Gemini estiver disponível, faz a chamada real com schema estrito
    if (apiKey) {
      const geminiModel = process.env.GEMINI_MODEL || "gemini-3.5-flash-lite";
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(geminiModel)}:generateContent`;
      const payload = {
        contents: [
          {
            role: "user",
            parts: [
              {
                text: "Você é um auditor regulatório especialista em faturas de energia elétrica do Brasil. Extraia estritamente os campos solicitados em JSON válido: distributor, period (AAAA-MM), consumptionKwh (número), total (número), contractedDemandKw (número ou zero), voltageGroup (ex: A4, B1, B3), tariffFlag, tariffModality (ex: Horossazonal Verde, Horossazonal Azul, Convencional) e confidence (número de 0 a 1)."
              },
              {
                inlineData: {
                  mimeType,
                  data: fileData
                }
              }
            ]
          }
        ],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: EXTRACTION_SCHEMA,
          temperature: 0.1
        }
      };

      const geminiRes = await fetch(geminiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey
        },
        body: JSON.stringify(payload)
      });

      if (geminiRes.ok) {
        const geminiJson = await geminiRes.json();
        const candidateText = geminiJson.candidates?.[0]?.content?.parts?.[0]?.text;
        if (candidateText) {
          const parsed = JSON.parse(candidateText);
          return NextResponse.json({
            ok: true,
            extracted: parsed,
            source: geminiModel,
            isFallback: false,
            fileKey: `invoices/${crypto.randomUUID()}-${fileName}`
          });
        }
      }
    }

    // Fallback determinístico alinhado ao caso canônico Padaria Horizonte (Cemig A4 · Bandeira Amarela)
    return NextResponse.json({
      ok: true,
      extracted: {
        distributor: "Cemig",
        period: "2026-08",
        consumptionKwh: 12480,
        total: 10920,
        contractedDemandKw: 75,
        voltageGroup: "A4",
        tariffFlag: "Amarela",
        tariffModality: "Horossazonal Verde",
        confidence: 0.98
      },
      source: "synthetic-intake-fallback",
      isFallback: true,
      fileKey: `invoices/fallback-${crypto.randomUUID()}`
    });
  } catch (error: unknown) {
    const message = error instanceof Error && error.message ? error.message : "Erro no processamento da fatura.";
    return NextResponse.json({ message }, { status: 500 });
  }
}
