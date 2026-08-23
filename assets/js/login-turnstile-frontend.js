/* Frontend-only Cloudflare Turnstile widget for the login page. */
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

  function init() {
    var form = document.getElementById('login');
    if (!form || initialized) return;

    initialized = true;

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
