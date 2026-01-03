/* Main shared JS for navigation, mobile menu, footer year, and form demo */
function toggleMobileMenu() {
  const m = document.getElementById('mobileMenu');
  if (m) m.classList.toggle('hidden');
}

function handleSubmit(e) {
  e.preventDefault();
  
  // Get form values
  const name = document.getElementById('nameField').value.trim();
  const email = document.getElementById('emailField').value.trim();
  const message = document.getElementById('messageField').value.trim();
  
  // Create mailto link with form data
  const subject = encodeURIComponent(`Message from ${name}`);
  const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
  const mailtoLink = `mailto:alpatson-cobbina.siaw@student.junia.com?subject=${subject}&body=${body}`;
  
  // Open the user's email client
  window.location.href = mailtoLink;
  
  // Reset form after a short delay
  setTimeout(() => {
    e.target.reset();
  }, 300);
  
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

// Typewriter effect with shaking animation
function typewriterEffect(element, text, speed = 100) {
  element.textContent = ''; // Clear the element
  element.classList.add('typing-shake'); // Add shaking class
  let index = 0;
  
  function type() {
    if (index < text.length) {
      element.textContent += text.charAt(index);
      index++;
      setTimeout(type, speed);
    } else {
      // Remove shaking when done typing
      element.classList.remove('typing-shake');
    }
  }
  
  type();
}

document.addEventListener('DOMContentLoaded', () => {
  setFooterYear();
  setActiveNav();

  // Apply typewriter effect to the h1 heading (entire title)
  const h1Element = document.querySelector('h1');
  if (h1Element) {
    // Clear the h1 but keep structure
    h1Element.innerHTML = 'Hi, I\'m <span class="gradient-text"></span>';
    const gradientSpan = h1Element.querySelector('.gradient-text');
    const fullText = 'Alpatson';
    
    // Add shaking to h1 while typing
    h1Element.classList.add('typing-shake');
    
    typewriterEffect(gradientSpan, fullText, 120); // 120ms between each letter
    
    // Remove shake from h1 after typing is done
    setTimeout(() => {
      h1Element.classList.remove('typing-shake');
    }, fullText.length * 120);
  }

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