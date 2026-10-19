# Análise Técnica & Regulatória: Google Solar API, Enquadramento Grupo A e OCR Multimodal de Faturas

**Documento Técnico:** `docs/research/SOLAR_GRUPO_A_OCR_ANALYSIS.md`  
**Data:** 19 de Outubro de 2026  
**Autor:** Antigravity / Equipe Milet  
**Finalidade:** Fundamentação de produto, dados mínimos de entrada e roadmap de integração de IA e APIs de energia.

---

## 1. Google Solar API & Dimensionamento de Usina Própria

### 1.1 Como a Google Solar API Opera
A **Google Solar API** (evolução comercial do *Project Sunroof*) analisa dados geoespaciais, modelos digitais de superfície (DSM) e dados meteorológicos de satélite para calcular o potencial solar fotovoltaico de telhados com resolução sub-métrica.

Possui dois endpoints primários:
1. `GET /v1/buildingInsights:findClosest`: Retorna o resumo do edifício mais próximo de uma coordenada (`latitude`, `longitude`), contendo:
   - `solarPotential.maxArrayAreaMeters2`: Área máxima de telhado aproveitável para painéis solares;
   - `solarPotential.maxArrayPanelsCount`: Número máximo de módulos fotovoltaicos suportados;
   - `solarPotential.maxSunlightHoursPerYear`: Horas equivalentes de irradiação solar anual útil no plano dos painéis;
   - `solarPotential.roofSegmentStats`: Inclinação (*pitch*), azimute (*azimuth*), área e irradiação por água/queda de telhado;
   - `solarPotential.carbonOffsetFactorKgPerMwh`: Fator de emissão evitada de carbono.
2. `GET /v1/dataLayers:get`: Retorna camadas *GeoTIFF* (modelo de fluxo anual, fluxo mensal, máscara do telhado e sombreamento por obstáculos e edificações vizinhas).

### 1.2 Dados Mínimos Exigidos na Conferência (Milet App)
Para consultar a Google Solar API e calcular a viabilidade de geração própria versus Mercado Livre, a Milet precisa estruturar no cadastro/conferência da fatura:
- **Localização Exata:**
  - **Endereço Completo:** Logradouro, número, bairro;
  - **CEP:** Permite resolução imediata de coordenadas geográficas via Geocoding;
  - **Cidade / UF:** Determina a concessionária e a irradiação solar regional (ex.: Belo Horizonte ~ 5,38 kWh/m²/dia GHI);
- **Características Físicas da Cobertura:**
  - **Área Útil Estimada de Telhado (m²):** Utilizada como validação ou limitador da área captada via satélite;
  - **Tipo de Cobertura:** Metálico (telha trapezoidal/sanduíche), Fibrocimento, Cerâmico ou Laje (influencia custo de estrutura e viabilidade estrutural de sobrecarga);
  - **Posse do Imóvel:** Próprio vs Alugado (usina própria em imóvel alugado possui atrito contratual com proprietário).

---

## 2. Enquadramento Regulatória Grupo A vs Grupo B e Legislação Vigente

### 2.1 Marco Regulatório do Grupo A no Mercado Livre (ACL)
- **Portaria Normativa MME nº 50/2022:** Desde **01/01/2024**, todos os consumidores atendidos em alta ou média tensão (**Grupo A**, tensão de fornecimento $\ge 2,3\text{ kV}$) tornaram-se elegíveis para migrar ao Ambiente de Contratação Livre (ACL), independentemente da demanda contratada (eliminação da trava histórica de 500 kW/1.000 kW).
- **Modelo Varejista (Resolução Normativa ANEEL nº 1.009/2022):** A PME do Grupo A não precisa se filiar diretamente à CCEE (Câmara de Comercialização de Energia Elétrica) nem aportar garantias complexas na câmara; ela é representada por uma **Comercializadora Varejista**, que assume as obrigações operacionais e financeiras de liquidação na CCEE.

### 2.2 Estrutura Tarifária do Grupo A (Tarifa Binômia)
No Grupo A, a fatura é dividida em dois blocos regulados:
1. **Demanda Contratada (kW):** Tarifa fixa por kW colocado à disposição pela distribuidora (R$/kW), contratada formalmente.
   - Demanda mínima regulatória para o Grupo A: **30 kW** (Art. 136 da Resolução Normativa ANEEL nº 1.000/2021).
   - Se ultrapassar a demanda contratada em mais de 5%, incide cobrança de **Ultrapassagem de Demanda** (tarifa multiplicada por 2).
