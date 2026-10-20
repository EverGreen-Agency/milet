# Roteiro do vídeo de pitch · Milet · Sebrae Supernova 2026 (v2)

Fonte única da **fala**. O [deck](deck.html) guarda só a deixa de cada slide; quando uma fala mudar, mude aqui. A jornada do produto que aparece no vídeo está especificada em [demo-spec.md](demo-spec.md); as imagens, em [prompts-imagens.md](prompts-imagens.md).

| Item | Valor |
|---|---|
| Limite | **3:00** (regra da Supernova). Alvo: **2:45**, para sobrar margem |
| Fala | ~360 palavras (~145 palavras/min com pausas) |
| Quem fala | Eduardo e Gustavo (divisão na seção 3). A professora orientadora aparece só no bloco de equipe |
| Formato | 1920×1080 · 30 fps · H.264 · voz a -14 LUFS |
| Estilo | *Talking head* com motion graphics, versão premium (Iman Gadzhi): fundo escuro, título serifado, B-roll cinematográfico, sound design discreto |
| Regra de ouro | Cada gráfico carrega uma informação. A banca avalia **clareza e consistência**, não efeito |

### O que cada bloco prova para a banca
Critérios da Supernova segundo a cópia pública do regulamento citada no kit anterior (não conferi o texto oficial; vale confirmar no edital da sua turma).

| Critério | Blocos que respondem |
|---|---|
| Conhecimento do problema e do público | 00 · 01 · 02 · 03 |
| Inovação e relevância | 04 · 05 · 06 |
| Consistência e viabilidade do BMC | 07 (bate com o BMC entregue: dois segmentos, duas receitas) |
| Alcance de mercado | 02 · 07 |
| Viabilidade técnica | 05 (produto real funcionando) · 08 |

---

## 1. Bíblia visual

### Layouts (todo plano usa um destes)

| Código | Composição | Quando usar |
|---|---|---|
| **L1 · Rosto** | Pessoa centralizada, do peito para cima, fundo escuro desfocado | Convicção, abertura, fechamento |
| **L2 · Lado a lado** | Pessoa no terço esquerdo, gráfico entrando pela direita (painel carvão, cantos 28 px) | 1 número ou 1 lista curta |
| **L3 · Gráfico + PiP** | Gráfico em tela cheia, pessoa num círculo de 280 px no canto inferior esquerdo, borda âmbar 2 px | Tabelas, demo, comparações |
| **L4 · Gráfico puro** | Só gráfico ou B-roll | Gancho visual, transições, dados de impacto |

### Ritmo
- Algo muda na tela a cada **3–5 s**: corte de layout, *punch-in* (100% → 115% no rosto, corte seco), gráfico entrando ou palavra-chave.
- *Punch-in* na palavra mais importante da frase.
- *Jump cuts* tiram respirações e hesitações; manter ~0,6 s de pausa intencional antes de cada virada ("Qual é a mais barata?").
- Na demo, o ritmo desacelera: cada tela fica pelo menos 6 s, para a banca entender.

### Tipografia e cor (mesmos tokens do deck)
- Títulos e palavras-chave: **Playfair Display** 600; palavra de ênfase em itálico âmbar `#D39B3D`.
- Apoio: **Plus Jakarta Sans**. Rótulos e fontes de dados: **JetBrains Mono** em caixa alta, espaçamento largo.
- Fundo carvão `#1A1A1A`, texto marfim `#F7F3EA`, apoio areia `#C9B89F`. Nada de branco puro, nada de vermelho.
- Cor do rosto: leve aquecimento (+5 de temperatura), pretos levemente lavados, para casar com o deck. Mesma correção para os dois apresentadores.

### Legendas
- **Só palavras-chave**: 1–3 palavras por vez, Playfair 600, 96 px, centro-baixo (L1) ou ao lado do rosto (L2).
- Entrada: sobe 20 px + fade em 250 ms, curva `cubic-bezier(0.32, 0.72, 0, 1)`.
- Gerar também um `.srt` completo (legenda fechada, separada da arte).

### Som
- **Música:** cinematográfica minimalista (piano + pad), 70–90 BPM, licenciada, -24 dB sob a voz; sobe a -16 dB nas transições e no fechamento.
- **SFX** baixos, nunca cartunescos: `whoosh` curto em troca de layout; `tick` em cada número; `click` de UI na demo; `riser` de 1,5 s antes da solução; `hit` grave no logo final.

---

## 2. Roteiro por bloco

Cada bloco: **tempo · layout · slide do deck · quem fala**, depois a fala, a tela, os assets e o som.

### 00 · Gancho (0:00–0:10) · L4 → L1 · slide 02 · Eduardo

