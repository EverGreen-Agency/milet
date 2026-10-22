import { REPO_BLOB_URL, type PublicStatus } from "./status";

export interface RoadmapCard {
  status: PublicStatus;
  title: string;
  description: string;
  ids: string[];
  evidence: string;
}

export interface RoadmapLane {
  id: string;
  name: string;
  summary: string;
  cards: RoadmapCard[];
}

export const ROADMAP_UPDATED_AT = "21 out 2026";

export const ROADMAP_INTRO =
  "“Agora” representa a frente priorizada no backlog consolidado. A fatia de US-001–003, US-006–009 e US-013 já tem PWA pública, função sintética e uma fundação de contratos, PostgreSQL e worker validada em CI; serviços reais e os containers persistentes continuam pendentes.";

export const ROADMAP_LANES: RoadmapLane[] = [
  {
    id: "agora",
    name: "Agora",
    summary: "P0 · 15 histórias candidatas",
    cards: [
      {
        status: { label: "Protótipo parcial", tone: "prototype" },
        title: "Entender o caso e revisar a fatura",
        description:
          "Descoberta inicial, entrada de uma fatura de demonstração e conferência humana antes do diagnóstico.",
        ids: ["EP-01", "F1.1", "F1.2", "US-001", "US-002", "US-003"],
        evidence:
          "triagem, entrada sintética e revisão públicas em `/diagnostico`; leitura de fatura real ainda em testes assistidos.",
      },
      {
        status: { label: "Protótipo parcial", tone: "prototype" },
        title: "Diagnosticar e comparar alternativas",
        description:
          "Elegibilidade, linha de base, cenários explicáveis, solicitação e comparação padronizada de propostas.",
        ids: ["EP-02", "F2.1", "F2.2", "F2.3", "EP-03", "F3.1", "F3.2", "F3.3", "US-006", "US-007", "US-008", "US-009", "US-010", "US-012", "US-013"],
        evidence:
          "baseline, cenários e ranking all-in sintéticos testados em CI; contrato OpenAPI público, sem integração ou validação de mercado.",
      },
      {
        status: { label: "Planejado", tone: "planned" },
        title: "Acompanhar a decisão com operação visível",
        description:
          "Checklist, linha do tempo, economia prevista versus realizada e visão operacional com rastreabilidade.",
        ids: ["EP-04–EP-06", "F4.1", "F4.2", "F5.1", "F6.1", "F6.3", "US-016", "US-019", "US-021", "US-025", "US-027"],
        evidence: "backlog P0; operação, savings e trilha imutável não implementados.",
      },
    ],
  },
  {
    id: "proximo",
    name: "Próximo",
    summary: "P1 · 10 histórias planejadas",
    cards: [
      {
        status: { label: "Planejado", tone: "planned" },
        title: "Memória, consentimento e escolha",
        description:
          "Contexto histórico, compartilhamento controlado, retorno do fornecedor, esclarecimentos e transparência da remuneração — sempre sem spread oculto.",
        ids: ["EP-01", "F1.3", "EP-03", "F3.1", "F3.3", "US-004", "US-005", "US-011", "US-014", "US-015"],
        evidence: "histórias no backlog; controles reais de acesso e consentimento ainda necessários.",
      },
      {
        status: { label: "Planejado", tone: "planned" },
        title: "Formalizar, alertar e conectar a oferta",
        description:
          "Resumo e versão contratual, alertas de pendência e vencimento, além de um portal dedicado ao fornecedor.",
        ids: ["EP-04", "F4.1", "F4.2", "EP-05", "F5.2", "EP-06", "F6.2", "US-017", "US-018", "US-020", "US-022", "US-026"],
        evidence: "escopo documentado; assinatura, mensageria e integrações não comprovadas.",
      },
    ],
  },
  {
    id: "explorando",
    name: "Explorando",
    summary: "P2 · 5 hipóteses",
    cards: [
      {
        status: { label: "Planejado", tone: "planned" },
        title: "Reavaliar quando o contexto mudar",
        description:
          "Monitorar sinais relevantes e permitir uma nova rodada de comparação somente com autorização do cliente.",
        ids: ["EP-05", "F5.2", "US-023", "US-024"],
        evidence: "hipótese de produto; gatilhos e regras atuais ainda precisam ser validados.",
      },
      {
        status: { label: "Planejado", tone: "planned" },
        title: "Coordenar um portfólio de unidades",
        description:
          "Consolidar oportunidades e riscos de múltiplas unidades consumidoras para apoiar priorização.",
        ids: ["EP-06", "F6.1", "US-028"],
        evidence: "especificação recuperada; implementação não verificada.",
      },
      {
        status: { label: "Explorando · depende do Open Energy", tone: "planned" },
        title: "Passaporte Energético por API",
        description:
          "Contadores, ERPs, EPCs e comercializadoras acessam por API apenas os dados que a empresa autorizar, com consentimento revogável.",
        ids: ["UC-28"],
        evidence:
          "hipótese de negócio; o Open Energy segue em discussão na ANEEL (CP 7/2025) e nenhuma integração com parceiros existe.",
      },
      {
        status: { label: "Explorando · veio de entrevista", tone: "planned" },
        title: "Conferir a economia de quem já tem solar",
        description:
          "Ler na fatura a energia injetada, a compensada e o saldo de créditos e comparar com a geração prometida no projeto. Depois, dados do inversor via parceiros de monitoramento.",
        ids: ["US-021"],
        evidence:
          "pedido de uma PME entrevistada em out/2026; a fatura lida hoje ainda não traz os campos de geração distribuída.",
      },
    ],
  },
];

