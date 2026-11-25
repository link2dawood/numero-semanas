import { describe, expect, it } from "vitest";
import {
  easterSunday,
  goodFriday,
  maundyThursday,
  nationalHolidaysForYear,
  holidaysForYearAndTerritory,
  countDaysOff,
  hasVerifiedData,
  getSource,
  getCanaryIslandHolidays,
  getCanaryIslandsSource,
  getVerificationStatus,
  getWorkdayCount,
  getMunicipalHolidays,
  getAvailableMunicipalities,
  getMunicipalCoverageStats,
  CANARY_ISLANDS,
} from "./holidays";

describe("Easter calculations", () => {
  it("calculates Easter Sunday correctly for all verified years", () => {
    // Easter dates from official liturgical calendar
    expect(easterSunday(2020)).toEqual(new Date(2020, 3, 12)); // April 12
    expect(easterSunday(2021)).toEqual(new Date(2021, 3, 4));  // April 4
    expect(easterSunday(2022)).toEqual(new Date(2022, 3, 17)); // April 17
    expect(easterSunday(2023)).toEqual(new Date(2023, 3, 9));  // April 9
    expect(easterSunday(2024)).toEqual(new Date(2024, 2, 31)); // March 31
    expect(easterSunday(2025)).toEqual(new Date(2025, 3, 20)); // April 20
    expect(easterSunday(2026)).toEqual(new Date(2026, 3, 5));  // April 5
    expect(easterSunday(2027)).toEqual(new Date(2027, 2, 28)); // March 28
  });

  it("calculates Good Friday correctly", () => {
    expect(goodFriday(2026)).toEqual(new Date(2026, 3, 3)); // April 3
    expect(goodFriday(2027)).toEqual(new Date(2027, 2, 26)); // March 26
  });

  it("calculates Maundy Thursday (Jueves Santo) correctly", () => {
    expect(maundyThursday(2026)).toEqual(new Date(2026, 3, 2)); // April 2
    expect(maundyThursday(2027)).toEqual(new Date(2027, 2, 25)); // March 25
  });
});

describe("Spanish national holidays", () => {
  it("includes Good Friday and fixed national dates for 2026", () => {
    const holidays2026 = nationalHolidaysForYear(2026);
    expect(holidays2026).toContainEqual(
      expect.objectContaining({ date: "2026-04-03", name: "Viernes Santo" }),
    );
    expect(holidays2026).toContainEqual(
      expect.objectContaining({ date: "2026-10-12", name: "Fiesta Nacional de España" }),
    );
    expect(holidays2026.every(({ scope }) => scope === "national")).toBe(true);
  });

  it("handles Todos los Santos (Nov 1) on Sunday in 2026", () => {
    const holidays2026 = nationalHolidaysForYear(2026);
    expect(holidays2026).toContainEqual(
      expect.objectContaining({
        date: "2026-11-01",
        name: "Todos los Santos",
        type: "observance",
      }),
    );
    expect(holidays2026).toContainEqual(
      expect.objectContaining({
        date: "2026-11-02",
        name: "Lunes siguiente a Todos los Santos",
        type: "day_off",
      }),
    );
  });

  it("handles Día de la Constitución (Dec 6) on Sunday in 2026", () => {
    const holidays2026 = nationalHolidaysForYear(2026);
    expect(holidays2026).toContainEqual(
      expect.objectContaining({
        date: "2026-12-06",
        name: "Día de la Constitución Española",
        type: "observance",
      }),
    );
    expect(holidays2026).toContainEqual(
      expect.objectContaining({
        date: "2026-12-07",
        type: "day_off",
      }),
    );
  });

  it("handles Jan 1 on Sunday in 2023 with Monday substitution", () => {
    const holidays2023 = nationalHolidaysForYear(2023);
    expect(holidays2023).toContainEqual(
      expect.objectContaining({
        date: "2023-01-01",
        name: "Año Nuevo",
        type: "observance",
      }),
    );
    expect(holidays2023).toContainEqual(
      expect.objectContaining({
        date: "2023-01-02",
        type: "day_off",
      }),
    );
  });

  it("returns an empty list for invalid years", () => {
    expect(nationalHolidaysForYear(0)).toEqual([]);
    expect(nationalHolidaysForYear(2026.5)).toEqual([]);
  });
});