> "Desde 2024, toda empresa do Grupo A pode escolher de quem compra energia. Mas olha o que acontece quando ela tenta."

**Tela**
- 0:00–0:03: tela preta; o número **2024** em contorno âmbar se desenha (stroke animado em 1,2 s). L4.
- 0:03–0:07: corta para o rosto em L1; palavra-chave **"pode escolher"**.
- 0:07–0:10: *punch-in* em "olha o que acontece"; as três propostas do bloco 01 caem por cima do quadro.

**Assets:** GFX-01 · A-roll E00 · **Som:** `tick` no 2024, `whoosh` na transição.

---

### 01 · Problema (0:10–0:27) · L4 → L2 · slide 03 · Eduardo

> "Chegam três propostas. Uma em reais por megawatt-hora, outra em percentual de desconto, outra com preço fixo e multa no anexo. Qual é a mais barata? *(pausa)* Nem o dono da empresa sabe. E é ele quem assina por anos."

**Tela**
- 0:10–0:12: IMG-01 (conta no balcão), *push-in* lento.
- 0:12–0:19: as três propostas do slide 03 entram uma a uma, levemente rotacionadas, em sincronia com "uma", "outra", "outra"; IMG-02 desfocada ao fundo.
- 0:19–0:22: **"Qual é a mais barata?"** em Playfair 120 px no centro; propostas desfocam. Música corta por 0,6 s.
- 0:22–0:25: rosto em L2, palavra-chave **"nem o dono sabe"**.
- 0:25–0:27: IMG-04 (caneta assinando) em L4 na palavra "assina".
- Rodapé durante o bloco: `EXEMPLOS ILUSTRATIVOS` (JetBrains Mono 18 px, areia).

**Assets:** GFX-02 · IMG-01 · IMG-02 · IMG-04 · **Som:** papel deslizando em cada proposta; silêncio na pergunta.

---

### 02 · Dimensão (0:27–0:43) · L3 · slide 04 · Eduardo

> "A CCEE estimou em setenta e duas mil as pequenas e médias empresas que poderiam migrar. Em 2025, foram cerca de vinte e uma mil migrações. E no começo de 2026, o ritmo caiu mais de um terço. A porta abriu. A maioria ainda não atravessou."

**Tela**
- Os três números do slide 04 entram um por vez com contador animado (0 → 72 mil em 0,8 s; 0 → 21,7 mil; 0 → −36,5%), cada um com a fonte em mono embaixo, visível por no mínimo 2 s.
- "A porta abriu": IMG-03 (torres ao entardecer), 2 s, com a frase na área vazia à direita.
- "A maioria ainda não atravessou": rosto em L1, *punch-in*.

**Assets:** GFX-03 · IMG-03 · **Som:** `tick` por número.
**Antes de gravar:** conferir os três números na base oficial da CCEE; há divergência entre fontes secundárias.

---

### 03 · Descobertas (0:43–0:58) · L2 · slide 05 · Eduardo

> "Estudando o mercado, vimos três coisas. Comparar preço virou commodity: um decreto de 2026 prevê até um comparador público da CCEE. Quem aconselha a empresa geralmente vende a energia. E os problemas aparecem depois da assinatura."

**Tela**
- Os três cards do slide 05 entram à direita, um por frase, numerais romanos em itálico âmbar.
- Ao citar o decreto, selo mono: `DECRETO Nº 13.097/2026`.
- **Se houver entrevistas antes da gravação:** trocar a terceira frase por uma citação real em tela cheia (L4, Playfair itálico, "— decisor de PME, setor X"). Uma frase real de cliente vale mais que qualquer gráfico.

**Assets:** GFX-04 · **Som:** `whoosh` leve por card.

---

### 04 · Solução (0:58–1:06) · L1 → L4 · slide 06 · Eduardo

> "Por isso criamos a Milet: um jeito independente de contratar energia sem adivinhar."

**Tela**
- IMG-05 (medidor) em L4 por 2 s enquanto o `riser` sobe.
- Em "Milet": *logo sting* de 1,5 s (símbolo âmbar gira 15° e assenta sobre carvão).
- "Sem adivinhar": palavra-chave em itálico âmbar, rosto em L1.

**Assets:** IMG-05 · GFX-05 (logo sting) · **Som:** `riser` → `hit` suave.

---

### 05 · Demo do produto (1:06–1:40) · L3 · slide 07 · Eduardo

> "A empresa envia a fatura. A Milet lê os dados e monta o Passaporte Energético: consumo, demanda, contrato, distribuidora. O diagnóstico compara rotas, não só fornecedores: mercado livre, solar própria ou compartilhada. E as propostas aparecem na mesma régua: custo total, prazo e risco. Nenhum fornecedor paga para aparecer primeiro. Isso já funciona hoje, com dados de demonstração."

