"use client";

export default function PrintButton({ label = "Imprimir" }: { label?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="min-h-11 rounded-full bg-[#1E2B20] px-5 font-semibold text-white hover:bg-[#2A3C2D] print:hidden"
    >
      {label}
    </button>
  );
}