describe("Jueves Santo by territory and year", () => {
  // 2026: Per BOE-A-2025-21667, excluded for Cataluña and Comunitat Valenciana
  // Ceuta HAS Jueves Santo (marked ** in BOE table)
  it("excludes Jueves Santo for Cataluña in 2026", () => {
    const holidays = holidaysForYearAndTerritory(2026, "cataluna");
    expect(holidays).not.toContainEqual(
      expect.objectContaining({ name: "Jueves Santo" }),
    );
  });

  it("excludes Jueves Santo for Comunitat Valenciana in 2026", () => {
    const holidays = holidaysForYearAndTerritory(2026, "comunitat-valenciana");
    expect(holidays).not.toContainEqual(
      expect.objectContaining({ name: "Jueves Santo" }),
    );
  });

  it("includes Jueves Santo for Ceuta in 2026", () => {
    const holidays = holidaysForYearAndTerritory(2026, "ceuta");
    expect(holidays).toContainEqual(
      expect.objectContaining({
        date: "2026-04-02",
        name: "Jueves Santo",
      }),
    );
  });

  it("includes Jueves Santo for Melilla in 2026", () => {
    const holidays = holidaysForYearAndTerritory(2026, "melilla");
    expect(holidays).toContainEqual(
      expect.objectContaining({
        date: "2026-04-02",
        name: "Jueves Santo",
      }),
    );
  });

  // 2027: Only Cataluña excluded
  it("excludes Jueves Santo for Cataluña in 2027", () => {
    const holidays = holidaysForYearAndTerritory(2027, "cataluna");
    expect(holidays).not.toContainEqual(
      expect.objectContaining({ name: "Jueves Santo" }),
    );
  });

  it("includes Jueves Santo for Ceuta in 2027", () => {
    const holidays = holidaysForYearAndTerritory(2027, "ceuta");
    expect(holidays).toContainEqual(
      expect.objectContaining({
        date: "2027-03-25",
        name: "Jueves Santo",
      }),
    );
  });

  // 2024/2025: Cataluña AND Comunitat Valenciana excluded
  it("excludes Jueves Santo for Comunitat Valenciana in 2024", () => {
    const holidays = holidaysForYearAndTerritory(2024, "comunitat-valenciana");
    expect(holidays).not.toContainEqual(
      expect.objectContaining({ name: "Jueves Santo" }),
    );
  });

  it("excludes Jueves Santo for Comunitat Valenciana in 2025", () => {
    const holidays = holidaysForYearAndTerritory(2025, "comunitat-valenciana");
    expect(holidays).not.toContainEqual(
      expect.objectContaining({ name: "Jueves Santo" }),
    );
  });

  it("includes Jueves Santo for most territories in 2026", () => {
    const madridHolidays = holidaysForYearAndTerritory(2026, "comunidad-de-madrid");
    expect(madridHolidays).toContainEqual(
      expect.objectContaining({
        date: "2026-04-02",
        name: "Jueves Santo",
      }),
    );
  });
});

