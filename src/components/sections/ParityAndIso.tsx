import Link from "next/link";

type ParityAndIsoProps = {
  week: number;
  nextWeek: number;
  year: number;
  weeks: number;
};

export default function ParityAndIso({
  week,
  nextWeek,
  year,
  weeks,
}: ParityAndIsoProps) {
  const parity = (value: number) => (value % 2 === 0 ? "Par" : "Impar");

  return (
    <section id="normativa" className="grid grid-cols-1 gap-8 md:grid-cols-2">
      {/* Card: Paridad de la semana actual */}
      <div className="flex flex-col justify-between rounded-3xl border border-[#E9E4D8] bg-white p-6 shadow-[0_4px_20px_-2px_rgba(30,43,32,0.05)] sm:p-8">
        <div>
          <h3 className="mb-3 font-serif text-xl font-bold text-[#141E16]">
            Paridad de la semana actual
          </h3>
          <div className="my-4 grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-[#1E2B20] p-4 text-center text-white">
              <span className="mb-1 block text-xs font-bold uppercase text-stone-300">
                Esta semana · sem. {week}
              </span>
              <span className="font-serif text-2xl font-bold">{parity(week)}</span>
            </div>
            <div className="rounded-2xl border border-[#E9E4D8] bg-[#F7F5EE] p-4 text-center text-stone-700">
              <span className="mb-1 block text-xs font-bold uppercase text-stone-500">
                Próxima semana · sem. {nextWeek}
              </span>
              <span className="font-serif text-2xl font-bold">{parity(nextWeek)}</span>
            </div>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-stone-600">
            Las semanas pares e impares se usan, por ejemplo, en la custodia
            compartida, los turnos de recogida de residuos y los cuadrantes de
            trabajo.
          </p>
        </div>
        <Link
          href="/semanas-pares-e-impares"
          className="mt-6 inline-flex items-center gap-2 border-t border-[#E9E4D8]/80 pt-4 text-sm font-bold text-[#1E2B20] hover:text-[#3D5441]"
        >
          Lee la guía sobre semanas pares e impares
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
      </div>

      {/* Card: Números de semana en España */}
      <div className="flex flex-col justify-between rounded-3xl border border-[#E9E4D8] bg-white p-6 shadow-[0_4px_20px_-2px_rgba(30,43,32,0.05)] sm:p-8">
        <div>
          <h3 className="mb-2 font-serif text-xl font-bold text-[#141E16]">
            Números de semana en España
          </h3>
          <p className="mb-4 text-sm text-stone-500">
            En España las semanas se numeran según la norma ISO 8601:
          </p>
          <ol className="space-y-3 text-sm text-stone-700">
            <li className="flex items-start gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#1E2B20] text-sm font-bold text-white">
                1
              </span>
              <span className="pt-0.5">La semana empieza el lunes y termina el domingo.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#1E2B20] text-sm font-bold text-white">
                2
              </span>
              <span className="pt-0.5">La primera semana del año es la que contiene el primer jueves.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#1E2B20] text-sm font-bold text-white">
                3
              </span>
              <span className="pt-0.5">Un año tiene 52 o 53 semanas — {year} tiene {weeks}.</span>
            </li>
          </ol>
        </div>
        <Link
          href="/numeros-de-semana"
          className="mt-6 inline-flex items-center gap-2 border-t border-[#E9E4D8]/80 pt-4 text-sm font-bold text-[#1E2B20] hover:text-[#3D5441]"
        >
          Más sobre los números de semana
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
      </div>
    </section>
  );
}
