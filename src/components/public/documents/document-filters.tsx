import { MobileFiltersSheet } from "@/components/mobile/mobile-filters-sheet";
import { filterFieldClassName } from "@/components/ui/form-styles";

function DocumentFilterFields({ type, q }: { type?: string; q?: string }) {
  return (
    <>
      <input
        name="q"
        defaultValue={q}
        placeholder="Rechercher un document"
        className="min-w-0 w-full flex-1 rounded-lg border p-2 text-base sm:min-w-[12rem]"
      />
      <input
        name="type"
        defaultValue={type}
        placeholder="Type (rapport…)"
        className={`${filterFieldClassName} min-w-0 w-full`}
      />
      <button
        type="submit"
        className="inline-flex min-h-[50px] items-center justify-center rounded-lg bg-[var(--afd-blue)] px-4 text-sm font-semibold text-white"
      >
        Filtrer
      </button>
    </>
  );
}

export function DocumentFilters({ type, q }: { type?: string; q?: string }) {
  return (
    <div className="mb-8">
      <MobileFiltersSheet title="Filtres documents">
        <form method="get" className="grid gap-3">
          <DocumentFilterFields type={type} q={q} />
        </form>
      </MobileFiltersSheet>

      <form
        method="get"
        className="hidden flex-wrap gap-3 rounded-2xl border border-[var(--afd-border)] bg-white p-4 md:flex"
      >
        <DocumentFilterFields type={type} q={q} />
      </form>
    </div>
  );
}
