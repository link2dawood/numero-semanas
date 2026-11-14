import {
  consolidatedRedirects,
  footerPageSlugs,
  isFooterPageIndexable,
} from "../src/lib/footer-pages";

const baseUrl = process.env.BASE_URL ?? "http://localhost:3000";
// Canonical URLs always point at the production domain, whatever BASE_URL is.
const siteUrl = "https://numerosemanas.es";
// EXPECT_STAGING=true audits a staging build: indexing must be blocked
// (robots.txt Disallow + X-Robots-Tag noindex); all other checks still run.
const expectStaging = process.env.EXPECT_STAGING === "true";

type PageAudit = {
  path: string;
  status: number;
  html: string;
  robotsHeader: string;
};

async function main() {
  const failures: string[] = [];

  const robotsTxt = await (await fetch(`${baseUrl}/robots.txt`, { cache: "no-store" })).text();
  const blocksEverything = /^\s*Disallow:\s*\/\s*$/im.test(robotsTxt);
  if (expectStaging && !blocksEverything) {
    failures.push("staging: robots.txt does not block crawling (Disallow: /)");
  }
  if (!expectStaging && blocksEverything) {
    console.error(
      "robots.txt blocks the whole site (staging mode). Set SITE_INDEXING=enabled for the launch audit, or run with EXPECT_STAGING=true to audit a staging build.",
    );
    process.exitCode = 1;
    return;
  }

  const sitemapResponse = await fetch(`${baseUrl}/sitemap.xml`, { cache: "no-store" });
  if (!sitemapResponse.ok) {
    throw new Error(`Sitemap failed: HTTP ${sitemapResponse.status}`);
  }
  const sitemap = await sitemapResponse.text();
  const paths = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => {
    const url = new URL(match[1]);
    return `${url.pathname}${url.search}`;
  });
  const noindexPaths = footerPageSlugs
    .filter((slug) => !isFooterPageIndexable(slug))
    .map((slug) => `/${slug}`);
  const auditPaths = [...new Set([...paths, ...noindexPaths, "/semana/1", "/semana/53"])];
  const pages = await fetchAll(auditPaths, "follow");

  const inboundLinks = new Map(paths.map((path) => [path, 0]));
  const seenTitles = new Map<string, string[]>();
  const seenDescriptions = new Map<string, string[]>();
  const internalLinks = new Map<string, string>(); // target path → first page linking to it

  for (const page of pages) {
    const inSitemap = paths.includes(page.path);
    const title = elementText(page.html, "title");
    const description = metaContent(page.html, "description");
    const canonical = linkHref(page.html, "canonical");
    const robotsMeta = metaContent(page.html, "robots");
    const h1Count = (page.html.match(/<h1\b/gi) ?? []).length;
    const missingAltCount = [...page.html.matchAll(/<img\b[^>]*>/gi)].filter(
      (match) => !/\balt=(['"])[\s\S]*?\1/i.test(match[0]),
    ).length;

    if (page.status !== 200) failures.push(`${page.path}: HTTP ${page.status}`);
    if (!title) failures.push(`${page.path}: missing title`);
    if (!description) failures.push(`${page.path}: missing meta description`);
    if (h1Count !== 1) failures.push(`${page.path}: expected 1 H1, found ${h1Count}`);
    if (missingAltCount > 0) {
      failures.push(`${page.path}: ${missingAltCount} image(s) missing alt text`);
    }
    if (expectStaging && !/noindex/i.test(page.robotsHeader)) {
      failures.push(`${page.path}: staging response lacks X-Robots-Tag: noindex`);
    }

    if (inSitemap) {
      if (/noindex|none/i.test(robotsMeta)) {
        failures.push(`${page.path}: sitemap URL has <meta name="robots" content="${robotsMeta}">`);
      }
      if (!expectStaging && /noindex|none/i.test(page.robotsHeader)) {
        failures.push(`${page.path}: sitemap URL sends X-Robots-Tag: ${page.robotsHeader}`);
      }
      const expectedCanonical = new URL(page.path, siteUrl).toString().replace(/\/$/, "");
      if (!canonical) failures.push(`${page.path}: missing canonical URL`);
      else if (canonical.replace(/\/$/, "") !== expectedCanonical) {
        failures.push(`${page.path}: canonical points elsewhere (${canonical})`);
      }
      // Titles/meta (Phase 2): lengths, uniqueness, social tags, no stray hreflang.
      const plainTitle = decodeEntities(title);
      const plainDescription = decodeEntities(description);
      if (plainTitle.length > 60) failures.push(`${page.path}: title is ${plainTitle.length} chars (max 60)`);
      if (plainDescription.length < 140 || plainDescription.length > 160) {
        failures.push(`${page.path}: description is ${plainDescription.length} chars (want 140–160)`);
      }
      seenTitles.set(plainTitle, [...(seenTitles.get(plainTitle) ?? []), page.path]);
      seenDescriptions.set(plainDescription, [...(seenDescriptions.get(plainDescription) ?? []), page.path]);
      const ogUrl = propertyContent(page.html, "og:url");
      if (!ogUrl) failures.push(`${page.path}: missing og:url`);
      else if (ogUrl.replace(/\/$/, "") !== expectedCanonical) {
        failures.push(`${page.path}: og:url (${ogUrl}) differs from canonical`);
      }
      if (!propertyContent(page.html, "og:image")) failures.push(`${page.path}: missing og:image`);
      if (/<link\b[^>]*hreflang=/i.test(page.html)) {
        failures.push(`${page.path}: unexpected hreflang alternate on a single-language site`);
      }
      // Headings (Phase 3): H1 first in document order, no skipped levels, no empty/duplicate headings.
      const headings = extractHeadings(page.html);
      if (headings[0]?.level !== 1) {
        failures.push(`${page.path}: first heading in the HTML is H${headings[0]?.level} "${headings[0]?.text}", not the H1`);
      }
      const seenHeadings = new Set<string>();
      headings.forEach((heading, index) => {
        const previous = headings[index - 1];
        if (previous && heading.level > previous.level + 1) {
          failures.push(`${page.path}: heading jumps H${previous.level}→H${heading.level} at "${heading.text}"`);
        }
        if (!heading.text) failures.push(`${page.path}: empty H${heading.level}`);
        const key = `${heading.level}|${heading.text.toLowerCase()}`;
        if (seenHeadings.has(key)) failures.push(`${page.path}: duplicate H${heading.level} "${heading.text}"`);
        seenHeadings.add(key);
      });
      // Structured data (Phase 4): see auditJsonLd.
      failures.push(...auditJsonLd(page.path, page.html).map((issue) => `${page.path}: ${issue}`));
    } else if (!/noindex/i.test(robotsMeta)) {
      failures.push(`${page.path}: not in sitemap but indexable (robots="${robotsMeta}")`);
    } else if (canonical) {
      failures.push(`${page.path}: noindex page declares a canonical (${canonical})`);
    }

    for (const match of page.html.matchAll(/<a\b[^>]*href=(['"])(.*?)\1/gi)) {
      const href = (match[2] ?? "").replaceAll("&amp;", "&");
      let url: URL;
      try {
        url = new URL(href, baseUrl);
      } catch {
        failures.push(`${page.path}: invalid link ${href}`);
        continue;
      }
      if (url.origin !== new URL(baseUrl).origin) continue;
      if (!internalLinks.has(url.pathname + url.search)) {
        internalLinks.set(url.pathname + url.search, page.path);
      }
      if (inboundLinks.has(url.pathname) && url.pathname !== page.path) {
        inboundLinks.set(url.pathname, (inboundLinks.get(url.pathname) ?? 0) + 1);
      }
    }
  }

  for (const [value, pagesWithValue] of [...seenTitles, ...seenDescriptions]) {
    if (pagesWithValue.length > 1) {
      failures.push(`duplicate title/description "${value}" on ${pagesWithValue.join(", ")}`);
    }
  }

  for (const path of noindexPaths) {
    if (paths.includes(path)) failures.push(`${path}: noindex page listed in sitemap`);
  }
  for (const [path, count] of inboundLinks) {
    if (path !== "/" && count === 0) failures.push(`${path}: orphan sitemap page`);
  }

  // Consolidated URLs: exactly one 301 hop to a 200 page, never listed in the sitemap.
  for (const { source, destination } of consolidatedRedirects) {
    const hop = await fetch(new URL(source, baseUrl), { redirect: "manual", cache: "no-store" });
    const location = hop.headers.get("location") ?? "";
    const target = location ? new URL(location, baseUrl).pathname : "";
    if (hop.status !== 301) failures.push(`${source}: expected 301, got ${hop.status}`);
    if (target !== destination) failures.push(`${source}: redirects to "${target}", expected ${destination}`);
    const final = await fetch(new URL(destination, baseUrl), { redirect: "manual", cache: "no-store" });
    if (final.status !== 200) failures.push(`${source}: destination ${destination} returns ${final.status} (chain or error)`);
    if (paths.includes(source)) failures.push(`${source}: redirected URL listed in sitemap`);
  }

  // Every internal link must resolve directly (no 404s, no hops through redirects).
  const linkResults = await fetchAll([...internalLinks.keys()], "manual");
  for (const result of linkResults) {
    if (result.status === 200) continue;
    failures.push(
      `${result.path}: internal link returns ${result.status} (linked from ${internalLinks.get(result.path)})`,
    );
  }

  if (failures.length > 0) {
    console.error(failures.join("\n"));
    process.exitCode = 1;
    return;
  }

  console.log(
    [
      `Passed SEO checks (${expectStaging ? "staging" : "production"} mode):`,
      `- ${paths.length} sitemap URLs: 200, indexable, self-canonical, one H1, alt text, no orphans`,
      `  titles ≤60 chars, descriptions 140–160 chars, all unique; og:url = canonical, og:image present, no hreflang`,
      `  headings: H1 first in the HTML, no skipped levels, no empty or duplicate headings`,
      `  JSON-LD: valid JSON, safely escaped, absolute production URLs, no duplicate types, no FAQPage;`,
      `  home = WebSite + Organization, other pages = one BreadcrumbList matching the visible trail`,
      `- ${noindexPaths.length} placeholder pages: noindex, no canonical, not in sitemap`,
      `- ${consolidatedRedirects.length} consolidated URLs: single 301 hop to a 200 page`,
      `- ${linkResults.length} unique internal links: all return 200 directly`,
    ].join("\n"),
  );
}

async function fetchAll(paths: string[], redirect: RequestRedirect): Promise<PageAudit[]> {
  const results: PageAudit[] = [];
  for (let index = 0; index < paths.length; index += 10) {
    const batch = await Promise.all(
      paths.slice(index, index + 10).map(async (path) => {
        const response = await fetch(new URL(path, baseUrl), { redirect, cache: "no-store" });
        return {
          path,
          status: response.status,
          html: await response.text(),
          robotsHeader: response.headers.get("x-robots-tag") ?? "",
        };
      }),
    );
    results.push(...batch);
  }
  return results;
}

function elementText(html: string, tag: string): string {
  return (
    new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i")
      .exec(html)?.[1]
      ?.replace(/<[^>]+>/g, "")
      .trim() ?? ""
  );
}

function metaContent(html: string, name: string): string {
  return attributeFromTag(html, "meta", "name", name, "content");
}

function extractHeadings(html: string): { level: number; text: string }[] {
  const markup = html.replace(/<script\b[\s\S]*?<\/script>/gi, "");
  return [...markup.matchAll(/<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi)].map((match) => ({
    level: Number(match[1]),
    text: decodeEntities(match[2].replace(/<!-- -->/g, "").replace(/<[^>]+>/g, " "))
      .replace(/\s+/g, " ")
      .trim(),
  }));
}

function propertyContent(html: string, property: string): string {
  return attributeFromTag(html, "meta", "property", property, "content");
}

function decodeEntities(value: string): string {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function linkHref(html: string, rel: string): string {
  return attributeFromTag(html, "link", "rel", rel, "href");
}

function attributeFromTag(
  html: string,
  tagName: string,
  selectorName: string,
  selectorValue: string,
  resultName: string,
): string {
  for (const match of html.matchAll(new RegExp(`<${tagName}\\b[^>]*>`, "gi"))) {
    const tag = match[0];
    const selector = new RegExp(`\\b${selectorName}=(['"])${selectorValue}\\1`, "i");
    if (!selector.test(tag)) continue;
    return new RegExp(`\\b${resultName}=(['"])(.*?)\\1`, "i").exec(tag)?.[2] ?? "";
  }
  return "";
}

/**
 * Phase 4 structured-data rules for one rendered page. Returns problems found.
 * Home: exactly WebSite + Organization. Every other indexable page: exactly one
 * BreadcrumbList whose names match the visible "Migas de pan" trail.
 */
function auditJsonLd(path: string, html: string): string[] {
  const issues: string[] = [];
  const blocks = [...html.matchAll(/<script\b[^>]*type=(['"])application\/ld\+json\1[^>]*>([\s\S]*?)<\/script>/gi)]
    .map((match) => match[2]);
  const types: string[] = [];
  const nodes: Record<string, unknown>[] = [];

  for (const raw of blocks) {
    if (/[<>]/.test(raw)) issues.push("JSON-LD contains unescaped < or >");
    let data: Record<string, unknown>;
    try {
      data = JSON.parse(raw);
    } catch {
      issues.push("JSON-LD is not valid JSON");
      continue;
    }
    if (data["@context"] !== "https://schema.org") issues.push(`JSON-LD @context is ${String(data["@context"])}`);
    const topLevel = Array.isArray(data["@graph"]) ? (data["@graph"] as Record<string, unknown>[]) : [data];
    for (const node of topLevel) {
      types.push(String(node["@type"]));
      nodes.push(node);
    }
  }

  // Any URL-valued property must be absolute and on the production domain.
  const walk = (value: unknown, key = ""): void => {
    if (Array.isArray(value)) return value.forEach((entry) => walk(entry, key));
    if (value && typeof value === "object") {
      return Object.entries(value).forEach(([childKey, child]) => walk(child, childKey));
    }
    if (typeof value === "string" && ["url", "item", "@id", "logo"].includes(key)) {
      if (!value.startsWith(`${siteUrl}/`)) issues.push(`JSON-LD ${key} is not an absolute ${siteUrl} URL: ${value}`);
    }
  };
  nodes.forEach((node) => walk(node));

  const duplicates = types.filter((type, index) => types.indexOf(type) !== index);
  if (duplicates.length) issues.push(`duplicate JSON-LD types: ${[...new Set(duplicates)].join(", ")}`);
  if (types.includes("FAQPage")) issues.push("FAQPage JSON-LD is not allowed (see src/lib/structured-data.ts)");

  const expected = path === "/" ? ["Organization", "WebSite"] : ["BreadcrumbList"];
  if ([...types].sort().join(",") !== expected.join(",")) {
    issues.push(`JSON-LD types [${types.join(", ")}], expected [${expected.join(", ")}]`);
  }

  const breadcrumb = nodes.find((node) => node["@type"] === "BreadcrumbList");
  if (breadcrumb) {
    const items = (breadcrumb.itemListElement ?? []) as { position: number; name: string; item?: string }[];
    items.forEach((entry, index) => {
      if (entry.position !== index + 1) issues.push(`breadcrumb position ${entry.position} at index ${index}`);
      if (index < items.length - 1 && !entry.item) issues.push(`breadcrumb "${entry.name}" has no item URL`);
    });
    const nav = /<nav\b[^>]*aria-label="Migas de pan"[^>]*>([\s\S]*?)<\/nav>/i.exec(html)?.[1] ?? "";
    const visible = [...nav.matchAll(/<li\b[^>]*>([\s\S]*?)<\/li>/gi)].map((match) =>
      decodeEntities(match[1].replace(/<span aria-hidden="true">\/<\/span>/g, "").replace(/<[^>]+>/g, "")).trim(),
    );
    const names = items.map((entry) => entry.name);
    if (visible.join(" / ") !== names.join(" / ")) {
      issues.push(`breadcrumb JSON-LD [${names.join(" / ")}] differs from visible trail [${visible.join(" / ")}]`);
    }
  }
  return issues;
}

void main();
