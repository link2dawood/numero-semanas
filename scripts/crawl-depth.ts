/**
 * Crawl-depth and site-architecture audit.
 *
 *   BASE_URL=http://localhost:3100 npm run check:depth
 *
 * Breadth-first crawl that starts ONLY at the homepage and follows plain
 * <a href> links (no sitemap seeding, no query-string URLs), the way a search
 * engine discovers pages from the front door. Reports:
 * - click depth of every reachable page (shortest path from "/")
 * - the same depth when header/footer links are ignored ("content depth"),
 *   which shows whether the body copy alone gives each page a path
 * - indexable pages deeper than MAX_DEPTH clicks (error)
 * - sitemap URLs the homepage crawl never reaches (orphans → error)
 * - indexable pages reached by the crawl but absent from the sitemap (error)
 * - indexable pages whose only inbound links are sitewide chrome (warning)
 * - URL-inventory guards: out-of-range dynamic segments must 404 and
 *   parameterised variants must not be indexable under their own URL
 * Placeholder (noindex) pages are crawled for discovery but excluded from the
 * depth and orphan findings.
 */
import { SITE_URL } from "../src/lib/site";

const baseUrl = (process.env.BASE_URL ?? "http://localhost:3000").replace(/\/$/, "");
const MAX_DEPTH = 3;
const MAX_PAGES = 1000;

type Zone = "header" | "main" | "footer" | "other";
type Page = { path: string; status: number; html?: string; indexable: boolean; canonical?: string };
type Edge = { from: string; to: string; zone: Zone };

const errors: string[] = [];
const warnings: string[] = [];

async function get(path: string): Promise<Page> {
  const response = await fetch(baseUrl + path, { redirect: "manual", cache: "no-store" });
  const type = response.headers.get("content-type") ?? "";
  const html = response.status === 200 && type.includes("text/html") ? await response.text() : undefined;
  if (!html) await response.arrayBuffer().catch(() => undefined);
  const robots = html ? /<meta\b[^>]*name="robots"[^>]*content="([^"]*)"/i.exec(html)?.[1] : undefined;
  const canonical = html ? /<link\b[^>]*rel="canonical"[^>]*href="([^"]*)"/i.exec(html)?.[1] : undefined;
  return { path, status: response.status, html, indexable: !!html && !/noindex/i.test(robots ?? ""), canonical };
}

function zoneRanges(html: string): { zone: Zone; start: number; end: number }[] {
  const ranges: { zone: Zone; start: number; end: number }[] = [];
  for (const zone of ["header", "main", "footer"] as const) {
    const match = new RegExp(`<${zone}\\b[\\s\\S]*?</${zone}>`, "i").exec(html);
    if (match) ranges.push({ zone, start: match.index, end: match.index + match[0].length });
  }
  return ranges;
}

function extractEdges(from: string, html: string): Edge[] {
  const ranges = zoneRanges(html);
  const edges: Edge[] = [];
  for (const match of html.matchAll(/<a\b([^>]*)>/gi)) {
    const href = /\bhref="([^"]*)"/i.exec(match[1])?.[1]?.replaceAll("&amp;", "&");
    if (!href || href.startsWith("#") || /^(mailto|tel|javascript):/i.test(href)) continue;
    const url = new URL(href, SITE_URL + from);
    if (url.origin !== SITE_URL && !href.startsWith("/")) continue;
    if (url.pathname.startsWith("/api/")) continue;
    const to = url.pathname + url.search;
    const index = match.index ?? 0;
    const zone = ranges.find((r) => index >= r.start && index < r.end)?.zone ?? "other";
    edges.push({ from, to, zone });
  }
  return edges;
}

async function sitemapPaths(): Promise<string[]> {
  const xml = await (await fetch(`${baseUrl}/sitemap.xml`)).text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
}

/** Shortest-path BFS over a fixed edge list. */
function bfs(edges: Edge[], allow: (edge: Edge) => boolean): Map<string, number> {
  const out = new Map<string, string[]>();
  for (const edge of edges) {
    if (!allow(edge)) continue;
    out.set(edge.from, [...(out.get(edge.from) ?? []), edge.to]);
  }
  const depth = new Map<string, number>([["/", 0]]);
  const queue = ["/"];
  while (queue.length) {
    const current = queue.shift()!;
    for (const next of out.get(current) ?? []) {
      if (depth.has(next)) continue;
      depth.set(next, depth.get(current)! + 1);
      queue.push(next);
    }
  }
  return depth;
}

