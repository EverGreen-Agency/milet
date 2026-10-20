"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  Lightning,
  Buildings,
  HouseLine,
  ChartLineUp,
  ShieldCheck,
  CheckCircle,
  ArrowRight,
  FileArrowUp,
  Receipt,
  Sparkle
} from "@phosphor-icons/react";
import {
  calculateBaseline,
  normalizeProposal,
  formatCurrencyBRL,
  evaluateEligibility,
  type InvoiceInput,
  type ProposalInput
} from "@/domain/energy-engine";

interface ProfileData {
  id: string;
  label: string;
  badge: string;
  icon: typeof Buildings;
  description: string;
  invoice: InvoiceInput;
  proposal: ProposalInput;
}

const PROFILES: Record<string, ProfileData> = {
  pme: {
    id: "pme",
    label: "Empresa / PME",
    badge: "Média Tensão (Grupo A)",
    icon: Buildings,
    description: "Comércios, padarias, clínicas, indústrias e galpões com demanda contratada.",
    invoice: {
      consumptionKwh: 12480,
      total: 10920,
      period: "2026-08",
      distributor: "Cemig",
      voltageGroup: "A4",
      contractedDemandKw: 75
    },
    proposal: {
      id: "PROP-PME-01",
      supplier: "Alvorada Energia Varejista",
      route: "Mercado livre",
      termMonths: 36,
      renewable: "Incentivada 50%",
      adjustment: "IPCA anual",
      risk: "Médio",
      missing: [],
      costs: {
        residualBill: 2940,
        supplier: 4900,
        miletService: 280,
        taxes: 1600,
        financing: 0
      },
      remuneration: "R$ 280/mês de serviço Milet, já incluídos no total."
    }
  },
  supplier: {
    id: "supplier",
    label: "Comercializadora",
    badge: "Agrupador / Portfólio",
    icon: ChartLineUp,
    description: "Gestores de carteira e tradings buscando PMEs pré-qualificadas.",
    invoice: {
      consumptionKwh: 85000,
      total: 68500,
      period: "2026-08",
      distributor: "CPFL Paulista",
      voltageGroup: "A4",
      contractedDemandKw: 350
    },
    proposal: {
      id: "PROP-SUP-01",
      supplier: "Consórcio Sudeste Mercado Livre",
      route: "Mercado livre",
      termMonths: 48,
      renewable: "100% Eólica / Solar",
      adjustment: "IPCA anual",
      risk: "Baixo",
      missing: [],
      costs: {
        residualBill: 18200,
        supplier: 32500,
        miletService: 1200,
        taxes: 9800,
        financing: 0
      },
      remuneration: "R$ 1.200/mês de serviço Milet all-in."
    }
  },
  home: {
    id: "home",
    label: "Residencial / GD",
    badge: "Baixa Tensão (Grupo B)",
    icon: HouseLine,
    description: "Residências, consultórios e pequenas lojas sem demanda contratada.",
    invoice: {
      consumptionKwh: 1450,
      total: 1580,
      period: "2026-08",
      distributor: "Light",
      voltageGroup: "B1"
    },
    proposal: {
      id: "PROP-GD-01",
      supplier: "Solar por Assinatura Compartilhada",
      route: "Geração compartilhada (GD)",
      termMonths: 12,
      renewable: "100% Solar Distribuída",
      adjustment: "Reajuste Tarifário Anual",
      risk: "Baixo",
      missing: [],
      costs: {
        residualBill: 420,
        supplier: 890,
        miletService: 45,
        taxes: 0,
        financing: 0
      },
      remuneration: "R$ 45/mês de taxa de plataforma Milet inclusa."
    }
  }
};

