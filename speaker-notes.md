# Roteiro de Apresentação (Speaker Notes) — Milet

**Disciplina:** Projetos de Engenharia da Computação I (2026.2) — Turma 6  
**Instituição:** Universidade Presbiteriana Mackenzie  
**Autor:** Eduardo Ferreira de Mattos  
**Docente Orientador:** Prof. Dr. Rodrigo Juliani  

**Tempo Total de Fala:** ~10 minutos (Tempo limite oficial da banca: 10 minutos)

---

### Slide 1 — Tema (0:20s)
- **Tempo estimado:** 20 segundos (00:00 – 00:20)
- **Título:** Milet — Plataforma digital para decisão, comparação e gestão contínua de energia.
- **Roteiro de Fala:**
  > "Bom dia, professor Rodrigo Juliani e banca avaliadora. Apresento o projeto da Milet: plataforma digital para decisão, comparação e gestão contínua de energia. A Milet investiga como transformar uma decisão energética hoje fragmentada em uma jornada digital contínua, rastreável e comparável, alinhada aos requisitos formais da disciplina Projetos de Engenharia da Computação I."

---

### Slide 2 — Motivação (0:45s)
- **Tempo estimado:** 45 segundos (00:20 – 01:05)
- **Título:** Energia também pode ser uma decisão de contratação.
- **Roteiro de Fala:**
  > "A motivação parte da premissa de que energia também pode ser uma decisão de contratação. O modelo tradicional percebido pelo consumidor é passivo: distribuidora, conta e pagamento compulsório. Porém, consumidores elegíveis podem escolher fornecedores no Mercado Livre (ACL), negociar condições e avaliar Geração Distribuída. A rede física continua sendo da distribuidora; o que muda é a relação comercial de contratação. Desde 2024, todos os consumidores do Grupo A têm esse direito regulatório garantido."

---

### Slide 3 — Problema Tratado (0:45s)
- **Tempo estimado:** 45 segundos (01:05 – 01:50)
- **Título:** Ter escolha não significa saber escolher.
- **Roteiro de Fala:**
  > "Contudo, ter escolha não significa saber escolher. O decisor enfrenta uma jornada cheia de fricções: não sabe que pode escolher, descobre alternativas, precisa entender elegibilidade, compara propostas incomparáveis e precisa verificar se a economia prometida realmente aconteceu. Perguntas como 'Sou elegível?', 'Quanto economizo?' e 'O resultado aconteceu?' evidenciam que o problema da Milet não é apenas encontrar preço, mas sim preservar o contexto contínuo entre dados, decisão, contratação e resultado."

---

### Slide 4 — Estado da Arte (1/3): Mercado e Regulação (0:55s)
- **Tempo estimado:** 55 segundos (01:50 – 02:45)
- **Título:** Mercado e Regulação no Setor Elétrico Brasileiro.
- **Roteiro de Fala:**
  > "No Estado da Arte, analisamos mercado e regulação. O setor elétrico brasileiro evoluiu da dualidade ACR vs ACL para a abertura do Grupo A em 2024 e a consolidação da Geração Distribuída como rota distinta. Além disso, a CCEE avança na digitalização das migrações e planeja uma plataforma centralizada pública de comparação. Destacamos nossa tese acadêmica: a Milet não deve ser defendida pela tese de que 'não existe comparador', pois a comparação básica tende a se tornar infraestrutura pública."

---

### Slide 5 — Estado da Arte (2/3): Soluções Existentes (0:50s)
- **Tempo estimado:** 50 segundos (02:45 – 03:35)
- **Título:** Mapeamento do mercado: soluções existentes e referências.
- **Roteiro de Fala:**
  > "Mapeamos as soluções existentes estritamente documentadas no relatório N1. A UC Livre atua como marketplace de RFQ e comparação no mercado livre; a Deskonta foca em geração distribuída compartilhada; a Energy Ogre provou o modelo de gestão recorrente por assinatura no Texas; a EnergySage é referência em transparência de propostas; e a CCEE opera como infraestrutura de liquidação e futura comparação estatal. Nenhuma atribuição além do documentado foi feita."

---

