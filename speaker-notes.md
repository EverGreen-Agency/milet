# Roteiro de Apresentação (Speaker Notes) — Milet

**Disciplina:** Projetos de Engenharia da Computação I (2026.2) — Turma 6  
**Instituição:** Universidade Presbiteriana Mackenzie  
**Autor:** Eduardo Ferreira de Mattos  
**Docente:** Prof. Dr. Rodrigo Juliani  
**Tempo Total Alvo:** 9 minutos e 50 segundos (Meta: 9m30s – 10m00s)

---

### Slide 1 — Capa & Abertura
- **Tempo estimado:** 25 segundos (00:00 – 00:25)
- **Título do Slide:** Milet — Energia em mais liberdade.
- **Roteiro de Fala:**
  > "Bom dia, professor Rodrigo e colegas de turma. Meu nome é Eduardo Ferreira de Mattos e apresento o plano de projeto da Milet: uma camada digital independente para entender, comparar, contratar e otimizar energia. Este projeto integra a disciplina Projetos de Engenharia da Computação I e estabelece as bases de engenharia de software e arquitetura de requisitos para o desenvolvimento que culminará na entrega do MVP no próximo semestre."

---

### Slide 2 — O Problema Tratado & Diagnóstico
- **Tempo estimado:** 50 segundos (00:25 – 01:15)
- **Título do Slide:** O problema não é falta de oferta. É decidir entre alternativas incomparáveis.
- **Roteiro de Fala:**
  > "O problema central que motivou este projeto não é a escassez de oferta de energia, mas sim a assimetria de informação e a impossibilidade prática de o consumidor empresarial médio decidir entre alternativas incomparáveis. Hoje, a jornada de uma PME é fragmentada: faturas em PDFs densos cheias de componentes tarifários como TUSD e TE, regras de distribuidoras e da ANEEL que mudam constantemente, propostas comerciais de comercializadoras e geradores com indexadores incompatíveis, contratos de longo prazo com cláusulas de fidelidade complexas e uma gestão pós-contrato dispersa em planilhas e e-mails. Na análise de causa-raiz pelos 5 Porquês, concluímos: não faltam fornecedores; falta uma camada independente de software capaz de normalizar dados, estruturar a disputa e auditar o resultado continuamente."

---

### Slide 3 — A Tese e o Ciclo Milet
- **Tempo estimado:** 55 segundos (01:15 – 02:10)
- **Título do Slide:** A Milet fecha o ciclo inteiro da decisão energética.
- **Roteiro de Fala:**
  > "A tese da Milet resolve essa dor orquestrando o ciclo completo em 5 etapas sequenciais e retroalimentadas: primeiro, Entender, transformando a fatura em um Passaporte Energético estruturado; segundo, Decidir, através de simulações neutras entre Cativo, Geração Distribuída por assinatura, Usina Própria e Mercado Livre; terceiro, Competir, usando um mecanismo padronizado de RFQ reverso onde comercializadoras e usinas disputam a demanda sob as mesmas premissas; quarto, Executar, com esteira assistida de migração e checklist regulatório; e quinto, Aprender e Otimizar, auditando mensalmente a economia prometida versus a realizada e disparando renegociações antes do vencimento contratual. Nosso princípio norteador: GD, ACL ou usina própria são rotas dentro do sistema — não a definição da Milet."

---

### Slide 4 — Perfis de Usuários & Ecossistema
- **Tempo estimado:** 50 segundos (02:10 – 03:00)
- **Título do Slide:** Um produto, vários atores — mas um usuário inicial claro.
- **Roteiro de Fala:**
  > "Para evitar a armadilha do escopo disperso, mapeamos os atores do ecossistema, mas definimos uma prioridade cirúrgica para o MVP acadêmico: o perfil UP-01, Consumidor PME e Decisor Energético. Esse decisor — dono de comércio, pequenas indústrias, clínicas ou escritórios — quer previsibilidade e redução de custo sem carregar risco regulatório ou precisar de equipe técnica interna. Em segundo nível conectamos os atores de oferta necessários para fechar o fluxo: o Gerador independente que busca ocupar capacidade (UP-03), a Comercializadora varejista no mercado livre (UP-04) e o integrador EPC de engenharia (UP-05). Perfis como consumidor residencial e investidores estão formalmente mapeados na ontologia do projeto, mas são escopos de expansão futura pós-disciplina."

