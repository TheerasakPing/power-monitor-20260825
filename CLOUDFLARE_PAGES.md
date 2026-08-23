# Cloudflare Pages + Turnstile Login

PowerMonitor can keep the existing PHP API/database while the frontend is hosted on Cloudflare Pages.

## What is already handled in the repository

- `functions/_middleware.js` injects `assets/js/login-turnstile.js` into HTML responses.
- `assets/js/login-turnstile.js` renders Cloudflare Turnstile on the login form.
- `api/login.php` requires a valid Turnstile token before authentication.
- `api/login_protection.php` applies IP + account rate limits.
- Turnstile secret values are read only from server-side environment variables.

## Cloudflare Pages

Create a Pages project from this repository with the site root at the repository root.

No Turnstile secret is placed in Pages frontend code.

## PHP API server

Set these two required environment variables on the server that runs PHP:

```text
TURNSTILE_SITE_KEY=your_public_site_key
TURNSTILE_SECRET=your_server_secret
```

Optional hardening variables:

```text
TURNSTILE_ACTION=login
TURNSTILE_HOSTNAMES=your-pages-domain.example
TRUST_CLOUDFLARE_PROXY=1
```

`TURNSTILE_ACTION` defaults to `login`. `TURNSTILE_HOSTNAMES` is optional; when set, the hostname returned by Cloudflare must match exactly. Only set `TRUST_CLOUDFLARE_PROXY=1` when the PHP origin is actually behind Cloudflare and direct origin access is blocked.

## Cloudflare Turnstile

Create a Turnstile site in the Cloudflare dashboard and add the hostname used by the Pages site.

Use the generated Site Key as `TURNSTILE_SITE_KEY` and the Secret Key as `TURNSTILE_SECRET` on the PHP origin.

Never commit `TURNSTILE_SECRET` to Git.

## Request flow

```text
Browser
  -> Cloudflare Pages
     -> injected login-turnstile.js
        -> Turnstile challenge
  -> PHP API /api/login.php
     -> rate limit
     -> Cloudflare Siteverify using TURNSTILE_SECRET
     -> database authentication
```
