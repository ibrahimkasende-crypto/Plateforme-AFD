import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/module/admin-page-header";
import { updateCandidatureStatutAction } from "@/features/hr/actions/manage-hr-modules";
import { requirePermission } from "@/lib/auth/require-permission";
import { createClientSafe } from "@/lib/supabase/safe";

const fieldClass = "w-full rounded border p-2 text-sm";

type Candidature = {
  id: string;
  nom: string;
  email: string | null;
  telephone: string | null;
  statut: string;
  commentaires: string | null;
  note: number | null;
  recrutement_id: string;
  created_at: string;
};

export default async function AdminRhCandidatureDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requirePermission("hr.manage_recruitment");
  const { id } = await params;
  const supabase = await createClientSafe();
  if (!supabase) notFound();

  const { data } = await supabase
    .from("hr_candidatures_rh" as never)
    .select("id, nom, email, telephone, statut, commentaires, note, recrutement_id, created_at")
    .eq("id", id)
    .maybeSingle();

  if (!data) notFound();
  const candidature = data as Candidature;

  return (
    <main className="mx-auto max-w-2xl space-y-6 p-6">
      <AdminPageHeader
        title={candidature.nom}
        description={`Candidature reçue le ${candidature.created_at.slice(0, 10)}`}
        actions={
          <Link href="/admin/rh/candidatures" className="rounded border px-4 py-2 text-sm">
            Retour
          </Link>
        }
      />

      <div className="rounded border bg-white p-4 text-sm">
        <p>
          <span className="text-[var(--afd-muted)]">E-mail :</span> {candidature.email ?? "—"}
        </p>
        <p className="mt-2">
          <span className="text-[var(--afd-muted)]">Téléphone :</span> {candidature.telephone ?? "—"}
        </p>
        <p className="mt-2">
          <span className="text-[var(--afd-muted)]">Statut actuel :</span> {candidature.statut}
        </p>
        {candidature.commentaires ? (
          <p className="mt-2">
            <span className="text-[var(--afd-muted)]">Commentaires :</span> {candidature.commentaires}
          </p>
        ) : null}
      </div>

      <form action={updateCandidatureStatutAction} className="space-y-4 rounded border bg-white p-4">
        <input type="hidden" name="id" value={candidature.id} />
        <label className="block space-y-1 text-sm">
          <span className="font-medium">Nouveau statut</span>
          <select name="statut" defaultValue={candidature.statut} className={fieldClass}>
            <option value="recue">Reçue</option>
            <option value="preselection">Présélection</option>
            <option value="entretien">Entretien</option>
            <option value="offre">Offre</option>
            <option value="accepte">Acceptée</option>
            <option value="refuse">Refusée</option>
            <option value="embauche">Embauchée</option>
          </select>
        </label>
        <label className="block space-y-1 text-sm">
          <span className="font-medium">Commentaires</span>
          <textarea
            name="commentaires"
            defaultValue={candidature.commentaires ?? ""}
            rows={3}
            className={fieldClass}
          />
        </label>
        <button type="submit" className="rounded bg-[var(--afd-blue)] px-4 py-2 text-white">
          Mettre à jour
        </button>
      </form>
    </main>
  );
}
