# Roteiro do vídeo de pitch · Milet · Sebrae Supernova 2026 (v3)

Fonte única da **fala**. O [deck](deck.html) guarda só a deixa de cada slide; quando uma fala mudar, mude aqui. A jornada do produto que aparece no vídeo está especificada em [demo-spec.md](demo-spec.md); as imagens, em [prompts-imagens.md](prompts-imagens.md).

| Item | Valor |
|---|---|
| Limite | **3:00** (regra da Supernova) |
| Fala | Versão completa, com todas as falas: ~849 palavras, **~6:00** a 145 palavras/min (os tempos de cada bloco abaixo seguem esse ritmo). O Eduardo lapida para caber em 3:00 |
| Quem fala | **Eduardo, sozinho, do início ao fim**. Gustavo e a orientadora aparecem em foto no bloco de equipe |
| Formato | 1920×1080 · 30 fps · H.264 · voz a -14 LUFS |
| Estilo | *Talking head* com motion graphics, versão premium (Iman Gadzhi): fundo escuro, título serifado, B-roll cinematográfico, sound design discreto |
| Regra de ouro | Cada gráfico carrega uma informação. A banca avalia **clareza e consistência**, não efeito |

### O que cada bloco prova para a banca
Critérios da Supernova segundo a cópia pública do regulamento citada no kit anterior (não conferi o texto oficial; vale confirmar no edital da sua turma).

| Critério | Blocos que respondem |
|---|---|
| Conhecimento do problema e do público | 00 · 01 · 02 · 03 |
| Inovação e relevância | 04 · 05 · 06 |
| Consistência e viabilidade do BMC | 07 (bate com o BMC entregue: dois segmentos, duas receitas, mesmos canais) |
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
- Cor do rosto: leve aquecimento (+5 de temperatura), pretos levemente lavados, para casar com o deck. Mesma correção em todos os takes.

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

### 00 · Gancho (0:00–0:09) · L4 → L1 · slide 02 · Eduardo

> "Desde 2024, toda empresa do Grupo A pode escolher de quem compra energia. Mas olha o que acontece quando ela tenta."

**Tela**
- 0:00–0:03: tela preta; o número **2024** em contorno âmbar se desenha (stroke animado em 1,2 s). L4.
- 0:03–0:07: corta para o rosto em L1; palavra-chave **"pode escolher"**.
- 0:07–0:10: *punch-in* em "olha o que acontece"; as três propostas do bloco 01 caem por cima do quadro.

**Assets:** GFX-01 · A-roll E00 · **Som:** `tick` no 2024, `whoosh` na transição.

---

### 01 · Problema (0:09–0:28) · L4 → L2 · slide 03 · Eduardo

> "Chegam três propostas. Uma em reais por megawatt-hora. Outra em percentual de desconto. Outra com preço fixo, flexibilidade e uma multa escondida no anexo. Qual é a mais barata? *(pausa)* Nem o dono da empresa sabe. E é ele quem assina por três, cinco anos."

**Tela**
- "Chegam três propostas": IMG-01 (conta no balcão), *push-in* lento.
- "Uma… Outra… Outra…": as três propostas do slide 03 entram uma a uma, levemente rotacionadas; IMG-02 desfocada ao fundo. Em "multa escondida no anexo", a letra miúda da proposta C ("Multa rescisória e garantias no anexo III") ganha sublinhado âmbar.
- **"Qual é a mais barata?"** em Playfair 120 px no centro; propostas desfocam. Música corta por 0,6 s.
- "Nem o dono da empresa sabe": rosto em L2, palavra-chave **"nem o dono sabe"**.
- "Assina por três, cinco anos": IMG-04 (caneta assinando) em L4.
- Rodapé durante o bloco: `EXEMPLOS ILUSTRATIVOS` (JetBrains Mono 18 px, areia).

**Assets:** GFX-02 · IMG-01 · IMG-02 · IMG-04 · **Som:** papel deslizando em cada proposta; silêncio na pergunta.

---

### 02 · Dimensão (0:28–1:02) · L3 · slide 04 · Eduardo

> "E isso não é um caso isolado. A CCEE estimou em cerca de setenta e duas mil as pequenas e médias empresas que poderiam migrar com a abertura. Em 2025, foram cerca de vinte e uma mil migrações. E o processo até ficou mais simples: mais de setenta por cento das migrações do começo de 2026 já usaram o modelo simplificado da CCEE. Mesmo assim, o ritmo caiu mais de um terço. A porta abriu. A maioria ainda não atravessou."

