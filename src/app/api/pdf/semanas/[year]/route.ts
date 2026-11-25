import { createElement } from "react";
import { Document, Page, StyleSheet, Text, View, renderToBuffer } from "@react-pdf/renderer";
import { getWeekRows } from "@/lib/week-calendar";
import { formatLong, weeksInYear } from "@/lib/weeks";
import { pdf as brand } from "@/lib/theme";
import {
  hasVerifiedData,
  TERRITORIES,
  CANARY_ISLANDS,
  type TerritorySlug,
  type CanaryIslandSlug,
} from "@/lib/holidays";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ year: string }> };

const colors = {
  ink: brand.ink,
  forest: brand.forest,
  olive: brand.olive,
  sage: brand.sage,
  mint: brand.mint,
  amber: brand.amber,
  amberSoft: brand.amberSoft,
  cream: brand.cream,
  white: brand.white,
  border: brand.border,
  muted: brand.textMuted,
  altRow: brand.muted,
};

const styles = StyleSheet.create({
  page: {
    padding: 24,
    fontFamily: "Helvetica",
    fontSize: 8.2,
    color: colors.ink,
    backgroundColor: colors.cream,
  },
  hero: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingVertical: 14,
    paddingHorizontal: 18,
    marginBottom: 14,
    borderRadius: 10,
    backgroundColor: colors.forest,
    color: colors.white,
  },
  heroLeft: {
    flex: 1,
  },
  eyebrow: {
    fontSize: 6.5,
    letterSpacing: 2.5,
    color: colors.mint,
    marginBottom: 6,
    textTransform: "uppercase",
  },
  title: {
    fontSize: 22,
    fontWeight: 700,
    lineHeight: 1.1,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 8.5,
    color: colors.mint,
  },
  heroRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  rangeBadge: {
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: colors.amber,
  },
  rangeBadgeText: {
    fontSize: 7.5,
    fontWeight: 700,
    color: colors.forest,
  },
  yearBox: {
    alignItems: "center",
    justifyContent: "center",
  },
  yearLabel: {
    fontSize: 6,
    fontWeight: 700,
    letterSpacing: 1,
    color: colors.amber,
  },
  yearNumber: {
    fontSize: 32,
    fontWeight: 700,
    color: colors.amber,
    marginTop: -2,
  },
  columns: {
    flexDirection: "row",
    gap: 12,
  },
  column: {
    flex: 1,
  },
  quarterHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  quarterTitle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  quarterBar: {
    width: 4,
    height: 14,
    borderRadius: 2,
    backgroundColor: colors.forest,
  },
  quarterText: {
    fontSize: 9,
    fontWeight: 700,
    color: colors.ink,
  },
  quarterRange: {
    fontSize: 8,
    color: colors.muted,
  },
  table: {
    overflow: "hidden",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: colors.olive,
    minHeight: 22,
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    minHeight: 18,
    alignItems: "center",
  },
  rowAlt: {
    backgroundColor: colors.altRow,
  },
  cellWeek: {
    width: "24%",
    paddingVertical: 4,
    paddingHorizontal: 8,
    fontWeight: 700,
  },
  cellDate: {
    width: "38%",
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  headerText: {
    color: colors.white,
    fontWeight: 700,
    fontSize: 7.5,
  },
  weekText: {
    color: colors.olive,
    fontWeight: 700,
  },
  footer: {
    position: "absolute",
    left: 24,
    right: 24,
    bottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    color: colors.muted,
    fontSize: 7,
  },
  footerSite: {
    fontWeight: 700,
  },
  footerCenter: {
    textAlign: "center",
    flex: 1,
  },
  footerPage: {
    textAlign: "right",
  },
  locationBadge: {
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: colors.mint,
    marginLeft: 8,
  },
  locationBadgeText: {
    fontSize: 6.5,
    fontWeight: 700,
    color: colors.forest,
  },
  provisionalBadge: {
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: "#FEF3C7",
    marginLeft: 8,
  },
  provisionalBadgeText: {
    fontSize: 6.5,
    fontWeight: 700,
    color: colors.amberSoft,
  },
});

type WeekRow = { week: number; monday: Date; sunday: Date };

function QuarterTable({ rows, quarterLabel, quarterRange }: { rows: WeekRow[]; quarterLabel: string; quarterRange: string }) {
  return createElement(View, { style: styles.column },
    createElement(View, { style: styles.quarterHeader },
      createElement(View, { style: styles.quarterTitle },
        createElement(View, { style: styles.quarterBar }),
        createElement(Text, { style: styles.quarterText }, quarterLabel),
      ),
      createElement(Text, { style: styles.quarterRange }, quarterRange),
    ),
    createElement(View, { style: styles.table },
      createElement(View, { style: styles.tableHeader },
        createElement(Text, { style: [styles.cellWeek, styles.headerText] }, "SEMANA"),
        createElement(Text, { style: [styles.cellDate, styles.headerText] }, "LUNES - INICIO"),
        createElement(Text, { style: [styles.cellDate, styles.headerText] }, "DOMINGO - FIN"),
      ),
      ...rows.map((row, index) =>
        createElement(View, { style: [styles.row, index % 2 === 1 ? styles.rowAlt : {}], key: row.week },
          createElement(Text, { style: [styles.cellWeek, styles.weekText] }, `Semana ${row.week}`),
          createElement(Text, { style: styles.cellDate }, formatLong(row.monday)),
          createElement(Text, { style: styles.cellDate }, formatLong(row.sunday)),
        )
      ),
    ),
  );
}

