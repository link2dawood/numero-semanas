import type { MetadataRoute } from "next";
import { indexableFooterPageSlugs } from "@/lib/footer-pages";
import { TERRITORIES } from "@/lib/holidays";
import { SITE_URL } from "@/lib/site";
import { sunCities } from "@/lib/sun";
import { weeksInYear } from "@/lib/weeks";

// Only canonical, indexable URLs belong here. Excluded on purpose:
// - "semanas/2026", "calendario/2027": 308 redirects to their canonical pages.
// - consolidated URLs that 301 to a primary page (see consolidatedRedirects).

type SitemapEntry = { url: string; lastModified?: Date };

// Last content update date for static tool pages
const TOOLS_UPDATED = new Date("2026-11-25");
// Holiday data is typically published in October of the previous year
function holidayDataDate(year: number): Date {
  return new Date(`${year - 1}-10-15`);
}
// Week data is immutable for a given year (ISO calendar is fixed)
function weekDataDate(year: number): Date {
  return new Date(`${year}-01-01`);
}

export default function sitemap(): MetadataRoute.Sitemap {
  const years = Array.from({ length: 16 }, (_, index) => 2020 + index);
  const entries: SitemapEntry[] = [];

  // Homepage - updates frequently (shows current week)
  entries.push({ url: SITE_URL, lastModified: new Date() });

  // Week/year routes - lastModified is start of that year
  for (const year of years) {
    const weeks = weeksInYear(year);
    const lastMod = weekDataDate(year);
    for (let week = 1; week <= weeks; week++) {
      entries.push({
        url: `${SITE_URL}/semana/${week}/${year}`,
        lastModified: lastMod,
      });
    }
  }

  // Week-only routes (redirect to current year, but canonical)
  for (let week = 1; week <= 53; week++) {
    entries.push({
      url: `${SITE_URL}/semana/${week}`,
      lastModified: TOOLS_UPDATED,
    });
  }

  // Holiday routes (2020-2028)
  const holidayYears = Array.from({ length: 9 }, (_, i) => 2020 + i);
  const holidaySlugs = [
    "ano-nuevo", "reyes", "viernes-santo", "fiesta-del-trabajo",
    "asuncion", "fiesta-nacional", "todos-los-santos", "constitucion",
    "inmaculada", "navidad",
  ];

  for (const year of holidayYears) {
    const lastMod = holidayDataDate(year);
    entries.push({ url: `${SITE_URL}/festivos/${year}`, lastModified: lastMod });
    for (const slug of holidaySlugs) {
      entries.push({
        url: `${SITE_URL}/festivos/${year}/${slug}`,
        lastModified: lastMod,
      });
    }
    for (const territory of TERRITORIES) {
      entries.push({
        url: `${SITE_URL}/festivos/${territory.slug}/${year}`,
        lastModified: lastMod,
      });
    }
  }

  // Year calendar/weeks pages
  for (const year of years) {
    const lastMod = weekDataDate(year);
    if (year !== 2026) {
      entries.push({ url: `${SITE_URL}/semanas/${year}`, lastModified: lastMod });
    }
    if (year !== 2027) {
      entries.push({ url: `${SITE_URL}/calendario/${year}`, lastModified: lastMod });
    }
  }

  // Static feature pages - use TOOLS_UPDATED
  const staticPages = [
    "semanas-2026",
    "lista-semanas-2027",
    "calendario-2027",
    "widget",
    "calculadora-dias-entre-fechas",
    "calculadora-sumar-dias",
    "dias-hasta-ano-nuevo",
    "dias-hasta-verano",
    "planificador-vacaciones",
    "calculadora-horas-trabajo",
    "planificador-proyectos",
    ...indexableFooterPageSlugs,
  ];

  for (const page of staticPages) {
    entries.push({ url: `${SITE_URL}/${page}`, lastModified: TOOLS_UPDATED });
  }

  // Sun/sunrise pages
  for (const city of sunCities) {
    entries.push({
      url: `${SITE_URL}/amanecer-atardecer/${city.slug}`,
      lastModified: TOOLS_UPDATED,
    });
  }

  // Deduplicate by URL (keep first occurrence)
  const seen = new Set<string>();
  return entries.filter((entry) => {
    if (seen.has(entry.url)) return false;
    seen.add(entry.url);
    return true;
  });
}
