/* Main shared JS for navigation, mobile menu, footer year, and form demo */
function toggleMobileMenu() {
  const m = document.getElementById('mobileMenu');
  if (m) m.classList.toggle('hidden');
}

function handleSubmit(e) {
  e.preventDefault();
  alert('Thanks! Your message was sent (demo).');
  if (e.target && typeof e.target.reset === 'function') e.target.reset();
  return false;
}

function setFooterYear() {
  const el = document.getElementById('footerYear');
  if (el) el.textContent = new Date().getFullYear();
}

function setActiveNav() {
  const current = (window.location.pathname.split('/').pop() || 'index.html');
  document.querySelectorAll('.nav-link').forEach(a => {
    const href = (a.getAttribute('href') || '').split('/').pop();
    if (href && href === current) a.classList.add('nav-active');
  });
}

document.addEventListener('DOMContentLoaded', () => {
  setFooterYear();
  setActiveNav();

  // hide mobile menu after selecting an item
  document.querySelectorAll('#mobileMenu a').forEach(a => a.addEventListener('click', () => {
    const mm = document.getElementById('mobileMenu');
    if (mm && !mm.classList.contains('hidden')) mm.classList.add('hidden');
  }));

  // attach form handler to any form with onsubmit attribute that calls handleSubmit
  document.querySelectorAll('form').forEach(f => {
    if (typeof f.onsubmit !== 'function') {
      f.addEventListener('submit', handleSubmit);
    }
  });

  // Enable GitHub buttons when a data-github attribute is present
  document.querySelectorAll('[data-github]').forEach(el => {
    const url = el.getAttribute('data-github') || el.getAttribute('href');
    if (url) {
      el.setAttribute('href', url);
      el.setAttribute('target', '_blank');
      el.setAttribute('rel', 'noopener noreferrer');
      el.classList.remove('opacity-50', 'cursor-not-allowed');
      // ensure the element is keyboard-focusable
      el.classList.add('focus:outline-none');
    }
  });

  // Entrance and pulse animations (appear on scroll)
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('enter-up');
        // start pulsing for contact icons
        if (entry.target.classList.contains('contact-icon')) entry.target.classList.add('pulse');
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.enter-element').forEach(el => observer.observe(el));
  document.querySelectorAll('.contact-icon').forEach(el => observer.observe(el));

});