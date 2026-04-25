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

// Close mobile dropdowns on outside click
document.addEventListener('click', (e) => {
  if (!e.target.closest('.nav-dropdown')) {
    document.querySelectorAll('.nav-dropdown').forEach(d => d.blur?.());
  }
});

// Scroll reveal
const revealEls = document.querySelectorAll([
  '.section-eyebrow', '.section-title', '.big-title', '.section-sub',
  '.about-copy', '.method-intro',
  '.stat', '.spec-card', '.testimonial', '.exp-card',
  '.cs-card', '.timeline-item', '.profile-card',
  '.work-card', '.step', '.work-tile',
  '.brand-logos img', '.tool-grid img',
  '.contact-form', '.contact-links'
].join(','));

revealEls.forEach(el => el.classList.add('reveal'));

// Stagger children within grid/flex containers
[
  '.card-grid-3', '.testimonial-grid', '.exp-grid', '.cs-grid',
  '.stats-grid', '.work-grid', '.method-steps', '.profile-grid',
  '.works-masonry', '.brand-logos', '.tool-grid', '.timeline'
].forEach(selector => {
  document.querySelectorAll(selector).forEach(container => {
    Array.from(container.children).forEach((child, i) => {
      if (child.classList.contains('reveal')) {
        child.style.transitionDelay = `${i * 75}ms`;
      }
    });
  });
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));