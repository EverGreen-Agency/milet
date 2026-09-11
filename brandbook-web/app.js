/**
 * Milet Brandbook & Design System - Interactive Engine
 * Motion Frame a Frame (Painel 11), Favicon/Squircle Switcher,
 * Master Logo Viewer, 8-Slide Responsive Slider, and GSAP ScrollTrigger Animations.
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initFaviconAutoListener();
  initNavigation();
  initLightboxKeyHandler();
  initLogoViewer();
  initFaviconsSwitcher();
  initEnergySimulator();
  initBrandSlider();
  initFrameByFrameMotion();
  initGsapScrollAnimations();
});

// -------------------------------------------------------------
// 1. Toast Notification System
// -------------------------------------------------------------
function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 2500);
}

// -------------------------------------------------------------
// 2. Theme Toggle & Dynamic Favicon Synchronization
// -------------------------------------------------------------
function updateSiteFavicon(styleKey) {
  const favLink = document.getElementById('siteFavicon');
  if (!favLink) return;

  let target = '../assets/logo/png/solid/favicon-light-32x32.png';
  if (styleKey === 'dark') {
    target = '../assets/logo/png/solid/favicon-dark-32x32.png';
  } else if (styleKey === 'light') {
    target = '../assets/logo/png/solid/favicon-light-32x32.png';
  } else if (styleKey === 'glow') {
    target = '../assets/logo/png/solid/milet-app-icon-glow-32x32.png';
  } else {
    // Sincroniza dinamicamente com o tema ativo
    const isDark = document.body.classList.contains('theme-dark');
    target = isDark
      ? '../assets/logo/png/solid/favicon-dark-32x32.png'
      : '../assets/logo/png/solid/favicon-light-32x32.png';
  }
  favLink.href = target;
}

function initFaviconAutoListener() {
  updateSiteFavicon();

  // Ouvir mudanca de tema nativo do sistema operacional/navegador
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      updateSiteFavicon(e.matches ? 'dark' : 'light');
    });
  }
}

function initThemeToggle() {
  const btn = document.getElementById('themeToggleBtn');
  if (!btn) return;

  btn.addEventListener('click', () => {
    if (document.body.classList.contains('theme-light')) {
      document.body.classList.replace('theme-light', 'theme-dark');
      showToast('Tema Escuro Ativado');
      updateSiteFavicon('dark');
    } else {
      document.body.classList.replace('theme-dark', 'theme-light');
      showToast('Tema Claro Ativado');
      updateSiteFavicon('light');
    }
  });
}

// -------------------------------------------------------------
// 3. Navigation System (Dropdowns & Chapters Drawer)
// -------------------------------------------------------------
window.openChaptersDrawer = function() {
  const drawer = document.getElementById('chaptersDrawer');
  const backdrop = document.getElementById('chaptersDrawerBackdrop');
  if (drawer) drawer.classList.add('open');
  if (backdrop) backdrop.classList.add('active');
  document.body.style.overflow = 'hidden';
};

window.closeChaptersDrawer = function() {
  const drawer = document.getElementById('chaptersDrawer');
  const backdrop = document.getElementById('chaptersDrawerBackdrop');
  if (drawer) drawer.classList.remove('open');
  if (backdrop) backdrop.classList.remove('active');
  document.body.style.overflow = '';
};

window.toggleDrawer = function(forceOpen) {
  const drawer = document.getElementById('chaptersDrawer');
  if (!drawer) return;
  if (forceOpen || !drawer.classList.contains('open')) {
    openChaptersDrawer();
  } else {
    closeChaptersDrawer();
  }
};

function initNavigation() {
  const btnChapters = document.getElementById('openChaptersBtn');
  const btnMobile = document.getElementById('mobileMenuBtn');

  if (btnChapters) {
    btnChapters.addEventListener('click', () => openChaptersDrawer());
  }
  if (btnMobile) {
    btnMobile.addEventListener('click', () => openChaptersDrawer());
  }

  // Dropdown touch/click toggle for touch screens
  const dropdownItems = document.querySelectorAll('.nav-dropdown-item');
  dropdownItems.forEach(item => {
    const trigger = item.querySelector('.nav-dropdown-trigger');
    if (trigger) {
      trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = item.classList.contains('open');
        dropdownItems.forEach(other => {
          if (other !== item) other.classList.remove('open');
        });
        item.classList.toggle('open', !isOpen);
      });
    }
  });

  // Fechar dropdowns ao clicar fora
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-dropdown-item')) {
      dropdownItems.forEach(item => item.classList.remove('open'));
    }
  });

  // Fechar drawer com tecla Esc
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeChaptersDrawer();
    }
  });
}

// -------------------------------------------------------------
// 4. Dynamic Lightbox Modal (Zoom & High-Resolution Inspection)
// -------------------------------------------------------------
window.openLightbox = function(src, title, tag) {
  const modal = document.getElementById('lightboxModal');
  const img = document.getElementById('lightboxImg');
  const titleEl = document.getElementById('lightboxTitle');
  const tagEl = document.getElementById('lightboxTag');

  if (src && img) img.src = src;
  if (title && titleEl) titleEl.textContent = title;
  if (tag && tagEl) tagEl.textContent = tag;

  if (modal) {
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
};

window.closeLightbox = function() {
  const modal = document.getElementById('lightboxModal');
  if (modal) {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
};

function initLightboxKeyHandler() {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeLightbox();
    }
  });
}

// -------------------------------------------------------------
// 4.1 Hero Visual Switcher (Slide 02 Âmbar Polido vs Imagem 04 Website)
// -------------------------------------------------------------
let currentHeroView = 'sculpture';

const HERO_DATA = {
  sculpture: {
    src: '../assets/imagery/milet-hero-rocha-ambar-polida.png',
    tag: 'SÍMBOLO VIVO • ESCULTURA DE ÂMBAR & LUZ',
    desc: 'A resina fóssil polida sobre o basalto de Mileto ao nascer do sol, simbolizando a fusão entre a centelha ancestral e a inteligência moderna.',
    title: 'Âmbar Polido sobre Basalto Vulcânico (Slide 02 Canônico)'
  },
  mockup: {
    src: '../assets/imagery/milet-mockup-website-laptop.png',
    tag: 'WEBSITE CANÔNICO • 01 PÁGINA PRINCIPAL',
    desc: 'Composição de ponta em laptop luxury: "Tecnologia que liberta o amanhã" com tipografia editorial Playfair Display e CTAs canônicos.',
    title: 'Milet — Website Principal em Laptop (Painel 01)'
  }
};

function initHeroVisualToggle() {
  const btnSculpture = document.getElementById('heroSwitchSculptureBtn');
  const btnMockup = document.getElementById('heroSwitchMockupBtn');
  const heroImg = document.getElementById('heroActiveImg');
  const badge = document.getElementById('sculptureHeroBadge');
  const tagEl = document.getElementById('heroCaptionTag');
  const descEl = document.getElementById('heroCaptionDesc');

  if (!btnSculpture || !btnMockup || !heroImg) return;

  function switchHero(viewKey) {
    if (currentHeroView === viewKey) return;
    currentHeroView = viewKey;

    btnSculpture.classList.toggle('active', viewKey === 'sculpture');
    btnMockup.classList.toggle('active', viewKey === 'mockup');

    heroImg.style.opacity = '0.25';
    heroImg.style.transform = 'scale(0.97)';

    setTimeout(() => {
      const data = HERO_DATA[viewKey];
      heroImg.src = data.src;
      if (tagEl) tagEl.textContent = data.tag;
      if (descEl) descEl.textContent = data.desc;
      if (badge) {
        badge.style.display = viewKey === 'sculpture' ? 'flex' : 'none';
      }

      heroImg.style.opacity = '1';
      heroImg.style.transform = 'scale(1)';
    }, 140);
  }

  btnSculpture.addEventListener('click', () => switchHero('sculpture'));
  btnMockup.addEventListener('click', () => switchHero('mockup'));
}

window.openActiveHeroLightbox = function() {
  const data = HERO_DATA[currentHeroView] || HERO_DATA.sculpture;
  openLightbox(data.src, data.title, data.tag);
};

// -------------------------------------------------------------
// 5. Interactive Logo Viewer Matrix (Refined Master Assets)
// -------------------------------------------------------------
const LOGO_MATRIX = {
  primary: {
    light: {
      displayImg: '../assets/logo/png/transparent/milet-logo-vertical-dark.png',
      svg: '../assets/logo/svg/milet-logo-primary-dark.svg',
      pngTrans: '../assets/logo/png/transparent/milet-logo-vertical-dark.png',
      pngSolid: '../assets/logo/png/solid/milet-logo-vertical-marfim.png',
      filename: 'milet-logo-vertical-dark.png',
      desc: 'Logo Principal Vertical • Fundo Marfim (#F7F3EA) • Versão Refinada',
      stageClass: 'stage-light'
    },
    dark: {
      displayImg: '../assets/logo/png/transparent/milet-logo-vertical-light.png',
      svg: '../assets/logo/svg/milet-logo-primary-light.svg',
      pngTrans: '../assets/logo/png/transparent/milet-logo-vertical-light.png',
      pngSolid: '../assets/logo/png/solid/milet-logo-vertical-carvao.png',
      filename: 'milet-logo-vertical-light.png',
      desc: 'Logo Principal Vertical • Fundo Carvão (#1A1A1A) • Versão Refinada',
      stageClass: 'stage-dark'
    },
    mono: {
      displayImg: '../assets/logo/png/transparent/milet-logo-vertical-mono-black.png',
      svg: '../assets/logo/svg/milet-logo-primary-mono-black.svg',
      pngTrans: '../assets/logo/png/transparent/milet-logo-vertical-mono-black.png',
      pngSolid: '../assets/logo/png/solid/milet-logo-vertical-marfim.png',
      filename: 'milet-logo-vertical-mono-black.png',
      desc: 'Logo Principal Monocromático • Preto 100%',
      stageClass: 'stage-mono-black'
    }
  },
  horizontal: {
    light: {
      displayImg: '../assets/logo/png/transparent/milet-logo-horizontal-dark.png',
      svg: '../assets/logo/svg/milet-logo-horizontal-dark.svg',
      pngTrans: '../assets/logo/png/transparent/milet-logo-horizontal-dark.png',
      pngSolid: '../assets/logo/png/solid/milet-logo-horizontal-marfim.png',
      filename: 'milet-logo-horizontal-dark.png',
      desc: 'Logo Horizontal • Fundo Marfim (#F7F3EA) • Versão Refinada',
      stageClass: 'stage-light'
    },
    dark: {
      displayImg: '../assets/logo/png/transparent/milet-logo-horizontal-light.png',
      svg: '../assets/logo/svg/milet-logo-horizontal-light.svg',
      pngTrans: '../assets/logo/png/transparent/milet-logo-horizontal-light.png',
      pngSolid: '../assets/logo/png/solid/milet-logo-horizontal-carvao.png',
      filename: 'milet-logo-horizontal-light.png',
      desc: 'Logo Horizontal • Fundo Carvão (#1A1A1A) • Versão Refinada',
      stageClass: 'stage-dark'
    },
    mono: {
      displayImg: '../assets/logo/png/transparent/milet-logo-horizontal-mono-black.png',
      svg: '../assets/logo/svg/milet-logo-horizontal-mono-black.svg',
      pngTrans: '../assets/logo/png/transparent/milet-logo-horizontal-mono-black.png',
      pngSolid: '../assets/logo/png/solid/milet-logo-horizontal-marfim.png',
      filename: 'milet-logo-horizontal-mono-black.png',
      desc: 'Logo Horizontal Monocromático • Preto 100%',
      stageClass: 'stage-mono-black'
    }
  },
  symbol: {
    light: {
      displayImg: '../assets/logo/png/transparent/milet-symbol-amber.png',
      svg: '../assets/logo/svg/milet-symbol-amber.svg',
      pngTrans: '../assets/logo/png/transparent/milet-symbol-amber.png',
      pngSolid: '../assets/logo/png/solid/milet-symbol-marfim.png',
      filename: 'milet-symbol-amber.png',
      desc: 'Símbolo Möbius Isolado • Fundo Marfim • Versão Refinada',
      stageClass: 'stage-light'
    },
    dark: {
      displayImg: '../assets/logo/png/transparent/milet-symbol-amber.png',
      svg: '../assets/logo/svg/milet-symbol-amber.svg',
      pngTrans: '../assets/logo/png/transparent/milet-symbol-amber.png',
      pngSolid: '../assets/logo/png/solid/milet-symbol-carvao.png',
      filename: 'milet-symbol-amber.png',
      desc: 'Símbolo Möbius Isolado • Fundo Carvão • Versão Refinada',
      stageClass: 'stage-dark'
    },
    mono: {
      displayImg: '../assets/logo/png/transparent/milet-symbol-white.png',
      svg: '../assets/logo/svg/milet-symbol-mono-white.svg',
      pngTrans: '../assets/logo/png/transparent/milet-symbol-white.png',
      pngSolid: '../assets/logo/png/solid/milet-symbol-carvao.png',
      filename: 'milet-symbol-white.png',
      desc: 'Símbolo Monocromático • Branco 100%',
      stageClass: 'stage-mono-black'
    }
  }
};

let currentVariant = 'primary';
let currentBg = 'light';

function initLogoViewer() {
  const stage = document.getElementById('logoDisplayStage');
  const img = document.getElementById('logoStageImage');
  const specFilename = document.getElementById('stageSpecFilename');
  const specFormat = document.getElementById('stageSpecFormat');
  const dlSvg = document.getElementById('dlSvgLink');
  const dlPngTrans = document.getElementById('dlPngTransLink');
  const dlPngSolid = document.getElementById('dlPngSolidLink');

  if (!stage || !img) return;

  function updateView() {
    const config = LOGO_MATRIX[currentVariant][currentBg];
    img.style.transform = 'scale(0.96)';
    img.style.opacity = '0.3';

    setTimeout(() => {
      img.src = config.displayImg;
      if (specFilename) specFilename.textContent = config.filename;
      if (specFormat) specFormat.textContent = config.desc;

      if (dlSvg) dlSvg.href = config.svg;
      if (dlPngTrans) dlPngTrans.href = config.pngTrans;
      if (dlPngSolid) dlPngSolid.href = config.pngSolid;

      stage.className = 'logo-display-stage ' + config.stageClass;
      img.style.transform = 'scale(1)';
      img.style.opacity = '1';
    }, 120);
  }

  // Variant Buttons
  document.querySelectorAll('.viewer-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.viewer-btn').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      currentVariant = e.target.dataset.variant;
      updateView();
    });
  });

  // Background Buttons
  document.querySelectorAll('.viewer-bg-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.viewer-bg-btn').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      currentBg = e.target.dataset.bg;
      updateView();
    });
  });
}

// -------------------------------------------------------------
// 6. One-Click Copy Color HEX & Icon SVG
// -------------------------------------------------------------
window.copyColorHex = function(hexCode) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(hexCode).then(() => {
      showToast(`Cor copiada: ${hexCode}`);
    }).catch(() => {
      showToast(`Código: ${hexCode}`);
    });
  } else {
    showToast(`Código: ${hexCode}`);
  }
};

window.copyIconSvg = function(iconName) {
  fetch(`../assets/icons/${iconName}.svg`)
    .then(res => res.text())
    .then(svgText => {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(svgText);
        showToast(`SVG de "${iconName}" copiado!`);
      } else {
        showToast(`Ícone: ${iconName}.svg`);
      }
    })
    .catch(() => {
      showToast(`Ícone: ${iconName}.svg`);
    });
};

// -------------------------------------------------------------
// 7. Favicon & App Icon Switcher (Painel 13)
// -------------------------------------------------------------
function initFaviconsSwitcher() {
  const buttons = document.querySelectorAll('.favicon-style-btn');
  const heroImg = document.getElementById('masterAppIconImg');
  const heroTitle = document.getElementById('appIconTitle');
  const dlMaster = document.getElementById('dlIconMasterBtn');
  const gridItems = document.querySelectorAll('.resolutions-grid .res-item');

  if (!buttons.length || !heroImg) return;

  const STYLES_DATA = {
    dark: {
      src: '../assets/logo/png/solid/milet-app-icon-squircle-dark.png',
      title: 'Milet App Icon — Dark Carvão',
      dl: '../assets/logo/png/solid/milet-app-icon-dark-1024x1024.png'
    },
    light: {
      src: '../assets/logo/png/solid/milet-app-icon-squircle-light.png',
      title: 'Milet App Icon — Light Marfim',
      dl: '../assets/logo/png/solid/milet-app-icon-light-1024x1024.png'
    },
    glow: {
      src: '../assets/logo/png/solid/milet-app-icon-squircle-gold-glow.png',
      title: 'Milet App Icon — Gold Glow Âmbar',
      dl: '../assets/logo/png/solid/milet-app-icon-glow-1024x1024.png'
    }
  };

  buttons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const styleKey = e.target.dataset.iconStyle;
      if (!styleKey || !STYLES_DATA[styleKey]) return;

      buttons.forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');

      // 1. Fade no ícone master
      heroImg.style.opacity = '0.3';
      heroImg.style.transform = 'scale(0.95)';

      // 2. Fade na grade dimensional de resoluções
      gridItems.forEach(item => {
        const thumb = item.querySelector('.res-thumb-icon');
        if (thumb) thumb.style.opacity = '0.3';
      });

      setTimeout(() => {
        const item = STYLES_DATA[styleKey];
        heroImg.src = item.src;
        if (heroTitle) heroTitle.textContent = item.title;
        if (dlMaster) dlMaster.href = item.dl;

        heroImg.style.opacity = '1';
        heroImg.style.transform = 'scale(1)';

        // 3. Atualiza todos os 7 tamanhos da grade dimensional
        gridItems.forEach(gridItem => {
          const size = gridItem.dataset.resSize;
          const thumb = gridItem.querySelector('.res-thumb-icon');
          const dlLink = gridItem.querySelector('.res-dl-link');
          if (size && thumb && dlLink) {
            const assetPath = `../assets/logo/png/solid/milet-app-icon-${styleKey}-${size}x${size}.png`;
            thumb.src = assetPath;
            dlLink.href = assetPath;
            thumb.style.opacity = '1';
          }
        });

        // 4. Sincroniza o favicon dinâmico do navegador na aba
        updateSiteFavicon(styleKey);
      }, 140);
    });
  });
}

// -------------------------------------------------------------
// 8. Interactive Energy Slider & Dynamic Wave Simulator
// -------------------------------------------------------------
function initEnergySimulator() {
  const slider = document.getElementById('energySlider');
  const sliderDisplay = document.getElementById('sliderValueDisplay');
  const metricPercent = document.getElementById('metricPercent');
  const chartLine = document.getElementById('chartLine');
  const chartArea = document.getElementById('chartArea');

  if (!slider || !chartLine || !chartArea) return;

  slider.addEventListener('input', (e) => {
    const val = parseInt(e.target.value, 10);
    if (sliderDisplay) sliderDisplay.textContent = `${val}% Livre`;

    const eqPercent = Math.round((val - 50) * 0.9 + 15);
    if (metricPercent) {
      metricPercent.textContent = (eqPercent >= 0 ? `+ ${eqPercent}%` : `- ${Math.abs(eqPercent)}%`);
    }

    // Dynamically recompute Bezier wave curve
    const amp = 80 - (val * 0.5);
    const dLine = `M 0 ${70 + amp * 0.3} Q 50 ${amp} 100 ${65} T 200 ${amp + 5} T 300 ${75} T 400 ${amp - 10}`;
    const dArea = `${dLine} L 400 120 L 0 120 Z`;

    chartLine.setAttribute('d', dLine);
    chartArea.setAttribute('d', dArea);
  });
}

// -------------------------------------------------------------
// 9. Universo Visual - Interactive Carousel Slider (8 Slides)
// -------------------------------------------------------------
function initBrandSlider() {
  const track = document.getElementById('sliderTrack');
  const slides = document.querySelectorAll('.slide-item');
  const dots = document.querySelectorAll('.slider-dot');
  const prevBtn = document.getElementById('sliderPrevBtn');
  const nextBtn = document.getElementById('sliderNextBtn');
  const counter = document.getElementById('sliderCounter');

  if (!track || slides.length === 0) return;

  let currentSlide = 0;
  const totalSlides = slides.length;
  let autoplayTimer = null;

  function updateSlider(index) {
    if (index < 0) index = totalSlides - 1;
    if (index >= totalSlides) index = 0;
    currentSlide = index;

    track.style.transform = `translateX(-${currentSlide * 100}%)`;

    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === currentSlide);
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentSlide);
    });

    if (counter) {
      const curStr = String(currentSlide + 1).padStart(2, '0');
      const totStr = String(totalSlides).padStart(2, '0');
      counter.textContent = `${curStr} / ${totStr}`;
    }
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      updateSlider(currentSlide - 1);
      resetAutoplay();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      updateSlider(currentSlide + 1);
      resetAutoplay();
    });
  }

  dots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      const idx = parseInt(e.target.dataset.index, 10);
      if (!isNaN(idx)) {
        updateSlider(idx);
        resetAutoplay();
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    const rect = track.getBoundingClientRect();
    const visible = rect.top < window.innerHeight && rect.bottom > 0;
    if (!visible) return;

    if (e.key === 'ArrowLeft') {
      updateSlider(currentSlide - 1);
      resetAutoplay();
    } else if (e.key === 'ArrowRight') {
      updateSlider(currentSlide + 1);
      resetAutoplay();
    }
  });

  let touchStartX = 0;
  track.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      updateSlider(diff > 0 ? currentSlide + 1 : currentSlide - 1);
      resetAutoplay();
    }
  }, { passive: true });

  function startAutoplay() {
    autoplayTimer = setInterval(() => {
      updateSlider(currentSlide + 1);
    }, 6500);
  }

  function resetAutoplay() {
    clearInterval(autoplayTimer);
    startAutoplay();
  }

  const container = document.querySelector('.brand-slider-container');
  if (container) {
    container.addEventListener('mouseenter', () => clearInterval(autoplayTimer));
    container.addEventListener('mouseleave', () => startAutoplay());
  }

  startAutoplay();
}

// -------------------------------------------------------------
// 10. Frame a Frame Motion Sequencer (Painel 11 Canônico)
// -------------------------------------------------------------
function initFrameByFrameMotion() {
  const activeImg = document.getElementById('activeStageImg');
  const badgeEl = document.getElementById('stagePhaseBadge');
  const titleEl = document.getElementById('stagePhaseTitle');
  const descEl = document.getElementById('stagePhaseDesc');
  const pills = document.querySelectorAll('.stage-pill-btn');
  const scrubber = document.getElementById('stageScrubber');
  const playBtn = document.getElementById('stagePlayBtn');
  const prevBtn = document.getElementById('stagePrevBtn');
  const nextBtn = document.getElementById('stageNextBtn');
  const indicator = document.getElementById('stageStepIndicator');
  const mediaWrap = document.getElementById('stageFrameMedia');

  if (!activeImg || !pills.length) return;

  const STAGES_DATA = [
    {
      num: 1,
      badge: 'ETAPA 01 / 06',
      title: '01. Traço Elétrico Inicial',
      desc: 'A centelha original. O arco de energia primitiva gerado pelo atrito do âmbar que acendeu o saber humano.',
      src: '../assets/imagery/milet-motion-stage-01-arco-eletrico.png'
    },
    {
      num: 2,
      badge: 'ETAPA 02 / 06',
      title: '02. Oscilação Senoidal AC',
      desc: 'A corrente alternada em frequência contínua. Ondulação periódica que traduz o fluxo ininterrupto de potência.',
      src: '../assets/imagery/milet-motion-stage-02-senoide-ac.png'
    },
    {
      num: 3,
      badge: 'ETAPA 03 / 06',
      title: '03. Wireframe Estrutural',
      desc: 'O alinhamento dos nós geométricos. Os 3 vértices equiláteros se fecham em malha de precisão matemática.',
      src: '../assets/imagery/milet-motion-stage-03-wireframe-loop.png'
    },
    {
      num: 4,
      badge: 'ETAPA 04 / 06',
      title: '04. Circuito de Continuidade',
      desc: 'O triângulo arredondado estabilizado como condução fechada, eliminando perdas e criando a infraestrutura base.',
      src: '../assets/imagery/milet-motion-stage-04-circuito-triangulo.png'
    },
    {
      num: 5,
      badge: 'ETAPA 05 / 06',
      title: '05. Torção Espacial Möbius',
      desc: 'A fita de Möbius ganha vida tridimensional, rompendo a bidimensionalidade tradicional e integrando exterior e interior.',
      src: '../assets/imagery/milet-motion-stage-05-torsao-mobius.png'
    },
    {
      num: 6,
      badge: 'ETAPA 06 / 06',
      title: '06. O Símbolo Vivo de Âmbar',
      desc: 'A identidade plena: matéria fóssil translúcida pulsando com caustics dourados. A síntese da liberdade energética.',
      src: '../assets/imagery/milet-motion-stage-06-simbolo-vivo-ambar.png'
    }
  ];

  let currentStage = 1;
  let autoTimer = null;
  let isAutoPlaying = false;

  function setStage(stageNum) {
    if (stageNum < 1) stageNum = 6;
    if (stageNum > 6) stageNum = 1;
    currentStage = stageNum;

    const data = STAGES_DATA[currentStage - 1];

    activeImg.src = data.src;
    if (badgeEl) badgeEl.textContent = data.badge;
    if (titleEl) titleEl.textContent = data.title;
    if (descEl) descEl.textContent = data.desc;
    if (indicator) indicator.textContent = `${currentStage} / 6`;
    if (scrubber) scrubber.value = currentStage;

    pills.forEach(p => {
      p.classList.toggle('active', parseInt(p.dataset.stage, 10) === currentStage);
    });

    if (window.gsap) {
      gsap.fromTo(activeImg, { opacity: 0.6, scale: 0.985 }, { opacity: 1, scale: 1, duration: 0.25, ease: 'power2.out' });
    }
  }

  pills.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const num = parseInt(e.currentTarget.dataset.stage, 10);
      if (!isNaN(num)) {
        stopAutoPlay();
        setStage(num);
      }
    });
  });

  if (scrubber) {
    scrubber.addEventListener('input', (e) => {
      stopAutoPlay();
      setStage(parseInt(e.target.value, 10));
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      stopAutoPlay();
      setStage(currentStage - 1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      stopAutoPlay();
      setStage(currentStage + 1);
    });
  }

  if (mediaWrap) {
    mediaWrap.addEventListener('click', () => {
      stopAutoPlay();
      setStage(currentStage + 1);
    });
  }

  function toggleAutoPlay() {
    if (isAutoPlaying) {
      stopAutoPlay();
    } else {
      startAutoPlay();
    }
  }

  function startAutoPlay() {
    isAutoPlaying = true;
    if (playBtn) {
      playBtn.textContent = '❚❚ Pausar';
      playBtn.classList.add('playing');
    }
    // Avanço imediato para feedback instantâneo ao clique
    setStage(currentStage + 1);
    clearInterval(autoTimer);
    autoTimer = setInterval(() => {
      setStage(currentStage + 1);
    }, 2200);
  }

  function stopAutoPlay() {
    if (!isAutoPlaying && !autoTimer) return;
    isAutoPlaying = false;
    if (playBtn) {
      playBtn.textContent = '▶ Auto-Avanço';
      playBtn.classList.remove('playing');
    }
    clearInterval(autoTimer);
    autoTimer = null;
  }

  if (playBtn) {
    playBtn.addEventListener('click', toggleAutoPlay);
  }
}

// -------------------------------------------------------------
// 11. GSAP ScrollTrigger Animations (Smooth Reveal & Parallax)
// -------------------------------------------------------------
function initGsapScrollAnimations() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  // Match media to respect accessibility prefers-reduced-motion
  const mm = gsap.matchMedia();

  mm.add('(prefers-reduced-motion: no-preference)', () => {
    // Section headers reveal
    gsap.utils.toArray('.section-header').forEach(header => {
      gsap.from(header, {
        scrollTrigger: {
          trigger: header,
          start: 'top 88%',
          toggleActions: 'play none none none'
        },
        y: 28,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out'
      });
    });

    // Cards batch reveal
    const batchTargets = [
      '.standard-card',
      '.color-swatch-card',
      '.type-card',
      '.icon-card',
      '.res-item',
      '.principle-card',
      '.asset-folder-card'
    ];

    batchTargets.forEach(selector => {
      const elements = gsap.utils.toArray(selector);
      if (elements.length > 0) {
        ScrollTrigger.batch(elements, {
          start: 'top 90%',
          once: true,
          onEnter: batch => {
            gsap.from(batch, {
              y: 25,
              opacity: 0,
              stagger: 0.08,
              duration: 0.6,
              ease: 'power2.out',
              overwrite: 'auto'
            });
          }
        });
      }
    });
  });
}
