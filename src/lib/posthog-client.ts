"use client";

import posthog from "posthog-js";
import type { PmeVariant, TelemetryEventName } from "@/domain/experiments";
import { hasAnalyticsConsent } from "@/lib/analytics-consent";

const PROJECT_TOKEN = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com";

let hasInitialized = false;

function canCaptureAnalytics(): boolean {
  return Boolean(PROJECT_TOKEN) && hasAnalyticsConsent();
}

export function initializePostHog(): boolean {
  if (!canCaptureAnalytics()) return false;

  if (!hasInitialized) {
    posthog.init(PROJECT_TOKEN!, {
      api_host: POSTHOG_HOST,
      autocapture: false,
      capture_pageview: false,
      capture_pageleave: false,
      disable_session_recording: true,
      person_profiles: "identified_only",
      respect_dnt: true
    });
    hasInitialized = true;
  }

  return true;
}

export function captureValidationEvent(event: TelemetryEventName, variant?: PmeVariant): boolean {
  if (!initializePostHog()) return false;

  posthog.capture(event, {
    experiment_key: variant ? "pme_value_proposition" : undefined,
    experiment_variant: variant,
    journey: event.startsWith("pme_") ? "pme" : event.startsWith("residential_") ? "residential" : "supplier",
    analytics_schema: "validation_v1"
  });
  return true;
}

export function disablePostHog(): void {
  if (hasInitialized) posthog.opt_out_capturing();
}
