# PROMPT PARA COPILOT — APRESENTAÇÃO HTML MILET

Você está dentro da pasta do projeto Milet. Crie uma apresentação web HTML/CSS/JS de 10 minutos, 16:9, usando os arquivos deste pacote como fonte.

## 1. Arquivos de entrada
Leia primeiro:
- `presentation_manifest.json`
- `README.md`
- `docs/CONTENT_VALIDATION.md`
- `docs/ASSET_CHECKLIST.md`
- imagens em `assets/`

Se existirem depois os arquivos `assets/fibery_user_profiles.png`, `assets/fibery_bmc.png`, `assets/fibery_deliverables.png` e prints `assets/prototype_*.png`, use-os conforme instruções abaixo.

## 2. Objetivo
A apresentação é da disciplina Projetos de Engenharia da Computação. Não é pitch comercial puro. Precisa demonstrar:
- problema real e contexto;
- entendimento de mercado/estado da arte;
- definição do produto;
- perfis de usuário;
- requisitos por User Stories;
- técnicas de gestão;
- escopo do MVP;
- plano de projeto atravessando Projetos I (2026.2) e Projetos II (2027.1);
- Business Model Canvas;
- o que será entregue ao final.

Duração alvo: 9m30–10m. Não colocar tudo do relatório. Priorizar compreensão e defesa das decisões.

## 3. Design
Brand Milet:
- Carbon `#1A1A1A`
- Ivory `#F7F3EA`
- Sand `#C9B89F`
- Amber `#D39B3D`
- Copper `#B87333`
- títulos: Cormorant Garamond (fallback Georgia)
- UI/corpo: Inter (fallback Arial)
- visual editorial + tecnológico, premium, muito espaço negativo;
- evitar dashboard genérico, neon, excesso de cards e excesso de texto;
- animações discretas;
- acessível e legível em projetor.

Criar `index.html`, `styles.css`, `script.js`.
Navegação: setas, espaço, PageUp/PageDown, clique em controles. Indicador `01 / 12`.
Cada slide ocupa exatamente 100vw x 100vh.
Adicionar modo de impressão/export PDF com `@media print`.
Sem frameworks obrigatórios. Se usar biblioteca externa, manter apresentação funcional sem ela.

## 4. Estrutura exata — 12 slides

### Slide 1 — Milet
Headline: `Energia em mais liberdade.`
Sub: `Uma camada independente para entender, comparar, contratar e otimizar energia.`
Rodapé acadêmico: Projetos de Engenharia da Computação I · 2026.2.
Inserir nomes/RAs via placeholders claramente marcados `TODO`.
Visual: marca Milet / símbolo se disponível; não usar foto stock.
Tempo: 25s.

### Slide 2 — O problema não é falta de oferta. É decidir entre alternativas incomparáveis.
Mostrar fluxo fragmentado:
`fatura → tarifas/regras → alternativas → fornecedores → contratos → operação`
Mensagem central: consumidores empresariais precisam tomar uma decisão relevante sem dominar o setor; ofertas chegam em formatos e premissas diferentes.
Usar `assets/ecosystem.png` se ajudar; caso contrário desenhar nativamente em HTML.
Tempo: 50s.

### Slide 3 — A Milet fecha o ciclo inteiro da decisão energética
Mostrar em 5 etapas:
1. Entender — fatura e Passaporte Energético
2. Decidir — rotas aplicáveis e simulação
3. Competir — RFQ / marketplace
4. Executar — contratação/migração
5. Aprender — economia realizada e reotimização
Frase pequena: `GD, ACL, usina própria e outras rotas são alternativas dentro do sistema — não a definição da Milet.`
Usar `assets/journey.png` como apoio visual se legível.
Tempo: 55s.

### Slide 4 — Um produto, vários atores — mas um usuário inicial claro
Destaque grande: `UP-01 · Consumidor PME / Decisor Energético`.
Ao redor, em segundo nível:
- Gerador / Proprietário de Usina
- Comercializadora / Fornecedor
- EPC / Integrador
- Operador Milet
- Parceiro B2B2C
Na borda/futuro: residencial, investidores e financiadores.
Se `assets/fibery_user_profiles.png` existir, mostrar recorte visual do artefato ao lado; caso contrário gerar diagrama com os dados do manifest.
Não tratar todos como MVP.
Tempo: 50s.

### Slide 5 — Sete histórias explicam o produto melhor que uma lista de features
Construir uma linha horizontal com:
`US-002 Fatura`
→ `US-006 Rotas`
→ `US-010 RFQ`
→ `US-013 Comparação`
→ `US-019 Execução`
→ `US-021 Economia`
→ `US-027 Rastreabilidade`
Embaixo de cada uma, no máximo 5–8 palavras de resultado.
Destaque visual em US-002, US-013, US-021 como entrada, decisão e prova de valor.
Não exibir as 28 stories.
Tempo: 70s.

### Slide 6 — Do backlog ao MVP: o que realmente precisa funcionar
Organizar por 6 épicos/capacidades:
- Dados & Passaporte
- Diagnóstico & decisão
- Marketplace / RFQ
- Comparação & escolha
- Execução & acompanhamento
- Operação, auditoria & reotimização
Separar `MVP/P0` de `Depois`.
Usar `assets/epics.png` se útil.
Explicar que o backlog completo fica no relatório; aqui mostramos apenas o corte que prova o ciclo ponta a ponta.
Tempo: 50s.

