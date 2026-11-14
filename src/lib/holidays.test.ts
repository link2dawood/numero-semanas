import { describe, expect, it } from "vitest";
import { easterSunday, nationalHolidaysForYear } from "./holidays";

describe("Spanish national holiday dates", () => {
  it("calculates Easter Sunday for 2026 and 2027", () => {
    expect(easterSunday(2026)).toEqual(new Date(2026, 3, 5));
    expect(easterSunday(2027)).toEqual(new Date(2027, 2, 28));
  });

  it("includes Good Friday and fixed national dates", () => {
    const holidays2026 = nationalHolidaysForYear(2026);
    expect(holidays2026).toContainEqual(
      expect.objectContaining({ date: "2026-04-03", name: "Viernes Santo" }),
    );
    expect(holidays2026).toContainEqual(
      expect.objectContaining({ date: "2026-10-12", name: "Fiesta Nacional de España" }),
    );
    expect(holidays2026.every(({ scope }) => scope === "national")).toBe(true);
  });

  it("returns an empty list for invalid years", () => {
    expect(nationalHolidaysForYear(0)).toEqual([]);
    expect(nationalHolidaysForYear(2026.5)).toEqual([]);
  });
});
