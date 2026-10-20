import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { validateInvoice, type InvoiceInput } from "@/domain/energy-engine";

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

    return NextResponse.json(intakeRecord, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error?.message || "Erro interno ao processar intake." }, { status: 500 });
  }
}
