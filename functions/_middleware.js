export async function onRequest(context) {
  const response = await context.next();
  const contentType = response.headers.get("content-type") || "";

  if (!contentType.includes("text/html")) {
    return response;
  }

  const body = await response.text();

  // Inject the login protection loader without modifying the large legacy index.html.
  // The loader itself fetches the public Turnstile site key from the existing PHP API
  // and never contains the Turnstile secret.
  const scriptTag = '<script src="/assets/js/login-turnstile.js" defer></script>';
  if (body.includes("/assets/js/login-turnstile.js")) {
    return response;
  }

  if (!body.toLowerCase().includes("</body>")) {
    return response;
  }

  const protectedBody = body.replace(/<\/body>/i, `${scriptTag}</body>`);
  const headers = new Headers(response.headers);
  headers.delete("content-length");
  headers.set("cache-control", "no-store");

  return new Response(protectedBody, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
