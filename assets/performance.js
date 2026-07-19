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

  loadWhenNear('.calendly-inline-widget', () => {
    loadStyleOnce('calendly-widget-style', 'https://assets.calendly.com/assets/external/widget.css');
    loadScriptOnce('calendly-widget-script', 'https://assets.calendly.com/assets/external/widget.js');
  });

  loadWhenNear('.clutch-widget', () => {
    loadScriptOnce('clutch-widget-script', 'https://widget.clutch.co/static/js/widget.js');
  });
})();
