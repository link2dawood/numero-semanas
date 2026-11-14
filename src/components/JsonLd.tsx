import { serializeJsonLd } from "@/lib/structured-data";

type JsonLdProps = { data: Record<string, unknown> };

/** Server-rendered JSON-LD block; data must come from src/lib/structured-data. */
export default function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  );
}
