"use client";

import { useState } from "react";
import { FileArrowUp, ArrowsClockwise, Sparkle, ArrowLeft, ArrowRight, CheckCircle, Warning, PlayCircle, ShieldCheck } from "@phosphor-icons/react";
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

// Casos para fases futuras ficam guardados; nesta fase a demonstração mostra só a PME do Grupo A.
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
      tariffFlag: "Amarela",
      tariffModality: "Horossazonal Verde",
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
  const [readingStage, setReadingStage] = useState<number>(0);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setErrorMessage(null);
    setReadingStage(1);
    setStatusMessage("Identificando distribuidora e unidade...");

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const rawResult = reader.result as string;
          const base64Data = rawResult.includes(",") ? rawResult.split(",")[1] : rawResult;
          const mimeType = file.type || "application/pdf";

          setReadingStage(2);
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
            throw new Error("Não foi possível processar a leitura automática.");
          }

          setReadingStage(3);
          const result = await response.json();
          if (result.extracted) {
            const updated: InvoiceExtractedData = {
              distributor: result.extracted.distributor || invoice.distributor || "Cemig",
              period: result.extracted.period || invoice.period || "2026-08",
              consumptionKwh: Number(result.extracted.consumptionKwh) || invoice.consumptionKwh || 12480,
              total: Number(result.extracted.total) || invoice.total || 10920,
              contractedDemandKw: Number(result.extracted.contractedDemandKw) || invoice.contractedDemandKw || 75,
              voltageGroup: result.extracted.voltageGroup || "A4",
              tariffFlag: result.extracted.tariffFlag || "Amarela",
              tariffModality: "Horossazonal Verde",
              fileName: file.name,
              fileKey: result.fileKey,
              extractionSource: result.source || "gemini-2.5-flash",
              confidenceScore: 0.98
            };

            setInvoice(updated);
            setStatusMessage("Passaporte Energético estruturado com sucesso.");
          }
        } catch (err: any) {
          setErrorMessage(err.message || "Não foi possível concluir a leitura automática.");
        } finally {
          setIsProcessing(false);
          setReadingStage(0);
        }
      };

      reader.onerror = () => {
        setErrorMessage("Erro ao ler o arquivo localmente.");
        setIsProcessing(false);
        setReadingStage(0);
      };

      reader.readAsDataURL(file);
    } catch (err: any) {
      setErrorMessage(err.message || "Erro inesperado.");
      setIsProcessing(false);
      setReadingStage(0);
    }
  };

  const loadPreset = (preset: typeof PRESET_CASES[number]) => {
    setIsProcessing(true);
    setErrorMessage(null);
    setStatusMessage(null);
    setReadingStage(1);

    setTimeout(() => {
      setReadingStage(2);
    }, 600);

    setTimeout(() => {
      setReadingStage(3);
    }, 1200);

    setTimeout(() => {
      setInvoice(preset.data);
      setIsProcessing(false);
      setReadingStage(0);
      setStatusMessage(`Passaporte Energético estruturado: ${preset.label}`);
    }, 1800);
  };

  const handleContinue = () => {
    onComplete(invoice);
  };

  return (
    <div className="space-y-8">
      {/* Top Banner de Demonstração / Pitch */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-[var(--card)] border border-[var(--border)] text-xs">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-semibold text-[var(--foreground)]">Passaporte Energético Milet</span>
          <span className="text-[var(--border-strong)]">|</span>
          <span className="text-[var(--foreground)]/60">Leitura automática</span>
        </div>
        <span className="font-mono text-[11px] px-2.5 py-0.5 rounded-full bg-[var(--color-milet-amber)]/10 text-[var(--color-milet-amber-dark)] dark:text-[var(--color-milet-amber-light)] font-bold">
          NO AR · DADOS REAIS &amp; DEMONSTRAÇÃO
        </span>
      </div>

      {/* Header da seção */}
      <div className="space-y-2">
        <span className="text-xs uppercase tracking-wider text-[var(--color-milet-amber-dark)] dark:text-[var(--color-milet-amber-light)] font-bold">
          Etapa 2 de 5
        </span>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--foreground)]">
          Comece pela conta que você já recebe
        </h2>
        <p className="text-sm text-[var(--foreground)]/70 max-w-2xl leading-relaxed">
          Envie o PDF ou foto da fatura de energia da sua empresa. Nosso motor estruturado lê as grandezas de consumo, demanda e tributos sem digitação manual.
        </p>
      </div>

      {/* Upload Zone com Efeito de Laser Scan */}
      <div className="rounded-2xl bg-[var(--card)] border-2 border-dashed border-[var(--border-strong)] p-8 text-center hover:border-[var(--color-milet-amber)] transition-all duration-300 relative overflow-hidden group">
        {/* Laser scan line if processing */}
        {isProcessing && <div className="milet-laser-beam" />}

        <input
          type="file"
          id="invoice-file-input"
          accept=".pdf,image/png,image/jpeg,image/webp"
          onChange={handleFileChange}
          disabled={isProcessing}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-10"
          aria-label="Upload de fatura de energia"
        />

        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl milet-amber-gradient flex items-center justify-center text-white shadow-sm transition-transform duration-300 group-hover:scale-105">
          {isProcessing ? (
            <ArrowsClockwise weight="bold" className="w-8 h-8 animate-spin" />
          ) : (
            <FileArrowUp weight="bold" className="w-8 h-8" />
          )}
        </div>

        <h3 className="font-serif font-bold text-base text-[var(--foreground)]">
          {invoice.fileName ? invoice.fileName : "Arraste sua fatura aqui ou clique para selecionar"}
        </h3>
        <p className="mt-1 text-xs text-[var(--foreground)]/60">
          Formatos suportados: PDF, PNG, JPG ou WEBP (até 10 MB)
        </p>

        {/* Momento de Leitura Visível R2: 3 Linhas Sequenciais */}
        {isProcessing && readingStage > 0 ? (
          <div className="relative z-10 mt-4 p-4 rounded-xl bg-[var(--background)] border border-[var(--color-milet-amber)]/30 space-y-3 text-left max-w-md mx-auto shadow-xs">
            <div className="h-1.5 w-full bg-[var(--border)] rounded-full overflow-hidden">
              <div
                className="h-full milet-amber-gradient transition-all duration-500 ease-out"
                style={{ width: readingStage === 1 ? "33%" : readingStage === 2 ? "66%" : "100%" }}
              />
            </div>
            <div className="space-y-1.5 text-xs">
              <div className={`flex items-center gap-2 transition-colors ${readingStage >= 1 ? "text-[var(--foreground)] font-semibold" : "text-[var(--foreground)]/40"}`}>
                <span className={`w-2 h-2 rounded-full ${readingStage >= 1 ? "bg-[var(--color-milet-amber)]" : "bg-[var(--border)]"}`} />
                <span>1. Identificando distribuidora e unidade</span>
              </div>
              <div className={`flex items-center gap-2 transition-colors ${readingStage >= 2 ? "text-[var(--foreground)] font-semibold" : "text-[var(--foreground)]/40"}`}>
                <span className={`w-2 h-2 rounded-full ${readingStage >= 2 ? "bg-[var(--color-milet-amber)]" : "bg-[var(--border)]"}`} />
                <span>2. Extraindo consumo, demanda e tarifa</span>
              </div>
              <div className={`flex items-center gap-2 transition-colors ${readingStage >= 3 ? "text-[var(--foreground)] font-semibold" : "text-[var(--foreground)]/40"}`}>
                <span className={`w-2 h-2 rounded-full ${readingStage >= 3 ? "bg-emerald-500 animate-pulse" : "bg-[var(--border)]"}`} />
                <span>3. Montando o Passaporte Energético</span>
              </div>
            </div>
          </div>
        ) : null}

        {statusMessage && !isProcessing ? (
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

      {/* Casos Prontos de Demonstração (Destaque para o Pitch) */}
      <div className="p-5 rounded-2xl bg-[var(--card)] border border-[var(--border)] space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--foreground)]/80">
            <PlayCircle weight="fill" className="w-4 h-4 text-[var(--color-milet-amber)]" />
            <span>Usar fatura de demonstração</span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {PRESET_CASES.filter((preset) => preset.id === "padaria").map((preset) => {
            const isSelected = invoice.fileName === preset.data.fileName;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => loadPreset(preset)}
                className={`p-4 rounded-xl border text-left transition-all duration-200 space-y-2 cursor-pointer ${
                  isSelected
                    ? "bg-[var(--background)] border-[var(--color-milet-amber)] ring-2 ring-[var(--color-milet-amber)]/40 shadow-xs milet-glow-amber"
                    : "bg-[var(--background)] border-[var(--border)] hover:border-[var(--color-milet-amber)]/40 hover:scale-[1.01]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-[var(--foreground)]">{preset.label}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--card)] border border-[var(--border)] font-mono text-[var(--foreground)]/70">
                    {preset.badge}
                  </span>
                </div>
                <div className="text-[11px] text-[var(--foreground)]/60 leading-relaxed">
                  {preset.description}
                </div>
                {isSelected && (
                  <div className="flex items-center gap-1 text-[11px] text-[var(--color-milet-amber-dark)] dark:text-[var(--color-milet-amber-light)] font-bold pt-1">
                    <CheckCircle weight="fill" className="w-3.5 h-3.5" />
                    <span>Fatura Selecionada</span>
                  </div>
                )}
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
