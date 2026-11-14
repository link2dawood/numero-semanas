import { describe, expect, it } from "vitest";
import { footerPages } from "./footer-pages";
import { inlineLinkTargets, parseInlineLinks, stripInlineLinks } from "./inline-links";

describe("parseInlineLinks", () => {
  it("splits text and internal links", () => {
    expect(parseInlineLinks("Ver [semanas pares](/semanas-pares-e-impares) hoy.")).toEqual([
      { text: "Ver " },
      { text: "semanas pares", href: "/semanas-pares-e-impares" },
      { text: " hoy." },
    ]);
  });

  it("ignores non-root-relative targets", () => {
    expect(parseInlineLinks("[x](https://example.com) y [y](javascript:alert(1))")).toEqual([
      { text: "[x](https://example.com) y [y](javascript:alert(1))" },
    ]);
  });

  it("strips markup to plain text", () => {
    expect(stripInlineLinks("La [regla ISO](/numeros-de-semana).")).toBe("La regla ISO.");
  });
});

describe("editorial inline links", () => {
  const knownPaths = new Set([
    "/",
    "/semanas-2026",
    "/lista-semanas-2027",
    "/calendario-2027",
    ...Object.keys(footerPages).map((slug) => `/${slug}`),
    ...Array.from({ length: 16 }, (_, i) => [`/semanas/${2020 + i}`, `/calendario/${2020 + i}`]).flat(),
  ]);

  it("point at existing, canonical routes without trailing slashes or redirects", () => {
    const paragraphs = Object.values(footerPages).flatMap((page) =>
      page.sections.flatMap((section) => section.paragraphs),
    );
    const targets = inlineLinkTargets(paragraphs);
    expect(targets.length).toBeGreaterThan(0);
    for (const href of targets) {
      expect(knownPaths.has(href), href).toBe(true);
      expect(["/semanas/2026", "/calendario/2027"]).not.toContain(href);
    }
  });

  it("never link a page to itself", () => {
    for (const [slug, page] of Object.entries(footerPages)) {
      const targets = inlineLinkTargets(page.sections.flatMap((section) => section.paragraphs));
      expect(targets, slug).not.toContain(`/${slug}`);
      expect(page.related.map((link) => link.href), slug).not.toContain(`/${slug}`);
    }
  });
});
