/* Frontend-only Cloudflare Turnstile widget + live login readouts. */
(function () {
  'use strict';

  var SITE_KEY = '0x4AAAAAAEZYtO7CPcgOUFwo';
  var initialized = false;
  var widgetId = null;

  function loadScript(done) {
    if (window.turnstile) {
      done();
      return;
    }

    var existing = document.querySelector('script[data-powermonitor-turnstile]');
    if (existing) {
      var timer = setInterval(function () {
        if (window.turnstile) {
          clearInterval(timer);
          done();
        }
      }, 50);
      return;
    }

    var script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    script.async = true;
    script.defer = true;
    script.setAttribute('data-powermonitor-turnstile', '1');
    script.onload = done;
    document.head.appendChild(script);
  }

  function animateReadouts() {
    var values = document.querySelectorAll('.pm-readout-value');
    if (values.length < 3 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var targets = [
      { el: values[0], min: 228.4, max: 231.8, decimals: 1 },
      { el: values[1], min: 17.4, max: 20.1, decimals: 1 },
      { el: values[2], min: 125.8, max: 128.9, decimals: 1 }
    ];

    function tick() {
      var t = Date.now() / 1000;
      targets.forEach(function (item, index) {
        var wave = Math.sin(t * (0.42 + index * 0.06) + index * 1.7);
        var drift = Math.sin(t * 0.19 + index * 0.8) * 0.22;
        var normalized = Math.max(0, Math.min(1, (wave + 1) / 2 + drift * 0.08));
        var value = item.min + (item.max - item.min) * normalized;
        item.el.firstChild.nodeValue = value.toFixed(item.decimals);
      });
    }

    tick();
    setInterval(tick, 900);
  }

  function init() {
    var form = document.getElementById('login');
    if (!form || initialized) return;

    initialized = true;
    animateReadouts();

    var wrapper = document.createElement('div');
    wrapper.className = 'col-12';
    wrapper.style.display = 'flex';
    wrapper.style.justifyContent = 'center';
    wrapper.style.marginTop = '8px';
    wrapper.style.marginBottom = '8px';

    var container = document.createElement('div');
    container.id = 'login-turnstile';
    wrapper.appendChild(container);

    var submit = form.querySelector('button[type="submit"]');
    var submitCol = submit && submit.closest('.col-12');
    if (submitCol) {
      submitCol.before(wrapper);
    } else {
      form.appendChild(wrapper);
    }

    loadScript(function () {
      widgetId = window.turnstile.render('#login-turnstile', {
        sitekey: SITE_KEY,
        theme: 'auto',
        action: 'login',
        callback: function () {
          form.dataset.turnstileReady = '1';
        },
        'expired-callback': function () {
          form.dataset.turnstileReady = '0';
        },
        'error-callback': function () {
          form.dataset.turnstileReady = '0';
        }
      });
    });
  }

  function start() {
    if (document.getElementById('login')) {
      init();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }
})();