**Tela:** gravação real do `/diagnostico` dentro da moldura de navegador do slide 07, rosto em PiP. Os quatro momentos e os requisitos de cada tela estão em [demo-spec.md](demo-spec.md).

| Tempo | Momento | Zoom e destaque |
|---|---|---|
| 1:06–1:13 | **M1** clique em *Usar fatura de demonstração* e estado de leitura | Zoom 1,6× no botão; anel âmbar no clique; manter a leitura inteira na tela |
| 1:13–1:21 | **M2** conferência: consumo, demanda, distribuidora | Destaque em sequência nos três campos; rótulo flutuante **Passaporte Energético** |
| 1:21–1:29 | **M3** rotas: mercado livre, solar própria, compartilhada | Zoom na lista de rotas; cada rota acende quando é dita |
| 1:29–1:40 | **M4** propostas lado a lado | Zoom 1,8× na linha de custo total; depois sublinhado âmbar em **"Nenhuma oferta compra posição"**; selo `NO AR · DADOS DE DEMONSTRAÇÃO` no fim |

**Assets:** SCR-01 a SCR-04 · **Som:** `click` de UI em cada clique; música baixa.

---

### 06 · Diferencial (1:40–1:56) · L2 → L3 · slide 08 · Gustavo

> "Gestoras e comercializadoras já fazem partes disso. Nosso diferencial é ficar do lado da empresa: independência de fornecedor, dados que pertencem ao cliente e acompanhamento depois da assinatura, voltando a cotar antes do vencimento."

**Tela**
- "Gestoras e comercializadoras…": tabela do slide 08 em L3, colunas aparecendo da esquerda para a direita.
- "Nosso diferencial…": a coluna **Milet** acende; as outras ficam a 40% de opacidade.
- Cada critério dito ganha um *highlight* âmbar na linha correspondente.
- **Cuidado:** nunca dizer "somos os únicos". Clarke, UC Livre e Ynova já anunciam RFQ e gestão.

**Assets:** GFX-07 · **Som:** `whoosh` na coluna Milet.

---

### 07 · Modelo de negócio (1:56–2:13) · L3 · slide 09 · Gustavo

> "São dois lados. O fornecedor recebe demanda qualificada e paga uma taxa por contrato fechado, igual para todos e informada ao cliente. A empresa pode assinar o acompanhamento contínuo. As duas receitas são hipóteses que estamos testando."

**Tela**
- Diagrama do slide 09: o nó Milet pulsa uma vez; seta de **dados** PME → Milet → fornecedor; seta de **receita** voltando de cada lado, em sincronia com a fala.
- Selo âmbar `HIPÓTESE` nas duas receitas quando a palavra é dita.
- Consistência com o BMC entregue: mesmos dois segmentos, mesmas duas receitas.

**Assets:** GFX-08 · **Som:** `tick` em cada seta.

---

### 08 · Validação e próximos passos (2:13–2:28) · L2 · slides 10 e 11 · Gustavo

> "Nas próximas semanas, vamos ouvir dez decisores de PMEs e cinco comercializadoras, e fazer os primeiros diagnósticos com empresas reais, em modo concierge."

**Tela**
- Linha do tempo do slide 11 se desenha da esquerda para a direita; o ponto "Agora" pulsa.
- **Se já houver resultado** de conversas: trocar a fala por "Já conversamos com *N* decisores, e *X* disseram que…", com o número em Playfair 150 px.

**Assets:** GFX-09 · **Som:** música começa a subir.

---

### 09 · Equipe (2:28–2:38) · L1 dos dois · slide 12 · Eduardo e Gustavo

> **Eduardo:** "Eu sou o Eduardo, de Engenharia de Computação, e cuido do produto." **Gustavo:** "Eu sou o Gustavo, de *[curso]*, e cuido de *[área]*. E temos a orientação da professora *[nome]*."

**Tela**
- Cada um em L1 com *lower third*: `EDUARDO FERREIRA DE MATTOS · PRODUTO E TECNOLOGIA` e `GUSTAVO [SOBRENOME] · [ÁREA]` (mono, âmbar).
- Na menção à orientadora: grade do slide 12 com as três fotos.

**Assets:** GFX-10 (slide 12 com fotos) · fotos 240×240, fundo neutro.

---

### 10 · Fechamento (2:38–2:46) · L1 → L4 · slide 13 · Eduardo

> "A Milet existe para a empresa escolher a energia sem adivinhar. *(pausa)* Energia em mais liberdade."

**Tela**
- Primeira frase em L1, olhar fixo na câmera, sem gráfico.
- "Energia em mais liberdade": corte para o slide 13 (rocha âmbar, *push-in* lento de 105% → 100% em 4 s), contato embaixo.
- Segurar 2 s na tela final; cortar para preto antes de 2:50.

