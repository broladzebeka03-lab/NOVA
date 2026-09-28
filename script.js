/**
 * NEXUS - Interactive JavaScript Logic
 * Handles: Preloader, Navigation, ScrollSpy, Animations, Form Validation & Toast
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const preloader = document.getElementById('preloader');
  const progressBar = document.getElementById('preloader-progress');
  const progressNumber = document.getElementById('preloader-number');
  const progressStep = document.getElementById('preloader-step');
  const header = document.getElementById('header');
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const contactForm = document.getElementById('contact-form');
  const submitBtn = document.getElementById('submit-btn');
  const toastContainer = document.getElementById('toast-container');
  const backToTopBtn = document.getElementById('back-to-top');
  const replayLoaderBtn = document.getElementById('btn-replay-loader');
  const sections = document.querySelectorAll('section[id]');

  // Lock scroll while preloader is active
  document.body.classList.add('loader-active');

  /* ==========================================================================
     1. PRELOADER LOGIC
     ========================================================================== */
  const steps = [
    { at: 15, text: 'Initiating neural core...' },
    { at: 40, text: 'Synchronizing edge nodes...' },
    { at: 70, text: 'Optimizing high-throughput pipeline...' },
    { at: 90, text: 'Finalizing security matrix...' },
    { at: 100, text: 'Nexus ready.' }
  ];

  function runPreloader(callback) {
    let progress = 0;
    progressBar.style.width = '0%';
    progressNumber.textContent = '0%';
    preloader.classList.remove('fade-out');
    document.body.classList.remove('loaded');
    document.body.classList.add('loader-active');

    const interval = setInterval(() => {
      // Non-linear progress increment
      const increment = Math.floor(Math.random() * 8) + 3;
      progress = Math.min(progress + increment, 100);

      progressBar.style.width = `${progress}%`;
      progressNumber.textContent = `${progress}%`;

      // Update descriptive step text
      for (let i = steps.length - 1; i >= 0; i--) {
        if (progress >= steps[i].at) {
          progressStep.textContent = steps[i].text;
          break;
        }
      }

      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          preloader.classList.add('fade-out');
          document.body.classList.remove('loader-active');
          document.body.classList.add('loaded');
          if (callback) callback();
        }, 350);
      }
    }, 45);
  }

  // Start initial loading
  runPreloader();

  // Allow replaying loading screen for demo / testing
  if (replayLoaderBtn) {
    replayLoaderBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => {
        runPreloader();
      }, 300);
    });
  }

  /* ==========================================================================
     2. NAVIGATION & STICKY HEADER
     ========================================================================== */
  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    // Header background blur on scroll
    if (scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Back to top button visibility
    if (scrollY > 400) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }

    // ScrollSpy for Active Nav Link
    let currentSection = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  });

  // Mobile Toggle Menu
  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      mobileToggle.classList.toggle('open');
      mobileToggle.setAttribute('aria-expanded', isOpen);
    });
  }

  // Close mobile menu on clicking any navigation link
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      if (navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
        mobileToggle.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // Close mobile menu on clicking outside
  document.addEventListener('click', (e) => {
    if (navMenu.classList.contains('open') && !navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
      navMenu.classList.remove('open');
      mobileToggle.classList.remove('open');
      mobileToggle.setAttribute('aria-expanded', 'false');
    }
  });

  // Back to top click
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  /* ==========================================================================
     3. TOAST NOTIFICATION UTILITY
     ========================================================================== */
  function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
      <span>${message}</span>
    `;

    toastContainer.appendChild(toast);

    // Trigger animation in next frame
    requestAnimationFrame(() => {
      toast.classList.add('show');
    });

    // Remove after 4 seconds
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        toast.remove();
      }, 400);
    }, 4000);
  }

  /* ==========================================================================
     4. CONTACT FORM VALIDATION & SUBMISSION
     ========================================================================== */
  if (contactForm) {
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const subjectSelect = document.getElementById('subject');
    const messageInput = document.getElementById('message');

    // Email regex validator
    const isValidEmail = (email) => {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    // Helper to toggle error class
    const validateField = (input, condition) => {
      const formGroup = input.closest('.form-group');
      if (!condition) {
        formGroup.classList.add('has-error');
        return false;
      } else {
        formGroup.classList.remove('has-error');
        return true;
      }
    };

    // Live clear error on typing
    [nameInput, emailInput, subjectSelect, messageInput].forEach(field => {
      if (field) {
        field.addEventListener('input', () => {
          field.closest('.form-group').classList.remove('has-error');
        });
      }
    });

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const isNameValid = validateField(nameInput, nameInput.value.trim().length >= 2);
      const isEmailValid = validateField(emailInput, isValidEmail(emailInput.value.trim()));
      const isSubjectValid = validateField(subjectSelect, subjectSelect.value !== '');
      const isMessageValid = validateField(messageInput, messageInput.value.trim().length >= 10);

      if (isNameValid && isEmailValid && isSubjectValid && isMessageValid) {
        // Show simulated loading state
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;

        setTimeout(() => {
          submitBtn.classList.remove('loading');
          submitBtn.disabled = false;
          
          const senderName = nameInput.value.trim();
          showToast(`Thank you, ${senderName}! Your message was delivered successfully.`);
          
          // Reset form
          contactForm.reset();
        }, 1200);
      }
    });
  }

  /* ==========================================================================
     5. DYNAMIC INTERACTIVE CARD TILT & GLOW
     ========================================================================== */
  const featureCards = document.querySelectorAll('.feature-card, .stat-box');
  featureCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
});
