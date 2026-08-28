"use client";

import { useState } from "react";

type CopyButtonProps = {
  value: string;
  label?: string;
};

export function CopyButton({ value, label = "Copier" }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      onClick={onCopy}
      className="inline-flex min-h-10 shrink-0 items-center justify-center rounded-lg border border-[var(--afd-border)] bg-white px-3 text-sm font-semibold text-[var(--afd-blue)] transition hover:bg-[var(--afd-accent-soft)]"
    >
      {copied ? "✓ Copié" : label}
    </button>
  );
}
