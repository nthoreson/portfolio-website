// Mobile nav toggle
const toggle = document.getElementById('navToggle');
const links = document.getElementById('navLinks');
if (toggle && links) {
  toggle.addEventListener('click', () => {
    links.classList.toggle('open');
  });
  links.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') links.classList.remove('open');
  });
}

// Hide nav on scroll down, show on scroll up
const nav = document.querySelector('.nav');
let lastScrollY = window.scrollY;
window.addEventListener('scroll', () => {
  const currentScrollY = window.scrollY;
  if (currentScrollY > lastScrollY && currentScrollY > 80) {
    nav.style.transform = 'translateY(-100%)';
  } else {
    nav.style.transform = 'translateY(0)';
  }
  lastScrollY = currentScrollY;
}, { passive: true });

// Footer year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Testimonials slider
(function () {
  const track = document.getElementById('tsTrack');
  const dots = document.querySelectorAll('.ts-dot');
  const prevBtn = document.getElementById('tsPrev');
  const nextBtn = document.getElementById('tsNext');
  if (!track || !prevBtn || !nextBtn) return;

  const cards = track.querySelectorAll('.ts-card');
  let current = 0;

  function getSlideWidth() {
    const card = cards[0];
    if (!card) return 0;
    const gap = 20;
    return card.offsetWidth + gap;
  }

  function goTo(index) {
    current = Math.max(0, Math.min(index, cards.length - 1));
    track.style.transform = `translateX(-${current * getSlideWidth()}px)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn.addEventListener('click', () => goTo(current + 1));
  dots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i)));

  // Recalculate on resize
  window.addEventListener('resize', () => goTo(current), { passive: true });
})();

// Close mobile dropdowns on outside click
document.addEventListener('click', (e) => {
  if (!e.target.closest('.nav-dropdown')) {
    document.querySelectorAll('.nav-dropdown').forEach(d => d.blur?.());
  }
});