# Fontes e Referências do Estado da Arte — Milet

**Projeto Acadêmico:** Milet — Plataforma Digital para Decisão, Comparação e Gestão Contínua de Energia  
**Curso:** Engenharia da Computação · Universidade Presbiteriana Mackenzie  
**Semestre:** 2026.2 (Projetos de Engenharia da Computação I)

Este documento compila a trilha formal de evidências legislativas, regulatórias, acadêmicas e mercadológicas que fundamentam a concepção técnica e a arquitetura da Milet.

---

## 1. Legislação e Marcos Regulatórios Brasileiros

1. **BRASIL. Lei nº 14.300, de 6 de janeiro de 2022.**  
   Institui o marco legal da microgeração e minigeração distribuída, o Sistema de Compensação de Energia Elétrica (SCEE) e o Programa de Energia Renovável Social (PERS). Estabelece as regras de transição tarifária para a GD e as modalidades de geração compartilhada e autoconsumo remoto.

2. **BRASIL. Decreto nº 13.097, de 2026.**  
   Regulamenta o cronograma e os procedimentos para a abertura do mercado livre de energia elétrica para os consumidores atendidos em baixa tensão (Grupo B), definindo o papel dos agentes de comercialização varejista perante a Câmara de Comercialização de Energia Elétrica (CCEE) e determinando a criação de uma plataforma centralizada pública de comparação de ofertas e preços gerida pela CCEE.

3. **ANEEL — AGÊNCIA NACIONAL DE ENERGIA ELÉTRICA. Resolução Normativa nº 1.000, de 7 de dezembro de 2021.**  
   Estabelece as Regras de Prestação do Serviço Público de Distribuição de Energia Elétrica, consolidando direitos e deveres dos consumidores, padrões de qualidade do fornecimento, medição e faturamento no Ambiente de Contratação Regulada (ACR).

4. **ANEEL — AGÊNCIA NACIONAL DE ENERGIA ELÉTRICA. Resolução Normativa nº 1.059, de 7 de fevereiro de 2023.**  
   Aprimora as regras aplicáveis à micro e minigeração distribuída decorrentes da Lei nº 14.300/2022, disciplinando o acesso à rede de distribuição e a compensação de créditos de energia elétrica.

5. **CCEE — CÂMARA DE COMERCIALIZAÇÃO DE ENERGIA ELÉTRICA. Procedimentos de Comercialização — Submódulo 1.8: Dados de Medição e Informações de Consumo.**  
   Regula o compartilhamento não discriminatório e padronizado de dados históricos de medição e consumo dos últimos 12 meses para o consumidor e para terceiros formalmente autorizados, sob as diretrizes da LGPD (Lei nº 13.709/2018).

6. **CCEE — CÂMARA DE COMERCIALIZAÇÃO DE ENERGIA ELÉTRICA. Regras e Procedimentos de Comercialização — Comercialização Varejista.**  
   Define a atuação do comercializador varejista na representação de consumidores livres e especiais perante a CCEE, eliminando a exigência de aportes diretos de garantias pelos consumidores finais.

---

## 2. Benchmarks Internacionais e Modelos Tecnológicos

1. **ARCADIA POWER (EUA). Arc Platform & Utility Data Engine.**  
   Plataforma de agregação e normalização de dados de concessionárias norte-americanas via APIs proprietárias. Atua na ingestão automatizada de faturas e conexão de consumidores a projetos de energia solar comunitária (*community solar*).  
   *Referência no projeto:* Arquitetura do Passaporte Energético e extração automatizada de dados elétricos via parser.

2. **ENERGY OGRE (EUA — Texas / ERCOT). Automated Electricity Management Service.**  
   Serviço independente de concierge e gestão contínua de contratos residenciais e PMEs no mercado desregulamentado do Texas. Utiliza algoritmo proprietário para simular curvas de carga e trocar contratos periodicamente em nome do usuário mediante assinatura mensal fixa.  
   *Referência no projeto:* Princípio da independência da plataforma e modelo de gestão contínua (*Energy Autopilot*) com auditoria mensal da economia.

3. **PICLO & ELECTRON (Reino Unido). Local Flexibility & Peer-to-Peer Trading Platforms.**  
   Marketplaces digitais independentes para negociação de flexibilidade energética local e agregação de recursos energéticos distribuídos (DERs) conectados às redes de distribuição (*DNOs*).  
   *Referência no projeto:* Mecanismo de leilão reverso (RFQ), padronização de lances de fornecedores e carteiras agrupadas de oferta.

4. **POWERLEDGER & ENERGY WEB FOUNDATION (Global / Europa). Decentralized Energy Accounting.**  
   Protocolos e plataformas de registro distribuído e rastreabilidade para emissão de garantias de origem de energia renovável (EACs / I-RECs) e liquidação auditável entre produtores e consumidores.  
   *Referência no projeto:* Rastreabilidade auditável de eventos de contratação e histórico imutável (US-027).

---

## 3. Engenharia de Requisitos e Métodos Ágeis

1. **COHN, Mike. User Stories Applied: For Agile Software Development.** Boston: Addison-Wesley, 2004.  
   Fundamentação para a estruturação de épicos, estimativa relativa e decomposição de requisitos em histórias orientadas a valor para o usuário.

2. **NORTH, Dan. Introducing BDD (Behavior-Driven Development).** Better Software Magazine, 2006.  
   Base metodológica para a especificação dos critérios de aceite no formato *Given / When / Then* (Dado que / Quando / Então), permitindo que a especificação sirva como teste automatizado no ciclo de desenvolvimento.

3. **SPIDER Technique for Story Splitting.**  
   Técnica ágil de decomposição de histórias de alta incerteza técnica ou complexidade de negócio através de 6 dimensões analíticas:
   - **S**pikes (provas de conceito e pesquisas de arquitetura);
   - **P**aths (caminhos e fluxos alternativos);
   - **I**nterfaces (canais de entrada e formatos de dados);
   - **D**ata (variações e limites de dados elétricos);
   - **E**nterprise Rules (regras regulatórias e normativas ANEEL/CCEE);
   - **R**educe (redução para o núcleo essencial do MVP).

4. **OSTERWALDER, Alexander; PIGNEUR, Yves. Business Model Generation: Inovação em Modelos de Negócios.** Rio de Janeiro: Alta Books, 2011.  
   Referencial metodológico para a elaboração do Business Model Canvas v0.1 como um instrumento científico de mapeamento e validação de hipóteses de negócio.
