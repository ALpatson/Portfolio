/* Shared JS: navigation, mobile menu, footer year, contact form, scroll effects */
const CONTACT_EMAIL = 'cobbinaalpatson@gmail.com';

function setMobileMenu(open) {
  const menu = document.getElementById('mobileMenu');
  const button = document.getElementById('menuButton');
  if (!menu || !button) return;
  menu.classList.toggle('hidden', !open);
  button.setAttribute('aria-expanded', String(open));
  button.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
}

function initMobileMenu() {
  const button = document.getElementById('menuButton');
  const menu = document.getElementById('mobileMenu');
  if (!button || !menu) return;

  button.addEventListener('click', () => setMobileMenu(menu.classList.contains('hidden')));
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMobileMenu(false)));
}

function setFooterYear() {
  const el = document.getElementById('footerYear');
  if (el) el.textContent = new Date().getFullYear();
}

function setActiveNav() {
  const current = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(a => {
    if (a.getAttribute('href') === current) {
      a.classList.add('nav-active');
      a.setAttribute('aria-current', 'page');
    }
  });
}

// Sends the contact form through FormSubmit (https://formsubmit.co), which
// forwards it to CONTACT_EMAIL. If that fails, the visitor is offered a
// pre-filled email instead so the message is never silently lost.
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const status = document.getElementById('formStatus');
  const button = form.querySelector('button[type="submit"]');

  const showStatus = (message, ok) => {
    status.textContent = '';
    status.className = `text-sm min-h-[1.25rem] ${ok ? 'text-emerald-400' : 'text-red-400'}`;
    if (typeof message === 'string') status.textContent = message;
    else status.append(...message);
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const data = Object.fromEntries(new FormData(form));
    if (data._honey) return; // bot

    const name = data.name.trim();
    const email = data.email.trim();
    const message = data.message.trim();

    button.disabled = true;
    button.textContent = 'Sending…';

    try {
      const res = await fetch(`https://formsubmit.co/ajax/${CONTACT_EMAIL}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name,
          email,
          message,
          _subject: `Portfolio message from ${name}`,
          _replyto: email,
          _template: 'table',
        }),
      });
      const result = await res.json().catch(() => ({}));
      if (!res.ok || String(result.success) !== 'true') throw new Error(result.message || 'Send failed');

      form.reset();
      showStatus('Thanks! Your message has been sent. I\'ll get back to you soon.', true);
    } catch (err) {
      const subject = encodeURIComponent(`Message from ${name}`);
      const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
      const link = document.createElement('a');
      link.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
      link.className = 'underline font-semibold';
      link.textContent = 'send it by email instead';
      // Surface FormSubmit's own reason (e.g. "This form needs Activation") when it gives one.
      const reason = err.message && err.message !== 'Send failed' && err.message !== 'Failed to fetch' ? ` (${err.message})` : '';
      showStatus([`Sorry, the message couldn't be sent${reason}. Please `, link, '.'], false);
    } finally {
      button.disabled = false;
      button.textContent = 'Send Message';
    }
  });
}

// Reveal .enter-element blocks as they scroll into view. The About-page
// .journey timeline uses the same trigger to start its line-and-steps animation.
function initEntranceAnimations() {
  const elements = document.querySelectorAll('.enter-element, .journey');
  if (!('IntersectionObserver' in window)) {
    elements.forEach(el => el.classList.add('enter-up'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('enter-up');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  elements.forEach(el => observer.observe(el));
}

document.addEventListener('DOMContentLoaded', () => {
  setFooterYear();
  setActiveNav();
  initMobileMenu();
  initContactForm();
  initEntranceAnimations();
});
