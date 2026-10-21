import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import {
  ROADMAP_UPDATED_AT,
  ROADMAP_INTRO,
  ROADMAP_LANES,
  ARCHITECTURE_LAYERS,
  PORTALS,
  ARCHITECTURE_PRINCIPLES,
  CURRENT_EVIDENCE,
} from "@/content/roadmap";
import { STATUS_LEGEND } from "@/content/status";
import { StatusChip, RichText, SectionHeading } from "@/components/public/primitives";
import { SectionRail, type RailItem } from "@/components/public/section-rail";
import { ActionLink } from "@/components/public/action-link";

export const metadata: Metadata = {
  title: "Roadmap Público · Milet | Prioridades, Evidências e Arquitetura",
  description:
    "Roadmap público da Milet: prioridades atuais (Agora, Próximo, Explorando), evidências verificáveis, camadas da aplicação e desenho dos portais.",
};

const RAIL_ITEMS: RailItem[] = [
  { id: "hero", label: "Início" },
  { id: "legenda", label: "Estados" },
  { id: "agora", label: "Agora", meta: "P0" },
  { id: "proximo", label: "Próximo", meta: "P1" },
  { id: "explorando", label: "Explorando", meta: "P2" },
  { id: "arquitetura", label: "Arquitetura" },
  { id: "portais", label: "Portais & RBAC" },
  { id: "evidencias", label: "Evidência Atual" },
];

