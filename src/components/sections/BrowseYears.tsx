import Link from "next/link";
import { calendarYearHref, weeksYearHref } from "@/lib/site";

type BrowseYearsProps = { currentYear: number };

export default function BrowseYears({ currentYear }: BrowseYearsProps) {
  const years = Array.from({ length: 16 }, (_, index) => index + 2020);

  // Link straight to canonical URLs (2026 weeks / 2027 calendar have their own slugs).
  function yearLink(year: number, calendar = false) {
    return calendar ? calendarYearHref(year) : weeksYearHref(year);
  }

  return (
    <section aria-labelledby="s-years" className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <h2 id="s-years" className="m-0 font-heading text-[32px] font-bold">
          Explorar años
        </h2>
        <p className="m-0 text-base text-muted">
          Todos los números de semana y calendarios de 2020 a 2035.
        </p>
      </div>
      <div className="flex flex-col gap-2.5">
        <h3 className="m-0 text-sm font-semibold text-muted">
          Números de semana
        </h3>
        <div className="flex flex-wrap gap-2">
          {years.map((year) => (
            <Link
              key={`week-${year}`}
              href={yearLink(year)}
              aria-current={year === currentYear ? "date" : undefined}
              className={`flex min-h-11 min-w-16 items-center justify-center rounded-[10px] border px-3.5 text-center text-[15px] font-semibold no-underline ${
                year === currentYear
                  ? "border-olive-dark bg-olive-dark text-white"
                  : "border-border bg-card text-ink hover:border-olive-dark"
              }`}
            >
              {year}
            </Link>
          ))}
        </div>
        <h3 className="mb-0 mt-2.5 text-sm font-semibold text-muted">
          Calendarios
        </h3>
        <div className="flex flex-wrap gap-2">
          {years.map((year) => (
            <Link
              key={`calendar-${year}`}
              href={yearLink(year, true)}
              aria-current={year === currentYear ? "date" : undefined}
              className={`flex min-h-11 min-w-16 items-center justify-center rounded-[10px] border px-3.5 text-center text-[15px] font-semibold no-underline ${
                year === currentYear
                  ? "border-olive-dark bg-olive-dark text-white"
                  : "border-border bg-card text-ink hover:border-olive-dark"
              }`}
            >
              {year}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
