import { describe, expect, it } from "vitest";
import { moonPhasesForYear } from "./moon";

describe("lunar phases", () => {
  it("returns chronological phases for a calendar year", () => {
    const phases = moonPhasesForYear(2026);
    expect(phases.length).toBeGreaterThan(45);
    expect(phases.every((phase) => phase.date.getUTCFullYear() === 2026)).toBe(true);
    expect(phases).toEqual(
      [...phases].sort((first, second) => first.date.getTime() - second.date.getTime()),
    );
  });

  it("calculates a new moon near the known January 2026 conjunction", () => {
    const newMoon = moonPhasesForYear(2026).find(
      (phase) =>
        phase.phase === "Luna nueva" &&
        phase.date.getUTCMonth() === 0,
    );
    expect(newMoon).toBeDefined();
    expect(newMoon?.date.getUTCDate()).toBe(18);
  });

  it("returns no phases for an invalid year", () => {
    expect(moonPhasesForYear(0)).toEqual([]);
  });
});