// Visão pública da arquitetura: nível de produto, sem hosts, políticas ou endpoints internos.
export const ARCHITECTURE_LAYERS: ReadonlyArray<{ name: string; role: string; tech: string }> = [
  {
    name: "Site e portais",
    role: "O que cada pessoa vê. Não contém regra de negócio nem segredo.",
    tech: "Next.js · React · TypeScript",
  },
  {
    name: "API do produto",
    role: "Um único serviço, dividido em módulos com fronteiras explícitas: acesso, empresas, faturas, diagnóstico, propostas, contratos, auditoria.",
    tech: "NestJS · TypeScript · Railway",
  },
  {
    name: "Motor de cálculo",
    role: "Regras tarifárias puras e testáveis, compartilhadas por API e telas, sem depender de framework.",
    tech: "TypeScript puro",
  },
  {
    name: "Dados e documentos",
    role: "Cada organização só enxerga o que é seu, garantido no próprio banco. Faturas ficam em armazenamento privado.",
    tech: "PostgreSQL · armazenamento privado S3",
  },
  {
    name: "Processamento assíncrono",
    role: "Leitura de faturas, e-mails e integrações rodam fora da requisição, com nova tentativa e registro de falhas.",
    tech: "Worker dedicado · fila transacional",
  },
];

export interface PortalPlan {
  id: string;
  name: string;
  who: string;
  sees: string[];
  neverSees: string;
  roles: string[];
  status: PublicStatus;
}