### Slide 7 — Estado da arte: as peças existem; a hipótese está na integração contínua
Não afirmar “não existe concorrente”.
Criar matriz conceitual:
- dados/analytics;
- comparação;
- marketplace/leilão;
- execução;
- gestão contínua;
- auditabilidade.
Mostrar benchmarks/categorias: Arcadia, Energy Ogre, Piclo/Electron, Powerledger/Energy Web e futura infraestrutura pública brasileira/CCEE.
Mensagem: a hipótese Milet é combinar diagnóstico + comparação entre rotas + competição + execução + comprovação + reotimização em uma experiência independente.
Adicionar fonte pequena `Estado da Arte v0.1 — pesquisa do projeto`.
Tempo: 60s.

### Slide 8 — Projetos I define. Projetos II constrói e valida.
Tela dividida 50/50.
`2026.2 · Projetos I`
- problema e Estado da Arte;
- perfis/mapas;
- BMC;
- Epics/Features/User Stories;
- backlog/MVP;
- arquitetura;
- protótipo;
- validação inicial.

`2027.1 · Projetos II`
- implementação do MVP;
- integrações;
- segurança/LGPD;
- testes;
- piloto;
- métricas;
- refinamento;
- MVP v1 + relatório final.
Mensagem: `O marco da disciplina não termina neste semestre.`
Tempo: 45s.

### Slide 9 — Cronograma até o fim do projeto
Criar Gantt REAL em HTML, de Ago/2026 a Jun/2027, com separador forte entre semestres.
Usar o `schedule` do `presentation_manifest.json`.
Marcos visuais:
- Set/26: Estado da Arte + perfis + BMC
- Out/26: backlog/MVP + Supernova
- Nov–Dez/26: arquitetura + protótipo + validação inicial
- Fev–Mar/27: construção core
- Abr/27: integração + segurança
- Mai/27: piloto/validação
- Jun/27: MVP v1 + apresentação final
Não usar `assets/gantt.png` como cronograma final se ele divergir; ele é apenas referência.
Destaque com bracket: `ENTREGA DESTE SEMESTRE` sobre 2026.2.
Tempo: 60s.

### Slide 10 — Como vamos gerir o projeto
Mostrar sistema de trabalho:
`Fonte de verdade → Fibery`
e quatro camadas:
- Discovery/artefatos
- Product Backlog
- Roadmap/Releases
- Execução/Testes
Método: Scrum + Kanban; priorização P0/P1/P2; critérios de aceite; revisões por marco.
Se `assets/fibery_deliverables.png` existir, usar como evidência visual discreta.
Não mostrar os releases template de marketing automation que existem hoje no Fibery.
Tempo: 40s.

### Slide 11 — Business Model Canvas v0.1 = hipóteses que o projeto precisa validar
Se `assets/fibery_bmc.png` existir, usá-lo como visual principal. Senão usar `assets/bmc.png`.
Ao lado destacar somente:
- segmento inicial: PMEs;
- proposta: decisão + competição + execução + gestão contínua;
- receita: taxa/margem transparente + assinatura/concierge + SaaS B2B (hipóteses);
- parceiros: geradores, comercializadoras, EPCs e capital.
Badge: `v0.1 · Hypothesis`.
Não apresentar receita como validada.
Tempo: 50s.

### Slide 12 — O que precisa estar provado ao final de Projetos II
Headline: `Da fatura à decisão — e da decisão ao resultado.`
Critérios de sucesso do projeto acadêmico:
- ingerir/estruturar dados de uma fatura;
- recomendar rotas com premissas explicáveis;
- permitir comparação normalizada;
- representar/operar o fluxo de contratação;
- registrar histórico auditável;
- medir resultado/feedback em piloto;
- entregar MVP v1 demonstrável.
Fechar com: `Milet · Energia em mais liberdade.`
Tempo: 35s.

## 5. Imagens e artefatos
Preferência:
1. artefatos reais do Fibery;
2. diagramas próprios do pacote;
3. UI/protótipos reais;
4. ícones vetoriais simples.
Não usar fotos stock de painel solar, poste, cidade etc. só para preencher.

Nunca coloque screenshot inteiro ilegível. Faça crop/zoom e use a imagem como evidência, enquanto a mensagem principal permanece em HTML.

## 6. Conteúdo proibido / cuidado
- não inventar economia percentual;
- não dizer que BMC foi validado;
- não dizer que já há piloto se não houver;
- não afirmar inexistência de concorrentes;
- não usar como roadmap da Milet os registros `v2.4 Marketing Automation`, `v2.5 Multi-Channel...`, `v2.6 AI-Powered...`; são dados template do Fibery e não representam o projeto;
- não confundir CCEE com concorrente simples: apresentar como infraestrutura/ator regulatório e futura plataforma pública de comparação quando contextualizado pelo Estado da Arte;
- não transformar a apresentação em pitch de startup: manter evidência de engenharia, requisitos e plano de projeto.

## 7. Entregáveis técnicos
Além de `index.html`, `styles.css`, `script.js`:
- criar `speaker-notes.md` com fala de cada slide e tempo;
- criar `sources.md` com as fontes do Estado da Arte já disponíveis no material;
- criar `TODO.md` apenas com dados realmente faltantes;
- usar caminhos relativos `./assets/...`;
- não alterar arquivos em `references/`.

Antes de finalizar, valide:
- 1920x1080 sem overflow;
- legibilidade a distância;
- total de fala <= 10 min;
- nenhum TODO aparece em slide além de integrantes/RAs enquanto não preenchidos;
- cronograma cobre Ago/2026–Jun/2027;
- slide 8 separa explicitamente Projetos I e II.
