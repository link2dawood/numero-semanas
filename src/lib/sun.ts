export type SunCity = {
  name: string;
  slug: string;
  latitude: number;
  longitude: number;
  timeZone: "Europe/Madrid" | "Atlantic/Canary";
};

export type SunTimes = {
  sunrise: Date;
  sunset: Date;
};

export const sunCities: SunCity[] = [
  { name: "Madrid", slug: "madrid", latitude: 40.4168, longitude: -3.7038, timeZone: "Europe/Madrid" },
  { name: "Barcelona", slug: "barcelona", latitude: 41.3874, longitude: 2.1686, timeZone: "Europe/Madrid" },
  { name: "Valencia", slug: "valencia", latitude: 39.4699, longitude: -0.3763, timeZone: "Europe/Madrid" },
  { name: "Sevilla", slug: "sevilla", latitude: 37.3891, longitude: -5.9845, timeZone: "Europe/Madrid" },
  { name: "Zaragoza", slug: "zaragoza", latitude: 41.6488, longitude: -0.8891, timeZone: "Europe/Madrid" },
  { name: "Málaga", slug: "malaga", latitude: 36.7213, longitude: -4.4214, timeZone: "Europe/Madrid" },
  { name: "Murcia", slug: "murcia", latitude: 37.9922, longitude: -1.1307, timeZone: "Europe/Madrid" },
  { name: "Palma", slug: "palma", latitude: 39.5696, longitude: 2.6502, timeZone: "Europe/Madrid" },
  { name: "Las Palmas de Gran Canaria", slug: "las-palmas", latitude: 28.1235, longitude: -15.4363, timeZone: "Atlantic/Canary" },
  { name: "Bilbao", slug: "bilbao", latitude: 43.263, longitude: -2.935, timeZone: "Europe/Madrid" },
  { name: "Alicante", slug: "alicante", latitude: 38.3452, longitude: -0.481, timeZone: "Europe/Madrid" },
  { name: "Córdoba", slug: "cordoba", latitude: 37.8882, longitude: -4.7794, timeZone: "Europe/Madrid" },
  { name: "Valladolid", slug: "valladolid", latitude: 41.6523, longitude: -4.7245, timeZone: "Europe/Madrid" },
  { name: "Vigo", slug: "vigo", latitude: 42.2406, longitude: -8.7207, timeZone: "Europe/Madrid" },
  { name: "A Coruña", slug: "a-coruna", latitude: 43.3623, longitude: -8.4115, timeZone: "Europe/Madrid" },
  { name: "Santa Cruz de Tenerife", slug: "santa-cruz-de-tenerife", latitude: 28.4636, longitude: -16.2518, timeZone: "Atlantic/Canary" },
];

/** The `count` cities closest to `city` (great-circle distance), nearest first. */
export function nearbySunCities(city: SunCity, count = 4): SunCity[] {
  const toRad = (degrees: number) => (degrees * Math.PI) / 180;
  const distance = (other: SunCity) => {
    const dLat = toRad(other.latitude - city.latitude);
    const dLon = toRad(other.longitude - city.longitude);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(city.latitude)) * Math.cos(toRad(other.latitude)) * Math.sin(dLon / 2) ** 2;
    return 2 * Math.asin(Math.sqrt(a));
  };
  return sunCities
    .filter((other) => other.slug !== city.slug)
    .sort((first, second) => distance(first) - distance(second))
    .slice(0, count);
}

export function sunTimesForDate(
  year: number,
  month: number,
  day: number,
  city: Pick<SunCity, "latitude" | "longitude">,
): SunTimes | null {
  const midnight = Date.UTC(year, month - 1, day);
  if (
    !Number.isInteger(year) ||
    !Number.isInteger(month) ||
    !Number.isInteger(day) ||
    month < 1 ||
    month > 12 ||
    new Date(midnight).getUTCDate() !== day
  ) {
    return null;
  }

  const julianDay = midnight / 86_400_000 + 2_440_587.5;
  const longitudeHour = city.longitude / 360;
  const approximateNoon =
    julianDay + 0.0009 - longitudeHour + 0.5;
  const n = Math.round(approximateNoon - 2_451_545);
  const jStar = 2_451_545 + 0.0009 + n + longitudeHour;
  const meanAnomaly = radians(
    (357.5291 + 0.98560028 * (jStar - 2_451_545)) % 360,
  );
  const equationOfCenter =
    1.9148 * Math.sin(meanAnomaly) +
    0.02 * Math.sin(2 * meanAnomaly) +
    0.0003 * Math.sin(3 * meanAnomaly);
  const eclipticLongitude = radians(
    ((degrees(meanAnomaly) + equationOfCenter + 180 + 102.9372) % 360 + 360) %
      360,
  );
  const solarTransit =
    jStar +
    0.0053 * Math.sin(meanAnomaly) -
    0.0069 * Math.sin(2 * eclipticLongitude);
  const declination = Math.asin(
    Math.sin(eclipticLongitude) * Math.sin(radians(23.44)),
  );
  const latitude = radians(city.latitude);
  const hourAngleCosine =
    (Math.sin(radians(-0.833)) - Math.sin(latitude) * Math.sin(declination)) /
    (Math.cos(latitude) * Math.cos(declination));
  if (hourAngleCosine < -1 || hourAngleCosine > 1) return null;
  const hourAngle = Math.acos(hourAngleCosine) / (2 * Math.PI);

  return {
    sunrise: new Date((solarTransit - hourAngle - 2_440_587.5) * 86_400_000),
    sunset: new Date((solarTransit + hourAngle - 2_440_587.5) * 86_400_000),
  };
}

export function formatSunTime(date: Date, timeZone: SunCity["timeZone"]): string {
  return new Intl.DateTimeFormat("es-ES", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(date);
}

function radians(value: number): number {
  return (value * Math.PI) / 180;
}

function degrees(value: number): number {
  return (value * 180) / Math.PI;
}
