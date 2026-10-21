(() => {
  const button = document.querySelector('[data-theme-toggle]');
  const storedTheme = localStorage.getItem('milet-public-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = storedTheme || (prefersDark ? 'dark' : 'light');

  function applyTheme(theme) {
    const isDark = theme === 'dark';
    document.body.classList.toggle('theme-dark', isDark);
    document.body.classList.toggle('theme-light', !isDark);
    document.documentElement.dataset.theme = theme;
    if (button) {
      button.textContent = isDark ? '☀' : '☾';
      button.setAttribute('aria-label', isDark ? 'Usar tema claro' : 'Usar tema escuro');
      button.setAttribute('title', isDark ? 'Usar tema claro' : 'Usar tema escuro');
    }
  }

  applyTheme(initialTheme);

  button?.addEventListener('click', () => {
    const nextTheme = document.body.classList.contains('theme-dark') ? 'light' : 'dark';
    localStorage.setItem('milet-public-theme', nextTheme);
    applyTheme(nextTheme);
  });

  // Rail Lateral / Timeline ScrollSpy & Interações
  const rail = document.querySelector('.changelog-rail');
  if (rail) {
    const railItems = Array.from(rail.querySelectorAll('.rail-item'));
    const targets = railItems
      .map(item => {
        const id = item.dataset.target || item.getAttribute('href')?.replace('#', '');
        return id ? document.getElementById(id) : null;
      })
      .filter(Boolean);

    function updateActiveRail() {
      const scrollY = window.scrollY;
      const viewportMid = scrollY + window.innerHeight * 0.35;
      let activeTargetId = null;

      for (let i = 0; i < targets.length; i++) {
        const target = targets[i];
        const top = target.getBoundingClientRect().top + scrollY;
        if (top <= viewportMid) {
          activeTargetId = target.id;
        } else {
          break;
        }
      }

      if (!activeTargetId && targets.length > 0) {
        activeTargetId = targets[0].id;
      }

      railItems.forEach(item => {
        const id = item.dataset.target || item.getAttribute('href')?.replace('#', '');
        const isActive = id === activeTargetId;
        item.classList.toggle('active', isActive);
      });
    }

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateActiveRail();
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    railItems.forEach(item => {
      item.addEventListener('click', (e) => {
        const href = item.getAttribute('href');
        if (href && href.startsWith('#')) {
          const target = document.querySelector(href);
          if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            history.replaceState(null, '', href);
            railItems.forEach(r => r.classList.remove('active'));
            item.classList.add('active');
          }
        }
      });
    });

    updateActiveRail();
  }
})();
