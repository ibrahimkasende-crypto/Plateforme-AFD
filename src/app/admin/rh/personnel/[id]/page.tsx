import Link from "next/link";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/module/admin-page-header";
import { EmptyState } from "@/components/shared/EmptyState";
import { hasPermission } from "@/lib/auth/has-permission";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { requirePermission } from "@/lib/auth/require-permission";
import { createClientSafe } from "@/lib/supabase/safe";

type Employee = {
  id: string;
  matricule: string | null;
  nom_affichage: string | null;
  prenom: string;
  nom: string;
  postnom: string | null;
  email: string | null;
  telephone: string | null;
  statut: string;
  genre: string | null;
  date_embauche: string | null;
  type_contrat: string | null;
  province: string | null;
  departement_id: string | null;
  poste_id: string | null;
};

type Contrat = {
  id: string;
  reference: string | null;
  type_contrat: string;
  date_debut: string;
  date_fin: string | null;
  salaire_base: number;
  devise: string;
  statut: string;
};

type Conge = {
  id: string;
  type_conge: string;
  date_debut: string;
  date_fin: string;
  jours: number;
  statut: string;
};

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-6 space-y-3 rounded border bg-white p-4">
      <h2 className="text-lg font-semibold">{title}</h2>
      {children}
    </section>
  );
}

