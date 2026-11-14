# Technical SEO audit — NumeroSemanas

**Audit date:** 14 November 2026  
**Environment:** Local optimized Next.js production build  
**Canonical production origin configured in source:** `https://numerosemanas.es`  
**Scope:** Indexing, redirects and errors, crawl depth, and orphan pages

## Executive result

The optimized build passes the technical SEO checks in both development/staging mode and launch/indexing mode. The audit crawled 101 HTML URLs, checked 74 sitemap URLs, inspected 6,333 rendered internal links, and tested URL-inventory guards. One internal-linking weakness was found and fixed: `/devoluciones` previously had only sitewide footer links. It now also receives a relevant contextual link from `/terminos-de-uso`.

## Findings and completion status

| Area | Issue | Affected URL | Priority | Recommended fix | Status |
|---|---|---|---|---|---|
| Orphan/internal linking | Page was not orphaned, but all 96 inbound sources were sitewide footer links and there were no contextual links. | `https://numerosemanas.es/devoluciones` | Medium | Add a relevant in-content link from the related legal content at `/terminos-de-uso`. | **Completed and verified** |
| Indexing | Development and preview environments must remain excluded from indexing. The application already returns `X-Robots-Tag: noindex, nofollow` and `robots.txt` with `Disallow: /` unless explicitly enabled. | All URLs in non-production environments | High | Keep `SITE_INDEXING` disabled outside the public production deployment. | **Verified; no change needed** |
| Indexing | Public launch must be explicitly enabled. With `SITE_INDEXING=enabled`, `robots.txt` allows crawling, declares the production sitemap, and sitemap pages do not return an `X-Robots-Tag` block. | All 74 sitemap URLs | High | Set `SITE_INDEXING=enabled` only on the public production deployment. | **Verified in launch-mode build** |
| Canonicals | Missing, conflicting, or non-self-referencing canonical URLs. | All 74 sitemap URLs | High | Use one HTTPS self-canonical per indexable page. | **No issue found** |
| Noindex/sitemap consistency | Noindex pages appearing in the sitemap or declaring conflicting canonicals. | 24 intentional placeholder/tool pages | High | Keep placeholders `noindex, follow`, without canonicals, and out of the sitemap until substantive content is available. | **No issue found** |
| Redirects | Broken redirects, chains, loops, linked redirects, or wrong consolidated status codes. | Entire crawled URL inventory; specifically `/semana-par-o-impar`, `/suscripcion-ical`, `/que-es-el-numero-de-semana`, and `/plantillas-calendario` | High | Keep consolidated URLs as a single 301 hop to a 200 canonical destination; keep year aliases and slash normalization single-hop. | **No issue found** |
| Broken URLs | Internal 4xx/5xx links. | 99 unique internal link targets / 6,333 rendered links | High | Point links directly to a 200 response. | **No issue found** |
| Crawl depth | Indexable pages deeper than three clicks from the homepage. | All 74 indexable pages | Medium | Keep important URLs within three clicks. | **No issue found: maximum depth is 2** |
| Orphan pages | Sitemap URLs not reachable from homepage links. | All 74 sitemap URLs | High | Add crawlable HTML links from relevant pages. | **No issue found** |

## Before-and-after verification

| Check | Before | After |
|---|---|---|
| Contextual inbound links to `/devoluciones` | 0; footer-only inbound links from 96 crawled pages | 1 contextual link from `/terminos-de-uso`, plus existing footer links |
| Crawl-depth audit | Passed with one internal-linking warning | Passed with no warnings or errors |
| Full crawler | 6,332 rendered links; no broken links, loops, chains, canonical, or sitemap errors | 6,333 rendered links; no broken links, loops, chains, canonical, or sitemap errors |
| Development/staging indexing | `Disallow: /` and response-level `noindex, nofollow` | Unchanged and verified |
| Launch-mode indexing | Not part of the content edit | Verified with `Allow: /`, production sitemap declaration, and no response-level indexing block |

## Crawl-depth distribution

| Click depth from homepage | Indexable URLs |
|---:|---:|
| 0 | 1 |
| 1 | 57 |
| 2 | 16 |

No indexable page requires 3 or more clicks. The 16 depth-two pages are the city-specific sunrise/sunset pages, linked from the main sunrise/sunset hub.

## Intentional noindex pages

The following 24 development placeholders/tools are intentionally excluded from the sitemap and carry `noindex`: `/app-android`, `/calculadora-dias`, `/calculadora-edad`, `/calculadora-semanas`, `/calculadora-vacaciones`, `/calculadoras`, `/calendario-laboral`, `/calendario-mensual`, `/cambio-hora-2027`, `/dias-hasta-navidad`, `/dias-laborables`, `/dias-laborables-2027`, `/duracion-del-dia`, `/extension-chrome`, `/festivos-2026`, `/festivos-2027`, `/festivos-por-comunidad`, `/preguntas-frecuentes`, `/puentes-2026`, `/puentes-2027`, `/santoral`, `/solsticio-invierno`, `/vacaciones-escolares`, and `/widget`.

## Verification performed

- Fresh optimized build completed successfully.
- 28 automated unit tests passed.
- ESLint passed.
- Staging-mode SEO audit passed.
- Launch-mode SEO audit passed.
- Full-site crawler passed with no broken links, linked redirects, redirect chains, redirect loops, canonical conflicts, sitemap mismatches, or orphan pages.
- Homepage-only crawl-depth audit passed after the contextual-link fix.
- Navigation/footer route checks passed.
- Image SEO and image response checks passed.

## Not verifiable before deployment

These items cannot be confirmed against a local development environment:

- Actual Google index coverage, exclusions, crawl stats, manual actions, and URL Inspection results in Google Search Console.
- Public DNS, TLS, CDN, reverse-proxy, hosting-platform, HTTP-to-HTTPS, and apex/`www` behavior on the deployed domain.
- Production server logs and real Googlebot crawl behavior.
- Whether the deployed environment contains the required `SITE_INDEXING=enabled` setting.

Run the same crawl against the public URL after deployment and verify Google Search Console before considering production indexing fully confirmed.
