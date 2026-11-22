"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Buildings,
  Factory,
  Gear,
  Lock,
  ShieldCheck,
  SunHorizon,
  Warning
} from "@phosphor-icons/react";
import { Navbar } from "@/components/navbar";
import type { UserRole } from "@milet/contracts";

interface ProfileCard {
  role: UserRole;
  title: string;
  subtitle: string;
  email: string;
  scope: string;
  icon: typeof Buildings;
}

const PROFILE_CARDS: readonly ProfileCard[] = [
  {
    role: "CONSUMIDOR",
    title: "Consumidor PME",
    subtitle: "Padaria Horizonte Ltda · Cemig A4",
    email: "consumidor@padariahorizonte.com.br",
    scope: "Comparativo All-In com taxa Milet explícita, Fio B e consentimento LGPD",
    icon: Buildings
  },
  {
    role: "COMERCIALIZADORA",
    title: "Comercializadora ACL",
    subtitle: "Alvorada Energia Varejista",
    email: "mesa@alvoradaenergia.com.br",
    scope: "Mesa B2B com leads anonimizados até aceite formal e simulador de propostas",
    icon: Factory
  },
  {
    role: "USINA",
    title: "Usina & Consórcio GD",
    subtitle: "Consórcio Solar Cerrado",
    email: "gestao@solarcerrado.com.br",
    scope: "Alocação de saldo kWh/mês contra demanda dos consumidores e validação de ativos",
    icon: SunHorizon
  },
  {
    role: "ADMIN",
    title: "Governança Milet",
    subtitle: "Administração da Plataforma",
    email: "admin@milet.com.br",
    scope: "Métricas multi-tenant, isolamento RLS PostgreSQL e trilha append-only SHA-256",
    icon: Gear
  }
];

export default function PortalLoginPage() {
  const [selectedEmail, setSelectedEmail] = useState<string>(PROFILE_CARDS[0]!.email);
  const [nextPath, setNextPath] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const nextParam = params.get("next");
    if (nextParam && nextParam.startsWith("/portal/")) {
      setNextPath(nextParam);
    }
  }, []);

  const handleLogin = async (emailToUse: string) => {
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      const response = await fetch("/api/portal/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailToUse })
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.message || "Falha ao autenticar perfil.");
      }

      const defaultTarget = String(payload.redirectTo || "/portal/consumidor");
      const target =
        nextPath && nextPath.startsWith(defaultTarget) ? nextPath : defaultTarget;
      window.location.assign(target);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro ao iniciar sessão.";
      setErrorMessage(msg);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)]">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-milet-amber)]/10 border border-[var(--color-milet-amber)]/30 text-xs font-semibold text-[var(--color-milet-amber-dark)] dark:text-[var(--color-milet-amber-light)]">
            <img
              src="/assets/logo/png/transparent/milet-symbol-amber.png"
              alt="Milet"
              className="w-4 h-4 object-contain"
            />
            <span>Área Logada · 4 Portais Multi-Tenant</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight">
            Escolha o perfil para entrar no ecossistema Milet
          </h1>
          <p className="text-sm text-[var(--foreground)]/75 leading-relaxed">
            Acesso protegido por sessão assinada em cookie <code className="font-mono text-xs px-1.5 py-0.5 rounded bg-[var(--card)] border border-[var(--border)]">HttpOnly</code> (HMAC-SHA256) e middleware RBAC por papel. Estrutura pronta para integração OIDC/SSO e MFA em produção.
          </p>
        </div>

        {nextPath ? (
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs flex items-center gap-2.5 text-amber-800 dark:text-amber-200">
            <Lock weight="fill" className="w-4 h-4 shrink-0" />
            <span>
              Rota protegida solicitada: <code className="font-mono font-semibold">{nextPath}</code>. Autentique-se com o perfil correspondente para continuar.
            </span>
          </div>
        ) : null}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PROFILE_CARDS.map((card) => {
            const Icon = card.icon;
            const isSelected = selectedEmail.toLowerCase() === card.email.toLowerCase();
            return (
              <button
                key={card.role}
                type="button"
                onClick={() => setSelectedEmail(card.email)}
                className={`p-5 rounded-2xl border text-left transition-all cursor-pointer space-y-3 ${
                  isSelected
                    ? "bg-[var(--card)] border-[var(--color-milet-amber)] ring-2 ring-[var(--color-milet-amber)]/35 shadow-sm"
                    : "bg-[var(--card)] border-[var(--border)] hover:border-[var(--color-milet-amber)]/50"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[var(--color-milet-amber)]/10 border border-[var(--color-milet-amber)]/25 flex items-center justify-center text-[var(--color-milet-amber-dark)] dark:text-[var(--color-milet-amber-light)]">
                      <Icon weight="duotone" className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-sm">{card.title}</div>
                      <div className="text-xs text-[var(--foreground)]/65">{card.subtitle}</div>
                    </div>
                  </div>
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded-full border border-[var(--border)] bg-[var(--background)] font-semibold">
                    {card.role}
                  </span>
                </div>
                <p className="text-xs text-[var(--foreground)]/75 leading-relaxed">{card.scope}</p>
                <div className="font-mono text-[11px] text-[var(--color-milet-amber-dark)] dark:text-[var(--color-milet-amber-light)]">
                  {card.email}
                </div>
              </button>
            );
          })}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            void handleLogin(selectedEmail);
          }}
          className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)] space-y-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3 items-end">
            <label className="block space-y-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--foreground)]/70">
                E-mail corporativo de demonstração
              </span>
              <input
                type="email"
                value={selectedEmail}
                onChange={(e) => setSelectedEmail(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border-strong)] font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-milet-amber)]/40"
              />
            </label>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white milet-amber-gradient shadow-sm hover:brightness-105 transition-all cursor-pointer disabled:opacity-60"
            >
              <span>{isSubmitting ? "Autenticando..." : "Entrar no Portal"}</span>
              <ArrowRight weight="bold" className="w-4 h-4" />
            </button>
          </div>

          {errorMessage ? (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 text-xs font-medium flex items-center gap-2">
              <Warning weight="fill" className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          ) : null}

          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[var(--border)] text-xs text-[var(--foreground)]/65">
            <div className="flex items-center gap-2">
              <ShieldCheck weight="fill" className="w-4 h-4 text-emerald-500" />
              <span>Acesso direto ao diagnóstico público sem login:</span>
            </div>
            <Link
              href="/diagnostico"
              className="font-semibold text-[var(--color-milet-amber-dark)] dark:text-[var(--color-milet-amber-light)] hover:underline"
            >
              Ir para Diagnóstico de Fatura
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
}
