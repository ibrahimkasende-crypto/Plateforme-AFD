"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useDeferredValue, useEffect, useState, useTransition } from "react";
import type { LibraryCategory } from "@/config/bibliotheque";

export function LibrarySearchForm({
  categories,
}: {
  categories: LibraryCategory[];
}) {
  const router = useRouter();
  const params = useSearchParams();
  const [pending, startTransition] = useTransition();
  const [q, setQ] = useState(params.get("q") ?? "");
  const deferredQ = useDeferredValue(q);

  useEffect(() => {
    const next = new URLSearchParams(params.toString());
    if (deferredQ.trim()) next.set("q", deferredQ.trim());
    else next.delete("q");
    startTransition(() => {
      router.replace(`/bibliotheque?${next.toString()}`, { scroll: false });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- sync deferred query only
  }, [deferredQ]);

  function onSelectChange(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    startTransition(() => {
      router.replace(`/bibliotheque?${next.toString()}`, { scroll: false });
    });
  }

  return (
    <form
      className="grid gap-3 rounded-2xl border border-[var(--afd-border)] bg-white p-4 shadow-sm md:grid-cols-2 lg:grid-cols-4"
      onSubmit={(e) => e.preventDefault()}
      role="search"
      aria-label="Recherche dans la bibliothèque"
    >
      <label className="block md:col-span-2 lg:col-span-2">
        <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[var(--afd-muted)]">
          Mot-clé
        </span>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Rechercher une activité, un lieu, un partenaire…"
          className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none ring-[var(--afd-blue)] focus:ring-2"
          aria-busy={pending}
        />
      </label>
      <label className="block">
        <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[var(--afd-muted)]">
          Domaine
        </span>
        <select
          defaultValue={params.get("categorie") ?? ""}
          onChange={(e) => onSelectChange("categorie", e.target.value)}
          className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
        >
          <option value="">Tous les domaines</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.label}
            </option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[var(--afd-muted)]">
          Statut
        </span>
        <select
          defaultValue={params.get("statut") ?? ""}
          onChange={(e) => onSelectChange("statut", e.target.value)}
          className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
        >
          <option value="">Tous</option>
          <option value="en_cours">En cours</option>
          <option value="terminee">Terminée</option>
          <option value="archivee">Archivée</option>
        </select>
      </label>
    </form>
  );
}
