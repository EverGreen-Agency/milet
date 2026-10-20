# Roteiro do vídeo de pitch · Milet · Supernova (v1)

Fonte única da **fala**. O [deck](deck.html) só guarda a deixa de cada slide; quando uma fala mudar, mude aqui.

| Item | Valor |
|---|---|
| Duração alvo | **3:00** (ajustar quando o limite do edital for confirmado) |
| Formato | 1920×1080 · 30 fps · H.264 · áudio -14 LUFS |
| Fala total | ~430 palavras (~145 palavras/min, ritmo calmo) |
| Estilo | *Talking head* com motion graphics (*retention editing*), na versão premium do Iman Gadzhi: fundo escuro, tipografia serifada elegante, B-roll cinematográfico e sound design discreto |
| Regra de ouro | Cada gráfico carrega uma informação. Se só enfeita, sai. A banca da Supernova avalia **clareza e consistência**, não efeito. |

---

## 1. Bíblia visual

### Layouts (todo plano usa um destes)

| Código | Composição | Quando usar |
|---|---|---|
| **L1 · Rosto** | Você centralizado, enquadramento do peito para cima, fundo escuro desfocado | Frases de convicção, abertura, fechamento |
| **L2 · Lado a lado** | Você no terço esquerdo, gráfico entrando pela direita (painel carvão, cantos 28 px) | Explicações com 1 número ou 1 lista curta |
| **L3 · Gráfico + PiP** | Gráfico em tela cheia, você num círculo de 280 px no canto inferior esquerdo, borda âmbar 2 px | Tabelas, demo, comparações |
| **L4 · Gráfico puro** | Só gráfico ou B-roll, sem rosto | Hook visual, transições, dados de impacto |

### Ritmo
- Mudar algo na tela a cada **3–5 s**: corte de layout, *punch-in* (zoom de 100% → 115% no rosto em 1 frame), gráfico entrando ou palavra-chave.
- *Punch-in* sempre na palavra mais importante da frase, nunca no meio de uma palavra.
- *Jump cuts* para tirar respirações e hesitações; manter uma pausa intencional de ~0,6 s antes de cada virada ("Qual é a mais barata?").

### Tipografia e cor (mesmos tokens do deck)
- Títulos e palavras-chave: **Playfair Display** 600, itálico âmbar `#D39B3D` para a palavra de ênfase.
- Apoio: **Plus Jakarta Sans**. Rótulos e fontes de dados: **JetBrains Mono** em caixa alta, espaçamento largo.
- Fundo carvão `#1A1A1A`, texto marfim `#F7F3EA`, apoio areia `#C9B89F`. Nada de branco puro, nada de vermelho.
- Correção de cor do rosto: leve aquecimento (+5 temperatura), pretos levemente lavados, para casar com o deck.

### Legendas
- **Só palavras-chave**, não a fala inteira: 1–3 palavras por vez, Playfair 600, 96 px, centro-baixo (em L1) ou ao lado do rosto (em L2).
- A palavra de ênfase em âmbar itálico. Entrada: subir 20 px + fade em 250 ms, curva `cubic-bezier(0.32, 0.72, 0, 1)`.
- Gerar também um `.srt` completo para acessibilidade (legenda fechada, separada da arte).

### Som
- **Música:** cinematográfica minimalista (piano + pad), 70–90 BPM, -24 dB por baixo da voz, sobe para -16 dB nas transições e no fechamento.
- **SFX** (volume baixo, nunca cartunesco): `whoosh` curto em troca de layout; `tick` suave em cada número; `click` de UI na demo; `riser` de 1,5 s antes da revelação da solução; `hit` grave e curto no logo final.

---

## 2. Roteiro por bloco

Formato de cada bloco: **tempo · layout · slide do deck**, depois a fala, o que aparece na tela, o movimento, os assets e o som.

### 00 · Hook (0:00–0:12) · L4 → L1 · slide 02

**Fala**
> "Desde 2024, qualquer empresa do Grupo A pode escolher de quem compra energia. Mas olha o que acontece quando ela tenta."

**Tela**
- 0:00–0:03: tela preta, o número **2024** em contorno âmbar se desenha (stroke animado de 1,2 s). L4.
- 0:03–0:08: corta para você em L1. Palavra-chave **"pode escolher"** aparece quando você fala.
- 0:08–0:12: *punch-in* em "olha o que acontece". Transição: as três propostas (bloco 01) caem por cima do seu rosto.

**Assets:** GFX-01 (2024 em contorno) · A-roll take 00 · **Som:** `tick` no 2024, `whoosh` na transição.

---

### 01 · Problema (0:12–0:30) · L4 → L2 · slide 03

