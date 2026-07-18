type Props = { type?: string; localisation?: string; q?: string };

export function OpportunityFilters({ type, localisation, q }: Props) {
  return (
    <form className="mb-8 grid gap-3 rounded-2xl border border-[var(--afd-border)] bg-white p-4 md:grid-cols-4">
      <input name="q" defaultValue={q} placeholder="Rechercher" className="rounded-lg border p-2 text-sm" />
      <input name="type" defaultValue={type} placeholder="Type (emploi, stage…)" className="rounded-lg border p-2 text-sm" />
      <input name="localisation" defaultValue={localisation} placeholder="Localisation" className="rounded-lg border p-2 text-sm" />
      <button className="rounded-lg bg-[var(--afd-blue)] px-4 py-2 text-sm font-semibold text-white">Filtrer</button>
    </form>
  );
}
