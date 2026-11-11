"use client";

import { useEffect, useState } from "react";
import {
  getAnalyticsConsent,
  saveAnalyticsConsent,
  type AnalyticsConsent
} from "@/lib/analytics-consent";
import { disablePostHog } from "@/lib/posthog-client";

export function AnalyticsConsent() {
  const [consent, setConsent] = useState<AnalyticsConsent | null | "preferences">(null);

  useEffect(() => {
    setConsent(getAnalyticsConsent());
  }, []);

  const saveChoice = (choice: AnalyticsConsent) => {
    saveAnalyticsConsent(choice);
    if (choice === "denied") disablePostHog();
    setConsent(choice);

    // A reload ensures the first view and its experiment variant are captured
    // only after a visitor explicitly opted in.
    if (choice === "granted") window.location.reload();
  };

  const shouldShowNotice = consent === null || consent === "preferences";

  return (
    <>
      {shouldShowNotice ? (
        <aside
          aria-label="Preferências de métricas"
          className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-xl rounded-2xl border border-[var(--border-strong)] bg-[var(--background)] p-4 shadow-xl sm:p-5"
        >
          <p className="text-sm font-semibold text-[var(--foreground)]">Métricas de validação</p>
          <p className="mt-1 text-xs leading-relaxed text-[var(--foreground)]/70">
            Com sua permissão, medimos apenas cliques e etapas anônimas desta jornada para aprimorar o piloto. Não enviamos campos de fatura, proposta ou contato para o PostHog.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => saveChoice("granted")}
              className="rounded-lg bg-[var(--color-milet-amber)] px-3 py-2 text-xs font-semibold text-white transition hover:brightness-105"
            >
              Aceitar métricas
            </button>
            <button
              type="button"
              onClick={() => saveChoice("denied")}
              className="rounded-lg border border-[var(--border-strong)] px-3 py-2 text-xs font-semibold text-[var(--foreground)] transition hover:border-[var(--color-milet-amber)]"
            >
              Recusar
            </button>
          </div>
        </aside>
      ) : (
        <button
          type="button"
          onClick={() => setConsent("preferences")}
          className="fixed bottom-3 left-3 z-40 rounded-full border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-xs text-[var(--foreground)]/70 shadow-sm transition hover:border-[var(--color-milet-amber)]"
        >
          Preferências de métricas
        </button>
      )}
    </>
  );
}
