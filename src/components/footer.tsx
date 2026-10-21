"use client";

import Link from "next/link";
import { ShieldCheck, Lock, Code, FileText } from "@phosphor-icons/react";

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--background)] py-12 text-sm text-[var(--foreground)]/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-3">
            <span className="font-serif font-bold text-lg text-[var(--foreground)]">Milet</span>
            <p className="text-xs leading-relaxed text-[var(--foreground)]/60">
              Energia em Mais Liberdade. Plataforma independente para comparação e contratação transparente no Mercado Livre e Geração Distribuída.
            </p>
            <div className="flex items-center gap-2 text-xs text-[var(--color-milet-amber-dark)] dark:text-[var(--color-milet-amber-light)] font-medium">
              <ShieldCheck weight="fill" className="w-4 h-4" />
              <span>Conformidade LGPD & ANEEL</span>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-[var(--foreground)] mb-3 text-xs uppercase tracking-wider">
              Produto & Auditoria
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/diagnostico" className="hover:text-[var(--color-milet-amber)] transition-colors">
                  Diagnóstico de Faturas
                </Link>
              </li>
              <li>
                <Link href="/build-in-public" className="hover:text-[var(--color-milet-amber)] transition-colors">
                  Build in Public
                </Link>
              </li>
              <li>
                <Link href="/roadmap" className="hover:text-[var(--color-milet-amber)] transition-colors">
                  Roadmap Aberto
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-[var(--foreground)] mb-3 text-xs uppercase tracking-wider">
              Documentação & Marca
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="/brandbook.html" className="hover:text-[var(--color-milet-amber)] transition-colors">
                  Brandbook & Identidade
                </a>
              </li>
              <li>
                <a href="/roadmap.html" className="hover:text-[var(--color-milet-amber)] transition-colors">
                  Roadmap Operacional
                </a>
              </li>
              <li>
                <a href="/academico/decks/presentation.html" className="hover:text-[var(--color-milet-amber)] transition-colors">
                  Apresentação de Projeto
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-2 text-xs">
            <h4 className="font-semibold text-[var(--foreground)] mb-3 text-xs uppercase tracking-wider">
              Segurança & Governança
            </h4>
            <p className="text-xs leading-relaxed text-[var(--foreground)]/60">
              Faturas guardadas em armazenamento privado e criptografado. Leitura automática só com o seu consentimento explícito.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-[var(--foreground)]/80">
              <Lock weight="bold" className="w-3.5 h-3.5 text-[var(--color-milet-amber)]" />
              <span>Sem venda de dados a terceiros</span>
            </div>
          </div>
        </div>

        <div className="border-t border-[var(--border)] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--foreground)]/50">
          <p>© {new Date().getFullYear()} Milet Energia S.A. Todos os direitos reservados.</p>
          <p className="text-center sm:text-right">
            Valores simulados nominais com base em tarifas ANEEL. Sem garantia contratual de economia futura.
          </p>
        </div>
      </div>
    </footer>
  );
}