function PDFPage({ year, pageNumber, totalPages, rangeLabel, quarters, locationLabel, isProvisional }: {
  year: number;
  pageNumber: number;
  totalPages: number;
  rangeLabel: string;
  quarters: { label: string; range: string; rows: WeekRow[] }[];
  locationLabel?: string;
  isProvisional: boolean;
}) {
  const totalWeeks = weeksInYear(year);
  return createElement(Page, { size: "A4", orientation: "landscape", style: styles.page },
    createElement(View, { style: styles.hero },
      createElement(View, { style: styles.heroLeft },
        createElement(Text, { style: styles.eyebrow }, "NUMEROSEMANAS  -  REFERENCIA ISO 8601"),
        createElement(Text, { style: styles.title }, `Las ${totalWeeks} semanas de ${year}`),
        createElement(View, { style: { flexDirection: "row", alignItems: "center", marginTop: 4 } },
          createElement(Text, { style: styles.subtitle }, `Fechas completas de lunes a domingo  -  Lista anual imprimible ${year}`),
          locationLabel && createElement(View, { style: styles.locationBadge },
            createElement(Text, { style: styles.locationBadgeText }, locationLabel),
          ),
          isProvisional && createElement(View, { style: styles.provisionalBadge },
            createElement(Text, { style: styles.provisionalBadgeText }, "PREVISION"),
          ),
        ),
      ),
      createElement(View, { style: styles.heroRight },
        createElement(View, { style: styles.rangeBadge },
          createElement(Text, { style: styles.rangeBadgeText }, rangeLabel),
        ),
        createElement(View, { style: styles.yearBox },
          createElement(Text, { style: styles.yearLabel }, "ANO"),
          createElement(Text, { style: styles.yearNumber }, String(year)),
        ),
      ),
    ),
    createElement(View, { style: styles.columns },
      ...quarters.map((q, i) =>
        createElement(QuarterTable, { key: i, rows: q.rows, quarterLabel: q.label, quarterRange: q.range })
      ),
    ),
    createElement(View, { style: styles.footer },
      createElement(Text, { style: styles.footerSite }, "numerosemanas.es"),
      createElement(Text, { style: styles.footerCenter }, "La semana 1 es la que contiene el primer jueves del ano (norma ISO 8601)"),
      createElement(Text, { style: styles.footerPage }, `Semanas ISO - lunes a domingo  -  ${pageNumber} / ${totalPages}`),
    ),
  );
}

export async function GET(request: Request, { params }: RouteContext) {
  const { year: yearParam } = await params;
  const year = Number(yearParam);

  if (!Number.isInteger(year) || year < 2020 || year > 2035) {
    return new Response("Ano fuera del intervalo disponible (2020-2035)", { status: 404 });
  }

  // Parse location params from URL
  const url = new URL(request.url);
  const territoryParam = url.searchParams.get("territorio");
  const islandParam = url.searchParams.get("isla");

  // Validate territory
  let territory: TerritorySlug | undefined;
  if (territoryParam) {
    const validTerritory = TERRITORIES.find(t => t.slug === territoryParam);
    if (!validTerritory) {
      return new Response("Comunidad autonoma no valida", { status: 400 });
    }
    territory = territoryParam as TerritorySlug;
  }

  // Validate island (only for Canarias)
  let island: CanaryIslandSlug | undefined;
  if (islandParam) {
    if (territory !== "canarias") {
      return new Response("El parametro isla solo es valido para Canarias", { status: 400 });
    }
    const validIsland = CANARY_ISLANDS.find(i => i.slug === islandParam);
    if (!validIsland) {
      return new Response("Isla no valida", { status: 400 });
    }
    island = islandParam as CanaryIslandSlug;
  }

  const rows = getWeekRows(year);
  const isProvisional = !hasVerifiedData(year);

  // Build location label for PDF header
  let locationLabel: string | undefined;
  if (territory) {
    const territoryName = TERRITORIES.find(t => t.slug === territory)?.name;
    if (island) {
      const islandName = CANARY_ISLANDS.find(i => i.slug === island)?.name;
      locationLabel = `${territoryName} (${islandName})`;
    } else {
      locationLabel = territoryName;
    }
  }

  // Split into quarters
  const q1 = rows.slice(0, 13);
  const q2 = rows.slice(13, 26);
  const q3 = rows.slice(26, 39);
  const q4 = rows.slice(39);

  const document = createElement(Document, { title: `Semanas ${year} - NumeroSemanas`, author: "NumeroSemanas" },
    createElement(PDFPage, {
      year,
      pageNumber: 1,
      totalPages: 2,
      rangeLabel: `Semanas 1 - 26  -  enero - junio`,
      quarters: [
        { label: "1.er trimestre", range: "Semanas 1 - 13", rows: q1 },
        { label: "2.o trimestre", range: "Semanas 14 - 26", rows: q2 },
      ],
      locationLabel,
      isProvisional,
    }),
    createElement(PDFPage, {
      year,
      pageNumber: 2,
      totalPages: 2,
      rangeLabel: `Semanas 27 - ${weeksInYear(year)}  -  julio - diciembre`,
      quarters: [
        { label: "3.er trimestre", range: "Semanas 27 - 39", rows: q3 },
        { label: "4.o trimestre", range: `Semanas 40 - ${weeksInYear(year)}`, rows: q4 },
      ],
      locationLabel,
      isProvisional,
    }),
  );

  const pdf = await renderToBuffer(document);

  // Build filename
  let filename = `Semanas-${year}`;
  if (territory) {
    const territoryName = TERRITORIES.find(t => t.slug === territory)?.name?.replace(/\s+/g, "-") || territory;
    filename += `-${territoryName}`;
    if (island) {
      const islandName = CANARY_ISLANDS.find(i => i.slug === island)?.name?.replace(/\s+/g, "-") || island;
      filename += `-${islandName}`;
    }
  }
  filename += "-NumeroSemanas.pdf";

  return new Response(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
    },
  });
}
