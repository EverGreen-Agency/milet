"use client";

import type { PmeVariant, TelemetryEventName } from "@/domain/experiments";
import { captureValidationEvent } from "@/lib/posthog-client";

const STORAGE_KEY = "milet-validation-session";

export function getValidationSessionId(): string {
  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (saved) return saved;
  const generated = `session-${crypto.randomUUID().toLowerCase()}`;
  window.localStorage.setItem(STORAGE_KEY, generated);
  return generated;
}

export function trackValidationEvent(event: TelemetryEventName, variant?: PmeVariant): void {
  // The local session id never leaves the browser. PostHog generates its own
  // anonymous distinct id after the visitor opts in.
  captureValidationEvent(event, variant);
}