**Fala**
> "Chegam três propostas. Uma em reais por megawatt-hora. Outra em percentual de desconto. Outra com preço fixo, flexibilidade e uma multa escondida no anexo. Qual é a mais barata? *(pausa)* Nem o dono da empresa sabe. E é ele quem assina por três, cinco anos."

**Tela**
- 0:12–0:22: as três propostas do slide 03 entram uma a uma, levemente rotacionadas, sincronizadas com "uma", "outra", "outra". L4.
- 0:22–0:25: **"Qual é a mais barata?"** em Playfair 120 px no centro; as propostas desfocam ao fundo. Silêncio de música por 0,6 s.
- 0:25–0:30: você em L2; à direita, a palavra-chave **"assina por anos"**.
- Rodapé discreto durante todo o bloco: `EXEMPLOS ILUSTRATIVOS` (JetBrains Mono, 18 px, areia).

**Assets:** GFX-02 (gravar slide 03 do deck) · IMG-02 como fundo desfocado opcional · **Som:** papel deslizando em cada proposta, corte seco da música na pergunta.

---

### 02 · Dimensão (0:30–0:48) · L3 · slide 04

**Fala**
> "E isso não é um caso isolado. A CCEE estimou em cerca de setenta e duas mil as pequenas e médias empresas que poderiam migrar com a abertura. Em 2025, foram em torno de vinte e uma mil migrações. E no começo de 2026, o ritmo caiu mais de um terço. A porta abriu. A maioria ainda não atravessou."

**Tela**
- Os três números do slide 04 entram um por vez com contador animado (0 → 72 mil em 0,8 s; 0 → 21,7 mil; 0 → −36,5%).
- Cada número com a fonte em mono embaixo (`CCEE, 2023` etc.) visível por pelo menos 2 s.
- "A porta abriu" em L1 com *punch-in*; "a maioria ainda não atravessou" com a palavra-chave em âmbar.

**Assets:** GFX-03 (slide 04) · IMG-03 (linhas de transmissão) como B-roll de 2 s em "a porta abriu" · **Som:** `tick` por número.
**Antes de gravar:** conferir os três números na base oficial da CCEE (há divergência entre fontes secundárias).

---

### 03 · Descobertas (0:48–1:05) · L2 · slide 05

**Fala**
> "Quando a gente estudou o mercado, três coisas apareceram. Comparar preço já virou commodity: a própria regulação prevê um comparador público. Quem aconselha a empresa geralmente vende a energia. E as reclamações se concentram depois da assinatura: cobrança, cancelamento, economia que não aparece."

**Tela**
- Os três cards do slide 05 entram à direita, um por frase, com os numerais romanos em itálico âmbar.
- Se houver entrevistas: inserir aqui **1 citação real** em tela cheia (L4), Playfair itálico, com "— decisor de PME, setor X". Substitui o card iii ou entra depois dele (+4 s).

**Assets:** GFX-04 (slide 05) · **Som:** `whoosh` leve por card.

---

### 04 · Solução (1:05–1:15) · L1 → L4 · slide 06

**Fala**
> "Por isso criamos a Milet: um jeito independente de a empresa contratar energia sem adivinhar. Funciona em três passos."

**Tela**
- `riser` de 1,5 s terminando em "Milet": *logo sting* de 1,5 s (símbolo âmbar girando 15° e assentando, fundo carvão).
- "Três passos": os três passos do slide 06 entram em sequência, cada um com o número em mono.

**Assets:** GFX-05 (logo sting, a partir de `milet-symbol-amber-darkbg.svg`) · GFX-06 (slide 06) · **Som:** `riser` → `hit` suave.

---

### 05 · Demo do MVP (1:15–1:50) · L3 · slide 07

**Fala**
> "Você envia a fatura que já recebe. A Milet lê os dados e monta o Passaporte Energético da empresa: consumo, demanda, contrato, distribuidora. Com isso, gera um diagnóstico com as rotas possíveis. E aí vem a parte que importa: todas as propostas na mesma régua. Custo total, prazo, risco e o que ainda falta de informação. E nenhum fornecedor paga para aparecer primeiro. Isso já funciona hoje, com dados de demonstração."

**Tela** (gravação real do app, moldura de navegador do slide 07, você em PiP)