describe("Islamic holidays (Eid al-Adha and Eid al-Fitr)", () => {
  it("includes Eid al-Adha for Ceuta in 2026", () => {
    const holidays = holidaysForYearAndTerritory(2026, "ceuta");
    expect(holidays).toContainEqual(
      expect.objectContaining({
        date: "2026-05-27",
        name: "Fiesta del Eid al-Adha",
      }),
    );
  });

  it("includes Eid al-Adha for Melilla in 2027", () => {
    const holidays = holidaysForYearAndTerritory(2027, "melilla");
    expect(holidays).toContainEqual(
      expect.objectContaining({
        date: "2027-05-17",
        name: "Fiesta del Eid al-Adha",
      }),
    );
  });

  it("includes Eid al-Adha for Ceuta in 2024", () => {
    const holidays = holidaysForYearAndTerritory(2024, "ceuta");
    expect(holidays).toContainEqual(
      expect.objectContaining({
        date: "2024-06-17",
        name: "Fiesta del Eid al-Adha",
      }),
    );
  });

  it("includes Eid al-Fitr for Melilla in 2025", () => {
    const holidays = holidaysForYearAndTerritory(2025, "melilla");
    expect(holidays).toContainEqual(
      expect.objectContaining({
        date: "2025-03-31",
        name: "Fiesta del Eid al-Fitr",
      }),
    );
  });

  // 2027: Eid al-Fitr only in Melilla, not in Ceuta
  it("includes Eid al-Fitr for Melilla in 2027 (10 March)", () => {
    const holidays = holidaysForYearAndTerritory(2027, "melilla");
    expect(holidays).toContainEqual(
      expect.objectContaining({
        date: "2027-03-10",
        name: "Fiesta del Eid al-Fitr",
      }),
    );
  });

  it("does NOT include Eid al-Fitr for Ceuta in 2027", () => {
    const holidays = holidaysForYearAndTerritory(2027, "ceuta");
    expect(holidays).not.toContainEqual(
      expect.objectContaining({
        name: "Fiesta del Eid al-Fitr",
      }),
    );
  });

  it("includes Eid al-Adha for Ceuta in 2027 (17 May)", () => {
    const holidays = holidaysForYearAndTerritory(2027, "ceuta");
    expect(holidays).toContainEqual(
      expect.objectContaining({
        date: "2027-05-17",
        name: "Fiesta del Eid al-Adha",
      }),
    );
  });
});