**Tela**
- Os três números do slide 04 entram um por vez, cada um na sua frase, com contador animado (0 → 72 mil em 0,8 s; 0 → 21,7 mil; 0 → −36,5%) e a fonte em mono embaixo, visível por no mínimo 2 s.
- "O processo até ficou mais simples": entre o segundo e o terceiro número, corte para L2 com **70%** em Playfair ao lado do rosto e `MODELO SIMPLIFICADO · CCEE · 1T2026` em mono. É sobreposição na edição; o slide não muda.
- "Mesmo assim, o ritmo caiu": volta ao slide 04 no contador de −36,5%.
- "A porta abriu": IMG-03 (torres ao entardecer), 2 s, com a frase na área vazia à direita.
- "A maioria ainda não atravessou": rosto em L1, *punch-in*.

**Assets:** GFX-03 · IMG-03 · **Som:** `tick` por número.
**Números conferidos em 20/10/2026** (CCEE: 21.707 migrações em 2025; 4.827 no 1T2026 contra 7.603 no 1T2025). A Abraceel cita 18.928 para 2025: use sempre o número da CCEE e diga "CCEE" na tela. Modelo simplificado: mais de 70% das migrações do 1T2026, em vigor desde julho de 2025 (CCEE, via [Cenário Energia](https://cenarioenergia.com.br/2026/05/06/migracao-simplificada-mercado-livre-energia-1-trimestre-2026/), 06/05/2026).
**Não dizer** que "o Brasil paga a conta de luz mais cara do mundo": com ajuste por poder de compra, o estudo mais recente (CLP, 2026) coloca o Brasil em 66º de 138 países.

---

### 03 · Descobertas (1:02–1:29) · L2 · slide 05 · Eduardo

> "Estudando o mercado, vimos três coisas. Comparar preço virou commodity: um decreto de 2026 prevê até um comparador público da CCEE. Quem aconselha a empresa geralmente vende a energia. E as reclamações se concentram depois da assinatura: cobrança, cancelamento, economia que não aparece. Um fornecedor que entrevistamos resumiu assim: “o vendedor some, ganha a sua comissão, e fica a responsabilidade com a empresa”."

**Tela**
- Os três cards do slide 05 entram à direita, um por frase, numerais romanos em itálico âmbar.
- Ao citar o decreto, selo mono: `DECRETO Nº 13.097/2026`.
- Na citação: tela cheia em L4, Playfair itálico, “O vendedor some, ganha a sua comissão, e fica a responsabilidade com a empresa.”, assinada em mono `GERADORA DE GD · INTERIOR DE SP · ENTREVISTA, OUT/2026`. Sem o nome da empresa: a pesquisa foi apresentada como exploratória e o repositório é público.

**Assets:** GFX-04 · **Som:** `whoosh` leve por card.

---

### 04 · Solução (1:29–1:58) · L1 → L4 · slide 06 · Eduardo

> "Por isso criamos o Milet: um jeito independente de a empresa contratar energia sem adivinhar. A ideia é fazer com a energia o que o QuintoAndar fez com o aluguel: entender, comparar, contratar e acompanhar num lugar só. O que hoje é um vai e vem de e-mails vira uma decisão na mesma tela. A migração continua no prazo da regulação; o que fica rápido é decidir. Funciona assim."

**Tela**
- IMG-05 (medidor) em L4 por 2 s enquanto o `riser` sobe.
- Em "Milet": *logo sting* de 1,5 s (símbolo âmbar gira 15° e assenta sobre carvão).
- "O que o QuintoAndar fez com o aluguel": slide 06 (jornada "hoje × com o Milet"). As quatro colunas acendem uma por verbo: entender, comparar, contratar, acompanhar. Só texto, sem o logo do QuintoAndar.
- "Vai e vem de e-mails…": em cada coluna, o "hoje" é riscado e o "com o Milet" acende em âmbar logo abaixo.
- "O que fica rápido é decidir": palavra-chave **"decidir"** sobre o slide.
- Selos "no MVP" (entender, comparar) e "próxima fase" (contratar, acompanhar) visíveis: a banca vê o que já existe.

**Assets:** IMG-05 · GFX-05 (logo sting) · **Som:** `riser` → `hit` suave.

---

### 05 · Demo do produto (1:58–2:53) · L3 · slide 07 · Eduardo

> "A empresa envia a fatura. O Milet lê os dados e monta o Passaporte Energético: consumo, demanda, contrato, distribuidora. Esses dados ficam com a empresa, que pode levá-los para onde quiser, na lógica do Open Energy que a ANEEL já discute. E nem sempre o mercado livre é a melhor rota: um fornecedor nos contou que, sem o antigo desconto na tarifa de uso da rede, a economia encolheu. Por isso o diagnóstico compara rotas, não só fornecedores: mercado livre, solar própria ou compartilhada. E aí vem a parte que importa: todas as propostas na mesma régua. Custo total, prazo, risco e o que ainda falta de informação. E nenhum fornecedor paga para aparecer primeiro. Entender e comparar já funcionam hoje, com dados de demonstração. Contratar e acompanhar são a próxima fase."

**Tela:** gravação real do `/diagnostico` dentro da moldura de navegador do slide 07, rosto em PiP. Os quatro momentos e os requisitos de cada tela estão em [demo-spec.md](demo-spec.md).

| Fala | Momento | Zoom e destaque |
|---|---|---|
| "A empresa envia a fatura" | **M1** clique em *Usar fatura de demonstração* e estado de leitura | Zoom 1,6× no botão; anel âmbar no clique; manter a leitura inteira na tela |
| "…monta o Passaporte Energético… Open Energy" | **M2** conferência: consumo, demanda, distribuidora | Destaque em sequência nos três campos; rótulo flutuante **Passaporte Energético**; em "Open Energy", selo `ANEEL · OPEN ENERGY · CONSULTA PÚBLICA 7/2025` por 2 s |
| "…compara rotas…" | **M3** rotas: mercado livre, solar própria, compartilhada | Zoom na lista de rotas; cada rota acende quando é dita |
| "…todas as propostas na mesma régua…" até o fim | **M4** propostas na mesma régua | Começa no banner "Nenhuma oferta compra posição" (sublinhado âmbar); rolagem lenta pelas duas propostas de mercado livre; zoom 1,8× no custo total e no "Serviço Milet: R$ 190/mês, igual em todas as propostas"; selo `NO AR · DADOS DE DEMONSTRAÇÃO` em "dados de demonstração" |

**Assets:** SCR-01 a SCR-04 · **Som:** `click` de UI em cada clique; música baixa.
**Fonte do "desconto":** a Lei 14.120/2021 encerrou o desconto de 50% na TUSD/TUST para usinas incentivadas novas; as antigas mantêm o desconto e a MP 1.212/2024 ampliou prazos. Não dizer que o mercado livre "deixou de compensar": a economia depende do perfil e da distribuidora.

---

### 06 · Diferencial (2:53–3:13) · L2 → L3 · slide 08 · Eduardo

> "Gestoras e comercializadoras já fazem partes disso. Nosso diferencial é ficar do lado da empresa: o Milet não pertence a um grupo de energia, os dados são da empresa, e a gente continua depois da assinatura, acompanhando a economia e voltando a cotar antes do vencimento."

**Tela**
- "Gestoras e comercializadoras…": tabela do slide 08 em L3, colunas aparecendo da esquerda para a direita.
- "Nosso diferencial…": a coluna **Milet** acende; as outras ficam a 40% de opacidade.
- Cada critério dito ganha um *highlight* âmbar na linha correspondente.
- **Cuidado:** nunca dizer "somos os únicos". Clarke, UC Livre e Ynova já anunciam RFQ e gestão.

**Assets:** GFX-07 · **Som:** `whoosh` na coluna Milet.

---

### 07 · Modelo de negócio e canais (3:13–4:37) · L3 · slides 09, 10 e 11 · Eduardo

> "O modelo tem dois lados. De um, as PMEs. Do outro, quem vende energia: só de comercializadoras varejistas habilitadas na CCEE, são cento e quarenta disputando as mesmas empresas. O fornecedor recebe demanda qualificada e dados prontos para cotar, e paga uma taxa por contrato fechado, ou por megawatt-hora, igual para todos e informada ao cliente. A empresa pode assinar o acompanhamento contínuo. Somando as duas receitas, cada PME pode render cerca de três mil e setecentos reais por ano. Com as setenta e duas mil PMEs que podem migrar, o mercado total é de cerca de duzentos e sessenta e cinco milhões de reais por ano. Só as cerca de vinte mil migrações de cada ano somam uns cem milhões em taxas. E a meta em três anos é chegar a um por cento dessas empresas: cerca de setecentas PMEs e dois milhões e setecentos mil reais por ano. As duas são hipóteses em teste, e o mercado já paga por isso: uma gestora do setor paga a parceiros de cinco a dez mil reais por empresa fechada e cobra da empresa cem reais por mês pela gestão. E chegamos à PME pelo diagnóstico gratuito, com indicação de contadores e EPCs."

**Tela**
- "Dois lados": slide 09, os dois cards (PMEs do Grupo A; comercializadoras e geradores) acendem um por vez.
- "Cento e quarenta": zoom no print da CCEE do slide 09, número **140** com sublinhado âmbar.
- "O fornecedor recebe…": diagrama do slide 09, o nó Milet pulsa uma vez; seta de **dados** PME → Milet → fornecedor; seta de **receita** voltando de cada lado, em sincronia com a fala.
- "Somando as duas receitas…": o quadro TAM, SAM e SOM do slide 09 acende uma linha por frase (TAM em "mercado total", SAM em "migrações de cada ano", SOM em "meta em três anos"), com a fonte visível.
- Selo âmbar `HIPÓTESE` nas duas receitas quando a palavra é dita.
- Consistência com o BMC entregue: mesmos dois segmentos, mesmas duas receitas e os mesmos números do card "Potencial de receita".
- "O mercado já paga por isso": corte para o slide 10. Zoom no print da Clarke (R$ 5 a 10 mil por PME fechada) em "cinco a dez mil" e no print de R$ 100/mês em "cem reais por mês". O print da Electy (paga pelas usinas) fica visível ao lado.
- "E chegamos à PME…": corte para o funil do slide 11; as quatro etapas acendem da esquerda para a direita, com destaque em **02 · Engajar · Diagnóstico gratuito**.

**Assets:** GFX-08 · GFX-13 (referência de mercado) · GFX-12 (funil) · **Som:** `tick` em cada seta.

---

### 08 · Validação e visão (4:37–5:35) · L2 · slides 12 e 13 · Eduardo

> "Já começamos a ouvir o mercado. O primeiro fornecedor que respondeu quer conhecer o piloto, com uma condição: que a gente escolha bem os fornecedores, olhando atendimento e reputação. E o primeiro dono de PME que respondeu cuida da energia numa planilha, ignorou as propostas que recebeu e quer saber se as placas solares estão entregando o que prometeram. Nas próximas semanas, vamos ouvir dez empresas e cinco fornecedores. Ao mesmo tempo, cadastramos as primeiras empresas, comercializadoras e usinas. Em 2027, abrimos o marketplace, o app e as ferramentas para quem vende energia. O Passaporte Energético também vira uma API: contadores, ERPs e EPCs usam os dados que a empresa autorizar, e com o Open Energy esses dados podem vir direto da distribuidora. Tudo isso a tempo de pequenos comércios, e depois residências, poderem escolher de quem compram energia."

**Tela**
- "Já começamos a ouvir o mercado…": slide 12 (validação). O card "Feito" acende na linha das entrevistas; em "o primeiro dono de PME", print da resposta (sem identificação, `shots/evid-pme-respostas.png`) por 2 s, com sublinhado âmbar em "Sim, mas ignoramos" e na linha das placas; em "dez empresas e cinco fornecedores", acende o card "Próximas 4 semanas", com as hipóteses H1–H3 visíveis embaixo. Não chamar isso de tração.
- "Ao mesmo tempo, cadastramos…": slide 13 (visão). A linha do tempo se desenha da esquerda para a direita, um marco por trecho da fala: primeiros clientes, marketplace e app, ferramentas para quem vende, pequenos comércios, residências. Em "vira uma API", o trecho "API do Passaporte Energético" do marco de 2º sem/2027 ganha sublinhado âmbar.
- Fecha na frase âmbar "Energia de quem você escolher, com os seus dados e preço justo." e na fonte (Lei 15.269/2025).
- Quando chegarem mais respostas (e-mails às comercializadoras, PMEs), atualizar os números da fala e do slide 12.

**Assets:** GFX-14 · GFX-09 · **Som:** música começa a subir.

---

### 09 · Equipe (5:35–5:51) · L2 · slide 14 · Eduardo

> "Sou o Eduardo, de Engenharia de Computação, e cuido do produto. Meu cofundador, o Gustavo, de Ciência da Computação, cuida do código e da experiência. E temos a orientação da professora Mariana Zuliani, do Mackenzie, fundadora da OncoAI."

**Tela**
- Rosto em L2; à direita, a grade do slide 14 acende pessoa por pessoa, em sincronia com cada nome.
- *Lower third* na sua primeira aparição do bloco: `EDUARDO FERREIRA DE MATTOS · COFUNDADOR` (mono, âmbar).
- O card da orientadora diz "Professora de Análise de Dados no Mackenzie". Na menção a ela, o card ganha o selo `SHARK TANK BRASIL · TOP 10 FEMALE TECH FOUNDERS` por 2 s: credencial na tela, sem gastar fala.

**Assets:** GFX-10 (slide 14 com as três fotos).

---

### 10 · Fechamento (5:51–6:00) · L1 → L4 · slide 15 · Eduardo

> "O Milet existe para a empresa escolher a energia sem adivinhar. *(pausa)* Energia em mais liberdade."

**Tela**
- Primeira frase em L1, olhar fixo na câmera, sem gráfico.
- "Energia em mais liberdade": corte para o slide 15 (rocha âmbar, *push-in* lento de 105% → 100% em 4 s), contato embaixo.
- Segurar 2 s na tela final e cortar para preto.

**Assets:** GFX-11 · **Som:** `hit` grave no logo; música resolve e corta.

---

## 3. Apresentador único
O vídeo inteiro é você. Para não cansar com um rosto só:
- **Dois enquadramentos na mesma gravação:** grave em 4K (ou na maior resolução do celular) em plano médio e use o recorte fechado como segundo ângulo nos *punch-ins*. Cortar entre os dois parece edição com duas câmeras.
- **O rosto aparece em menos da metade do tempo:** os layouts L3 e L4 carregam a demo, os números e a tabela; o rosto entra para convicção (gancho, "a maioria ainda não atravessou", diferencial, fechamento).
- **Energia constante:** grave bloco por bloco, de pé, com pausa entre blocos; repita o primeiro bloco no fim da sessão (a primeira tentativa costuma sair fria).

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
| GFX-09 | Slide 13 | ✱ linha do tempo se desenhando |
| GFX-10 | Slide 14 | fotos reais |
| GFX-11 | Slide 15 | — |
| GFX-12 | Slide 11 (funil) | entrada já existe |
| GFX-13 | Slide 10 (referência de mercado) | prints das fontes em [../pesquisa/evidencias/](../pesquisa/evidencias/) |
| GFX-14 | Slide 12 (validação) | cards acendendo na ordem da fala |

### Gravações de tela (SCR)
- Abrir `/diagnostico?demo=1`: o modo demonstração preenche um contato fictício e liga o guia de gravação (tecla **H** esconde o guia; teclas **1–5** pulam etapas). A visita sem `?demo=1` é a do público e começa vazia.
- Gravar no site publicado, não no `next dev` (o modo dev mostra o selo "N" do Next.js no canto). Antes, confirmar que `/diagnostico` está no ar: o deploy atual publica só o site estático.
- Edge em janela 1920×1080, zoom 125%, tema claro, sem favoritos nem extensões visíveis.
- Parar antes do formulário de envio do dossiê e não rolar até o rodapé.
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
6. Palavras-chave e selos (`EXEMPLOS ILUSTRATIVOS`, `70% · MODELO SIMPLIFICADO`, `ANEEL · OPEN ENERGY`, `DADOS DE DEMONSTRAÇÃO`, `HIPÓTESE`)

Ordem de trabalho: cortar a fala primeiro (o tempo final vem dela), depois encaixar layouts, depois gráficos, por último som e cor.

---

## 6. Pronto para enviar quando

- [ ] Duração total abaixo de **3:00**, com a fala compreensível em 1,0×.
- [ ] Todo número na tela tem fonte visível (os três da CCEE já foram conferidos).
- [ ] Toda tela do produto marcada como demonstração; a demo passa em [demo-spec.md](demo-spec.md).
- [ ] As duas receitas aparecem como hipótese e batem com o BMC entregue; nenhuma frase sugere tração que não existe.
- [ ] Nenhuma marcação "A PREENCHER" visível (deck com **T** ligado ao gravar).
- [ ] Sempre "o Milet" (masculino) na fala, no deck e no BMC.
- [ ] Voz limpa, sem eco; música nunca acima da fala; todos os takes com o mesmo som e a mesma cor.
- [ ] Assistido uma vez sem som (as palavras-chave contam a história?) e uma vez só com som (a fala se sustenta sozinha?).
