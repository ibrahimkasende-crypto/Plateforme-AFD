import { MobileFiltersSheet } from "@/components/mobile/mobile-filters-sheet";
import { filterFieldClassName } from "@/components/ui/form-styles";

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

function FiltersFields({
  type,
  departement,
  localisation,
  modeTravail,
  statut,
  q,
  sort,
  order,
}: Props) {
  return (
    <>
      <input
        name="q"
        defaultValue={q}
        placeholder="Rechercher"
        className={`${filterFieldClassName} min-w-0 w-full`}
      />
      <input
        name="type"
        defaultValue={type}
        placeholder="Type (emploi, stage…)"
        className={`${filterFieldClassName} min-w-0 w-full`}
      />
      <input
        name="departement"
        defaultValue={departement}
        placeholder="Département"
        className={`${filterFieldClassName} min-w-0 w-full`}
      />
      <input
        name="localisation"
        defaultValue={localisation}
        placeholder="Localisation"
        className={`${filterFieldClassName} min-w-0 w-full`}
      />
      <input
        name="mode_travail"
        defaultValue={modeTravail}
        placeholder="Mode de travail"
        className={`${filterFieldClassName} min-w-0 w-full`}
      />
      <select
        name="statut"
        defaultValue={statut ?? ""}
        className={`${filterFieldClassName} min-w-0 w-full`}
      >
        <option value="">Tous les statuts publics</option>
        <option value="ouverte">Ouverte</option>
        <option value="bientot_cloturee">Bientôt clôturée</option>
        <option value="cloturee">Clôturée</option>
        <option value="suspendue">Suspendue</option>
        <option value="pourvue">Pourvue</option>
      </select>
      <select
        name="sort"
        defaultValue={sort ?? "date_publication"}
        className={`${filterFieldClassName} min-w-0 w-full`}
      >
        <option value="date_publication">Date de publication</option>
        <option value="date_limite">Date limite</option>
      </select>
      <select
        name="order"
        defaultValue={order ?? "desc"}
        className={`${filterFieldClassName} min-w-0 w-full`}
      >
        <option value="desc">Plus récent d’abord</option>
        <option value="asc">Plus ancien d’abord</option>
      </select>
      <button
        type="submit"
        className="inline-flex min-h-[50px] items-center justify-center rounded-lg bg-[var(--afd-blue)] px-4 text-sm font-semibold text-white"
      >
        Filtrer
      </button>
    </>
  );
}

export function OpportunityFilters(props: Props) {
  return (
    <div className="mb-8">
      <MobileFiltersSheet title="Filtres opportunités">
        <form method="get" className="grid gap-3">
          <FiltersFields {...props} />
        </form>
      </MobileFiltersSheet>

      <form
        method="get"
        className="hidden gap-3 rounded-2xl border border-[var(--afd-border)] bg-white p-4 md:grid md:grid-cols-4"
      >
        <FiltersFields {...props} />
      </form>
    </div>
  );
}