describe("Sunday substitutions", () => {
  it("handles Illes Balears Sunday substitution in 2026", () => {
    const holidays = holidaysForYearAndTerritory(2026, "illes-balears");
    expect(holidays).toContainEqual(
      expect.objectContaining({
        date: "2026-03-02",
        name: "Lunes siguiente al Día de les Illes Balears",
        type: "day_off",
      }),
    );
  });

  // BOE-A-2025-21667: Dec 7, 2026 substitute observed in exactly 10 territories
  // Andalucía, Aragón, Asturias, Cantabria, Castilla y León, Extremadura, Com. Madrid, Región de Murcia, La Rioja, Melilla
  describe("December 7, 2026 substitute (BOE-A-2025-21667 regression)", () => {
    const dec7Territories = [
      "andalucia",
      "aragon",
      "asturias",
      "cantabria",
      "castilla-y-leon",
      "extremadura",
      "comunidad-de-madrid",
      "region-de-murcia",
      "la-rioja",
      "melilla",
    ] as const;

    const dec7ExcludedTerritories = [
      "illes-balears",
      "canarias",
      "castilla-la-mancha",
      "cataluna",
      "comunitat-valenciana",
      "galicia",
      "navarra",
      "pais-vasco",
      "ceuta",
    ] as const;

    it("includes Dec 7 substitute for exactly 10 territories", () => {
      let count = 0;
      for (const territory of dec7Territories) {
        const holidays = holidaysForYearAndTerritory(2026, territory);
        const hasDec7 = holidays.some(
          h => h.date === "2026-12-07" && h.type === "day_off"
        );
        expect(hasDec7).toBe(true);
        if (hasDec7) count++;
      }
      expect(count).toBe(10);
    });

    it("excludes Dec 7 substitute for the other 9 territories", () => {
      for (const territory of dec7ExcludedTerritories) {
        const holidays = holidaysForYearAndTerritory(2026, territory);
        const hasDec7 = holidays.some(
          h => h.date === "2026-12-07" && h.type === "day_off"
        );
        expect(hasDec7).toBe(false);
      }
    });

    // Individual verifications for key territories
    it("includes Dec 7 substitute for Madrid in 2026", () => {
      const holidays = holidaysForYearAndTerritory(2026, "comunidad-de-madrid");
      expect(holidays).toContainEqual(
        expect.objectContaining({
          date: "2026-12-07",
          name: "Lunes siguiente a Día de la Constitución Española",
          type: "day_off",
        }),
      );
    });

    it("includes Dec 7 substitute for Cantabria in 2026", () => {
      const holidays = holidaysForYearAndTerritory(2026, "cantabria");
      expect(holidays).toContainEqual(
        expect.objectContaining({
          date: "2026-12-07",
          type: "day_off",
        }),
      );
    });

    it("does NOT include Dec 7 substitute for Cataluña in 2026", () => {
      const holidays = holidaysForYearAndTerritory(2026, "cataluna");
      expect(holidays).not.toContainEqual(
        expect.objectContaining({
          date: "2026-12-07",
          type: "day_off",
        }),
      );
    });

    it("does NOT include Dec 7 substitute for Comunitat Valenciana in 2026", () => {
      const holidays = holidaysForYearAndTerritory(2026, "comunitat-valenciana");
      expect(holidays).not.toContainEqual(
        expect.objectContaining({
          date: "2026-12-07",
          type: "day_off",
        }),
      );
    });

    it("does NOT include Dec 7 substitute for Canarias in 2026", () => {
      const holidays = holidaysForYearAndTerritory(2026, "canarias");
      expect(holidays).not.toContainEqual(
        expect.objectContaining({
          date: "2026-12-07",
          type: "day_off",
        }),
      );
    });
  });

  it("handles Andalucía Sunday substitution in 2027", () => {
    const holidays = holidaysForYearAndTerritory(2027, "andalucia");
    expect(holidays).toContainEqual(
      expect.objectContaining({
        date: "2027-03-01",
        name: "Lunes siguiente al Día de Andalucía",
        type: "day_off",
      }),
    );
  });

  // BOE-A-2026-21254: Aug 16, 2027 substitute observed in exactly 6 territories
  describe("August 16, 2027 substitute (BOE-A-2026-21254 regression)", () => {
    const aug16Territories = [
      "andalucia",
      "aragon",
      "asturias",
      "canarias",
      "castilla-y-leon",
      "comunidad-de-madrid",
    ] as const;

    it("includes Aug 16 substitute for exactly 6 territories", () => {
      let count = 0;
      for (const territory of aug16Territories) {
        const holidays = holidaysForYearAndTerritory(2027, territory);
        const hasAug16 = holidays.some(
          h => h.date === "2027-08-16" && h.type === "day_off"
        );
        expect(hasAug16).toBe(true);
        if (hasAug16) count++;
      }
      expect(count).toBe(6);
    });

    it("excludes Aug 16 substitute for Navarra (uses Oct 11 instead)", () => {
      const holidays = holidaysForYearAndTerritory(2027, "navarra");
      const hasAug16 = holidays.some(
        h => h.date === "2027-08-16" && h.type === "day_off"
      );
      expect(hasAug16).toBe(false);
      // Navarra substitutes to Oct 11
      expect(holidays).toContainEqual(
        expect.objectContaining({
          date: "2027-10-11",
          name: "Sustitución del 15 de agosto",
        }),
      );
    });

    it("excludes Aug 16 substitute for Comunitat Valenciana (uses Oct 11 instead)", () => {
      const holidays = holidaysForYearAndTerritory(2027, "comunitat-valenciana");
      const hasAug16 = holidays.some(
        h => h.date === "2027-08-16" && h.type === "day_off"
      );
      expect(hasAug16).toBe(false);
      // C. Valenciana substitutes to Oct 11
      expect(holidays).toContainEqual(
        expect.objectContaining({
          date: "2027-10-11",
          name: "Sustitución del 15 de agosto",
        }),
      );
    });
  });

  it("handles Asunción de la Virgen (Aug 15) on Sunday in 2027", () => {
    // Madrid has the Monday off
    const madridHolidays = holidaysForYearAndTerritory(2027, "comunidad-de-madrid");
    expect(madridHolidays).toContainEqual(
      expect.objectContaining({
        date: "2027-08-16",
        name: "Lunes siguiente a Asunción de la Virgen",
        type: "day_off",
      }),
    );

    // Navarra substitutes to Oct 11
    const navarraHolidays = holidaysForYearAndTerritory(2027, "navarra");
    expect(navarraHolidays).toContainEqual(
      expect.objectContaining({
        date: "2027-10-11",
        name: "Sustitución del 15 de agosto",
      }),
    );
  });

  it("handles Dec 8 on Sunday in 2024 with Monday substitution", () => {
    const madridHolidays = holidaysForYearAndTerritory(2024, "comunidad-de-madrid");
    expect(madridHolidays).toContainEqual(
      expect.objectContaining({
        date: "2024-12-08",
        name: "Inmaculada Concepción",
        type: "observance",
      }),
    );
    expect(madridHolidays).toContainEqual(
      expect.objectContaining({
        date: "2024-12-09",
        type: "day_off",
      }),
    );
  });
});

