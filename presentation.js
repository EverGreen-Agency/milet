/**
 * MILET — ENGINE DA APRESENTAÇÃO WEB 16:9
 * Projetos de Engenharia da Computação I (Mackenzie - 2026.2)
 */

(function () {
  'use strict';

  // Configurações
  const TOTAL_SLIDES = 12;
  const TARGET_TIME_SECONDS = 600; // 10 minutos
  let currentSlide = 1;
  let timerSeconds = 0;
  let timerInterval = null;
  let isTimerRunning = true;
  let isNotesOpen = false;

  // Speaker Notes por slide (sincronizado com speaker-notes.md)
  const speakerNotesData = {
    1: {
      title: "Slide 1 — Capa & Abertura",
      target: "25 segundos (00:00 - 00:25)",
      text: "Bom dia, professor e colegas. Meu nome é Eduardo Ferreira de Mattos e apresento o plano de projeto da Milet: uma camada digital independente para entender, comparar, contratar e otimizar energia. Este projeto integra a disciplina Projetos de Engenharia da Computação I da Turma 6 do Mackenzie e estabelece os fundamentos de engenharia e produto que serão desenvolvidos até o próximo semestre."
    },
    2: {
      title: "Slide 2 — O Problema Tratado",
      target: "50 segundos (00:25 - 01:15)",
      text: "O problema central que motivou a Milet não é a falta de oferta energética, e sim a impossibilidade prática de o consumidor médio decidir entre alternativas incomparáveis. Hoje, a jornada de uma empresa é totalmente fragmentada: da fatura incompreensível às regras tarifárias complexas, passando por ofertas de comercializadoras e geradores que usam premissas e indexadores diferentes, até contratos extensos e operações manuais. Na análise dos 5 Porquês, chegamos à causa-raiz: falta uma camada neutra de software que traduza dados elétricos em decisões transparentes e auditáveis."
    },
    3: {
      title: "Slide 3 — A Tese e o Ciclo Milet",
      target: "55 segundos (01:15 - 02:10)",
      text: "A tese da Milet resolve essa dor fechando o ciclo inteiro da relação energética em 5 etapas contínuas: primeiro, Entender os dados via ingestão da fatura e geração do Passaporte Energético; segundo, Decidir entre rotas viáveis — seja cativo, geração distribuída por assinatura, usina própria ou mercado livre; terceiro, Competir através de um mecanismo padronizado de RFQ onde fornecedores disputam a demanda; quarto, Executar a migração e contratação de ponta a ponta; e quinto, Aprender e Gestão Contínua, auditando a economia realizada e preparando novas cotações antes do vencimento. Usina solar, GD ou ACL não são o produto: são alternativas que o software orquestra."
    },
    4: {
      title: "Slide 4 — Perfis de Usuário & Ecossistema",
      target: "50 segundos (02:10 - 03:00)",
      text: "Para não dispersar o escopo da disciplina, mapeamos todos os atores do ecossistema, mas definimos uma prioridade cirúrgica para o MVP: o UP-01, o Consumidor PME e Decisor Energético. Esse decisor quer previsibilidade e economia sem carregar o risco regulatório. Em segundo nível, conectamos os agentes de oferta necessários: o Gerador independente que busca ocupar capacidade, a Comercializadora no mercado livre e o EPC ou integrador de engenharia. Atores como consumidor residencial e investidores estão mapeados no domínio, mas ficam para fases de expansão futura."
    },
    5: {
      title: "Slide 5 — 7 User Stories Chave",
      target: "70 segundos (03:00 - 04:10)",
      text: "Em vez de listar dezenas de funcionalidades soltas, estruturamos o produto através de 7 User Stories nucleares que cobrem a jornada ponta a ponta. Três delas são pilares indispensáveis: a US-002, que resolve a entrada de dados via leitura estruturada da fatura; a US-013, que é o coração da decisão ao normalizar propostas comerciais sob as mesmas premissas econômicas; e a US-021, que comprova a entrega de valor ao confrontar a economia prometida com o resultado real faturado. As histórias US-006, 010, 019 e 027 garantem o fluxo de rotas, a disputa do RFQ, a esteira de migração e a rastreabilidade auditável de todo o processo."
    },
    6: {
      title: "Slide 6 — Do Backlog ao Recorte do MVP",
      target: "50 segundos (04:10 - 05:00)",
      text: "Organizamos os requisitos em 6 capacidades ou épicos centrais: Dados e Passaporte, Diagnóstico e Decisão, Marketplace/RFQ, Comparação e Escolha, Execução Assistida e Operação/Reotimização. O relatório acadêmico detalha o backlog completo com 28 User Stories. Aqui na tela, evidenciamos o recorte estrito de P0 para o MVP: apenas as funcionalidades essenciais para provar a tese com o decisor PME de ponta a ponta. Recursos como múltiplos perfis de permissão, leilões avançados de blocos e automação contratual sem toque humano foram conscientemente alocados como P1 e P2."
    },
    7: {
      title: "Slide 7 — Estado da Arte & Diferenciação",
      target: "60 segundos (05:00 - 06:00)",
      text: "Na pesquisa de Estado da Arte, não caímos na armadilha de dizer que não há concorrentes. O mercado possui soluções pontuais: plataformas de dados como a Arcadia nos EUA, serviços de troca contínua como a Energy Ogre, marketplaces de flexibilidade como a Piclo no Reino Unido, e no Brasil a futura plataforma pública de comparação determinada pelo Decreto 13.097 na CCEE. A hipótese diferencial da Milet está na integração contínua: nenhuma solução hoje no país integra diagnóstico explicável de fatura, comparação neutra entre rotas diferentes, execução assistida e auditoria contínua de economia em uma única experiência independente."
    },
    8: {
      title: "Slide 8 — Projetos I define. Projetos II constrói e valida.",
      target: "45 segundos (06:00 - 06:45)",
      text: "Um ponto fundamental de engenharia: este marco não se encerra em 2026.2. Projetos I foi dedicado ao discovery aprofundado, modelagem de requisitos, backlog priorizado, arquitetura de sistemas e validação conceitual inicial. Já Projetos II, no primeiro semestre de 2027, será a fase de engenharia ativa: implementação do MVP em código, testes automatizados, conformidade com a LGPD e a realização de um piloto demonstrável para validar as métricas de sucesso."
    },
    9: {
      title: "Slide 9 — Cronograma Geral (Ago/2026 a Jun/2027)",
      target: "60 segundos (06:45 - 07:45)",
      text: "Nosso cronograma atravessa os dois semestres letivos com marcos claros. Neste semestre de Projetos I, cumprimos o Estado da Arte, mapeamento de perfis e BMC em agosto e setembro; em outubro fechamos o detalhamento de requisitos e recorte do MVP; e em novembro e dezembro concluímos o planejamento arquitetural e prototipação conceitual. Em Projetos II, entre fevereiro e março construímos os módulos de ingestão e motor de rotas; em abril implementamos a comparação normalizada e segurança; em maio executamos o piloto de validação com dados reais; e em junho entregamos o MVP v1 funcional e o relatório final da graduação."
    },
    10: {
      title: "Slide 10 — Gestão do Projeto & Sistema de Trabalho",
      target: "40 segundos (07:45 - 08:25)",
      text: "Para garantir rastreabilidade acadêmica e rigor de execução, adotamos métodos híbridos: Scrum para ciclos de entrega e Kanban para fluxo contínuo de itens de trabalho. A estrutura é dividida em 4 camadas bem definidas: Discovery com artefatos de pesquisa, Product Backlog com priorização P0/P1/P2, Roadmap de marcos e a camada de Execução com critérios de aceite em formato BDD e testes."
    },
    11: {
      title: "Slide 11 — Business Model Canvas (Hipóteses v0.1)",
      target: "50 segundos (08:25 - 09:15)",
      text: "O Business Model Canvas do projeto é tratado estritamente como hipótese v0.1 a ser testada, e não como modelo validado comercialmente. Destacamos quatro blocos essenciais: o segmento inicial de PMEs; a proposta de valor focada em decisão, competição e gestão contínua; as fontes de receita baseadas em taxa transparente de originação ou modelo de concierge; e as parcerias estratégicas com geradores, comercializadoras e EPCs que sustentam a infraestrutura regulada de bastidor."
    },
    12: {
      title: "Slide 12 — Critérios de Sucesso e Fechamento",
      target: "35 segundos (09:15 - 09:50)",
      text: "Para encerrar, definimos critérios objetivos para considerar o projeto de engenharia concluído com êxito ao final de Projetos II: conseguir ingerir e estruturar dados de faturas reais; gerar recomendações de rotas com premissas transparentes; normalizar propostas comerciais concorrentes; operar a esteira de contratação assistida; e comprovar a economia realizada em ambiente de piloto. Milet: energia em mais liberdade. Muito obrigado, estou aberto às perguntas da banca."
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
    if (data && notesTitle && notesTarget && notesText) {
      notesTitle.textContent = data.title;
      notesTarget.textContent = `Tempo alvo: ${data.target}`;
      notesText.textContent = data.text;
    }
  }

  function toggleNotes() {
    isNotesOpen = !isNotesOpen;
    if (notesDrawer) {
      notesDrawer.classList.toggle('open', isNotesOpen);
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
        // Pausa/retoma timer
        isTimerRunning = !isTimerRunning;
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

  // Inicialização
  resizeDeck();
  showSlide(1);
  startTimer();
})();
