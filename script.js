/* Responsive homepage navigation. */
(() => {
  const header = document.querySelector('.site-header');
  if (!header) return;
  const toggle = header.querySelector('.menu-toggle');
  const navigation = header.querySelector('.main-nav');
  const occasions = header.querySelector('.occasion-menu');
  const mobile = window.matchMedia('(max-width: 800px)');

  function closeMenu() {
    header.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.querySelector('.menu-label').textContent = 'Menu';
    occasions.open = false;
  }
  toggle.hidden = false;
  header.classList.add('nav-ready');
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    header.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.querySelector('.menu-label').textContent = open ? 'Close' : 'Menu';
    if (!open) occasions.open = false;
  });
  navigation.addEventListener('click', (event) => {
    if (event.target.closest('a')) closeMenu();
  });
  document.addEventListener('click', (event) => {
    if (!header.contains(event.target)) closeMenu();
    else if (!occasions.contains(event.target) && event.target.closest('a')) occasions.open = false;
  });
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    if (mobile.matches && header.classList.contains('is-open')) {
      closeMenu();
      toggle.focus();
    } else if (occasions.open) {
      occasions.open = false;
      occasions.querySelector('summary').focus();
    }
  });
  header.addEventListener('focusout', (event) => {
    if (event.relatedTarget && !header.contains(event.relatedTarget)) closeMenu();
  });
  mobile.addEventListener('change', closeMenu);
})();

/* Hero slideshow. Change INTERVAL_MS to adjust the time between events. */
(() => {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const slides = [...hero.querySelectorAll('.hero-slide')];
  const dots = [...hero.querySelectorAll('[data-slide]')];
  const labels = ['01 / Weddings', '02 / Private celebrations', '03 / Company gatherings'];
  const label = document.getElementById('slide-label');
  const pauseButton = document.getElementById('slide-pause');
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const INTERVAL_MS = 6500;
  let current = 0;
  let paused = motion.matches;
  let timer;
  let hovered = false;
  let focused = false;

  function schedule() {
    clearInterval(timer);
    if (!paused && !hovered && !focused && !document.hidden) {
      timer = setInterval(() => show(current + 1), INTERVAL_MS);
    }
  }
  function show(index) {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      slide.classList.toggle('is-active', i === current);
      slide.setAttribute('aria-hidden', String(i !== current));
      dots[i].setAttribute('aria-pressed', String(i === current));
    });
    label.textContent = labels[current];
  }
  function syncPause() {
    pauseButton.textContent = paused ? 'Play' : 'Pause';
    pauseButton.setAttribute('aria-label', paused ? 'Play slideshow' : 'Pause slideshow');
    schedule();
  }
  function navigate(index) { show(index); schedule(); }
  document.getElementById('slide-prev').addEventListener('click', () => navigate(current - 1));
  document.getElementById('slide-next').addEventListener('click', () => navigate(current + 1));
  dots.forEach((dot, i) => dot.addEventListener('click', () => navigate(i)));
  pauseButton.addEventListener('click', () => { paused = !paused; syncPause(); });
  hero.addEventListener('mouseenter', () => { hovered = true; schedule(); });
  hero.addEventListener('mouseleave', () => { hovered = false; schedule(); });
  hero.addEventListener('focusin', () => { focused = true; schedule(); });
  hero.addEventListener('focusout', (event) => {
    focused = hero.contains(event.relatedTarget);
    schedule();
  });
  document.addEventListener('visibilitychange', schedule);
  motion.addEventListener('change', () => { paused = motion.matches; syncPause(); });
  hero.querySelector('.slideshow-controls').hidden = false;
  syncPause();
})();
