import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { validateInvoice, type InvoiceInput } from "@/domain/energy-engine";

const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const intakeAttempts = new Map<string, number[]>();

export function resetIntakeRateLimitForTest() {
  intakeAttempts.clear();
}

export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    };
    return entities[char]!;
  });
}

function checkRateLimit(clientKey: string): boolean {
  const now = Date.now();
  const recent = (intakeAttempts.get(clientKey) ?? []).filter((ts) => now - ts < RATE_LIMIT_WINDOW_MS);
  if (recent.length >= RATE_LIMIT_MAX) return false;
  recent.push(now);
  intakeAttempts.set(clientKey, recent);
  return true;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const realIntakeMode =
      process.env.INTAKE_ENABLED === "true" && process.env.DEMO_DATA_ONLY === "false";

    if (realIntakeMode) {
      const forwardedFor = request.headers.get("x-forwarded-for") || "unknown";
      const clientKey = forwardedFor.split(",")[0]!.trim();
      if (!checkRateLimit(clientKey)) {
        return NextResponse.json(
          { message: "Muitas tentativas. Tente novamente em alguns minutos." },
          { status: 429 }
        );
      }
      if (body.consentGranted !== true || body.optInContact !== true) {
        return NextResponse.json(
          { message: "Consentimento LGPD e autorização de contato são obrigatórios." },
          { status: 400 }
        );
      }
    } else if (body.consentGranted === false) {
      return NextResponse.json(
        { message: "Consentimento LGPD é obrigatório." },
        { status: 400 }
      );
    }

    const invoice: InvoiceInput = {
      consumptionKwh: Number(body.consumptionKwh || body.kwh),
      total: Number(body.total),
      period: escapeHtml(String(body.period ?? "")),
      distributor: body.distributor ? escapeHtml(String(body.distributor)) : undefined,
      contractedDemandKw: Number(body.contractedDemandKw || 0),
      voltageGroup: body.voltageGroup ? escapeHtml(String(body.voltageGroup)) : "A4",
      tariffFlag: body.tariffFlag ? escapeHtml(String(body.tariffFlag)) : undefined,
      tariffModality: body.tariffModality ? escapeHtml(String(body.tariffModality)) : undefined
    };

    const errors = validateInvoice(invoice);
    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ message: "Dados de fatura inválidos.", errors }, { status: 400 });
    }

    const intakeRecord = {
      id: `INT-${crypto.randomUUID()}`,
      createdAt: new Date().toISOString(),
      invoice,
      consentGranted: Boolean(body.consentGranted),
      optInContact: Boolean(body.optInContact),
      status: "received"
    };

    return NextResponse.json(intakeRecord, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error && error.message ? error.message : "Erro interno ao processar intake.";
    return NextResponse.json({ message }, { status: 500 });
  }
}