export default function RoadmapPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)]">
      <Navbar />
      <SectionRail title="Roadmap" items={RAIL_ITEMS} />

      <main id="conteudo" className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Hero Section */}
        <header id="hero" className="mb-14 scroll-mt-24">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold uppercase tracking-wider bg-[var(--color-milet-amber)]/10 text-[var(--color-milet-amber-dark)] dark:text-[var(--color-milet-amber-light)] border border-[var(--color-milet-amber)]/20 mb-4">
            <span>Roadmap público · atualizado em {ROADMAP_UPDATED_AT}</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-[var(--foreground)] mb-4 leading-tight">
            O caminho entre a hipótese e a <em>evidência.</em>
          </h1>

          <p className="text-base sm:text-lg text-[var(--foreground)]/70 max-w-3xl leading-relaxed mb-6">
            A Milet quer ajudar pequenas e médias empresas a entender, comparar e acompanhar decisões de energia. Este mapa mostra prioridades por resultado — sem tratar especificação como produto pronto nem transformar metas em promessas.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <ActionLink href="/diagnostico" label="Experimentar diagnóstico" variant="primary" />
            <ActionLink href="/build-in-public" label="Ver changelog verificável" variant="secondary" />
          </div>
        </header>

        {/* Legenda de Estados */}
        <section id="legenda" aria-label="Legenda de estados" className="mb-16 scroll-mt-24">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-5 rounded-2xl bg-[var(--card)] border border-[var(--border)] shadow-sm">
            {STATUS_LEGEND.map((item) => (
              <div key={item.tone} className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <StatusChip label={item.label} tone={item.tone} />
                </div>
                <strong className="text-sm font-semibold mt-1">{item.title}</strong>
                <p className="text-xs text-[var(--foreground)]/65 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Lanes do Roadmap: Agora / Próximo / Explorando */}
        <section aria-labelledby="mapa-roadmap" className="space-y-14 mb-20">
          <SectionHeading
            id="mapa-roadmap"
            kicker="Agora / Próximo / Explorando"
            title="Resultados em sequência, não funcionalidades soltas."
            description={ROADMAP_INTRO}
          />

          {ROADMAP_LANES.map((lane) => (
            <section key={lane.id} id={lane.id} className="scroll-mt-24">
              <div className="flex items-baseline justify-between border-b border-[var(--border)] pb-3 mb-6">
                <h3 className="font-serif text-2xl font-semibold text-[var(--foreground)]">{lane.name}</h3>
                <span className="font-mono text-xs text-[var(--foreground)]/60 font-semibold">{lane.summary}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {lane.cards.map((card, idx) => (
                  <article
                    key={idx}
                    className="flex flex-col justify-between p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)] hover:border-[var(--color-milet-amber)]/40 transition-colors shadow-sm"
                  >
                    <div>
                      <div className="mb-3">
                        <StatusChip label={card.status.label} tone={card.status.tone} />
                      </div>
                      <h4 className="font-serif text-lg font-semibold mb-2 leading-snug">{card.title}</h4>
                      <p className="text-sm text-[var(--foreground)]/70 leading-relaxed mb-4">{card.description}</p>

                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {card.ids.map((id) => (
                          <span
                            key={id}
                            className="font-mono text-[0.65rem] px-2 py-0.5 rounded bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)]/60"
                          >
                            {id}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[var(--border)] text-xs text-[var(--foreground)]/65 leading-relaxed">
                      <strong className="text-[var(--foreground)]">Evidência: </strong>
                      <RichText text={card.evidence} />
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </section>

        {/* Camadas da Aplicação e Arquitetura */}
        <section id="arquitetura" className="mb-20 scroll-mt-24">
          <SectionHeading
            id="heading-arquitetura"
            kicker="Arquitetura de Escala"
            title="Camadas da aplicação e fronteiras de responsabilidade."
            description="Como a Milet se organiza para processar faturas, gerenciar contratos e conectar o mercado livre sem gargalos e com segurança por design."
          />

          <div className="space-y-3 mb-8">
            {ARCHITECTURE_LAYERS.map((layer, idx) => (
              <div
                key={idx}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl bg-[var(--card)] border border-[var(--border)] gap-3"
              >
                <div className="max-w-xl">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[var(--color-milet-amber)]">0{idx + 1}</span>
                    <strong className="text-sm sm:text-base font-semibold">{layer.name}</strong>
                  </div>
                  <p className="text-xs sm:text-sm text-[var(--foreground)]/70 mt-1">{layer.role}</p>
                </div>
                <span className="font-mono text-xs px-3 py-1 rounded-lg bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)]/70 shrink-0 self-start sm:self-auto">
                  {layer.tech}
                </span>
              </div>
            ))}
          </div>

          <div className="p-6 rounded-2xl bg-[var(--card)] border-l-4 border-l-[var(--color-milet-amber)] border border-[var(--border)]">
            <h4 className="font-serif text-base font-semibold mb-3">Princípios Arquiteturais Inegociáveis</h4>
            <ul className="space-y-2 text-xs sm:text-sm text-[var(--foreground)]/75">
              {ARCHITECTURE_PRINCIPLES.map((principle, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-[var(--color-milet-amber)] font-bold">✓</span>
                  <span>{principle}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Os 4 Portais e Níveis de Acesso (RBAC) */}
        <section id="portais" className="mb-20 scroll-mt-24">
          <SectionHeading
            id="heading-portais"
            kicker="Superfícies de Usuário & RBAC"
            title="Quatro portais dedicados com isolamento estrito de visualização."
            description="Nenhuma empresa vê dados de outra; comercializadoras não compram posições nem enxergam concorrentes."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {PORTALS.map((portal) => (
              <article
                key={portal.id}
                className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <h4 className="font-serif text-xl font-semibold">{portal.name}</h4>
                    <StatusChip label={portal.status.label} tone={portal.status.tone} />
                  </div>

                  <p className="text-xs sm:text-sm text-[var(--foreground)]/70 font-medium mb-4">
                    <strong>Público:</strong> {portal.who}
                  </p>

                  <div className="mb-4">
                    <span className="font-mono text-[0.68rem] uppercase font-bold text-[var(--foreground)]/60 block mb-1.5">
                      O que acessa e visualiza:
                    </span>
                    <ul className="space-y-1 text-xs text-[var(--foreground)]/75">
                      {portal.sees.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-emerald-600 font-bold">→</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-200 mb-4">
                    <strong>O que NUNCA enxerga: </strong>
                    <span>{portal.neverSees}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-[var(--border)] flex items-center justify-between">
                  <span className="text-xs text-[var(--foreground)]/60 font-mono">Papéis (Roles):</span>
                  <div className="flex gap-1.5 flex-wrap">
                    {portal.roles.map((role) => (
                      <span
                        key={role}
                        className="font-mono text-[0.65rem] px-2 py-0.5 rounded bg-[var(--background)] border border-[var(--border)] font-semibold"
                      >
                        {role}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Evidências Atuais */}
        <section id="evidencias" className="mb-14 scroll-mt-24">
          <SectionHeading
            id="heading-evidencias"
            kicker="Evidência Atual"
            title="O que já existe não é o produto completo."
            description="Transparência sobre o que está no repositório versus o que ainda é protótipo ou teste assistido."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {CURRENT_EVIDENCE.map((item, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-[var(--card)] border border-[var(--border)] flex flex-col justify-between"
              >
                <div>
                  <div className="mb-2">
                    <StatusChip label={item.status.label} tone={item.status.tone} />
                  </div>
                  <h4 className="font-serif text-base font-semibold mb-2">{item.title}</h4>
                  <p className="text-xs sm:text-sm text-[var(--foreground)]/70 mb-4 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {item.links && item.links.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-[var(--border)]">
                    {item.links.map((link, lIdx) => (
                      <ActionLink
                        key={lIdx}
                        href={link.href}
                        label={link.label}
                        external={link.external}
                        variant="chip"
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
