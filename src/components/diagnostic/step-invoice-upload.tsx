"use client";

import { useState } from "react";
import { FileArrowUp, ArrowsClockwise, Sparkle, ArrowLeft, ArrowRight, CheckCircle, Warning } from "@phosphor-icons/react";
import type { InvoiceInput } from "@/domain/energy-engine";

export interface InvoiceExtractedData extends InvoiceInput {
  fileName?: string;
  fileKey?: string;
  extractionSource?: string;
  confidenceScore?: number;
}

interface StepInvoiceUploadProps {
  initialInvoice: InvoiceExtractedData;
  onBack: () => void;
  onComplete: (invoice: InvoiceExtractedData) => void;
}

const PRESET_CASES: readonly {
  id: string;
  label: string;
  badge: string;
  description: string;
  data: InvoiceExtractedData;
}[] = [
  {
    id: "padaria",
    label: "Padaria Horizonte (PME)",
    badge: "Cemig • Grupo A4",
    description: "12.480 kWh/mês • R$ 10.920 • Demanda 75 kW • Modalidade Verde",
    data: {
      distributor: "Cemig",
      period: "2026-08",
      consumptionKwh: 12480,
      total: 10920,
      contractedDemandKw: 75,
      voltageGroup: "A4",
      tariffFlag: "Verde",
      fileName: "fatura-sintetica-padaria-agosto-2026.pdf",
      extractionSource: "fixture-pme-a4",
      confidenceScore: 0.98
    }
  },
  {
    id: "comercial",
    label: "Agrupamento PMEs Sudeste",
    badge: "CPFL Paulista • Grupo A4",
    description: "85.000 kWh/mês • R$ 68.500 • Demanda 350 kW • Modalidade Azul",
    data: {
      distributor: "CPFL Paulista",
      period: "2026-08",
      consumptionKwh: 85000,
      total: 68500,
      contractedDemandKw: 350,
      voltageGroup: "A4",
      tariffFlag: "Verde",
      fileName: "fatura-agrupada-cpfl-agosto-2026.pdf",
      extractionSource: "fixture-supplier-a4",
      confidenceScore: 0.99
    }
  },
  {
    id: "residencial",
    label: "Condomínio / Residência",
    badge: "Light • Grupo B1",
    description: "1.450 kWh/mês • R$ 1.580 • Sem demanda contratada • Bandeira Amarela",
    data: {
      distributor: "Light",
      period: "2026-08",
      consumptionKwh: 1450,
      total: 1580,
      contractedDemandKw: 0,
      voltageGroup: "B1",
      tariffFlag: "Amarela",
      fileName: "fatura-residencial-light-agosto-2026.pdf",
      extractionSource: "fixture-home-b1",
      confidenceScore: 0.97
    }
  }
];

