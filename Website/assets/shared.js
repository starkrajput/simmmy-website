/* ========================================
   SIMMY – SHARED JAVASCRIPT
   ======================================== */

(function () {
  'use strict';

  /* ── THEME ── */
  const html = document.documentElement;
  const THEME_KEY = 'simmy-theme';

  function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
    const btn = document.getElementById('themeToggle');
    if (btn) btn.textContent = theme === 'dark' ? '☀️' : '🌙';
    localStorage.setItem(THEME_KEY, theme);
  }

  function initTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    const preferred = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    applyTheme(saved || preferred);
    const btn = document.getElementById('themeToggle');
    if (btn) {
      btn.addEventListener('click', () => {
        applyTheme(html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
      });
    }
  }

  /* ── STAR FIELD ── */
  function initStarfield() {
    const sf = document.getElementById('starfield');
    if (!sf) return;
    const frag = document.createDocumentFragment();
    for (let i = 0; i < 180; i++) {
      const s = document.createElement('div');
      s.className = 'star';
      const sz = Math.random() * 2.5 + 0.5;
      s.style.cssText = `
        width:${sz}px;height:${sz}px;
        left:${Math.random()*100}%;top:${Math.random()*100}%;
        --dur:${(Math.random()*4+2).toFixed(1)}s;
        --delay:-${(Math.random()*6).toFixed(1)}s;
        opacity:${(Math.random()*0.4+0.1).toFixed(2)};
      `;
      frag.appendChild(s);
    }
    sf.appendChild(frag);
  }

  /* ── MOBILE NAV ── */
  function initMobileNav() {
    const hamburger = document.getElementById('hamburgerBtn');
    const drawer = document.getElementById('mobileDrawer');
    if (!hamburger || !drawer) return;

    hamburger.addEventListener('click', () => {
      const open = drawer.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', open);
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!drawer.contains(e.target) && !hamburger.contains(e.target)) {
        drawer.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });

    // Close on drawer link click
    drawer.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        drawer.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ── NAV SCROLL ── */
  function initNavScroll() {
    const nav = document.querySelector('.nav');
    if (!nav) return;
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });
  }

  /* ── ACTIVE NAV LINK ── */
  function setActiveNavLink() {
    const path = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a, .mobile-drawer a').forEach(a => {
      const href = a.getAttribute('href') || '';
      if (href === path || (path === '' && href === 'index.html') || (path === 'index.html' && href === './')) {
        a.classList.add('active');
      }
    });
  }

  /* ── SCROLL REVEAL ── */
  function initReveal() {
    const elements = document.querySelectorAll('.reveal');
    if (!elements.length) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
    elements.forEach(el => io.observe(el));
  }

  /* ── FAQ ACCORDION ── */
  function initFAQ() {
    document.querySelectorAll('.faq-q').forEach(q => {
      q.addEventListener('click', () => {
        const item = q.closest('.faq-item');
        const isOpen = item.classList.toggle('open');
        q.setAttribute('aria-expanded', isOpen);
        const ans = item.querySelector('.faq-a');
        if (ans) ans.style.maxHeight = isOpen ? ans.scrollHeight + 'px' : '0';
      });
      q.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); q.click(); }
      });
    });
  }

  /* ── COOKIE BANNER ── */
  function initCookieBanner() {
    const banner = document.getElementById('cookieBanner');
    if (!banner) return;
    if (localStorage.getItem('simmy-cookies')) {
      banner.classList.add('hidden');
      return;
    }
    window.acceptCookies = () => {
      localStorage.setItem('simmy-cookies', 'all');
      banner.classList.add('hidden');
    };
    window.declineCookies = () => {
      localStorage.setItem('simmy-cookies', 'essential');
      banner.classList.add('hidden');
    };
  }

  /* ── COUNTER ANIMATION ── */
  function animateCounters() {
    document.querySelectorAll('[data-count]').forEach(el => {
      const target = parseFloat(el.getAttribute('data-count'));
      const suffix = el.getAttribute('data-suffix') || '';
      const prefix = el.getAttribute('data-prefix') || '';
      const duration = 2000;
      const start = performance.now();
      const isFloat = String(target).includes('.');

      function update(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        const val = target * ease;
        el.textContent = prefix + (isFloat ? val.toFixed(1) : Math.floor(val)) + suffix;
        if (progress < 1) requestAnimationFrame(update);
      }

      const io = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
          requestAnimationFrame(update);
          io.disconnect();
        }
      });
      io.observe(el);
    });
  }

  /* ── INIT ALL ── */
  document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initStarfield();
    initMobileNav();
    initNavScroll();
    setActiveNavLink();
    initReveal();
    initFAQ();
    initCookieBanner();
    animateCounters();
  });

})();