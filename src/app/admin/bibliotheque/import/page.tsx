"use client";

import { useMemo, useState } from "react";
import { AdminLibraryShellClient } from "@/components/admin/bibliotheque/admin-library-shell-client";

type PreviewRow = {
  title?: string;
  slug?: string;
  category?: string;
  domain?: string;
  province?: string;
  project?: string;
  date?: string;
  imagePath?: string;
  alt?: string;
  caption?: string;
  tags?: string[];
};

function parseCsv(text: string): PreviewRow[] {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  if (lines.length < 2) return [];
  const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
  return lines.slice(1).map((line) => {
    const cols = line.split(",").map((c) => c.trim());
    const row: Record<string, string> = {};
    headers.forEach((h, i) => {
      row[h] = cols[i] ?? "";
    });
    return {
      title: row.title || row.titre,
      slug: row.slug,
      category: row.category || row.categorie,
      domain: row.domain || row.domaine,
      province: row.province,
      project: row.project || row.projet,
      date: row.date || row.event_date,
      imagePath: row.image || row.path || row.src,
      alt: row.alt,
      caption: row.caption || row.legende,
      tags: (row.tags || "")
        .split("|")
        .map((t) => t.trim())
        .filter(Boolean),
    };
  });
}

function parseJson(text: string): PreviewRow[] {
  const data = JSON.parse(text) as unknown;
  if (Array.isArray(data)) return data as PreviewRow[];
  if (
    data &&
    typeof data === "object" &&
    Array.isArray((data as { activities?: unknown }).activities)
  ) {
    return (data as { activities: PreviewRow[] }).activities;
  }
  throw new Error("JSON invalide : tableau ou { activities: [] } attendu.");
}

export default function AdminBibliothequeImportPage() {
  const [raw, setRaw] = useState("");
  const [format, setFormat] = useState<"csv" | "json">("json");
  const [confirmed, setConfirmed] = useState(false);

  const { preview, error } = useMemo(() => {
    if (!raw.trim()) return { preview: [] as PreviewRow[], error: null as string | null };
    try {
      const rows = format === "csv" ? parseCsv(raw) : parseJson(raw);
      return { preview: rows.slice(0, 50), error: null };
    } catch (e) {
      return {
        preview: [] as PreviewRow[],
        error: e instanceof Error ? e.message : "Fichier invalide",
      };
    }
  }, [raw, format]);

  const duplicates = preview.filter(
    (row, index) =>
      row.slug && preview.findIndex((r) => r.slug === row.slug) !== index,
  );

  return (
    <AdminLibraryShellClient
      title="Import catalogue"
      description="Aperçu obligatoire avant tout import. Aucune écriture automatique sans validation."
      current="/admin/bibliotheque/import"
    >
      <div className="space-y-6">
        <div className="flex flex-wrap gap-3">
          <label className="text-sm font-semibold">
            Format{" "}
            <select
              value={format}
              onChange={(e) =>
                setFormat(e.target.value === "csv" ? "csv" : "json")
              }
              className="ml-2 rounded-lg border px-2 py-1"
            >
              <option value="json">JSON</option>
              <option value="csv">CSV</option>
            </select>
          </label>
          <label className="text-sm font-semibold">
            Fichier{" "}
            <input
              type="file"
              accept={
                format === "csv" ? ".csv,text/csv" : ".json,application/json"
              }
              className="ml-2 text-sm"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                setConfirmed(false);
                setRaw(await file.text());
              }}
            />
          </label>
        </div>

        <textarea
          value={raw}
          onChange={(e) => {
            setConfirmed(false);
            setRaw(e.target.value);
          }}
          rows={10}
          placeholder={
            format === "json"
              ? '[{"title":"…","slug":"…","imagePath":"/assets/…"}]'
              : "title,slug,category,province,image,alt,caption,tags"
          }
          className="w-full rounded-xl border border-slate-200 p-3 font-mono text-xs"
        />

        {error ? (
          <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        ) : null}

        {preview.length > 0 ? (
          <div className="space-y-3">
            <p className="text-sm text-slate-600">
              Aperçu : {preview.length} ligne
              {preview.length > 1 ? "s" : ""}
              {duplicates.length > 0
                ? ` · ${duplicates.length} doublon(s) de slug détecté(s)`
                : ""}
            </p>
            <div className="overflow-x-auto rounded-xl border bg-white">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead className="border-b bg-slate-50 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-3 py-2">Titre</th>
                    <th className="px-3 py-2">Slug</th>
                    <th className="px-3 py-2">Domaine</th>
                    <th className="px-3 py-2">Image</th>
                  </tr>
                </thead>
                <tbody>
                  {preview.map((row, i) => (
                    <tr key={`${row.slug ?? "row"}-${i}`} className="border-b">
                      <td className="px-3 py-2">{row.title ?? "—"}</td>
                      <td className="px-3 py-2 font-mono text-xs">
                        {row.slug ?? "—"}
                      </td>
                      <td className="px-3 py-2">
                        {row.category || row.domain || "—"}
                      </td>
                      <td className="px-3 py-2 font-mono text-xs">
                        {row.imagePath ?? "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={confirmed}
                onChange={(e) => setConfirmed(e.target.checked)}
              />
              J’ai vérifié l’aperçu et je confirme l’intention d’import
            </label>

            <button
              type="button"
              disabled={!confirmed || Boolean(error)}
              className="rounded-lg bg-[var(--admin-primary)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-40"
              onClick={() => {
                window.alert(
                  "Import validé côté aperçu. Exécutez ensuite : node scripts/seed-bibliotheque-from-catalog.mjs (rollback = restaurer le dump précédent).",
                );
              }}
            >
              Valider l’aperçu (pas d’écriture automatique)
            </button>
          </div>
        ) : null}
      </div>
    </AdminLibraryShellClient>
  );
}