export const PORTALS: PortalPlan[] = [
  {
    id: "consumidor",
    name: "Portal do consumidor",
    who: "Empresas do Grupo A: dono, financeiro e operações.",
    sees: [
      "Suas unidades consumidoras, faturas e diagnósticos.",
      "Propostas recebidas, comparadas pelo custo total.",
      "Contrato escolhido e economia prevista versus realizada.",
    ],
    neverSees: "Dados de outras empresas ou a margem negociada entre terceiros.",
    roles: ["Responsável", "Analista"],
    status: { label: "Planejado", tone: "planned" },
  },
  {
    id: "comercializadora",
    name: "Portal da comercializadora",
    who: "Comercializadoras de energia que querem atender PMEs.",
    sees: [
      "Demandas qualificadas com perfil de consumo.",
      "Identificação da empresa somente depois que ela autorizar.",
      "Suas propostas e sua carteira.",
    ],
    neverSees: "Propostas de concorrentes ou a posição comprada em ranking — ela não existe.",
    roles: ["Administrador", "Operador"],
    status: { label: "Planejado", tone: "planned" },
  },
  {
    id: "usina",
    name: "Portal da usina",
    who: "Geradores e consórcios de geração distribuída.",
    sees: [
      "Suas usinas e capacidade disponível.",
      "Alocação de créditos e clientes vinculados que autorizaram.",
    ],
    neverSees: "Clientes que não escolheram a usina.",
    roles: ["Administrador", "Operador"],
    status: { label: "Explorando · escopo a validar", tone: "planned" },
  },
  {
    id: "backoffice",
    name: "Backoffice Milet",
    who: "Time Milet: operação, compliance e administração.",
    sees: [
      "Esteira operacional, aprovação de parceiros e pendências.",
      "Documentos de cliente apenas com justificativa registrada em auditoria.",
    ],
    neverSees: "Nada fora da trilha de auditoria: todo acesso deixa registro imutável.",
    roles: ["Operação", "Compliance (somente leitura)", "Administrador"],
    status: { label: "Planejado", tone: "planned" },
  },
];

export const ARCHITECTURE_PRINCIPLES: string[] = [
  "Permissão é decidida na API e reforçada no banco; a tela apenas esconde o que o usuário já não poderia ler.",
  "Toda pessoa pertence a uma organização com um papel. Sem organização, sem acesso.",
  "Comercializadoras e usinas recebem dados da empresa só após autorização explícita dela.",
  "Um serviço bem dividido antes de vários serviços: separamos módulos quando houver motivo medido, não por antecipação.",
];

export interface EvidenceCard {
  status: PublicStatus;
  title: string;
  description: string;
  links?: { label: string; href: string; external?: boolean }[];
}

export const CURRENT_EVIDENCE: EvidenceCard[] = [
  {
    status: { label: "Implementado", tone: "implemented" },
    title: "Presença pública e documentação",
    description:
      "Brandbook, apresentações, backlog acadêmico, PWA sintética, contratos e estas superfícies estão publicados com limites verificáveis.",
  },
  {
    status: { label: "Código + CI", tone: "implemented" },
    title: "Fundação de runtime",
    description:
      "A função sintética está pública. API persistente, PostgreSQL, auditoria, outbox e worker têm containers e testes reproduzíveis, mas ainda não estão hospedados nem operam dados reais.",
    links: [
      { label: "Ver contrato da API", href: "/openapi/v1/openapi.json", external: true },
      { label: "Ler a evidência", href: "/build-in-public" },
    ],
  },
  {
    status: { label: "Protótipo", tone: "prototype" },
    title: "Laboratório de motion 3D",
    description:
      "Experiência procedural com seis estados, timeline e interação. É uma exploração de linguagem visual, não uma capacidade energética.",
    links: [{ label: "Abrir laboratório", href: `${REPO_BLOB_URL}/academico/motion/motion-3d.html`, external: true }],
  },
  {
    status: { label: "Protótipo", tone: "prototype" },
    title: "Diagnóstico demonstrativo do fluxo PME",
    description:
      "A jornada de diagnóstico é navegável com casos sintéticos e leitura assistida de fatura. Não há contratação nem serviços de mercado reais por trás da experiência.",
    links: [{ label: "Entrar na demonstração", href: "/diagnostico" }],
  },
  {
    status: { label: "Não validado", tone: "planned" },
    title: "Operação e resultado real",
    description:
      "Não há evidência aqui de clientes, pilotos, OCR real, economia realizada, parceiros integrados ou contratação em produção.",
  },
];
