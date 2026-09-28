# Roteiro de Apresentação (Speaker Notes) — Milet

**Disciplina:** Projetos de Engenharia da Computação I (2026.2) — Turma 6  
**Instituição:** Universidade Presbiteriana Mackenzie  
**Autor:** Eduardo Ferreira de Mattos  
**Docente Orientador:** Prof. Dr. Rodrigo Juliani  
**Estrutura da Banca:** 10 Pontos Totais  
**Tempo Total de Fala:** 9 minutos e 40 segundos (Meta: 9m30s – 10m00s)

---

### Slide 1 — Capa & Tema Formal
- **Critério da Banca:** Tema `[0,5 pt]`
- **Tempo estimado:** 25 segundos (00:00 – 00:25)
- **Título do Slide:** Milet — Energia em mais liberdade.
- **Roteiro de Fala:**
  > "Bom dia, professor Rodrigo Juliani e colegas de turma. Meu nome é Eduardo Ferreira de Mattos e apresento o plano de projeto da Milet: uma plataforma digital independente para decisão, comparação e gestão contínua de energia. O projeto integra a disciplina Projetos de Engenharia da Computação I e estabelece as bases formais para o desenvolvimento e validação do software que entregaremos até o próximo semestre."

---

### Slide 2 — Motivação do Projeto
- **Critério da Banca:** Motivação `[0,5 pt]`
- **Tempo estimado:** 40 segundos (00:25 – 01:05)
- **Título do Slide:** Abertura de mercado e a urgência de uma camada computacional neutra.
- **Roteiro de Fala:**
  > "A motivação deste projeto nasce da transformação histórica do setor elétrico brasileiro: a consolidação da Geração Distribuída com a Lei 14.300 e o recente Decreto 13.097 de 2026, que programa a abertura da baixa tensão para os próximos anos. Hoje, empresas de menor porte enfrentam uma assimetria brutal de dados e tarifas, pagando caro simplesmente por não dominarem a regulação do setor. O consumidor tem liberdade de escolha no papel, mas não dispõe de ferramentas computacionais neutras para exercê-la com segurança."

---

### Slide 3 — Problema Tratado & Causa-Raiz (5 Porquês)
- **Critério da Banca:** Problema Tratado `[1,0 pt]`
- **Tempo estimado:** 50 segundos (01:05 – 01:55)
- **Título do Slide:** O problema não é falta de oferta. É decidir entre alternativas incomparáveis.
- **Roteiro de Fala:**
  > "O problema tratado não é a falta de oferta energética, mas a impossibilidade de o decisor comparar alternativas sob premissas equivalentes. A jornada atual é caótica: faturas densas com tarifas TUSD e TE, regras regulatórias opacas, opções de GD e mercado livre desconexas, contratos longos com cláusulas de fidelidade complexas e pós-venda disperso em planilhas. Na análise de causa-raiz pelos 5 Porquês, concluímos: não faltam fornecedores de energia no mercado; falta uma camada independente de software que traduza dados elétricos em decisões transparentes e auditáveis."

---

### Slide 4 — Estado da Arte (1/3): Evolução Regulatória Brasileira
- **Critério da Banca:** Estado da Arte `[3,0 pts acumulados]`
- **Tempo estimado:** 55 segundos (01:55 – 02:50)
- **Título do Slide:** Da concessão monopolista à abertura regulatória brasileira.
- **Roteiro de Fala:**
  > "Entrando no Estado da Arte, que é o núcleo de maior peso da nossa avaliação, analisamos primeiro a evolução no Brasil. Passamos do modelo cativo monopolista para a Lei 14.300 em 2022, a abertura do Grupo A em 2024 e o Decreto 13.097/2026, que fixa a abertura para baixa tensão comercial em 2027 e residencial em 2028. É essencial destacar: a distribuidora física não é um intermediário a eliminar, mas sim a infraestrutura física de rede; e a CCEE opera a liquidação setorial e disponibilizará uma plataforma pública de preços, que servirá de insumo para nossa solução."

---

### Slide 5 — Estado da Arte (2/3): Benchmarks Internacionais
- **Critério da Banca:** Estado da Arte `[3,0 pts acumulados]`
- **Tempo estimado:** 55 segundos (02:50 – 03:45)
- **Título do Slide:** Como o mercado global endereçou a inteligência energética.
- **Roteiro de Fala:**
  > "Mapeamos como os mercados mais maduros do mundo resolveram a inteligência energética. Nos Estados Unidos, a Arcadia desenvolveu APIs para ingestão de faturas de concessionárias conectando consumidores a usinas solares comunitárias. No Texas, a Energy Ogre provou o modelo de concierge independente: o usuário paga uma mensalidade fixa para um algoritmo otimizar e trocar contratos periodicamente. No Reino Unido, plataformas como Piclo e Electron operam leilões de flexibilidade para redes. E iniciativas como Powerledger e Energy Web aplicam registros auditáveis de garantias renováveis."

