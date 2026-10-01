const MOTION_STAGES = [
  {
    title: 'Traço elétrico inicial',
    description: 'A centelha original atravessa o espaço e inaugura o percurso da marca.',
    principle: 'Energia em estado puro',
    duration: 1800,
    src: 'assets/web/motion-lab-stage-01.webp',
    alt: 'Traço elétrico inicial'
  },
  {
    title: 'Oscilação senoidal AC',
    description: 'A corrente ganha ritmo e frequência. O impulso isolado começa a se tornar sistema.',
    principle: 'Movimento contínuo',
    duration: 1800,
    src: 'assets/web/motion-lab-stage-02.webp',
    alt: 'Oscilação senoidal de corrente alternada'
  },
  {
    title: 'Wireframe estrutural',
    description: 'As ondas se encontram em três vértices e revelam a arquitetura essencial do símbolo.',
    principle: 'Precisão que organiza',
    duration: 2000,
    src: 'assets/web/motion-lab-stage-03.webp',
    alt: 'Wireframe triangular em construção'
  },
  {
    title: 'Circuito de continuidade',
    description: 'O traço se estabiliza em um circuito fechado, contínuo e sem início aparente.',
    principle: 'Conexão sem ruptura',
    duration: 1900,
    src: 'assets/web/motion-lab-stage-04.webp',
    alt: 'Circuito triangular fechado'
  },
  {
    title: 'Volume e torção Möbius',
    description: 'A linha recebe matéria, profundidade e uma torção orgânica que transforma fluxo em presença.',
    principle: 'Matéria em transformação',
    duration: 2200,
    src: 'assets/web/motion-lab-stage-05.webp',
    alt: 'Volume de âmbar em torção Möbius'
  },
  {
    title: 'Símbolo vivo de âmbar',
    description: 'Luz, volume e continuidade convergem na assinatura final da Milet: sólida, elegante e viva.',
    principle: 'Liberdade em forma de marca',
    duration: 2600,
    src: 'assets/web/motion-lab-stage-06.webp',
    alt: 'Símbolo Milet vivo em âmbar'
  }
];

