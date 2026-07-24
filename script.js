/**
 * NorthPeak Digital — script.js
 * Handles:
 *   1. Sticky navbar scroll shadow
 *   2. Mobile hamburger menu toggle
 *   3. Active nav link highlight on scroll
 *   4. Card entrance fade-up animation (testimonials + pricing)
 *   5. Contact form client-side validation + success message
 */

'use strict';

/* -------------------------------------------------------
   DOM REFERENCES
   ------------------------------------------------------- */
const navbar     = document.getElementById('navbar');
const hamburger  = document.getElementById('hamburger');
const navLinks   = document.getElementById('nav-links');
const navItems   = document.querySelectorAll('.nav-link');
const sections   = document.querySelectorAll('main section[id]');

const contactForm = document.getElementById('contact-form');
const successMsg  = document.getElementById('success-msg');
const resetBtn    = document.getElementById('reset-btn');

/* -------------------------------------------------------
   1. STICKY NAVBAR — add shadow class on scroll
   ------------------------------------------------------- */
function handleNavbarScroll() {
  if (window.scrollY > 10) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', handleNavbarScroll, { passive: true });
// Run once on load to set initial state
handleNavbarScroll();

/* -------------------------------------------------------
   2. MOBILE HAMBURGER MENU TOGGLE
   ------------------------------------------------------- */
hamburger.addEventListener('click', function () {
  const isOpen = navLinks.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', String(isOpen));
  hamburger.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
});

/* Shared helper: closes the mobile nav and resets ARIA state */
function closeMobileMenu() {
  navLinks.classList.remove('open');
  hamburger.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
  hamburger.setAttribute('aria-label', 'Open navigation menu');
}

// Close mobile menu when a nav link is clicked
navItems.forEach(function (link) {
  link.addEventListener('click', closeMobileMenu);
});

// Ensure pricing CTA buttons always scroll to the contact section
const pricingCtas = document.querySelectorAll('.pricing-card a[href="#contact"]');
pricingCtas.forEach(function (link) {
  link.addEventListener('click', function (event) {
    event.preventDefault();
    const contactSection = document.getElementById('contact');
    if (!contactSection) return;
    contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    history.replaceState(null, '', '#contact');
  });
});

// Close mobile menu on outside click
document.addEventListener('click', function (event) {
  const clickedInside = navLinks.contains(event.target) || hamburger.contains(event.target);
  if (!clickedInside && navLinks.classList.contains('open')) {
    closeMobileMenu();
  }
});

/* -------------------------------------------------------
   3. ACTIVE NAV LINK ON SCROLL (Intersection Observer)
   ------------------------------------------------------- */
const observerOptions = {
  root: null,
  rootMargin: '-40% 0px -55% 0px',
  threshold: 0
};

const sectionObserver = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navItems.forEach(function (link) {
        const href = link.getAttribute('href');
        if (href === '#' + id) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    }
  });
}, observerOptions);

sections.forEach(function (section) {
  sectionObserver.observe(section);
});

/* -------------------------------------------------------
   4. CARD ENTRANCE ANIMATION (fade-up on scroll)
   Adds .is-visible once each card enters the viewport.
   Only fires once per card; observer disconnects after.
   ------------------------------------------------------- */
const animatedCards = document.querySelectorAll('.testimonial-card, .pricing-card');

if (animatedCards.length > 0) {
  const cardObserver = new IntersectionObserver(function (entries, observer) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target); // fire once only
      }
    });
  }, {
    root: null,
    rootMargin: '0px 0px -60px 0px', // trigger slightly before card fully appears
    threshold: 0.1
  });

  animatedCards.forEach(function (card) {
    cardObserver.observe(card);
  });
}

/* On page load: form is visible, success message is hidden.
   CSS sets .success-msg { display: none } by default.
   JS adds/removes .show class to reveal it with animation. */

/**
 * Validates a single field and updates its error state.
 * @param {HTMLElement} input  - The input or textarea element
 * @param {HTMLElement} errEl  - The error message span element
 * @returns {boolean} true if valid, false otherwise
 */
function validateField(input, errEl) {
  const value = input.value.trim();
  let errorMsg = '';

  if (input.id === 'name') {
    if (value.length === 0) {
      errorMsg = 'Please enter your full name.';
    } else if (value.length < 2) {
      errorMsg = 'Name must be at least 2 characters.';
    }
  }

  if (input.id === 'email') {
    if (value.length === 0) {
      errorMsg = 'Please enter your email address.';
    } else if (!isValidEmail(value)) {
      errorMsg = 'Please enter a valid email address (e.g. you@example.com).';
    }
  }

  if (input.id === 'message') {
    if (value.length === 0) {
      errorMsg = 'Please enter your message.';
    } else if (value.length < 10) {
      errorMsg = 'Message must be at least 10 characters.';
    }
  }

  if (errorMsg) {
    showError(input, errEl, errorMsg);
    return false;
  } else {
    clearError(input, errEl);
    return true;
  }
}

/**
 * Returns true if the given string matches a valid email pattern.
 * @param {string} email
 * @returns {boolean}
 */
function isValidEmail(email) {
  // RFC-compliant simple pattern
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

/**
 * Marks a field as invalid and shows an error message.
 */
function showError(input, errEl, message) {
  input.classList.add('input-error');
  input.setAttribute('aria-invalid', 'true');
  errEl.textContent = message;
}

/**
 * Clears a field's error state.
 */
function clearError(input, errEl) {
  input.classList.remove('input-error');
  input.setAttribute('aria-invalid', 'false');
  errEl.textContent = '';
}

// Validate each field on blur (when user leaves the field)
const nameInput    = document.getElementById('name');
const emailInput   = document.getElementById('email');
const messageInput = document.getElementById('message');

const nameErr    = document.getElementById('name-err');
const emailErr   = document.getElementById('email-err');
const messageErr = document.getElementById('message-err');

nameInput.addEventListener('blur',    function () { validateField(nameInput,    nameErr); });
emailInput.addEventListener('blur',   function () { validateField(emailInput,   emailErr); });
messageInput.addEventListener('blur', function () { validateField(messageInput, messageErr); });

// Clear error as user starts typing again
[nameInput, emailInput, messageInput].forEach(function (input) {
  input.addEventListener('input', function () {
    const errEl = document.getElementById(input.id + '-err');
    if (input.classList.contains('input-error')) {
      clearError(input, errEl);
    }
  });
});

/* Form submission handler */
contactForm.addEventListener('submit', function (event) {
  event.preventDefault();

  // Validate all fields
  const isNameValid    = validateField(nameInput,    nameErr);
  const isEmailValid   = validateField(emailInput,   emailErr);
  const isMessageValid = validateField(messageInput, messageErr);

  if (!isNameValid || !isEmailValid || !isMessageValid) {
    // Focus the first invalid field for accessibility
    if (!isNameValid)         nameInput.focus();
    else if (!isEmailValid)   emailInput.focus();
    else                      messageInput.focus();
    return;
  }

  // All valid — hide form and show success message
  contactForm.hidden = true;
  successMsg.classList.add('show');
  successMsg.focus();
});

/* Reset form button (inside success message) */
resetBtn.addEventListener('click', function () {
  // Clear form fields
  contactForm.reset();
  [nameInput, emailInput, messageInput].forEach(function (input) {
    const errEl = document.getElementById(input.id + '-err');
    clearError(input, errEl);
  });

  // Show form, hide success message
  successMsg.classList.remove('show');
  contactForm.hidden = false;
  nameInput.focus();
});
