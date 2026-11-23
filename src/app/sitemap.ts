import type { MetadataRoute } from "next";
import { footerPageSlugs } from "@/lib/footer-pages";
import { SITE_URL } from "@/lib/site";
import { sunCities } from "@/lib/sun";

// Only canonical, indexable URLs belong here. Excluded on purpose:
// - "semanas/2026", "calendario/2027": 308 redirects to their canonical pages.
// - consolidated URLs that 301 to a primary page (see consolidatedRedirects).
// lastModified is omitted: a constantly changing "now" date is ignored by Google.
export default function sitemap(): MetadataRoute.Sitemap {
  const fixedRoutes = [
    "",
    "semanas-2026",
    "lista-semanas-2027",
    "calendario-2027",
    "widget",
    ...footerPageSlugs,
    ...Array.from({ length: 53 }, (_, index) => `semana/${index + 1}`),
    ...sunCities.map((city) => `amanecer-atardecer/${city.slug}`),
  ];
  const years = Array.from({ length: 16 }, (_, index) => 2020 + index);
  const routes = [
    ...new Set([
      ...fixedRoutes,
      ...years
        .filter((year) => year !== 2026)
        .map((year) => `semanas/${year}`),
      ...years
        .filter((year) => year !== 2027)
        .map((year) => `calendario/${year}`),
    ]),
  ];

  return routes.map((route) => ({
    url: route ? `${SITE_URL}/${route}` : SITE_URL,
  }));
}