document.addEventListener('DOMContentLoaded', () => {
  const viewport = document.getElementById('motionViewport');
  const frames = [document.getElementById('motionFrameA'), document.getElementById('motionFrameB')];
  const badge = document.getElementById('stageBadge');
  const durationLabel = document.getElementById('stageDuration');
  const title = document.getElementById('stageTitle');
  const description = document.getElementById('stageDescription');
  const principle = document.getElementById('stagePrinciple');
  const timecode = document.getElementById('timecodeCurrent');
  const timelineButtons = [...document.querySelectorAll('.timeline-step')];
  const scrubber = document.getElementById('motionScrubber');
  const prevButton = document.getElementById('motionPrev');
  const nextButton = document.getElementById('motionNext');
  const playButton = document.getElementById('motionPlay');
  const playIcon = playButton.querySelector('.play-icon');
  const playLabel = playButton.querySelector('.play-label');
  const speedSelect = document.getElementById('motionSpeed');
  const loopButton = document.getElementById('motionLoop');
  const dialog = document.getElementById('storyboardDialog');
  const openDialogButton = document.getElementById('storyboardOpen');
  const closeDialogButton = document.getElementById('storyboardClose');

  let currentStage = 0;
  let activeFrame = 0;
  let isPlaying = false;
  let loopEnabled = true;
  let playbackTimer = null;
  let progressFrame = null;
  let stageStartedAt = 0;

  MOTION_STAGES.slice(1).forEach(stage => {
    const image = new Image();
    image.src = stage.src;
  });

  function formatTime(milliseconds) {
    const seconds = milliseconds / 1000;
    return `00:${seconds.toFixed(1).padStart(4, '0')}`;
  }

  function updatePlaybackButton() {
    playButton.setAttribute('aria-pressed', String(isPlaying));
    playIcon.textContent = isPlaying ? 'Ⅱ' : '▶';
    playLabel.textContent = isPlaying ? 'Pausar' : 'Reproduzir';
  }

  function updateTimecode() {
    if (!isPlaying) return;
    const speed = Number(speedSelect.value);
    const elapsed = Math.min((performance.now() - stageStartedAt) * speed, MOTION_STAGES[currentStage].duration);
    timecode.textContent = formatTime(elapsed);
    progressFrame = requestAnimationFrame(updateTimecode);
  }

  function stopProgressClock() {
    if (progressFrame) cancelAnimationFrame(progressFrame);
    progressFrame = null;
  }

  function renderStage(index, { animate = true } = {}) {
    const stage = MOTION_STAGES[index];
    const nextFrame = animate ? 1 - activeFrame : activeFrame;
    const incoming = frames[nextFrame];
    const outgoing = frames[activeFrame];

    incoming.src = stage.src;
    incoming.alt = stage.alt;

    if (animate && index !== currentStage) {
      viewport.classList.remove('is-transitioning');
      void viewport.offsetWidth;
      viewport.classList.add('is-transitioning');
      incoming.classList.add('is-active');
      outgoing.classList.remove('is-active');
      activeFrame = nextFrame;
    } else {
      frames.forEach((frame, frameIndex) => frame.classList.toggle('is-active', frameIndex === activeFrame));
    }

    currentStage = index;
    badge.textContent = `ETAPA ${String(index + 1).padStart(2, '0')} / 06`;
    durationLabel.textContent = `${(stage.duration / 1000).toFixed(1).replace('.', ',')}s`;
    title.textContent = stage.title;
    description.textContent = stage.description;
    principle.textContent = stage.principle;
    scrubber.value = String(index);
    timecode.textContent = '00:00.0';

    timelineButtons.forEach((button, buttonIndex) => {
      const active = buttonIndex === index;
      button.classList.toggle('is-active', active);
      if (active) button.setAttribute('aria-current', 'step');
      else button.removeAttribute('aria-current');
    });
  }

  function scheduleNextStage() {
    clearTimeout(playbackTimer);
    stopProgressClock();
    if (!isPlaying) return;

    const speed = Number(speedSelect.value);
    const duration = MOTION_STAGES[currentStage].duration / speed;
    stageStartedAt = performance.now();
    updateTimecode();

    playbackTimer = setTimeout(() => {
      const atLastStage = currentStage === MOTION_STAGES.length - 1;
      if (atLastStage && !loopEnabled) {
        pause();
        return;
      }
      renderStage(atLastStage ? 0 : currentStage + 1);
      scheduleNextStage();
    }, duration);
  }

  function play() {
    if (isPlaying) return;
    isPlaying = true;
    updatePlaybackButton();
    scheduleNextStage();
  }

  function pause() {
    isPlaying = false;
    clearTimeout(playbackTimer);
    stopProgressClock();
    updatePlaybackButton();
  }

  function togglePlayback() {
    if (isPlaying) pause();
    else play();
  }

  function goToStage(index) {
    const normalized = (index + MOTION_STAGES.length) % MOTION_STAGES.length;
    renderStage(normalized);
    if (isPlaying) scheduleNextStage();
  }

  playButton.addEventListener('click', togglePlayback);
  prevButton.addEventListener('click', () => goToStage(currentStage - 1));
  nextButton.addEventListener('click', () => goToStage(currentStage + 1));
  timelineButtons.forEach(button => button.addEventListener('click', () => goToStage(Number(button.dataset.stage))));
  scrubber.addEventListener('input', event => goToStage(Number(event.target.value)));
  speedSelect.addEventListener('change', () => {
    if (isPlaying) scheduleNextStage();
  });
  loopButton.addEventListener('click', () => {
    loopEnabled = !loopEnabled;
    loopButton.classList.toggle('is-active', loopEnabled);
    loopButton.setAttribute('aria-pressed', String(loopEnabled));
    loopButton.textContent = loopEnabled ? 'Loop ativo' : 'Loop desligado';
  });

  document.addEventListener('keydown', event => {
    if (event.target.matches('input, select, button')) return;
    if (event.key === 'ArrowLeft') goToStage(currentStage - 1);
    if (event.key === 'ArrowRight') goToStage(currentStage + 1);
    if (event.code === 'Space') {
      event.preventDefault();
      togglePlayback();
    }
  });

  openDialogButton.addEventListener('click', () => dialog.showModal());
  closeDialogButton.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target === dialog) dialog.close();
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden && isPlaying) pause();
  });

  renderStage(0, { animate: false });
  updatePlaybackButton();
});
