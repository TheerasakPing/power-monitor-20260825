# PowerMonitor secure deployment

The hardened branch keeps the existing frontend API base URL and endpoint names. Security controls are staged so the dashboard can migrate without a big-bang rewrite.

## Required server variables

```text
DB_HOST=localhost
DB_USER=power_monitor_app
DB_PASS=<secret>
DB_NAME=db_powermeter
APP_TIMEZONE=Asia/Bangkok
ALLOWED_ORIGINS=https://app.smartsoul-pcb.com
TURNSTILE_SITE_KEY=<public key>
TURNSTILE_SECRET=<secret>
TURNSTILE_ACTION=login
TURNSTILE_HOSTNAMES=app.smartsoul-pcb.com
TURNSTILE_ENFORCE=0
TRUST_CLOUDFLARE_PROXY=1
REQUIRE_SERVER_SESSION=0
```

Use a dedicated non-root database account. Do not commit credentials. The old database password must be rotated after migration because it was previously present in source history.

## Migration order

1. Create the least-privileged MySQL user and set DB environment variables.
2. Deploy the API code and verify login plus dashboard reads/writes.
3. Confirm successful logins transparently migrate legacy plaintext passwords to `password_hash()` values.
4. Verify the browser sends credentialed cross-origin requests to the API.
5. Set `TURNSTILE_ENFORCE=1` after the Turnstile secret is installed server-side.
6. Enable stricter server-session/authorization enforcement in a later migration once every API consumer uses the new session.

## Current compatibility choices

- The public API URL remains `https://api.smartsoul-pcb.com/powermeter/` in the existing frontend.
- Existing login response fields are preserved during the migration; the `p` compatibility value is now the password hash, not plaintext.
- Existing API endpoint paths are not renamed.
- Shared API headers, CORS allowlisting, secure PHP sessions, and strict PDO settings are enabled through `api/connectdb.php`.
