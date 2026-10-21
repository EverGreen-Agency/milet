import { REPO_BLOB_URL, type PublicStatus } from "./status";

// Trechos entre crases são renderizados como <code>.
export interface ChangelogLink {
  label: string;
  href: string;
  external?: boolean;
}

export interface ChangelogEntry {
  id: string;
  number: string;
  area: string;
  railLabel: string;
  date: string;
  dateLabel: string;
  dateShort: string;
  status: PublicStatus;
  title: string;
  problem: string;
  deliveries: string[];
  evidence: string;
  limit: string;
  links?: ChangelogLink[];
}

export const CHANGELOG: ChangelogEntry[] = [
  {
    id: "entry-006",
    number: "006",
    area: "Arquitetura & Stack",
    railLabel: "Arquitetura-alvo",
    date: "2026-10-21",
    dateLabel: "21 de outubro de 2026",
    dateShort: "21 OUT",
    status: { label: "Implementado no código", tone: "implemented" },
    title: "As páginas públicas entraram na mesma stack do produto, e a arquitetura-alvo foi registrada.",
    problem:
      "Roadmap e atualizações eram HTML solto na raiz, copiados por script próprio, enquanto protótipos antigos (`/app`, `/v2`, demo) continuavam publicados ao lado do diagnóstico atual.",
    deliveries: [
      "Roadmap e build in public viraram rotas Next.js com conteúdo versionado em TypeScript; o HTML original foi arquivado sem perda de texto.",
      "Protótipos legados deixam de ser publicados; seus endereços antigos redirecionam para `/diagnostico`.",
      "Arquitetura-alvo registrada: monolito modular (API NestJS + worker) na Railway, Next.js como camada de apresentação, PostgreSQL com isolamento por organização.",
      "Quatro portais e seus perfis de acesso definidos como plano: consumidor, comercializadora, usina e backoffice Milet.",
    ],
    evidence:
      "Build de produção gera `/roadmap` e `/build-in-public` como páginas estáticas; typecheck e suíte de testes aprovados.",
    limit:
      "Portais, login e permissões ainda não existem em código. O diagnóstico público continua sendo uma demonstração.",
    links: [{ label: "Ver plano no roadmap", href: "/roadmap#arquitetura" }],
  },
  {
    id: "entry-005",
    number: "005",
    area: "Storage & Intake",
    railLabel: "Storage & S3",
    date: "2026-10-19",
    dateLabel: "19 de outubro de 2026",
    dateShort: "19 OUT",
    status: { label: "Implementado na infra", tone: "implemented" },
    title: "Bucket S3 privado na Railway e segredos de produção ativos para intake consentido.",
    problem:
      "Para viabilizar upload seguro de faturas reais sem expor documentos publicamente, é necessária infraestrutura de quarentena com chaves de acesso criptografadas no servidor.",
    deliveries: [
      "Provisionamento de bucket privado S3-compatível na infraestrutura Railway.",
      "Cadastro de segredos de ambiente criptografados na Vercel (Produção e Preview) para integração com Gemini, Resend e S3.",
      "Isolamento rigoroso entre artefatos acadêmicos de especificação e o código de produto voltado ao usuário final.",
      "Fluxo de intake PME do Grupo A ativo com validação, consentimento explícito e triagem por IA com limites claros.",
    ],
    evidence:
      "Credenciais S3 validadas na Vercel; endpoint `POST /v1/intakes` operacional com fallback seguro em caso de indisponibilidade.",
    limit:
      "O upload de documentos reais com OCR direto permanecerá em fase de testes assistidos com revisão humana antes da abertura irrestrita ao público.",
    links: [{ label: "Acessar diagnóstico", href: "/diagnostico" }],
  },
  {
    id: "entry-004",
    number: "004",
    area: "Mobile Web",
    railLabel: "Mobile Web PWA",
    date: "2026-10-04",
    dateLabel: "04 de outubro de 2026",
    dateShort: "04 OUT",
    status: { label: "Implementado no código", tone: "implemented" },
    title: "A jornada passou a ser instalável e resiliente à perda de rede.",
    problem:
      "O layout já era responsivo, mas ainda não existiam manifest, instalação ou um app shell offline verificável.",
    deliveries: [
      "PWA com nome, ícones oficiais, modo standalone e botão de instalação quando o navegador oferece o evento.",
      "Service worker armazena somente o shell e as fixtures sintéticas necessárias para abrir a jornada sem rede.",
      "Rotas de `/api` são excluídas explicitamente do cache; indisponibilidade aciona fallback local imediato na interface.",
    ],
    evidence:
      "Manifest, ícones e política do service worker são testados; a instalação pública é comprovada via artefatos em produção.",
    limit:
      "PWA não significa aplicativo nativo, distribuição em loja, push ou sincronização de dados reais sem autenticação.",
    links: [{ label: "Testar no app", href: "/diagnostico" }],
  },
  {
    id: "entry-003",
    number: "003",
    area: "API Sintética",
    railLabel: "API Sintética",
    date: "2026-10-04",
    dateLabel: "04 de outubro de 2026",
    dateShort: "04 OUT",
    status: { label: "Publicado", tone: "implemented" },
    title: "O app ganhou um endpoint público mínimo sem fingir persistência.",
    problem:
      "O frontend publicado só conseguia usar a fixture embutida, mesmo já existindo um contrato versionado para o caso sintético.",
    deliveries: [
      "Função Vercel same-origin em `/api/v1/cases/CASE-UC-MG-00482`, restrita à fixture canônica `synthetic_demo_only`.",
      "O app tenta a API por padrão; se ela não responder, mantém a jornada com fallback local identificado no topo da tela.",
      "Contrato, correlação e limites são testados sem banco, secrets, upload ou qualquer dado pessoal.",
    ],
    evidence:
      "Produção observada com HTTP 200, `synthetic_demo_only`, correlação preservada e `private, no-store`.",
    limit:
      "Este endpoint é stateless e público apenas para demonstração. Não é a API com PostgreSQL, OCR ou cobrança.",
    links: [
      { label: "Ver endpoint JSON", href: "https://milet.vercel.app/api/v1/cases/CASE-UC-MG-00482", external: true },
      { label: "Ver OpenAPI", href: "/openapi/v1/openapi.json", external: true },
    ],
  },
  {
    id: "entry-002",
    number: "002",
    area: "Runtime Sintético",
    railLabel: "Runtime & dados",
    date: "2026-10-04",
    dateLabel: "04 de outubro de 2026",
    dateShort: "04 OUT",
    status: { label: "Implementado no código", tone: "implemented" },
    title: "Do protótipo estático a um runtime implantável — ainda sem chamar isso de produção.",
    problem:
      "A jornada navegável não tinha contratos versionados, persistência tenant-scoped nem um caminho reproduzível fora do navegador.",
    deliveries: [
      "API NestJS, OpenAPI 3.1 e JSON Schemas versionados para o caso exclusivamente sintético.",
      "Adapters PostgreSQL com contexto de tenant, RLS, auditoria append-only e outbox com retry e DLQ.",
      "Imagens OCI non-root para API e worker, configuração fail-fast, CORS por allowlist e logs JSON.",
      "O portal consulta a API quando disponível; sem ela, exibe que está usando fixture local.",
    ],
    evidence:
      "67 testes automatizados aprovados na esteira local de CI, schemas JSON e contratos versionados.",
    limit:
      "API, worker e PostgreSQL estão prontos para implantação, operando em ambiente de testes; não há cobrança nem integração de distribuidora ativa.",
    links: [
      { label: "Abrir OpenAPI", href: "/openapi/v1/openapi.json", external: true },
      { label: "Abrir Schema", href: "/schemas/v1/synthetic-case.schema.json", external: true },
    ],
  },
  {
    id: "entry-001",
    number: "001",
    area: "Superfície Pública",
    railLabel: "Superfície pública",
    date: "2026-10-03",
    dateLabel: "03 de outubro de 2026",
    dateShort: "03 OUT",
    status: { label: "Implementado", tone: "implemented" },
    title: "O produto ganhou um lugar honesto para começar.",
    problem:
      "Roadmap e atualizações públicas não tinham rotas próprias, enquanto o backlog podia ser confundido com capacidade entregue.",
    deliveries: [
      "Roadmap público organizado em Agora, Próximo e Explorando, ligado aos épicos e histórias do projeto.",
      "Vocabulário explícito para separar planejado, protótipo, implementado e validado.",
      "Páginas públicas de demonstração com limites explícitos antes do primeiro clique.",
    ],
    evidence: "Arquivos implementados, verificados e disponíveis no portal público.",
    limit: "A publicação das páginas não comprova operação energética real em produção.",
  },
  {
    id: "entry-000",
    number: "000",
    area: "Fatia de Produto",
    railLabel: "Fatia de produto",
    date: "2026-10-03",
    dateLabel: "03 de outubro de 2026",
    dateShort: "03 OUT",
    status: { label: "Protótipo local", tone: "prototype" },
    title: "Da triagem à comparação, com um caso sintético.",
    problem:
      "Validar se donos de PME conseguem entender a decomposição de custos e comparar propostas sem spread oculto.",
    deliveries: [
      "Fixtures identificadas como demonstração e cálculos determinísticos testados.",
      "Ranking por custo total All-In, sem pagamento por posição ou spread oculto.",
      "Caminho visual de decomposição tarifária: TUSD, TE, encargos e perdas.",
    ],
    evidence: "Protótipo front-end navegável com regras determinísticas auditáveis.",
    limit:
      "Protótipo demonstrativo, sem contratação de energia nem upload de dados sensíveis de clientes reais.",
    links: [{ label: "Abrir comparador", href: "/diagnostico" }],
  },
];

