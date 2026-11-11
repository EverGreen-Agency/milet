"use client";

export const ANALYTICS_CONSENT_STORAGE_KEY = "milet-analytics-consent";

export type AnalyticsConsent = "granted" | "denied";

export function getAnalyticsConsent(): AnalyticsConsent | null {
  if (typeof window === "undefined") return null;

  const stored = window.localStorage.getItem(ANALYTICS_CONSENT_STORAGE_KEY);
  return stored === "granted" || stored === "denied" ? stored : null;
}

export function hasAnalyticsConsent(): boolean {
  return getAnalyticsConsent() === "granted";
}

export function saveAnalyticsConsent(consent: AnalyticsConsent): void {
  window.localStorage.setItem(ANALYTICS_CONSENT_STORAGE_KEY, consent);
}
