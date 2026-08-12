(() => {
  'use strict';

  const loadScriptOnce = (id, src) => {
    if (document.getElementById(id)) return Promise.resolve();

    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.id = id;
      script.src = src;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = reject;
      document.head.appendChild(script);
    });
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
    }, { rootMargin: '600px 0px' });

    targets.forEach((target) => observer.observe(target));
  };

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = window.matchMedia('(max-width: 768px)').matches;

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
          filter: blur(18px);
        }
      }
    `;
    document.head.appendChild(style);
  };

  const setupHeroVideo = () => {
    const video = document.querySelector('video[data-hero-video]');
    if (!video) return;

    if (prefersReducedMotion || isMobile) {
      video.removeAttribute('autoplay');
      video.pause?.();
      video.removeAttribute('src');
      video.querySelectorAll('source').forEach((source) => source.removeAttribute('src'));
      video.load?.();
      video.style.display = 'none';
      return;
    }

    const activate = () => {
      const source = video.querySelector('source[data-src]');
      if (!source || source.getAttribute('src')) return;
      source.setAttribute('src', source.getAttribute('data-src'));
      source.removeAttribute('data-src');
      video.load();
      const playPromise = video.play();
      if (playPromise) playPromise.catch(() => {});
    };

    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(activate, { timeout: 1800 });
    } else {
      window.setTimeout(activate, 700);
    }
  };

  const setupNativeLazyImages = () => {
    document.querySelectorAll('img:not([loading])').forEach((img) => {
      if (img.fetchPriority === 'high' || img.getAttribute('fetchpriority') === 'high') return;
      img.loading = 'lazy';
      img.decoding = 'async';
    });
  };

  addSoftSectionGlow();
  setupHeroVideo();
  setupNativeLazyImages();

  loadWhenNear('.calendly-inline-widget', () => {
    loadStyleOnce('calendly-widget-style', 'https://assets.calendly.com/assets/external/widget.css');
    loadScriptOnce('calendly-widget-script', 'https://assets.calendly.com/assets/external/widget.js');
  });

  loadWhenNear('.clutch-widget', () => {
    loadScriptOnce('clutch-widget-script', 'https://widget.clutch.co/static/js/widget.js');
  });
})();
