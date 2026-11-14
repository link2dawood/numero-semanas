/**
 * Sitewide internal-link and URL audit.
 *
 *   BASE_URL=http://localhost:3100 npm run check:crawl
 *
 * Crawls every HTML page reachable through standard <a href> links from the
 * homepage and the sitemap, and reports:
 * - broken internal links (4xx/5xx) and the pages that contain them
 * - internal links that hit a redirect (should point at the final URL)
 * - redirect chains (>1 hop) and loops
 * - consolidated URLs that do not 301 to their primary page
 * - canonical problems (missing, not https, wrong host, not self-referencing)
 * - sitemap URLs that redirect, fail or are noindex; indexable pages missing
 *   from the sitemap; indexable pages with no inbound HTML link (orphans)
 * - links with trailing slashes, query parameters or absolute own-host URLs
 * - generic anchor text ("aquí", "leer más", …) and empty anchors
 * Exit code 1 on any error-level finding.
 */
import { request as httpRequest } from "node:http";
import { request as httpsRequest } from "node:https";
import { consolidatedRedirects, yearAliasRedirects } from "../src/lib/redirects";
import { SITE_URL } from "../src/lib/site";

const baseUrl = (process.env.BASE_URL ?? "http://localhost:3000").replace(/\/$/, "");
const preferredHost = new URL(SITE_URL).host;
const MAX_PAGES = 1000;
const GENERIC_ANCHORS = new Set([
  "aquí", "aqui", "clic aquí", "haz clic aquí", "pulsa aquí", "más", "mas", "ver más",
  "leer más", "más información", "click here", "here", "read more", "enlace", "link", "ver",
]);

type Hop = { url: string; status: number; location?: string };
type PageResult = {
  path: string;
  hops: Hop[];
  status: number; // final status
  finalPath: string;
  html?: string;
  canonical?: string;
  robots?: string;
  xRobots?: string;
};
type LinkRef = { from: string; href: string; text: string; inMain: boolean };

const errors: string[] = [];
const warnings: string[] = [];
const cache = new Map<string, Promise<PageResult>>();

async function resolve(path: string): Promise<PageResult> {
  if (!cache.has(path)) cache.set(path, fetchWithHops(path));
  return cache.get(path)!;
}

async function fetchWithHops(path: string): Promise<PageResult> {
  const hops: Hop[] = [];
  const seen = new Set<string>();
  let current = path;
  for (let i = 0; i < 10; i += 1) {
    if (seen.has(current)) {
      hops.push({ url: current, status: -1 });
      return { path, hops, status: -1, finalPath: current };
    }
    seen.add(current);
    const response = await fetch(baseUrl + current, { redirect: "manual", cache: "no-store" });
    const location = response.headers.get("location") ?? undefined;
    hops.push({ url: current, status: response.status, location });
    if (response.status >= 300 && response.status < 400 && location) {
      const next = new URL(location, baseUrl + current);
      if (next.origin !== new URL(baseUrl).origin) {
        return { path, hops, status: response.status, finalPath: next.href };
      }
      current = next.pathname + next.search;
      await response.arrayBuffer();
      continue;
    }
    const type = response.headers.get("content-type") ?? "";
    const html = type.includes("text/html") ? await response.text() : (await response.arrayBuffer(), undefined);
    return {
      path,
      hops,
      status: response.status,
      finalPath: current,
      html,
      canonical: html ? attr(html, /<link\b[^>]*rel="canonical"[^>]*>/i, "href") : undefined,
      robots: html ? attr(html, /<meta\b[^>]*name="robots"[^>]*>/i, "content") : undefined,
      xRobots: response.headers.get("x-robots-tag") ?? undefined,
    };
  }
  return { path, hops, status: -2, finalPath: current };
}

/** GET with an explicit Host header (fetch/undici silently drops it). */
function rawGet(url: string, host: string): Promise<{ status: number; location: string }> {
  const target = new URL(url);
  const send = target.protocol === "https:" ? httpsRequest : httpRequest;
  return new Promise((resolvePromise, reject) => {
    const req = send(target, { method: "GET", headers: { host } }, (res) => {
      res.resume();
      resolvePromise({ status: res.statusCode ?? 0, location: String(res.headers.location ?? "") });
    });
    req.on("error", reject);
    req.end();
  });
}