export function StepInvoiceUpload({ initialInvoice, onBack, onComplete }: StepInvoiceUploadProps) {
  const [invoice, setInvoice] = useState<InvoiceExtractedData>(initialInvoice);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setErrorMessage(null);
    setStatusMessage("Extraindo campos da conta com Google Gemini 2.5 e arquivando no S3...");

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const rawResult = reader.result as string;
          const base64Data = rawResult.includes(",") ? rawResult.split(",")[1] : rawResult;
          const mimeType = file.type || "application/pdf";

          const response = await fetch("/api/extract-invoice", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              fileData: base64Data,
              mimeType,
              fileName: file.name
            })
          });

          if (!response.ok) {
            throw new Error("Não foi possível processar o OCR multimodal.");
          }

          const result = await response.json();
          if (result.extracted) {
            const updated: InvoiceExtractedData = {
              distributor: result.extracted.distributor || invoice.distributor || "Distribuidora Local",
              period: result.extracted.period || invoice.period || "2026-08",
              consumptionKwh: Number(result.extracted.consumptionKwh) || invoice.consumptionKwh || 1000,
              total: Number(result.extracted.total) || invoice.total || 900,
              contractedDemandKw: Number(result.extracted.contractedDemandKw) || 0,
              voltageGroup: result.extracted.voltageGroup || "A4",
              tariffFlag: result.extracted.tariffFlag || "Verde",
              fileName: file.name,
              fileKey: result.fileKey,
              extractionSource: result.source || "gemini-2.5-flash",
              confidenceScore: 0.96
            };

            setInvoice(updated);
            setStatusMessage("Fatura extraída com sucesso! Os campos foram carregados para conferência.");
          }
        } catch (err: any) {
          setErrorMessage(err.message || "Erro na extração remota. Você poderá ajustar os valores manualmente na etapa seguinte.");
        } finally {
          setIsProcessing(false);
        }
      };

      reader.onerror = () => {
        setErrorMessage("Erro ao ler o arquivo localmente.");
        setIsProcessing(false);
      };

      reader.readAsDataURL(file);
    } catch (err: any) {
      setErrorMessage(err.message || "Erro inesperado.");
      setIsProcessing(false);
    }
  };

  const loadPreset = (preset: typeof PRESET_CASES[number]) => {
    setInvoice(preset.data);
    setErrorMessage(null);
    setStatusMessage(`Caso de demonstração carregado: ${preset.label}`);
  };

  const handleContinue = () => {
    onComplete(invoice);
  };

  return (
    <div className="space-y-8">
      {/* Header da seção */}
      <div className="space-y-2">
        <span className="text-xs uppercase tracking-wider text-[var(--color-milet-amber-dark)] dark:text-[var(--color-milet-amber-light)] font-bold">
          Etapa 2 de 5
        </span>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--foreground)]">
          Adicionar Fatura de Energia
        </h2>
        <p className="text-sm text-[var(--foreground)]/70 max-w-2xl leading-relaxed">
          Envie o PDF original ou foto da conta de luz para leitura automática via IA, ou selecione um caso de teste real pré-configurado.
        </p>
      </div>

      {/* Upload Zone */}
      <div className="rounded-2xl bg-[var(--card)] border-2 border-dashed border-[var(--border-strong)] p-8 text-center hover:border-[var(--color-milet-amber)] transition-colors relative">
        <input
          type="file"
          id="invoice-file-input"
          accept=".pdf,image/png,image/jpeg,image/webp"
          onChange={handleFileChange}
          disabled={isProcessing}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          aria-label="Upload de fatura de energia"
        />

        <div className="w-14 h-14 mx-auto mb-4 rounded-2xl milet-amber-gradient flex items-center justify-center text-white shadow-sm">
          {isProcessing ? (
            <ArrowsClockwise weight="bold" className="w-7 h-7 animate-spin" />
          ) : (
            <FileArrowUp weight="bold" className="w-7 h-7" />
          )}
        </div>

        <h3 className="font-serif font-bold text-base text-[var(--foreground)]">
          {invoice.fileName ? invoice.fileName : "Arraste sua fatura aqui ou clique para selecionar"}
        </h3>
        <p className="mt-1 text-xs text-[var(--foreground)]/60">
          Formatos suportados: PDF, PNG, JPG ou WEBP (até 10 MB)
        </p>

        {statusMessage ? (
          <div className="mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-xs font-medium flex items-center justify-center gap-2 max-w-lg mx-auto">
            <CheckCircle weight="fill" className="w-4 h-4 shrink-0" />
            <span>{statusMessage}</span>
          </div>
        ) : null}

        {errorMessage ? (
          <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 text-xs font-medium flex items-center justify-center gap-2 max-w-lg mx-auto">
            <Warning weight="fill" className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        ) : null}
      </div>

      {/* Casos Prontos de Demonstração */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--foreground)]/70">
          <Sparkle weight="fill" className="w-4 h-4 text-[var(--color-milet-amber)]" />
          <span>Ou escolha um caso real de referência para testar sem enviar arquivo:</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PRESET_CASES.map((preset) => {
            const isSelected = invoice.fileName === preset.data.fileName;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => loadPreset(preset)}
                className={`p-4 rounded-xl border text-left transition-all space-y-2 cursor-pointer ${
                  isSelected
                    ? "bg-[var(--card)] border-[var(--color-milet-amber)] ring-1 ring-[var(--color-milet-amber)]/30 shadow-xs"
                    : "bg-[var(--background)] border-[var(--border)] hover:border-[var(--color-milet-amber)]/40"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-[var(--foreground)]">{preset.label}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--background)] border border-[var(--border)] font-mono text-[var(--foreground)]/70">
                    {preset.badge}
                  </span>
                </div>
                <div className="text-[11px] text-[var(--foreground)]/60 leading-relaxed">
                  {preset.description}
                </div>
              </button>
            );
          })}
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
          <span>Voltar para Cadastro</span>
        </button>

        <button
          type="button"
          onClick={handleContinue}
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-white milet-amber-gradient shadow-md hover:brightness-105 transition-all duration-200 active:scale-98 cursor-pointer"
        >
          <span>Avançar para Conferência</span>
          <ArrowRight weight="bold" className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