| Tempo | Gravação | Zoom / destaque |
|---|---|---|
| 1:15–1:21 | SCR-01: tela "Comece pela conta que você já recebe" → clique em *Carregar fatura de demonstração* | Zoom 1,6× no botão; anel âmbar no clique |
| 1:21–1:28 | SCR-02: tela "Conferir dados" com os campos preenchidos | Destaque em sequência de consumo, demanda, distribuidora; rótulo **Passaporte Energético** |
| 1:28–1:34 | SCR-03: diagnóstico, cartões R$ 10.920 / 12.480 kWh e "Rotas de suprimento avaliadas" | Zoom nos cartões; depois rolagem lenta até as rotas |
| 1:34–1:46 | SCR-04: tabela "Veja o custo inteiro" | Zoom 1,8× na linha **Custo total mensal**; depois na frase **"Nenhuma oferta compra posição"**, sublinhada em âmbar |
| 1:46–1:50 | SCR-04: clique em *Marcar proposta* | Selo `NO AR · DADOS DE DEMONSTRAÇÃO` no canto superior direito |

- Selo fixo durante todo o bloco: `FORNECEDORES ILUSTRATIVOS` (os nomes Alvorada e Serra Clara são fictícios).

**Assets:** SCR-01 a SCR-04 · referências estáticas em [shots/](shots/) · **Som:** `click` de UI em cada clique, música baixa.

---

### 06 · Diferencial (1:50–2:08) · L2 → L3 · slide 08

**Fala**
> "Existem gestoras e comercializadoras fazendo partes disso. Nosso diferencial é ficar do lado da empresa: a Milet não pertence a um grupo de energia, os dados são da empresa, e a gente continua depois da assinatura, acompanhando a economia e voltando a cotar antes do vencimento."

**Tela**
- "Existem gestoras…": tabela do slide 08 em L3, colunas aparecendo da esquerda para a direita.
- "Nosso diferencial…": a coluna **Milet** acende (fundo carvão sobe), as outras ficam a 40% de opacidade.
- Cada critério dito ganha um *highlight* âmbar na linha correspondente.

**Assets:** GFX-07 (slide 08) · **Som:** `whoosh` na coluna Milet.

---

### 07 · Modelo de negócio (2:08–2:26) · L3 · slide 09

**Fala**
> "O modelo tem dois lados. O fornecedor recebe demanda qualificada e dados prontos para cotar, e paga uma taxa por contrato fechado, igual para todos e informada ao cliente. A empresa pode pagar uma mensalidade pelo acompanhamento contínuo. As duas são hipóteses que estamos testando agora."

**Tela**
- Diagrama do slide 09: o nó Milet no centro pulsa uma vez; seta de **dados** da PME para a Milet e da Milet para o fornecedor; seta de **receita** voltando de cada lado, sincronizada com a fala.
- Selo âmbar `HIPÓTESE` nas duas receitas quando você diz "hipóteses".

**Assets:** GFX-08 (slide 09 + setas animadas) · **Som:** `tick` em cada seta.

---

### 08 · Validação e próximos passos (2:26–2:42) · L2 · slides 10 e 11

**Fala**
> "Nas próximas quatro semanas, vamos conversar com dez decisores de PMEs e cinco comercializadoras para validar quem paga e quanto, e fazer os primeiros diagnósticos com empresas reais, em modo concierge."

**Tela**
- Linha do tempo do slide 11 se desenha da esquerda para a direita; o ponto "Agora" pulsa.
- Se já houver resultado de entrevistas, troca a fala por: "Já conversamos com *N* decisores; *X* disseram que…" e mostra o número grande (Playfair 150 px).

**Assets:** GFX-09 (slide 11) · **Som:** música começa a subir.

---

### 09 · Equipe (2:42–2:52) · L2 · slide 12

**Fala**
> "Somos seis: computação, engenharia elétrica, administração, direito e arquitetura. É o tipo de time que um setor técnico e regulado exige."

**Tela**
- Grade da equipe do slide 12 com fotos reais; cada formação acende quando é dita.
- *Lower third* com seu nome: `EDUARDO FERREIRA DE MATTOS · COFUNDADOR` (mono, âmbar), em L2.

**Assets:** GFX-10 (slide 12 com fotos) · fotos da equipe (240×240, fundo neutro).

---

### 10 · Fechamento (2:52–3:00) · L1 → L4 · slide 13

**Fala**
> "A Milet existe para a empresa escolher a energia sem adivinhar. *(pausa)* Energia em mais liberdade."

**Tela**
- Primeira frase em L1, olhar fixo na câmera, sem gráfico.
- "Energia em mais liberdade": corte para o slide 13 (rocha âmbar ao fundo, *push-in* lento de 105% → 100% em 4 s), contato embaixo.
- Segurar 2 s de tela final antes do preto.

**Assets:** GFX-11 (slide 13) · **Som:** `hit` grave no logo, música resolve e corta.

---

## 3. Lista de assets

### Gráficos (GFX)
Caminho mais rápido: abrir o deck em tela cheia (tecla **F**), apertar **T** para esconder as marcações "A PREENCHER" e gravar cada slide com o OBS a 1920×1080 / 60 fps. A animação de entrada de cada slide vira o motion. Os itens marcados com ✱ precisam de animação extra (Remotion ou keyframes no CapCut).

