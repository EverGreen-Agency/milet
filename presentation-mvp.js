/**
 * MILET — ENGINE DA APRESENTAÇÃO WEB LIMPA (SEM NOTAS)
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
      slideCounter.textContent = `${paddedCurrent} / 09`;
    }

    if (progressBar) {
      const progressPercent = ((currentSlide - 1) / (TOTAL_SLIDES - 1)) * 100;
      progressBar.style.width = `${progressPercent}%`;
    }

    if (btnPrev) btnPrev.disabled = currentSlide === 1;
    if (btnNext) btnNext.disabled = currentSlide === TOTAL_SLIDES;

    try {
      history.replaceState(null, '', `#slide-${currentSlide}`);
    } catch (_) {}
  }

  function nextSlide() {
    if (currentSlide < TOTAL_SLIDES) showSlide(currentSlide + 1);
  }

  function prevSlide() {
    if (currentSlide > 1) showSlide(currentSlide - 1);
  }

  function initTimer() {
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      if (!isTimerRunning) return;
      timerSeconds++;
      updateTimerDisplay();
    }, 1000);
  }

  function updateTimerDisplay() {
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

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.warn('Erro ao entrar em tela cheia:', err);
      });
    } else {
      document.exitFullscreen().catch((err) => {
        console.warn('Erro ao sair de tela cheia:', err);
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
          showSlide(target);
        }
        break;
    }
  }

  function parseHash() {
    const hash = window.location.hash;
    const match = hash.match(/#slide-(\d+)/);
    if (match) {
      const slideNum = parseInt(match[1], 10);
      if (slideNum >= 1 && slideNum <= TOTAL_SLIDES) {
        return slideNum;
      }
    }
    return 1;
  }

  document.addEventListener('DOMContentLoaded', () => {
    resizeDeck();
    window.addEventListener('resize', resizeDeck);

    const initial = parseHash();
    showSlide(initial);

    initTimer();

    if (btnPrev) btnPrev.addEventListener('click', prevSlide);
    if (btnNext) btnNext.addEventListener('click', nextSlide);
    if (btnFullscreen) btnFullscreen.addEventListener('click', toggleFullscreen);
    if (btnPrint) {
      btnPrint.addEventListener('click', () => {
        window.print();
      });
    }

    const timerBadge = document.querySelector('.hud-timer-badge');
    if (timerBadge) {
      timerBadge.addEventListener('click', toggleTimer);
    }

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