describe("Holiday counting", () => {
  it("counts days off correctly (excludes observances)", () => {
    const nationalCount = countDaysOff(2026);
    expect(nationalCount).toBeGreaterThan(0);

    const madridCount = countDaysOff(2026, "comunidad-de-madrid");
    expect(madridCount).toBeGreaterThan(nationalCount);
  });
});

describe("Data verification status", () => {
  it("has verified data for 2020-2027", () => {
    for (let year = 2020; year <= 2027; year++) {
      expect(hasVerifiedData(year)).toBe(true);
    }
  });

  it("has correct BOE sources", () => {
    expect(getSource(2020)).toBe("BOE-A-2019-14552");
    expect(getSource(2021)).toBe("BOE-A-2020-13343");
    expect(getSource(2022)).toBe("BOE-A-2021-17113");
    expect(getSource(2023)).toBe("BOE-A-2022-16755");
    expect(getSource(2024)).toBe("BOE-A-2023-22014");
    expect(getSource(2025)).toBe("BOE-A-2024-21316");
    expect(getSource(2026)).toBe("BOE-A-2025-21667");
    expect(getSource(2027)).toBe("BOE-A-2026-21254");
  });

  it("has no verified data for years without BOE publication", () => {
    expect(hasVerifiedData(2028)).toBe(false);
    expect(hasVerifiedData(2035)).toBe(false);
  });
});

describe("Canary Islands coverage", () => {
  it("includes La Graciosa following Lanzarote for all verified years", () => {
    for (let year = 2020; year <= 2027; year++) {
      const data = getCanaryIslandHolidays(year);
      expect(data).toBeDefined();
      expect(data!["la-graciosa"]).toBeDefined();
      expect(data!["lanzarote"]).toBeDefined();
      // La Graciosa has the same date as Lanzarote
      expect(data!["la-graciosa"].date).toBe(data!["lanzarote"].date);
      expect(data!["la-graciosa"].name).toBe("Nuestra Señora de los Volcanes");
    }
  });

  it("has BOC sources for Canary Islands island holidays", () => {
    expect(getCanaryIslandsSource(2020)).toContain("Decreto 83/2019");
    expect(getCanaryIslandsSource(2021)).toContain("Decreto 110/2020");
    expect(getCanaryIslandsSource(2022)).toContain("Decreto 66/2021");
    expect(getCanaryIslandsSource(2023)).toContain("Decreto 156/2022");
    expect(getCanaryIslandsSource(2024)).toContain("BOC 2023/184");
    expect(getCanaryIslandsSource(2025)).toContain("BOC 2024/187");
    expect(getCanaryIslandsSource(2026)).toContain("Decreto 61/2025");
  });

  it("includes all 8 Canary Islands in CANARY_ISLANDS constant", () => {
    expect(CANARY_ISLANDS).toHaveLength(8);
    const slugs = CANARY_ISLANDS.map(i => i.slug);
    expect(slugs).toContain("tenerife");
    expect(slugs).toContain("gran-canaria");
    expect(slugs).toContain("lanzarote");
    expect(slugs).toContain("fuerteventura");
    expect(slugs).toContain("la-palma");
    expect(slugs).toContain("la-gomera");
    expect(slugs).toContain("el-hierro");
    expect(slugs).toContain("la-graciosa");
  });

  it("marks La Graciosa as following Lanzarote", () => {
    const laGraciosa = CANARY_ISLANDS.find(i => i.slug === "la-graciosa");
    expect(laGraciosa).toBeDefined();
    expect(laGraciosa!.followsIsland).toBe("lanzarote");
  });
});

