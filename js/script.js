/**
 * ISLAM YASSER — DATA ANALYST PORTFOLIO
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
     5b. Top Reading Scroll Progress Bar
     ========================================================================== */
  const scrollProgressBar = document.getElementById('scrollProgressBar');
  const updateScrollProgress = () => {
    if (!scrollProgressBar) return;
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollProgressBar.style.width = `${Math.min(progress, 100)}%`;
  };

  window.addEventListener('scroll', updateScrollProgress, { passive: true });
  updateScrollProgress();

  /* ==========================================================================
     5c. Animated Numerical Metric Counters (CountUp on Scroll)
     ========================================================================== */
  const counterElements = document.querySelectorAll('[data-counter]');

  const animateCounter = (el) => {
    const target = parseFloat(el.getAttribute('data-counter'));
    if (isNaN(target)) return;

    const prefix = el.getAttribute('data-prefix') || '';
    const suffix = el.getAttribute('data-suffix') || '';
    const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
    const useComma = el.getAttribute('data-format') === 'comma';
    const duration = parseInt(el.getAttribute('data-duration') || '1800', 10);

    const startTime = performance.now();

    const updateCount = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = target * ease;

      const formattedVal = useComma
        ? Math.round(current).toLocaleString('en-US')
        : current.toFixed(decimals);

      el.textContent = `${prefix}${formattedVal}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        const finalVal = useComma
          ? Math.round(target).toLocaleString('en-US')
          : target.toFixed(decimals);
        el.textContent = `${prefix}${finalVal}${suffix}`;
      }
    };

    requestAnimationFrame(updateCount);
  };

  if ('IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.15
    });

    counterElements.forEach(el => counterObserver.observe(el));
  } else {
    counterElements.forEach(el => animateCounter(el));
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

      // Real message delivery via FormSubmit AJAX
      if (submitBtn) {
        submitBtn.disabled = true;
        const btnText = submitBtn.querySelector('.btn-text');
        if (btnText) btnText.textContent = 'Sending...';
      }

      if (formStatus) {
        formStatus.className = 'form-status';
        formStatus.textContent = 'Sending message...';
      }

      const formattedSubject = `Portfolio Form Submission - ${nameVal}`;

      // Synchronize hidden inputs for fallback consistency
      const hiddenSubject = document.getElementById('formSubmitSubject');
      if (hiddenSubject) {
        hiddenSubject.value = formattedSubject;
      }
      const hiddenReplyTo = document.getElementById('formSubmitReplyTo');
      if (hiddenReplyTo) {
        hiddenReplyTo.value = emailVal;
      }

      // If opened locally as a file:/// URL, FormSubmit requires an HTTP/HTTPS web origin
      if (window.location.protocol === 'file:') {
        if (submitBtn) {
          submitBtn.disabled = false;
          const btnText = submitBtn.querySelector('.btn-text');
          if (btnText) btnText.textContent = 'Send Message';
        }
        if (formStatus) {
          formStatus.className = 'form-status info';
          const liveUrl = 'https://islamyasser424-design.github.io/portfolio-/';
          const mailtoUrl = `mailto:islamyasser424@gmail.com?subject=${encodeURIComponent(formattedSubject)}&body=${encodeURIComponent('From: ' + nameVal + ' (' + emailVal + ')\nSubject: ' + subjectVal + '\n\n' + messageVal)}`;
          formStatus.innerHTML = `
            <strong>Local File Notice:</strong> FormSubmit requires a live web server. Please test directly on your live website: <a href="${liveUrl}" target="_blank" rel="noopener noreferrer" style="text-decoration: underline; font-weight: bold; color: inherit;">Open Live Website</a>, or <a href="${mailtoUrl}" style="text-decoration: underline; font-weight: bold; color: inherit;">Send via Email Client</a>.
          `;
        }
        return;
      }

      fetch('https://formsubmit.co/ajax/6bdfb41e98e1b15c450012845bcce703', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          Name: nameVal,
          Email: emailVal,
          Subject: subjectVal,
          Message: messageVal,
          _subject: formattedSubject,
          _replyto: emailVal,
          _template: 'table',
          _captcha: 'false'
        })
      })
      .then(response => response.json())
      .then(data => {
        if (submitBtn) {
          submitBtn.disabled = false;
          const btnText = submitBtn.querySelector('.btn-text');
          if (btnText) btnText.textContent = 'Send Message';
        }

        if (data.success === 'true' || data.success === true) {
          if (formStatus) {
            formStatus.className = 'form-status success';
            formStatus.innerHTML = `
              <strong>Message Sent Successfully!</strong> Thank you, <strong>${escapeHtml(nameVal)}</strong>. Your message has been delivered directly to Islam Yasser.
            `;
          }
          contactForm.reset();
        } else {
          if (formStatus) {
            formStatus.className = 'form-status info';
            const mailtoUrl = `mailto:islamyasser424@gmail.com?subject=${encodeURIComponent(formattedSubject)}&body=${encodeURIComponent('From: ' + nameVal + ' (' + emailVal + ')\nSubject: ' + subjectVal + '\n\n' + messageVal)}`;
            formStatus.innerHTML = `
              <strong>Note:</strong> ${escapeHtml(data.message || 'Please send directly via email')}. <a href="${mailtoUrl}" style="text-decoration: underline; font-weight: bold; color: inherit;">Click to Send Email</a>
            `;
          }
        }
      })
      .catch(error => {
        console.error('Submission notice:', error);
        if (submitBtn) {
          submitBtn.disabled = false;
          const btnText = submitBtn.querySelector('.btn-text');
          if (btnText) btnText.textContent = 'Send Message';
        }

        if (formStatus) {
          formStatus.className = 'form-status info';
          const mailtoUrl = `mailto:islamyasser424@gmail.com?subject=${encodeURIComponent(formattedSubject)}&body=${encodeURIComponent('From: ' + nameVal + ' (' + emailVal + ')\nSubject: ' + subjectVal + '\n\n' + messageVal)}`;
          formStatus.innerHTML = `
            <strong>Send Directly:</strong> Click here to send via your email client: <a href="${mailtoUrl}" style="text-decoration: underline; font-weight: bold; color: inherit;">Send Email to islamyasser424@gmail.com</a>
          `;
        }
      });
    });
  }

  /* ==========================================================================
     7. Unified Project Search & Category Filtering System
     ========================================================================== */
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card[data-category]');
  const projectSearchInput = document.getElementById('projectSearchInput');
  const clearSearchBtn = document.getElementById('clearSearchBtn');
  const searchResultsCount = document.getElementById('projectSearchResultsCount');

  let currentCategory = 'all';
  let currentSearchQuery = '';

  const applyProjectFilters = () => {
    let visibleIdx = 0;
    let matchCount = 0;

    projectCards.forEach(card => {
      const cardCat = card.getAttribute('data-category');
      const matchesCategory = (currentCategory === 'all' || cardCat === currentCategory);

      // Search matching across card title, tool tags, and textual content
      let matchesSearch = true;
      if (currentSearchQuery.length > 0) {
        const titleText = (card.querySelector('.project-title')?.textContent || '').toLowerCase();
        const toolsText = (card.querySelector('.project-tools-wrap')?.textContent || '').toLowerCase();
        const bodyText = (card.querySelector('.project-body')?.textContent || '').toLowerCase();
        const fullCardText = `${titleText} ${toolsText} ${bodyText}`;
        matchesSearch = fullCardText.includes(currentSearchQuery);
      }

      if (matchesCategory && matchesSearch) {
        card.classList.remove('is-hidden');
        card.classList.remove('filter-animate-in');
        // Force layout reflow to retrigger CSS animation cleanly
        void card.offsetWidth;
        card.style.animationDelay = `${visibleIdx * 40}ms`;
        card.classList.add('filter-animate-in');
        card.classList.add('reveal-visible');
        visibleIdx++;
        matchCount++;
      } else {
        card.classList.add('is-hidden');
        card.classList.remove('filter-animate-in');
      }
    });

    // Update Live Search Feedback
    if (searchResultsCount) {
      if (currentSearchQuery.length > 0) {
        searchResultsCount.style.display = 'block';
        if (matchCount === 0) {
          searchResultsCount.innerHTML = `No projects found matching "<strong>${escapeHtml(currentSearchQuery)}</strong>" in the selected view. Try a different keyword or switch to "All Projects".`;
        } else {
          searchResultsCount.innerHTML = `Showing <strong>${matchCount}</strong> of <strong>${projectCards.length}</strong> projects matching "<strong>${escapeHtml(currentSearchQuery)}</strong>"`;
        }
      } else {
        searchResultsCount.style.display = 'none';
        searchResultsCount.innerHTML = '';
      }
    }

    // Toggle clear button
    if (clearSearchBtn) {
      clearSearchBtn.style.display = currentSearchQuery.length > 0 ? 'inline-flex' : 'none';
    }
  };

  // Filter Buttons
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      currentCategory = btn.getAttribute('data-filter') || 'all';
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      applyProjectFilters();
    });
  });

  // Search Input Listener
  if (projectSearchInput) {
    projectSearchInput.addEventListener('input', (e) => {
      currentSearchQuery = e.target.value.trim().toLowerCase();
      applyProjectFilters();
    });

    projectSearchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        projectSearchInput.value = '';
        currentSearchQuery = '';
        applyProjectFilters();
      }
    });
  }

  // Clear Search Button
  if (clearSearchBtn) {
    clearSearchBtn.addEventListener('click', () => {
      if (projectSearchInput) {
        projectSearchInput.value = '';
        projectSearchInput.focus();
      }
      currentSearchQuery = '';
      applyProjectFilters();
    });
  }

  /* ==========================================================================
     8. Interactive Cursor Spotlight Glow on Glass Cards
     ========================================================================== */
  const isFinePointer = window.matchMedia('(pointer: fine)').matches;
  if (isFinePointer) {
    const glassCards = document.querySelectorAll('.glass-card');
    let ticking = false;

    window.addEventListener('mousemove', (e) => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const clientX = e.clientX;
          const clientY = e.clientY;

          glassCards.forEach(card => {
            const rect = card.getBoundingClientRect();
            if (
              clientX >= rect.left - 80 &&
              clientX <= rect.right + 80 &&
              clientY >= rect.top - 80 &&
              clientY <= rect.bottom + 80
            ) {
              const x = clientX - rect.left;
              const y = clientY - rect.top;
              card.style.setProperty('--mouse-x', `${x}px`);
              card.style.setProperty('--mouse-y', `${y}px`);
            }
          });
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* ==========================================================================
     8b. 3D Dynamic Tilt Interaction on Profile Avatar
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

  /* ==========================================================================
     8c. Interactive Dynamic Dashboard Mockup Controller (Hero Section)
     ========================================================================== */
  const dashboardMockup = document.getElementById('dashboardMockup');
  const mockupFileName = document.getElementById('mockupFileName');
  const mockupDaxCode = document.getElementById('mockupDaxCode');
  const copyDaxBtn = document.getElementById('copyDaxBtn');
  const copyDaxTooltip = document.getElementById('copyDaxTooltip');
  const mockupRefreshBtn = document.getElementById('mockupRefreshBtn');
  const mockupStatusText = document.getElementById('mockupStatusText');
  const mockupChartTitle = document.getElementById('mockupChartTitle');
  const legendText1 = document.getElementById('legendText1');
  const legendText2 = document.getElementById('legendText2');
  const svgChartContainer = document.getElementById('svgChartContainer');
  const chartTooltipBadge = document.getElementById('chartTooltipBadge');
  const mockupPolyline1 = document.getElementById('mockupPolyline1');
  const mockupPolyline2 = document.getElementById('mockupPolyline2');
  const mockupAreaPolygon = document.getElementById('mockupAreaPolygon');
  const mockupPointsGroup = document.getElementById('mockupPointsGroup');
  const chartCrosshair = document.getElementById('chartCrosshair');
  const activeScanPoint = document.getElementById('activeScanPoint');
  const modelTabBtns = document.querySelectorAll('.model-tab-btn');
  const metricCards = document.querySelectorAll('#mockupMetricsGrid .metric-card');
  const modelRefreshInfo = document.getElementById('modelRefreshInfo');

  if (dashboardMockup && mockupFileName && mockupDaxCode) {
    const MOCKUP_MODELS = {
      ecommerce: {
        fileName: 'Operational_Analytics_V2.pbix',
        dax: 'Late_Delivery_Leakage = CALCULATE(SUM(Orders[FreightValue]), Orders[DeliveryDelayDays] > 0, Orders[OrderStatus] = "Delivered")',
        statusText: 'Active Star Schema',
        refreshInfo: 'Auto-refreshed via Power Query',
        metrics: [
          { label: 'Orders Audited', val: 99441, format: 'comma', prefix: '', suffix: '', pill: '+100% Star Schema', pillClass: 'pill-up', sub: 'Olist E-Commerce Project', color: 'text-cyan' },
          { label: 'Financial Analyzed', val: 2.29, decimals: 2, prefix: '$', suffix: 'M', pill: '9,994 Rows', pillClass: 'pill-neutral', sub: 'SuperStore BI Dashboard', color: 'text-blue' },
          { label: 'Operational Quality', val: 99.4, decimals: 1, prefix: '', suffix: '%', pill: 'QA Benchmark', pillClass: 'pill-emerald', sub: 'Multimodal Annotation QA', color: 'text-emerald' },
          { label: 'Interactive Reports', val: 9, prefix: '', suffix: ' Pages', pill: 'What-If Scenarios', pillClass: 'pill-blue', sub: 'Logistics Vision Fleet Model', color: 'text-amber' }
        ],
        chart: {
          title: 'Revenue & SLA Delivery Variance (Monthly Trend)',
          legend1: 'Delivered On-Time',
          legend2: 'Delayed SLA',
          line1: '0,85 50,75 100,80 150,55 200,60 250,35 300,45 350,25 400,30 450,15 500,20',
          line2: '0,110 50,105 100,102 150,95 200,90 250,82 300,80 350,70 400,65 450,58 500,52',
          polygon: '0,120 0,85 50,75 100,80 150,55 200,60 250,35 300,45 350,25 400,30 450,15 500,20 500,120',
          points: [
            { cx: 150, cy: 55, month: 'March', val1: '$145K (92.4%)', val2: '$11.8K (7.6%)' },
            { cx: 250, cy: 35, month: 'May', val1: '$184K (94.2%)', val2: '$11.3K (5.8%)' },
            { cx: 350, cy: 25, month: 'July', val1: '$210K (95.5%)', val2: '$9.9K (4.5%)' },
            { cx: 450, cy: 15, month: 'September', val1: '$242K (96.5%)', val2: '$8.8K (3.5%)' },
            { cx: 500, cy: 20, month: 'October', val1: '$268K (97.1%)', val2: '$7.9K (2.9%)' }
          ]
        }
      },
      callcenter: {
        fileName: 'Salla_ContactCenter_Operations.pbix',
        dax: 'Service_Level_% = DIVIDE(CALCULATE(SUM(Calls[Handled]), Calls[AnswerTime] <= 20), SUM(Calls[Offered]), 0)',
        statusText: '16 Call Agents Audited',
        refreshInfo: 'Live Deneb & HTML Visual Sync',
        metrics: [
          { label: 'Offered Calls', val: 1744885, format: 'comma', prefix: '', suffix: '', pill: '3 Months Ingested', pillClass: 'pill-up', sub: 'Salla Customer Operations', color: 'text-cyan' },
          { label: 'Handled Calls', val: 1721842, format: 'comma', prefix: '', suffix: '', pill: '98.7% Answer Rate', pillClass: 'pill-neutral', sub: '23,043 Abandoned Calls', color: 'text-blue' },
          { label: 'Service Level', val: 91.1, decimals: 1, prefix: '', suffix: '%', pill: '>80% Benchmark', pillClass: 'pill-emerald', sub: 'Within 20s Threshold', color: 'text-emerald' },
          { label: 'Avg Speed of Answer', val: 14.3, decimals: 1, prefix: '', suffix: 's', pill: 'ASA Weighted', pillClass: 'pill-blue', sub: 'Project C Best: 95.2% SL', color: 'text-amber' }
        ],
        chart: {
          title: 'Inbound Call Volume vs Service Level (Daily SLA Run)',
          legend1: 'Handled Inbound Calls',
          legend2: 'Abandonment Gap',
          line1: '0,95 50,88 100,70 150,60 200,40 250,45 300,30 350,38 400,20 450,25 500,15',
          line2: '0,118 50,115 100,112 150,108 200,105 250,100 300,98 350,92 400,88 450,85 500,80',
          polygon: '0,120 0,95 50,88 100,70 150,60 200,40 250,45 300,30 350,38 400,20 450,25 500,15 500,120',
          points: [
            { cx: 100, cy: 70, month: 'Week 2', val1: '21,400 Handled (98.2%)', val2: '1.8% Abandon' },
            { cx: 200, cy: 40, month: 'Week 4', val1: '26,850 Handled (98.9%)', val2: '1.1% Abandon' },
            { cx: 300, cy: 30, month: 'Week 6', val1: '28,120 Handled (99.1%)', val2: '0.9% Abandon' },
            { cx: 400, cy: 20, month: 'Week 8', val1: '30,410 Handled (99.3%)', val2: '0.7% Abandon' },
            { cx: 500, cy: 15, month: 'Week 12', val1: '32,200 Handled (99.5%)', val2: '0.5% Abandon' }
          ]
        }
      },
      financial: {
        fileName: 'SuperStore_Executive_BI.pbix',
        dax: 'Net_Profit_Margin = DIVIDE(SUM(Financials[Profit]), SUM(Financials[Sales]), 0)',
        statusText: 'Executive P&L Engine',
        refreshInfo: 'Cleaned via Power Query ELT',
        metrics: [
          { label: 'Total Revenue', val: 2297201, format: 'comma', prefix: '$', suffix: '', pill: '4 Global Regions', pillClass: 'pill-up', sub: 'US SuperStore Analytics', color: 'text-cyan' },
          { label: 'Net Profit', val: 286397, format: 'comma', prefix: '$', suffix: '', pill: '12.47% Profit Margin', pillClass: 'pill-neutral', sub: 'Technology High-Yield', color: 'text-blue' },
          { label: 'Discount Audited', val: 1429, format: 'comma', prefix: '', suffix: ' Orders', pill: 'High Discount Risk', pillClass: 'pill-emerald', sub: 'Profit Erosion Avoidance', color: 'text-emerald' },
          { label: 'SLA Delivery', val: 95.8, decimals: 1, prefix: '', suffix: '%', pill: 'Same-Day & Standard', pillClass: 'pill-blue', sub: 'Shipping Time Optimized', color: 'text-amber' }
        ],
        chart: {
          title: 'Quarterly Sales Revenue vs Profit Target Baseline',
          legend1: 'Quarterly Net Sales',
          legend2: 'Target Profit Baseline',
          line1: '0,105 50,92 100,85 150,78 200,62 250,50 300,55 350,35 400,40 450,22 500,18',
          line2: '0,115 50,110 100,106 150,100 200,94 250,88 300,82 350,75 400,70 450,64 500,60',
          polygon: '0,120 0,105 50,92 100,85 150,78 200,62 250,50 300,55 350,35 400,40 450,22 500,18 500,120',
          points: [
            { cx: 100, cy: 85, month: 'Q1', val1: '$420K Sales ($51K Profit)', val2: 'Target: $45K' },
            { cx: 200, cy: 62, month: 'Q2', val1: '$580K Sales ($72K Profit)', val2: 'Target: $65K' },
            { cx: 300, cy: 55, month: 'Q3', val1: '$640K Sales ($81K Profit)', val2: 'Target: $75K' },
            { cx: 400, cy: 40, month: 'Q4', val1: '$790K Sales ($104K Profit)', val2: 'Target: $90K' },
            { cx: 500, cy: 18, month: 'Annual Close', val1: '$860K Sales ($115K Profit)', val2: 'Target: $98K' }
          ]
        }
      }
    };

    let currentModelKey = 'ecommerce';

    // Renders data points on the SVG sparkline
    const renderPoints = (points) => {
      if (!mockupPointsGroup) return;
      mockupPointsGroup.innerHTML = '';
      points.forEach((pt, idx) => {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', pt.cx);
        circle.setAttribute('cy', pt.cy);
        circle.setAttribute('r', idx === points.length - 1 ? '5' : '4.5');
        circle.setAttribute('fill', idx === points.length - 1 ? '#10b981' : '#06b6d4');
        circle.setAttribute('stroke', '#090d16');
        circle.setAttribute('stroke-width', '2');
        circle.style.animationDelay = `${(idx + 1) * 0.35}s`;
        mockupPointsGroup.appendChild(circle);
      });
    };

    // Re-draws chart with animation
    const redrawChart = () => {
      if (mockupPolyline1) {
        mockupPolyline1.style.animation = 'none';
        void mockupPolyline1.offsetWidth;
        mockupPolyline1.style.animation = 'drawSparkline 1.8s cubic-bezier(0.16, 1, 0.3, 1) forwards';
      }
      if (mockupPolyline2) {
        mockupPolyline2.style.animation = 'none';
        void mockupPolyline2.offsetWidth;
        mockupPolyline2.style.animation = 'drawSparkline 2.2s cubic-bezier(0.16, 1, 0.3, 1) forwards';
      }
      if (mockupAreaPolygon) {
        mockupAreaPolygon.style.animation = 'none';
        void mockupAreaPolygon.offsetWidth;
        mockupAreaPolygon.style.animation = 'fadeInArea 1.2s ease 0.6s forwards';
      }
    };

    // Loads a model into the dashboard mockup
    const loadModel = (modelKey) => {
      const data = MOCKUP_MODELS[modelKey];
      if (!data) return;
      currentModelKey = modelKey;

      // Update filename tab
      if (mockupFileName) mockupFileName.textContent = data.fileName;

      // Update status
      if (mockupStatusText) mockupStatusText.textContent = data.statusText;
      if (modelRefreshInfo) modelRefreshInfo.textContent = data.refreshInfo;

      // Update DAX Bar with fade effect
      if (mockupDaxCode) {
        mockupDaxCode.classList.add('dax-fade');
        setTimeout(() => {
          mockupDaxCode.textContent = data.dax;
          mockupDaxCode.title = data.dax;
          mockupDaxCode.classList.remove('dax-fade');
        }, 150);
      }

      // Update 4 KPI Cards
      data.metrics.forEach((m, idx) => {
        const labelEl = document.getElementById(`kpiLabel${idx}`);
        const valEl = document.getElementById(`kpiVal${idx}`);
        const pillEl = document.getElementById(`kpiPill${idx}`);
        const subEl = document.getElementById(`kpiSub${idx}`);

        if (labelEl) labelEl.textContent = m.label;
        if (subEl) subEl.textContent = m.sub;
        if (pillEl) {
          pillEl.textContent = m.pill;
          pillEl.className = `metric-pill ${m.pillClass}`;
        }
        if (valEl) {
          valEl.className = `metric-number ${m.color}`;
          valEl.setAttribute('data-counter', m.val);
          valEl.setAttribute('data-prefix', m.prefix || '');
          valEl.setAttribute('data-suffix', m.suffix || '');
          valEl.setAttribute('data-decimals', m.decimals || 0);
          valEl.setAttribute('data-format', m.format || '');
          valEl.setAttribute('data-duration', '1400');
          animateCounter(valEl);
        }
      });

      // Update Chart Title and Legend
      if (mockupChartTitle) mockupChartTitle.textContent = data.chart.title;
      if (legendText1) legendText1.textContent = data.chart.legend1;
      if (legendText2) legendText2.textContent = data.chart.legend2;

      // Update SVG coordinates
      if (mockupPolyline1) mockupPolyline1.setAttribute('points', data.chart.line1);
      if (mockupPolyline2) mockupPolyline2.setAttribute('points', data.chart.line2);
      if (mockupAreaPolygon) mockupAreaPolygon.setAttribute('points', data.chart.polygon);

      renderPoints(data.chart.points);
      redrawChart();
    };

    // Tab buttons event listeners
    modelTabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        modelTabBtns.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
        const modelKey = btn.getAttribute('data-model');
        loadModel(modelKey);
      });
    });

    // Copy DAX Button
    if (copyDaxBtn && copyDaxTooltip) {
      copyDaxBtn.addEventListener('click', async () => {
        const textToCopy = mockupDaxCode ? mockupDaxCode.textContent : '';
        try {
          await navigator.clipboard.writeText(textToCopy);
          copyDaxTooltip.textContent = '✓ Copied!';
          copyDaxBtn.classList.add('copied');
          setTimeout(() => {
            copyDaxTooltip.textContent = 'Copy';
            copyDaxBtn.classList.remove('copied');
          }, 1800);
        } catch (err) {
          copyDaxTooltip.textContent = 'Copied!';
        }
      });
    }

    // Refresh / Run Query Button
    if (mockupRefreshBtn) {
      mockupRefreshBtn.addEventListener('click', () => {
        const refreshIcon = mockupRefreshBtn.querySelector('.refresh-icon');
        if (refreshIcon) refreshIcon.classList.add('is-spinning');
        if (mockupStatusText) mockupStatusText.textContent = 'Executing Query...';

        setTimeout(() => {
          if (refreshIcon) refreshIcon.classList.remove('is-spinning');
          loadModel(currentModelKey);
          if (mockupStatusText) mockupStatusText.textContent = 'Refreshed (14ms)';
          if (modelRefreshInfo) modelRefreshInfo.textContent = 'Model in-memory cache updated';
          setTimeout(() => {
            const currentData = MOCKUP_MODELS[currentModelKey];
            if (mockupStatusText && currentData) mockupStatusText.textContent = currentData.statusText;
          }, 2400);
        }, 400);
      });
    }

    // Interactive KPI Card click highlight
    metricCards.forEach((card, idx) => {
      card.addEventListener('click', () => {
        metricCards.forEach(c => c.classList.remove('active-kpi-card'));
        card.classList.add('active-kpi-card');

        if (mockupPolyline1 && mockupPolyline2) {
          if (idx === 0 || idx === 1) {
            mockupPolyline1.classList.add('is-focused');
            mockupPolyline2.classList.remove('is-focused');
          } else {
            mockupPolyline2.classList.add('is-focused');
            mockupPolyline1.classList.remove('is-focused');
          }
          setTimeout(() => {
            mockupPolyline1.classList.remove('is-focused');
            mockupPolyline2.classList.remove('is-focused');
          }, 2500);
        }
      });
    });

    // Chart Crosshair Scanner & Dynamic Hover Tooltip
    if (svgChartContainer && chartTooltipBadge && chartCrosshair && activeScanPoint) {
      svgChartContainer.addEventListener('mousemove', (e) => {
        const rect = svgChartContainer.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const relativeX = (mouseX / rect.width) * 500; // Map to SVG viewBox (0-500)

        const currentPoints = MOCKUP_MODELS[currentModelKey].chart.points;
        if (!currentPoints || currentPoints.length === 0) return;

        // Find nearest point
        let nearest = currentPoints[0];
        let minDist = Math.abs(currentPoints[0].cx - relativeX);
        for (let i = 1; i < currentPoints.length; i++) {
          const dist = Math.abs(currentPoints[i].cx - relativeX);
          if (dist < minDist) {
            minDist = dist;
            nearest = currentPoints[i];
          }
        }

        // Position crosshair
        chartCrosshair.setAttribute('x1', relativeX);
        chartCrosshair.setAttribute('x2', relativeX);
        chartCrosshair.style.opacity = '1';

        // Position active snap circle
        activeScanPoint.setAttribute('cx', nearest.cx);
        activeScanPoint.setAttribute('cy', nearest.cy);
        activeScanPoint.style.opacity = '1';

        // Show Tooltip
        const curData = MOCKUP_MODELS[currentModelKey];
        chartTooltipBadge.innerHTML = `<strong>${nearest.month}</strong> &bull; <span style="color:#06b6d4;">${curData.chart.legend1}:</span> ${nearest.val1} &bull; <span style="color:#f59e0b;">${curData.chart.legend2}:</span> ${nearest.val2}`;
        
        // Clamp tooltip position inside container
        const leftPercent = Math.min(Math.max((mouseX / rect.width) * 100, 15), 85);
        chartTooltipBadge.style.left = `${leftPercent}%`;
        chartTooltipBadge.style.top = `${Math.max((nearest.cy / 140) * rect.height - 12, 10)}px`;
        chartTooltipBadge.classList.add('is-visible');
      });

      svgChartContainer.addEventListener('mouseleave', () => {
        chartCrosshair.style.opacity = '0';
        activeScanPoint.style.opacity = '0';
        chartTooltipBadge.classList.remove('is-visible');
      });
    }

    // Mac Window Controls Dots
    const dotRed = dashboardMockup.querySelector('.mockup-dots .dot-red');
    const dotYellow = dashboardMockup.querySelector('.mockup-dots .dot-yellow');
    const dotGreen = dashboardMockup.querySelector('.mockup-dots .dot-green');

    if (dotRed) {
      dotRed.addEventListener('click', () => {
        // Reset to first model
        const firstTab = document.querySelector('.model-tab-btn[data-model="ecommerce"]');
        if (firstTab) firstTab.click();
        dashboardMockup.classList.remove('compact-view');
      });
    }

    if (dotYellow) {
      dotYellow.addEventListener('click', () => {
        dashboardMockup.classList.toggle('compact-view');
      });
    }

    if (dotGreen) {
      dotGreen.addEventListener('click', () => {
        if (mockupRefreshBtn) mockupRefreshBtn.click();
      });
    }
  }

  /* ==========================================================================
     9. Project Screenshot Previews, Salla Multi-Page Switcher & Lightbox Modal
     ========================================================================== */
  // Salla Multi-View Tab Switcher
  const sallaTabBtns = document.querySelectorAll('.salla-tab-btn');
  const sallaActiveImg = document.getElementById('sallaActiveImg');
  const sallaGalleryFrame = document.getElementById('sallaGalleryFrame');
  const sallaZoomBadgeText = document.getElementById('sallaZoomBadgeText');

  if (sallaTabBtns.length > 0 && sallaActiveImg && sallaGalleryFrame) {
    sallaTabBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        sallaTabBtns.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');

        const newSrc = btn.getAttribute('data-img');
        const newTitle = btn.getAttribute('data-title');
        const newSubtitle = btn.getAttribute('data-subtitle');
        const newBadge = btn.getAttribute('data-badge') || 'Enlarge Page';

        sallaActiveImg.style.opacity = '0.35';
        setTimeout(() => {
          sallaActiveImg.src = newSrc;
          sallaActiveImg.alt = newTitle;
          sallaActiveImg.style.opacity = '1';
        }, 120);

        sallaGalleryFrame.setAttribute('data-img', newSrc);
        sallaGalleryFrame.setAttribute('data-title', newTitle);
        sallaGalleryFrame.setAttribute('data-subtitle', newSubtitle);
        if (sallaZoomBadgeText) {
          sallaZoomBadgeText.textContent = newBadge;
        }
      });
    });
  }

  // Lightbox Modal Controller
  const lightboxModal = document.getElementById('imageLightboxModal');
  const lightboxBackdrop = document.getElementById('lightboxBackdrop');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  const lightboxImage = document.getElementById('lightboxImage');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxDesc = document.getElementById('lightboxDesc');
  const galleryItems = Array.from(document.querySelectorAll('[data-gallery-item]'));

  let currentGalleryIndex = 0;

  const openLightbox = (index) => {
    if (!lightboxModal || !lightboxImage || galleryItems.length === 0) return;
    currentGalleryIndex = (index + galleryItems.length) % galleryItems.length;
    const item = galleryItems[currentGalleryIndex];
    const imgSrc = item.getAttribute('data-img');
    const title = item.getAttribute('data-title') || 'Dashboard Preview';
    const subtitle = item.getAttribute('data-subtitle') || '';

    lightboxImage.src = imgSrc;
    lightboxImage.alt = title;
    if (lightboxTitle) lightboxTitle.textContent = title;
    if (lightboxDesc) lightboxDesc.textContent = subtitle;

    lightboxModal.classList.add('active');
    lightboxModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    if (lightboxClose) lightboxClose.focus();
  };

  const closeLightbox = () => {
    if (!lightboxModal) return;
    lightboxModal.classList.remove('active');
    lightboxModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  const showNextLightbox = () => {
    openLightbox(currentGalleryIndex + 1);
  };

  const showPrevLightbox = () => {
    openLightbox(currentGalleryIndex - 1);
  };

  galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      openLightbox(index);
    });

    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(index);
      }
    });
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);
  if (lightboxPrev) lightboxPrev.addEventListener('click', (e) => { e.stopPropagation(); showPrevLightbox(); });
  if (lightboxNext) lightboxNext.addEventListener('click', (e) => { e.stopPropagation(); showNextLightbox(); });

  document.addEventListener('keydown', (e) => {
    if (!lightboxModal || !lightboxModal.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNextLightbox();
    if (e.key === 'ArrowLeft') showPrevLightbox();
  });

  /* ==========================================================================
     16. Salla Contact Center Deep-Dive Case Study Modal Controller
     ========================================================================== */
  const sallaModal = document.getElementById('sallaCaseStudyModal');
  const openSallaBtn = document.getElementById('openSallaCaseStudyBtn');
  const closeSallaBtn = document.getElementById('caseStudyCloseBtn');
  const doneSallaBtn = document.getElementById('caseStudyDoneBtn');
  const sallaBackdrop = document.getElementById('caseStudyBackdrop');
  const caseStudyTabBtns = document.querySelectorAll('.case-study-tab-btn');
  const caseStudyPanels = document.querySelectorAll('.case-study-panel');

  const openSallaModal = () => {
    if (!sallaModal) return;
    sallaModal.classList.add('active');
    sallaModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (closeSallaBtn) closeSallaBtn.focus();
  };

  const closeSallaModal = () => {
    if (!sallaModal) return;
    sallaModal.classList.remove('active');
    sallaModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (openSallaBtn) openSallaBtn.focus();
  };

  if (openSallaBtn) {
    openSallaBtn.addEventListener('click', openSallaModal);
  }

  if (closeSallaBtn) {
    closeSallaBtn.addEventListener('click', closeSallaModal);
  }

  if (doneSallaBtn) {
    doneSallaBtn.addEventListener('click', closeSallaModal);
  }

  if (sallaBackdrop) {
    sallaBackdrop.addEventListener('click', closeSallaModal);
  }

  // Tab switching inside Salla Case Study Modal
  caseStudyTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');
      if (!targetTab) return;

      caseStudyTabBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      caseStudyPanels.forEach(panel => {
        if (panel.id === targetTab) {
          panel.classList.add('active');
        } else {
          panel.classList.remove('active');
        }
      });
    });
  });

  document.addEventListener('keydown', (e) => {
    if (!sallaModal || !sallaModal.classList.contains('active')) return;
    if (e.key === 'Escape') {
      closeSallaModal();
    }
  });

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
