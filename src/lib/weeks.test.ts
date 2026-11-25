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

  // ISO 8601 boundary tests for 2026-W53 / 2027-W01
  it("verifies 28 Dec 2026 - 3 Jan 2027 is 2026-W53", () => {
    // Monday 28 Dec 2026
    expect(isoWeek(new Date(2026, 11, 28))).toEqual({ week: 53, year: 2026 });
    // Tuesday 29 Dec 2026
    expect(isoWeek(new Date(2026, 11, 29))).toEqual({ week: 53, year: 2026 });
    // Wednesday 30 Dec 2026
    expect(isoWeek(new Date(2026, 11, 30))).toEqual({ week: 53, year: 2026 });
    // Thursday 31 Dec 2026
    expect(isoWeek(new Date(2026, 11, 31))).toEqual({ week: 53, year: 2026 });
    // Friday 1 Jan 2027
    expect(isoWeek(new Date(2027, 0, 1))).toEqual({ week: 53, year: 2026 });
    // Saturday 2 Jan 2027
    expect(isoWeek(new Date(2027, 0, 2))).toEqual({ week: 53, year: 2026 });
    // Sunday 3 Jan 2027
    expect(isoWeek(new Date(2027, 0, 3))).toEqual({ week: 53, year: 2026 });
    // Monday 4 Jan 2027 starts Week 1
    expect(isoWeek(new Date(2027, 0, 4))).toEqual({ week: 1, year: 2027 });
  });

  // Test years with 52 and 53 weeks
  it("correctly identifies years with 52 or 53 weeks", () => {
    // 2020 has 53 weeks (starts on Wednesday in leap year)
    expect(weeksInYear(2020)).toBe(53);
    // 2021 has 52 weeks
    expect(weeksInYear(2021)).toBe(52);
    // 2024 has 52 weeks
    expect(weeksInYear(2024)).toBe(52);
    // 2026 has 53 weeks (starts on Thursday)
    expect(weeksInYear(2026)).toBe(53);
    // 2027 has 52 weeks
    expect(weeksInYear(2027)).toBe(52);
    // 2028 has 52 weeks
    expect(weeksInYear(2028)).toBe(52);
    // 2032 has 53 weeks (starts on Thursday in leap year)
    expect(weeksInYear(2032)).toBe(53);
  });

  // Test January 4th rule (Jan 4 is always in week 1)
  it("verifies that January 4th is always in week 1", () => {
    for (let year = 2020; year <= 2035; year++) {
      const result = isoWeek(new Date(year, 0, 4));
      expect(result.week).toBe(1);
      expect(result.year).toBe(year);
    }
  });
});