### Slide 6 — Estado da Arte (3/3): Lacuna Investigada (0:50s)
- **Tempo estimado:** 50 segundos (03:35 – 04:25)
- **Título:** A lacuna investigada: a integração contínua dos mecanismos.
- **Roteiro de Fala:**
  > "A lacuna investigada pela Milet está na integração contínua dos mecanismos: Passaporte Energético, motor de rotas, comparação normalizada, RFQ reverso, workflow de execução, Savings Ledger e reotimização. Os componentes existem isoladamente. A nossa hipótese acadêmica é testar a integração desses mecanismos em uma jornada contínua adequada ao contexto brasileiro, sem qualquer pretensão comercial ingênua de ineditismo absoluto."

---

### Slide 7 — Plano de Projeto (1/3): Perfis e Proposta de Valor (0:45s)
- **Tempo estimado:** 45 segundos (04:25 – 05:10)
- **Título:** Perfis e Proposta de Valor: Jobs, Pains e Gains.
- **Roteiro de Fala:**
  > "No Plano de Projeto, extraímos do Fibery os User Profiles e o Value Proposition Canvas. Enfatizamos Jobs, Pains e Gains. Definimos como prioridade absoluta o Consumidor PME e Decisor Energético (UP-01), conectando-o aos fornecedores (UP-03 e UP-04), integradores EPC (UP-05) e ao Operador Milet (UP-06). Reforçamos que os perfis orientam requisitos e backlog; não são personas de marketing."

---

### Slide 8 — Plano de Projeto (2/3): Epics, User Stories e MVP (0:50s)
- **Tempo estimado:** 50 segundos (05:10 – 06:00)
- **Título:** Épicos, User Stories e a construção do MVP em Projetos I.
- **Roteiro de Fala:**
  > "Apresentamos a estrutura dos Épicos e das 28 User Stories do relatório. Destacamos as histórias do fluxo principal: US-001 (elegibilidade), US-002 (ingestão de fatura), US-006 (rotas), US-010 (RFQ), US-013 (comparação normalizada), US-019 (esteira de migração), US-021 (razão de economia) e US-027 (rastreabilidade). Fixamos a definição oficial do MVP: primeira versão funcional do fluxo prioritário construída em Projetos I, com operação assistida ou simulada onde necessário."

---

### Slide 9 — Plano de Projeto (Épicos Ampliados) (0:35s)
- **Tempo estimado:** 35 segundos (06:00 – 06:35)
- **Título:** Épicos do MVP: Visão Ampliada do Fibery Whiteboard.
- **Roteiro de Fala:**
  > "Exibimos a visão ampliada do Whiteboard de Épicos no Fibery. Esta visualização de alta resolução detalha como as 28 User Stories se agrupam nos grandes blocos de valor da solução Milet: desde a Descoberta de Elegibilidade e Ingestão de Faturas, passando pelo Motor de Comparação Normalizada e Disparo de RFQ, até a Esteira de Migração e o Savings Ledger."

---

### Slide 10 — Plano de Projeto (3/3): Business Model Canvas (0:40s)
- **Tempo estimado:** 40 segundos (06:35 – 07:15)
- **Título:** Business Model Canvas: hipóteses em validação.
- **Roteiro de Fala:**
  > "Exibimos o Business Model Canvas v0.1 importado do Fibery sob a matriz Strategyzer, identificado com a badge 'hipóteses em validação'. Destacamos o segmento prioritário de PMEs, a proposta de valor contínua do fluxo entender-comparar-competir-executar-acompanhar-reotimizar, e registramos que as fontes de receita são hipóteses a serem validadas."

---

### Slide 11 — Cronograma (1/2): Projetos I · 2026.2 (0:45s)
- **Tempo estimado:** 45 segundos (07:15 – 08:00)
- **Título:** Cronograma Oficial · Projetos I (2026.2).
- **Roteiro de Fala:**
  > "O cronograma de Projetos I (2026.2) segue as datas oficiais do plano de ensino: de 10/08 a 20/09 para Discovery; de 21/09 a 28/09 para Plano de Projeto; de 29/09 a 18/10 para a construção da primeira versão funcional do MVP; com entrega e apresentação do MVP no marco oficial de 19/10/2026. A partir de 26/10 aplicamos SSDLC e segurança, seguidos por testes e validação em novembro. Reforçamos a mensagem: o MVP não fica para Projetos II."

---