---

### Slide 5 — Sete Histórias Explicam o Produto
- **Tempo estimado:** 70 segundos / 1m10s (03:00 – 04:10)
- **Título do Slide:** Sete histórias explicam o produto melhor que uma lista de features.
- **Roteiro de Fala:**
  > "Em vez de uma lista estática de funcionalidades, estruturamos os requisitos de engenharia através de 7 User Stories nucleares que cobrem a jornada de ponta a ponta. Três delas são os pilares de sustentação do valor: a US-002, que resolve a entrada via upload e extração automatizada de dados da fatura; a US-013, que é o núcleo de inteligência ao normalizar propostas comerciais concorrentes sob métricas equivalentes de custo e risco; e a US-021, que fecha o ciclo de valor ao confrontar mês a mês a economia prometida contra o faturamento real da distribuidora. As histórias US-006, US-010, US-019 e US-027 complementam a esteira garantindo o filtro determinístico de rotas, o leilão reverso via RFQ, o checklist de migração assistida e a trilha de auditoria e governança exigida pela LGPD."

---

### Slide 6 — Do Backlog ao Recorte do MVP
- **Tempo estimado:** 50 segundos (04:10 – 05:00)
- **Título do Slide:** Do backlog ao MVP: o que realmente precisa funcionar.
- **Roteiro de Fala:**
  > "Organizamos o backlog em 6 capacidades de engenharia: Dados e Passaporte, Diagnóstico e Decisão, Marketplace/RFQ, Comparação e Escolha, Execução Assistida e Operação/Autopilot. O relatório acadêmico documenta o catálogo com 28 User Stories. Aqui na tela apresentamos a linha de corte estrita de P0 para o MVP: apenas o essencial para provar a hipótese central com o decisor PME de ponta a ponta. Funcionalidades como integração por telemetria IoT em tempo real, modelos de IA estocástica para previsão climática de geração ou troca autônoma sem supervisão humana foram conscientemente classificadas como P1 e P2 para mitigar riscos de prazo de engenharia."

---

### Slide 7 — Estado da Arte & Diferenciação
- **Tempo estimado:** 60 segundos / 1m00s (05:00 – 06:00)
- **Título do Slide:** As peças existem; a hipótese está na integração contínua.
- **Roteiro de Fala:**
  > "Na pesquisa de Estado da Arte não afirmamos que 'não há concorrentes'. O mercado possui soluções pontuais relevantes: plataformas de dados e APIs como a Arcadia nos Estados Unidos, serviços de troca contínua por concierge como a Energy Ogre, e marketplaces de flexibilidade como a Piclo no Reino Unido. No Brasil, o próprio Decreto 13.097 de 2026 determinou que a CCEE desenvolva uma plataforma pública e centralizada de comparação de ofertas. O diferencial da Milet está na integração: a plataforma pública da CCEE será um insumo de transparência, mas a Milet captura o valor na decisão personalizada de acordo com a fatura, na esteira assistida de migração e na auditoria recorrente de economia realizada."

---

### Slide 8 — Divisão Acadêmica: Projetos I vs. Projetos II
- **Tempo estimado:** 45 segundos (06:00 – 06:45)
- **Título do Slide:** Projetos I define. Projetos II constrói e valida.
- **Roteiro de Fala:**
  > "Um aspecto metodológico vital desta apresentação: o marco da disciplina não se encerra em 2026.2. Projetos I é a fase de engenharia conceitual e fundamentação: formulação do problema, Estado da Arte, mapeamento de perfis, Canvas de hipóteses, engenharia de requisitos com critérios BDD, fatiamento SPIDER e especificação de arquitetura. Projetos II, no próximo semestre de 2027.1, será a fase de engenharia construtiva: implementação do software em código, integração dos módulos, testes unitários e de integração, segurança e realização de um piloto com faturas e dados reais para validação empírica."

---

