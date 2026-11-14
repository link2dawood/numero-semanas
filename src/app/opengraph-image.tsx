import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

// Default social preview (Open Graph / X) for every page, in the site palette.
export const alt = "NumeroSemanas: número de semana ISO, calendarios y festivos de España";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const logo = await readFile(join(process.cwd(), "public/numerosemanas-logo.png"));
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#f6f2e8",
          color: "#2b3620",
        }}
      >
        <div
          style={{
            display: "flex",
            flex: 1,
            flexDirection: "column",
            justifyContent: "center",
            padding: "0 80px",
            gap: 36,
          }}
        >
          <img src={logoSrc} width={660} height={220} alt="" />
          <div style={{ fontSize: 46, fontWeight: 700, color: "#3f4f2c" }}>
            Número de semana ISO en España
          </div>
        </div>
        <div
          style={{
            display: "flex",
            background: "#3f4f2c",
            color: "#f6f2e8",
            fontSize: 30,
            padding: "28px 80px",
          }}
        >
          Calendarios · Semanas pares e impares · Festivos · numerosemanas.es
        </div>
      </div>
    ),
    size,
  );
}
