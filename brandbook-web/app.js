/**
 * Milet Brandbook & Design System - Interactive Engine
 * High-performance 3D WebGL (Three.js), Motion Frame a Frame (Painel 11),
 * Canvas 2D Metamorphosis, Favicon/Squircle Switcher, Master Logo Viewer,
 * 8-Slide Responsive Slider, and GSAP ScrollTrigger Animations.
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initFaviconAutoListener();
  initHeroVisualToggle();
  initMobileMenu();
  initLightboxKeyHandler();
  initLogoViewer();
  initFaviconsSwitcher();
  initEnergySimulator();
  initBrandSlider();
  initMotionViews();
  initThreeScene();
  initFrameByFrameMotion();
  initMotionLab();
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
// 3. Mobile Menu Toggle
// -------------------------------------------------------------
function initMobileMenu() {
  const btn = document.getElementById('mobileMenuBtn');
  const drawer = document.getElementById('mobileDrawer');
  if (!btn || !drawer) return;

  btn.addEventListener('click', () => {
    drawer.classList.toggle('open');
  });
}

window.toggleMobileMenu = function() {
  const drawer = document.getElementById('mobileDrawer');
  if (drawer) {
    drawer.classList.remove('open');
  }
};

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
// 10. Motion Views Tab Switching (3D WebGL vs Frame-a-Frame vs Wave)
// -------------------------------------------------------------
let miletThreeInstance = null;

function initMotionViews() {
  const tabBtns = document.querySelectorAll('.motion-tab-btn');
  const panels = {
    threejs: document.getElementById('viewThreejs'),
    framebyframe: document.getElementById('viewFrameByFrame'),
    wavesim: document.getElementById('viewWaveSim')
  };

  if (!tabBtns.length) return;

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.motionTab;
      if (!target || !panels[target]) return;

      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      Object.keys(panels).forEach(key => {
        if (panels[key]) {
          panels[key].classList.toggle('active', key === target);
        }
      });

      if (target === 'threejs' && miletThreeInstance) {
        miletThreeInstance.onResize();
      }
    });
  });
}

// -------------------------------------------------------------
// 11. Three.js Procedural 3D Amber Möbius Loop (/img2threejs)
// -------------------------------------------------------------
function initThreeScene() {
  const canvas = document.getElementById('threeCanvas');
  const viewport = document.getElementById('threeViewport');
  if (!canvas || !viewport || typeof THREE === 'undefined') return;

  class MiletThreeEngine {
    constructor() {
      this.canvas = canvas;
      this.viewport = viewport;
      this.autoRotate = true;
      this.currentMaterial = 'amber';
      this.frameCount = 0;
      this.lastFpsTime = performance.now();
      this.fpsDisplay = document.getElementById('threeFpsDisplay');

      this.initScene();
      this.initLighting();
      this.initGeometry();
      this.initControls();
      this.initEvents();
      this.animate();
    }

    initScene() {
      const width = this.viewport.clientWidth || 800;
      const height = this.viewport.clientHeight || 500;

      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(0x0a0a09);

      this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
      this.defaultCamPos = new THREE.Vector3(0, 0, 8.2);
      this.camera.position.copy(this.defaultCamPos);

      this.renderer = new THREE.WebGLRenderer({
        canvas: this.canvas,
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
      });
      this.renderer.setSize(width, height);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
      this.renderer.toneMappingExposure = 1.25;
      this.renderer.shadowMap.enabled = true;
    }

    initLighting() {
      // Warm ambient
      const ambientLight = new THREE.AmbientLight(0xfff7ed, 0.75);
      this.scene.add(ambientLight);

      // Studio Key Light (Dourado Quente)
      const keyLight = new THREE.DirectionalLight(0xffe8b3, 2.4);
      keyLight.position.set(5.5, 7.5, 6.0);
      this.scene.add(keyLight);

      // Rim Light (Âmbar Elétrico de fundo)
      const rimLight = new THREE.DirectionalLight(0xff9400, 3.2);
      rimLight.position.set(-6.0, -4.5, -6.0);
      this.scene.add(rimLight);

      // Cool Fill Light (Contraste escultural)
      const fillLight = new THREE.DirectionalLight(0xd0e0ff, 0.8);
      fillLight.position.set(-4.0, 5.0, 3.0);
      this.scene.add(fillLight);

      // Central glowing core spark
      this.coreLight = new THREE.PointLight(0xffaa22, 1.6, 9.0);
      this.coreLight.position.set(0, 0, 0);
      this.scene.add(this.coreLight);
    }

    initGeometry() {
      const segments = 240;
      const radialSegments = 32;
      const rBase = 2.4;
      const dr = 0.38;
      const w = 0.52;
      const t = 0.16;

      const positions = [];
      const normals = [];
      const uvs = [];
      const indices = [];

      // Generate rings along Möbius path
      for (let i = 0; i <= segments; i++) {
        const u = (i / segments) * Math.PI * 2;
        const r = rBase + dr * Math.cos(3 * u);
        const cx = r * Math.cos(u);
        const cy = r * Math.sin(u) * 0.95;
        const cz = 0.42 * Math.sin(3 * u);

        // Approximate tangent via finite difference
        const du = 0.001;
        const u2 = u + du;
        const r2 = rBase + dr * Math.cos(3 * u2);
        const cx2 = r2 * Math.cos(u2);
        const cy2 = r2 * Math.sin(u2) * 0.95;
        const cz2 = 0.42 * Math.sin(3 * u2);

        let tx = cx2 - cx, ty = cy2 - cy, tz = cz2 - cz;
        const tLen = Math.sqrt(tx * tx + ty * ty + tz * tz);
        tx /= tLen; ty /= tLen; tz /= tLen;

        // Up vector and normal
        const upX = 0, upY = 0, upZ = 1;
        let nx = ty * upZ - tz * upY;
        let ny = tz * upX - tx * upZ;
        let nz = tx * upY - ty * upX;
        const nLen = Math.sqrt(nx * nx + ny * ny + nz * nz);
        if (nLen < 1e-5) {
          nx = 1; ny = 0; nz = 0;
        } else {
          nx /= nLen; ny /= nLen; nz /= nLen;
        }

        // Binormal
        const bx = ty * nz - tz * ny;
        const by = tz * nx - tx * nz;
        const bz = tx * ny - ty * nx;

        // 1.5 Möbius half-twists
        const theta = 1.5 * u;
        const cosTh = Math.cos(theta);
        const sinTh = Math.sin(theta);

        const nRotX = cosTh * nx + sinTh * bx;
        const nRotY = cosTh * ny + sinTh * by;
        const nRotZ = cosTh * nz + sinTh * bz;

        const bRotX = -sinTh * nx + cosTh * bx;
        const bRotY = -sinTh * ny + cosTh * by;
        const bRotZ = -sinTh * nz + cosTh * bz;

        for (let j = 0; j <= radialSegments; j++) {
          const v = (j / radialSegments) * Math.PI * 2;
          const cosV = Math.cos(v);
          const sinV = Math.sin(v);

          const px = cx + (w * cosV) * nRotX + (t * sinV) * bRotX;
          const py = cy + (w * cosV) * nRotY + (t * sinV) * bRotY;
          const pz = cz + (w * cosV) * nRotZ + (t * sinV) * bRotZ;

          positions.push(px, py, pz);
          uvs.push(i / segments, j / radialSegments);
        }
      }

      // Stitch quads into triangles
      for (let i = 0; i < segments; i++) {
        for (let j = 0; j < radialSegments; j++) {
          const a = i * (radialSegments + 1) + j;
          const b = (i + 1) * (radialSegments + 1) + j;
          const c = (i + 1) * (radialSegments + 1) + (j + 1);
          const d = i * (radialSegments + 1) + (j + 1);

          indices.push(a, b, d);
          indices.push(b, c, d);
        }
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
      geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
      geometry.setIndex(indices);
      geometry.computeVertexNormals();

      // Materials presets
      this.materials = {
        amber: new THREE.MeshPhysicalMaterial({
          color: 0xD6922E,
          emissive: 0x221100,
          roughness: 0.10,
          metalness: 0.05,
          transmission: 0.88,
          ior: 1.54,
          thickness: 1.6,
          clearcoat: 1.0,
          clearcoatRoughness: 0.06,
          reflectivity: 0.9,
          sheen: 0.9,
          sheenColor: 0xffd180
        }),
        gold: new THREE.MeshStandardMaterial({
          color: 0xD4AF37,
          roughness: 0.22,
          metalness: 0.92
        }),
        wireframe: new THREE.MeshBasicMaterial({
          color: 0xFFA000,
          wireframe: true
        })
      };

      this.mesh = new THREE.Mesh(geometry, this.materials.amber);
      this.scene.add(this.mesh);

      // Inner glowing core particle
      const coreGeo = new THREE.SphereGeometry(0.18, 16, 16);
      const coreMat = new THREE.MeshBasicMaterial({ color: 0xFFF0D0 });
      this.coreMesh = new THREE.Mesh(coreGeo, coreMat);
      this.scene.add(this.coreMesh);
    }

    initControls() {
      if (typeof THREE.OrbitControls !== 'undefined') {
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.minDistance = 3.5;
        this.controls.maxDistance = 14.0;
        this.controls.maxPolarAngle = Math.PI / 1.7;
      }
    }

    initEvents() {
      window.addEventListener('resize', () => this.onResize());

      // Auto-Rotate Button
      const autoRotateBtn = document.getElementById('threeToggleAutoRotate');
      if (autoRotateBtn) {
        autoRotateBtn.addEventListener('click', () => {
          this.autoRotate = !this.autoRotate;
          autoRotateBtn.classList.toggle('active', this.autoRotate);
          showToast(this.autoRotate ? 'Auto-Rotação Ativada' : 'Auto-Rotação Pausada');
        });
      }

      // Reset Camera Button
      const resetBtn = document.getElementById('threeResetCamBtn');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          if (window.gsap) {
            gsap.to(this.camera.position, {
              x: this.defaultCamPos.x,
              y: this.defaultCamPos.y,
              z: this.defaultCamPos.z,
              duration: 1.0,
              ease: 'power2.out'
            });
          } else {
            this.camera.position.copy(this.defaultCamPos);
          }
          if (this.controls) this.controls.target.set(0, 0, 0);
          showToast('Câmera Resetada');
        });
      }

      // Material Buttons
      document.querySelectorAll('.three-mat-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const matKey = e.target.dataset.mat;
          if (!matKey || !this.materials[matKey]) return;

          document.querySelectorAll('.three-mat-btn').forEach(b => b.classList.remove('active'));
          e.target.classList.add('active');

          this.mesh.material = this.materials[matKey];
          this.currentMaterial = matKey;
          showToast(`Material: ${e.target.textContent}`);
        });
      });
    }

    onResize() {
      if (!this.viewport || !this.renderer || !this.camera) return;
      const width = this.viewport.clientWidth;
      const height = this.viewport.clientHeight || 500;
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(width, height);
    }

    animate() {
      requestAnimationFrame(() => this.animate());

      const time = performance.now() * 0.001;

      // FPS counter
      this.frameCount++;
      const now = performance.now();
      if (now - this.lastFpsTime >= 500) {
        const fps = Math.round((this.frameCount * 1000) / (now - this.lastFpsTime));
        if (this.fpsDisplay) this.fpsDisplay.textContent = `${fps} FPS`;
        this.frameCount = 0;
        this.lastFpsTime = now;
      }

      // Auto-rotation
      if (this.autoRotate && this.mesh) {
        this.mesh.rotation.y += 0.006;
        this.mesh.rotation.x = Math.sin(time * 0.4) * 0.12;
      }

      // Core pulse
      if (this.coreMesh) {
        const pulse = 1 + Math.sin(time * 3.0) * 0.2;
        this.coreMesh.scale.set(pulse, pulse, pulse);
      }

      if (this.controls) {
        this.controls.update();
      }

      this.renderer.render(this.scene, this.camera);
    }
  }

  miletThreeInstance = new MiletThreeEngine();
}

// -------------------------------------------------------------
// 12. Frame a Frame Motion Sequencer (Painel 11)
// -------------------------------------------------------------
function initFrameByFrameMotion() {
  const activeImg = document.getElementById('activeStageImg');
  const badgeEl = document.getElementById('stagePhaseBadge');
  const titleEl = document.getElementById('stagePhaseTitle');
  const descEl = document.getElementById('stagePhaseDesc');
  const pills = document.querySelectorAll('.stage-pill-btn');
  const scrubber = document.getElementById('stageScrubber');
  const playBtn = document.getElementById('stagePlayBtn');
  const indicator = document.getElementById('stageStepIndicator');

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

    // Smooth transition
    if (window.gsap) {
      gsap.to(activeImg, {
        opacity: 0.3,
        scale: 0.98,
        duration: 0.15,
        onComplete: () => {
          activeImg.src = data.src;
          if (badgeEl) badgeEl.textContent = data.badge;
          if (titleEl) titleEl.textContent = data.title;
          if (descEl) descEl.textContent = data.desc;
          if (indicator) indicator.textContent = `${currentStage} / 6`;
          if (scrubber) scrubber.value = currentStage;

          pills.forEach(p => {
            p.classList.toggle('active', parseInt(p.dataset.stage, 10) === currentStage);
          });

          gsap.to(activeImg, {
            opacity: 1,
            scale: 1,
            duration: 0.35,
            ease: 'power2.out'
          });
        }
      });
    } else {
      activeImg.src = data.src;
      if (badgeEl) badgeEl.textContent = data.badge;
      if (titleEl) titleEl.textContent = data.title;
      if (descEl) descEl.textContent = data.desc;
      if (indicator) indicator.textContent = `${currentStage} / 6`;
      if (scrubber) scrubber.value = currentStage;

      pills.forEach(p => {
        p.classList.toggle('active', parseInt(p.dataset.stage, 10) === currentStage);
      });
    }
  }

  pills.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const num = parseInt(e.target.dataset.stage, 10);
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

  function toggleAutoPlay() {
    if (isAutoPlaying) {
      stopAutoPlay();
    } else {
      startAutoPlay();
    }
  }

  function startAutoPlay() {
    isAutoPlaying = true;
    if (playBtn) playBtn.textContent = '❚❚ Pausar';
    autoTimer = setInterval(() => {
      setStage(currentStage + 1);
    }, 2400);
  }

  function stopAutoPlay() {
    isAutoPlaying = false;
    if (playBtn) playBtn.textContent = '▶ Auto-Avanço';
    clearInterval(autoTimer);
  }

  if (playBtn) {
    playBtn.addEventListener('click', toggleAutoPlay);
  }
}

// -------------------------------------------------------------
// 13. Motion Lab - 60fps Canvas AC Sine to Milet Morphing Engine
// -------------------------------------------------------------
function initMotionLab() {
  const canvas = document.getElementById('motionCanvas');
  const phaseLabel = document.getElementById('motionPhaseLabel');
  const phaseDesc = document.getElementById('motionPhaseDesc');
  const phaseButtons = document.querySelectorAll('.phase-btn');
  const playBtn = document.getElementById('motionPlayBtn');
  const scrubber = document.getElementById('motionScrubber');
  const timeDisplay = document.getElementById('motionTimeDisplay');

  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let animationFrameId = null;
  let isPlaying = true;
  let progress = 0;
  const duration = 6.0;
  let lastTime = performance.now();

  const PHASES_INFO = [
    {
      name: 'FASE 01: MATÉRIA (CORRENTE ALTERNADA)',
      desc: 'A onda senoidal de corrente alternada oscilando na frequência de origem.',
      range: [0, 0.25]
    },
    {
      name: 'FASE 02: ENERGIA (IGNIÇÃO & TORÇÃO)',
      desc: 'A onda ganha momento angular e torção espacial sob a atração de um novo polo.',
      range: [0.25, 0.50]
    },
    {
      name: 'FASE 03: CONEXÃO (FECHAMENTO DE CIRCUITO)',
      desc: 'As extremidades se encontram em um loop contínuo de Möbius, fechando o fluxo perpétuo.',
      range: [0.50, 0.75]
    },
    {
      name: 'FASE 04: LIBERDADE (O SÍMBOLO VIVO)',
      desc: 'Forma que acende. Marca que vive. O símbolo Milet pleno, pulsando com energia pura.',
      range: [0.75, 1.0]
    }
  ];

  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 2;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  const particles = [];
  for (let i = 0; i < 36; i++) {
    particles.push({
      x: Math.random(),
      y: Math.random(),
      speed: 0.2 + Math.random() * 0.5,
      size: 1.5 + Math.random() * 2.5,
      alpha: 0.2 + Math.random() * 0.8
    });
  }

  const masterSymbolImg = new Image();
  masterSymbolImg.src = '../assets/logo/png/transparent/milet-symbol-amber.png';

  function render(time) {
    const delta = (time - lastTime) / 1000;
    lastTime = time;

    if (isPlaying) {
      progress += delta / duration;
      if (progress > 1) progress = 0;
      if (scrubber) scrubber.value = Math.round(progress * 100);
    }

    const rect = canvas.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    const cx = w / 2;
    const cy = h / 2;

    ctx.clearRect(0, 0, w, h);

    const glowGrad = ctx.createRadialGradient(cx, cy, 20, cx, cy, w * 0.55);
    glowGrad.addColorStop(0, 'rgba(211, 155, 61, 0.12)');
    glowGrad.addColorStop(0.5, 'rgba(211, 155, 61, 0.03)');
    glowGrad.addColorStop(1, 'rgba(10, 10, 9, 0)');
    ctx.fillStyle = glowGrad;
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = 'rgba(211, 155, 61, 0.04)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = 40; x < w; x += 40) {
      ctx.moveTo(x, 0); ctx.lineTo(x, h);
    }
    for (let y = 40; y < h; y += 40) {
      ctx.moveTo(0, y); ctx.lineTo(w, y);
    }
    ctx.stroke();

    let currentPhaseIndex = 0;
    if (progress < 0.25) currentPhaseIndex = 0;
    else if (progress < 0.50) currentPhaseIndex = 1;
    else if (progress < 0.75) currentPhaseIndex = 2;
    else currentPhaseIndex = 3;

    const info = PHASES_INFO[currentPhaseIndex];
    if (phaseLabel && phaseLabel.textContent !== info.name) phaseLabel.textContent = info.name;
    if (phaseDesc && phaseDesc.textContent !== info.desc) phaseDesc.textContent = info.desc;
    if (timeDisplay) timeDisplay.textContent = `${(progress * duration).toFixed(1)}s`;

    phaseButtons.forEach((btn, idx) => {
      btn.classList.toggle('active', idx === currentPhaseIndex);
    });

    ctx.save();

    particles.forEach(p => {
      p.x += p.speed * delta * 0.5;
      if (p.x > 1) p.x = 0;
      const px = p.x * w;
      const py = cy + Math.sin(p.x * Math.PI * 4 + progress * 10) * (30 + progress * 40);
      ctx.fillStyle = `rgba(247, 215, 138, ${p.alpha * (0.3 + progress * 0.7)})`;
      ctx.beginPath();
      ctx.arc(px, py, p.size, 0, Math.PI * 2);
      ctx.fill();
    });

    if (progress < 0.25) {
      // Phase 0: Pure AC Sine Wave
      const amp = 55;
      const freq = 0.02;
      const animPhase = time * 0.003;

      ctx.strokeStyle = 'rgba(211, 155, 61, 0.4)';
      ctx.lineWidth = 8;
      ctx.filter = 'blur(6px)';
      ctx.beginPath();
      for (let x = 0; x <= w; x += 4) {
        const y = cy + Math.sin(x * freq + animPhase) * amp;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.filter = 'none';

      ctx.strokeStyle = '#F7D78A';
      ctx.lineWidth = 3;
      ctx.beginPath();
      for (let x = 0; x <= w; x += 4) {
        const y = cy + Math.sin(x * freq + animPhase) * amp;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      ctx.setLineDash([4, 6]);
      ctx.strokeStyle = 'rgba(247, 243, 234, 0.15)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(20, cy); ctx.lineTo(w - 20, cy);
      ctx.stroke();
      ctx.setLineDash([]);

    } else if (progress < 0.50) {
      // Phase 1: Curvature & Energy Ignition
      const localT = (progress - 0.25) / 0.25;
      const points = 160;
      const radiusMax = Math.min(w, h) * 0.32;

      ctx.strokeStyle = 'rgba(211, 155, 61, 0.5)';
      ctx.lineWidth = 8;
      ctx.filter = 'blur(8px)';
      ctx.beginPath();
      for (let i = 0; i <= points; i++) {
        const u = i / points;
        const linearX = u * w;
        const linearY = cy + Math.sin(u * Math.PI * 6 + time * 0.003) * 60;
        const angle = u * Math.PI * 2.5 - Math.PI / 2;
        const r = radiusMax * (0.4 + 0.6 * u);
        const spiralX = cx + Math.cos(angle) * r;
        const spiralY = cy + Math.sin(angle) * r * 0.8;
        const x = linearX * (1 - localT) + spiralX * localT;
        const y = linearY * (1 - localT) + spiralY * localT;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.filter = 'none';

      ctx.strokeStyle = '#F7D78A';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      for (let i = 0; i <= points; i++) {
        const u = i / points;
        const linearX = u * w;
        const linearY = cy + Math.sin(u * Math.PI * 6 + time * 0.003) * 60;
        const angle = u * Math.PI * 2.5 - Math.PI / 2;
        const r = radiusMax * (0.4 + 0.6 * u);
        const spiralX = cx + Math.cos(angle) * r;
        const spiralY = cy + Math.sin(angle) * r * 0.8;
        const x = linearX * (1 - localT) + spiralX * localT;
        const y = linearY * (1 - localT) + spiralY * localT;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

    } else if (progress < 0.75) {
      // Phase 2: Loop Closing & Möbius Torsion
      const localT = (progress - 0.50) / 0.25;
      const points = 180;
      const rx = Math.min(w, h) * 0.28;
      const ry = Math.min(w, h) * 0.32;

      ctx.save();
      ctx.translate(cx, cy);

      ctx.strokeStyle = 'rgba(211, 155, 61, 0.6)';
      ctx.lineWidth = 10;
      ctx.filter = 'blur(10px)';
      ctx.beginPath();
      for (let i = 0; i <= points; i++) {
        const theta = (i / points) * Math.PI * 2;
        const denom = 1 + Math.sin(theta) * Math.sin(theta);
        const lx = (rx * Math.cos(theta)) / (denom * 0.8);
        const ly = (ry * Math.sin(theta) * Math.cos(theta)) / denom;
        const ex = rx * Math.cos(theta);
        const ey = ry * Math.sin(theta);
        const px = ex * (1 - localT) + lx * localT;
        const py = ey * (1 - localT) + ly * localT;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
      ctx.filter = 'none';

      const loopGrad = ctx.createLinearGradient(-rx, -ry, rx, ry);
      loopGrad.addColorStop(0, '#FFE8A3');
      loopGrad.addColorStop(0.5, '#D39B3D');
      loopGrad.addColorStop(1, '#9E671D');

      ctx.strokeStyle = loopGrad;
      ctx.lineWidth = 4.5;
      ctx.beginPath();
      for (let i = 0; i <= points; i++) {
        const theta = (i / points) * Math.PI * 2;
        const denom = 1 + Math.sin(theta) * Math.sin(theta);
        const lx = (rx * Math.cos(theta)) / (denom * 0.8);
        const ly = (ry * Math.sin(theta) * Math.cos(theta)) / denom;
        const ex = rx * Math.cos(theta);
        const ey = ry * Math.sin(theta);
        const px = ex * (1 - localT) + lx * localT;
        const py = ey * (1 - localT) + ly * localT;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();

      const sparkSize = 4 + Math.sin(time * 0.02) * 2;
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(0, 0, sparkSize, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

    } else {
      // Phase 3: The Living Milet Symbol
      const localT = (progress - 0.75) / 0.25;
      const pulse = 1 + Math.sin(time * 0.004) * 0.03;
      const symbolSize = Math.min(w, h) * 0.46 * pulse;

      ctx.save();
      ctx.translate(cx, cy);

      const auraGrad = ctx.createRadialGradient(0, 0, symbolSize * 0.2, 0, 0, symbolSize * 0.85);
      auraGrad.addColorStop(0, 'rgba(211, 155, 61, 0.45)');
      auraGrad.addColorStop(0.5, 'rgba(211, 155, 61, 0.15)');
      auraGrad.addColorStop(1, 'rgba(211, 155, 61, 0)');
      ctx.fillStyle = auraGrad;
      ctx.beginPath();
      ctx.arc(0, 0, symbolSize * 0.85, 0, Math.PI * 2);
      ctx.fill();

      if (masterSymbolImg.complete && masterSymbolImg.naturalWidth > 0) {
        ctx.globalAlpha = Math.min(1, localT * 1.5);
        ctx.drawImage(masterSymbolImg, -symbolSize / 2, -symbolSize / 2, symbolSize, symbolSize);
        ctx.globalAlpha = 1;
      }

      ctx.strokeStyle = 'rgba(247, 215, 138, 0.35)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([6, 12]);
      ctx.beginPath();
      ctx.arc(0, 0, symbolSize * 0.65, time * 0.001, time * 0.001 + Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.restore();
    }

    ctx.restore();
    animationFrameId = requestAnimationFrame(render);
  }

  animationFrameId = requestAnimationFrame(render);

  if (scrubber) {
    scrubber.addEventListener('input', (e) => {
      isPlaying = false;
      if (playBtn) playBtn.textContent = '▶ Play';
      progress = parseInt(e.target.value, 10) / 100;
    });
  }

  if (playBtn) {
    playBtn.addEventListener('click', () => {
      isPlaying = !isPlaying;
      playBtn.textContent = isPlaying ? '❚❚ Pausar' : '▶ Play';
      if (isPlaying) lastTime = performance.now();
    });
  }

  phaseButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const pIdx = parseInt(e.target.dataset.phase, 10);
      if (!isNaN(pIdx)) {
        progress = pIdx * 0.25 + 0.02;
        if (scrubber) scrubber.value = Math.round(progress * 100);
      }
    });
  });
}

// -------------------------------------------------------------
// 14. GSAP ScrollTrigger Animations (Smooth Reveal & Parallax)
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
