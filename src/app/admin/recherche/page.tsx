import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/module/admin-page-header";
import { AdminEmptyState } from "@/components/admin/data/admin-empty-state";
import { searchAdminGlobal } from "@/features/search/services/global-search.service";
import { requireAuthenticatedUser } from "@/lib/auth/guards";
import { hasPermission } from "@/lib/auth/has-permission";
import { createClientSafe } from "@/lib/supabase/safe";

export default async function AdminRecherchePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const session = await requireAuthenticatedUser();
  const { q } = await searchParams;
  const supabase = await createClientSafe();
  const userId = session.user.id;

  const allowed = {
    programmes: await hasPermission(userId, "programmes:read"),
    projets: await hasPermission(userId, "projets:read"),
    activites: await hasPermission(userId, "activites:read"),
    urgences: await hasPermission(userId, "urgences:read"),
    partenaires: await hasPermission(userId, "partenaires:read"),
  };

  const hits =
    supabase && q?.trim()
      ? await searchAdminGlobal(supabase, q, allowed)
      : [];

  return (
    <main className="space-y-6 p-6">
      <AdminPageHeader
        title="Recherche globale"
        description="Recherche multi-modules filtrée selon vos permissions."
      />
      <form className="flex flex-wrap gap-3">
        <input
          name="q"
          defaultValue={q}
          placeholder="Rechercher…"
          className="min-w-[240px] flex-1 rounded border p-2"
          minLength={2}
          required
        />
        <button type="submit" className="rounded bg-[var(--afd-blue)] px-4 py-2 text-white">
          Rechercher
        </button>
      </form>

      {!q?.trim() ? (
        <AdminEmptyState
          title="Saisissez une recherche"
          description="Au moins 2 caractères. Les résultats respectent vos permissions."
        />
      ) : hits.length === 0 ? (
        <AdminEmptyState title="Aucun résultat" description={`Rien pour « ${q} ».`} />
      ) : (
        <ul className="divide-y rounded border bg-white">
          {hits.map((hit) => (
            <li key={`${hit.module}-${hit.id}`} className="p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">{hit.module}</p>
              <Link href={hit.href} className="font-medium text-[var(--afd-blue)] hover:underline">
                {hit.title}
              </Link>
              {hit.meta ? <p className="text-sm text-slate-600">{hit.meta}</p> : null}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
