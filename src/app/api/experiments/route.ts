import { NextResponse } from "next/server";
import {
  summarizePmeExperiment,
  validateTelemetryEvent,
  type TelemetryEvent
} from "@/domain/experiments";
import { getExperimentEvents, recordExperimentEvent } from "@/lib/experiment-event-store";

export async function GET() {
  const events = getExperimentEvents();
  return NextResponse.json({
    storage: "memory_per_instance",
    message: "Métricas ainda estão em coleta. Nenhum resultado de experimento foi declarado.",
    pme: summarizePmeExperiment(events),
    totalEvents: events.length
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const candidate = {
      event: body?.event,
      visitorId: body?.visitorId,
      variant: body?.variant,
      occurredAt: new Date().toISOString()
    } satisfies Partial<TelemetryEvent>;
    const errors = validateTelemetryEvent(candidate);
    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ message: "Evento de validação inválido.", errors }, { status: 400 });
    }

    recordExperimentEvent(candidate as TelemetryEvent);
    return NextResponse.json({ status: "recorded" }, { status: 201 });
  } catch {
    return NextResponse.json({ message: "Não foi possível registrar o evento de validação." }, { status: 400 });
  }
}
