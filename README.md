# Milet — pacote para apresentação HTML

Este pacote é a fonte de trabalho para montar a apresentação de 10 minutos na IDE.

## Rotas públicas

O portal é estático, usa `cleanUrls` na Vercel e possui uma única função stateless
para o caso sintético. As rotas abaixo preservam a separação entre documentação,
protótipo e produto:

| Rota | Superfície | Estado |
| --- | --- | --- |
| `/` | Brandbook interativo e assets | Implementado |
| `/backlog` | Backlog acadêmico e SPIDER | Implementado; especificação não comprova produto |
| `/presentation` | Apresentação do plano de projeto | Implementado |
| `/presentation-empreendedores` | Apresentação de Projetos Empreendedores | Implementado |
| `/roadmap` | Roadmap público Agora/Próximo/Explorando | Implementado; fatia front-end prototipada e capacidades reais ainda planejadas |
| `/build-in-public` | Changelog público, limites e pergunta de validação | Implementado |
| `/demo` | Entrada e contrato da demonstração | Implementado; encaminha ao protótipo com limites explícitos |
| `/app/` | Jornada front-end da triagem à comparação | Protótipo funcional ligado à função sintética `/api`; fallback local explícito |
| `/api/v1/cases/CASE-UC-MG-00482` | Caso público exclusivamente sintético | Função stateless; sem banco, dados reais ou autenticação |

Para validar localmente, sirva a raiz por HTTP (por exemplo, `python -m http.server 4173`) em vez de abrir os arquivos com `file://`.

O caminho público intencional é `/roadmap` ou `/build-in-public` → `/demo` → `/app/`. A página `/demo` explica o contrato da experiência antes de abrir a jornada sintética.

## O que já está pronto
- assets/bmc.png — Canvas visual.
- assets/ecosystem.png — ecossistema.
- assets/epics.png — visão de épicos.
- assets/journey.png — jornada.
- assets/timeline.png — linha narrativa.
- assets/gantt.png — gráfico anterior; NÃO tratar como cronograma final sem atualizar.
- presentation_manifest.json — conteúdo estruturado.
- docs/COPILOT_PROMPT.md — prompt completo para gerar a apresentação.
- docs/ASSET_CHECKLIST.md — prints reais que ainda precisam ser capturados.
- docs/CONTENT_VALIDATION.md — decisões que devem ser validadas antes da entrega.
- references/ — relatório e deck anteriores para consulta.

## Regra de narrativa
A apresentação NÃO é o relatório comprimido. Em 10 minutos:
1. contexto/problema;
2. tese Milet;
3. usuários;
4. fluxo do produto;
5. user stories que definem o projeto;
6. estado da arte/diferenciação;
7. escopo Projetos I vs II;
8. cronograma até 2027.1;
9. BMC;
10. fechamento.

## Não inventar
- números de economia;
- clientes/pilotos;
- integrações concluídas;
- validações que ainda não ocorreram;
- datas acadêmicas oficiais que não foram confirmadas.

## Arquitetura de produto

A proposta implementation-ready para a plataforma transacional está em
[`docs/product/v1/`](./docs/product/v1/README.md). Ela é arquitetura alvo: não
representa backend, integrações ou operação de produção já implementados.

## Fundação transacional (Stage 0)

O repositório também contém uma API NestJS isolada do portal estático, contratos
TypeScript compartilhados, migrações PostgreSQL e fixtures exclusivamente
sintéticas. Consulte [`apps/api/README.md`](./apps/api/README.md) para execução e
[`docs/product/v1/STAGE0_EVIDENCE.md`](./docs/product/v1/STAGE0_EVIDENCE.md) para
evidências e limites. Essa fundação não aceita faturas reais e não comprova
integração, segurança ou prontidão de produção.

## Contratos e persistência (Stage 1)

A Stage 1 adiciona OpenAPI/JSON Schema versionados, adapters PostgreSQL para leitura
tenant-scoped do caso sintético e auditoria append-only, além de worker de outbox com
claim idempotente, retry/backoff e DLQ. Consulte
[`docs/product/v1/STAGE1_EVIDENCE.md`](./docs/product/v1/STAGE1_EVIDENCE.md). Isso
continua sendo fundação local/CI com dados sintéticos, não backend público nem
prontidão para documentos reais.

## Runtime implantável (Stage 2)

A Stage 2 adiciona imagens OCI para API/worker, hardening HTTP, logs JSON, métricas
locais, daemon de outbox tenant-scoped e adapter HTTP opcional no protótipo. Consulte
[`docs/product/v1/STAGE2_EVIDENCE.md`](./docs/product/v1/STAGE2_EVIDENCE.md) e o
[`runbook provider-neutral`](./docs/product/v1/DEPLOYMENT_RUNBOOK.md). O portal
continua offline-first com fixture sintética e mostra quando ocorreu fallback. Não há
deploy dos containers da API/worker, autenticação real ou ingestão de documentos.

## API sintética pública (Stage 4)

A Stage 4 expõe a fixture canônica como função Vercel stateless e configura o app
para consultar `/api` antes do fallback local. Consulte
[`docs/product/v1/STAGE4_EVIDENCE.md`](./docs/product/v1/STAGE4_EVIDENCE.md). Esse
endpoint não é a API Nest persistente: não há banco, worker, autenticação, upload ou
dados reais.