async function main() {
  const pages = new Map<string, Page>();
  const edges: Edge[] = [];
  const depth = new Map<string, number>([["/", 0]]);
  const parent = new Map<string, string>();
  let frontier = ["/"];

  while (frontier.length && pages.size < MAX_PAGES) {
    const results = await Promise.all(frontier.map(get));
    const next: string[] = [];
    for (const page of results) {
      pages.set(page.path, page);
      if (!page.html) continue;
      for (const edge of extractEdges(page.path, page.html)) {
        edges.push(edge);
        // Query-string URLs are reported, never followed: they are not part
        // of the indexable inventory.
        if (edge.to.includes("?") || depth.has(edge.to)) continue;
        depth.set(edge.to, depth.get(page.path)! + 1);
        parent.set(edge.to, page.path);
        next.push(edge.to);
      }
    }
    frontier = next;
  }

  const contentDepth = bfs(edges, (edge) => edge.zone === "main");
  const sitemap = await sitemapPaths();
  const sitemapSet = new Set(sitemap);
  const inbound = new Map<string, { chrome: Set<string>; main: Set<string> }>();
  for (const edge of edges) {
    if (edge.to === edge.from) continue;
    const entry = inbound.get(edge.to) ?? { chrome: new Set(), main: new Set() };
    (edge.zone === "main" ? entry.main : entry.chrome).add(edge.from);
    inbound.set(edge.to, entry);
  }

  const queryLinks = [...new Set(edges.filter((e) => e.to.includes("?")).map((e) => `${e.from} → ${e.to}`))];
  for (const link of queryLinks) warnings.push(`query-string link ${link}`);

  const indexable = [...pages.values()].filter((p) => p.status === 200 && p.indexable);
  const placeholders = [...pages.values()].filter((p) => p.status === 200 && !p.indexable);
  for (const page of pages.values()) {
    if (page.status !== 200) errors.push(`${page.path} returned ${page.status} (linked from ${parent.get(page.path)})`);
  }

  const rows = indexable
    .map((page) => ({
      path: page.path,
      depth: depth.get(page.path)!,
      content: contentDepth.get(page.path),
      main: inbound.get(page.path)?.main.size ?? 0,
      chrome: inbound.get(page.path)?.chrome.size ?? 0,
      via: chain(page.path, parent),
    }))
    .sort((a, b) => a.depth - b.depth || a.path.localeCompare(b.path));

  for (const row of rows) {
    if (row.depth > MAX_DEPTH) errors.push(`${row.path}: ${row.depth} clicks from home (${row.via})`);
    if (!sitemapSet.has(row.path)) errors.push(`${row.path}: indexable, reachable, missing from sitemap`);
    if (row.content === undefined && row.main > 0) {
      warnings.push(`${row.path}: content island (in-content links only from pages that are themselves reachable only via header/footer)`);
    }
    if (row.path !== "/" && row.main === 0) {
      warnings.push(`${row.path}: no in-content links (only header/footer chrome: ${row.chrome} pages)`);
    }
  }
  for (const path of sitemap) {
    if (!pages.has(path)) errors.push(`ORPHAN ${path}: in sitemap but not reachable from the homepage`);
    else if (!pages.get(path)!.indexable) errors.push(`${path}: in sitemap but noindex`);
  }

  // --- URL-inventory guards: dynamic segments must not mint new pages -------
  const guards: [string, number][] = [
    ["/semanas/2019", 404], ["/semanas/2036", 404], ["/semanas/abc", 404], ["/semanas/02027", 404],
    ["/calendario/2019", 404], ["/calendario/2036", 404], ["/calendario/abc", 404],
    ["/semana/0", 404], ["/semana/54", 404], ["/semana/1.5", 404],
    ["/amanecer-atardecer/atlantida", 404], ["/amanecer-atardecer/madrid/x", 404],
    ["/no-existe", 404], ["/aviso-legal/x", 404],
  ];
  for (const [path, expected] of guards) {
    const { status } = await get(path);
    if (status !== expected) errors.push(`inventory guard ${path}: expected ${expected}, got ${status}`);
  }
  // Parameterised variants must canonicalise to the clean URL or be noindex.
  for (const path of ["/?fecha=2030-05-01", "/semanas-2026?utm_source=x", "/widget?size=large", "/semana/12"]) {
    const page = await get(path);
    if (page.status !== 200) continue;
    const clean = path.split("?")[0];
    const expected = clean === "/" ? SITE_URL : SITE_URL + clean;
    if (page.indexable && page.canonical !== expected) {
      errors.push(`${path}: indexable with canonical ${page.canonical ?? "(none)"} (expected ${expected})`);
    }
  }

  // --- report ---------------------------------------------------------------
  const histogram = new Map<number, number>();
  for (const row of rows) histogram.set(row.depth, (histogram.get(row.depth) ?? 0) + 1);
  console.log(`Homepage-only crawl of ${baseUrl}: ${pages.size} URLs, ${edges.length} links`);
  console.log(`Indexable: ${indexable.length} · placeholders (noindex, excluded): ${placeholders.length} · sitemap: ${sitemap.length}`);
  console.log(`Depth distribution (indexable): ${[...histogram].sort().map(([d, n]) => `${d} clicks: ${n}`).join(" · ")}`);
  console.log(`\n${"Path".padEnd(44)}Depth  Content  In-main  Chrome  Shortest path`);
  console.log("-".repeat(110));
  for (const row of rows) {
    console.log(
      `${row.path.padEnd(44)}${String(row.depth).padEnd(7)}${String(row.content ?? "—").padEnd(9)}${String(row.main).padEnd(9)}${String(row.chrome).padEnd(8)}${row.via}`,
    );
  }
  if (warnings.length) console.log(`\n${warnings.length} warning(s):\n${warnings.join("\n")}`);
  if (errors.length) {
    console.error(`\n${errors.length} error(s):\n${errors.join("\n")}`);
    process.exitCode = 1;
  } else {
    console.log(`\nPassed: every indexable page is within ${MAX_DEPTH} clicks, no orphans, sitemap matches the crawl.`);
  }
}

function chain(path: string, parent: Map<string, string>): string {
  const steps = [path];
  while (parent.has(steps[0])) steps.unshift(parent.get(steps[0])!);
  return steps.join(" → ");
}

void main();
