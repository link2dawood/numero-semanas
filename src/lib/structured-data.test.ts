import { describe, expect, it } from "vitest";
import {
  breadcrumbJsonLd,
  homeJsonLd,
  serializeJsonLd,
} from "./structured-data";

describe("serializeJsonLd", () => {
  it("cannot close the script element and stays valid JSON", () => {
    const data = { name: "</script><script>alert(1)</script> & <!-- \u2028" };
    const output = serializeJsonLd(data);
    expect(output).not.toMatch(/[<>&\u2028\u2029]/);
    expect(JSON.parse(output)).toEqual(data);
  });
});

describe("breadcrumbJsonLd", () => {
  it("uses absolute URLs and omits item only on the current page", () => {
    const list = breadcrumbJsonLd([
      { label: "Inicio", href: "/" },
      { label: "Calendario 2027", href: "/calendario-2027" },
      { label: "Lista de semanas 2027" },
    ]) as { itemListElement: { position: number; item?: string }[] };
    expect(list.itemListElement.map((entry) => entry.position)).toEqual([1, 2, 3]);
    expect(list.itemListElement[0].item).toBe("https://numerosemanas.es/");
    expect(list.itemListElement[1].item).toBe("https://numerosemanas.es/calendario-2027");
    expect(list.itemListElement[2]).not.toHaveProperty("item");
  });

  it("rejects an unlinked intermediate item", () => {
    expect(() =>
      breadcrumbJsonLd([{ label: "Inicio" }, { label: "Página" }]),
    ).toThrow();
  });
});

describe("homeJsonLd", () => {
  it("links the WebSite to its publisher Organization", () => {
    const graph = (homeJsonLd()["@graph"] as Record<string, unknown>[]);
    const website = graph.find((node) => node["@type"] === "WebSite")!;
    const organization = graph.find((node) => node["@type"] === "Organization")!;
    expect(website.publisher).toEqual({ "@id": organization["@id"] });
    expect(website.url).toBe("https://numerosemanas.es/");
  });
});