describe("Future years 2028-2035", () => {
  it("returns projected status for unpublished years", () => {
    for (let year = 2028; year <= 2035; year++) {
      expect(getVerificationStatus(year)).toBe("projected");
    }
  });

  it("returns verified status for published years", () => {
    for (let year = 2020; year <= 2027; year++) {
      expect(getVerificationStatus(year)).toBe("verified");
    }
  });

  it("returns holidays for projected years with correct dates", () => {
    // 2028 should have basic national holidays
    const holidays2028 = nationalHolidaysForYear(2028);
    expect(holidays2028.length).toBeGreaterThan(0);

    // Check fixed holidays are present
    expect(holidays2028).toContainEqual(
      expect.objectContaining({ date: "2028-01-01", name: "Año Nuevo" }),
    );
    expect(holidays2028).toContainEqual(
      expect.objectContaining({ date: "2028-05-01", name: "Fiesta del Trabajo" }),
    );
    expect(holidays2028).toContainEqual(
      expect.objectContaining({ date: "2028-10-12", name: "Fiesta Nacional de España" }),
    );
    expect(holidays2028).toContainEqual(
      expect.objectContaining({ date: "2028-12-25", name: "Natividad del Señor" }),
    );
  });

  it("calculates Easter correctly for future years", () => {
    // Easter 2028 is April 16
    expect(easterSunday(2028)).toEqual(new Date(2028, 3, 16));
    // Easter 2029 is April 1
    expect(easterSunday(2029)).toEqual(new Date(2029, 3, 1));
    // Easter 2030 is April 21
    expect(easterSunday(2030)).toEqual(new Date(2030, 3, 21));
  });

  it("includes core regional holidays in projected data", () => {
    const holidays = holidaysForYearAndTerritory(2028, "andalucia");
    expect(holidays).toContainEqual(
      expect.objectContaining({
        date: "2028-02-28",
        name: "Día de Andalucía",
      }),
    );
  });
});

describe("Canary Islands island-specific holidays verification", () => {
  it("Tenerife and Gran Canaria have different island holiday dates in 2027", () => {
    const canaryData = getCanaryIslandHolidays(2027);
    expect(canaryData).toBeDefined();

    // Tenerife: Virgen de la Candelaria - Feb 2
    expect(canaryData!["tenerife"].date).toBe("2027-02-02");
    expect(canaryData!["tenerife"].name).toBe("Virgen de la Candelaria");

    // Gran Canaria: Nuestra Señora del Pino - Sep 8
    expect(canaryData!["gran-canaria"].date).toBe("2027-09-08");
    expect(canaryData!["gran-canaria"].name).toBe("Nuestra Señora del Pino");

    // They should be different
    expect(canaryData!["tenerife"].date).not.toBe(canaryData!["gran-canaria"].date);
  });

  it("Lanzarote and Fuerteventura have different island holiday dates in 2026", () => {
    const canaryData = getCanaryIslandHolidays(2026);
    expect(canaryData).toBeDefined();

    // Lanzarote: Nuestra Señora de los Volcanes - Sep 15
    expect(canaryData!["lanzarote"].date).toBe("2026-09-15");

    // Fuerteventura: Nuestra Señora de la Peña - Sep 18
    expect(canaryData!["fuerteventura"].date).toBe("2026-09-18");

    // They should be different
    expect(canaryData!["lanzarote"].date).not.toBe(canaryData!["fuerteventura"].date);
  });

  it("island holidays are included in holidaysForYearAndTerritory for Canarias base", () => {
    // Note: holidaysForYearAndTerritory returns ONLY regional/national holidays
    // Island-specific holidays require a separate getCanaryIslandHolidays call
    const canariasHolidays = holidaysForYearAndTerritory(2027, "canarias");

    // Día de Canarias should be included
    expect(canariasHolidays).toContainEqual(
      expect.objectContaining({
        date: "2027-05-30",
        name: "Día de Canarias",
      }),
    );
  });
});

