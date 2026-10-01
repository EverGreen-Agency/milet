/**
 * MILET — ENGINE DA APRESENTAÇÃO WEB LIMPA (SEM NOTAS)
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

  const slides = document.querySelectorAll('.slide');
  const deckContainer = document.getElementById('deck-container');
  const slideCounter = document.getElementById('slide-counter');
  const progressBar = document.getElementById('progress-bar-fill');
  const btnPrev = document.getElementById('btn-prev');
  const btnNext = document.getElementById('btn-next');
  const btnFullscreen = document.getElementById('btn-fullscreen');
  const btnPrint = document.getElementById('btn-print');
  const timerDisplay = document.getElementById('timer-display');

  function resizeDeck() {
    if (!deckContainer) return;
    deckContainer.style.width = '100%';
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

    try {
      sessionStorage.setItem('milet_empreendedores_slide', currentSlide);
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
