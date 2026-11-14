type AdSlotProps = {
  id: string;
  size: "leaderboard" | "rectangle" | "responsive";
  label?: string;
};

const descriptions = {
  leaderboard: "Leaderboard 728 × 90 · móvil 320 × 100",
  rectangle: "Rectángulo 300 × 250",
  responsive: "Anuncio responsive en contenido · 970 × 250 / 728 × 90 / móvil 300 × 250",
};

export default function AdSlot({
  id,
  size,
  label = "Publicidad",
}: AdSlotProps) {
  // Keep the ad integration points in place without reserving visible space.
  // Set NEXT_PUBLIC_ADS_ENABLED=true when advertising is ready to be enabled.
  if (process.env.NEXT_PUBLIC_ADS_ENABLED !== "true") return null;

  return (
    <aside
      id={id}
      aria-label={label}
      className={`ad-slot ad-slot-${size} print:hidden ${process.env.NODE_ENV === "development" ? "ad-slot-placeholder" : ""}`}
    >
      {process.env.NODE_ENV === "development" && (
        <>
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em]">
            {label}
          </span>
          <span className="text-center text-[13px]">{descriptions[size]}</span>
        </>
      )}
    </aside>
  );
}
