export function DocumentFilters({ type, q }: { type?: string; q?: string }) {
  return (
    <form className="mb-8 flex flex-wrap gap-3 rounded-2xl border border-[var(--afd-border)] bg-white p-4">
      <input name="q" defaultValue={q} placeholder="Rechercher un document" className="min-w-56 flex-1 rounded-lg border p-2 text-sm" />
      <input name="type" defaultValue={type} placeholder="Type (rapport…)" className="rounded-lg border p-2 text-sm" />
      <button className="rounded-lg bg-[var(--afd-blue)] px-4 py-2 text-sm font-semibold text-white">Filtrer</button>
    </form>
  );
}
