/**
 * MILET — ENGINE DA APRESENTAÇÃO WEB 16:9 (13 SLIDES)
 * Alinhada estritamente aos Critérios de Avaliação do Mackenzie (10 Pontos)
 */

(function () {
  'use strict';

  // Configurações
  const TOTAL_SLIDES = 13;
  const TARGET_TIME_SECONDS = 600; // 10 minutos
  let currentSlide = 1;
  let timerSeconds = 0;
  let timerInterval = null;
  let isTimerRunning = true;
  let isNotesOpen = false;

  // Speaker Notes por slide — Mapeado para os 10 Pontos da Rubrica
  const speakerNotesData = {
    1: {
      rubric: "Tema · [0,5 pt]",
      title: "Slide 1 — Capa & Tema Formal",
      target: "25 segundos (00:00 - 00:25)",
      text: "Bom dia, professor Rodrigo Juliani e colegas de turma. Meu nome é Eduardo Ferreira de Mattos e apresento o plano de projeto da Milet: uma plataforma digital independente para decisão, comparação e gestão contínua de energia. O projeto integra a disciplina Projetos de Engenharia da Computação I e estabelece as bases formais para o desenvolvimento e validação do software que entregaremos até o próximo semestre."
    },
    2: {
      rubric: "Motivação · [0,5 pt]",
      title: "Slide 2 — Motivação do Projeto",
      target: "40 segundos (00:25 - 01:05)",
      text: "A motivação deste projeto nasce da transformação histórica do setor elétrico brasileiro: a Lei 14.300 sobre Geração Distribuída e o Decreto 13.097 de 2026, que programa a abertura da baixa tensão para os próximos anos. Hoje, empresas de menor porte enfrentam uma assimetria brutal de dados e tarifas, pagando caro simplesmente por não dominarem o setor. O consumidor tem liberdade de escolha no papel, mas não dispõe de ferramentas computacionais neutras para exercê-la com segurança."
    },
    3: {
      rubric: "Problema Tratado · [1,0 pt]",
      title: "Slide 3 — Problema Tratado & Causa-Raiz",
      target: "50 segundos (01:05 - 01:55)",
      text: "O problema tratado não é a falta de oferta energética, mas a impossibilidade de o decisor comparar alternativas sob premissas equivalentes. A jornada atual é caótica: faturas densas com tarifas TUSD e TE, regras regulatórias opacas, opções de GD e mercado livre desconexas, contratos longos com cláusulas de fidelidade complexas e pós-venda disperso em planilhas. Na análise de causa-raiz pelos 5 Porquês, concluímos: não faltam usinas; falta uma camada independente de software que traduza dados elétricos em decisões transparentes e auditáveis."
    },
    4: {
      rubric: "Estado da Arte 1/3 · [3,0 pts]",
      title: "Slide 4 — Evolução Regulatória Brasileira",
      target: "55 segundos (01:55 - 02:50)",
      text: "Entrando no Estado da Arte, que é o núcleo de maior peso da nossa avaliação, analisamos primeiro a evolução no Brasil. Passamos do modelo cativo monopolista para a Lei 14.300 em 2022, a abertura do Grupo A em 2024 e o Decreto 13.097/2026, que fixa a abertura para baixa tensão comercial em 2027 e residencial em 2028. É essencial destacar: a distribuidora física não é um intermediário a eliminar, mas sim a infraestrutura física de rede; e a CCEE opera a liquidação setorial e disponibilizará uma plataforma pública de preços, que servirá de insumo para nossa solução."
    },
    5: {
      rubric: "Estado da Arte 2/3 · [3,0 pts]",
      title: "Slide 5 — Benchmarks Internacionais",
      target: "55 segundos (02:50 - 03:45)",
      text: "Mapeamos como os mercados mais maduros do mundo resolveram a inteligência energética. Nos Estados Unidos, a Arcadia desenvolveu APIs para ingestão de faturas de concessionárias conectando consumidores a usinas solares comunitárias. No Texas, a Energy Ogre provou o modelo de concierge independente: o usuário paga uma mensalidade fixa para um algoritmo otimizar e trocar contratos periodicamente. No Reino Unido, plataformas como Piclo e Electron operam leilões de flexibilidade para redes. E iniciativas como Powerledger e Energy Web aplicam registros auditáveis de garantias renováveis."
    },
    6: {
      rubric: "Estado da Arte 3/3 · [3,0 pts]",
      title: "Slide 6 — Matriz de Diferenciação & Hipótese",
      target: "60 segundos (03:45 - 04:45)",
      text: "Ao consolidar o Estado da Arte em nossa matriz comparativa de 6 dimensões, fica evidente o diferencial estrutural da Milet: não afirmamos que 'não existem soluções', mas sim que elas atuam de forma fragmentada. Enquanto a Arcadia foca apenas em dados e a Energy Ogre em varejo, a Milet fecha o ciclo integrando diagnóstico explicável, comparação multimodal entre rotas (GD, ACL e usina própria), workflow assistido e auditoria contínua de economia. A plataforma pública da CCEE será um trilho de transparência, mas o valor computacional está na decisão personalizada e na governança contínua."
    },
    7: {
      rubric: "Plano de Projeto 1/3 · [2,0 pts]",
      title: "Slide 7 — Perfis de Usuários & Ecossistema",
      target: "50 segundos (04:45 - 05:35)",
      text: "No Plano de Projeto, iniciamos pelos Perfis de Usuários. Para assegurar foco de engenharia, definimos uma prioridade cirúrgica para o MVP: o UP-01, Consumidor PME e Decisor Energético — comércio, escritórios e pequenas indústrias que querem economia sem risco de engenharia. Ao redor, conectamos os atores de oferta necessários para fechar a esteira: o Gerador Independente (UP-03) que precisa ocupar capacidade, a Comercializadora Varejista (UP-04), o integrador EPC (UP-05) e o Operador Milet (UP-06). Consumidor residencial e investidores ficam para expansões pós-MVP."
    },
    8: {
      rubric: "Plano de Projeto 2/3 · [2,0 pts]",
      title: "Slide 8 — Arquitetura da Solução & User Stories",
      target: "65 segundos (05:35 - 06:40)",
      text: "A arquitetura do produto fecha o ciclo em 5 etapas: Entender, Decidir, Competir, Executar e Aprender. O backlog possui 28 histórias de usuário, mas destacamos as 7 histórias nucleares que formam a espinha dorsal do MVP. Três delas são os pilares indispensáveis: a US-002 para ingestão de fatura; a US-013, núcleo de inteligência que normaliza propostas de comercializadoras sob a mesma régua matemática de VPL e risco; e a US-021, que fecha o loop auditando a economia realizada versus a prometida. As histórias 006, 010, 019 e 027 completam rotas, RFQ, migração e auditoria imutável."
    },
    9: {
      rubric: "Plano de Projeto 3/3 · [2,0 pts]",
      title: "Slide 9 — Canvas v0.1 & Recorte do MVP",
      target: "50 segundos (06:40 - 07:30)",
      text: "O Business Model Canvas do projeto é tratado formalmente como hipótese v0.1 a ser testada, e não como modelo validado comercialmente. Destacamos quatro blocos essenciais: o segmento PME, a proposta de 4 pilares, as receitas em validação e as parcerias estruturais. Em consonância com a disciplina, realizamos o recorte estrito de 14 histórias P0 para o MVP acadêmico, postergando módulos complexos como telemetria IoT em tempo real, modelos de IA estocástica ou automação sem supervisão para as fases P1 e P2."
    },
    10: {
      rubric: "Cronograma 1/2 · [2,0 pts]",
      title: "Slide 10 — Cronograma Físico Geral (Gantt)",
      target: "50 segundos (07:30 - 08:20)",
      text: "O cronograma físico foi estruturado ao longo de 11 meses, de Agosto de 2026 a Junho de 2027, com separador claro entre semestres. Em Projetos I (2026.2), cumprimos o Discovery e Estado da Arte em agosto e setembro, o detalhamento de histórias e recorte do MVP em outubro, e o planejamento arquitetural e prototipação em novembro e dezembro. Em Projetos II (2027.1), construímos o core engine entre fevereiro e março, integramos RFQ e segurança em abril, realizamos o piloto de validação em maio e entregamos o MVP v1 e monografia em junho."
    },
    11: {
      rubric: "Cronograma 2/2 · [2,0 pts]",
      title: "Slide 11 — Técnicas de Gestão & Riscos",
      target: "40 segundos (08:20 - 09:00)",
      text: "Na engenharia do processo, adotamos abordagem híbrida: Scrum para entregas periódicas e Kanban para fluxo contínuo. Nossos diferenciais metodológicos incluem critérios de aceite em BDD (Dado que, Quando, Então) para testabilidade direta de requisitos e a aplicação da técnica SPIDER para fatiar histórias complexas como OCR de fatura e normalização de propostas. Além disso, mapeamos os riscos de variação de layout de distribuidoras e mudanças regulatórias, adotando parser modular e regras versionadas como mitigação."
    },
    12: {
      rubric: "Resultados Esperados · [1,0 pt]",
      title: "Slide 12 — Resultados Esperados & Critérios",
      target: "45 segundos (09:00 - 09:45)",
      text: "Para encerrar os requisitos da banca, definimos os critérios objetivos que determinarão o sucesso de Projetos II: conseguir ingerir faturas reais extraindo dados tarifários; motor de decisão determinístico com premissas transparentes; comparador normalizando pelo menos 3 ofertas concorrentes; esteira de contratação assistida navegável; e módulo de auditoria com conciliação mensal da economia realizada em ambiente de piloto real."
    },
    13: {
      rubric: "Encerramento",
      title: "Slide 13 — Encerramento & Arguição",
      target: "15 segundos (09:45 - 10:00)",
      text: "Milet: energia em mais liberdade. Agradeço a atenção do professor Rodrigo Juliani e estou totalmente à disposição dos avaliadores para a arguição e comentários da banca."
    }
  };

  // Elementos do DOM
  const deckContainer = document.getElementById('deck-container');
  const slides = document.querySelectorAll('.slide');
  const slideCounter = document.getElementById('slide-counter');
  const progressBar = document.getElementById('progress-bar-fill');
  const btnPrev = document.getElementById('btn-prev');
  const btnNext = document.getElementById('btn-next');
  const btnNotes = document.getElementById('btn-notes');
  const btnFullscreen = document.getElementById('btn-fullscreen');
  const btnPrint = document.getElementById('btn-print');
  const timerDisplay = document.getElementById('timer-display');
  const notesDrawer = document.getElementById('speaker-notes-drawer');
  const notesTitle = document.getElementById('notes-title');
  const notesTarget = document.getElementById('notes-target');
  const notesText = document.getElementById('notes-text');
  const notesRubric = document.getElementById('notes-rubric');
  const btnCloseNotes = document.getElementById('btn-close-notes');

  // Ajuste de escala 16:9 automático
  function resizeDeck() {
    if (!deckContainer) return;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const baseWidth = 1920;
    const baseHeight = 1080;

    const scaleX = windowWidth / baseWidth;
    const scaleY = windowHeight / baseHeight;
    const scale = Math.min(scaleX, scaleY);

    deckContainer.style.transform = `scale(${scale})`;
  }

  // Atualização de Slide
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

    // Atualiza HUD
    if (slideCounter) {
      const paddedCurrent = String(currentSlide).padStart(2, '0');
      const paddedTotal = String(TOTAL_SLIDES).padStart(2, '0');
      slideCounter.textContent = `${paddedCurrent} / ${paddedTotal}`;
    }

    if (progressBar) {
      const progressPercent = (currentSlide / TOTAL_SLIDES) * 100;
      progressBar.style.width = `${progressPercent}%`;
    }

    // Atualiza notas de orador
    updateSpeakerNotes(currentSlide);
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

  // Atualiza conteúdo das Speaker Notes
  function updateSpeakerNotes(slideNum) {
    const data = speakerNotesData[slideNum];
    if (data) {
      if (notesTitle) notesTitle.textContent = data.title;
      if (notesTarget) notesTarget.textContent = `Tempo alvo: ${data.target}`;
      if (notesText) notesText.textContent = data.text;
      if (notesRubric) notesRubric.textContent = `Rubrica: ${data.rubric}`;
    }
  }

  // Speaker Notes Toggle
  function toggleNotes() {
    isNotesOpen = !isNotesOpen;
    if (notesDrawer) {
      notesDrawer.classList.toggle('open', isNotesOpen);
    }
    if (btnNotes) {
      btnNotes.classList.toggle('active', isNotesOpen);
    }
  }

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.warn(`Erro ao ativar tela cheia: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }

  // Timer de Apresentação (10 min)
  function startTimer() {
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      if (!isTimerRunning) return;
      timerSeconds++;
      updateTimerUI();
    }, 1000);
    updateTimerBadgeState();
  }

  function toggleTimer() {
    isTimerRunning = !isTimerRunning;
    updateTimerBadgeState();
  }

  function resetTimer() {
    timerSeconds = 0;
    updateTimerUI();
  }

  function updateTimerBadgeState() {
    const timerBadge = document.querySelector('.hud-timer-badge');
    if (!timerBadge) return;
    if (isTimerRunning) {
      timerBadge.classList.remove('paused');
      timerBadge.setAttribute('title', 'Timer em andamento (Clique ou [T] para pausar | [R] para reiniciar)');
    } else {
      timerBadge.classList.add('paused');
      timerBadge.setAttribute('title', 'Timer pausado (Clique ou [T] para retomar | [R] para reiniciar)');
    }
  }

  function updateTimerUI() {
    if (!timerDisplay) return;
    const mins = Math.floor(timerSeconds / 60);
    const secs = timerSeconds % 60;
    const formatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    timerDisplay.textContent = formatted;

    // Alerta visual após 9min30s
    if (timerSeconds >= 570) {
      timerDisplay.style.color = '#E57373';
    } else if (timerSeconds >= 480) {
      timerDisplay.style.color = '#FFB74D';
    } else {
      timerDisplay.style.color = 'var(--color-sand)';
    }
  }

  // Navegação por Teclado
  function handleKeydown(e) {
    switch (e.key) {
      case 'ArrowRight':
      case 'PageDown':
      case ' ': // Barra de espaço
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
        toggleTimer();
        break;
      case 'r':
      case 'R':
        resetTimer();
        break;
    }
  }

  // Event Listeners
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

  const timerBadgeEl = document.querySelector('.hud-timer-badge');
  if (timerBadgeEl) {
    timerBadgeEl.addEventListener('click', toggleTimer);
    timerBadgeEl.addEventListener('dblclick', (e) => {
      e.stopPropagation();
      resetTimer();
    });
  }

  // Inicialização
  resizeDeck();
  if (notesDrawer && notesDrawer.classList.contains('open')) {
    isNotesOpen = true;
    if (btnNotes) btnNotes.classList.add('active');
  }
  showSlide(1);
  startTimer();
})();