---

### Slide 6 — Estado da Arte (3/3): Matriz de Diferenciação & Hipótese Milet
- **Critério da Banca:** Estado da Arte `[3,0 pts acumulados]`
- **Tempo estimado:** 60 segundos (03:45 – 04:45)
- **Título do Slide:** As peças existem; a hipótese está na integração contínua.
- **Roteiro de Fala:**
  > "Ao consolidar o Estado da Arte em nossa matriz comparativa de 6 dimensões, fica evidente o diferencial estrutural da Milet: não afirmamos que 'não existem soluções', mas sim que elas atuam de forma fragmentada. Enquanto a Arcadia foca apenas em dados e a Energy Ogre em varejo, a Milet fecha o ciclo integrando diagnóstico explicável, comparação multimodal entre rotas (GD, ACL e usina própria), workflow assistido e auditoria contínua de economia. A plataforma pública da CCEE será um trilho de transparência, mas o valor computacional está na decisão personalizada e na governança contínua."

---

### Slide 7 — Plano de Projeto (1/3): Perfis de Usuários & Ecossistema
- **Critério da Banca:** Plano de Projeto `[2,0 pts acumulados]`
- **Tempo estimado:** 50 segundos (04:45 – 05:35)
- **Título do Slide:** Um ecossistema completo com foco cirúrgico no decisor PME.
- **Roteiro de Fala:**
  > "No Plano de Projeto, iniciamos pelos Perfis de Usuários. Para assegurar foco de engenharia, definimos uma prioridade cirúrgica para o MVP: o UP-01, Consumidor PME e Decisor Energético — comércio, escritórios e pequenas indústrias que querem economia sem risco de engenharia. Ao redor, conectamos os atores de oferta necessários para fechar a esteira: o Gerador Independente (UP-03) que precisa ocupar capacidade, a Comercializadora Varejista (UP-04), o integrador EPC (UP-05) e o Operador Milet (UP-06). Consumidor residencial e investidores ficam para expansões pós-MVP."

---

### Slide 8 — Plano de Projeto (2/3): Arquitetura da Solução & User Stories
- **Critério da Banca:** Plano de Projeto `[2,0 pts acumulados]`
- **Tempo estimado:** 65 segundos / 1m05s (05:35 – 06:40)
- **Título do Slide:** A esteira contínua de decisão explicada em 7 User Stories.
- **Roteiro de Fala:**
  > "A arquitetura do produto fecha o ciclo em 5 etapas: Entender, Decidir, Competir, Executar e Aprender. O backlog possui 28 histórias de usuário, mas destacamos as 7 histórias nucleares que formam a espinha dorsal do MVP. Três delas são os pilares indispensáveis: a US-002 para ingestão de fatura; a US-013, núcleo de inteligência que normaliza propostas de comercializadoras sob a mesma régua matemática de VPL e risco; e a US-021, que fecha o loop auditando a economia realizada versus a prometida. As histórias 006, 010, 019 e 027 completam rotas, RFQ, migração e auditoria imutável."

---

### Slide 9 — Plano de Projeto (3/3): Canvas v0.1 & Recorte do MVP
- **Critério da Banca:** Plano de Projeto `[2,0 pts acumulados]`
- **Tempo estimado:** 50 segundos (06:40 – 07:30)
- **Título do Slide:** Business Model Canvas v0.1 e o recorte do MVP acadêmico.
- **Roteiro de Fala:**
  > "O Business Model Canvas do projeto é tratado formalmente como hipótese v0.1 a ser testada, e não como modelo validado comercialmente. Destacamos quatro blocos essenciais: o segmento PME, a proposta de 4 pilares, as receitas em validação e as parcerias estruturais. Em consonância com a disciplina, realizamos o recorte estrito de 14 histórias P0 para o MVP acadêmico, postergando módulos complexos como telemetria IoT em tempo real, modelos de IA estocástica ou automação sem supervisão para as fases P1 e P2."

---

