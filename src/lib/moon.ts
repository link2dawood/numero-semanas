type MoonPhaseName =
  | "Luna nueva"
  | "Cuarto creciente"
  | "Luna llena"
  | "Cuarto menguante";

export type MoonPhase = {
  date: Date;
  phase: MoonPhaseName;
};

const SYNODIC_MONTH = 29.530588861;
const UNIX_EPOCH_JULIAN_DAY = 2_440_587.5;

export function moonPhasesForYear(year: number): MoonPhase[] {
  if (!Number.isInteger(year) || year < 1 || year > 9999) return [];

  const januaryFirst = Date.UTC(year, 0, 1);
  const approximateLunation = Math.floor(
    (januaryFirst / 86_400_000 +
      UNIX_EPOCH_JULIAN_DAY -
      2_451_550.09766) /
      SYNODIC_MONTH,
  );
  const phases: MoonPhase[] = [];
  const names: MoonPhaseName[] = [
    "Luna nueva",
    "Cuarto creciente",
    "Luna llena",
    "Cuarto menguante",
  ];

  for (let lunation = approximateLunation - 2; lunation <= approximateLunation + 15; lunation += 1) {
    for (let quarter = 0; quarter < 4; quarter += 1) {
      const date = phaseDate(lunation + quarter / 4, quarter === 1 || quarter === 3);
      if (date.getFullYear() === year) {
        phases.push({ date, phase: names[quarter] });
      }
    }
  }
  return phases.sort((first, second) => first.date.getTime() - second.date.getTime());
}

function phaseDate(k: number, isQuarter: boolean): Date {
  const t = k / 1236.85;
  const t2 = t * t;
  const t3 = t2 * t;
  const t4 = t3 * t;
  const e = 1 - 0.002516 * t - 0.0000074 * t2;
  const m = radians(
    2.5534 + 29.1053567 * k - 0.0000014 * t2 - 0.00000011 * t3,
  );
  const moonAnomaly = radians(
    201.5643 +
      385.81693528 * k +
      0.0107582 * t2 +
      0.00001238 * t3 -
      0.000000058 * t4,
  );
  const f = radians(
    160.7108 +
      390.67050284 * k -
      0.0016118 * t2 -
      0.00000227 * t3 +
      0.000000011 * t4,
  );
  const omega = radians(
    124.7746 - 1.56375588 * k + 0.0020672 * t2 + 0.00000215 * t3,
  );

  let correction =
    -0.4072 * Math.sin(moonAnomaly) +
    0.17241 * e * Math.sin(m) +
    0.01608 * Math.sin(2 * moonAnomaly) +
    0.01039 * Math.sin(2 * f) +
    0.00739 * e * Math.sin(moonAnomaly - m) -
    0.00514 * e * Math.sin(moonAnomaly + m) +
    0.00208 * e * e * Math.sin(2 * m) -
    0.00111 * Math.sin(moonAnomaly - 2 * f) -
    0.00057 * Math.sin(moonAnomaly + 2 * f) +
    0.00056 * e * Math.sin(2 * moonAnomaly + m) -
    0.00042 * Math.sin(3 * moonAnomaly) +
    0.00042 * e * Math.sin(m + 2 * f) +
    0.00038 * e * Math.sin(m - 2 * f) -
    0.00024 * e * Math.sin(2 * moonAnomaly - m) -
    0.00017 * Math.sin(omega) -
    0.00007 * Math.sin(moonAnomaly + 2 * m) +
    0.00004 * Math.sin(2 * moonAnomaly - 2 * f) +
    0.00004 * Math.sin(3 * m) +
    0.00003 * Math.sin(moonAnomaly + m - 2 * f) +
    0.00003 * Math.sin(2 * moonAnomaly + 2 * f) -
    0.00003 * Math.sin(moonAnomaly + m + 2 * f) +
    0.00003 * Math.sin(moonAnomaly - m + 2 * f) -
    0.00002 * Math.sin(moonAnomaly - m - 2 * f) -
    0.00002 * Math.sin(3 * moonAnomaly + m) +
    0.00002 * Math.sin(4 * moonAnomaly);

  if (isQuarter) {
    const w =
      0.00306 -
      0.00038 * e * Math.cos(m) +
      0.00026 * Math.cos(moonAnomaly) -
      0.00002 * Math.cos(moonAnomaly - m) +
      0.00002 * Math.cos(moonAnomaly + m);
    correction += k % 1 < 0.5 ? w : -w;
  }

  const julianDay =
    2_451_550.09766 +
    SYNODIC_MONTH * k +
    0.00015437 * t2 -
    0.00000015 * t3 +
    0.00000000073 * t4 +
    correction;
  return new Date((julianDay - UNIX_EPOCH_JULIAN_DAY) * 86_400_000);
}

function radians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}
