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
  const wrapper = document.getElementById('tsTrack') && document.getElementById('tsTrack').parentElement;
  const track = document.getElementById('tsTrack');
  const dots = document.querySelectorAll('.ts-dot');
  const prevBtn = document.getElementById('tsPrev');
  const nextBtn = document.getElementById('tsNext');
  if (!track || !prevBtn || !nextBtn) return;

  const cards = Array.from(track.querySelectorAll('.ts-card'));
  let current = 0;

  function goTo(index) {
    current = Math.max(0, Math.min(index, cards.length - 1));
    cards[current].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn.addEventListener('click', () => goTo(current + 1));
  dots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i)));

  // Sync dot on natural scroll/swipe
  wrapper.addEventListener('scroll', () => {
    const scrollLeft = wrapper.scrollLeft;
    const cardWidth = cards[0].offsetWidth + 24;
    const idx = Math.round(scrollLeft / cardWidth);
    if (idx !== current) {
      current = idx;
      dots.forEach((d, i) => d.classList.toggle('active', i === current));
    }
  }, { passive: true });
})();

// Close mobile dropdowns on outside click
document.addEventListener('click', (e) => {
  if (!e.target.closest('.nav-dropdown')) {
    document.querySelectorAll('.nav-dropdown').forEach(d => d.blur?.());
  }
});