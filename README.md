# Milet — pacote para apresentação HTML

Este pacote é a fonte de trabalho para montar a apresentação de 10 minutos na IDE.

## Rotas públicas

O projeto é estático e usa `cleanUrls` na Vercel. As rotas abaixo preservam a separação entre documentação, protótipo e produto:

| Rota | Superfície | Estado |
| --- | --- | --- |
| `/` | Brandbook interativo e assets | Implementado |
| `/backlog` | Backlog acadêmico e SPIDER | Implementado; especificação não comprova produto |
| `/presentation` | Apresentação do plano de projeto | Implementado |
| `/presentation-empreendedores` | Apresentação de Projetos Empreendedores | Implementado |
| `/roadmap` | Roadmap público Agora/Próximo/Explorando | Implementado; fatia front-end prototipada e capacidades reais ainda planejadas |
| `/build-in-public` | Changelog público, limites e pergunta de validação | Implementado |
| `/demo` | Entrada e contrato da demonstração | Implementado; encaminha ao protótipo com limites explícitos |
| `/app/` | Jornada front-end da triagem à comparação | Protótipo funcional com dados sintéticos; sem backend/OCR/auth/produção |

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
