/**
 * Minimal inline-link syntax for editorial copy: `[anchor text](/internal-path)`.
 * Only root-relative internal paths are recognised, so content strings cannot
 * introduce external or javascript: URLs.
 */
export type InlineSegment = { text: string; href?: string };

const LINK = /\[([^\]]+)\]\((\/[^)\s]*)\)/g;

export function parseInlineLinks(source: string): InlineSegment[] {
  const segments: InlineSegment[] = [];
  let last = 0;
  for (const match of source.matchAll(LINK)) {
    const index = match.index ?? 0;
    if (index > last) segments.push({ text: source.slice(last, index) });
    segments.push({ text: match[1], href: match[2] });
    last = index + match[0].length;
  }
  if (last < source.length) segments.push({ text: source.slice(last) });
  return segments;
}

/** The copy with link markup removed (for meta tags, JSON-LD, plain text). */
export function stripInlineLinks(source: string): string {
  return source.replace(LINK, "$1");
}

/** Every internal path referenced by inline links in the given strings. */
export function inlineLinkTargets(sources: string[]): string[] {
  return sources.flatMap((source) =>
    parseInlineLinks(source).flatMap((segment) => (segment.href ? [segment.href] : [])),
  );
}
