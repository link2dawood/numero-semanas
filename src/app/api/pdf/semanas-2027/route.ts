import { createElement } from "react";
import { Document, Page, StyleSheet, Text, View, renderToBuffer } from "@react-pdf/renderer";
import { getWeekRows } from "@/lib/week-calendar";
import { formatLong } from "@/lib/weeks";
import { pdf as brand } from "@/lib/theme";

export const runtime = "nodejs";

const colors = {
  ink: brand.ink,
  forest: brand.forest,
  olive: brand.olive,
  sage: brand.sage,
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
  // Hero header section
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
    color: brand.mint,
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
    color: brand.mint,
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
    backgroundColor: brand.amber,
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
    color: brand.amber,
  },
  yearNumber: {
    fontSize: 32,
    fontWeight: 700,
    color: brand.amber,
    marginTop: -2,
  },
  // Quarter sections
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
  // Table styles
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
  // Footer
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
        createElement(Text, { style: [styles.cellDate, styles.headerText] }, "LUNES · INICIO"),
        createElement(Text, { style: [styles.cellDate, styles.headerText] }, "DOMINGO · FIN"),
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

function PDFPage({ pageNumber, totalPages, rangeLabel, quarters }: {
  pageNumber: number;
  totalPages: number;
  rangeLabel: string;
  quarters: { label: string; range: string; rows: WeekRow[] }[];
}) {
  return createElement(Page, { size: "A4", orientation: "landscape", style: styles.page },
    // Hero Header
    createElement(View, { style: styles.hero },
      createElement(View, { style: styles.heroLeft },
        createElement(Text, { style: styles.eyebrow }, "NUMEROSEMANAS  ·  REFERENCIA ISO 8601"),
        createElement(Text, { style: styles.title }, "Las 52 semanas de 2027"),
        createElement(Text, { style: styles.subtitle }, "Fechas completas de lunes a domingo  ·  Lista anual imprimible 2027"),
      ),
      createElement(View, { style: styles.heroRight },
        createElement(View, { style: styles.rangeBadge },
          createElement(Text, { style: styles.rangeBadgeText }, rangeLabel),
        ),
        createElement(View, { style: styles.yearBox },
          createElement(Text, { style: styles.yearLabel }, "AÑO"),
          createElement(Text, { style: styles.yearNumber }, "2027"),
        ),
      ),
    ),
    // Quarter tables in columns
    createElement(View, { style: styles.columns },
      ...quarters.map((q, i) =>
        createElement(QuarterTable, { key: i, rows: q.rows, quarterLabel: q.label, quarterRange: q.range })
      ),
    ),
    // Footer
    createElement(View, { style: styles.footer },
      createElement(Text, { style: styles.footerSite }, "numerosemanas.es"),
      createElement(Text, { style: styles.footerCenter }, "La semana 1 es la que contiene el primer jueves del año (norma ISO 8601)"),
      createElement(Text, { style: styles.footerPage }, `Semanas ISO · lunes a domingo  ·  ${pageNumber} / ${totalPages}`),
    ),
  );
}

export async function GET() {
  const rows = getWeekRows(2027);

  // Split into quarters
  const q1 = rows.slice(0, 13);  // Weeks 1-13
  const q2 = rows.slice(13, 26); // Weeks 14-26
  const q3 = rows.slice(26, 39); // Weeks 27-39
  const q4 = rows.slice(39);     // Weeks 40-52

  const document = createElement(Document, { title: "Semanas 2027 - NumeroSemanas", author: "NumeroSemanas" },
    // Page 1: Weeks 1-26 (Q1 + Q2)
    createElement(PDFPage, {
      pageNumber: 1,
      totalPages: 2,
      rangeLabel: "Semanas 1 – 26  ·  enero – junio",
      quarters: [
        { label: "1.er trimestre", range: "Semanas 1 – 13", rows: q1 },
        { label: "2.º trimestre", range: "Semanas 14 – 26", rows: q2 },
      ],
    }),
    // Page 2: Weeks 27-52 (Q3 + Q4)
    createElement(PDFPage, {
      pageNumber: 2,
      totalPages: 2,
      rangeLabel: "Semanas 27 – 52  ·  julio – diciembre",
      quarters: [
        { label: "3.er trimestre", range: "Semanas 27 – 39", rows: q3 },
        { label: "4.º trimestre", range: "Semanas 40 – 52", rows: q4 },
      ],
    }),
  );

  const pdf = await renderToBuffer(document);

  return new Response(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="Semanas-2027-NumeroSemanas.pdf"',
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
    },
  });
}
