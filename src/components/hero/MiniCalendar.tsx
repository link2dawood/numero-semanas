"use client";

import {
  addDays,
  capitalize,
  dateToIso,
  formatLong,
  isoWeek,
  isSameDay,
  mondayOf,
} from "@/lib/weeks";

type MiniCalendarProps = {
  selected: Date;
  today: Date;
  onSelect: (date: Date) => void;
};

const weekDays = ["lu", "ma", "mi", "ju", "vi", "sá", "do"];

export default function MiniCalendar({
  selected,
  today,
  onSelect,
}: MiniCalendarProps) {
  const firstDay = new Date(selected.getFullYear(), selected.getMonth(), 1);
  const lastDay = new Date(selected.getFullYear(), selected.getMonth() + 1, 0);
  const firstMonday = mondayOf(firstDay);
  const rows: Date[][] = [];

  for (
    let rowMonday = firstMonday;
    rowMonday <= lastDay;
    rowMonday = addDays(rowMonday, 7)
  ) {
    rows.push(Array.from({ length: 7 }, (_, index) => addDays(rowMonday, index)));
  }

  const monthTitle = new Intl.DateTimeFormat("es-ES", {
    month: "long",
    year: "numeric",
  }).format(selected);

  function changeMonth(amount: number) {
    const targetMonth = selected.getMonth() + amount;
    const maxDay = new Date(
      selected.getFullYear(),
      targetMonth + 1,
      0,
    ).getDate();
    onSelect(
      new Date(
        selected.getFullYear(),
        targetMonth,
        Math.min(selected.getDate(), maxDay),
      ),
    );
  }

  return (
    <div data-purpose="mini-calendar">
      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          onClick={() => changeMonth(-1)}
          aria-label="Mes anterior"
          className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#E9E4D8] text-xs text-stone-600 hover:bg-[#F7F5EE]"
        >
          <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h3 id="ns-cal" className="text-sm font-bold tracking-tight text-[#141E16]">
          {capitalize(monthTitle)}
        </h3>
        <button
          type="button"
          onClick={() => changeMonth(1)}
          aria-label="Mes siguiente"
          className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#E9E4D8] text-xs text-stone-600 hover:bg-[#F7F5EE]"
        >
          <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Calendar Table */}
      <div className="w-full text-center text-sm">
        {/* Headers: Sem + Days of week */}
        <div className="grid grid-cols-8 gap-1 border-b border-[#E9E4D8] pb-2 text-xs font-semibold text-stone-500">
          <span className="font-bold text-[#2A3C2D]">Sem</span>
          {weekDays.map((day) => (
            <span key={day}>{day}</span>
          ))}
        </div>

        {/* Calendar Rows */}
        <div className="space-y-1 pt-2 font-medium">
          {rows.map((row) => {
            const week = isoWeek(row[0]).week;
            const selectedWeek = isSameDay(mondayOf(row[0]), mondayOf(selected));

            return (
              <div
                key={dateToIso(row[0])}
                className={`grid grid-cols-8 items-center gap-1 py-0.5 ${
                  selectedWeek ? "rounded-lg bg-[#F7F5EE]/70 p-0.5 font-bold" : ""
                }`}
              >
                <span
                  className={`rounded py-1 text-xs font-bold ${
                    selectedWeek
                      ? "bg-[#1E2B20] text-white"
                      : "bg-[#F7F5EE] text-stone-400"
                  }`}
                >
                  {week}
                </span>
                {row.map((date) => {
                  const inMonth = date.getMonth() === selected.getMonth();
                  const isSelected = isSameDay(date, selected);
                  const isToday = isSameDay(date, today);
                  const isSunday = date.getDay() === 0;

                  return (
                    <button
                      key={date.getDate() + "-" + date.getMonth()}
                      type="button"
                      onClick={() => onSelect(date)}
                      aria-label={`${capitalize(
                        new Intl.DateTimeFormat("es-ES", {
                          weekday: "long",
                        }).format(date),
                      )}, ${formatLong(date)}, semana ${week}`}
                      aria-pressed={isSelected}
                      className={`relative mx-auto flex h-6 w-6 items-center justify-center rounded-full text-xs transition ${
                        isSelected
                          ? "bg-[#1E2B20] font-bold text-white shadow-sm"
                          : isToday
                            ? "ring-2 ring-[#687252] ring-offset-1"
                            : ""
                      } ${
                        !isSelected && inMonth
                          ? selectedWeek
                            ? "text-[#141E16]"
                            : isSunday
                              ? "text-stone-400"
                              : "text-stone-700"
                          : !isSelected
                            ? "text-stone-300"
                            : ""
                      } hover:bg-[#EEF0E6]`}
                    >
                      {date.getDate()}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
