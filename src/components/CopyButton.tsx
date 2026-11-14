"use client";

import { useState } from "react";

type CopyButtonProps = { text: string; label?: string };

export default function CopyButton({
  text,
  label = "Copiar",
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="min-h-11 rounded-full border border-border bg-card px-5 font-semibold text-ink hover:bg-panel print:hidden"
    >
      {copied ? "Copiado" : label}
    </button>
  );
}
