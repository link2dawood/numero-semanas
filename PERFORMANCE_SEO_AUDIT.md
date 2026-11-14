# Performance, UX, sitemap and analytics audit — NumeroSemanas

**Audit date:** 14 November 2026  
**Environment:** Local optimized Next.js production build  
**Configured canonical origin:** `https://numerosemanas.es`  
**Tested URL:** Homepage plus a complete 101-URL crawl and 74-URL sitemap audit

## Executive result

The optimized build is fast, stable, mobile-friendly, and sitemap-clean. The verified after-state scored **90 mobile** and **100 desktop** in Lighthouse performance, with **100 accessibility, best practices, and SEO** on both profiles. The 74-URL sitemap contains only 200, indexable, self-canonical URLs. Development indexing protection and launch-mode robots behavior are correctly separated.

Three safe fixes were completed: two contrast failures were corrected, the cookie disclosure was aligned with actual behavior, and GA4 client-side navigation page views were added. GA4 and Search Console account status remain unverified because no connected account or production measurement ID is available.

## Before-and-after lab performance

| Metric | Mobile before | Mobile after | Desktop before | Desktop after |
|---|---:|---:|---:|---:|
| Lighthouse performance | 88 | **90** | 100 | **100** |
| Accessibility | 96 | **100** | 96 | **100** |
| Best Practices | 100 | **100** | 100 | **100** |
| SEO | 100 | **100** | 100 | **100** |
| First Contentful Paint | 1.4s | **1.1s** | 0.4s | **0.4s** |
| Largest Contentful Paint | 1.4s | **1.1s** | 0.4s | **0.4s** |
| Total Blocking Time | 460ms | **430ms** | 40ms | **0ms** |
| Cumulative Layout Shift | 0 | **0** | 0 | **0** |
| Speed Index | 1.9s | **1.3s** | 0.8s | **0.7s** |

These are Lighthouse lab measurements against localhost, not Google PageSpeed Insights or CrUX field data. Mobile runs showed normal lab variance; three baseline runs ranged from 76 to 95. The table uses the original audit run and the post-fix verification run and should not be interpreted as field performance.

## Core Web Vitals assessment

| Vital | Lab result | Assessment | Status |
|---|---:|---|---|
| LCP | 1.1s mobile; 0.4s desktop | Well below the 2.5s “good” threshold | **Pass in lab** |
| CLS | 0 mobile and desktop | No observed layout shift | **Pass in lab** |
| INP | Not available from a synthetic page-load-only test | Requires real interactions/CrUX or a controlled interaction suite | **Unverified** |
| TBT, lab proxy for responsiveness | 430ms mobile; 0ms desktop | Mobile hydration/main-thread work is the main remaining lab cost | **Monitor** |

## Completed fixes

| Priority | Area | Affected URLs/components | Verified issue | Fix | Status |
|---|---|---|---|---|---|
| High | Mobile UX/accessibility | Homepage mini calendar | Olive 13px text on the selected-week panel had 4.29:1 contrast, below WCAG AA 4.5:1 | Changed week labels to the existing darker olive token | **Completed; Lighthouse contrast passes** |
| High | Mobile UX/accessibility | Sitewide footer on all rendered pages | Tan 13px headings on dark olive had 4.14:1 contrast | Changed footer headings to the existing mint token | **Completed; accessibility 96 → 100** |
| High | Consent accuracy | Sitewide cookie banner | Copy claimed analytics continued without cookies, but the implementation loads no analytics before consent | Updated disclosure to match actual behavior | **Completed** |
| High | Analytics reliability | All App Router client-side navigations | GA4 initial configuration could record the landing view, but route changes were not explicitly sent as page views | Added consent-gated `page_view` events on pathname changes | **Completed; code/build verified** |
| Medium | Deployment configuration | `.env.example` | GA4 and Clarity variables were used in code but not documented | Added `NEXT_PUBLIC_GA_ID` and `NEXT_PUBLIC_CLARITY_ID` with consent notes | **Completed** |

## Mobile, speed and UX findings

### Verified healthy

- Responsive viewport behavior and mobile navigation are implemented with breakpoint-aware layouts and 44px minimum interactive targets.
- Mobile Lighthouse performance reaches the requested 90 threshold; desktop reaches 100.
- LCP is text/initial UI rather than a large hero image.
- The only raster page image is the logo. Next.js serves responsive AVIF/WebP variants; the measured mobile AVIF was approximately 8.8KB and the desktop variant approximately 2.9KB.
- Logo width and height are declared, preventing layout shift.
- CLS was 0 in all recorded runs.
- Static fonts and optimized images use immutable long-lived caching.
- Font files are preloaded and use local Next.js font assets.
- Lighthouse reported no actionable unused CSS, unused JavaScript, oversized-image, responsive-image, or offscreen-image failures.
- Analytics and Clarity do not load before consent, so they do not affect the default first load.
- The production page used one approximately 8KB transferred stylesheet. Lighthouse identified it as a 165ms render-blocking request under mobile simulation, but removing or asynchronously loading core layout CSS would risk flash/layout instability for little benefit.

