"use client";

import type { MediaRecord } from "@/services/media.service";

export function DocumentPicker({
  items,
  value,
  onSelect,
}: {
  items: MediaRecord[];
  value?: string | null;
  onSelect: (media: MediaRecord | null) => void;
}) {
  const documents = items.filter((item) =>
    (item.mime_type ?? "").includes("pdf") ||
    (item.mime_type ?? "").includes("word") ||
    item.filename.endsWith(".pdf") ||
    item.filename.endsWith(".docx"),
  );

  return (
    <div className="space-y-2">
      <p className="text-sm font-bold text-[var(--afd-navy)]">Documents</p>
      <ul className="space-y-2">
        {documents.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => onSelect(item)}
              className={`w-full rounded-xl border px-3 py-2 text-left text-sm ${
                value === item.id
                  ? "border-[var(--afd-orange)] bg-[var(--afd-orange)]/10"
                  : "border-[var(--afd-border)]"
              }`}
            >
              {item.original_filename ?? item.filename}
            </button>
          </li>
        ))}
      </ul>
      {documents.length === 0 ? (
        <p className="text-sm text-[var(--afd-muted)]">Aucun document disponible.</p>
      ) : null}
    </div>
  );
}
