import { createElement } from "react";
import {
  Document,
  Page,
  StyleSheet,
  Text,
  View,
  renderToBuffer,
} from "@react-pdf/renderer";
import {
  addDays,
  formatLong,
  isoWeek,
  isoWeeksForYear,
  parseIsoDate,
} from "@/lib/weeks";

export const runtime = "nodejs";

const styles = StyleSheet.create({
  page: {
    paddingTop: 42,
    paddingBottom: 44,
    paddingHorizontal: 36,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#2B3620",
    backgroundColor: "#FBFAF4",
  },
  brandBar: {
    height: 8,
    backgroundColor: "#627545",
    marginHorizontal: -36,
    marginTop: -42,
    marginBottom: 22,
  },
  eyebrow: {
    fontSize: 8,
    fontWeight: 700,
    letterSpacing: 1.4,
    color: "#7E8F69",
    textTransform: "uppercase",
  },
  title: {
    fontSize: 24,
    fontWeight: 700,
    color: "#3F4F2C",
    marginTop: 5,
    marginBottom: 7,
  },
  description: { fontSize: 10, color: "#637052", marginBottom: 20 },
  row: {
    flexDirection: "row",
    minHeight: 23,
    alignItems: "center",
  },
  heading: {
    backgroundColor: "#3F4F2C",
    color: "#FFFFFF",
    fontWeight: 700,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  alternateRow: { backgroundColor: "#F0EDDF" },
  cell: { flex: 1, paddingVertical: 5, paddingHorizontal: 6 },
  firstCell: { color: "#627545", fontWeight: 700 },
  footer: {
    position: "absolute",
    left: 36,
    right: 36,
    bottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    color: "#7A826F",
    fontSize: 8,
  },
});

type RouteContext = { params: Promise<{ tipo: string }> };

export async function GET(request: Request, { params }: RouteContext) {
  const { tipo } = await params;
  const query = new URL(request.url).searchParams;
  const year = parseInteger(query.get("year"), 2027);
  if (year < 2020 || year > 2035) {
    return new Response("Año fuera del intervalo disponible", { status: 400 });
  }

  const content = templateContent(tipo, year, query.get("month"), query.get("date"));
  if (!content) return new Response("Plantilla no encontrada", { status: 404 });

  const rows = content.rows.map((cells, index) =>
    createElement(
      View,
      {
        style: [
          styles.row,
          ...(index === 0 ? [styles.heading] : []),
          ...(index > 0 && index % 2 === 0 ? [styles.alternateRow] : []),
        ],
        key: `${index}-${cells[0]}`,
      },
      ...cells.map((cell, cellIndex) =>
        createElement(
          Text,
          {
            style: [styles.cell, ...(index > 0 && cellIndex === 0 ? [styles.firstCell] : [])],
            key: `${cellIndex}-${cell}`,
          },
          cell,
        ),
      ),
    ),
  );
  const document = createElement(
    Document,
    { title: content.title },
    createElement(
      Page,
      { size: "A4", style: styles.page },
      createElement(View, { style: styles.brandBar }),
      createElement(Text, { style: styles.eyebrow }, "NUMEROSEMANAS · PLANTILLA IMPRIMIBLE"),
      createElement(Text, { style: styles.title }, content.title),
      createElement(Text, { style: styles.description }, content.description),
      ...rows,
      createElement(
        View,
        { style: styles.footer, fixed: true },
        createElement(Text, null, "numerosemanas.es"),
        createElement(Text, { render: ({ pageNumber, totalPages }) => `Página ${pageNumber} de ${totalPages}` }),
      ),
    ),
  );
  const pdf = await renderToBuffer(document);

  return new Response(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${content.fileName}"`,
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
    },
  });
}

function templateContent(
  type: string,
  year: number,
  monthValue: string | null,
  dateValue: string | null,
): { title: string; description: string; fileName: string; rows: string[][] } | null {
  if (type === "anual") {
    const Mondays = isoWeeksForYear(year);
    return {
      title: `Planificador anual ${year}`,
      description: "Lista de semanas ISO de lunes a domingo para anotar hitos y tareas.",
      fileName: `planificador-anual-${year}.pdf`,
      rows: [
        ["Semana", "Lunes", "Domingo"],
        ...Mondays.map((monday, index) => [
          `Semana ${index + 1}`,
          formatLong(monday),
          formatLong(addDays(monday, 6)),
        ]),
      ],
    };
  }

  if (type === "mensual") {
    const month = parseInteger(monthValue, 1);
    if (month < 1 || month > 12) return null;
    const first = new Date(year, month - 1, 1);
    const last = new Date(year, month, 0);
    const monthName = new Intl.DateTimeFormat("es-ES", { month: "long" }).format(first);
    const firstMonday = new Date(year, month - 1, 1 - ((first.getDay() + 6) % 7));
    const rows = [["Semana", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"]];
    for (let monday = firstMonday; monday <= last; monday = addDays(monday, 7)) {
      rows.push([
        `S${isoWeekNumber(monday)}`,
        ...Array.from({ length: 7 }, (_, index) => {
          const day = addDays(monday, index);
          return day.getMonth() === month - 1 ? String(day.getDate()) : "";
        }),
      ]);
    }
    return {
      title: `Calendario mensual · ${monthName} ${year}`,
      description: "Plantilla mensual imprimible con semanas ISO y espacio para anotaciones.",
      fileName: `calendario-${year}-${String(month).padStart(2, "0")}.pdf`,
      rows,
    };
  }

  if (type === "semanal") {
    const monday = parseIsoDate(dateValue) ?? nextMonday();
    const start = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() - ((monday.getDay() + 6) % 7));
    return {
      title: `Planificador semanal · ${formatLong(start)}`,
      description: "Plantilla de lunes a domingo con espacio para tareas y notas.",
      fileName: "planificador-semanal.pdf",
      rows: [
        ["Día", "Fecha", "Tareas y notas"],
        ...Array.from({ length: 7 }, (_, index) => {
          const day = addDays(start, index);
          return [
            new Intl.DateTimeFormat("es-ES", { weekday: "long" }).format(day),
            formatLong(day),
            " ",
          ];
        }),
      ],
    };
  }

  if (type === "curso-escolar") {
    const start = new Date(year, 8, 1);
    const end = new Date(year + 1, 5, 30);
    const firstMonday = new Date(start.getFullYear(), start.getMonth(), start.getDate() - ((start.getDay() + 6) % 7));
    const weeks: string[][] = [["Semana ISO", "Lunes", "Domingo"]];
    for (let monday = firstMonday; monday <= end; monday = addDays(monday, 7)) {
      const sunday = addDays(monday, 6);
      if (sunday < start) continue;
      weeks.push([
        `Semana ${isoWeekNumber(monday)}`,
        formatLong(monday),
        formatLong(sunday),
      ]);
    }
    return {
      title: `Planificador del curso ${year}–${year + 1}`,
      description: "Plantilla de organización por semanas. Las fechas del curso dependen de cada comunidad autónoma y centro.",
      fileName: `planificador-curso-${year}-${year + 1}.pdf`,
      rows: weeks,
    };
  }
  return null;
}

function parseInteger(value: string | null, fallback: number): number {
  return value && /^\d+$/.test(value) ? Number(value) : fallback;
}

function nextMonday(): Date {
  const today = new Date();
  const daysUntilMonday = (8 - today.getDay()) % 7 || 7;
  return addDays(today, daysUntilMonday);
}

function isoWeekNumber(date: Date): number {
  return isoWeek(date).week;
}
