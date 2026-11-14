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
    <section
      aria-labelledby="ns-cal"
      className="flex flex-col gap-3 rounded-3xl border border-border bg-card p-5"
    >
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => changeMonth(-1)}
          aria-label="Mes anterior"
          className="flex size-11 shrink-0 items-center justify-center rounded-[10px] border border-border bg-card text-xl hover:bg-panel"
        >
          <span aria-hidden="true">‹</span>
        </button>
        <h2 id="ns-cal" className="m-0 text-center text-base font-semibold">
          {capitalize(monthTitle)}
        </h2>
        <button
          type="button"
          onClick={() => changeMonth(1)}
          aria-label="Mes siguiente"
          className="flex size-11 shrink-0 items-center justify-center rounded-[10px] border border-border bg-card text-xl hover:bg-panel"
        >
          <span aria-hidden="true">›</span>
        </button>
      </div>
      <div className="grid grid-cols-8 gap-0.5 text-center text-xs font-semibold text-muted">
        <span className="text-olive-dark">Sem</span>
        {weekDays.map((day) => <span key={day}>{day}</span>)}
      </div>
      <div className="flex flex-col gap-0.5">
        {rows.map((row) => {
          const week = isoWeek(row[0]).week;
          const selectedWeek = isSameDay(mondayOf(row[0]), mondayOf(selected));
          return (
            <div
              key={dateToIso(row[0])}
              className={`grid grid-cols-8 gap-0.5 rounded-[10px] ${selectedWeek ? "bg-panel" : ""}`}
            >
              <span className="flex items-center justify-center text-[13px] font-bold text-olive-dark">
                {week}
              </span>
              {row.map((date) => {
                const inMonth = date.getMonth() === selected.getMonth();
                const isSelected = isSameDay(date, selected);
                const isToday = isSameDay(date, today);
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
                    className={`relative h-10 min-w-0 rounded-[10px] text-sm hover:bg-mint ${
                      isSelected
                        ? "bg-olive-dark font-bold text-white hover:bg-olive-dark"
                        : inMonth
                          ? "bg-transparent text-ink"
                          : "bg-transparent text-muted"
                    } ${isToday && !isSelected ? "after:absolute after:inset-1 after:rounded-lg after:border-2 after:border-olive" : ""}`}
                  >
                    {date.getDate()}
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>
    </section>
  );
}