export default async function AdminRhPersonnelDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requirePermission("hr.view");
  const { id } = await params;
  const supabase = await createClientSafe();
  if (!supabase) notFound();

  const user = await getCurrentUser();
  const canViewSalary = user
    ? await hasPermission(user.id, "payroll.view_salary")
    : false;

  const { data: employe } = await supabase
    .from("hr_employes" as never)
    .select(
      "id, matricule, nom_affichage, prenom, nom, postnom, email, telephone, statut, genre, date_embauche, type_contrat, province, departement_id, poste_id",
    )
    .eq("id", id)
    .is("archived_at", null)
    .maybeSingle();

  if (!employe) notFound();
  const employee = employe as Employee;

  const [{ data: contrats }, { data: conges }, { data: presences }, { data: equipements }] =
    await Promise.all([
      supabase
        .from("hr_contrats" as never)
        .select("id, reference, type_contrat, date_debut, date_fin, salaire_base, devise, statut")
        .eq("employe_id", id)
        .order("date_debut", { ascending: false }),
      supabase
        .from("hr_conges" as never)
        .select("id, type_conge, date_debut, date_fin, jours, statut")
        .eq("employe_id", id)
        .order("date_debut", { ascending: false })
        .limit(10),
      supabase
        .from("hr_presences" as never)
        .select("id, date_jour, statut, heure_entree, heure_sortie")
        .eq("employe_id", id)
        .order("date_jour", { ascending: false })
        .limit(10),
      supabase
        .from("hr_equipements" as never)
        .select("id, inventaire, type_equipement, etat, date_attribution")
        .eq("employe_id", id)
        .order("date_attribution", { ascending: false }),
    ]);

  const contratList = (contrats ?? []) as Contrat[];
  const congeList = (conges ?? []) as Conge[];

  const nav = [
    { id: "general", label: "Vue générale" },
    { id: "contrats", label: "Contrats" },
    { id: "conges", label: "Congés" },
    { id: "presences", label: "Présences" },
    { id: "equipements", label: "Équipements" },
  ];

  return (
    <main className="space-y-6 p-6">
      <AdminPageHeader
        title={employee.nom_affichage ?? `${employee.prenom} ${employee.nom}`}
        description={`Matricule : ${employee.matricule ?? "—"} · Statut : ${employee.statut}`}
        actions={
          <>
            <Link href="/admin/rh/personnel" className="rounded border px-4 py-2 text-sm">
              Retour
            </Link>
            <Link
              href={`/admin/rh/personnel/${id}/modifier`}
              className="rounded bg-[var(--afd-blue)] px-4 py-2 text-sm text-white"
            >
              Modifier
            </Link>
          </>
        }
      />

      <nav className="flex flex-wrap gap-2">
        {nav.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className="rounded border px-3 py-1.5 text-sm hover:bg-[var(--afd-accent-soft)]"
          >
            {item.label}
          </a>
        ))}
      </nav>

      <Section id="general" title="Vue générale">
        <dl className="grid gap-2 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-[var(--afd-muted)]">E-mail</dt>
            <dd>{employee.email ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-[var(--afd-muted)]">Téléphone</dt>
            <dd>{employee.telephone ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-[var(--afd-muted)]">Genre</dt>
            <dd>{employee.genre ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-[var(--afd-muted)]">Date d&apos;embauche</dt>
            <dd>{employee.date_embauche ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-[var(--afd-muted)]">Type de contrat</dt>
            <dd>{employee.type_contrat ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-[var(--afd-muted)]">Province</dt>
            <dd>{employee.province ?? "—"}</dd>
          </div>
        </dl>
      </Section>

      <Section id="contrats" title="Contrats">
        {contratList.length === 0 ? (
          <EmptyState
            title="Aucun contrat"
            description="Aucun contrat enregistré pour cet employé."
            action={
              <Link href="/admin/rh/contrats" className="text-[var(--afd-blue)]">
                Gérer les contrats
              </Link>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr>
                  <th className="p-2">Réf.</th>
                  <th>Type</th>
                  <th>Début</th>
                  <th>Fin</th>
                  {canViewSalary ? <th>Salaire base</th> : null}
                  <th>Statut</th>
                </tr>
              </thead>
              <tbody>
                {contratList.map((c) => (
                  <tr key={c.id} className="border-t">
                    <td className="p-2">{c.reference ?? "—"}</td>
                    <td>{c.type_contrat}</td>
                    <td>{c.date_debut}</td>
                    <td>{c.date_fin ?? "—"}</td>
                    {canViewSalary ? (
                      <td>
                        {c.salaire_base.toLocaleString("fr-FR")} {c.devise}
                      </td>
                    ) : null}
                    <td>{c.statut}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Section>

      <Section id="conges" title="Congés">
        {congeList.length === 0 ? (
          <p className="text-sm text-[var(--afd-muted)]">Aucune demande de congé.</p>
        ) : (
          <ul className="space-y-2 text-sm">
            {congeList.map((c) => (
              <li key={c.id} className="flex justify-between border-b pb-2">
                <span>
                  {c.type_conge} · {c.date_debut} → {c.date_fin} ({c.jours} j)
                </span>
                <span>{c.statut}</span>
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section id="presences" title="Présences récentes">
        {(presences ?? []).length === 0 ? (
          <p className="text-sm text-[var(--afd-muted)]">Aucune présence enregistrée.</p>
        ) : (
          <ul className="space-y-2 text-sm">
            {(presences as Array<{ id: string; date_jour: string; statut: string; heure_entree: string | null; heure_sortie: string | null }>).map(
              (p) => (
                <li key={p.id} className="flex justify-between border-b pb-2">
                  <span>
                    {p.date_jour} · {p.heure_entree ?? "—"} – {p.heure_sortie ?? "—"}
                  </span>
                  <span>{p.statut}</span>
                </li>
              ),
            )}
          </ul>
        )}
      </Section>

      <Section id="equipements" title="Équipements">
        {(equipements ?? []).length === 0 ? (
          <p className="text-sm text-[var(--afd-muted)]">Aucun équipement attribué.</p>
        ) : (
          <ul className="space-y-2 text-sm">
            {(equipements as Array<{ id: string; inventaire: string | null; type_equipement: string; etat: string }>).map(
              (e) => (
                <li key={e.id}>
                  {e.inventaire ?? "—"} · {e.type_equipement} · {e.etat}
                </li>
              ),
            )}
          </ul>
        )}
      </Section>
    </main>
  );
}
