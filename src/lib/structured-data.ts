import { SITE_URL } from "./site";

/**
 * Schema.org JSON-LD builders. All data comes from trusted, in-repo values
 * (site constants, page config, computed dates); `serializeJsonLd` still
 * escapes every string so nothing can break out of the <script> element.
 *
 * Deliberately NOT emitted:
 * - FAQPage: Google limits FAQ rich results to authoritative government and
 *   health sites, and the visible FAQs here are largely shared templates.
 * - Article/author/datePublished: there is no verified author or byline.
 * - Organization legalName/address/sameAs/contactPoint: not published anywhere
 *   on the site. Add them only once they are real and visible (e.g. Aviso legal).
 * - WebSite SearchAction: the site has no search results page.
 */

export const SITE_NAME = "NumeroSemanas";
export const SITE_DESCRIPTION =
  "Consulta el número de semana actual en España, explora calendarios ISO, festivos y semanas pares o impares.";
export const SITE_LANGUAGE = "es-ES";

const ORGANIZATION_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;

type JsonLdNode = Record<string, unknown>;

/** Absolute URL on the production domain (JSON-LD must never use relative URLs). */
export function absoluteUrl(path: string): string {
  return new URL(path, SITE_URL).toString();
}

/**
 * JSON for an inline <script type="application/ld+json">. Escapes "<", ">"
 * and "&" (so "</script>" or "<!--" in any string cannot end the element) and
 * the U+2028/U+2029 line separators. The output is still valid JSON.
 */
export function serializeJsonLd(data: JsonLdNode): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

export function organizationNode(): JsonLdNode {
  return {
    "@type": "Organization",
    "@id": ORGANIZATION_ID,
    name: SITE_NAME,
    url: `${SITE_URL}/`,
    logo: {
      "@type": "ImageObject",
      url: absoluteUrl("/numerosemanas-logo.png"),
      width: 2172,
      height: 724,
    },
  };
}

export function websiteNode(): JsonLdNode {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: SITE_NAME,
    url: `${SITE_URL}/`,
    description: SITE_DESCRIPTION,
    inLanguage: SITE_LANGUAGE,
    publisher: { "@id": ORGANIZATION_ID },
  };
}

/** Home page graph: the site and the organization behind it, emitted once. */
export function homeJsonLd(): JsonLdNode {
  return {
    "@context": "https://schema.org",
    "@graph": [websiteNode(), organizationNode()],
  };
}

export type BreadcrumbItem = { label: string; href?: string };

/**
 * BreadcrumbList mirroring the visible trail. Every item except the last
 * (the current page) must link somewhere; the last may omit `item`.
 */
export function breadcrumbJsonLd(items: BreadcrumbItem[]): JsonLdNode {
  items.slice(0, -1).forEach((entry) => {
    if (!entry.href) {
      throw new Error(`Breadcrumb "${entry.label}" needs an href (only the last item may omit it)`);
    }
  });
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((entry, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: entry.label,
      ...(entry.href ? { item: absoluteUrl(entry.href) } : {}),
    })),
  };
}
