"use client";

import { useState } from "react";
import type { MediaRecord } from "@/services/media.service";

type Props = {
  items: MediaRecord[];
  value?: string | null;
  onSelect: (media: MediaRecord | null) => void;
  label?: string;
};

export function MediaPicker({
  items,
  value,
  onSelect,
  label = "Image principale",
}: Props) {
  const [query, setQuery] = useState("");
  const filtered = items.filter((item) => {
    if (!query.trim()) return true;
    const hay = `${item.filename} ${item.alt_text ?? ""} ${item.original_filename ?? ""}`.toLowerCase();
    return hay.includes(query.trim().toLowerCase());
  });

  return (
    <div className="space-y-3 rounded-2xl border border-[var(--afd-border)] bg-white p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-bold text-[var(--afd-navy)]">{label}</p>
        {value ? (
          <button
            type="button"
            className="text-xs font-semibold text-[var(--afd-error)]"
            onClick={() => onSelect(null)}
          >
            Retirer
          </button>
        ) : null}
      </div>
      <input
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Rechercher dans la médiathèque…"
        className="w-full rounded-xl border border-[var(--afd-border)] px-3 py-2 text-sm"
      />
      <div className="grid max-h-72 grid-cols-2 gap-2 overflow-y-auto sm:grid-cols-3">
        {filtered.map((item) => {
          const selected = value === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item)}
              className={`rounded-xl border p-2 text-left text-xs transition ${
                selected
                  ? "border-[var(--afd-orange)] bg-[var(--afd-orange)]/10"
                  : "border-[var(--afd-border)] hover:border-[var(--afd-blue)]/40"
              }`}
            >
              <div className="mb-2 aspect-video rounded-lg bg-[var(--afd-light-blue)]" />
              <p className="line-clamp-2 font-semibold text-[var(--afd-navy)]">
                {item.original_filename ?? item.filename}
              </p>
              <p className="mt-1 text-[11px] text-[var(--afd-muted)]">{item.bucket}</p>
            </button>
          );
        })}
      </div>
      {filtered.length === 0 ? (
        <p className="text-sm text-[var(--afd-muted)]">Aucun média trouvé.</p>
      ) : null}
    </div>
  );
}
