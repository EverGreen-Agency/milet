"use client";

import { useMemo, useState } from "react";
import {
  CheckCircle,
  Eye,
  Factory,
  Lock,
  PaperPlaneTilt
} from "@phosphor-icons/react";
import { formatCurrencyBRL } from "@/domain/energy-engine";
import {
  maskLeadForSupplier,
  type PortalCaseInput
} from "@/domain/matching-engine";

const PIPELINE_CASES: readonly PortalCaseInput[] = [
  {
    id: "case-padaria-0001",
    tenantId: "t-consumidor-1",
    companyName: "Padaria Horizonte Ltda",
    documentNumber: "12.345.678/0001-90",
    distributor: "Cemig",
    submarket: "SE/CO",
    voltageGroup: "A4",
    consumptionKwh: 12480,
    contractedDemandKw: 75,
    baselineTotalBrl: 10920,
    consentShared: true
  },
  {
    id: "case-metal-0042",
    tenantId: "t-consumidor-2",
    companyName: "Metalúrgica Modelo S.A.",
    documentNumber: "33.987.654/0001-12",
    distributor: "CPFL Paulista",
    submarket: "SE/CO",
    voltageGroup: "A4",
    consumptionKwh: 42500,
    contractedDemandKw: 180,
    baselineTotalBrl: 34850,
    consentShared: false
  }
];

