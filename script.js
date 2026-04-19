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

  const cards = Array.from(track.querySelectorAll('.ts-card'));
  const wrapper = track.parentElement;
  const GAP = 20;
  let current = 0;

  function setCardWidths() {
    const ratio = window.innerWidth <= 720 ? 0.88 : 0.62;
    const w = Math.round(wrapper.offsetWidth * ratio);
    cards.forEach(card => {
      card.style.width = w + 'px';
      card.style.minWidth = w + 'px';
    });
  }

  function getSlideWidth() {
    return (cards[0] ? cards[0].offsetWidth : 0) + GAP;
  }

  function goTo(index) {
    current = Math.max(0, Math.min(index, cards.length - 1));
    track.style.transform = `translateX(-${current * getSlideWidth()}px)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  setCardWidths();

  prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn.addEventListener('click', () => goTo(current + 1));
  dots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i)));

  window.addEventListener('resize', () => { setCardWidths(); goTo(current); }, { passive: true });
})();

// Close mobile dropdowns on outside click
document.addEventListener('click', (e) => {
  if (!e.target.closest('.nav-dropdown')) {
    document.querySelectorAll('.nav-dropdown').forEach(d => d.blur?.());
  }
});