"use client";

import { Check, X, ShieldCheck } from "@phosphor-icons/react";

export function ComparisonSection() {
  const points = [
    {
      feature: "Remuneração e Conflito de Interesses",
      traditional: "Comissão percentual secreta paga pela comercializadora por kWh contratado (incentivo a inflar consumo)",
      milet: "Remuneração fixa, igual para todos os fornecedores e mostrada na comparação. Nenhuma oferta paga para aparecer primeiro."
    },
    {
      feature: "Leitura e Diagnóstico da Fatura",
      traditional: "Planilha manual preenchida por estagiários, propensa a erros em datas e demandas",
      milet: "Leitura automática da fatura em segundos, com cada campo conferido por você na tela."
    },
    {
      feature: "Segurança de Dados e LGPD",
      traditional: "Sua fatura circula desprotegida por grupos de WhatsApp e e-mails de corretores autônomos",
      milet: "Armazenamento privado e criptografado, com prazo de retenção e exclusão sob demanda."
    },
    {
      feature: "Comparação de Custos All-In",
      traditional: "Apresenta apenas o preço puro da energia, escondendo TUSD residual, tributos e encargos CCEE",
      milet: "Soma matemática completa: conta da distribuidora + energia livre + impostos + serviço Milet."
    },
    {
      feature: "Portabilidade e Cancelamento",
      traditional: "Cláusulas abusivas com multas astronômicas e fidelidade compulsória de 60 meses",
      milet: "Transparência total dos prazos regulatórios e condições de saída sem amarras ocultas."
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-[var(--card)] border-t border-[var(--border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-wider text-[var(--color-milet-amber-dark)] dark:text-[var(--color-milet-amber-light)] font-bold">
            Transparência Radical
          </span>
          <h2 className="mt-2 font-serif text-3xl sm:text-4xl font-bold text-[var(--foreground)]">
            A diferença no seu bolso e na sua tranquilidade
          </h2>
          <p className="mt-4 text-sm sm:text-base text-[var(--foreground)]/70">
            Compare o modelo tradicional de corretagem com o modelo de governança independente Milet.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--border-strong)]">
                <th className="py-4 px-6 text-xs uppercase tracking-wider text-[var(--foreground)]/60 font-semibold w-1/3">
                  Critério de Decisão
                </th>
                <th className="py-4 px-6 text-xs uppercase tracking-wider text-[var(--foreground)]/60 font-semibold w-1/3 bg-[var(--background)]/50 rounded-t-xl">
                  Corretores / Tradings Tradicionais
                </th>
                <th className="py-4 px-6 text-xs uppercase tracking-wider text-[var(--color-milet-amber-dark)] dark:text-[var(--color-milet-amber-light)] font-bold w-1/3 bg-[var(--color-milet-amber)]/5 rounded-t-xl border-t-2 border-[var(--color-milet-amber)]">
                  Plataforma Milet
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)] text-sm">
              {points.map((pt, i) => (
                <tr key={i} className="hover:bg-[var(--background)]/40 transition-colors">
                  <td className="py-5 px-6 font-semibold text-[var(--foreground)] text-xs sm:text-sm">
                    {pt.feature}
                  </td>
                  <td className="py-5 px-6 bg-[var(--background)]/50 text-[var(--foreground)]/70 text-xs sm:text-sm">
                    <div className="flex items-start gap-2">
                      <X weight="bold" className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                      <span>{pt.traditional}</span>
                    </div>
                  </td>
                  <td className="py-5 px-6 bg-[var(--color-milet-amber)]/5 font-medium text-[var(--foreground)] text-xs sm:text-sm">
                    <div className="flex items-start gap-2">
                      <Check weight="bold" className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{pt.milet}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
