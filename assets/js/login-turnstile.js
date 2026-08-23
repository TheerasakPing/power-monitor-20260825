/* Cloudflare Turnstile protection for the PowerMonitor login form. */
(function () {
  'use strict';

  var widgetId = null;
  var ready = false;
  var initializing = false;

  function getApiBase() {
    return (typeof partURL === 'string' && partURL) ? partURL : 'api/';
  }

  function showMessage(text) {
    var existing = document.querySelector('.login-protection-error');
    if (existing) existing.remove();

    var form = document.getElementById('login');
    if (!form) return;

    var alert = document.createElement('div');
    alert.className = 'col-12 alert alert-warning py-2 login-protection-error';
    alert.setAttribute('role', 'alert');
    alert.textContent = text;

    var submitColumn = form.querySelector('button[type="submit"]');
    if (submitColumn && submitColumn.closest('.col-12')) {
      submitColumn.closest('.col-12').before(alert);
    } else {
      form.prepend(alert);
    }
  }

  function clearMessage() {
    var existing = document.querySelector('.login-protection-error');
    if (existing) existing.remove();
  }

  function ensureWidgetContainer() {
    var form = document.getElementById('login');
    if (!form || document.getElementById('login-turnstile')) return;

    var wrapper = document.createElement('div');
    wrapper.className = 'col-12';
    wrapper.id = 'login-turnstile-wrapper';
    wrapper.innerHTML = '<div id="login-turnstile"></div>';

    var submitColumn = form.querySelector('button[type="submit"]');
    if (submitColumn && submitColumn.closest('.col-12')) {
      submitColumn.closest('.col-12').before(wrapper);
    } else {
      form.appendChild(wrapper);
    }
  }

  function ensureTurnstileScript() {
    return new Promise(function (resolve, reject) {
      if (window.turnstile) {
        resolve();
        return;
      }

      var existing = document.querySelector('script[data-powermonitor-turnstile]');
      if (existing) {
        var timer = setInterval(function () {
          if (window.turnstile) {
            clearInterval(timer);
            resolve();
          }
        }, 50);
        setTimeout(function () {
          clearInterval(timer);
          if (!window.turnstile) reject(new Error('Turnstile script timeout'));
        }, 10000);
        return;
      }

      var script = document.createElement('script');
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      script.async = true;
      script.defer = true;
      script.setAttribute('data-powermonitor-turnstile', '1');
      script.onload = function () { resolve(); };
      script.onerror = function () { reject(new Error('Unable to load Turnstile')); };
      document.head.appendChild(script);
    });
  }

  async function init() {
    if (initializing || ready) return;
    initializing = true;

    var form = document.getElementById('login');
    if (!form) return;

    ensureWidgetContainer();

    try {
      var response = await fetch(getApiBase() + 'turnstile_config.php', {
        method: 'GET',
        credentials: 'omit',
        cache: 'no-store'
      });
      if (!response.ok) throw new Error('Turnstile configuration unavailable');

      var config = await response.json();
      if (!config.status || !config.siteKey) {
        throw new Error('Turnstile site key is not configured');
      }

      await ensureTurnstileScript();

      widgetId = window.turnstile.render('#login-turnstile', {
        sitekey: config.siteKey,
        action: 'login',
        theme: 'auto',
        callback: function () {
          ready = true;
          clearMessage();
        },
        'expired-callback': function () {
          ready = false;
          showMessage('การยืนยันตัวตนหมดอายุ กรุณายืนยันใหม่');
        },
        'error-callback': function () {
          ready = false;
          showMessage('ไม่สามารถยืนยันตัวตนกับ Cloudflare ได้ กรุณาลองใหม่');
        }
      });

      // The existing jQuery login handler runs in the bubble phase. Capture the
      // submit first so a missing/invalid Turnstile token cannot reach login.php.
      form.addEventListener('submit', function (event) {
        clearMessage();

        if (!window.turnstile || widgetId === null) {
          event.preventDefault();
          event.stopImmediatePropagation();
          showMessage('ระบบยืนยันตัวตนยังไม่พร้อมใช้งาน กรุณาลองใหม่');
          return;
        }

        var token = window.turnstile.getResponse(widgetId);
        if (!token) {
          event.preventDefault();
          event.stopImmediatePropagation();
          showMessage('กรุณายืนยัน Cloudflare ก่อนเข้าสู่ระบบ');
          return;
        }

        var hidden = form.querySelector('input[name="cf-turnstile-response"]');
        if (!hidden) {
          hidden = document.createElement('input');
          hidden.type = 'hidden';
          hidden.name = 'cf-turnstile-response';
          form.appendChild(hidden);
        }
        hidden.value = token;
      }, true);

      // Turnstile tokens are single-use. Reset after every login request.
      $(document).ajaxComplete(function (event, xhr, settings) {
        if (!settings || !settings.url || settings.url.indexOf('login.php') === -1) return;

        var hidden = form.querySelector('input[name="cf-turnstile-response"]');
        if (hidden) hidden.remove();

        if (window.turnstile && widgetId !== null) {
          window.turnstile.reset(widgetId);
        }
        ready = false;
      });

      clearMessage();
    } catch (error) {
      ready = false;
      showMessage('ระบบ Cloudflare CAPTCHA ยังไม่พร้อมใช้งาน กรุณาติดต่อผู้ดูแลระบบ');
      console.error('Turnstile initialization failed:', error);
    } finally {
      initializing = false;
    }
  }

  function start() {
    if (document.getElementById('login')) init();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }
})();
