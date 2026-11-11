"use client";

import type { PmeVariant, TelemetryEventName } from "@/domain/experiments";

const STORAGE_KEY = "milet-validation-session";

export function getValidationSessionId(): string {
  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (saved) return saved;
  const generated = `session-${crypto.randomUUID().toLowerCase()}`;
  window.localStorage.setItem(STORAGE_KEY, generated);
  return generated;
}

export function trackValidationEvent(event: TelemetryEventName, variant?: PmeVariant): void {
  const payload = JSON.stringify({ event, variant, visitorId: getValidationSessionId() });
  void fetch("/api/experiments", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: payload,
    keepalive: true
  }).catch(() => undefined);
}
