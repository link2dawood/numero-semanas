"use client";

export default function PrintButton({ label = "Imprimir" }: { label?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="min-h-11 rounded-full bg-olive-dark px-5 font-semibold text-white hover:bg-olive print:hidden"
    >
      {label}
    </button>
  );
}
