import { describe, expect, it } from "vitest";
import {
  assignPmeVariant,
  summarizePmeExperiment,
  validateTelemetryEvent,
  type TelemetryEvent
} from "./experiments";

describe("Feature: privacy-preserving validation telemetry", () => {
  it("keeps a PME visitor on the same A/B variant", () => {
    expect(assignPmeVariant("session-8b7e1f2a")).toBe(assignPmeVariant("session-8b7e1f2a"));
    const variants = new Set(Array.from({ length: 64 }, (_, index) => assignPmeVariant(`session-${index}-fixture`)));
    expect(variants).toEqual(new Set(["A", "B"]));
  });

  it("rejects identifiers that could be an e-mail address", () => {
    expect(
      validateTelemetryEvent({ event: "pme_landing_view", visitorId: "pessoa@empresa.com" })
    ).toHaveProperty("visitorId");
    expect(validateTelemetryEvent({ event: "unexpected" as never, visitorId: "short" })).toEqual({
      event: "Evento não permitido.",
      visitorId: "Identificador de sessão inválido."
    });
    expect(
      validateTelemetryEvent({ event: "pme_landing_view", visitorId: "session-8b7e1f2a", variant: "C" as never })
    ).toHaveProperty("variant");
  });

  it("reports empty samples as collecting data instead of a result", () => {
    const summary = summarizePmeExperiment([]);
    expect(summary.status).toBe("collecting_data");
    expect(summary.variants.every((variant) => variant.intakeRate === null)).toBe(true);
  });

  it("summarizes only observed events", () => {
    const events: TelemetryEvent[] = [
      { event: "pme_landing_view", visitorId: "session-8b7e1f2a", occurredAt: "2026-11-11T00:00:00.000Z", variant: "A" },
      { event: "pme_cta_clicked", visitorId: "session-8b7e1f2a", occurredAt: "2026-11-11T00:00:01.000Z", variant: "A" },
      { event: "pme_landing_view", visitorId: "session-8b7e1f2b", occurredAt: "2026-11-11T00:00:02.000Z", variant: "B" },
      { event: "pme_intake_submitted", visitorId: "session-8b7e1f2b", occurredAt: "2026-11-11T00:00:03.000Z", variant: "B" }
    ];
    expect(summarizePmeExperiment(events).variants.find((variant) => variant.variant === "A")?.ctaRate).toBe(1);
    expect(summarizePmeExperiment(events).variants.find((variant) => variant.variant === "B")?.intakeRate).toBe(1);
  });
});
