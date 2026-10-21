"use client";

import {
  Sparkle,
  ShieldCheck,
  Scales,
  FileText,
  Lock,
  ChartLineUp,
  Cpu,
  CheckCircle
} from "@phosphor-icons/react";

export function BentoFeatures() {
  return (
    <section id="como-funciona" className="py-16 md:py-24 border-t border-[var(--border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-wider text-[var(--color-milet-amber-dark)] dark:text-[var(--color-milet-amber-light)] font-bold">
            Arquitetura & Rigor Técnico
          </span>
          <h2 className="mt-2 font-serif text-3xl sm:text-4xl font-bold text-[var(--foreground)]">
            Por que o Milet é diferente de um corretor tradicional?
          </h2>
          <p className="mt-4 text-sm sm:text-base text-[var(--foreground)]/70 leading-relaxed">
            Corretores convencionais costumam ganhar comissão percentual, variável e não informada, paga pela comercializadora, o que incentiva contratos mais longos e caros. No Milet, a remuneração é fixa, igual para todos os fornecedores e mostrada a você, e cada linha da sua fatura é conferida.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Leitura automática da fatura (Spans 2 cols on md) */}
          <div className="md:col-span-2 rounded-2xl bg-[var(--card)] border border-[var(--border)] p-8 shadow-xs hover:border-[var(--color-milet-amber)]/40 transition-all duration-300 relative overflow-hidden flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-[var(--color-milet-amber)]/10 text-[var(--color-milet-amber-dark)] dark:text-[var(--color-milet-amber-light)] flex items-center justify-center">
                <Sparkle weight="fill" className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-xl text-[var(--foreground)]">
                Leitura automática da fatura
              </h3>
              <p className="text-sm text-[var(--foreground)]/70 leading-relaxed max-w-xl">
                Envie o PDF original ou a foto da conta de luz. A leitura automática organiza medição, demanda na ponta e fora de ponta, tributos (ICMS/PIS/COFINS) e bandeiras tarifárias, sem digitação manual, e você confere tudo antes do diagnóstico.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-[var(--border)] grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="space-y-1">
                <span className="text-xs text-[var(--foreground)]/50">Tempo médio</span>
                <p className="font-mono font-bold text-sm text-[var(--foreground)]">~2.4 seg</p>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-[var(--foreground)]/50">Resultado</span>
                <p className="font-mono font-bold text-sm text-[var(--foreground)]">Passaporte Energético</p>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-[var(--foreground)]/50">Armazenamento</span>
                <p className="font-mono font-bold text-sm text-[var(--foreground)]">Privado e criptografado</p>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-[var(--foreground)]/50">Conferência</span>
                <p className="font-mono font-bold text-sm text-[var(--foreground)]">Feita por você</p>
              </div>
            </div>
          </div>

          {/* Card 2: Armazenamento privado & LGPD (1 col) */}
          <div className="rounded-2xl bg-[var(--card)] border border-[var(--border)] p-8 shadow-xs hover:border-[var(--color-milet-amber)]/40 transition-all duration-300 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-[var(--color-milet-copper)]/10 text-[var(--color-milet-copper)] flex items-center justify-center">
                <Lock weight="fill" className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-xl text-[var(--foreground)]">
                Quarentena Segura de Faturas
              </h3>
              <p className="text-sm text-[var(--foreground)]/70 leading-relaxed">
                Suas faturas ficam em armazenamento privado e criptografado, com prazo de retenção definido e exclusão quando você pedir.
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-[var(--border)] flex items-center gap-2 text-xs text-[var(--foreground)]/60 font-medium">
              <ShieldCheck weight="fill" className="w-4 h-4 text-emerald-500" />
              <span>Sem rastreamento invasivo ou venda de leads</span>
            </div>
          </div>

          {/* Card 3: Custos All-In Transparentes (1 col) */}
          <div className="rounded-2xl bg-[var(--card)] border border-[var(--border)] p-8 shadow-xs hover:border-[var(--color-milet-amber)]/40 transition-all duration-300 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                <Scales weight="fill" className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-xl text-[var(--foreground)]">
                Comparação All-In Sem Pegadinhas
              </h3>
              <p className="text-sm text-[var(--foreground)]/70 leading-relaxed">
                Contratos de mercado livre escondem taxa de custódia CCEE, encargos de rede e garantias bancárias. O Milet unifica todos os custos na ponta do lápis.
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-[var(--border)] flex items-center gap-2 text-xs text-emerald-600 font-medium">
              <CheckCircle weight="fill" className="w-4 h-4" />
              <span>Custo total real com remuneração declarada</span>
            </div>
          </div>

          {/* Card 4: Cobertura Regulatória ANEEL & Mercado Livre (Spans 2 cols on md) */}
          <div className="md:col-span-2 rounded-2xl bg-[var(--card)] border border-[var(--border)] p-8 shadow-xs hover:border-[var(--color-milet-amber)]/40 transition-all duration-300 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-[var(--color-milet-amber)]/10 text-[var(--color-milet-amber-dark)] dark:text-[var(--color-milet-amber-light)] flex items-center justify-center">
                <Cpu weight="fill" className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-xl text-[var(--foreground)]">
                Regras Tarifárias e Portaria 50/2022 Atualizadas
              </h3>
              <p className="text-sm text-[var(--foreground)]/70 leading-relaxed max-w-xl">
                Classificação automática entre opções do Grupo A (Tarifas Horossazonais Verde e Azul) e alternativas de Geração Distribuída para baixa tensão (Grupo B), mapeando o risco regulatório e a viabilidade de retorno em cada estado.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-[var(--border)] flex flex-wrap items-center gap-4 text-xs font-mono text-[var(--foreground)]/70">
              <span className="px-2.5 py-1 rounded bg-[var(--background)] border border-[var(--border)]">
                Portaria MME 50/2022
              </span>
              <span className="px-2.5 py-1 rounded bg-[var(--background)] border border-[var(--border)]">
                Marco Legal GD (Lei 14.300)
              </span>
              <span className="px-2.5 py-1 rounded bg-[var(--background)] border border-[var(--border)]">
                Resolução Normativa ANEEL 1.000
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