### Slide 9 — Cronograma Geral (Ago/2026 a Jun/2027)
- **Tempo estimado:** 60 segundos / 1m00s (06:45 – 07:45)
- **Título do Slide:** Cronograma detalhado até a conclusão do projeto.
- **Roteiro de Fala:**
  > "O cronograma físico do projeto foi estruturado mês a mês cobrindo os dois semestres. Em 2026.2, concluímos o Discovery e Estado da Arte em agosto e setembro; finalizamos o detalhamento de histórias de usuário, critérios de aceite e matriz SPIDER agora em outubro; e fechamos o planejamento arquitetural e prototipação conceitual em novembro e dezembro. Em 2027.1, iniciamos em fevereiro com a construção do core engine de ingestão e rotas; em abril finalizamos o comparador normalizado, RFQ e segurança; em maio realizamos o piloto de validação com dados reais; e em junho entregamos o MVP funcional v1 junto com a monografia final de conclusão."

---

### Slide 10 — Técnicas de Gestão do Projeto
- **Tempo estimado:** 40 segundos (07:45 – 08:25)
- **Título do Slide:** Como vamos gerir o projeto.
- **Roteiro de Fala:**
  > "Na governança do projeto, adotamos uma abordagem híbrida: Scrum para iterações com entregas periódicas ao orientador e Kanban para o fluxo contínuo das tarefas técnicas com limites claros de WIP. A organização opera em quatro camadas: Discovery para hipóteses e personas, Backlog priorizado com rigor P0/P1/P2, Roadmap de marcos acadêmicos e Execução técnica com critérios de aceite no padrão BDD — Dado que, Quando e Então — garantindo que cada requisito seja diretamente convertível em suítes de testes automatizados."

---

### Slide 11 — Business Model Canvas (Hipóteses v0.1)
- **Tempo estimado:** 50 segundos (08:25 – 09:15)
- **Título do Slide:** Business Model Canvas v0.1: hipóteses a validar.
- **Roteiro de Fala:**
  > "O Business Model Canvas do projeto é tratado com rigor acadêmico estritamente como hipótese v0.1 a ser testada, e não como modelo de negócio consolidado. Destacamos quatro blocos essenciais: o segmento inicial de PMEs que precisam de economia sem custos de capital; a proposta de valor focada em decisão, competição e auditoria contínua; as fontes de receita hipotetizadas com base em taxa transparente de originação ou assinatura de concierge; e as parcerias estratégicas com geradores, comercializadoras e EPCs, que atuam como a infraestrutura física e regulada de bastidor."

---

### Slide 12 — Critérios de Sucesso e Fechamento
- **Tempo estimado:** 35 segundos (09:15 – 09:50)
- **Título do Slide:** Da fatura à decisão — e da decisão ao resultado.
- **Roteiro de Fala:**
  > "Para encerrar, estabelecemos os critérios mensuráveis que determinarão o sucesso do projeto ao final de Projetos II: capacidade de ingerir e estruturar dados de faturas reais; motor de decisão determinístico com premissas abertas; normalização matemática de pelo menos três propostas comerciais concorrentes; esteira de contratação assistida navegável; e módulo de auditoria com conciliação mensal da economia real. Milet: energia em mais liberdade. Muito obrigado, estou à disposição do professor e dos avaliadores para os comentários e perguntas."

---

### Resumo de Controle de Tempo
| Slide | Assunto Principal | Tempo Alvo | Tempo Acumulado |
| :---: | :--- | :---: | :---: |
| 1 | Capa & Identificação Acadêmica | 25s | 00:25 |
| 2 | O Problema & Análise dos 5 Porquês | 50s | 01:15 |
| 3 | Tese & Ciclo Milet de Decisão | 55s | 02:10 |
| 4 | Perfis de Usuário & Recorte do MVP | 50s | 03:00 |
| 5 | Sete User Stories Chave | 70s | 04:10 |
| 6 | Backlog & Capacidades P0 vs P1/P2 | 50s | 05:00 |
| 7 | Estado da Arte & Diferenciação | 60s | 06:00 |
| 8 | Projetos I vs Projetos II (50/50) | 45s | 06:45 |
| 9 | Cronograma Geral (Ago/26 a Jun/27) | 60s | 07:45 |
| 10 | Gestão, Métodos Ágeis & BDD | 40s | 08:25 |
| 11 | Business Model Canvas v0.1 | 50s | 09:15 |
| 12 | Critérios de Sucesso & Fechamento | 35s | 09:50 |
| **Total** | **Apresentação Completa** | **9m50s** | **Meta: ≤ 10m00s** |
