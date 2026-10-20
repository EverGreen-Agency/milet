"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, Receipt, CheckCircle, Warning } from "@phosphor-icons/react";
import { validateInvoice, formatCurrencyBRL, type InvoiceValidationErrors } from "@/domain/energy-engine";
import type { InvoiceExtractedData } from "./step-invoice-upload";

interface StepInvoiceReviewProps {
  invoice: InvoiceExtractedData;
  onBack: () => void;
  onComplete: (validatedInvoice: InvoiceExtractedData) => void;
}

export function StepInvoiceReview({ invoice: initialInvoice, onBack, onComplete }: StepInvoiceReviewProps) {
  const [invoice, setInvoice] = useState<InvoiceExtractedData>(initialInvoice);
  const [errors, setErrors] = useState<InvoiceValidationErrors>({});

  const handleFieldChange = (field: keyof InvoiceExtractedData, value: any) => {
    const updated = { ...invoice, [field]: value };
    setInvoice(updated);
    setErrors(validateInvoice(updated));
  };

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    const currentErrors = validateInvoice(invoice);
    if (Object.keys(currentErrors).length > 0) {
      setErrors(currentErrors);
      return;
    }
    onComplete(invoice);
  };

  return (
    <form onSubmit={handleContinue} className="space-y-8" noValidate>
      {/* Header da seção */}
      <div className="space-y-2">
        <span className="text-xs uppercase tracking-wider text-[var(--color-milet-amber-dark)] dark:text-[var(--color-milet-amber-light)] font-bold">
          Etapa 3 de 5
        </span>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--foreground)]">
          Conferência Assistida dos Dados
        </h2>
        <p className="text-sm text-[var(--foreground)]/70 max-w-2xl leading-relaxed">
          Verifique os dados extraídos pelo Gemini 2.5 da sua conta de energia. Você pode corrigir qualquer campo caso necessário para calibrar o diagnóstico técnico.
        </p>
      </div>

      {/* Cartão de Resumo e Confiança */}
      <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-semibold">
          <CheckCircle weight="fill" className="w-5 h-5 shrink-0" />
          <span>Fatura processada e quarentenada com integridade (S3 Railway)</span>
        </div>
        <div className="flex items-center gap-2 font-mono text-[var(--foreground)]/70">
          <span>Arquivo: {invoice.fileName || "fatura.pdf"}</span>
          <span>•</span>
          <span className="font-bold text-emerald-600">
            Confiança: {invoice.confidenceScore ? `${(invoice.confidenceScore * 100).toFixed(0)}%` : "Alta"}
          </span>
        </div>
      </div>

      {/* Grid de Formulário de Conferência */}
      <div className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)] space-y-6">
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
          <h3 className="font-serif font-bold text-base text-[var(--foreground)] flex items-center gap-2">
            <Receipt weight="bold" className="w-5 h-5 text-[var(--color-milet-amber)]" />
            <span>Métricas Operacionais da Unidade</span>
          </h3>
          <span className="text-xs text-[var(--foreground)]/60 font-mono">
            Subtotal: {formatCurrencyBRL(invoice.total || 0)}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {/* Distribuidora */}
          <div>
            <label htmlFor="rev-distributor" className="block text-xs font-semibold text-[var(--foreground)]/80 mb-1">
              Distribuidora Concessionária *
            </label>
            <input
              id="rev-distributor"
              type="text"
              value={invoice.distributor ?? ""}
              onChange={(e) => handleFieldChange("distributor", e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[var(--border)] bg-[var(--background)] focus:outline-none focus:border-[var(--color-milet-amber)]"
              placeholder="Ex: Cemig, CPFL, Enel"
            />
          </div>

          {/* Período */}
          <div>
            <label htmlFor="rev-period" className="block text-xs font-semibold text-[var(--foreground)]/80 mb-1">
              Período de Referência *
            </label>
            <input
              id="rev-period"
              type="text"
              value={invoice.period}
              onChange={(e) => handleFieldChange("period", e.target.value)}
              className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-[var(--background)] focus:outline-none ${
                errors.period ? "border-rose-500" : "border-[var(--border)] focus:border-[var(--color-milet-amber)]"
              }`}
              placeholder="AAAA-MM (Ex: 2026-08)"
            />
            {errors.period ? <span className="text-[11px] text-rose-500 mt-1 block">{errors.period}</span> : null}
          </div>

          {/* Consumo */}
          <div>
            <label htmlFor="rev-consumption" className="block text-xs font-semibold text-[var(--foreground)]/80 mb-1">
              Consumo Medido (kWh) *
            </label>
            <input
              id="rev-consumption"
              type="number"
              value={invoice.consumptionKwh || ""}
              onChange={(e) => handleFieldChange("consumptionKwh", Number(e.target.value))}
              className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-[var(--background)] focus:outline-none ${
                errors.consumptionKwh ? "border-rose-500" : "border-[var(--border)] focus:border-[var(--color-milet-amber)]"
              }`}
              placeholder="Ex: 12480"
            />
            {errors.consumptionKwh ? <span className="text-[11px] text-rose-500 mt-1 block">{errors.consumptionKwh}</span> : null}
          </div>

          {/* Valor Total */}
          <div>
            <label htmlFor="rev-total" className="block text-xs font-semibold text-[var(--foreground)]/80 mb-1">
              Valor Total da Conta (R$) *
            </label>
            <input
              id="rev-total"
              type="number"
              value={invoice.total || ""}
              onChange={(e) => handleFieldChange("total", Number(e.target.value))}
              className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-[var(--background)] focus:outline-none ${
                errors.total ? "border-rose-500" : "border-[var(--border)] focus:border-[var(--color-milet-amber)]"
              }`}
              placeholder="Ex: 10920"
            />
            {errors.total ? <span className="text-[11px] text-rose-500 mt-1 block">{errors.total}</span> : null}
          </div>

          {/* Grupo de Tensão */}
          <div>
            <label htmlFor="rev-voltage" className="block text-xs font-semibold text-[var(--foreground)]/80 mb-1">
              Grupo Tarifário
            </label>
            <select
              id="rev-voltage"
              value={invoice.voltageGroup ?? "A4"}
              onChange={(e) => handleFieldChange("voltageGroup", e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[var(--border)] bg-[var(--background)] focus:outline-none focus:border-[var(--color-milet-amber)]"
            >
              <option value="A4">A4 (Média Tensão - 2,3kV a 25kV)</option>
              <option value="A3">A3 (Alta Tensão - 69kV)</option>
              <option value="B1">B1 (Baixa Tensão - Residencial)</option>
              <option value="B3">B3 (Baixa Tensão - Comercial/Serviços)</option>
            </select>
          </div>

          {/* Demanda Contratada */}
          <div>
            <label htmlFor="rev-demand" className="block text-xs font-semibold text-[var(--foreground)]/80 mb-1">
              Demanda Contratada (kW)
            </label>
            <input
              id="rev-demand"
              type="number"
              value={invoice.contractedDemandKw ?? 0}
              onChange={(e) => handleFieldChange("contractedDemandKw", Number(e.target.value))}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[var(--border)] bg-[var(--background)] focus:outline-none focus:border-[var(--color-milet-amber)]"
              placeholder="0 se não aplicável"
            />
          </div>

          {/* Bandeira Tarifária */}
          <div>
            <label htmlFor="rev-flag" className="block text-xs font-semibold text-[var(--foreground)]/80 mb-1">
              Bandeira Tarifária
            </label>
            <select
              id="rev-flag"
              value={invoice.tariffFlag ?? "Verde"}
              onChange={(e) => handleFieldChange("tariffFlag", e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[var(--border)] bg-[var(--background)] focus:outline-none focus:border-[var(--color-milet-amber)]"
            >
              <option value="Verde">Bandeira Verde (Sem adicional)</option>
              <option value="Amarela">Bandeira Amarela</option>
              <option value="Vermelha P1">Bandeira Vermelha Patamar 1</option>
              <option value="Vermelha P2">Bandeira Vermelha Patamar 2</option>
              <option value="Escassez">Bandeira Escassez Hídrica</option>
            </select>
          </div>
        </div>
      </div>

      {/* Botões de Ação */}
      <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-[var(--foreground)]/80 bg-[var(--card)] border border-[var(--border)] hover:bg-[var(--background)] transition-all cursor-pointer"
        >
          <ArrowLeft weight="bold" className="w-4 h-4" />
          <span>Voltar para Fatura</span>
        </button>

        <button
          type="submit"
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-white milet-amber-gradient shadow-md hover:brightness-105 transition-all duration-200 active:scale-98 cursor-pointer"
        >
          <span>Avançar para Diagnóstico Técnico</span>
          <ArrowRight weight="bold" className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
}
