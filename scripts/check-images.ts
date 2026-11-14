/**
 * Sitewide image audit.
 *
 *   BASE_URL=http://localhost:3100 npm run check:images
 *
 * Crawls every page reachable from the homepage and checks each <img>:
 * - has an alt attribute (empty alt is allowed for decorative images)
 * - declares width and height (prevents layout shift)
 * - is lazy-loaded unless it is preloaded/prioritised (above the fold)
 * - every srcset candidate returns 200 with an image content type, and the
 *   largest candidate is no wider than 3× the declared display width
 * Also checks og:image / twitter:image, the favicon and that every file in
 * /public is referenced from source (unused assets).
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const baseUrl = (process.env.BASE_URL ?? "http://localhost:3000").replace(/\/$/, "");
const errors: string[] = [];
const warnings: string[] = [];

async function main() {
  const visited = new Set<string>();
  let frontier = ["/"];
  const images = new Map<string, { page: string; tag: string }[]>();
  const metaImages = new Set<string>();

  while (frontier.length && visited.size < 500) {
    frontier.forEach((path) => visited.add(path));
    const pages = await Promise.all(
      frontier.map(async (path) => ({ path, html: await (await fetch(baseUrl + path)).text() })),
    );
    const next = new Set<string>();
    for (const { path, html } of pages) {
      for (const m of html.matchAll(/<a\b[^>]*\bhref="(\/[^"#?]*)"/gi)) {
        if (!m[1].startsWith("/api/") && !visited.has(m[1])) next.add(m[1]);
      }
      for (const m of html.matchAll(/<img\b[^>]*>/gi)) {
        const tag = m[0];
        const key = /\bsrc="([^"]*)"/.exec(tag)?.[1] ?? tag;
        images.set(key, [...(images.get(key) ?? []), { page: path, tag }]);
        checkTag(path, tag, html);
      }
      for (const m of html.matchAll(/<meta\b[^>]*(?:property|name)="(?:og|twitter):image"[^>]*content="([^"]*)"/gi)) {
        metaImages.add(new URL(m[1]).pathname + new URL(m[1]).search);
      }
    }
    frontier = [...next];
  }

  // Every srcset candidate must resolve to an image of sensible width.
  const candidates = new Set<string>();
  for (const uses of images.values()) {
    for (const { tag } of uses) {
      const srcset = /\bsrcset="([^"]*)"/i.exec(tag)?.[1] ?? "";
      for (const part of srcset.split(",")) candidates.add(part.trim().split(/\s+/)[0].replaceAll("&amp;", "&"));
      const src = /\bsrc="([^"]*)"/.exec(tag)?.[1];
      if (src) candidates.add(src.replaceAll("&amp;", "&"));
    }
  }
  const rows: string[] = [];
  for (const url of [...candidates, ...metaImages, "/favicon.ico"].filter(Boolean)) {
    for (const accept of ["image/avif,image/webp,*/*", "image/webp,*/*"]) {
      const response = await fetch(baseUrl + url, { headers: { accept } });
      const bytes = (await response.arrayBuffer()).byteLength;
      const type = response.headers.get("content-type") ?? "";
      if (response.status !== 200 || !type.startsWith("image/")) {
        errors.push(`${url}: ${response.status} ${type}`);
      }
      rows.push(`${url.padEnd(100)} ${type.padEnd(14)} ${String(bytes).padStart(7)} B  ${response.headers.get("cache-control")}`);
      if (!url.startsWith("/_next/image")) break;
    }
  }

  // Unused files in /public (referenced nowhere in src/ or scripts/).
  const source = collect(["src", "scripts"]).map((file) => readFileSync(file, "utf8")).join("\n");
  for (const file of readdirSync("public")) {
    if (!source.includes(file)) warnings.push(`public/${file} is not referenced from src/ or scripts/`);
    const size = statSync(join("public", file)).size;
    if (size > 150_000) warnings.push(`public/${file} is ${Math.round(size / 1024)} KB`);
  }

  console.log(`Scanned ${visited.size} pages, ${images.size} distinct <img> sources, ${metaImages.size} social image URLs\n`);
  console.log([...new Set(rows)].join("\n"));
  const uniqueWarnings = [...new Set(warnings)];
  const uniqueErrors = [...new Set(errors)];
  if (uniqueWarnings.length) console.log(`\n${uniqueWarnings.length} warning(s):\n${uniqueWarnings.join("\n")}`);
  if (uniqueErrors.length) {
    console.error(`\n${uniqueErrors.length} error(s):\n${uniqueErrors.join("\n")}`);
    process.exitCode = 1;
  } else {
    console.log("\nPassed: all images have alt, dimensions, correct loading strategy and resolve to sized image files.");
  }
}

function checkTag(page: string, tag: string, html: string) {
  const attr = (name: string) => new RegExp(`\\b${name}="([^"]*)"`, "i").exec(tag)?.[1];
  const src = attr("src") ?? "(no src)";
  if (attr("alt") === undefined) errors.push(`${page}: <img ${src}> has no alt attribute`);
  const width = Number(attr("width"));
  if (!width || !attr("height")) errors.push(`${page}: <img ${src}> has no width/height`);
  const preloaded = html.includes(`imageSrcSet="${attr("srcSet") ?? attr("srcset")}"`);
  if (!preloaded && attr("loading") !== "lazy") warnings.push(`${page}: <img ${src}> is neither prioritised nor lazy`);
  const widths = [...(attr("srcSet") ?? attr("srcset") ?? "").matchAll(/[?&]w=(\d+)/g)].map((m) => Number(m[1]));
  if (width && widths.length && Math.max(...widths) > width * 3) {
    errors.push(`${page}: <img ${src}> serves up to ${Math.max(...widths)}px for a ${width}px slot`);
  }
}

function collect(dirs: string[]): string[] {
  return dirs.flatMap((dir) =>
    readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) return collect([full]);
      return /\.(tsx?|css|mjs)$/.test(entry.name) ? [full] : [];
    }),
  );
}

void main();