### Slide 10 — Cronograma (1/2): Cronograma Físico Geral (Gantt)
- **Critério da Banca:** Cronograma `[2,0 pts acumulados]`
- **Tempo estimado:** 50 segundos (07:30 – 08:20)
- **Título do Slide:** Cronograma físico de execução de Agosto/2026 a Junho/2027.
- **Roteiro de Fala:**
  > "O cronograma físico foi estruturado ao longo de 11 meses, de Agosto de 2026 a Junho de 2027, com separador claro entre semestres. Em Projetos I (2026.2), cumprimos o Discovery e Estado da Arte em agosto e setembro, o detalhamento de histórias e recorte do MVP em outubro, e o planejamento arquitetural e prototipação em novembro e dezembro. Em Projetos II (2027.1), construímos o core engine entre fevereiro e março, integramos RFQ e segurança em abril, realizamos o piloto de validação em maio e entregamos o MVP v1 e monografia em junho."

---

### Slide 11 — Cronograma (2/2): Técnicas de Gestão, BDD, SPIDER & Riscos
- **Critério da Banca:** Cronograma & Métodos `[2,0 pts acumulados]`
- **Tempo estimado:** 40 segundos (08:20 – 09:00)
- **Título do Slide:** Engenharia de processos, BDD, SPIDER e mitigação de riscos.
- **Roteiro de Fala:**
  > "Na engenharia do processo, adotamos abordagem híbrida: Scrum para entregas periódicas e Kanban para fluxo contínuo. Nossos diferenciais metodológicos incluem critérios de aceite em BDD (Dado que, Quando, Então) para testabilidade direta de requisitos e a aplicação da técnica SPIDER para fatiar histórias complexas como OCR de fatura e normalização de propostas. Além disso, mapeamos os riscos de variação de layout de distribuidoras e mudanças regulatórias, adotando parser modular e regras versionadas como mitigação."

---

### Slide 12 — Resultados Esperados & Critérios de Sucesso
- **Critério da Banca:** Resultados Esperados `[1,0 pt]`
- **Tempo estimado:** 45 segundos (09:00 – 09:45)
- **Título do Slide:** O que estará objetivamente provado ao final de Projetos II.
- **Roteiro de Fala:**
  > "Para encerrar os requisitos da banca, definimos os critérios objetivos que determinarão o sucesso de Projetos II: conseguir ingerir faturas reais extraindo dados tarifários; motor de decisão determinístico com premissas transparentes; comparador normalizando pelo menos 3 ofertas concorrentes; esteira de contratação assistida navegável; e módulo de auditoria com conciliação mensal da economia realizada em ambiente de piloto real."

---

### Slide 13 — Encerramento & Arguição da Banca
- **Critério da Banca:** Fechamento Formal
- **Tempo estimado:** 15 segundos (09:45 – 10:00)
- **Título do Slide:** Milet · Energia em mais liberdade.
- **Roteiro de Fala:**
  > "Milet: energia em mais liberdade. Agradeço a atenção do professor Rodrigo Juliani e estou totalmente à disposição dos avaliadores para a arguição e comentários da banca."

---

### Resumo da Rubrica da Banca Mackenzie vs. Deck
| Slide | Assunto | Critério da Banca | Pontuação | Tempo |
| :---: | :--- | :--- | :---: | :---: |
| 1 | Capa & Tema | Tema | `[0,5 pt]` | 25s |
| 2 | Motivação | Motivação | `[0,5 pt]` | 40s |
| 3 | Problema Tratado & 5 Porquês | Problema Tratado | `[1,0 pt]` | 50s |
| 4 | Estado da Arte: Evolução Brasil | Estado da Arte | | 55s |
| 5 | Estado da Arte: Benchmarks Internacionais | Estado da Arte | `[3,0 pts]` | 55s |
| 6 | Estado da Arte: Matriz de Diferenciação | Estado da Arte | | 60s |
| 7 | Plano de Projeto: Perfis de Usuários | Plano de Projeto | | 50s |
| 8 | Plano de Projeto: Arquitetura & 7 Stories | Plano de Projeto | `[2,0 pts]` | 65s |
| 9 | Plano de Projeto: Canvas v0.1 & Recorte MVP | Plano de Projeto | | 50s |
| 10 | Cronograma: Linha Temporal Gantt 11 Meses | Cronograma | `[2,0 pts]` | 50s |
| 11 | Cronograma: Gestão, BDD, SPIDER & Riscos | Cronograma & Métodos | | 40s |
| 12 | Resultados Esperados: Critérios do MVP | Resultados Esperados | `[1,0 pt]` | 45s |
| 13 | Encerramento & Arguição | Fechamento | — | 15s |
| **Total** | **13 Slides Alinhados à Avaliação** | **Rubrica Mackenzie** | **[10,0 pts]** | **9m40s** |
