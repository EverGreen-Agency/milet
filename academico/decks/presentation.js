/**
 * MILET — ENGINE DA APRESENTAÇÃO WEB 16:9 (15 SLIDES)
 * Alinhada estritamente aos Critérios de Avaliação do Mackenzie (10 Pontos)
 */

(function () {
  'use strict';

  // Configurações
  const TOTAL_SLIDES = 15;
  const TARGET_TIME_SECONDS = 600; // 10 minutos
  let currentSlide = 1;
  let timerSeconds = 0;
  let timerInterval = null;
  let isTimerRunning = true;
  let isNotesOpen = false;

  // Speaker Notes por slide — Mapeado para a Estrutura da Apresentação
  const speakerNotesData = {
    1: {
      rubric: "Tema",
      title: "Slide 1 — Tema & Tese Central",
      target: "20 segundos (00:00 - 00:20)",
      text: "Bom dia, professor Rodrigo Juliani e banca avaliadora. Apresento o projeto da Milet: plataforma digital para decisão, comparação e gestão contínua de energia. A Milet investiga como transformar uma decisão energética hoje fragmentada em uma jornada digital contínua, rastreável e comparável, alinhada aos requisitos formais da disciplina Projetos de Engenharia da Computação I."
    },
    2: {
      rubric: "Motivação",
      title: "Slide 2 — Motivação do Projeto",
      target: "40 a 45 segundos (00:20 - 01:05)",
      text: "A motivação parte da premissa de que energia também pode ser uma decisão de contratação. O modelo tradicional percebido pelo consumidor é passivo: distribuidora, conta e pagamento compulsório. Porém, consumidores elegíveis podem escolher fornecedores no Mercado Livre (ACL), negociar condições e avaliar Geração Distribuída. A rede física continua sendo da distribuidora; o que muda é a relação comercial de contratação. Desde 2024, todos os consumidores do Grupo A têm esse direito regulatório garantido."
    },
    3: {
      rubric: "Problema Tratado",
      title: "Slide 3 — Problema Tratado & Preservação de Contexto",
      target: "45 segundos (01:05 - 01:50)",
      text: "Contudo, ter escolha não significa saber escolher. O decisor enfrenta uma jornada cheia de fricções: não sabe que pode escolher, descobre alternativas, precisa entender elegibilidade, compara propostas incomparáveis e precisa verificar se a economia prometida realmente aconteceu. Perguntas como 'Sou elegível?', 'Quanto economizo?' e 'O resultado aconteceu?' evidenciam que o problema da Milet não é apenas encontrar preço, mas sim preservar o contexto contínuo entre dados, decisão, contratação e resultado."
    },
    4: {
      rubric: "Estado da Arte (1/3)",
      title: "Slide 4 — Mercado e Regulação no Brasil",
      target: "50 a 55 segundos (01:50 - 02:45)",
      text: "No Estado da Arte, analisamos mercado e regulação. O setor elétrico brasileiro evoluiu da dualidade ACR vs ACL para a abertura do Grupo A em 2024 e a consolidação da Geração Distribuída como rota distinta. Além disso, a CCEE avança na digitalização das migrações e planeja uma plataforma centralizada pública de comparação. Destacamos nossa tese acadêmica: a Milet não deve ser defendida pela tese de que 'não existe comparador', pois a comparação básica tende a se tornar infraestrutura pública."
    },
    5: {
      rubric: "Estado da Arte (2/3)",
      title: "Slide 5 — Soluções Existentes & Matriz N1",
      target: "50 segundos (02:45 - 03:35)",
      text: "Mapeamos as soluções existentes estritamente documentadas no relatório N1. A UC Livre atua como marketplace de RFQ e comparação no mercado livre; a Deskonta foca em geração distribuída compartilhada; a Energy Ogre provou o modelo de gestão recorrente por assinatura no Texas; a EnergySage é referência em transparência de propostas; e a CCEE opera como infraestrutura de liquidação e futura comparação estatal. Nenhuma atribuição além do documentado foi feita."
    },
    6: {
      rubric: "Estado da Arte (3/3)",
      title: "Slide 6 — A Lacuna Investigada & Hipótese",
      target: "45 a 50 segundos (03:35 - 04:25)",
      text: "A lacuna investigada pela Milet está na integração contínua dos mecanismos: Passaporte Energético, motor de rotas, comparação normalizada, RFQ reverso, workflow de execução, Savings Ledger e reotimização. Os componentes existem isoladamente. A nossa hipótese acadêmica é testar a integração desses mecanismos em uma jornada contínua adequada ao contexto brasileiro, sem qualquer pretensão comercial ingênua de ineditismo absoluto."
    },
    7: {
      rubric: "Plano de Projeto (1/3)",
      title: "Slide 7 — Perfis de Usuários & VPC",
      target: "45 segundos (04:25 - 05:10)",
      text: "No Plano de Projeto, extraímos do Fibery os User Profiles e o Value Proposition Canvas. Enfatizamos Jobs, Pains e Gains. Definimos como prioridade absoluta o Consumidor PME e Decisor Energético (UP-01), conectando-o aos fornecedores (UP-03 e UP-04), integradores EPC (UP-05) e ao Operador Milet (UP-06). Reforçamos que os perfis orientam requisitos e backlog; não são personas de marketing."
    },
    8: {
      rubric: "Plano de Projeto (2/3)",
      title: "Slide 8 — Epics, User Stories e MVP em Projetos I",
      target: "50 segundos (05:10 - 06:00)",
      text: "Apresentamos a estrutura dos Épicos e das 28 User Stories do relatório. Destacamos as histórias do fluxo principal: US-001 (elegibilidade), US-002 (ingestão de fatura), US-006 (rotas), US-010 (RFQ), US-013 (comparação normalizada), US-019 (esteira de migração), US-021 (razão de economia) e US-027 (rastreabilidade). Fixamos a definição oficial do MVP: primeira versão funcional do fluxo prioritário construída em Projetos I, com operação assistida ou simulada onde necessário."
    },
    9: {
      rubric: "Plano de Projeto (Épicos Ampliados)",
      title: "Slide 9 — Épicos do MVP: Visão Ampliada do Fibery Whiteboard",
      target: "35 segundos (06:00 - 06:35)",
      text: "Exibimos a visão ampliada do Whiteboard de Épicos no Fibery. Esta visualização de alta resolução detalha como as 28 User Stories se agrupam nos grandes blocos de valor da solução Milet: desde a Descoberta de Elegibilidade e Ingestão de Faturas, passando pelo Motor de Comparação Normalizada e Disparo de RFQ, até a Esteira de Migração e o Savings Ledger."
    },
    10: {
      rubric: "Plano de Projeto (3/3)",
      title: "Slide 10 — Business Model Canvas v0.1",
      target: "40 segundos (06:35 - 07:15)",
      text: "Exibimos o Business Model Canvas v0.1 importado do Fibery sob a matriz Strategyzer, identificado com a badge 'hipóteses em validação'. Destacamos o segmento prioritário de PMEs, a proposta de valor contínua do fluxo entender-comparar-competir-executar-acompanhar-reotimizar, e registramos que as fontes de receita são hipóteses a serem validadas."
    },
    11: {
      rubric: "Cronograma (1/2)",
      title: "Slide 11 — Cronograma Projetos I & Marco 19/10 MVP",
      target: "45 segundos (07:15 - 08:00)",
      text: "O cronograma de Projetos I (2026.2) segue as datas oficiais do plano de ensino: de 10/08 a 20/09 para Discovery; de 21/09 a 28/09 para Plano de Projeto; de 29/09 a 18/10 para a construção da primeira versão funcional do MVP; com entrega e apresentação do MVP no marco oficial de 19/10/2026. A partir de 26/10 aplicamos SSDLC e segurança, seguidos por testes e validação em novembro. Reforçamos a mensagem: o MVP não fica para Projetos II."
    },
    12: {
      rubric: "Cronograma (2/2)",
      title: "Slide 12 — Gantt Geral & Continuidade em Projetos II",
      target: "35 segundos (08:00 - 08:35)",
      text: "Visualizamos no Gantt do Fibery a transição para Projetos II (2027.1), cujos rótulos são de continuidade: evolução técnica, mais integrações reais de APIs, automação, piloto ampliado e consolidação da solução. Registramos a nota de que as datas de Projetos II são macroplanejamento preliminar a ser sincronizado com o plano de ensino do próximo semestre."
    },
    13: {
      rubric: "Cronograma (Gantt Ampliado)",
      title: "Slide 13 — Detalhamento do Cronograma: Visão Expandida Fibery Gantt",
      target: "35 segundos (08:35 - 09:10)",
      text: "Exibimos em alta resolução o Gantt completo do Fibery em duas partes ampliada: a Parte 1 (superior) detalha cada sprint e entregável de Projetos I até a entrega do MVP em 19/10 e encerramento em dezembro; a Parte 2 (inferior) apresenta o cronograma preliminar de continuidade para Projetos II em 2027.1."
    },
    14: {
      rubric: "Resultados Esperados",
      title: "Slide 14 — Resultados Esperados & Três Marcos",
      target: "40 segundos (09:10 - 09:50)",
      text: "Organizamos os Resultados Esperados em três marcos bem definidos: até o Checkpoint de MVP em 19/10 entregamos a primeira versão funcional do fluxo prioritário; até o fim de Projetos I entregamos o MVP refinado, arquitetura documentada, SSDLC e hipóteses validadas; e em Projetos II damos continuidade com integrações reais, automação e piloto ampliado. A mensagem final sintetiza: Projetos I precisa provar que o ciclo funciona; Projetos II deve provar que ele pode amadurecer."
    },
    15: {
      rubric: "Encerramento",
      title: "Slide 15 — Encerramento & Q&A",
      target: "10 segundos (09:50 - 10:00)",
      text: "Milet: Mesma energia. Mais possibilidades. Agradeço ao professor orientador Rodrigo Juliani e à banca pela atenção, e fico à disposição para a arguição."
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

  // Ajuste edge-to-edge total: ocupa 100% da tela sem nenhuma contenção
  function resizeDeck() {
    if (!deckContainer) return;
    const drawerOpen = notesDrawer && notesDrawer.classList.contains('open');
    const drawerWidth = (drawerOpen && window.innerWidth >= 1280) ? 500 : 0;

    deckContainer.style.width = drawerWidth > 0 ? `calc(100% - ${drawerWidth}px)` : '100%';
    deckContainer.style.height = '100%';
    deckContainer.style.transform = 'none';
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
    resizeDeck();
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
