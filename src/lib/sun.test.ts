import { describe, expect, it } from "vitest";
import { nearbySunCities, sunCities, sunTimesForDate } from "./sun";

describe("NOAA sunrise and sunset calculations", () => {
  it("returns sunrise and sunset for Madrid on the summer solstice", () => {
    const madrid = sunCities.find((city) => city.slug === "madrid");
    expect(madrid).toBeDefined();
    const times = sunTimesForDate(2026, 6, 21, madrid!);
    expect(times).not.toBeNull();
    expect(times!.sunrise.getTime()).toBeLessThan(times!.sunset.getTime());
    const localSunrise = new Intl.DateTimeFormat("en-GB", {
      timeZone: madrid!.timeZone,
      hour: "2-digit",
    }).format(times!.sunrise);
    expect(Number(localSunrise)).toBeGreaterThanOrEqual(6);
    expect(Number(localSunrise)).toBeLessThan(8);
  });

  it("uses the Canary Islands time zone for the island cities", () => {
    const city = sunCities.find((item) => item.slug === "las-palmas");
    expect(city?.timeZone).toBe("Atlantic/Canary");
    expect(sunTimesForDate(2026, 11, 11, city!)).not.toBeNull();
  });

  it("rejects invalid calendar dates", () => {
    const madrid = sunCities[0];
    expect(sunTimesForDate(2026, 2, 30, madrid)).toBeNull();
  });
});

describe("nearbySunCities", () => {
  it("returns the closest other cities, nearest first", () => {
    const bySlug = (slug: string) => sunCities.find((city) => city.slug === slug)!;
    expect(nearbySunCities(bySlug("las-palmas"), 1).map((c) => c.slug)).toEqual(["santa-cruz-de-tenerife"]);
    expect(nearbySunCities(bySlug("vigo"), 1).map((c) => c.slug)).toEqual(["a-coruna"]);
    expect(nearbySunCities(bySlug("madrid")).every((c) => c.slug !== "madrid")).toBe(true);
  });

  it("links every city from at least one sibling (the hub links all of them too)", () => {
    const inbound = new Map<string, number>();
    for (const city of sunCities) {
      for (const other of nearbySunCities(city)) inbound.set(other.slug, (inbound.get(other.slug) ?? 0) + 1);
    }
    for (const city of sunCities) expect(inbound.get(city.slug) ?? 0).toBeGreaterThanOrEqual(1);
  });
});