export interface ArtifactCard {
  status: PublicStatus;
  title: string;
  description: string;
  links: ChangelogLink[];
}

export const VERIFIED_ARTIFACTS: ArtifactCard[] = [
  {
    status: { label: "Implementado", tone: "implemented" },
    title: "Brandbook e sistema visual",
    description:
      "Identidade, tokens, componentes demonstrativos, assets e documentação estão disponíveis no brandbook.",
    links: [{ label: "Abrir brandbook", href: "/brandbook.html", external: true }],
  },
  {
    status: { label: "Implementado", tone: "implemented" },
    title: "Backlog acadêmico",
    description:
      "A superfície documenta seis épicos e 28 histórias. Ela é evidência de especificação, não de execução do produto.",
    links: [{ label: "Abrir backlog", href: `${REPO_BLOB_URL}/academico/backlog/backlog.html`, external: true }],
  },
  {
    status: { label: "Protótipo validado localmente", tone: "prototype" },
    title: "Motion 3D procedural",
    description:
      "Seis estados morfológicos, timeline, scrubber e interação responsiva foram registrados no commit `36d1bbc`. O verso da forma segue uma interpretação visual.",
    links: [{ label: "Ver motion", href: `${REPO_BLOB_URL}/academico/motion/motion-3d.html`, external: true }],
  },
  {
    status: { label: "Implementado", tone: "implemented" },
    title: "Apresentações acadêmicas",
    description:
      "Decks web preservados para o plano de projeto e para Projetos Empreendedores. Não representam um painel operacional.",
    links: [
      { label: "Plano de projeto", href: `${REPO_BLOB_URL}/academico/decks/presentation.html`, external: true },
      { label: "Empreendedores", href: `${REPO_BLOB_URL}/academico/decks/presentation-empreendedores.html`, external: true },
    ],
  },
];

