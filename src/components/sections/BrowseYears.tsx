import Link from "next/link";
import { calendarYearHref } from "@/lib/site";

type BrowseYearsProps = { currentYear: number };

export default function BrowseYears({ currentYear }: BrowseYearsProps) {
  const years = Array.from({ length: 16 }, (_, index) => index + 2020);

  return (
    <section className="space-y-4 pt-4 text-center">
      <h3 className="font-serif text-2xl font-bold text-[#141E16]">
        Explorar años
      </h3>
      <p className="mx-auto max-w-lg text-xs text-stone-500">
        Todos los números de semana y calendarios anuales, año por año, con
        fechas y estándares ISO.
      </p>

      {/* Horizontal Pills Scrollable */}
      <div className="custom-scrollbar flex items-center justify-center gap-2 overflow-x-auto px-2 py-3">
        {years.map((year) => {
          const isCurrent = year === currentYear;

          return (
            <Link
              key={year}
              href={calendarYearHref(year)}
              aria-current={isCurrent ? "date" : undefined}
              className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                isCurrent
                  ? "bg-[#1E2B20] text-white shadow-sm"
                  : "border border-[#E9E4D8] bg-white text-stone-700 hover:bg-[#EFECE1]"
              }`}
            >
              {isCurrent ? `${year} (Ahora)` : year}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
