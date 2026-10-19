/**
 * MILET — ENGINE DA APRESENTAÇÃO DE AVALIAÇÃO DE MVP
 * Disciplina: Projetos de Computação I — Avaliação de MVP
 * Universidade Presbiteriana Mackenzie
 * Apresentador: Eduardo Ferreira de Mattos (TIA 10402800)
 */

(function () {
  'use strict';

  const TOTAL_SLIDES = 9;
  const TARGET_TIME_SECONDS = 600; // 10 minutos
  let currentSlide = 1;
  let timerSeconds = 0;
  let timerInterval = null;
  let isTimerRunning = true;
  let isNotesOpen = true;

  const speakerNotesData = {
    1: {
      rubric: "Abertura Oficial",
      title: "Slide 1 — Capa Oficial & Propósito",
      target: "40 segundos (00:00 - 00:40)",
      bullets: "• Apresentação formal da Milet para a banca de Projetos de Computação I\n• Declaração de tese: 'Energia em mais liberdade' — plataforma digital independente\n• Alinhamento do entregável: MVP de software funcional rodando em produção",
      text: "Bom dia, professor e membros da banca. Apresento a Milet, desenvolvida no âmbito da disciplina de Projetos de Computação I.\n\nA Milet é uma plataforma digital e independente de inteligência energética projetada para que pequenas e médias empresas (PMEs) possam entender seu padrão de consumo, comparar alternativas tarifárias no Mercado Livre e Geração Distribuída em bases equivalentes e auditar sua economia continuamente.\n\nNesta apresentação, demonstro o MVP do projeto — uma aplicação web e PWA funcional com ingestão de faturas, motor de precificação e persistência transacional em nuvem."
    },
    2: {
      rubric: "Definição do Problema",
      title: "Slide 2 — A Dor Real do Decisor de Energia (PME)",
      target: "60 segundos (00:40 - 01:40)",
      bullets: "• Problema: Assimetria informacional crítica e opacidade nas faturas do Grupo A e GD\n• Decisor leigo sobrecarregado: faturas ilegíveis, jargões regulatórios (TUSD, TE, bandeiras)\n• Consequência: Medo de multas e contratos abusivos, levando à paralisia e prejuízo financeiro acumulado",
      text: "No Slide 2, abordo a dor real do usuário de PME no cenário atual do setor elétrico.\n\nCom a abertura do Mercado Livre para todo o Grupo A e a proliferação da Geração Distribuída, o empresário de pequenas e médias empresas passou a ser abordado por dezenas de corretores e comercializadoras. No entanto, o tomador de decisão enfrenta três dores severas:\n\nPrimeiro, assimetria técnica: faturas de concessionárias são ilegíveis para leigos, com termos regulatórios e demandas contratadas que mascaram o custo real.\nSegundo, propostas incomparáveis: comercializadoras enviam cotações com prazos, indexadores e cláusulas contratuais que não podem ser confrontadas diretamente em planilhas comuns.\nTerceiro, falta de auditoria pós-contrato: o cliente contrata sob a promessa de economizar 25%, mas não tem ferramenta para auditar mês a mês se o valor cobrado reflete o desconto prometido."
    },
    3: {
      rubric: "Hipótese de Valor",
      title: "Slide 3 — Hipótese de Valor & Alavancas da Solução",
      target: "50 segundos (01:40 - 02:30)",
      bullets: "• Hipótese central: Se equalizarmos as propostas numa mesma régua técnica em 60s, a PME decide com segurança\n• Três alavancas: Passaporte Energético (higienização) + Comparador Neutro + Savings Ledger (auditoria contínua)\n• Métrica de validação da hipótese: Tempo de diagnóstico < 1 min e clareza de economia auditada",
      text: "A Hipótese de Valor do projeto é clara e testável: 'Se oferecermos a uma PME um diagnóstico energético instantâneo e neutro a partir dos dados de sua fatura, equalizando as opções de suprimento numa mesma régua técnica, o decisor migrará com confiança e com economia auditável.'\n\nEssa proposta se materializa em três pilares funcionais:\n1. Passaporte Energético: higienização dos dados de demanda e consumo em formato padronizado e auditável;\n2. Comparador Neutro Multi-Modal: algoritmo que calcula o custo total evitado entre Mercado Cativo, Mercado Livre (ACL) e GD Compartilhada;\n3. Savings Ledger: livro-razão digital que garante que a economia prometida seja conferida a cada ciclo de faturamento."
    },
    4: {
      rubric: "Aderência ao Conceito de MVP",
      title: "Slide 4 — Fatiamento Lean & Escopo Estrito do MVP",
      target: "60 segundos (02:30 - 03:30)",
      bullets: "• Aplicação estrita de Engenharia de Software e Lean Startup: Fatiamento vertical da jornada\n• O que NÃO é MVP: Não é protótipo estático de Figma nem tenta recriar a CCEE inteira\n• O que É o MVP: O ciclo completo de entrada do cliente (Intake), diagnóstico, recomendação e acionamento",
      text: "No Slide 4, apresento a aderência aos conceitos fundamentais de MVP.\n\nUm erro comum em projetos de engenharia é tentar construir uma réplica monolítica de todo o setor elétrico. Na Milet, apliquei o fatiamento vertical: escolhi uma única jornada crítica de ponta a ponta e a implementei com qualidade de produção.\n\nO MVP não é um mockup de design sem código, nem exige sensores de telemetria caros nesta primeira fase. Em vez disso, foco no momento decisivo: o intake do consumidor com validação de dados, a geração automática do diagnóstico com motor tarifário e a entrega de um parecer claro e auditável.\n\nIsso valida a hipótese de valor com a menor complexidade de infraestrutura necessária."
    },
    5: {
      rubric: "Demonstração Prática",
      title: "Slide 5 — O MVP em Ação (Demonstração do Fluxo Core)",
      target: "120 segundos (03:30 - 05:30)",
      bullets: "• Demonstração prática do produto rodando em produção: Web App + PWA responsivo\n• Acesso em tempo real pela rota /app\n• Fluxo core: Dados de entrada -> Motor de Análise -> Diagnóstico Comparativo e Notificação",
      text: "Chegamos ao cerne técnico: a demonstração prática do MVP em execução.\n\n[O apresentador pode abrir a rota /app pelo link interativo no slide]\n\nA aplicação está publicada e em operação na nuvem. O fluxo é executado da seguinte forma:\n1. O usuário acessa a plataforma (seja pelo navegador desktop ou via PWA no celular);\n2. Informa sua concessionária, demanda contratada e consumo mensal médio;\n3. O motor de cálculo processa a simulação tarifária comparando o Mercado Regulado com as alternativas de ACL e GD;\n4. Em menos de 3 segundos, o sistema exibe o Diagnóstico Energético Milet, detalhando a sobra mensal estimada e a recomendação técnica de suprimento;\n5. Os dados são persistidos de forma transacional e o evento é despachado via mensageria para a equipe.\n\nAlém disso, com o Service Worker ativo, a aplicação possui resiliência offline para consulta mesmo em locais com instabilidade de rede."
    },
    6: {
      rubric: "Valor Agregado Imediato",
      title: "Slide 6 — Valor Agregado Imediato para o Usuário",
      target: "60 segundos (05:30 - 06:30)",
      bullets: "• O que o usuário obtém nos primeiros 60 segundos de uso\n• Economia quantificada em Reais por mês e por ano\n• Eliminação de intermediários: resposta categórica se a empresa é ou não elegível",
      text: "No Slide 6, destaco o Valor Agregado Imediato entregue ao tomador de decisão.\n\nTradicionalmente, uma PME gasta semanas trocando e-mails com intermediários para obter uma estimativa de economia. Com a Milet, esse valor é gerado em menos de um minuto:\n\nPrimeiro: Resposta de Elegibilidade. A empresa descobre na hora se seu perfil de tensão e demanda permite migração imediata ao Mercado Livre ou se a modalidade ideal é Geração Distribuída.\nSegundo: Quantificação Financeira Clara. O usuário vê a projeção em Reais da sobra mensal estimada (por exemplo, economia de R$ 2.307/mês em nosso caso-teste).\nTerceiro: Zero Fricção de Entrada. Sem cadastros invasivos ou burocracia desnecessária antes de entregar a primeira resposta de valor ao cliente."
    },
    7: {
      rubric: "Engenharia & Arquitetura",
      title: "Slide 7 — Arquitetura de Software & Decisões Técnicas",
      target: "70 segundos (06:30 - 07:40)",
      bullets: "• Engenharia de Computação: Frontend PWA + Backend Modular NestJS + Postgres Outbox\n• Resiliência arquitetural: Padrão Transactional Outbox para garantir consistência de eventos e notificações\n• Deploy serverless e edge na Vercel com observabilidade e métricas de latência",
      text: "No Slide 7, detalho a arquitetura técnica que sustenta o MVP sob os princípios de Engenharia de Computação.\n\nAdotei uma arquitetura desacoplada e modular:\n- Na camada cliente: PWA estático e responsivo com Service Worker para cache e funcionamento offline;\n- Na borda (Edge): Funções serverless na Vercel com sanitização de requisições e rate limiting preventivo;\n- No backend de aplicação: NestJS com contratos tipados e implementação do padrão Transactional Outbox, assegurando que nenhum registro de lead ou evento analítico seja perdido durante oscilações de infraestrutura;\n- Na persistência: Banco relacional PostgreSQL com migrações versionadas e estrutura auditável."
    },
    8: {
      rubric: "Visão de Futuro",
      title: "Slide 8 — Visão de Futuro & Roadmap de Engenharia",
      target: "50 segundos (07:40 - 08:30)",
      bullets: "• Próximas etapas técnicas: OCR automatizado de faturas em PDF via modelos multimodais de visão\n• Integração via APIs com a CCEE e distribuidoras (Open Energy)\n• Energy Autopilot: Agentes autônomos que monitoram tarifas e renegociam contratos sem atrito",
      text: "No Slide 8, apresento a Visão de Futuro e os próximos marcos de desenvolvimento.\n\nO MVP desenvolvido estabelece a base para o Energy Autopilot.\n\nNo roadmap de engenharia, estão previstos três passos estruturados:\n1. Intake Inteligente via Visão Computacional: Processamento direto do PDF da fatura para extração automatizada de grandezas elétricas e histórico de consumo;\n2. Conexão Regulada: Integração com plataformas de dados abertos da CCEE e concessionárias;\n3. Energy Autopilot: Agentes autônomos para monitoramento contínuo do PLD e bandeiras tarifárias, realizando ajustes contratuais de forma transparente para o consumidor."
    },
    9: {
      rubric: "Encerramento",
      title: "Slide 9 — Conclusão & Agradecimentos",
      target: "40 segundos (08:30 - 09:10)",
      bullets: "• Conclusão da apresentação do MVP Milet\n• Plataforma funcional com fundamentos de Engenharia de Computação consolidados\n• Abertura para arguição da banca",
      text: "Para concluir, a Milet consolida uma solução completa de engenharia de software para um problema concreto e de alto impacto no mercado de energia.\n\nO MVP demonstra funcionamento real, clareza de proposta e rigor arquitetural em todas as camadas implementadas.\n\nAgradeço a atenção do professor e fico à disposição para as perguntas e considerações da banca."
    }
  };

  function updateSlide(newSlide) {
    if (newSlide < 1 || newSlide > TOTAL_SLIDES) return;

    const slides = document.querySelectorAll('.slide');
    slides.forEach((s) => s.classList.remove('active'));

    const target = document.getElementById(`slide-${newSlide}`);
    if (target) {
      target.classList.add('active');
    }

    currentSlide = newSlide;

    const counter = document.getElementById('slide-counter');
    if (counter) {
      counter.textContent = `${String(currentSlide).padStart(2, '0')} / ${String(TOTAL_SLIDES).padStart(2, '0')}`;
    }

    const progressBar = document.getElementById('progress-bar-fill');
    if (progressBar) {
      const pct = ((currentSlide - 1) / (TOTAL_SLIDES - 1)) * 100;
      progressBar.style.width = `${pct}%`;
    }

    const btnPrev = document.getElementById('btn-prev');
    const btnNext = document.getElementById('btn-next');
    if (btnPrev) btnPrev.disabled = currentSlide === 1;
    if (btnNext) btnNext.disabled = currentSlide === TOTAL_SLIDES;

    updateSpeakerNotes(currentSlide);
  }

  function updateSpeakerNotes(slideNum) {
    const data = speakerNotesData[slideNum];
    if (!data) return;

    const titleEl = document.getElementById('notes-title');
    const rubricEl = document.getElementById('notes-rubric');
    const targetEl = document.getElementById('notes-target');
    const bulletsEl = document.getElementById('notes-bullets');
    const textEl = document.getElementById('notes-text');

    if (titleEl) titleEl.textContent = data.title;
    if (rubricEl) rubricEl.textContent = data.rubric;
    if (targetEl) targetEl.textContent = `Tempo: ${data.target}`;
    if (bulletsEl) bulletsEl.textContent = data.bullets;
    if (textEl) textEl.textContent = data.text;
  }

  function nextSlide() {
    if (currentSlide < TOTAL_SLIDES) {
      updateSlide(currentSlide + 1);
    }
  }

  function prevSlide() {
    if (currentSlide > 1) {
      updateSlide(currentSlide - 1);
    }
  }

  function startTimer() {
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      if (!isTimerRunning) return;
      timerSeconds++;
      updateTimerDisplay();
    }, 1000);
  }

  function updateTimerDisplay() {
    const timerDisplay = document.getElementById('timer-display');
    if (!timerDisplay) return;

    const mins = Math.floor(timerSeconds / 60);
    const secs = timerSeconds % 60;
    timerDisplay.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

    if (timerSeconds > TARGET_TIME_SECONDS) {
      timerDisplay.parentElement.classList.add('overtime');
    } else {
      timerDisplay.parentElement.classList.remove('overtime');
    }
  }

  function toggleTimer() {
    isTimerRunning = !isTimerRunning;
    const badge = document.querySelector('.hud-timer-badge');
    if (badge) {
      badge.style.opacity = isTimerRunning ? '1' : '0.5';
    }
  }

  function resetTimer() {
    timerSeconds = 0;
    updateTimerDisplay();
    isTimerRunning = true;
    const badge = document.querySelector('.hud-timer-badge');
    if (badge) badge.style.opacity = '1';
  }

  function toggleNotes() {
    const drawer = document.getElementById('speaker-notes-drawer');
    const btn = document.getElementById('btn-notes');
    if (!drawer) return;

    isNotesOpen = !isNotesOpen;
    if (isNotesOpen) {
      drawer.classList.add('open');
      if (btn) btn.classList.add('active');
    } else {
      drawer.classList.remove('open');
      if (btn) btn.classList.remove('active');
    }
  }

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.warn('Erro ao entrar em fullscreen:', err);
      });
    } else {
      document.exitFullscreen().catch((err) => {
        console.warn('Erro ao sair de fullscreen:', err);
      });
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
        updateSlide(1);
        break;
      case 'End':
        e.preventDefault();
        updateSlide(TOTAL_SLIDES);
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
      case '1':
      case '2':
      case '3':
      case '4':
      case '5':
      case '6':
      case '7':
      case '8':
      case '9':
        const target = parseInt(e.key, 10);
        if (target >= 1 && target <= TOTAL_SLIDES) {
          e.preventDefault();
          updateSlide(target);
        }
        break;
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    updateSlide(1);
    startTimer();

    const btnPrev = document.getElementById('btn-prev');
    const btnNext = document.getElementById('btn-next');
    const btnNotes = document.getElementById('btn-notes');
    const btnCloseNotes = document.getElementById('btn-close-notes');
    const btnFullscreen = document.getElementById('btn-fullscreen');
    const btnPrint = document.getElementById('btn-print');
    const timerBadge = document.querySelector('.hud-timer-badge');

    if (btnPrev) btnPrev.addEventListener('click', prevSlide);
    if (btnNext) btnNext.addEventListener('click', nextSlide);
    if (btnNotes) btnNotes.addEventListener('click', toggleNotes);
    if (btnCloseNotes) btnCloseNotes.addEventListener('click', toggleNotes);
    if (btnFullscreen) btnFullscreen.addEventListener('click', toggleFullscreen);
    if (btnPrint) {
      btnPrint.addEventListener('click', () => {
        window.print();
      });
    }
    if (timerBadge) timerBadge.addEventListener('click', toggleTimer);

    document.addEventListener('keydown', handleKeydown);

    let touchStartX = 0;
    let touchStartY = 0;
    document.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    document.addEventListener('touchend', (e) => {
      const diffX = e.changedTouches[0].screenX - touchStartX;
      const diffY = e.changedTouches[0].screenY - touchStartY;
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
        if (diffX < 0) nextSlide();
        else prevSlide();
      }
    }, { passive: true });
  });
})();
