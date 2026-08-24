# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Inferred from the existing PowerMonitor interface: operators and authorized users who sign in to monitor electrical measurements from one or more monitored sites/meters.

## Product Purpose

PowerMonitor is a web monitoring interface for viewing electrical measurements and energy-related telemetry, with authenticated access to dashboards and monitoring views.

## Positioning

The product centers on practical electrical monitoring data—voltage, current, power, energy, site/house/meter views, and status information—rather than a generic analytics dashboard.

## Operating Context

The interface is intended for desktop and mobile web use in an operational monitoring context. Users authenticate before entering the main monitoring dashboard. The existing frontend communicates with a remote PowerMonitor API.

## Capabilities and Constraints

- Preserve the existing login form contract: `id="login"`, username field `name="name"`, password field `name="pass"`, and the existing login JavaScript flow.
- Preserve Cloudflare Turnstile frontend integration.
- Preserve the existing PowerMonitor name/logo assets.
- Existing monitoring UI includes electrical measurements and site/meter status views.
- Do not invent production claims, customer counts, benchmarks, or operational metrics.

## Brand Commitments

- Product name: POWERMETER / PowerMonitor as used by the existing interface.
- Existing SmartSoulPCB association and logo assets remain intact.
- Primary interface language includes Thai copy.

## Evidence on Hand

- Existing `index.html`, CSS, JavaScript, logo and status assets.
- Existing login implementation and monitoring dashboard code.
- No verified customer/testimonial/benchmark content should be fabricated for the login surface.

## Product Principles

1. Monitoring information must be scannable and operationally clear.
2. Authentication should feel trustworthy and low-friction.
3. Electrical data should be presented with technical precision rather than decorative noise.
4. The interface must preserve the existing working authentication and dashboard behavior.
5. Responsive behavior must remain usable on desktop and mobile web.

## Accessibility & Inclusion

Target WCAG AA contrast for interface text, clear keyboard focus states, semantic labels, readable body text, and responsive layouts.