### Slide 12 — Cronograma (2/2): Gantt + Continuidade em Projetos II (0:35s)
- **Tempo estimado:** 35 segundos (08:00 – 08:35)
- **Título:** Gantt Geral & Continuidade em Projetos II.
- **Roteiro de Fala:**
  > "Visualizamos no Gantt do Fibery a transição para Projetos II (2027.1), cujos rótulos são de continuidade: evolução técnica, mais integrações reais de APIs, automação, piloto ampliado e consolidação da solução. Registramos a nota de que as datas de Projetos II são macroplanejamento preliminar a ser sincronizado com o plano de ensino do próximo semestre."

---

### Slide 13 — Cronograma (Gantt Ampliado - Partes 1 e 2) (0:35s)
- **Tempo estimado:** 35 segundos (08:35 – 09:10)
- **Título:** Detalhamento do Cronograma: Visão Expandida Fibery Gantt.
- **Roteiro de Fala:**
  > "Exibimos em alta resolução o Gantt completo do Fibery em duas partes ampliadas: a Parte 1 (superior) detalha cada sprint e entregável de Projetos I até a entrega do MVP em 19/10 e encerramento em dezembro; a Parte 2 (inferior) apresenta o cronograma preliminar de continuidade para Projetos II em 2027.1."

---

### Slide 14 — Resultados Esperados (0:40s)
- **Tempo estimado:** 40 segundos (09:10 – 09:50)
- **Título:** Resultados Esperados: do Checkpoint de MVP à Continuidade.
- **Roteiro de Fala:**
  > "Organizamos os Resultados Esperados em três marcos bem definidos: até o Checkpoint de MVP em 19/10 entregamos a primeira versão funcional do fluxo prioritário; até o fim de Projetos I entregamos o MVP refinado, arquitetura documentada, SSDLC e hipóteses validadas; e em Projetos II damos continuidade com integrações reais, automação e piloto ampliado. A mensagem final sintetiza: Projetos I precisa provar que o ciclo funciona; Projetos II deve provar que ele pode amadurecer."

---

### Slide 15 — Encerramento (0:10s)
- **Tempo estimado:** 10 segundos (09:50 – 10:00)
- **Título:** Milet — Mesma energia. Mais possibilidades.
- **Roteiro de Fala:**
  > "Milet: Mesma energia. Mais possibilidades. Agradeço ao professor orientador Rodrigo Juliani e à banca pela atenção, e fico à disposição para a arguição."

---

### Tabela Resumo: Estrutura do Deck Oficial N1 (15 Slides)
| Slide | Tópico Oficial | Conteúdo Principal | Tempo Estimado |
| :---: | :--- | :--- | :---: |
| 1 | Tema | Tese Central de Investigação da Milet | 20s |
| 2 | Motivação | Energia como decisão de contratação | 45s |
| 3 | Problema Tratado | Fricções do decisor e preservação de contexto | 45s |
| 4 | Estado da Arte (1/3) | Mercado e Regulação (Grupo A, GD, CCEE) | 55s |
| 5 | Estado da Arte (2/3) | Matriz de Soluções Existentes (UC Livre, Deskonta, Ogre, Sage, CCEE) | 50s |
| 6 | Estado da Arte (3/3) | Lacuna Investigada e Hipótese Acadêmica | 50s |
| 7 | Plano de Projeto (1/3) | User Profiles (Fibery) & VPC Canvas | 45s |
| 8 | Plano de Projeto (2/3) | 28 User Stories & Escopo do MVP | 50s |
| 9 | Plano de Projeto (Zoom Épicos) | Visão Ampliada do Whiteboard de Épicos | 35s |
| 10 | Plano de Projeto (3/3) | Business Model Canvas (Fibery Whiteboard) | 40s |
| 11 | Cronograma (1/2) | Projetos I · 2026.2 (Marco 19/10 MVP) | 45s |
| 12 | Cronograma (2/2) | Gantt & Continuidade Projetos II | 35s |
| 13 | Cronograma (Gantt Ampliado) | **[NOVO] Visão Expandida HD (Parte Superior + Inferior)** | 35s |
| 14 | Resultados Esperados | Três marcos de entrega e consolidação | 40s |
| 15 | Encerramento | Slogan oficial e Q&A | 10s |