function attr(html: string, tagPattern: RegExp, name: string): string | undefined {
  const tag = tagPattern.exec(html)?.[0];
  if (!tag) return undefined;
  return new RegExp(`\\b${name}="([^"]*)"`, "i").exec(tag)?.[1]?.replaceAll("&amp;", "&");
}

function decode(text: string): string {
  return text
    .replace(/<[^>]+>/g, " ")
    .replaceAll("&amp;", "&").replaceAll("&nbsp;", " ").replaceAll("&#x27;", "'").replaceAll("&quot;", '"')
    .replace(/\s+/g, " ")
    .trim();
}

function extractLinks(from: string, html: string): LinkRef[] {
  const links: LinkRef[] = [];
  const main = /<main\b[\s\S]*?<\/main>/i.exec(html);
  const mainStart = main?.index ?? -1;
  const mainEnd = main ? mainStart + main[0].length : -1;
  for (const match of html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)) {
    const inMain = (match.index ?? 0) > mainStart && (match.index ?? 0) < mainEnd;
    const href = /\bhref="([^"]*)"/i.exec(match[1])?.[1]?.replaceAll("&amp;", "&");
    if (href === undefined) continue;
    const label = /\baria-label="([^"]*)"/i.exec(match[1])?.[1];
    const imgAlt = /<img\b[^>]*\balt="([^"]*)"/i.exec(match[2])?.[1];
    links.push({ from, href, text: decode(match[2]) || label || imgAlt || "", inMain });
  }
  return links;
}

function internalPath(href: string): { path: string; hash: string } | null {
  if (href.startsWith("#") || /^(mailto|tel|javascript):/i.test(href)) return null;
  const url = new URL(href, SITE_URL + "/");
  const own = url.host === preferredHost || url.host === "www." + preferredHost || href.startsWith("/");
  if (!own || href.startsWith("//")) return null;
  return { path: url.pathname + url.search, hash: url.hash };
}

async function sitemapPaths(): Promise<string[]> {
  const xml = await (await fetch(`${baseUrl}/sitemap.xml`)).text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => {
    const url = new URL(m[1]);
    if (url.origin !== SITE_URL) errors.push(`sitemap: ${m[1]} does not use ${SITE_URL}`);
    return url.pathname + url.search;
  });
}

