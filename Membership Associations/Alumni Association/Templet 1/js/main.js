(() => {
  const navbar = document.querySelector('.navbar-custom');
  const navbarCollapse = document.getElementById('navbarNav');
  const backToTop = document.getElementById('backToTop');

  const setNavbarState = () => {
    if (!navbar) return;
    if (window.scrollY > 30) {
      navbar.classList.add('navbar-scrolled');
    } else {
      navbar.classList.remove('navbar-scrolled');
    }
  };

  const setBackToTopState = () => {
    if (!backToTop) return;
    if (window.scrollY > 450) {
      backToTop.classList.add('is-visible');
    } else {
      backToTop.classList.remove('is-visible');
    }
  };

  window.addEventListener('scroll', () => {
    setNavbarState();
    setBackToTopState();
  }, { passive: true });

  setNavbarState();
  setBackToTopState();

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  if (navbarCollapse) {
    const links = navbarCollapse.querySelectorAll('a.nav-link');
    links.forEach((link) => {
      link.addEventListener('click', () => {
        const bsCollapse = window.bootstrap?.Collapse?.getInstance(navbarCollapse);
        if (bsCollapse) {
          bsCollapse.hide();
        }
      });
    });
  }

  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;
    const targetId = link.getAttribute('href');
    if (!targetId || targetId === '#') return;
    const target = document.querySelector(targetId);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  const revealEls = Array.from(document.querySelectorAll('.reveal'));
  if (revealEls.length) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const delay = Number(el.getAttribute('data-reveal-delay') || 0);
        if (delay > 0) {
          el.style.transitionDelay = `${delay}ms`;
        }
        el.classList.add('is-visible');
        obs.unobserve(el);
      });
    }, { threshold: 0.18 });

    revealEls.forEach((el) => observer.observe(el));
  }

  const counters = Array.from(document.querySelectorAll('.counter[data-count]'));
  if (counters.length) {
    const animateCounter = (el) => {
      const target = Number(el.getAttribute('data-count') || 0);
      if (!Number.isFinite(target)) return;
      const duration = 1200;
      const start = performance.now();
      const startVal = 0;

      const tick = (now) => {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        const value = Math.round(startVal + (target - startVal) * eased);
        el.textContent = target >= 1000 ? value.toLocaleString() : String(value);
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    const counterObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateCounter(entry.target);
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.35 });

    counters.forEach((el) => counterObserver.observe(el));
  }

  const contactForm = document.querySelector('form[data-validate="contact"]');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      const required = Array.from(contactForm.querySelectorAll('[required]'));
      let ok = true;
      required.forEach((field) => {
        const value = String(field.value || '').trim();
        if (!value) ok = false;
        field.classList.toggle('is-invalid', !value);
        field.classList.toggle('is-valid', !!value);
      });

      const email = contactForm.querySelector('input[type="email"]');
      if (email) {
        const v = String(email.value || '').trim();
        const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        email.classList.toggle('is-invalid', !emailOk);
        email.classList.toggle('is-valid', emailOk);
        ok = ok && emailOk;
      }

      if (!ok) {
        e.preventDefault();
        e.stopPropagation();
      }
    });
  }

  // Profile tabs (About page)
  document.addEventListener('DOMContentLoaded', () => {
    const tabButtons = Array.from(document.querySelectorAll('.profile-tab[data-profile-tab]'));
    const panels = Array.from(document.querySelectorAll('.profile-panel[id]'));
    if (!tabButtons.length || !panels.length) return;

    const activate = (panelId) => {
      tabButtons.forEach((btn) => {
        const isActive = btn.getAttribute('data-profile-tab') === panelId;
        btn.classList.toggle('active', isActive);
        btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });

      panels.forEach((panel) => {
        const isActive = panel.id === panelId;
        panel.classList.toggle('active', isActive);
      });
    };

    tabButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const panelId = btn.getAttribute('data-profile-tab');
        if (!panelId) return;
        activate(panelId);
      });
    });
  });

  const tables = Array.from(document.querySelectorAll('table[data-row-highlight="true"]'));
  tables.forEach((table) => {
    table.addEventListener('click', (e) => {
      const tr = e.target.closest('tbody tr');
      if (!tr) return;
      const rows = table.querySelectorAll('tbody tr');
      rows.forEach((r) => r.classList.remove('table-row-active'));
      tr.classList.add('table-row-active');
    });
  });
})();