export function LandingHero() {
  const [activeProfileKey, setActiveProfileKey] = useState<string>("pme");
  const activeProfile = PROFILES[activeProfileKey] ?? PROFILES.pme!;

  const normalized = normalizeProposal(activeProfile.proposal, activeProfile.invoice.total);
  const eligibility = evaluateEligibility(activeProfile.invoice);
  const bestRoute = eligibility.find((e) => e.status === "eligible") ?? eligibility[0]!;

  return (
    <section className="relative overflow-hidden pt-8 pb-16 md:pt-16 md:pb-24">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-[var(--color-milet-amber)]/10 via-[var(--color-milet-copper)]/5 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top announcement pill */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--card)] border border-[var(--border-strong)] text-xs font-medium shadow-xs">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[var(--foreground)]/80">Leitura automática de fatura no ar</span>
            <span className="text-[var(--border-strong)]">|</span>
            <span className="text-[var(--color-milet-amber-dark)] dark:text-[var(--color-milet-amber-light)] font-semibold flex items-center gap-1">
              <Sparkle weight="fill" className="w-3.5 h-3.5" />
              Beta assistido
            </span>
          </div>
        </div>

        {/* Main Headline */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[var(--foreground)] leading-[1.15]">
            Menos economês. Mais transparência na sua{" "}
            <span className="bg-gradient-to-r from-[var(--color-milet-amber)] to-[var(--color-milet-copper)] bg-clip-text text-transparent">
              conta de energia
            </span>
            .
          </h1>
          <p className="mt-5 text-base sm:text-lg text-[var(--foreground)]/70 max-w-2xl mx-auto leading-relaxed">
            Plataforma independente que audita sua fatura de luz, calcula o custo real de transição e compara propostas de mercado livre e energia solar sem comissões escondidas.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/diagnostico"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-white milet-amber-gradient shadow-md hover:shadow-lg hover:brightness-105 transition-all duration-200 active:scale-98"
            >
              <FileArrowUp weight="bold" className="w-5 h-5" />
              <span>Simular com Minha Fatura</span>
            </Link>
            <a
              href="#como-funciona"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-medium bg-[var(--card)] border border-[var(--border-strong)] text-[var(--foreground)] hover:bg-[var(--background)] transition-all duration-200"
            >
              <span>Ver Demonstração Abaixo</span>
              <ArrowRight weight="bold" className="w-4 h-4 text-[var(--foreground)]/60" />
            </a>
          </div>
        </div>

        {/* Interactive Profile Tabs */}
        <div className="max-w-4xl mx-auto mt-12 bg-[var(--card)] rounded-2xl border border-[var(--border)] shadow-sm p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-[var(--border)]">
            <div className="text-left w-full sm:w-auto">
              <span className="text-xs uppercase tracking-wider text-[var(--color-milet-amber-dark)] dark:text-[var(--color-milet-amber-light)] font-bold">
                Simulador Dinâmico
              </span>
              <h3 className="font-serif font-bold text-lg text-[var(--foreground)]">
                Escolha o perfil para ver os números reais:
              </h3>
            </div>

            <div className="grid grid-cols-3 gap-1.5 w-full sm:w-auto bg-[var(--background)] p-1 rounded-xl border border-[var(--border)]">
              {Object.values(PROFILES).map((prof) => {
                const IconComponent = prof.icon;
                const isSelected = prof.id === activeProfileKey;
                return (
                  <button
                    key={prof.id}
                    onClick={() => setActiveProfileKey(prof.id)}
                    className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                      isSelected
                        ? "bg-[var(--card)] text-[var(--color-milet-amber-dark)] dark:text-[var(--color-milet-amber-light)] shadow-xs border border-[var(--border)]"
                        : "text-[var(--foreground)]/60 hover:text-[var(--foreground)]"
                    }`}
                  >
                    <IconComponent weight={isSelected ? "fill" : "regular"} className="w-4 h-4" />
                    <span>{prof.label.split(" /")[0]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dynamic Comparison Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeProfile.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {/* Col 1: Fatura Atual */}
              <div className="rounded-xl p-5 bg-[var(--background)] border border-[var(--border)] space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Receipt weight="bold" className="w-5 h-5 text-[var(--foreground)]/60" />
                    <h4 className="font-semibold text-xs uppercase tracking-wider text-[var(--foreground)]/70">
                      Fatura Atual ({activeProfile.invoice.distributor})
                    </h4>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded bg-[var(--card)] border border-[var(--border)] font-mono text-[var(--foreground)]/70">
                    {activeProfile.badge}
                  </span>
                </div>

                <div>
                  <div className="text-xs text-[var(--foreground)]/60">Gasto Mensal Atual</div>
                  <div className="text-2xl sm:text-3xl font-bold font-serif text-[var(--foreground)]">
                    {formatCurrencyBRL(activeProfile.invoice.total)}
                  </div>
                  <div className="text-xs text-[var(--foreground)]/60 mt-1">
                    Consumo medido: {activeProfile.invoice.consumptionKwh.toLocaleString("pt-BR")} kWh/mês
                  </div>
                </div>

                <div className="pt-2 border-t border-[var(--border)] text-xs text-[var(--foreground)]/70 space-y-1.5">
                  <div className="flex justify-between">
                    <span>Tensão / Grupo:</span>
                    <span className="font-mono font-semibold">{activeProfile.invoice.voltageGroup}</span>
                  </div>
                  {activeProfile.invoice.contractedDemandKw ? (
                    <div className="flex justify-between">
                      <span>Demanda Contratada:</span>
                      <span className="font-mono font-semibold">{activeProfile.invoice.contractedDemandKw} kW</span>
                    </div>
                  ) : null}
                </div>
              </div>

              {/* Col 2: Proposta Otimizada Milet */}
              <div className="rounded-xl p-5 bg-gradient-to-br from-[var(--color-milet-amber)]/5 to-[var(--color-milet-copper)]/10 border border-[var(--color-milet-amber)]/30 space-y-4 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[var(--color-milet-amber-dark)] dark:text-[var(--color-milet-amber-light)] font-bold text-xs uppercase tracking-wider">
                    <Lightning weight="fill" className="w-4 h-4" />
                    <span>Custo All-In Milet</span>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 font-semibold border border-emerald-500/20">
                    -{normalized.savingPercent.toFixed(1)}% Redução
                  </span>
                </div>

                <div>
                  <div className="text-xs text-[var(--foreground)]/60">Novo Custo Mensal Estimado</div>
                  <div className="text-2xl sm:text-3xl font-bold font-serif text-[var(--foreground)]">
                    {formatCurrencyBRL(normalized.total)}
                  </div>
                  <div className="text-xs text-emerald-600 font-semibold mt-1">
                    Economia líquida: {formatCurrencyBRL(normalized.monthlySaving)}/mês
                  </div>
                </div>

                <div className="pt-2 border-t border-[var(--border)] text-xs text-[var(--foreground)]/70 space-y-1">
                  <p className="text-[11px] leading-relaxed text-[var(--foreground)]/80 italic">
                    "{activeProfile.proposal.remuneration}"
                  </p>
                </div>
              </div>

              {/* Col 3: Rota Regulatória & Ação */}
              <div className="rounded-xl p-5 bg-[var(--background)] border border-[var(--border)] flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle weight="fill" className="w-5 h-5 text-emerald-500" />
                    <h4 className="font-semibold text-xs uppercase tracking-wider text-[var(--foreground)]/70">
                      Rota Recomendada
                    </h4>
                  </div>
                  <div className="font-bold text-sm text-[var(--foreground)] mb-1">
                    {bestRoute.route}
                  </div>
                  <p className="text-xs text-[var(--foreground)]/70 leading-relaxed">
                    {bestRoute.reason}
                  </p>
                </div>

                <Link
                  href="/diagnostico"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold text-white milet-amber-gradient shadow-xs hover:opacity-90 transition-all"
                >
                  <span>Analisar Meu Caso Real</span>
                  <ArrowRight weight="bold" className="w-3.5 h-3.5" />
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