export const VERSION_LIMITS: ReadonlyArray<{ title: string; items: string[] }> = [
  {
    title: "Produto e dados",
    items: [
      "O fluxo PME tenta a função sintética pública e mantém uma fixture local como fallback visível.",
      "A função é stateless: não há leitura OCR real, persistência, upload nem faturas reais.",
      "Os cálculos são demonstrativos e não validam economia ou recomendação no mercado.",
    ],
  },
  {
    title: "Mercado e operação",
    items: [
      "Não há clientes, pilotos ou tração declarados.",
      "Não há fornecedores, parceiros ou integrações confirmados.",
      "Não há contratação, assinatura, pagamento ou troca de fornecedor.",
    ],
  },
  {
    title: "Confiança",
    items: [
      "Headers de tenant não são autenticação; OIDC e autorização real ainda faltam.",
      "RLS e auditoria append-only foram testadas localmente, não operadas em produção.",
      "Dados sintéticos e estados simulados são identificados como tais.",
    ],
  },
  {
    title: "Modelo econômico",
    items: [
      "Sem spread oculto nas transações.",
      "Taxas e preços continuam hipóteses até decisão explícita.",
      "Posição em ranking não deve ser comprada.",
    ],
  },
];

export const VALIDATION_QUESTION = {
  kicker: "Pergunta para validação com PMEs",
  question:
    "Antes de comparar propostas, qual evidência faria você confiar que a sua fatura foi entendida corretamente?",
  context:
    "Queremos testar se a revisão dos dados de consumo e custo reduz insegurança antes do diagnóstico — e quais campos precisam de explicação, correção ou confirmação humana.",
};
