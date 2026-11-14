import { createElement } from "react";
import { Document, Page, StyleSheet, Text, View, renderToBuffer } from "@react-pdf/renderer";
import { getWeekRows } from "@/lib/week-calendar";
import { formatLong } from "@/lib/weeks";

export const runtime = "nodejs";

const colors = { ink: "#25301E", forest: "#354628", olive: "#667A4A", sage: "#A9B58E", cream: "#F7F4E9", white: "#FFFFFF" };
const styles = StyleSheet.create({
  page: { padding: 30, fontFamily: "Helvetica", fontSize: 8.2, color: colors.ink, backgroundColor: colors.cream },
  hero: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 16, paddingHorizontal: 20, marginBottom: 16, borderRadius: 12, backgroundColor: colors.forest, color: colors.white },
  eyebrow: { fontSize: 7.5, letterSpacing: 1.5, color: "#D7DFC4", marginBottom: 5 },
  title: { fontSize: 23, fontWeight: 700 },
  subtitle: { marginTop: 5, fontSize: 9, color: "#E9EDDF" },
  yearBadge: { width: 64, height: 64, borderRadius: 32, alignItems: "center", justifyContent: "center", backgroundColor: colors.sage, color: colors.forest },
  yearBadgeSmall: { fontSize: 7, fontWeight: 700, letterSpacing: 1 },
  yearBadgeYear: { fontSize: 18, fontWeight: 700, marginTop: 2 },
  columns: { flexDirection: "row", gap: 14 },
  table: { flex: 1, overflow: "hidden", borderRadius: 8, borderWidth: 1, borderColor: "#D6D0BD", backgroundColor: colors.white },
  row: { flexDirection: "row", minHeight: 18, alignItems: "center" },
  alternate: { backgroundColor: "#F1EEE3" },
  tableHeader: { backgroundColor: colors.olive, color: colors.white, fontWeight: 700 },
  week: { width: "23%", paddingVertical: 4, paddingHorizontal: 7, fontWeight: 700 },
  date: { width: "38.5%", paddingVertical: 4, paddingHorizontal: 7 },
  footer: { position: "absolute", left: 30, right: 30, bottom: 13, flexDirection: "row", justifyContent: "space-between", color: "#737C69", fontSize: 7.5 },
});

export async function GET() {
  const rows = getWeekRows(2027);
  const tables = [rows.slice(0, 26), rows.slice(26)].map((half, tableIndex) =>
    createElement(View, { style: styles.table, key: tableIndex },
      createElement(View, { style: [styles.row, styles.tableHeader] },
        createElement(Text, { style: styles.week }, "SEMANA"),
        createElement(Text, { style: styles.date }, "LUNES"),
        createElement(Text, { style: styles.date }, "DOMINGO"),
      ),
      ...half.map((row, index) => createElement(View, { style: [styles.row, ...(index % 2 ? [styles.alternate] : [])], key: row.week },
        createElement(Text, { style: [styles.week, { color: colors.olive }] }, `Semana ${row.week}`),
        createElement(Text, { style: styles.date }, formatLong(row.monday)),
        createElement(Text, { style: styles.date }, formatLong(row.sunday)),
      )),
    ),
  );
  const document = createElement(Document, { title: "Lista de semanas 2027", author: "NumeroSemanas" },
    createElement(Page, { size: "A4", orientation: "landscape", style: styles.page },
      createElement(View, { style: styles.hero },
        createElement(View, null,
          createElement(Text, { style: styles.eyebrow }, "NUMEROSEMANAS · REFERENCIA ISO 8601"),
          createElement(Text, { style: styles.title }, "Las 52 semanas de 2027"),
          createElement(Text, { style: styles.subtitle }, "Fechas completas de lunes a domingo · Lista anual imprimible"),
        ),
        createElement(View, { style: styles.yearBadge },
          createElement(Text, { style: styles.yearBadgeSmall }, "AÑO"),
          createElement(Text, { style: styles.yearBadgeYear }, "2027"),
        ),
      ),
      createElement(View, { style: styles.columns }, ...tables),
      createElement(View, { style: styles.footer }, createElement(Text, null, "numerosemanas.es"), createElement(Text, null, "Semanas ISO · lunes a domingo")),
    ),
  );
  const pdf = await renderToBuffer(document);
  return new Response(new Uint8Array(pdf), { headers: { "Content-Type": "application/pdf", "Content-Disposition": 'attachment; filename="semanas-2027.pdf"', "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800" } });
}