async function main() {
  const sitemap = await sitemapPaths();
  // ?fecha= variants of the home page render year-dependent links (incl. years
  // outside the 2020–2035 range that has year pages).
  const querySeeds = ["/?fecha=2019-12-30", "/?fecha=2026-12-31", "/?fecha=2030-05-01", "/?fecha=2036-02-01"];
  const queue = ["/", ...sitemap, ...querySeeds];
  const visited = new Set<string>();
  const inbound = new Map<string, Set<string>>();
  const contextual = new Map<string, Set<string>>();
  const allLinks: LinkRef[] = [];

  while (queue.length > 0 && visited.size < MAX_PAGES) {
    const batch = queue.splice(0, 16).filter((path) => !visited.has(path));
    batch.forEach((path) => visited.add(path));
    const results = await Promise.all(batch.map(resolve));
    for (const result of results) {
      if (!result.html || result.status !== 200) continue;
      const from = result.finalPath;
      for (const link of extractLinks(from, result.html)) {
        allLinks.push(link);
        const target = internalPath(link.href);
        if (!target || target.path.startsWith("/api/")) continue;
        if (!inbound.has(target.path)) inbound.set(target.path, new Set());
        inbound.get(target.path)!.add(from);
        if (link.inMain && target.path !== from) {
          if (!contextual.has(target.path)) contextual.set(target.path, new Set());
          contextual.get(target.path)!.add(from);
        }
        if (!visited.has(target.path) && !target.path.includes("?")) queue.push(target.path);
      }
    }
  }

  // --- link-level checks ------------------------------------------------
  const linkTargets = new Map<string, LinkRef[]>();
  for (const link of allLinks) {
    const target = internalPath(link.href);
    if (!target) continue;
    if (/^https?:\/\//i.test(link.href)) {
      const url = new URL(link.href);
      if (url.protocol !== "https:" || url.host !== preferredHost) {
        errors.push(`${link.from}: absolute link ${link.href} not on https://${preferredHost}`);
      } else if (link.from !== "/widget") {
        warnings.push(`${link.from}: absolute own-host link ${link.href} (prefer a root-relative path)`);
      }
    }
    if (target.path.length > 1 && target.path.split("?")[0].endsWith("/")) {
      errors.push(`${link.from}: trailing-slash link ${link.href}`);
    }
    if (target.path.includes("?") && !target.path.startsWith("/api/")) {
      warnings.push(`${link.from}: query-parameter link ${link.href}`);
    }
    if (!link.text) errors.push(`${link.from}: link to ${link.href} has no accessible text`);
    else if (GENERIC_ANCHORS.has(link.text.toLowerCase())) {
      warnings.push(`${link.from}: generic anchor text "${link.text}" → ${link.href}`);
    }
    const list = linkTargets.get(target.path) ?? [];
    list.push(link);
    linkTargets.set(target.path, list);
  }

  const targetResults = new Map<string, PageResult>();
  await Promise.all(
    [...linkTargets.keys()].map(async (path) => targetResults.set(path, await resolve(path))),
  );
  for (const [path, refs] of linkTargets) {
    const result = targetResults.get(path)!;
    const pages = [...new Set(refs.map((ref) => ref.from))];
    const where = `${pages.length} page(s), e.g. ${pages.slice(0, 3).join(", ")}`;
    if (result.status === -1) errors.push(`LOOP ${path}: ${result.hops.map((h) => h.url).join(" → ")}`);
    else if (result.hops.length > 1) {
      errors.push(`linked redirect ${path} → ${result.finalPath} (${result.hops[0].status}) from ${where}`);
    } else if (result.status >= 400 || result.status < 0) {
      errors.push(`BROKEN ${path} (${result.status}) linked from ${where}`);
    }
  }

  // --- redirect checks ----------------------------------------------------
  for (const { source, destination } of consolidatedRedirects) {
    const result = await resolve(source);
    const first = result.hops[0];
    if (first.status !== 301) errors.push(`consolidated ${source}: expected 301, got ${first.status}`);
    if (result.hops.length !== 2) errors.push(`consolidated ${source}: ${result.hops.length - 1} hops (expected 1)`);
    if (result.finalPath !== destination || result.status !== 200) {
      errors.push(`consolidated ${source}: ends at ${result.finalPath} (${result.status}), expected ${destination} 200`);
    }
  }
  const variantRedirects: [string, string][] = [
    ...yearAliasRedirects.flatMap(({ source, destination }) => [
      [source, destination] as [string, string],
      [`${source}/`, destination] as [string, string],
    ]),
    ...consolidatedRedirects.map(({ source, destination }) => [`${source}/`, destination] as [string, string]),
    ...sitemap.filter((p) => p !== "/").slice(0, 400).map((p) => [`${p}/`, p] as [string, string]),
  ];
  const chainReport: string[] = [];
  await Promise.all(
    variantRedirects.map(async ([source, destination]) => {
      const result = await resolve(source);
      const hops = result.hops.length - 1;
      if (result.finalPath !== destination || result.status !== 200) {
        errors.push(`redirect ${source}: ends at ${result.finalPath} (${result.status}), expected ${destination}`);
      } else if (hops > 1) {
        chainReport.push(`${source}: ${result.hops.map((h) => `${h.url} [${h.status}]`).join(" → ")}`);
      }
    }),
  );
  for (const chain of chainReport) warnings.push(`redirect chain (${chain})`);

  // --- preferred host: every www variant must reach its final https URL in one 301
  const wwwCases: [string, string][] = [
    ["/", "/"],
    ["/semanas-2026/?a=1", "/semanas-2026?a=1"],
    ...[...consolidatedRedirects, ...yearAliasRedirects].map(
      ({ source, destination }) => [`${source}/`, destination] as [string, string],
    ),
  ];
  for (const [source, destination] of wwwCases) {
    try {
      const www = await rawGet(baseUrl + source, `www.${preferredHost}`);
      const location = www.location;
      const expected = destination === "/" ? `${SITE_URL}/` : SITE_URL + destination;
      if (www.status !== 301 || location !== expected) {
        errors.push(`www${source}: expected one 301 to ${expected}, got ${www.status} ${location}`);
      }
    } catch (error) {
      warnings.push(`www host check skipped (${String(error)})`);
      break;
    }
  }

  // --- page-level checks --------------------------------------------------
  const sitemapSet = new Set(sitemap);
  const pages = [...visited].map((path) => cache.get(path)!);
  const finalPages = await Promise.all(pages);
  const rows: { path: string; status: number; indexable: boolean; inSitemap: boolean; inbound: number; inMain: number }[] = [];
  for (const page of finalPages) {
    if (page.hops.length > 1 || page.status !== 200 || !page.html) {
      if (sitemapSet.has(page.path)) errors.push(`sitemap URL ${page.path} returns ${page.hops[0].status}`);
      continue;
    }
    const noindex = /noindex/i.test(page.robots ?? "");
    const indexable = !noindex;
    const inbound_ = inbound.get(page.path)?.size ?? 0;
    if (page.path.includes("?")) continue;
    rows.push({
      path: page.path,
      status: page.status,
      indexable,
      inSitemap: sitemapSet.has(page.path),
      inbound: inbound_,
      inMain: contextual.get(page.path)?.size ?? 0,
    });
    if (indexable) {
      const expected = page.path === "/" ? SITE_URL : SITE_URL + page.path;
      if (!page.canonical) errors.push(`${page.path}: indexable page without canonical`);
      else if (page.canonical !== expected) {
        errors.push(`${page.path}: canonical ${page.canonical} ≠ ${expected}`);
      }
      if (!sitemapSet.has(page.path)) errors.push(`${page.path}: indexable but missing from sitemap`);
      if (inbound_ === 0 && page.path !== "/") errors.push(`${page.path}: orphan (no inbound <a href> link)`);
    } else {
      if (sitemapSet.has(page.path)) errors.push(`${page.path}: noindex but listed in sitemap`);
      if (page.canonical) warnings.push(`${page.path}: noindex page declares canonical ${page.canonical}`);
    }
  }

  rows.sort((a, b) => a.path.localeCompare(b.path));
  console.log(`Crawled ${visited.size} URLs from ${baseUrl} (${sitemap.length} in sitemap, ${allLinks.length} <a> links)`);
  console.log(`\n${"Path".padEnd(46)}Status  Index  Sitemap  Inbound  In-content`);
  console.log("-".repeat(92));
  for (const row of rows) {
    console.log(
      `${row.path.padEnd(46)}${String(row.status).padEnd(8)}${(row.indexable ? "yes" : "no").padEnd(7)}${(row.inSitemap ? "yes" : "no").padEnd(9)}${String(row.inbound).padEnd(9)}${row.inMain}`,
    );
  }
  if (process.env.SHOW_ANCHORS) {
    console.log("\nAnchors by target:");
    for (const [path, refs] of [...linkTargets].sort()) {
      const texts = [...new Set(refs.map((r) => r.text))];
      console.log(`${path}  ←  ${texts.join(" | ")}`);
    }
  }
  const uniqueWarnings = [...new Set(warnings)];
  if (uniqueWarnings.length) console.log(`\n${uniqueWarnings.length} warning(s):\n${uniqueWarnings.join("\n")}`);
  const uniqueErrors = [...new Set(errors)];
  if (uniqueErrors.length) {
    console.error(`\n${uniqueErrors.length} error(s):\n${uniqueErrors.join("\n")}`);
    process.exitCode = 1;
  } else {
    console.log("\nPassed: no broken links, linked redirects, chains, loops, canonical or sitemap problems.");
  }
}

void main();