| ID | Origem | Extra |
|---|---|---|
| GFX-01 | Número 2024 do slide 02 | ✱ desenho do contorno |
| GFX-02 | Slide 03 | entrada já existe |
| GFX-03 | Slide 04 | ✱ contadores numéricos |
| GFX-04 | Slide 05 | — |
| GFX-05 | Símbolo Milet | ✱ logo sting de 1,5 s |
| GFX-06 | Slide 06 | — |
| GFX-07 | Slide 08 | ✱ coluna Milet acendendo |
| GFX-08 | Slide 09 | ✱ setas de dados e receita |
| GFX-09 | Slide 11 | ✱ linha do tempo se desenhando |
| GFX-10 | Slide 12 | precisa das fotos |
| GFX-11 | Slide 13 | — |

### Gravações de tela (SCR)
- Navegador Edge em janela 1920×1080, zoom 125%, tema claro, sem favoritos nem extensões visíveis.
- Gravar com OBS a 60 fps; movimentos de mouse lentos e retos; esperar 1 s parado antes de cada clique.
- Fluxo: abrir o app → *Continuar para envio da fatura* → *Carregar fatura de demonstração* → *Aprovar dados e gerar diagnóstico* → avançar → *Marcar proposta*.
- Os zooms são feitos na edição, não ao vivo.

### Imagens geradas (IMG)
Use imagem só em momentos emocionais, nunca para dado ou produto. Sem rostos (evita parecer cliente falso e o efeito artificial de IA); mãos e ambientes funcionam melhor. Gerar em 16:9 e animar com *push-in* lento (Ken Burns) ou image-to-video de 5 s.

| ID | Bloco | Prompt |
|---|---|---|
| IMG-01 | 00 (opcional) | Close nas mãos de um comerciante segurando uma conta de energia impressa sobre o balcão de madeira de uma padaria às 6h, luz âmbar quente vindo da vitrine, fundo desfocado com pães, fotografia documental cinematográfica, lente 50 mm, grão de filme sutil, sem texto legível, sem rosto |
| IMG-02 | 01 | Mesa de um pequeno escritório à noite, três propostas impressas espalhadas, calculadora, xícara de café, luminária quente, clima de cansaço, cinematográfico, baixa saturação, sem texto legível, sem pessoas |
| IMG-03 | 02 | Torres de transmissão de alta tensão ao entardecer, céu âmbar degradê para carvão, silhueta, composição minimalista com amplo espaço negativo à direita, cinematográfico |
| IMG-04 | 07 (opcional) | Close extremo de uma caneta assinando um contrato, luz lateral quente, profundidade de campo rasa, sem texto legível |
| — | 10 | Sem geração: usar `assets/web/milet-hero-rocha-ambar-polida.webp` |

### A-roll (você na câmera)
- Gravar **um take por bloco**, 2–3 tentativas cada, com 2 s de silêncio no início e no fim.
- Câmera na altura dos olhos, luz suave frontal ou lateral (janela de lado funciona), fundo escuro e organizado.
- Microfone de lapela ou o celular a 30 cm fora do quadro. Áudio ruim derruba mais do que vídeo simples.
- Camisa lisa em tom neutro escuro (casa com o carvão do deck).

---

## 4. Montagem (CapCut ou DaVinci)

Trilhas, de baixo para cima:
1. Música
2. SFX
3. A-roll (blocos na ordem, *jump cuts* já feitos)
4. B-roll e IMG
5. GFX e SCR (com as máscaras de PiP do layout L3)
6. Palavras-chave e selos (`EXEMPLOS ILUSTRATIVOS`, `DADOS DE DEMONSTRAÇÃO`, `HIPÓTESE`)

Ordem de trabalho: cortar a fala primeiro (o tempo final vem dela), depois encaixar os layouts, depois os gráficos, por último som e cor.

---

## 5. Pronto para enviar quando

- [ ] Duração dentro do limite do edital, com a fala inteira compreensível em 1,0×.
- [ ] Todo número na tela tem fonte visível, e os três da CCEE foram conferidos na base oficial.
- [ ] Toda tela do produto está marcada como demonstração; nenhum fornecedor fictício parece real.
- [ ] As duas receitas aparecem como hipótese; nenhuma frase sugere tração que não existe.
- [ ] Nenhuma marcação "A PREENCHER" visível (deck com **T** ligado ao gravar).
- [ ] Áudio da voz limpo, sem eco, música nunca acima da fala.
- [ ] Assistido uma vez sem som (as palavras-chave contam a história?) e uma vez só com som (a fala se sustenta sozinha?).
