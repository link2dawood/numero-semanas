import { describe, expect, it } from "vitest";
import { isoWeek, isoWeeksForYear, weeksInYear } from "./weeks";

describe("ISO week dates", () => {
  it("places 1 January 2026 in week 1 of 2026", () => {
    expect(isoWeek(new Date(2026, 0, 1))).toEqual({ week: 1, year: 2026 });
  });

  it("places 28 December 2026 in week 53", () => {
    expect(isoWeek(new Date(2026, 11, 28))).toEqual({
      week: 53,
      year: 2026,
    });
    expect(weeksInYear(2026)).toBe(53);
  });

  it("places 1 January 2027 in week 53 of 2026", () => {
    expect(isoWeek(new Date(2027, 0, 1))).toEqual({ week: 53, year: 2026 });
  });

  it("starts week 1 of 2027 on 4 January", () => {
    expect(isoWeek(new Date(2027, 0, 4))).toEqual({ week: 1, year: 2027 });
  });

  it("creates the correct count of Monday starts for 2026 and 2027", () => {
    expect(isoWeeksForYear(2026)).toHaveLength(53);
    expect(isoWeeksForYear(2027)).toHaveLength(52);
    expect(isoWeeksForYear(2026)[0]).toEqual(new Date(2025, 11, 29));
    expect(isoWeeksForYear(2027)[0]).toEqual(new Date(2027, 0, 4));
  });
});
