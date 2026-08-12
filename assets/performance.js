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

  const addSoftSectionGlow = () => {
    if (document.getElementById('vixpod-section-glow')) return;

    const style = document.createElement('style');
    style.id = 'vixpod-section-glow';
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

      @media (max-width: 768px) {
        .section-head::after,
        .policy-hero::after,
        .subpage-intro::after {
          width: min(420px, 90vw);
          height: 150px;
          opacity: 0.42;
        }
      }
    `;
    document.head.appendChild(style);
  };

  addSoftSectionGlow();

  loadWhenNear('.calendly-inline-widget', () => {
    loadStyleOnce('calendly-widget-style', 'https://assets.calendly.com/assets/external/widget.css');
    loadScriptOnce('calendly-widget-script', 'https://assets.calendly.com/assets/external/widget.js');
  });

  loadWhenNear('.clutch-widget', () => {
    loadScriptOnce('clutch-widget-script', 'https://widget.clutch.co/static/js/widget.js');
  });
})();
