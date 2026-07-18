type Props = {
  type?: string;
  departement?: string;
  localisation?: string;
  modeTravail?: string;
  statut?: string;
  q?: string;
  sort?: string;
  order?: string;
};

export function OpportunityFilters({
  type, departement, localisation, modeTravail, statut, q, sort, order,
}: Props) {
  return (
    <form method="get" className="mb-8 grid gap-3 rounded-2xl border border-[var(--afd-border)] bg-white p-4 md:grid-cols-4">
      <input name="q" defaultValue={q} placeholder="Rechercher" className="rounded-lg border p-2 text-sm" />
      <input name="type" defaultValue={type} placeholder="Type (emploi, stage…)" className="rounded-lg border p-2 text-sm" />
      <input name="departement" defaultValue={departement} placeholder="Département" className="rounded-lg border p-2 text-sm" />
      <input name="localisation" defaultValue={localisation} placeholder="Localisation" className="rounded-lg border p-2 text-sm" />
      <input name="mode_travail" defaultValue={modeTravail} placeholder="Mode de travail" className="rounded-lg border p-2 text-sm" />
      <select name="statut" defaultValue={statut ?? ""} className="rounded-lg border p-2 text-sm">
        <option value="">Tous les statuts publics</option><option value="ouverte">Ouverte</option><option value="bientot_cloturee">Bientôt clôturée</option><option value="cloturee">Clôturée</option><option value="suspendue">Suspendue</option><option value="pourvue">Pourvue</option>
      </select>
      <select name="sort" defaultValue={sort ?? "date_publication"} className="rounded-lg border p-2 text-sm"><option value="date_publication">Date de publication</option><option value="date_limite">Date limite</option></select>
      <select name="order" defaultValue={order ?? "desc"} className="rounded-lg border p-2 text-sm"><option value="desc">Plus récent d’abord</option><option value="asc">Plus ancien d’abord</option></select>
      <button className="rounded-lg bg-[var(--afd-blue)] px-4 py-2 text-sm font-semibold text-white">Filtrer</button>
    </form>
  );
}