### Remaining performance consideration

The main mobile variability is framework hydration and style/layout work. The shared Next.js/React JavaScript is approximately 103KB first-load JS, with the homepage at approximately 111KB. One simulated mobile trace recorded 430ms TBT after the fixes, while other runs varied materially. No application-specific unused bundle was identified.

**Recommendation:** collect real-user INP and LCP after deployment before redesigning client boundaries. If field INP is poor, profile `WeekHero`, `Header`, `CookieConsent`, and the calendar interactions with the React Profiler and Chrome Performance panel. Avoid a speculative rewrite while lab LCP/CLS and the 90+ target already pass.

## Sitemap and robots audit

| Check | Result | Status |
|---|---|---|
| Sitemap availability | `/sitemap.xml` returns successfully | **Pass** |
| Intended indexable URLs | 74 canonical URLs | **Pass** |
| Sitemap response status | All 74 return HTTP 200 | **Pass** |
| Canonicals | All 74 are self-canonical on `https://numerosemanas.es` | **Pass** |
| Indexability | No sitemap URL is meta-noindex or blocked in launch mode | **Pass** |
| Redirected sitemap URLs | None | **Pass** |
| Missing indexable crawl URLs | None | **Pass** |
| Orphan sitemap URLs | None | **Pass** |
| Placeholder/noindex URLs | 24 intentionally excluded from the sitemap | **Pass** |
| Development robots | `Disallow: /` plus response-level `noindex, nofollow` unless launch is explicitly enabled | **Pass** |
| Launch robots | With `SITE_INDEXING=enabled`: `Allow: /` and production sitemap declaration | **Pass in local launch-mode test** |

The full crawler inspected 101 pages and 6,228 rendered links. It found no broken internal links, redirect chains, loops, blocked canonical pages, or sitemap inconsistencies.

## Analytics configuration audit

### Verified in source

- GA4 uses `NEXT_PUBLIC_GA_ID` and loads only after explicit analytics consent.
- Microsoft Clarity uses `NEXT_PUBLIC_CLARITY_ID` and follows the same consent gate.
- No analytics or Clarity request occurs in the default no-consent Lighthouse run.
- GA4 landing page configuration is present.
- Consent-gated client-side route page views are now explicitly recorded.
- There is no ecommerce checkout or paid product, so ecommerce tracking is currently not applicable.

### Not verifiable locally

- No real GA4 measurement ID is present in the workspace; `.env.example` contains placeholders only.
- GA4 Realtime/DebugView receipt, property timezone, data retention, internal-traffic filters, referral exclusions, and consent-mode reporting cannot be checked without account access and a deployed origin.
- Google Search Console ownership, sitemap submission, indexing reports, Core Web Vitals field data, manual actions, and URL Inspection are unavailable without a live verified property.

### Recommended conversion events after GA4 is connected

| Priority | Event | Trigger |
|---|---|---|
| High | `contact_submit` | Contact form successfully accepted by the API |
| High | `file_download` | PDF or iCalendar download begins |
| Medium | `widget_code_copy` | Visitor copies the widget embed code |
| Medium | `calendar_filter` | Visitor selects an autonomous community or changes the date/year |

Implement and validate these in GA4 DebugView only after the measurement ID and event naming plan are confirmed. Do not mark clicks as conversions unless they represent an actual business objective.

## Deployment checklist and remaining tasks

| Priority | Task | Owner/status |
|---|---|---|
| Critical | Set `SITE_INDEXING=enabled` only on the public production deployment | Deployment task; **unverified** |
| Critical | Add the real `NEXT_PUBLIC_GA_ID` and, if desired, `NEXT_PUBLIC_CLARITY_ID` | Account/deployment task; **unverified** |
| High | Verify analytics consent, landing page view, and SPA route page views in GA4 DebugView | Requires deployment/account access |
| High | Verify `https://numerosemanas.es/sitemap.xml` in Google Search Console and submit it once | Requires live verified property |
| High | Inspect representative homepage, year, calendar, and city URLs in Search Console | Requires live verified property |
| High | Run PageSpeed Insights mobile and desktop on the public origin and review CrUX after sufficient traffic | Requires deployment |
| Medium | Add only the conversion events approved as real business outcomes | Requires analytics plan |
| Medium | Monitor field INP before attempting a hydration/client-boundary rewrite | Requires real-user data |

## Verification completed

- Fresh optimized production build passed.
- ESLint passed.
- 28 unit tests passed.
- Mobile and desktop Lighthouse completed successfully.
- Post-fix Lighthouse: 90 mobile performance and 100 desktop performance; accessibility, best practices, and SEO all 100.
- Production-mode sitemap/SEO audit passed.
- Full-site crawl passed across 101 URLs.

