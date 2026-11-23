/**
 * MILET — ENGINE DE APRESENTAÇÃO N2 COM TELEPROMPTER & SPEAKER NOTES
 * Disciplina: PROJETOS EMPREENDEDORES — AVALIAÇÃO N2 (Mackenzie 2026.2)
 * Docente: Profa. Julia Gebara
 * Equipe: Eduardo Ferreira de Mattos, Enzo Engrich Larese, Heloísa Carvalho Confessor, Leonardo Dourado, Maria Luíza Sampaio Nogueira, Mell Castro Pereira Junqueira Ferreira
 */

(function () {
  'use strict';

  const TOTAL_SLIDES = 17;
  const CORE_SLIDES = 14;
  const TARGET_TIME_SECONDS = 600; // 10 minutos para arguição
  let currentSlide = 1;
  let timerSeconds = 0;
  let timerInterval = null;
  let isTimerRunning = true;

  // DICIONÁRIO DE FALAS E DEIXAS DO APRESENTADOR (EDUARDO)
  const SPEAKER_NOTES = {
    1: {
      title: "Slide 1 — Capa Oficial (Mackenzie · N2)",
      rubric: "Critério 1: Capa & Apresentação Formal",
      targetTime: "Tempo alvo: 35s",
      bullets: [
        "Apresentação formal da equipe em ordem alfabética com TIAs",
        "Docente responsável: Profa. Julia Gebara",
        "Tese central da Milet: 'Contratar energia sem adivinhar'"
      ],
      speech: "Boa noite, professora Julia e colegas. Somos a Milet — plataforma de inteligência energética independente para pequenas e médias empresas. Nosso grupo multidisciplinar reúne Eduardo e Leonardo em Engenharia de Computação, Enzo em Engenharia Elétrica, Heloísa em Administração, Maria Luíza em Arquitetura e Mell em Direito. Hoje vamos demonstrar como estamos desmistificando a conta de luz e abrindo o mercado livre de energia com transparência radical e sem conflito de interesses."
    },
    2: {
      title: "Slide 2 — O Gancho: Três Propostas Incomparáveis",
      rubric: "Critério 2: Dor do Cliente & Problema",
      targetTime: "Tempo alvo: 40s",
      bullets: [
        "A conta de luz é a 3ª maior despesa de uma PME",
        "Paradoxo de propostas em bases incompatíveis (R$/MWh vs % desc vs GD)",
        "O medo de assinar contratos com letras miúdas e multas de R$ 40 mil"
      ],
      speech: "Imagine um empresário que paga R$ 15 mil de luz por mês. Ele recebe três propostas: uma fixa em R$ 289 por megawatt-hora; outra prometendo 25% de desconto na tarifa; e uma terceira de usina solar compartilhada. Nenhuma é comparável na mesma base! Ninguém explica se os encargos da CCEE ou a tarifa de fio da distribuidora estão incluídos. A pergunta que tira o sono do empresário é: qual é a mais barata de verdade?"
    },
    3: {
      title: "Slide 3 — Persona Real: Carlos Mendes (CFO PME)",
      rubric: "Critério 4: Perfil do Cliente Ideal (Persona)",
      targetTime: "Tempo alvo: 40s",
      bullets: [
        "Carlos Mendes, 46 anos, Diretor Financeiro de PME do Grupo A (SP)",
        "Rotina real: sufocado entre contas a pagar, tributos, compras e folha",
        "Precisa de recomendação limpa para defender de cabeça erguida perante os sócios"
      ],
      speech: "Esse dilema é a rotina do Carlos Mendes, 46 anos, diretor financeiro de uma empresa do Grupo A em São Paulo com 45 funcionários. Ele paga R$ 14.500 de energia todo mês. Ele não tem equipe de engenharia e nem tempo para auditar memórias de cálculo de distribuidora. Ele precisa de uma recomendação limpa, em preto no branco, que ele possa defender perante os seus sócios sem medo de colocar a empresa em risco."
    },
    4: {
      title: "Slide 4 — Tamanho do Mercado: TAM, SAM e SOM",
      rubric: "Critérios 2 e 3: Dimensionamento de Mercado",
      targetTime: "Tempo alvo: 40s",
      bullets: [
        "TAM: R$ 266,4 milhões (72.000 PMEs do Grupo A aptas a migrar)",
        "SAM: R$ 39,76 milhões (10.746 migrações/ano em comércio e serviços)",
        "SOM: R$ 296 mil/ano (80 contratos no Ano 3 na Grande SP)"
      ],
      speech: "O mercado é gigantesco. Com a abertura do Grupo A pela Portaria 50, a CCEE estima 72 mil PMEs aptas a migrar — um mercado total de 266 milhões de reais ao ano. Só em 2025 foram quase 22 mil migrações no Brasil, metade delas em comércio e serviços, nosso SAM de quase 40 milhões. Nossa meta de SOM no ano 3 é modesta e conservadora: 80 contratos anuais na Grande SP, capturando cerca de 300 mil reais em receita."
    },
    5: {
      title: "Slide 5 — Benchmarking & Aprendizados Críticos (N2)",
      rubric: "Critério 2: Benchmarking Competitivo",
      targetTime: "Tempo alvo: 45s",
      bullets: [
        "Clarke Energia: validou cobrar assinatura mensal fixa de acompanhamento",
        "Electy: evidenciou o alto CAC das comercializadoras na busca por demanda",
        "Energy Ogre (EUA): comprovou o modelo independente de membro pagante",
        "Diferencial Milet: Passaporte Neutro + Comparação All-In sem ranking pago"
      ],
      speech: "Analisamos a fundo os grandes benchmarks do setor: a Clarke Energia validou que o cliente paga mensalidade por acompanhamento; a Electy mostrou que fornecedores sofrem com custos comerciais brutais e pagam por demanda qualificada; e a Energy Ogre nos EUA provou que um serviço 100% neutro pode ser sustentado por assinaturas. O diferencial do Milet é reunir isso: Passaporte Neutro, comparação All-In e a regra sagrada: nenhum fornecedor paga para aparecer primeiro."
    },
    6: {
      title: "Slide 6 — Concorrência: A Matriz Comparativa do Supernova",
      rubric: "Critério 2: Análise Competitiva & Diferencial",
      targetTime: "Tempo alvo: 40s",
      bullets: [
        "Matriz comparativa: UC Livre, Clarke, Electy, Comercializadoras e Milet",
        "Conflito de interesse: Clarke tem 70% da Energisa",
        "Diferencial Milet: 100% neutro, auditoria contínua e Passaporte Energético"
      ],
      speech: "Na matriz competitiva, a diferenciação fica evidente: a Clarke tem 70% de controle pela Energisa, gerando conflito societário. A Electy só opera GD. O Milet é a única plataforma independente que compara todas as rotas — mercado livre, GD e solar —, não tem vínculo com nenhuma geradora, audita a economia após o contrato e entrega o Passaporte Energético com dados portáveis da empresa."
    },
    7: {
      title: "Slide 7 — Referências de Mercado & Monetização",
      rubric: "Critérios 5 e 6: Validação da Disposição a Pagar",
      targetTime: "Tempo alvo: 35s",
      bullets: [
        "Comercializadoras pagam R$ 5 a 10 mil por cliente (Clarke 2025)",
        "Fornecedor remunera a originação; cliente tem diagnóstico gratuito (Electy)",
        "PMEs pagam R$ 100/mês por gestão contínua de auditoria"
      ],
      speech: "Não inventamos a roda na monetização: o mercado já paga por isso dos dois lados. Comercializadoras pagam oficialmente de 5 a 10 mil reais de taxa de originação por cliente fechado, como comprova o programa comercial público da Clarke. E as PMEs já pagam 100 reais por mês por auditoria de faturas. O Milet apenas conecta essas duas pontas com neutralidade matemática."
    },
    8: {
      title: "Slide 8 — O MVP Funcional: Já Funciona",
      rubric: "Critério 7: Solução & Protótipo Tangível",
      targetTime: "Tempo alvo: 45s",
      bullets: [
        "01 Triagem do perfil tarifário e distribuidora",
        "02 Envio da fatura com leitura automática por IA",
        "03 Conferência dos dados e checksum pelo cliente",
        "04 Diagnóstico instantâneo das rotas viáveis",
        "05 Propostas normalizadas lado a lado All-In",
        "Captura real da tela e protótipo ativo em produção"
      ],
      speech: "Aqui demonstramos o nosso protótipo em produção: ele já funciona da fatura à comparação. O cliente faz a triagem da distribuidora, envia a fatura em PDF, confere os dados extraídos automaticamente pelo nosso motor de IA e recebe o diagnóstico com todas as propostas normalizadas lado a lado no custo total All-In. Não é uma promessa no Figma: o sistema está ativo, no ar, acessível no link milet.vercel.app/diagnostico."
    },
    9: {
      title: "Slide 9 — Go-To-Market & Funil B2B Consultivo",
      rubric: "Critério 5: Canais & Go-to-Market",
      targetTime: "Tempo alvo: 40s",
      bullets: [
        "Etapa 1: Atração via SDR outbound de PMEs e parcerias com contadores",
        "Etapa 2: Conversão via Dossiê de Diagnóstico All-In para a diretoria",
        "Etapa 3: Retenção mensal SaaS com conferência de faturas e economia"
      ],
      speech: "Como vendemos? A venda para PME é consultiva. O diagnóstico gratuito é o nosso cavalo de troia: o gestor financeiro usa o nosso dossiê para justificar a escolha para o sócio. Alimentamos o topo de funil com 1 SDR ativo e indicações de escritórios de contabilidade e integradores solares. Fechado o contrato, retemos a empresa no modelo de assinatura mensal."
    },
    10: {
      title: "Slide 10 — Business Model Canvas Bilateral (Supernova)",
      rubric: "Critério 5: Modelo de Negócios (BMC)",
      targetTime: "Tempo alvo: 40s",
      bullets: [
        "Artefato oficial submetido e homologado no Sebrae Supernova 2026",
        "Dois lados ganham e pagam: PMEs e Comercializadoras",
        "Suporte a zoom interativo em tela cheia na apresentação"
      ],
      speech: "Na tela, apresentamos o Business Model Canvas oficial submetido no Sebrae Supernova 2026. Ele estrutura com clareza o modelo bilateral: para o consumidor PME, entregamos contratação sem adivinhar e auditoria mensal; para os fornecedores de energia, entregamos demanda qualificada pronta para cotar, reduzindo o custo de aquisição comercial."
    },
    11: {
      title: "Slide 11 — Análise Financeira 1: Receitas vs Custos Enxutos",
      rubric: "Critério 6: Estrutura de Custos & Fontes de Receita",
      targetTime: "Tempo alvo: 45s",
      bullets: [
        "Entradas (Verde): R$ 5.000 taxa de originação + R$ 100/mês SaaS PME",
        "Saídas (Cobre): Custos fixos de R$ 5.000/mês (SDR + Google Ads + Jurídico + Serverless)",
        "Investimento inicial de R$ 25.000 para abertura, INPI e capital de giro"
      ],
      speech: "Na modelagem financeira, separamos com clareza as entradas e saídas. Do lado verde das receitas: R$ 5.000 de taxa média de originação paga pelo fornecedor e R$ 100/mês de assinatura da PME. Do lado das saídas: operamos enxutos com R$ 5.000/mês de custos fixos, sendo R$ 2.500 de SDR comercial, R$ 1.000 de Google Ads B2B, R$ 800 de suporte jurídico regulatório pontual e apenas R$ 200 de nuvem serverless Railway e Vercel, com R$ 25 mil de aporte inicial."
    },
    12: {
      title: "Slide 12 — Análise Financeira 2: DRE de 3 Anos & Payback",
      rubric: "Critério 6: DRE & Viabilidade Econômica",
      targetTime: "Tempo alvo: 45s",
      bullets: [
        "Ano 1: Receita R$ 107.200, Custos R$ 86.000 -> Lucro de +R$ 21.200",
        "Payback integral conquistado logo no início do Ano 2 (+R$ 106.400)",
        "Ano 3 em escala: Lucro anual de R$ 244.900 com caixa de R$ 351.300"
      ],
      speech: "A DRE comprova a sustentabilidade do modelo. No Ano 1, com apenas 20 contratos fechados, faturamos R$ 107.200 e geramos lucro operacional de +R$ 21.200. O saldo acumulado de caixa atinge o payback integral logo no início do Ano 2, saltando para mais de R$ 106 mil positivos e alcançando mais de R$ 350 mil de caixa acumulado no Ano 3."
    },
    13: {
      title: "Slide 13 — Validação de Campo: Resultados do Piloto Real",
      rubric: "Critério 7: Validação de Campo & Hipóteses",
      targetTime: "Tempo alvo: 40s",
      bullets: [
        "Hipótese 1 (Decisores): Confirmada a dor da complexidade e medo de multas",
        "Hipótese 2 (Comercializadoras): Confirmado o CAC elevado na venda direta",
        "Hipótese 3 (Monetização): Confirmada disposição a pagar R$ 100/mês por auditoria"
      ],
      speech: "Nossa tese não ficou no papel. Validamos 3 hipóteses fundamentais em campo: 100% dos gestores financeiros entrevistados relataram insegurança com propostas opacas; as comercializadoras confirmaram que sofrem com alto custo de aquisição na prospecção fria de PMEs; e os decisores confirmaram que pagam com tranquilidade R$ 100 por mês pela tranquilidade de uma auditoria contínua."
    },
    14: {
      title: "Slide 14 — Encerramento: Energia em Mais Liberdade",
      rubric: "Critérios 1 e 8: Fechamento & Assinatura de Marca",
      targetTime: "Tempo alvo: 30s",
      bullets: [
        "Tese de marca: Energia em mais liberdade",
        "Contatos institucionais: milet@evergreenmkt.com.br · milet.vercel.app",
        "Agradecimentos à Profa. Julia Gebara e banca examinadora do Mackenzie"
      ],
      speech: "A nossa missão é simples: fazer com que qualquer PME contrate energia com transparência radical e sem adivinhar. Agradecemos à professora Julia Gebara e à banca avaliadora da Universidade Presbiteriana Mackenzie. Estamos prontos e abertos para a sessão de perguntas."
    },
    15: {
      title: "Slide 15 — Apêndice A: Matriz de Problemas (N1 Backup)",
      rubric: "Apêndice de Suporte: Acervo N1",
      targetTime: "Tempo alvo: Sob demanda",
      bullets: ["Assimetria regulatória", "Falta de padronização", "Abandono pós-assinatura"],
      speech: "Este slide de apoio detalha a Matriz de Problemas da N1, caso a banca deseje aprofundar na assimetria regulatória e no abandono pós-assinatura das consultorias tradicionais."
    },
    16: {
      title: "Slide 16 — Apêndice B: Mapa da Empatia (Consumidor PME)",
      rubric: "Apêndice de Suporte: Acervo N1",
      targetTime: "Tempo alvo: Sob demanda",
      bullets: ["Artefato visual oficial da N1", "Percepções, dores e ganhos do Decisor PME", "Clique na imagem para Zoom"],
      speech: "Este artefato oficial da N1 apresenta o Mapa da Empatia do Perfil 1: o Consumidor PME / Decisor Energético."
    },
    17: {
      title: "Slide 17 — Apêndice C: Mapa da Empatia (Comercializadora)",
      rubric: "Apêndice de Suporte: Acervo N1",
      targetTime: "Tempo alvo: Sob demanda",
      bullets: ["Artefato visual oficial da N1", "Dores de CAC e qualificação das comercializadoras", "Clique na imagem para Zoom"],
      speech: "Este artefato oficial da N1 apresenta o Mapa da Empatia do Perfil 2: as Comercializadoras e Fornecedores de energia do lado da oferta."
    }
  };

  // ELEMENTOS DOM
  const slides = document.querySelectorAll('.slide');
  const deckContainer = document.getElementById('deck-container');
  const slideCounter = document.getElementById('slide-counter');
  const progressBar = document.getElementById('progress-bar-fill');
  const btnPrev = document.getElementById('btn-prev');
  const btnNext = document.getElementById('btn-next');
  const btnNotes = document.getElementById('btn-notes');
  const btnCloseNotes = document.getElementById('btn-close-notes');
  const btnFullscreen = document.getElementById('btn-fullscreen');
  const btnPrint = document.getElementById('btn-print');
  const timerDisplay = document.getElementById('timer-display');
  const timerBadge = document.querySelector('.hud-timer-badge');

  // PAINEL DE NOTAS
  const notesDrawer = document.getElementById('speaker-notes-drawer');
  const notesTitle = document.getElementById('notes-title');
  const notesRubric = document.getElementById('notes-rubric');
  const notesTarget = document.getElementById('notes-target');
  const notesBullets = document.getElementById('notes-bullets');
  const notesSpeech = document.getElementById('notes-text');

  function resizeDeck() {
    if (!deckContainer) return;
    deckContainer.style.width = '100%';
    deckContainer.style.height = '100%';
    deckContainer.style.transform = 'none';
  }

  function updateNotes(index) {
    const data = SPEAKER_NOTES[index] || {
      title: `Slide ${index}`,
      rubric: "Material de Apresentação N2",
      targetTime: "Tempo livre",
      bullets: ["Apresentação do projeto Milet"],
      speech: "Apresentação dos dados do slide..."
    };

    if (notesTitle) notesTitle.textContent = data.title;
    if (notesRubric) notesRubric.textContent = data.rubric;
    if (notesTarget) notesTarget.textContent = data.targetTime;

    if (notesBullets) {
      notesBullets.innerHTML = data.bullets.map(b => `• ${b}`).join('<br>');
    }

    if (notesSpeech) {
      notesSpeech.textContent = data.speech;
    }
  }

  function showSlide(index) {
    if (index < 1) index = 1;
    if (index > TOTAL_SLIDES) index = TOTAL_SLIDES;

    currentSlide = index;

    slides.forEach((slide, idx) => {
      const slideIndex = idx + 1;
      slide.classList.remove('active', 'prev');
      if (slideIndex === currentSlide) {
        slide.classList.add('active');
      } else if (slideIndex < currentSlide) {
        slide.classList.add('prev');
      }
    });

    if (slideCounter) {
      const paddedCurrent = String(currentSlide).padStart(2, '0');
      if (currentSlide <= CORE_SLIDES) {
        slideCounter.textContent = `${paddedCurrent} / ${String(CORE_SLIDES).padStart(2, '0')}`;
      } else {
        slideCounter.textContent = `Apêndice (${paddedCurrent})`;
      }
    }

    if (progressBar) {
      const progressPercent = (currentSlide / TOTAL_SLIDES) * 100;
      progressBar.style.width = `${progressPercent}%`;
    }

    updateNotes(currentSlide);

    try {
      sessionStorage.setItem('milet_empreendedores_n2_slide', currentSlide);
    } catch (e) {}
  }

  function nextSlide() {
    if (currentSlide < TOTAL_SLIDES) {
      showSlide(currentSlide + 1);
    }
  }

  function prevSlide() {
    if (currentSlide > 1) {
      showSlide(currentSlide - 1);
    }
  }

  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  function updateTimerDisplay() {
    if (!timerDisplay) return;
    timerDisplay.textContent = formatTime(timerSeconds);

    if (timerBadge) {
      if (timerSeconds >= TARGET_TIME_SECONDS) {
        timerBadge.classList.add('time-over');
        timerBadge.classList.remove('time-warning');
      } else if (timerSeconds >= TARGET_TIME_SECONDS - 60) {
        timerBadge.classList.add('time-warning');
        timerBadge.classList.remove('time-over');
      } else {
        timerBadge.classList.remove('time-warning', 'time-over');
      }
    }
  }

  function startTimer() {
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      if (isTimerRunning) {
        timerSeconds++;
        updateTimerDisplay();
      }
    }, 1000);
  }

  function toggleTimer() {
    isTimerRunning = !isTimerRunning;
    const timerDot = document.querySelector('.timer-dot');
    if (timerDot) {
      timerDot.style.opacity = isTimerRunning ? '1' : '0.4';
    }
  }

  function resetTimer() {
    timerSeconds = 0;
    updateTimerDisplay();
  }

  function toggleNotes() {
    if (!notesDrawer) return;
    const isOpen = notesDrawer.classList.toggle('open');
    if (btnNotes) {
      btnNotes.classList.toggle('active', isOpen);
    }
  }

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.warn('Erro ao entrar em fullscreen:', err);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }

  function handleKeydown(e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    switch (e.key) {
      case 'ArrowRight':
      case 'PageDown':
      case ' ':
        e.preventDefault();
        nextSlide();
        break;
      case 'ArrowLeft':
      case 'PageUp':
        e.preventDefault();
        prevSlide();
        break;
      case 'Home':
        e.preventDefault();
        showSlide(1);
        break;
      case 'End':
        e.preventDefault();
        showSlide(TOTAL_SLIDES);
        break;
      case 'n':
      case 'N':
        e.preventDefault();
        toggleNotes();
        break;
      case 'f':
      case 'F':
        e.preventDefault();
        toggleFullscreen();
        break;
      case 't':
      case 'T':
        e.preventDefault();
        toggleTimer();
        break;
      case 'r':
      case 'R':
        e.preventDefault();
        resetTimer();
        break;
      case 'Escape':
        if (lightboxModal && lightboxModal.classList.contains('active')) {
          lightboxModal.classList.remove('active');
          e.preventDefault();
        }
        break;
    }
  }

  // LIGHTBOX MODAL PARA CANVAS / IMAGENS COM ZOOM
  const lightboxModal = document.getElementById('image-lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-image');
  const lightboxClose = document.getElementById('image-lightbox-close');

  document.querySelectorAll('.canvas-image-stage').forEach(stage => {
    stage.addEventListener('click', (e) => {
      e.stopPropagation();
      const img = stage.querySelector('img');
      if (lightboxModal && lightboxImg && img) {
        lightboxImg.src = img.src;
        lightboxModal.classList.add('active');
      }
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener('click', () => {
      if (lightboxModal) lightboxModal.classList.remove('active');
    });
  }

  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) {
        lightboxModal.classList.remove('active');
      }
    });
  }

  window.addEventListener('resize', resizeDeck);
  window.addEventListener('keydown', handleKeydown);

  if (btnNext) btnNext.addEventListener('click', nextSlide);
  if (btnPrev) btnPrev.addEventListener('click', prevSlide);
  if (btnNotes) btnNotes.addEventListener('click', toggleNotes);
  if (btnCloseNotes) btnCloseNotes.addEventListener('click', toggleNotes);
  if (btnFullscreen) btnFullscreen.addEventListener('click', toggleFullscreen);
  if (btnPrint) {
    btnPrint.addEventListener('click', () => {
      window.print();
    });
  }

  if (timerBadge) {
    timerBadge.addEventListener('click', toggleTimer);
    timerBadge.addEventListener('dblclick', (e) => {
      e.stopPropagation();
      resetTimer();
    });
  }

  let savedSlide = 1;
  try {
    const stored = sessionStorage.getItem('milet_empreendedores_n2_slide');
    if (stored) savedSlide = parseInt(stored, 10) || 1;
  } catch (e) {}

  resizeDeck();
  showSlide(savedSlide);
  startTimer();
})();
