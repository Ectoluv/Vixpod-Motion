(() => {
  'use strict';

  const loadScriptOnce = (id, src) => {
    if (document.getElementById(id)) return;

    const script = document.createElement('script');
    script.id = id;
    script.src = src;
    script.async = true;
    document.head.appendChild(script);
  };

  const loadStyleOnce = (id, href) => {
    if (document.getElementById(id)) return;

    const link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
  };

  const loadWhenNear = (selector, callback) => {
    const targets = Array.from(document.querySelectorAll(selector));
    if (!targets.length) return;

    if (!('IntersectionObserver' in window)) {
      callback();
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      observer.disconnect();
      callback();
    }, { rootMargin: '900px 0px' });

    targets.forEach((target) => observer.observe(target));
  };

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const addKineticTheme = () => {
    if (document.getElementById('vixpod-kinetic-theme')) return;

    const style = document.createElement('style');
    style.id = 'vixpod-kinetic-theme';
    style.textContent = `
      .section-head,
      .policy-hero,
      .subpage-intro,
      .center-copy {
        position: relative;
        isolation: isolate;
      }

      .section-head::after,
      .policy-hero::after,
      .subpage-intro::after {
        content: "";
        position: absolute;
        left: 50%;
        top: 50%;
        width: min(620px, 82vw);
        height: 220px;
        transform: translate(-50%, -50%);
        background: radial-gradient(circle, rgba(143,216,232,0.11), transparent 68%);
        filter: blur(28px);
        opacity: 0.62;
        pointer-events: none;
        z-index: -1;
      }

      .kinetic-heading {
        text-shadow: 0 22px 64px rgba(0,0,0,0.38), 0 0 32px rgba(143,216,232,0.10);
      }

      .kinetic-heading.is-typing::after {
        content: "|";
        display: inline-block;
        margin-left: 0.08em;
        color: #8FD8E8;
        text-shadow: 0 0 18px rgba(143,216,232,0.48);
        animation: vixpodKineticCursor 0.8s steps(2, start) infinite;
      }

      @keyframes vixpodKineticCursor {
        0%, 45% { opacity: 1; }
        46%, 100% { opacity: 0; }
      }

      @media (max-width: 768px) {
        .section-head::after,
        .policy-hero::after,
        .subpage-intro::after {
          width: min(420px, 90vw);
          height: 150px;
          opacity: 0.42;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .kinetic-heading.is-typing::after {
          animation: none;
          content: "";
        }
      }
    `;
    document.head.appendChild(style);
  };

  const runKineticHeading = (heading) => {
    if (heading.dataset.kineticDone === 'true') return;

    const original = heading.dataset.kineticText || heading.textContent.trim();
    if (!original || original.length < 7) return;

    heading.dataset.kineticDone = 'true';
    heading.dataset.kineticText = original;
    heading.classList.add('kinetic-heading');

    if (prefersReducedMotion) {
      heading.textContent = original;
      return;
    }

    heading.setAttribute('aria-label', original);
    heading.textContent = '';
    heading.classList.add('is-typing');

    let index = 0;
    const step = () => {
      heading.textContent = original.slice(0, index);
      index += 1;

      if (index <= original.length + 1) {
        window.setTimeout(step, 24);
      } else {
        heading.classList.remove('is-typing');
      }
    };

    window.setTimeout(step, 90);
  };

  // Heading typewriter disabled site-wide.
  // Keep only the hero line: "Start Publishing Videos That Sell."
  const setupKineticHeadings = () => {
    addKineticTheme();
  };

  loadWhenNear('.calendly-inline-widget', () => {
    loadStyleOnce('calendly-widget-style', 'https://assets.calendly.com/assets/external/widget.css');
    loadScriptOnce('calendly-widget-script', 'https://assets.calendly.com/assets/external/widget.js');
  });

  loadWhenNear('.clutch-widget', () => {
    loadScriptOnce('clutch-widget-script', 'https://widget.clutch.co/static/js/widget.js');
  });

  setupKineticHeadings();
})();
