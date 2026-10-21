import type { StatusTone } from "@/content/status";

const TONE_CLASSES: Record<StatusTone, string> = {
  planned: "bg-[var(--foreground)]/5 text-[var(--foreground)]/70 border-[var(--border-strong)]",
  prototype: "bg-[var(--color-milet-copper)]/10 text-[var(--color-milet-copper)] border-[var(--color-milet-copper)]/25",
  implemented:
    "bg-[var(--color-milet-amber)]/10 text-[var(--color-milet-amber-dark)] dark:text-[var(--color-milet-amber-light)] border-[var(--color-milet-amber)]/30",
  validated: "bg-emerald-600/10 text-emerald-700 dark:text-emerald-300 border-emerald-600/25",
};

export function StatusChip({ label, tone }: { label: string; tone: StatusTone }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[0.68rem] font-semibold uppercase tracking-wider ${TONE_CLASSES[tone]}`}
    >
      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-current" />
      {label}
    </span>
  );
}

// Converte trechos entre crases em <code>, mantendo o conteúdo como texto puro nos dados.
export function RichText({ text }: { text: string }) {
  const parts = text.split("`");
  return (
    <>
      {parts.map((part, index) =>
        index % 2 === 1 ? (
          <code
            key={index}
            className="rounded border border-[var(--border)] bg-[var(--background)] px-1.5 py-0.5 font-mono text-[0.85em] text-[var(--foreground)]"
          >
            {part}
          </code>
        ) : (
          <span key={index}>{part}</span>
        ),
      )}
    </>
  );
}

export function SectionHeading({
  id,
  kicker,
  title,
  description,
}: {
  id: string;
  kicker: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-8 max-w-3xl">
      <span className="font-mono text-xs font-bold uppercase tracking-widest text-[var(--color-milet-amber-dark)] dark:text-[var(--color-milet-amber-light)]">
        {kicker}
      </span>
      <h2 id={id} className="mt-2 font-serif text-2xl font-semibold tracking-tight sm:text-3xl">
        {title}
      </h2>
      {description ? <p className="mt-3 leading-relaxed text-[var(--foreground)]/70">{description}</p> : null}
    </div>
  );
}
