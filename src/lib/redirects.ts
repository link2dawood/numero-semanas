/**
 * Consolidated URLs (HTTP 301 to one primary page), served by src/middleware.ts
 * together with trailing-slash normalisation (always one hop), and
 * verified by scripts/check-seo.ts and scripts/crawl-site.ts.
 * Kept free of page content so the edge middleware bundle stays small.
 */
export const consolidatedRedirects: { source: string; destination: string }[] = [
  { source: "/semana-par-o-impar", destination: "/semanas-pares-e-impares" },
  { source: "/suscripcion-ical", destination: "/suscripcion-calendario" },
  { source: "/que-es-el-numero-de-semana", destination: "/numeros-de-semana" },
  { source: "/plantillas-calendario", destination: "/calendario-imprimible" },
  // Holiday pages: redirect hyphenated to folder structure
  { source: "/festivos-2020", destination: "/festivos/2020" },
  { source: "/festivos-2021", destination: "/festivos/2021" },
  { source: "/festivos-2022", destination: "/festivos/2022" },
  { source: "/festivos-2023", destination: "/festivos/2023" },
  { source: "/festivos-2024", destination: "/festivos/2024" },
  { source: "/festivos-2025", destination: "/festivos/2025" },
  { source: "/festivos-2026", destination: "/festivos/2026" },
  { source: "/festivos-2027", destination: "/festivos/2027" },
  { source: "/festivos-2028", destination: "/festivos/2028" },
  // Community shortcuts
  { source: "/festivos/madrid", destination: "/festivos/comunidad-de-madrid/2027" },
  { source: "/festivos/cataluna", destination: "/festivos/cataluna/2027" },
  { source: "/festivos/andalucia", destination: "/festivos/andalucia/2027" },
  { source: "/festivos/valencia", destination: "/festivos/comunitat-valenciana/2027" },
];

/**
 * Year URLs whose canonical page lives at a dedicated slug (308, matching the
 * pages' own permanentRedirect fallback). Resolved in the middleware so
 * trailing-slash variants still take a single hop.
 */
export const yearAliasRedirects: { source: string; destination: string }[] = [
  { source: "/semanas/2026", destination: "/semanas-2026" },
  { source: "/calendario/2027", destination: "/calendario-2027" },
];
