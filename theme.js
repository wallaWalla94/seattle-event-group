/* Follow the browser's color scheme before paint unless the visitor has chosen a theme. */
(() => {
  const key = 'seg-theme';
  const root = document.documentElement;
  const preference = window.matchMedia('(prefers-color-scheme: dark)');
  const browserTheme = () => preference.matches ? 'dark' : 'light';
  let saved;
  try { saved = localStorage.getItem(key); } catch (_) { /* Storage can be unavailable. */ }
  if (saved !== 'light' && saved !== 'dark') saved = null;

  function apply(theme) {
    root.dataset.theme = theme;
    root.style.colorScheme = theme;
    document.querySelectorAll('[data-theme-toggle]').forEach((button) => {
      button.setAttribute('aria-pressed', String(theme === 'dark'));
      button.title = `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`;
    });
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta && document.body) meta.content = getComputedStyle(document.body).backgroundColor;
  }

  apply(saved || browserTheme());
  document.addEventListener('DOMContentLoaded', () => {
    apply(root.dataset.theme);
    document.querySelectorAll('[data-theme-toggle]').forEach((button) => {
      button.hidden = false;
      button.addEventListener('click', () => {
        saved = root.dataset.theme === 'dark' ? 'light' : 'dark';
        try { localStorage.setItem(key, saved); } catch (_) { /* Keep the session toggle working. */ }
        apply(saved);
      });
    });
  });
  preference.addEventListener('change', (event) => {
    if (!saved) apply(event.matches ? 'dark' : 'light');
  });
  window.addEventListener('storage', (event) => {
    if (event.key !== key && event.key !== null) return;
    saved = event.newValue === 'light' || event.newValue === 'dark' ? event.newValue : null;
    apply(saved || browserTheme());
  });
})();
