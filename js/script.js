/**
 * ISLAM YASSER — JUNIOR DATA ANALYST PORTFOLIO
 * Vanilla JavaScript (ES6+)
 * 
 * Features:
 * 1. Dark / Light Theme Engine (Default Dark, LocalStorage sync, OS preference detection)
 * 2. Mobile Drawer Navigation & Backdrop (Accessible, Keyboard focus & Escape support)
 * 3. Active Nav Link ScrollSpy (IntersectionObserver)
 * 4. Scroll Reveal Animations (IntersectionObserver with graceful degradation)
 * 5. Back-to-Top Button with Smooth Scrolling
 * 6. Contact Form Validation, Accessible States & Submission Feedback
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* ==========================================================================
     1. Theme Switcher (Dark / Light)
     ========================================================================== */
  const themeToggleBtn = document.getElementById('themeToggle');
  const htmlRoot = document.documentElement;
  const THEME_STORAGE_KEY = 'islam_yasser_portfolio_theme';

  /**
   * Initializes theme based on localStorage, system preference, or default dark.
   */
  const initTheme = () => {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);

    if (savedTheme === 'light' || savedTheme === 'dark') {
      applyTheme(savedTheme);
    } else {
      // Default is dark mode per project requirements
      applyTheme('dark');
    }
  };

  /**
   * Applies the requested theme to document and updates button metadata.
   * @param {'dark' | 'light'} theme 
   */
  const applyTheme = (theme) => {
    htmlRoot.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_STORAGE_KEY, theme);

    if (themeToggleBtn) {
      themeToggleBtn.setAttribute(
        'aria-label',
        theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'
      );
      themeToggleBtn.setAttribute(
        'title',
        theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'
      );
    }
  };

  /**
   * Toggles theme between dark and light.
   */
  const toggleTheme = () => {
    const currentTheme = htmlRoot.getAttribute('data-theme') || 'dark';
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme);
  };

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', toggleTheme);
  }

  // Initialize theme on load
  initTheme();

  /* ==========================================================================
     2. Mobile Menu & Drawer
     ========================================================================== */
  const menuToggleBtn = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');
  const drawerBackdrop = document.getElementById('drawerBackdrop');
  const navLinks = document.querySelectorAll('.nav-link');

  const openMobileMenu = () => {
    if (!navMenu || !menuToggleBtn) return;
    navMenu.classList.add('open');
    if (drawerBackdrop) drawerBackdrop.classList.add('active');
    menuToggleBtn.setAttribute('aria-expanded', 'true');
    menuToggleBtn.setAttribute('aria-label', 'Close Navigation Menu');
    document.body.style.overflow = 'hidden';
  };

  const closeMobileMenu = () => {
    if (!navMenu || !menuToggleBtn) return;
    navMenu.classList.remove('open');
    if (drawerBackdrop) drawerBackdrop.classList.remove('active');
    menuToggleBtn.setAttribute('aria-expanded', 'false');
    menuToggleBtn.setAttribute('aria-label', 'Open Navigation Menu');
    document.body.style.overflow = '';
  };

  if (menuToggleBtn) {
    menuToggleBtn.addEventListener('click', () => {
      const isOpen = navMenu && navMenu.classList.contains('open');
      if (isOpen) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });
  }

  if (drawerBackdrop) {
    drawerBackdrop.addEventListener('click', closeMobileMenu);
  }

  // Close drawer when clicking any navigation link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        closeMobileMenu();
      }
    });
  });

  // Close drawer on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu && navMenu.classList.contains('open')) {
      closeMobileMenu();
      if (menuToggleBtn) menuToggleBtn.focus();
    }
  });

  /* ==========================================================================
     3. ScrollSpy & Active Nav Link Highlight
     ========================================================================== */
  const sections = document.querySelectorAll('section[id]');

  const updateActiveNavLink = () => {
    const scrollPos = window.scrollY + 120;
    const documentHeight = document.documentElement.scrollHeight;
    const windowHeight = window.innerHeight;

    // If reached bottom of the page, activate contact link
    if (window.scrollY + windowHeight >= documentHeight - 50) {
      navLinks.forEach(link => link.classList.remove('active'));
      const contactLink = document.querySelector('.nav-link[href="#contact"]');
      if (contactLink) contactLink.classList.add('active');
      return;
    }

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', updateActiveNavLink, { passive: true });
  updateActiveNavLink();

  /* ==========================================================================
     4. Scroll Reveal Animations (IntersectionObserver)
     ========================================================================== */
  const revealElements = document.querySelectorAll('.reveal-on-scroll');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Graceful fallback for older browsers
    revealElements.forEach(el => el.classList.add('reveal-visible'));
  }

  /* ==========================================================================
     5. Back to Top Button
     ========================================================================== */
  const backToTopBtn = document.getElementById('backToTop');

  const toggleBackToTop = () => {
    if (!backToTopBtn) return;
    if (window.scrollY > 400) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  };

  window.addEventListener('scroll', toggleBackToTop, { passive: true });
  toggleBackToTop();

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  /* ==========================================================================
     6. Accessible Contact Form Validation & Submission
     ========================================================================== */
  const contactForm = document.getElementById('contactForm');
  const nameInput = document.getElementById('fullName');
  const emailInput = document.getElementById('emailAddress');
  const subjectInput = document.getElementById('messageSubject');
  const messageInput = document.getElementById('formMessage');
  const formStatus = document.getElementById('formStatus');
  const submitBtn = document.getElementById('submitBtn');

  // Error message helper elements
  const nameError = document.getElementById('nameError');
  const emailError = document.getElementById('emailError');
  const subjectError = document.getElementById('subjectError');
  const messageError = document.getElementById('messageError');

  /**
   * Validates standard email address syntax.
   * @param {string} email 
   * @returns {boolean}
   */
  const isValidEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(String(email).trim());
  };

  /**
   * Clears all validation error indicators.
   */
  const clearErrors = () => {
    [nameInput, emailInput, subjectInput, messageInput].forEach(field => {
      if (field) field.classList.remove('invalid');
    });
    [nameError, emailError, subjectError, messageError].forEach(el => {
      if (el) el.textContent = '';
    });
    if (formStatus) {
      formStatus.className = 'form-status';
      formStatus.textContent = '';
    }
  };

  // Live input error clearing on user typing
  if (nameInput) {
    nameInput.addEventListener('input', () => {
      nameInput.classList.remove('invalid');
      if (nameError) nameError.textContent = '';
    });
  }
  if (emailInput) {
    emailInput.addEventListener('input', () => {
      emailInput.classList.remove('invalid');
      if (emailError) emailError.textContent = '';
    });
  }
  if (subjectInput) {
    subjectInput.addEventListener('input', () => {
      subjectInput.classList.remove('invalid');
      if (subjectError) subjectError.textContent = '';
    });
  }
  if (messageInput) {
    messageInput.addEventListener('input', () => {
      messageInput.classList.remove('invalid');
      if (messageError) messageError.textContent = '';
    });
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      clearErrors();

      let hasError = false;

      // Validate Name
      const nameVal = nameInput ? nameInput.value.trim() : '';
      if (!nameVal || nameVal.length < 2) {
        if (nameInput) nameInput.classList.add('invalid');
        if (nameError) nameError.textContent = 'Please enter your full name (minimum 2 characters).';
        hasError = true;
      }

      // Validate Email
      const emailVal = emailInput ? emailInput.value.trim() : '';
      if (!emailVal || !isValidEmail(emailVal)) {
        if (emailInput) emailInput.classList.add('invalid');
        if (emailError) emailError.textContent = 'Please provide a valid email address.';
        hasError = true;
      }

      // Validate Subject
      const subjectVal = subjectInput ? subjectInput.value.trim() : '';
      if (!subjectVal || subjectVal.length < 3) {
        if (subjectInput) subjectInput.classList.add('invalid');
        if (subjectError) subjectError.textContent = 'Please specify a subject for your message.';
        hasError = true;
      }

      // Validate Message
      const messageVal = messageInput ? messageInput.value.trim() : '';
      if (!messageVal || messageVal.length < 10) {
        if (messageInput) messageInput.classList.add('invalid');
        if (messageError) messageError.textContent = 'Please enter your message (at least 10 characters).';
        hasError = true;
      }

      if (hasError) {
        // Focus on first invalid field
        const firstInvalid = contactForm.querySelector('.form-input.invalid, .form-textarea.invalid');
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      // Simulate sending feedback
      if (submitBtn) {
        submitBtn.disabled = true;
        const btnText = submitBtn.querySelector('.btn-text');
        if (btnText) btnText.textContent = 'Sending...';
      }

      setTimeout(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          const btnText = submitBtn.querySelector('.btn-text');
          if (btnText) btnText.textContent = 'Send Message';
        }

        if (formStatus) {
          formStatus.className = 'form-status success';
          formStatus.innerHTML = `
            <strong>Message Prepared!</strong> Thank you, <strong>${escapeHtml(nameVal)}</strong>. Your inquiry regarding <em>"${escapeHtml(subjectVal)}"</em> has been received. You can also connect directly via <a href="mailto:islamyasser424@gmail.com" style="text-decoration: underline; font-weight: 600;">islamyasser424@gmail.com</a>.
          `;
        }

        // Reset the form
        contactForm.reset();
      }, 700);
    });
  }

  /* ==========================================================================
     7. Interactive Project Filtering (All / Power BI / Excel)
     ========================================================================== */
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card[data-category]');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const selectedFilter = btn.getAttribute('data-filter');

      // Update active filter button
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Filter project cards
      projectCards.forEach(card => {
        const cardCat = card.getAttribute('data-category');
        if (selectedFilter === 'all' || cardCat === selectedFilter) {
          card.classList.remove('is-hidden');
          // Re-trigger reveal animation
          card.classList.add('reveal-visible');
        } else {
          card.classList.add('is-hidden');
        }
      });
    });
  });

  /* ==========================================================================
     8. 3D Dynamic Tilt Interaction on Profile Avatar
     ========================================================================== */
  const avatarWrapper = document.getElementById('profileAvatarWrapper');
  const avatarFrame = avatarWrapper ? avatarWrapper.querySelector('.avatar-frame') : null;

  if (avatarWrapper && avatarFrame) {
    avatarWrapper.addEventListener('mousemove', (e) => {
      const rect = avatarWrapper.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -14;
      const rotateY = ((x - centerX) / centerX) * 14;

      avatarFrame.style.transform = `perspective(800px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.05, 1.05, 1.05)`;
    });

    avatarWrapper.addEventListener('mouseleave', () => {
      avatarFrame.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  }

  /**
   * Simple HTML escaping helper for safe feedback rendering.
   * @param {string} str 
   * @returns {string}
   */
  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
});