describe("Workday calculations", () => {
  it("calculates workdays for verified year", () => {
    const result = getWorkdayCount(2026, "comunidad-de-madrid");
    expect(result.total).toBeGreaterThan(220); // Typically ~250 workdays
    expect(result.total).toBeLessThan(260);
    expect(result.provisional).toBe(false);
  });

  it("marks provisional for unverified years", () => {
    const result = getWorkdayCount(2028);
    expect(result.provisional).toBe(true);
    expect(result.note).toContain("Pendiente de publicación oficial");
  });

  it("includes note about missing municipal holidays", () => {
    const result = getWorkdayCount(2026, "comunidad-de-madrid");
    expect(result.note).toContain("festivos locales");
  });
});

describe("Sample territory holidays (Madrid, Cataluña, Tenerife)", () => {
  it("Madrid 2027 includes Fiesta de la Comunidad de Madrid on May 2", () => {
    const holidays = holidaysForYearAndTerritory(2027, "comunidad-de-madrid");
    expect(holidays).toContainEqual(
      expect.objectContaining({
        date: "2027-05-02",
        name: "Fiesta de la Comunidad de Madrid",
      }),
    );
  });

  it("Madrid 2027 includes Asunción substitute on Aug 16", () => {
    const holidays = holidaysForYearAndTerritory(2027, "comunidad-de-madrid");
    expect(holidays).toContainEqual(
      expect.objectContaining({
        date: "2027-08-16",
        name: "Lunes siguiente a Asunción de la Virgen",
        type: "day_off",
      }),
    );
  });

  it("Cataluña 2027 includes Fiesta Nacional de Cataluña on Sep 11", () => {
    const holidays = holidaysForYearAndTerritory(2027, "cataluna");
    expect(holidays).toContainEqual(
      expect.objectContaining({
        date: "2027-09-11",
        name: "Fiesta Nacional de Cataluña",
      }),
    );
  });

  it("Cataluña 2027 includes Sant Esteve on Dec 26", () => {
    const holidays = holidaysForYearAndTerritory(2027, "cataluna");
    expect(holidays).toContainEqual(
      expect.objectContaining({
        date: "2027-12-26",
        name: "Sant Esteve",
      }),
    );
  });

  it("Tenerife 2027 island holiday is Virgen de la Candelaria on Feb 2", () => {
    const canaryData = getCanaryIslandHolidays(2027);
    expect(canaryData).toBeDefined();
    expect(canaryData!["tenerife"].date).toBe("2027-02-02");
    expect(canaryData!["tenerife"].name).toBe("Virgen de la Candelaria");
  });
});

describe("Municipal holidays", () => {
  it("returns verified municipal holidays for Madrid (28079) in 2026", () => {
    const holidays = getMunicipalHolidays("28079", 2026);
    expect(holidays).toBeDefined();
    expect(holidays).toHaveLength(2);
    expect(holidays).toContainEqual(
      expect.objectContaining({ date: "2026-05-15", name: "San Isidro" }),
    );
    expect(holidays).toContainEqual(
      expect.objectContaining({ date: "2026-11-09", name: "Nuestra Señora de la Almudena" }),
    );
  });

  it("returns null for municipality without coverage", () => {
    const holidays = getMunicipalHolidays("99999", 2026);
    expect(holidays).toBeNull();
  });

  it("returns available municipalities for Comunidad de Madrid", () => {
    const municipalities = getAvailableMunicipalities("comunidad-de-madrid", 2026);
    expect(municipalities.length).toBeGreaterThan(0);
    expect(municipalities).toContainEqual(
      expect.objectContaining({ code: "28079", name: "Madrid", status: "verified" }),
    );
  });

  it("returns municipal coverage statistics", () => {
    const stats = getMunicipalCoverageStats();
    expect(stats.totalMunicipalities).toBeGreaterThan(0);
    expect(stats.byYear[2026]).toBeDefined();
    expect(stats.byYear[2026].verified).toBeGreaterThan(0);
    expect(stats.byProvince["28"]).toBeDefined();
    expect(stats.byProvince["28"].name).toBe("Madrid");
  });
});
