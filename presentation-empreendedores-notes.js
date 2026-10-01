/**
 * MILET — ENGINE DA APRESENTAÇÃO COM NOTAS DE ORADOR (TELEPROMPTER)
 * Disciplina: PROJETOS EMPREENDEDORES — AVALIAÇÃO N1 (Mackenzie 2026.2)
 * Docente: Profa. Julia Gebara
 */

(function () {
  'use strict';

  const TOTAL_SLIDES = 12;
  const CORE_SLIDES = 10;
  const TARGET_TIME_SECONDS = 600; // 10 minutos
  let currentSlide = 1;
  let timerSeconds = 0;
  let timerInterval = null;
  let isTimerRunning = true;
  let isNotesOpen = true;

  const speakerNotesData = {
    1: {
      rubric: "Abertura & Apresentação Formal",
      title: "Slide 1 — Capa & Proposta Central",
      target: "35 segundos (00:00 - 00:35)",
      bullets: "• Apresentação formal da Milet perante a Profa. Julia Gebara e colegas\n• Apresentação dos 6 integrantes em ordem alfabética e suas formações\n• Tese central: transformar uma decisão hoje fragmentada e opaca em jornada contínua",
      text: "Bom dia, Profa. Julia Gebara e colegas. Apresentamos a Milet, uma plataforma digital e independente projetada para permitir que pequenas e médias empresas possam entender, comparar, contratar e gerir sua energia continuamente.\n\nNosso grupo é multidisciplinar e reúne: Eduardo e Leonardo em Engenharia de Computação, Enzo em Engenharia Elétrica, Heloísa em Administração, Maria Luíza em Arquitetura e Mell em Direito. Essa diversidade de repertório é exatamente o que nos permite investigar um setor complexo como o elétrico a partir da tese: 'Energia em mais liberdade'."
    },
    2: {
      rubric: "Habilidades da Equipe & Diagnóstico",
      title: "Slide 2 — Equipe Multidisciplinar & Matriz SWOT",
      target: "55 segundos (00:35 - 01:30)",
      bullets: "• Forças e Fraquezas como características internas da própria equipe\n• Sinergia entre tecnologia, regulação elétrica, modelagem de negócios e direito\n• Oportunidades da abertura do Grupo A e ameaças de comercializadoras tradicionais",
      text: "No Slide 2, apresentamos o mapeamento de habilidades da nossa equipe e a Matriz SWOT, separando rigorosamente as capacidades internas do grupo do contexto externo de mercado.\n\nComo forças internas da equipe, unimos capacidade própria de desenvolvimento de software e IA, proximidade prática com a engenharia elétrica, estruturação de conformidade jurídica e modelagem de processos. Como limitações atuais da equipe, reconhecemos estarmos em estágio inicial sem base histórica prévia de migrações e a necessidade de validar hipóteses empiricamente no campo.\n\nNo ambiente externo, a abertura do Mercado Livre para todo o Grupo A desde 2024 cria uma demanda reprimida em PMEs. Em contrapartida, monitoramos como ameaças as redes consolidadas de corretores das comercializadoras e futuras ferramentas públicas da CCEE."
    },
    3: {
      rubric: "Declaração e Matriz do Problema (6 Blocos)",
      title: "Slide 3 — Declaração em 1 Frase & Matriz do Problema",
      target: "60 segundos (01:30 - 02:30)",
      bullets: "• Declaração do problema lapidada em UMA única frase oficial\n• Análise em 6 blocos do modelo da Profa. Julia Gebara\n• Destaque para 'Como a pessoa afetada se sente': insegura, sobrecarregada e desconfiada",
      text: "A nossa declaração do problema sintetiza em uma única frase a dor central: 'Decisores de PMEs têm dificuldade para perceber quando possuem alternativas ao modelo atual de energia e, quando as descobrem, para avaliar sua elegibilidade, comparar propostas em bases equivalentes e acompanhar o resultado da contratação, devido à complexidade técnica e à fragmentação das informações e agentes do setor.'\n\nNa matriz de 6 blocos da disciplina, o problema ocorre em faturas elevadas ou abordagens comerciais ativas. Afeta donos e gestores de PMEs do Grupo A. A causa raiz reside na assimetria de informações e jargões do setor. Como o decisor se sente? Inseguro, sobrecarregado e desconfiado ao tomar uma decisão de alto impacto sem dominar as regras. As alternativas atuais, como cotações avulsas por e-mail ou planilhas manuais, trazem a desvantagem da incomparabilidade e falta de auditoria contínua."
    },
    4: {
      rubric: "Empatia com a Demanda",
      title: "Slide 4 — Mapa da Empatia: Consumidor PME",
      target: "50 segundos (02:30 - 03:20)",
      bullets: "• Estrutura clássica do Mapa da Empatia: Pensa/Sente, Vê, Ouve, Fala/Faz, Dores e Necessidades\n• Badge de hipóteses iniciais a validar em campo\n• O decisor busca segurança e economia sem assumir nova complexidade operacional",
      text: "No Slide 4, estruturamos o Mapa da Empatia do Perfil 1: o Consumidor PME e Decisor Energético, tratado com a salvaguarda de 'hipóteses iniciais a validar com clientes'.\n\nO que ele pensa e sente? Sente que a conta está alta, mas teme tomar uma decisão errada e desconfia de promessas agressivas. O que ele vê? Faturas complexas, corretores oferecendo alternativas divergentes e notícias dispersas sobre mercado livre. O que ouve? Promessas de economia de até 30%, mas também relatos contraditórios sobre multas e riscos. O que fala e faz? Encaminha contas em PDF para análise, consulta parceiros e tende a adiar a decisão quando fica inseguro.\n\nSuas dores centrais são a falta de conhecimento técnico e o medo de contratos inadequados; suas necessidades fundamentais são um diagnóstico claro, comparação equivalente e acompanhamento contínuo."
    },
    5: {
      rubric: "Proposta de Valor — Demanda (Visual Canvas)",
      title: "Slide 5 — Canvas da Proposta de Valor: Consumidor PME",
      target: "55 segundos (03:20 - 04:15)",
      bullets: "• Artefato visual oficial do Value Proposition Canvas (Customer Profile & Value Map)\n• Destaque para o encaixe perfeito entre os Jobs, Pains e Gains do decisor e as soluções Milet\n• Passaporte Energético, RFQ Reverso e Savings Ledger como pilares de alívio e ganho",
      text: "No Slide 5, apresentamos o nosso Value Proposition Canvas construído para o Consumidor PME, estruturado no rigor visual da metodologia Strategyzer de Osterwalder.\n\nÀ direita, no Customer Profile, mapeamos as tarefas do cliente de entender custos e auditar faturas; suas dores com propostas incomparáveis e falta de tempo; e os ganhos almejados de economia real auditável.\n\nÀ esquerda, no Mapa de Valor da Milet, respondemos diretamente com o Diagnóstico e Passaporte Energético (que higienizam a fatura), o RFQ Reverso (que equaliza propostas na mesma régua) e o Savings Ledger (que audita mês a mês se a economia prometida realmente ocorreu)."
    },
    6: {
      rubric: "Empatia com a Oferta",
      title: "Slide 6 — Mapa da Empatia: Fornecedor de Energia",
      target: "50 segundos (04:15 - 05:05)",
      bullets: "• A Milet é uma plataforma bilateral que precisa gerar incentivos reais para a oferta\n• Dores das comercializadoras: alto custo de aquisição, faturas ilegíveis e retrabalho de pricing\n• Necessidades: demanda qualificada, dados higienizados e visibilidade de pipeline",
      text: "Como negócio bilateral, investigamos com o mesmo rigor o Perfil 2: as Comercializadoras e Fornecedores de Energia.\n\nO que a comercializadora pensa e sente? Quer volume de demanda qualificada, mas frustra-se com leads frios e faturas incompletas. O que vê? Competição acirrada após a abertura do mercado e custos crescentes de prospecção. O que ouve? Clientes leigos perguntando apenas 'quanto vou economizar' e dúvidas sobre segurança. O que fala e faz? Gasta dias coletando faturas, calculando curvas de carga manualmente e fazendo follow-ups exaustivos.\n\nSuas maiores dores são o retrabalho operacional e o tempo de precificação; sua necessidade é receber dados estruturados e prontos para submeter ofertas assertivas."
    },
    7: {
      rubric: "Proposta de Valor — Oferta",
      title: "Slide 7 — Canvas da Proposta de Valor: Fornecedor",
      target: "50 segundos (05:05 - 05:55)",
      bullets: "• Value Map bilateral: Portal de Submissão, Matching Inteligente e Passaporte Estruturado\n• Analgésicos: eliminação da digitação manual de faturas e redução de retrabalho técnico\n• Criadores de ganho: redução do tempo de resposta para minutos e maior conversão comercial",
      text: "No Slide 7, estruturamos o Canvas da Proposta de Valor para o Fornecedor de Energia. O Job da comercializadora é prospectar PMEs elegíveis, precificar com velocidade e fechar contratos com margem saudável.\n\nO Mapa de Valor da Milet oferece o Portal Padronizado de Submissão de Propostas, o Matching Inteligente de Demanda e o envio do Passaporte Energético com dados já higienizados. Isso atua como um analgésico direto contra a digitação de faturas ilegíveis e cria ganho ao reduzir o tempo de resposta de dias para minutos, permitindo escalar o volume de vendas com eficiência operacional."
    },
    8: {
      rubric: "Validação Empírica — Demanda",
      title: "Slide 8 — Validação do Problema: Consumidor PME",
      target: "55 segundos (05:55 - 06:50)",
      bullets: "• Instrumento de pesquisa estruturado em 5 perguntas oficiais de campo\n• Postura científica ética: nenhuma resposta inventada antes da conclusão de campo\n• Espaços transparentes reservados para Respondente A e Respondente B",
      text: "No Slide 8, entramos na etapa de Validação do Problema exigida pela disciplina. Em total consonância com as orientações da Profa. Julia Gebara e a integridade acadêmica do Mackenzie, não inventamos respostas nem percentuais fictícios de pesquisa.\n\nApresentamos aqui o nosso formulário estruturado em 5 perguntas direcionadas a decisores de PMEs: investigando a última vez que tentaram reduzir a conta, como compararam propostas recebidas, qual foi o maior atrito do processo, como verificam a veracidade da economia e como auditam o pós-contratação. Os espaços dos Respondentes A e B estão reservados para transcrição direta à medida que as entrevistas forem concluídas no campo."
    },
    9: {
      rubric: "Validação Empírica — Oferta",
      title: "Slide 9 — Validação do Problema: Fornecedor",
      target: "55 segundos (06:50 - 07:45)",
      bullets: "• Instrumento estruturado para agentes comerciais de comercializadoras\n• 5 perguntas focadas em qualificação, dados faltantes, retrabalho e motivos de perda\n• Espaços reservados para entrevistas qualitativas com especialistas de mercado",
      text: "No Slide 9, aplicamos o mesmo rigor de validação para o Lado da Oferta. Elaboramos o roteiro com 5 perguntas para comercializadoras e geradores: como qualificam PMEs hoje, quais informações normalmente faltam nas faturas enviadas pelos clientes, onde há mais retrabalho e lentidão na equipe, quais motivos fazem uma cotação não avançar e o que torna uma oportunidade pronta para proposta.\n\nEstamos conduzindo o agendamento de entrevistas com heads comerciais e executivos de contas de comercializadoras varejistas, cujas transcrições serão incorporadas para consolidar a entrega."
    },
    10: {
      rubric: "Síntese N1 & Roteiro N2",
      title: "Slide 10 — Síntese da Entrega N1 & Próximos Passos",
      target: "55 segundos (07:45 - 08:40)",
      bullets: "• Fechamento dos 10 slides principais da avaliação N1\n• Consolidação da modelagem de diagnóstico e plano de ação para a etapa N2\n• Agradecimento formal à Profa. Julia Gebara e abertura para arguição",
      text: "Para concluir a sequência principal da Avaliação N1, o Slide 10 consolida o cumprimento de todos os itens requeridos no plano de ensino: mapeamento de competências da equipe, declaração lapidada do problema, matriz de 6 blocos, mapas de empatia bilaterais, propostas de valor alinhadas e formulação dos instrumentos de pesquisa.\n\nNossos próximos passos imediatos contemplam a consolidação das transcrições de campo, o confronto das respostas com os Mapas de Empatia e a construção do protótipo digital do Passaporte Energético como base para a Avaliação N2. Agradecemos à Profa. Julia Gebara pela condução da disciplina e estamos à disposição para comentários da banca."
    },
    11: {
      rubric: "Apêndice · Modelo de Negócio",
      title: "Slide 11 (Apêndice) — Business Model Canvas (Fibery)",
      target: "Consulta / Q&A",
      bullets: "• Artefato do Fibery Whiteboard v0.2 exibido com destaque visual nítido\n• Mapeamento dos 9 blocos do modelo de negócio bilateral da Milet\n• Hipóteses de receita: take-rate de sucesso do fornecedor e assinatura mensal de auditoria",
      text: "Slide de Apêndice: exibe o Business Model Canvas completo construído no workspace do Fibery, destacando as hipóteses de monetização bilateral com total transparência algorítmica e neutralidade regulatória."
    },
    12: {
      rubric: "Encerramento & Agradecimentos",
      title: "Slide 12 — Encerramento e Agradecimentos",
      target: "25 segundos (08:40 - 09:05)",
      bullets: "• Agradecimento formal à Profa. Julia Gebara e à banca\n• Créditos da equipe multidisciplinar (Computação, Elétrica, Adm, Direito, Arquitetura)\n• Abertura formal para a sessão de arguição e perguntas",
      text: "Muito obrigado a todos pela atenção e, em especial, à Profa. Julia Gebara pela condução e direcionamentos ao longo da disciplina Projetos Empreendedores. A equipe Milet encerra aqui a apresentação do diagnóstico N1 e permanece à disposição para perguntas, considerações e apontamentos da banca."
    }
  };

  const slides = document.querySelectorAll('.slide');
  const deckContainer = document.getElementById('deck-container');
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

  function resizeDeck() {
    if (!deckContainer) return;
    const drawerOpen = notesDrawer && notesDrawer.classList.contains('open');
    const drawerWidth = (drawerOpen && window.innerWidth >= 1280) ? 500 : 0;

    deckContainer.style.width = drawerWidth > 0 ? `calc(100% - ${drawerWidth}px)` : '100%';
    deckContainer.style.height = '100%';
    deckContainer.style.transform = 'none';
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
        slideCounter.textContent = `${paddedCurrent} / 10`;
      } else if (currentSlide === 11) {
        slideCounter.textContent = `Apêndice · BMC (11)`;
      } else {
        slideCounter.textContent = `12 / 12 · Encerramento`;
      }
    }

    if (progressBar) {
      const progressPercent = (currentSlide / TOTAL_SLIDES) * 100;
      progressBar.style.width = `${progressPercent}%`;
    }

    updateSpeakerNotes(currentSlide);

    try {
      sessionStorage.setItem('milet_empreendedores_notes_slide', currentSlide);
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

  function toggleNotes() {
    if (!notesDrawer) return;
    isNotesOpen = !isNotesOpen;
    if (isNotesOpen) {
      notesDrawer.classList.add('open');
      if (btnNotes) btnNotes.classList.add('active');
    } else {
      notesDrawer.classList.remove('open');
      if (btnNotes) btnNotes.classList.remove('active');
    }
    resizeDeck();
  }

  function updateSpeakerNotes(slideNum) {
    const data = speakerNotesData[slideNum];
    if (!data) return;

    if (notesTitle) notesTitle.textContent = data.title;
    if (notesTarget) notesTarget.textContent = `Tempo alvo: ${data.target}`;
    if (notesRubric) notesRubric.textContent = `Rubrica: ${data.rubric}`;
    if (notesBullets) notesBullets.textContent = data.bullets;
    if (notesText) notesText.textContent = data.text;
  }

  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  function updateTimerDisplay() {
    if (!timerDisplay) return;
    timerDisplay.textContent = formatTime(timerSeconds);

    const timerBadge = document.querySelector('.hud-timer-badge');
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
    }
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

  const timerBadgeEl = document.querySelector('.hud-timer-badge');
  if (timerBadgeEl) {
    timerBadgeEl.addEventListener('click', toggleTimer);
    timerBadgeEl.addEventListener('dblclick', (e) => {
      e.stopPropagation();
      resetTimer();
    });
  }

  resizeDeck();
  showSlide(1);
  startTimer();
})();
