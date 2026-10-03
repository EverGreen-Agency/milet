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
})();