2. **Consumo de Energia (kWh):** Medido mensalmente e segregado por horário:
   - **Posto Tarifário Ponta:** Horário de maior carga no sistema (geralmente 3 horas consecutivas entre 17h e 21h em dias úteis);
   - **Posto Tarifário Fora Ponta:** Demais horas do dia e fins de semana.

### 2.3 Modalidades Tarifárias do Grupo A
- **Tarifa Horossazonal Verde (A4 Verde):** Demanda única contratada para todo o ciclo; tarifa de energia diferenciada apenas no consumo (ponta muito cara, fora ponta econômica). Modalidade padrão de 85% das PMEs comerciais.
- **Tarifa Horossazonal Azul (A4 Azul):** Duas tarifas distintas de demanda (demanda ponta e demanda fora de ponta) + tarifas de consumo ponta/fora ponta. Comum em indústrias pesadas ou clientes com pico noturno acentuado.

### 2.4 Marco Legal da Micro e Minigeração Distribuída (Lei nº 14.300/2022)
Para clientes que avaliam **usina solar própria**:
- **Autoconsumo Local:** A usina é instalada no mesmo local de consumo (telhado da padaria/clínica).
- **Tarifação do Fio B (TUSD Distribuição):** Projetos conectados após o período de transição pagam gradualmente o Fio B sobre a energia injetada na rede da distribuidora (transição de 2023 a 2029).
- **Comparativo de Decisão Milet:**
  - *Mercado Livre Varejista:* Zero CAPEX, economia imediata de 10% a 25% na energia, sem risco de obras ou manutenção;
  - *Usina Solar Própria (GD Local):* Exige CAPEX (ex.: R$ 150k a R$ 250k), payback médio de 3,5 a 5 anos, protege contra variações de tarifa regulada, mas ocupa espaço físico e exige manutenção de inversores.

---

## 3. Estado Atual do OCR Multimodal de Faturas com Google Gemini

### 3.1 O que já está operacional no repositório
1. **API do Google Gemini:** Já configurada e ativa no endpoint [`/api/v1/intakes.js`](file:///c:/Users/Lenovo/Desktop/milet/api/v1/intakes.js) utilizando o modelo `gemini-2.5-flash-lite` com *Structured JSON Output* (`responseMimeType: "application/json"` e `responseSchema`).
2. **Resend Email API:** Já configurada para disparo transacional de confirmação e encaminhamento do lead com idempotência.
3. **Mecanismo de Conferência (Human-in-the-Loop):** O app implementa a validação humana com índices de confiança calculados e campos editáveis antes da geração de cenários econômicos.

### 3.2 Roadmap Técnico para OCR 100% Autônomo com Gemini Multimodal
Para que o upload de PDF/imagem extraia os dados em tempo real direto da fatura física:
1. **Endpoint [`/api/v1/extract-invoice`](file:///c:/Users/Lenovo/Desktop/milet/api/v1/extract-invoice.js):**
   - Receber o arquivo via `POST` multipart ou base64;
   - Passar o documento como payload multimodal para o Gemini:
     ```json
     {
       "contents": [{
         "role": "user",
         "parts": [
           { "inlineData": { "mimeType": "application/pdf", "data": "<base64>" } },
           { "text": "Extraia com precisão: distribuidora, número da instalação/UC, CNPJ, razão social, endereço completo, CEP, subgrupo tarifário (A4/B3), modalidade (Verde/Azul), período, consumo ponta/fora ponta em kWh, demanda contratada e faturada em kW, valor total e tributos." }
         ]
       }],
       "generationConfig": {
         "responseMimeType": "application/json",
         "responseSchema": invoiceExtractionSchema
       }
     }
     ```
2. **Conexão com o frontend (`app/src/demo-adapter.js`):**
   - No método `extractInvoice(file)`, quando houver um arquivo real carregado, enviar para o endpoint serverless;
   - Preencher instantaneamente os novos campos de localização, Grupo A e consumo na tela de conferência.

---

## 4. Fontes Primárias e Referências
- **ANEEL:** Resolução Normativa nº 1.000, de 7 de dezembro de 2021 (Regras de Prestação do Serviço Público de Distribuição).
- **MME:** Portaria Normativa nº 50/GM/MME, de 27 de setembro de 2022 (Abertura do Mercado Livre para todo o Grupo A).
- **Planalto:** Lei Federal nº 14.300, de 6 de janeiro de 2022 (Marco Legal da Microgeração e Minigeração Distribuída).
- **Google Cloud:** Solar API Overview & Building Insights Endpoint Documentation (Google Developers).
- **CCEE:** Cartilha do Consumidor Livre Varejista (CCEE 2024/2026).
