/* Cloudflare Turnstile + resilient login/session client helpers. */
(function () {
  'use strict';

  var SITE_KEY = '0x4AAAAAAEb0MY0iBb-TVKbC';
  var initialized = false;
  var widgetId = null;
  var readoutTimer = null;

  if (window.jQuery) {
    window.jQuery.ajaxSetup({
      timeout: 15000,
      cache: false,
      xhrFields: { withCredentials: true },
      headers: { 'X-Requested-With': 'XMLHttpRequest' }
    });
  }

  function loadScript(done) {
    if (window.turnstile) { done(); return; }
    var existing = document.querySelector('script[data-powermonitor-turnstile]');
    if (existing) {
      var timer = setInterval(function () {
        if (window.turnstile) { clearInterval(timer); done(); }
      }, 50);
      return;
    }
    var script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    script.async = true;
    script.defer = true;
    script.setAttribute('data-powermonitor-turnstile', '1');
    script.onload = done;
    script.onerror = function () {
      console.warn('Turnstile script failed to load');
      setReady(false, 'Cloudflare verification could not load.');
    };
    document.head.appendChild(script);
  }

  function setReady(ready, message) {
    var form = document.getElementById('login');
    if (!form) return;
    form.dataset.turnstileReady = ready ? '1' : '0';
    form.dataset.turnstileMessage = message || '';
  }

  function getToken() {
    if (!window.turnstile || widgetId === null) return '';
    try { return window.turnstile.getResponse(widgetId) || ''; }
    catch (e) { return ''; }
  }

  window.PowerMonitorTurnstile = {
    isReady: function () {
      var form = document.getElementById('login');
      return !!(form && form.dataset.turnstileReady === '1' && getToken());
    },
    getToken: getToken,
    reset: function () {
      if (window.turnstile && widgetId !== null) window.turnstile.reset(widgetId);
      setReady(false, 'Please complete the Cloudflare verification.');
    },
    message: function () {
      var form = document.getElementById('login');
      return form ? (form.dataset.turnstileMessage || '') : '';
    }
  };

  function animateReadouts() {
    var values = document.querySelectorAll('.pm-readout-value');
    if (values.length < 3 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var targets = [
      { el: values[0], min: 228.4, max: 231.8 },
      { el: values[1], min: 17.4, max: 20.1 },
      { el: values[2], min: 125.8, max: 128.9 }
    ];
    function tick() {
      if (document.hidden) return;
      var t = Date.now() / 1000;
      targets.forEach(function (item, index) {
        var wave = Math.sin(t * (0.42 + index * 0.06) + index * 1.7);
        var drift = Math.sin(t * 0.19 + index * 0.8) * 0.22;
        var normalized = Math.max(0, Math.min(1, (wave + 1) / 2 + drift * 0.08));
        item.el.firstChild.nodeValue = (item.min + (item.max - item.min) * normalized).toFixed(1);
      });
    }
    tick();
    readoutTimer = window.setInterval(tick, 900);
  }

  function init() {
    var form = document.getElementById('login');
    if (!form || initialized) return;
    initialized = true;
    setReady(false, 'Please complete the Cloudflare verification.');
    animateReadouts();

    var wrapper = document.createElement('div');
    wrapper.className = 'col-12 pm-turnstile-runtime';
    wrapper.style.display = 'flex';
    wrapper.style.justifyContent = 'center';
    wrapper.style.marginTop = '8px';
    wrapper.style.marginBottom = '8px';
    var container = document.createElement('div');
    container.id = 'login-turnstile';
    wrapper.appendChild(container);
    var submit = form.querySelector('button[type="submit"]');
    var submitCol = submit && submit.closest('.col-12');
    if (submitCol) submitCol.before(wrapper); else form.appendChild(wrapper);

    loadScript(function () {
      if (!window.turnstile) return;
      try {
        widgetId = window.turnstile.render('#login-turnstile', {
          sitekey: SITE_KEY,
          theme: 'auto',
          action: 'login',
          callback: function () {
            setReady(!!getToken(), '');
          },
          'expired-callback': function () {
            setReady(false, 'Cloudflare verification expired. Please verify again.');
          },
          'error-callback': function () {
            setReady(false, 'Cloudflare verification failed. Please retry.');
          }
        });
      } catch (error) {
        setReady(false, 'Cloudflare verification could not initialize.');
        console.error('Turnstile initialization failed:', error);
      }
    });
  }

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      if (readoutTimer) { clearInterval(readoutTimer); readoutTimer = null; }
    } else if (initialized && !readoutTimer) {
      animateReadouts();
    }
  });
  window.addEventListener('pagehide', function () {
    if (readoutTimer) clearInterval(readoutTimer);
  }, { once: true });

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
