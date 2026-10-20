"use client";

import Link from "next/link";
import { ShieldCheck, ArrowRight } from "@phosphor-icons/react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--border)] milet-glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          {/* eslint-disable-next-line @next/next/no-img-element -- SVG estático da marca, sem otimização */}
          <img
            src="/assets/logo/svg/milet-symbol-amber.svg"
            alt=""
            width={32}
            height={32}
            className="w-8 h-8 transition-transform duration-200 group-hover:scale-105"
          />
          <span className="font-serif font-bold text-xl tracking-tight text-[var(--foreground)]">
            Milet
          </span>
          <span className="hidden sm:inline-block ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-[var(--color-milet-amber)]/10 text-[var(--color-milet-amber-dark)] dark:text-[var(--color-milet-amber-light)] border border-[var(--color-milet-amber)]/20">
            Beta Assistido
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[var(--foreground)]/80">
          <Link href="/diagnostico" className="hover:text-[var(--color-milet-amber)] transition-colors">
            Diagnóstico
          </Link>
          <a href="/build-in-public.html" className="hover:text-[var(--color-milet-amber)] transition-colors">
            Build in Public
          </a>
          <a href="/brandbook.html" className="hover:text-[var(--color-milet-amber)] transition-colors">
            Brandbook
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/diagnostico"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white milet-amber-gradient shadow-sm hover:opacity-95 transition-all duration-200 active:scale-95"
          >
            <span>Analisar Fatura</span>
            <ArrowRight weight="bold" className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </header>
  );
}
