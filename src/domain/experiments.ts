export const PME_VALUE_PROPOSITION_EXPERIMENT = "pme_value_proposition" as const;

export type PmeVariant = "A" | "B";
export type TelemetryEventName =
  | "pme_landing_view"
  | "pme_cta_clicked"
  | "pme_intake_submitted"
  | "residential_coming_soon_clicked"
  | "supplier_loi_requested";

export interface TelemetryEvent {
  event: TelemetryEventName;
  visitorId: string;
  occurredAt: string;
  variant?: PmeVariant;
}

export const PME_VARIANTS: Record<PmeVariant, { headline: string; description: string; cta: string }> = {
  A: {
    headline: "Menos economês. Mais clareza para a sua conta de energia.",
    description:
      "Organize o contexto da sua empresa antes da próxima conversa sobre energia, sem promessa de economia ou elegibilidade.",
    cta: "Começar diagnóstico PME"
  },
  B: {
    headline: "Crie o contexto energético da sua empresa em um só lugar.",
    description:
      "Monte um Passaporte Energético inicial para entender o que verificar antes de comparar caminhos e propostas.",
    cta: "Criar Passaporte Energético"
  }
};

const VISITOR_ID_PATTERN = /^[a-z0-9-]{8,64}$/;
const EVENT_NAMES = new Set<TelemetryEventName>([
  "pme_landing_view",
  "pme_cta_clicked",
  "pme_intake_submitted",
  "residential_coming_soon_clicked",
  "supplier_loi_requested"
]);

export function assignPmeVariant(visitorId: string): PmeVariant {
  let hash = 2166136261;
  for (const character of `${PME_VALUE_PROPOSITION_EXPERIMENT}:${visitorId}`) {
    hash ^= character.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0) % 2 === 0 ? "A" : "B";
}

export function validateTelemetryEvent(input: Partial<TelemetryEvent>): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!input.event || !EVENT_NAMES.has(input.event)) errors.event = "Evento não permitido.";
  if (!input.visitorId || !VISITOR_ID_PATTERN.test(input.visitorId)) {
    errors.visitorId = "Identificador de sessão inválido.";
  }
  if (input.variant !== undefined && input.variant !== "A" && input.variant !== "B") {
    errors.variant = "Variante inválida.";
  }
  return errors;
}

export function summarizePmeExperiment(events: readonly TelemetryEvent[]) {
  const variants = (['A', 'B'] as const).map((variant) => {
    const impressions = events.filter(
      (event) => event.event === "pme_landing_view" && event.variant === variant
    ).length;
    const ctaClicks = events.filter(
      (event) => event.event === "pme_cta_clicked" && event.variant === variant
    ).length;
    const intakeSubmissions = events.filter(
      (event) => event.event === "pme_intake_submitted" && event.variant === variant
    ).length;
    return {
      variant,
      impressions,
      ctaClicks,
      intakeSubmissions,
      ctaRate: impressions === 0 ? null : ctaClicks / impressions,
      intakeRate: impressions === 0 ? null : intakeSubmissions / impressions
    };
  });

  return { status: "collecting_data" as const, variants };
}
