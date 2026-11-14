import { describe, expect, it } from "vitest";
import { moveToPreviousWorkingDay, paymentDatesForYear } from "./payments";

describe("Spanish payment date adjustment", () => {
  it("moves weekend dates to the preceding weekday", () => {
    expect(moveToPreviousWorkingDay(new Date(2026, 0, 10))).toEqual(
      new Date(2026, 0, 9),
    );
    expect(moveToPreviousWorkingDay(new Date(2026, 0, 11))).toEqual(
      new Date(2026, 0, 9),
    );
  });

  it("also skips a national holiday", () => {
    expect(
      moveToPreviousWorkingDay(new Date(2026, 0, 6), ["2026-01-06"]),
    ).toEqual(new Date(2026, 0, 5));
  });

  it("creates twelve monthly dates and clamps to short months", () => {
    const dates = paymentDatesForYear(2026, 31);
    expect(dates).toHaveLength(12);
    expect(dates[1].nominalDate).toEqual(new Date(2026, 1, 28));
    expect(paymentDatesForYear(2026, 0)).toEqual([]);
  });
});
