"use client";

import { useEffect, useState } from "react";

export interface RailItem {
  id: string;
  label: string;
  meta?: string;
}

// Índice lateral: traços em repouso, títulos ao passar o mouse ou focar via teclado.
// Links âncora funcionam sem JS; o script só sincroniza o item ativo com a rolagem.
export function SectionRail({ title, items }: { title: string; items: RailItem[] }) {
  const [activeId, setActiveId] = useState(items[0]?.id);

  useEffect(() => {
    const targets = items
      .map((item) => document.getElementById(item.id))
      .filter((element): element is HTMLElement => element !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      // Faixa no terço superior da tela: o item ativo é o que está sendo lido, não o que mal apareceu.
      { rootMargin: "-20% 0px -65% 0px" },
    );

    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav
      aria-label={title}
      className="group fixed left-5 top-1/2 z-40 hidden -translate-y-1/2 rounded-2xl border border-transparent p-3 transition-[background-color,border-color,box-shadow] duration-200 ease-out focus-within:border-[var(--border)] focus-within:bg-[var(--card)]/95 focus-within:shadow-xl hover:border-[var(--border)] hover:bg-[var(--card)]/95 hover:shadow-xl hover:backdrop-blur-xl xl:block"
    >
      <p className="mb-2 max-w-0 overflow-hidden whitespace-nowrap font-mono text-[0.62rem] font-bold uppercase tracking-widest text-[var(--color-milet-amber-dark)] opacity-0 transition-all duration-200 ease-out group-focus-within:max-w-56 group-focus-within:opacity-100 group-hover:max-w-56 group-hover:opacity-100 dark:text-[var(--color-milet-amber-light)]">
        {title}
      </p>
      <ol className="flex flex-col gap-1">
        {items.map((item) => {
          const isActive = item.id === activeId;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={isActive ? "location" : undefined}
                className="flex items-center gap-3 rounded-md py-1.5 pr-1 outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-milet-amber)]"
              >
                <span
                  aria-hidden="true"
                  className={`block shrink-0 rounded-full transition-all duration-200 ease-out ${
                    isActive
                      ? "h-[3px] w-7 bg-[var(--color-milet-amber)]"
                      : "h-0.5 w-3.5 bg-[var(--border-strong)] group-hover:w-5"
                  }`}
                />
                <span
                  className={`flex max-w-0 items-baseline gap-2 overflow-hidden whitespace-nowrap text-xs opacity-0 transition-all duration-200 ease-out group-focus-within:max-w-56 group-focus-within:opacity-100 group-hover:max-w-56 group-hover:opacity-100 ${
                    isActive ? "font-semibold text-[var(--foreground)]" : "text-[var(--foreground)]/65"
                  }`}
                >
                  {item.label}
                  {item.meta ? (
                    <span className="font-mono text-[0.62rem] text-[var(--foreground)]/45">{item.meta}</span>
                  ) : null}
                </span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
