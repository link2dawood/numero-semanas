/**
 * Consolidated URLs (HTTP 301 to one primary page), served by src/middleware.ts
 * together with the trailing-slash and www normalisation (always one hop), and
 * verified by scripts/check-seo.ts and scripts/crawl-site.ts.
 * Kept free of page content so the edge middleware bundle stays small.
 */
export const consolidatedRedirects: { source: string; destination: string }[] = [
  { source: "/semana-par-o-impar", destination: "/semanas-pares-e-impares" },
  { source: "/suscripcion-ical", destination: "/suscripcion-calendario" },
  { source: "/que-es-el-numero-de-semana", destination: "/numeros-de-semana" },
  { source: "/plantillas-calendario", destination: "/calendario-imprimible" },
];

/**
 * Year URLs whose canonical page lives at a dedicated slug (308, matching the
 * pages' own permanentRedirect fallback). Resolved in the middleware so that
 * www/trailing-slash variants still take a single hop.
 */
export const yearAliasRedirects: { source: string; destination: string }[] = [
  { source: "/semanas/2026", destination: "/semanas-2026" },
  { source: "/calendario/2027", destination: "/calendario-2027" },
];