**Assets:** GFX-11 · **Som:** `hit` grave no logo; música resolve e corta.

---

## 3. Quem fala o quê
- **Eduardo** (blocos 00–05 e 10): problema, solução e demo; abre e fecha o vídeo.
- **Gustavo** (blocos 06–08): diferencial, modelo de negócio e validação.
- **Os dois** no bloco 09.
- Gravar os dois no mesmo lugar, mesma luz, mesmo microfone e mesmo enquadramento, para o corte entre eles parecer uma conversa, não dois vídeos colados.

---

## 4. Lista de assets

### Gráficos (GFX)
Caminho rápido: abrir o deck em tela cheia (**F**), esconder as marcações com **T** e gravar cada slide no OBS a 1920×1080 / 60 fps; a animação de entrada vira o motion. Os itens com ✱ precisam de animação extra (Remotion ou keyframes no CapCut).

| ID | Origem | Extra |
|---|---|---|
| GFX-01 | Número 2024 do slide 02 | ✱ desenho do contorno |
| GFX-02 | Slide 03 | entrada já existe |
| GFX-03 | Slide 04 | ✱ contadores numéricos |
| GFX-04 | Slide 05 | — |
| GFX-05 | Símbolo Milet | ✱ logo sting de 1,5 s |
| GFX-06 | Slide 06 | usado como apoio se o bloco 04 precisar |
| GFX-07 | Slide 08 | ✱ coluna Milet acendendo |
| GFX-08 | Slide 09 | ✱ setas de dados e receita |
| GFX-09 | Slide 11 | ✱ linha do tempo se desenhando |
| GFX-10 | Slide 12 | fotos reais |
| GFX-11 | Slide 13 | — |

### Gravações de tela (SCR)
- `/diagnostico` no Edge, janela 1920×1080, zoom 125%, tema claro, sem favoritos nem extensões visíveis.
- OBS a 60 fps; mouse lento e em linha reta; 1 s parado antes de cada clique.
- Os zooms são feitos na edição, não ao vivo.
- Só gravar depois que a demo passar em todos os requisitos de [demo-spec.md](demo-spec.md).

### Imagens (IMG)
Cinco imagens de B-roll, prompts prontos em [prompts-imagens.md](prompts-imagens.md). Só momentos emocionais, nunca dado ou produto; sem rostos.

| ID | Bloco |
|---|---|
| IMG-01 conta no balcão | 01 |
| IMG-02 três propostas na mesa | 01 |
| IMG-03 torres ao entardecer | 02 |
| IMG-04 caneta assinando | 01 |
| IMG-05 medidor de energia | 04 |
| — rocha âmbar (`assets/web/milet-hero-rocha-ambar-polida.webp`) | 10 |

### A-roll
- Um take por bloco, 2–3 tentativas cada, com 2 s de silêncio no início e no fim.
- Câmera na altura dos olhos; luz suave frontal ou de janela lateral; fundo escuro e organizado.
- Lapela ou celular a 30 cm fora do quadro. Áudio ruim derruba mais do que vídeo simples.
- Camisa lisa em tom neutro escuro.

---

## 5. Montagem (CapCut ou DaVinci)

Trilhas, de baixo para cima:
1. Música
2. SFX
3. A-roll (já com *jump cuts*)
4. B-roll e IMG
5. GFX e SCR (com as máscaras de PiP do L3)
6. Palavras-chave e selos (`EXEMPLOS ILUSTRATIVOS`, `DADOS DE DEMONSTRAÇÃO`, `HIPÓTESE`)

Ordem de trabalho: cortar a fala primeiro (o tempo final vem dela), depois encaixar layouts, depois gráficos, por último som e cor.

---

## 6. Pronto para enviar quando

- [ ] Duração total abaixo de **3:00**, com a fala compreensível em 1,0×.
- [ ] Todo número na tela tem fonte visível; os três da CCEE conferidos na base oficial.
- [ ] Toda tela do produto marcada como demonstração; a demo passa em [demo-spec.md](demo-spec.md).
- [ ] As duas receitas aparecem como hipótese e batem com o BMC entregue; nenhuma frase sugere tração que não existe.
- [ ] Nenhuma marcação "A PREENCHER" visível (deck com **T** ligado ao gravar).
- [ ] Nome da empresa com o mesmo gênero no vídeo, no deck e no BMC ("a Milet" ou "o Milet").
- [ ] Voz limpa, sem eco; música nunca acima da fala; os dois apresentadores com o mesmo som e a mesma cor.
- [ ] Assistido uma vez sem som (as palavras-chave contam a história?) e uma vez só com som (a fala se sustenta sozinha?).
