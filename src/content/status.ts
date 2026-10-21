// Vocabulário único de estados públicos. Roadmap e build in public precisam usar
// a mesma escala para que "implementado" nunca seja lido como "validado".
export type StatusTone = "planned" | "prototype" | "implemented" | "validated";

export interface PublicStatus {
  label: string;
  tone: StatusTone;
}

export const STATUS_LEGEND: ReadonlyArray<{ tone: StatusTone; label: string; title: string; description: string }> = [
  {
    tone: "planned",
    label: "Planejado",
    title: "Prioridade documentada",
    description: "Há escopo e IDs rastreáveis; ainda não há fluxo executável comprovado.",
  },
  {
    tone: "prototype",
    label: "Protótipo",
    title: "Experiência navegável",
    description: "Pode usar dados sintéticos e serviços simulados. Não equivale a operação real.",
  },
  {
    tone: "implemented",
    label: "Implementado",
    title: "Código disponível",
    description: "A capacidade existe no repositório, mas pode aguardar integração ou validação externa.",
  },
  {
    tone: "validated",
    label: "Validado",
    title: "Evidência no contexto-alvo",
    description: "Exige teste registrado; validação local não prova operação em produção.",
  },
];

// Artefatos acadêmicos não são publicados no site; o repositório público é a fonte.
export const REPO_BLOB_URL = "https://github.com/EverGreen-Agency/milet/blob/main";
