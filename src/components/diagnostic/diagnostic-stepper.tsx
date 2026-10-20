"use client";

import { Check } from "@phosphor-icons/react";

export interface StepItem {
  id: string;
  label: string;
  shortLabel: string;
  description: string;
}

export const DIAGNOSTIC_STEPS: readonly StepItem[] = [
  {
    id: "cadastro",
    label: "Cadastro & Triagem",
    shortLabel: "1. Cadastro",
    description: "Identificação do solicitante e perfil da unidade"
  },
  {
    id: "fatura",
    label: "Fatura & OCR",
    shortLabel: "2. Fatura",
    description: "Upload de conta ou seleção de caso real"
  },
  {
    id: "conferencia",
    label: "Conferência Assistida",
    shortLabel: "3. Conferência",
    description: "Validação dos dados lidos pela IA"
  },
  {
    id: "diagnostico",
    label: "Diagnóstico & Baseline",
    shortLabel: "4. Diagnóstico",
    description: "Custo atual decomposto e rotas regulatórias"
  },
  {
    id: "propostas",
    label: "Propostas All-In",
    shortLabel: "5. Propostas",
    description: "Comparação transparente e seleção"
  }
];

interface DiagnosticStepperProps {
  currentStep: number;
  onStepClick?: (stepIndex: number) => void;
}

export function DiagnosticStepper({ currentStep, onStepClick }: DiagnosticStepperProps) {
  return (
    <nav aria-label="Progresso do Diagnóstico" className="w-full mb-8">
      {/* Mobile progress indicator */}
      <div className="flex md:hidden items-center justify-between p-3.5 rounded-xl bg-[var(--card)] border border-[var(--border)] mb-4">
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center w-6 h-6 rounded-full milet-amber-gradient text-white text-xs font-bold">
            {currentStep + 1}
          </span>
          <span className="text-xs font-semibold text-[var(--foreground)]">
            {DIAGNOSTIC_STEPS[currentStep]?.label}
          </span>
        </div>
        <span className="text-[11px] font-mono text-[var(--foreground)]/60">
          Passo {currentStep + 1} de {DIAGNOSTIC_STEPS.length}
        </span>
      </div>

      {/* Desktop stepper */}
      <ol className="hidden md:grid grid-cols-5 gap-3">
        {DIAGNOSTIC_STEPS.map((step, index) => {
          const isDone = index < currentStep;
          const isActive = index === currentStep;
          const isPending = index > currentStep;

          return (
            <li key={step.id}>
              <button
                type="button"
                disabled={isPending}
                onClick={() => isDone && onStepClick?.(index)}
                aria-current={isActive ? "step" : undefined}
                className={`w-full text-left p-3.5 rounded-xl border transition-all duration-200 flex flex-col gap-1.5 ${
                  isActive
                    ? "bg-[var(--card)] border-[var(--color-milet-amber)] shadow-xs ring-1 ring-[var(--color-milet-amber)]/20"
                    : isDone
                    ? "bg-[var(--card)] border-[var(--border)] hover:border-[var(--color-milet-amber)]/40 cursor-pointer"
                    : "bg-[var(--background)] border-[var(--border)] opacity-60 cursor-not-allowed"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold ${
                      isDone
                        ? "bg-emerald-500 text-white"
                        : isActive
                        ? "milet-amber-gradient text-white"
                        : "bg-[var(--border)] text-[var(--foreground)]/50"
                    }`}
                  >
                    {isDone ? <Check weight="bold" className="w-3 h-3" /> : index + 1}
                  </span>
                  <span className="text-[10px] font-mono uppercase text-[var(--foreground)]/50 tracking-wider">
                    {step.shortLabel}
                  </span>
                </div>
                <div className="font-semibold text-xs text-[var(--foreground)] truncate">
                  {step.label}
                </div>
                <div className="text-[11px] text-[var(--foreground)]/60 leading-tight line-clamp-1">
                  {step.description}
                </div>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
