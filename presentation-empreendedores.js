/**
 * MILET — ENGINE DA APRESENTAÇÃO WEB 16:9 (12 SLIDES)
 * Disciplina: PROJETOS EMPREENDEDORES — N1
 * Narrativa: PROBLEMA → USUÁRIOS → DORES → PROPOSTA DE VALOR → HIPÓTESES → VALIDAÇÃO
 */

(function () {
  'use strict';

  // Configurações Globais
  const TOTAL_SLIDES = 12;
  const TARGET_TIME_SECONDS = 600; // 10 minutos
  let currentSlide = 1;
  let timerSeconds = 0;
  let timerInterval = null;
  let isTimerRunning = true;
  let isNotesOpen = false;

  // Speaker Notes completas para os 12 Slides de Projetos Empreendedores
  const speakerNotesData = {
    1: {
      rubric: "Abertura & Posicionamento",
      title: "Slide 1 — Capa & Proposta de Valor Central",
      target: "30 segundos (00:00 - 00:30)",
      bullets: "• Apresentação formal da Milet como plataforma independente de energia\n• Conexão entre o consumidor empresarial e as novas modalidades regulatórias\n• Propósito: transformar inércia e assimetria em liberdade de escolha sustentável",
      text: "Bom dia, professores avaliadores e colegas. Apresentamos a Milet, uma plataforma digital e independente projetada para permitir que consumidores empresariais possam entender, comparar, contratar e gerir sua energia de forma contínua.\n\nEnergia elétrica representa um dos maiores custos operacionais de uma empresa, mas quase sempre é tratada com passividade. A Milet nasce para transformar essa relação comercial, trazendo a tese: 'Energia em mais liberdade'."
    },
    2: {
      rubric: "Capacidade & Diagnóstico",
      title: "Slide 2 — Equipe Empreendedora & Matriz SWOT",
      target: "50 segundos (00:30 - 01:20)",
      bullets: "• Distinção explícita entre fatores internos da equipe e fatores de mercado\n• Forças: software interno, repertório de produto, proximidade técnica (ElectROM)\n• Fraquezas & Ameaças tratadas com sobriedade científica",
      text: "No Slide 2, apresentamos a nossa equipe e a Matriz SWOT, separando rigorosamente as capacidades internas do grupo do contexto externo de mercado.\n\nComo forças internas, temos capacidade de desenvolvimento rápido de software, domínio de produto, growth e IA, além da proximidade prática com a engenharia de campo e instalação solar. Como fraqueza, reconhecemos a necessidade de consolidar histórico de transações e a dependência de parceiros regulados.\n\nNas oportunidades externas, temos a abertura do Mercado Livre para todo o Grupo A e a futura baixa tensão. Como ameaças, monitoramos a concorrência de comercializadoras verticais e a futura plataforma pública de comparação da CCEE, o que nos obriga a criar valor muito além da cotação pontual."
    },
    3: {
      rubric: "Definição do Problema",
      title: "Slide 3 — Declaração & Matriz do Problema",
      target: "55 segundos (01:20 - 02:15)",
      bullets: "• Declaração clara do problema enfrentado por PMEs\n• Análise em 5 blocos: Quando acontece, Quem é afetado, Causas, Consequências, Alternativas\n• Não afirmamos que 'não existe solução', mas sim que são fragmentadas e assimétricas",
      text: "A nossa declaração do problema sintetiza a dor central: 'Muitos consumidores empresariais sequer sabem que possuem alternativas para contratar sua energia. Quando descobrem, enfrentam enorme dificuldade para identificar elegibilidade, comparar propostas díspares, executar a contratação e verificar se a economia prometida realmente ocorreu.'\n\nIsso acontece quando a conta sobe abruptamente ou quando a empresa é abordada por um corretor. O decisor da PME não tem equipe especializada de energia, recebe propostas incomparáveis em PDF e tem medo de incorrer em multas. As alternativas atuais são fragmentadas: planilhas manuais, consultorias caras voltadas apenas a grandes indústrias, ou a inércia de continuar pagando a tarifa cativa da distribuidora."
    },
    4: {
      rubric: "Segmento de Demanda",
      title: "Slide 4 — Perfil 1: Consumidor PME / Decisor Energético",
      target: "50 segundos (02:15 - 03:05)",
      bullets: "• Apresentação do artefato real do Fibery: Academic · User Profiles\n• Estrutura de Jobs, Pains e Gains extraída da investigação de campo\n• O usuário busca decisão segura, não aprender o jargão do setor elétrico",
      text: "No Slide 4, trazemos o artefato real do nosso workspace no Fibery: o mapeamento detalhado de Jobs, Pains e Gains do Perfil 1, o Consumidor PME.\n\nO Job do decisor não é virar especialista em regulação da ANEEL: é entender quanto gasta, descobrir se é elegível a uma alternativa mais barata e contratar com segurança. Suas maiores dores são propostas com premissas diferentes que impedem a comparação direta, falta de tempo e medo de assumir contratos de longo prazo com riscos ocultos. Seu ganho almejado é economia real, auditável e sem atrito operacional."
    },
    5: {
      rubric: "Proposta de Valor — Demanda",
      title: "Slide 5 — Value Proposition Canvas (Consumidor PME)",
      target: "50 segundos (03:05 - 03:55)",
      bullets: "• Apresentação do artefato real do Fibery: Value Proposition Canvas\n• Destaque para as 3 conexões fundamentais: Dor/Alívio, Tarefa/Produto, Ganho/Criador\n• Como a solução Milet responde exatamente às maiores fricções do cliente",
      text: "Conectamos essas dores ao nosso Value Proposition Canvas, também estruturado no Fibery. Destacamos três relações fundamentais:\n\nPrimeiro: à dor de não conseguir comparar propostas, respondemos com a Normalização Automática de Propostas, equalizando todas as ofertas em uma régua comum com impostos e encargos explícitos.\n\nSegundo: à tarefa de descobrir alternativas, oferecemos o Diagnóstico Inteligente e o Passaporte Energético, que lê a fatura e aponta a rota ideal — seja Mercado Livre, Geração Distribuída ou ajuste tarifário.\n\nTerceiro: ao ganho de economizar sem virar refém da operação, criamos a Execução Assistida e o Savings Ledger, que audita mês a mês se a economia prometida de fato aconteceu na conta."
    },
    6: {
      rubric: "Segmento de Oferta",
      title: "Slide 6 — Perfil 2: Comercializadora / Fornecedor de Energia",
      target: "45 segundos (03:55 - 04:40)",
      bullets: "• A Milet é uma plataforma bilateral que precisa gerar valor para a oferta\n• Dores das comercializadoras: CAC altíssimo, leads desqualificados, propostas manuais\n• Ganhos: RFQs padronizados, dados limpos, ciclo comercial reduzido",
      text: "Uma plataforma de mercado só funciona se gerar incentivos reais para os dois lados. No Perfil 2, analisamos os fornecedores: comercializadoras varejistas e geradores de energia.\n\nHoje, o CAC desse setor na prospecção de PMEs é altíssimo. A força comercial gasta semanas tentando obter faturas legíveis de clientes que muitas vezes nem são elegíveis ao Mercado Livre. Para eles, a Milet entrega RFQs pré-qualificados com dados técnicos normalizados, permitindo precificação em minutos, menor custo de aquisição e conversão substancialmente maior."
    },
    7: {
      rubric: "Proposta de Valor — Oferta",
      title: "Slide 7 — Proposta de Valor para o Fornecedor",
      target: "45 segundos (04:40 - 05:25)",
      bullets: "• Value Map desenhado para otimizar o funil dos agentes de comercialização\n• Matching inteligente, portal de submissão padronizada e visibilidade de pipeline\n• Tratado com rigor metodológico como hipóteses de valor a serem medidas no piloto",
      text: "No Slide 7, sintetizamos a Proposta de Valor para o Fornecedor como uma arquitetura de eficiência. Oferecemos Matching Inteligente de demanda, envio do Passaporte Energético com histórico verificado e um Portal de Propostas padronizado que elimina a troca de e-mails e planilhas soltas.\n\nReforçamos perante a banca: tratamos o aumento de conversão e a redução de CAC como hipóteses centrais de valor a serem mensuradas empiricamente durante o piloto com comercializadoras parceiras."
    },
    8: {
      rubric: "Mecanismo de Solução",
      title: "Slide 8 — Da Descoberta ao Resultado Contínuo",
      target: "60 segundos (05:25 - 06:25)",
      bullets: "• Jornada completa em 7 estágios: Descobrir, Entender, Decidir, Competir, Executar, Comprovar, Reotimizar\n• Diferencial estratégico: a Milet não termina na cotação pontual\n• Preservação contínua de contexto entre a fatura inicial e o resultado faturado",
      text: "Como tudo isso se traduz na experiência de produto? O Slide 8 apresenta a jornada em 7 etapas que constrói o diferencial da Milet:\n\n1. Descobrir a elegibilidade em segundos; 2. Entender a fatura por meio da criação do Passaporte Energético; 3. Decidir a rota técnica entre Mercado Livre ou GD; 4. Competir via RFQ reverso com ofertas normalizadas na mesma régua; 5. Executar a migração de forma assistida com interface transparente; 6. Comprovar mês a mês no Savings Ledger a economia real realizada; e 7. Reotimizar o contrato proativamente antes do vencimento.\n\nO lema é claro: a Milet não termina na cotação. O valor está em acompanhar o cliente continuamente."
    },
    9: {
      rubric: "Modelo de Negócio",
      title: "Slide 9 — Business Model Canvas (Hipóteses em Validação)",
      target: "50 segundos (06:25 - 07:15)",
      bullets: "• Artefato real do Fibery: Academic · BMC Whiteboard v0.2\n• Destaque dos 4 pilares: Segmento Inicial, Proposta de Valor, Lado da Oferta e Monetização\n• Hipóteses de receita: Success fee do fornecedor, assinatura/concierge e SaaS",
      text: "No Slide 9, apresentamos nosso Business Model Canvas, extraído do Fibery Whiteboard v0.2, sinalizado com a badge 'hipóteses em validação'.\n\nFocamos inicialmente em PMEs do Grupo A com contas a partir de R$ 5.000 mensais. Nossas hipóteses de monetização contemplam três vertentes complementares: taxa de sucesso paga pelo fornecedor contratado com transparência explícita; assinatura mensal por unidade para gestão e auditoria contínua; e ferramentas de qualificação para os agentes de oferta. Mantemos como premissa inegociável a neutralidade do algoritmo de recomendação."
    },
    10: {
      rubric: "Validação & Pesquisa",
      title: "Slide 10 — Validação do Problema & Métricas de Campo",
      target: "55 segundos (07:15 - 08:10)",
      bullets: "• Rigor ético e científico: nenhuma porcentagem ou número fictício inventado\n• Exibição transparente das métricas prioritárias sob coleta no campo\n• Metodologia: entrevistas em profundidade com decisores PME, comercializadoras e survey",
      text: "No Slide 10, adotamos postura de total integridade acadêmica: não inventamos porcentagens nem resultados de pesquisa para preencher slides. Apresentamos aqui a nossa matriz de pesquisa de campo em andamento e os indicadores que estamos avaliando.\n\nEstamos medindo o grau de desconhecimento do Mercado Livre entre PMEs, o índice de dificuldade para comparar propostas e a disposição a pagar por uma gestão independente. Nossa metodologia combina entrevistas em profundidade com decisores financeiros de empresas, conversas com diretores comerciais de comercializadoras e aplicação de questionários estruturados com teste do protótipo de Passaporte."
    },
    11: {
      rubric: "Matriz Experimental",
      title: "Slide 11 — O Que Precisamos Provar? Hipóteses Prioritárias",
      target: "55 segundos (08:10 - 09:05)",
      bullets: "• As 6 hipóteses prioritárias: H1 a H6 estruturadas de forma falseável\n• Framework: Hipótese → Experimento → Métrica Chave → Critério de Decisão\n• 'O objetivo da N1 não é provar que a Milet está certa, mas transformar a ideia em hipóteses testáveis'",
      text: "Para a disciplina de Projetos Empreendedores, o papel da N1 é transformar a ideia de negócio em hipóteses rigorosamente testáveis. Mapeamos seis hipóteses prioritárias:\n\nDesde H1, que testa se o decisor valoriza um diagnóstico neutro mais do que um catálogo de logos; passando por H3, que afere se fornecedores respondem a RFQs padronizados; até H5 e H6, que validam a retenção pós-contratação e a viabilidade dos economics unitários na operação assistida.\n\nPara cada hipótese, definimos o experimento correspondente, a métrica alvo e o critério de decisão para pivotar ou perseverar."
    },
    12: {
      rubric: "Encerramento & Q&A",
      title: "Slide 12 — Encerramento & Considerações Finais",
      target: "25 segundos (09:05 - 09:30)",
      bullets: "• Síntese da proposta: Entender, Comparar, Contratar e Acompanhar\n• Identificação institucional Mackenzie\n• Abertura segura para arguição da banca avaliadora",
      text: "Concluímos destacando a visão da Milet: permitir que qualquer empresa decida e gerencie sua energia com a mesma facilidade e transparência com que hoje gerencia seus serviços de tecnologia e nuvem.\n\nEntender. Comparar. Contratar. Acompanhar. Agradecemos a atenção da banca e estamos prontos para a arguição e feedbacks dos professores."
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
  const notesRubric = document.getElementById('notes-rubric');
  const notesBullets = document.getElementById('notes-bullets');
  const notesText = document.getElementById('notes-text');
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
      if (notesRubric) notesRubric.textContent = `Rubrica N1: ${data.rubric}`;
      if (notesBullets) notesBullets.innerText = data.bullets || '';
      if (notesText) notesText.textContent = data.text;
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
      timerDisplay.style.color = 'var(--color-coral)';
    } else if (timerSeconds >= 480) {
      timerDisplay.style.color = 'var(--color-amber-light)';
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
        e.preventDefault();
        toggleTimer();
        break;
      case 'r':
      case 'R':
        e.preventDefault();
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