export default function SupplierPortalPage() {
  const [revealedIds, setRevealedIds] = useState<string[]>([]);
  const [energyCostBrl, setEnergyCostBrl] = useState<number>(4990);
  const [residualBrl, setResidualBrl] = useState<number>(2940);
  const [taxesBrl, setTaxesBrl] = useState<number>(1600);
  const [termMonths, setTermMonths] = useState<number>(24);
  const [submittedNote, setSubmittedNote] = useState<string | null>(null);
  const miletFeeBrl = 190;

  const maskedPipeline = useMemo(
    () =>
      PIPELINE_CASES.map((item) => ({
        raw: item,
        masked: maskLeadForSupplier(item, revealedIds.includes(item.id))
      })),
    [revealedIds]
  );

  const totalAllIn = energyCostBrl + residualBrl + taxesBrl + miletFeeBrl;
  const baseline = PIPELINE_CASES[0]!.baselineTotalBrl;
  const saving = baseline - totalAllIn;
  const savingPercent = baseline > 0 ? ((saving / baseline) * 100).toFixed(1) : "0.0";

  const toggleReveal = (id: string) => {
    setRevealedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--color-milet-amber-dark)] dark:text-[var(--color-milet-amber-light)]">
          <Factory weight="duotone" className="w-4 h-4" />
          <span>Mesa B2B · Comercializadora Varejista</span>
        </div>
        <h1 className="font-serif text-3xl font-bold tracking-tight">
          Originacão de Demandas Auditadas (SE/CO)
        </h1>
        <p className="text-sm text-[var(--foreground)]/70 max-w-3xl">
          Leads são entregues com curva de carga e grupo tarifário validados, mantendo PII mascarada até o aceite formal e consentimento do consumidor.
        </p>
      </div>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {maskedPipeline.map(({ raw, masked }) => (
          <div
            key={raw.id}
            className="p-5 rounded-2xl bg-[var(--card)] border border-[var(--border)] space-y-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-bold text-sm">{masked.companyLabel}</div>
                <div className="font-mono text-xs text-[var(--foreground)]/65">
                  CNPJ: {masked.maskedDocument}
                </div>
              </div>
              <span className="font-mono text-[10px] px-2.5 py-0.5 rounded-full bg-[var(--background)] border border-[var(--border)]">
                {masked.distributor} · {masked.voltageGroup}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-[var(--background)] border border-[var(--border)]">
                <div className="text-[var(--foreground)]/60">Consumo Médio</div>
                <div className="font-mono font-bold text-sm">
                  {masked.consumptionKwh.toLocaleString("pt-BR")} kWh/mês
                </div>
              </div>
              <div className="p-3 rounded-xl bg-[var(--background)] border border-[var(--border)]">
                <div className="text-[var(--foreground)]/60">Demanda Contratada</div>
                <div className="font-mono font-bold text-sm">
                  {masked.contractedDemandKw} kW
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 pt-1">
              <div className="text-[11px] flex items-center gap-1.5 text-[var(--foreground)]/70">
                {raw.consentShared ? (
                  <Eye weight="fill" className="w-4 h-4 text-emerald-500" />
                ) : (
                  <Lock weight="fill" className="w-4 h-4 text-amber-500" />
                )}
                <span>
                  {raw.consentShared
                    ? "Consumidor autorizou abertura após aceite"
                    : "Consentimento pendente · mascaramento forçado"}
                </span>
              </div>

              <button
                type="button"
                onClick={() => toggleReveal(raw.id)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[var(--background)] border border-[var(--border-strong)] hover:border-[var(--color-milet-amber)] cursor-pointer"
              >
                {revealedIds.includes(raw.id) ? "Mascarar Lead" : "Simular Aceite Formal"}
              </button>
            </div>
          </div>
        ))}
      </section>

      <section className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)] space-y-5">
        <div>
          <h2 className="font-serif text-xl font-bold">
            Simulador de Proposta ACL Varejista (Caso #0001)
          </h2>
          <p className="text-xs text-[var(--foreground)]/70">
            A taxa de sucesso da Milet ({formatCurrencyBRL(miletFeeBrl)}/mês) compõe automaticamente a régua All-In exibida ao cliente.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <label className="space-y-1 text-xs">
            <span className="font-semibold">Energia Contratada (R$)</span>
            <input
              type="number"
              value={energyCostBrl}
              onChange={(e) => setEnergyCostBrl(Number(e.target.value) || 0)}
              className="w-full px-3 py-2 rounded-xl bg-[var(--background)] border border-[var(--border-strong)] font-mono"
            />
          </label>
          <label className="space-y-1 text-xs">
            <span className="font-semibold">Fio Residual Cemig (R$)</span>
            <input
              type="number"
              value={residualBrl}
              onChange={(e) => setResidualBrl(Number(e.target.value) || 0)}
              className="w-full px-3 py-2 rounded-xl bg-[var(--background)] border border-[var(--border-strong)] font-mono"
            />
          </label>
          <label className="space-y-1 text-xs">
            <span className="font-semibold">Tributos &amp; CCEE (R$)</span>
            <input
              type="number"
              value={taxesBrl}
              onChange={(e) => setTaxesBrl(Number(e.target.value) || 0)}
              className="w-full px-3 py-2 rounded-xl bg-[var(--background)] border border-[var(--border-strong)] font-mono"
            />
          </label>
          <label className="space-y-1 text-xs">
            <span className="font-semibold">Prazo (Meses)</span>
            <select
              value={termMonths}
              onChange={(e) => setTermMonths(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl bg-[var(--background)] border border-[var(--border-strong)] font-mono"
            >
              <option value={12}>12 meses</option>
              <option value={24}>24 meses</option>
              <option value={36}>36 meses</option>
            </select>
          </label>
        </div>

        <div className="p-4 rounded-xl bg-[var(--background)] border border-[var(--border)] flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-0.5 text-xs">
            <div>
              Total All-In: <strong className="font-mono text-base">{formatCurrencyBRL(totalAllIn)}</strong>/mês
            </div>
            <div className="text-emerald-600 font-semibold">
              Economia entregue ao consumidor: {formatCurrencyBRL(saving)}/mês ({savingPercent}%)
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              setSubmittedNote(
                `Proposta ACL ${termMonths}m estruturada em ${formatCurrencyBRL(totalAllIn)}/mês All-In e vinculada ao caso #0001.`
              )
            }
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white milet-amber-gradient cursor-pointer"
          >
            <PaperPlaneTilt weight="bold" className="w-4 h-4" />
            <span>Enviar Proposta Equalizada</span>
          </button>
        </div>

        {submittedNote ? (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-medium flex items-center gap-2">
            <CheckCircle weight="fill" className="w-4 h-4 shrink-0" />
            <span>{submittedNote}</span>
          </div>
        ) : null}
      </section>
    </div>
  );
}
