import { after, NextResponse } from "next/server";
import crypto from "node:crypto";
import { SeverityNumber } from "@opentelemetry/api-logs";
import { validateInvoice, type InvoiceInput } from "@/domain/energy-engine";
import { posthogLogger, posthogLoggerProvider } from "../../../../instrumentation";

function emitIntakeLog(status: "success" | "failed") {
  posthogLogger?.emit({
    body: "diagnostic intake completed",
    severityNumber: status === "success" ? SeverityNumber.INFO : SeverityNumber.ERROR,
    attributes: { endpoint: "/api/intakes", operation: "diagnostic_intake", status }
  });

  after(async () => {
    if (posthogLoggerProvider) {
      await posthogLoggerProvider.forceFlush().catch(() => {});
    }
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const invoice: InvoiceInput = {
      consumptionKwh: Number(body.consumptionKwh || body.kwh),
      total: Number(body.total),
      period: body.period,
      distributor: body.distributor,
      contractedDemandKw: Number(body.contractedDemandKw || 0),
      voltageGroup: body.voltageGroup || "A4",
      tariffFlag: body.tariffFlag
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
      status: "received"
    };

    emitIntakeLog("success");
    return NextResponse.json(intakeRecord, { status: 201 });
  } catch (error: any) {
    emitIntakeLog("failed");
    return NextResponse.json({ message: error?.message || "Erro interno ao processar intake." }, { status: 500 });
  }
}
