import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/module/admin-page-header";
import { EmptyState } from "@/components/shared/EmptyState";
import { requirePermission } from "@/lib/auth/require-permission";
import { createClientSafe } from "@/lib/supabase/safe";

type Conge = {
  id: string;
  type_conge: string;
  date_debut: string;
  date_fin: string;
  jours: number;
  statut: string;
};

type Presence = {
  id: string;
  date_jour: string;
  statut: string;
  heure_entree: string | null;
  heure_sortie: string | null;
};

export default async function EspaceEmployePage() {
  await requirePermission("hr.view");
  const supabase = await createClientSafe();

  let employe: {
    id: string;
    nom_affichage: string | null;
    matricule: string | null;
    statut: string;
  } | null = null;
  let conges: Conge[] = [];
  let presences: Presence[] = [];

  if (supabase) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { data: emp } = await supabase
        .from("hr_employes" as never)
        .select("id, nom_affichage, matricule, statut")
        .eq("user_id", user.id)
        .is("archived_at", null)
        .maybeSingle();

      if (emp) {
        const linked = emp as {
          id: string;
          nom_affichage: string | null;
          matricule: string | null;
          statut: string;
        };
        employe = linked;
        const [{ data: c }, { data: p }] = await Promise.all([
          supabase
            .from("hr_conges" as never)
            .select("id, type_conge, date_debut, date_fin, jours, statut")
            .eq("employe_id", linked.id)
            .order("date_debut", { ascending: false })
            .limit(5),
          supabase
            .from("hr_presences" as never)
            .select("id, date_jour, statut, heure_entree, heure_sortie")
            .eq("employe_id", linked.id)
            .order("date_jour", { ascending: false })
            .limit(5),
        ]);
        conges = (c ?? []) as Conge[];
        presences = (p ?? []) as Presence[];
      }
    }
  }

  return (
    <main className="mx-auto max-w-3xl space-y-6 p-6">
      <AdminPageHeader
        title="Espace employé"
        description="Consultation de vos informations RH personnelles."
      />

      {!employe ? (
        <EmptyState
          title="Profil employé non lié"
          description="Votre compte utilisateur n'est pas encore associé à un dossier RH."
          action={
            <Link href="/admin/mon-profil" className="rounded bg-[var(--afd-blue)] px-4 py-2 text-white">
              Mon profil
            </Link>
          }
        />
      ) : (
        <>
          <div className="rounded border bg-white p-4 text-sm">
            <p className="text-lg font-semibold">{employe.nom_affichage ?? "—"}</p>
            <p className="mt-1 text-[var(--afd-muted)]">
              Matricule : {employe.matricule ?? "—"} · Statut : {employe.statut}
            </p>
          </div>

          <section className="space-y-3 rounded border bg-white p-4">
            <h2 className="font-semibold">Mes congés récents</h2>
            {conges.length === 0 ? (
              <p className="text-sm text-[var(--afd-muted)]">Aucune demande de congé.</p>
            ) : (
              <ul className="space-y-2 text-sm">
                {conges.map((c) => (
                  <li key={c.id} className="flex justify-between border-b pb-2">
                    <span>
                      {c.type_conge} · {c.date_debut} → {c.date_fin}
                    </span>
                    <span>{c.statut}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="space-y-3 rounded border bg-white p-4">
            <h2 className="font-semibold">Mes présences récentes</h2>
            {presences.length === 0 ? (
              <p className="text-sm text-[var(--afd-muted)]">Aucune présence enregistrée.</p>
            ) : (
              <ul className="space-y-2 text-sm">
                {presences.map((p) => (
                  <li key={p.id} className="flex justify-between border-b pb-2">
                    <span>
                      {p.date_jour} · {p.heure_entree ?? "—"} – {p.heure_sortie ?? "—"}
                    </span>
                    <span>{p.statut}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}
    </main>
  );
}
