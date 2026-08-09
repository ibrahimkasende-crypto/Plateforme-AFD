import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/module/admin-page-header";
import { EmptyState } from "@/components/shared/EmptyState";
import {
  getEmployeePhotoSignedUrl,
  listEmployees,
} from "@/features/hr/services/employees.service";
import { requirePermission } from "@/lib/auth/require-permission";
import { createClientSafe } from "@/lib/supabase/safe";

type EmployeeRow = {
  id: string;
  matricule: string | null;
  nom_affichage: string | null;
  email: string | null;
  telephone: string | null;
  statut: string;
  date_embauche: string | null;
  province: string | null;
  avatar_bucket?: string | null;
  avatar_path?: string | null;
  photoUrl?: string | null;
};

export default async function AdminRhPersonnelPage({
  searchParams,
}: {
  searchParams?: Promise<{ q?: string }>;
}) {
  await requirePermission("hr.view");
  const { q } = (await searchParams) ?? {};
  const supabase = await createClientSafe();
  const raw = supabase
    ? ((await listEmployees(supabase, q)) as EmployeeRow[])
    : [];

  const items = await Promise.all(
    raw.map(async (item) => ({
      ...item,
      photoUrl: await getEmployeePhotoSignedUrl(
        item.avatar_bucket,
        item.avatar_path,
      ),
    })),
  );

  return (
    <main className="space-y-6 p-4 md:p-6">
      <AdminPageHeader
        title="Personnel"
        description="Liste des employés. Une fiche RH peut exister sans compte plateforme."
        createHref="/admin/rh/personnel/nouveau"
        createLabel="Nouvel employé"
      />

      <form className="flex flex-wrap gap-3">
        <input
          name="q"
          defaultValue={q}
          placeholder="Rechercher par nom, matricule ou e-mail"
          className="min-w-0 flex-1 rounded border p-2 text-sm sm:max-w-xs"
        />
        <button type="submit" className="rounded border px-4 py-2 text-sm">
          Filtrer
        </button>
      </form>

      {items.length === 0 ? (
        <EmptyState
          title="Aucun employé"
          description="Commencez par créer un dossier employé."
          action={
            <Link
              className="rounded bg-[var(--afd-blue)] px-4 py-2 text-white"
              href="/admin/rh/personnel/nouveau"
            >
              Nouvel employé
            </Link>
          }
        />
      ) : (
        <>
          <div className="grid gap-3 sm:hidden">
            {items.map((item) => (
              <Link
                key={item.id}
                href={`/admin/rh/personnel/${item.id}`}
                className="flex items-center gap-3 rounded-xl border bg-white p-3"
              >
                <div className="aspect-square size-12 overflow-hidden rounded-full bg-slate-100">
                  {item.photoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.photoUrl}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center text-sm font-bold text-slate-500">
                      {(item.nom_affichage || "?").charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">
                    {item.nom_affichage ?? "—"}
                  </p>
                  <p className="truncate text-xs text-slate-500">
                    {item.matricule} · {item.statut}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          <div className="hidden overflow-x-auto rounded border bg-white sm:block">
            <table className="w-full text-left text-sm">
              <thead>
                <tr>
                  <th className="p-3">Photo</th>
                  <th>Matricule</th>
                  <th>Nom</th>
                  <th>E-mail</th>
                  <th>Statut</th>
                  <th>Embauche</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr className="border-t" key={item.id}>
                    <td className="p-3">
                      <div className="aspect-square size-10 overflow-hidden rounded-full bg-slate-100">
                        {item.photoUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={item.photoUrl}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="flex h-full w-full items-center justify-center text-xs font-bold text-slate-500">
                            {(item.nom_affichage || "?").charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                    </td>
                    <td>{item.matricule ?? "—"}</td>
                    <td>{item.nom_affichage ?? "—"}</td>
                    <td>{item.email ?? "—"}</td>
                    <td>{item.statut}</td>
                    <td>
                      {item.date_embauche
                        ? new Date(item.date_embauche).toLocaleDateString("fr-FR")
                        : "—"}
                    </td>
                    <td className="p-3 text-right">
                      <Link
                        className="text-[var(--afd-blue)] underline"
                        href={`/admin/rh/personnel/${item.id}`}
                      >
                        Voir
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </main>
  );
}
