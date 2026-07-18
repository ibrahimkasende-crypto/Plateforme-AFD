import { PublicationModuleShell } from "@/components/admin/publications/publication-module-shell";
import { saveAppelOffre } from "@/features/appels-offres/actions/manage-appel-offre";
import { requirePermission } from "@/lib/auth/require-permission";

export default async function NouvelAppelOffrePage() {
  await requirePermission("appels-offres:write");

  return (
    <PublicationModuleShell
      title="Nouvel appel d’offres"
      description="Créez un brouillon puis publiez lorsque les documents sont prêts."
    >
      <form action={saveAppelOffre} className="max-w-2xl space-y-4 rounded-2xl border border-[var(--afd-border)] bg-white p-6">
        <input required name="titre" placeholder="Titre" className="w-full rounded-lg border p-3" />
        <input required name="slug" placeholder="slug-appel-offres" className="w-full rounded-lg border p-3" />
        <textarea name="resume" placeholder="Résumé" className="min-h-24 w-full rounded-lg border p-3" />
        <textarea name="description" placeholder="Description" className="min-h-40 w-full rounded-lg border p-3" />
        <textarea name="procedure" placeholder="Procédure" className="min-h-24 w-full rounded-lg border p-3" />
        <input name="contact_email" type="email" placeholder="Email de contact" className="w-full rounded-lg border p-3" />
        <input name="localisation" placeholder="Localisation" className="w-full rounded-lg border p-3" />
        <input name="date_limite" type="datetime-local" className="w-full rounded-lg border p-3" />
        <input name="document_principal_path" placeholder="Chemin Storage document principal" className="w-full rounded-lg border p-3" />
        <select name="statut" defaultValue="brouillon" className="w-full rounded-lg border p-3">
          <option value="brouillon">Brouillon</option>
          <option value="ouvert">Ouvert</option>
          <option value="cloture">Clôturé</option>
          <option value="suspendu">Suspendu</option>
        </select>
        <label className="flex items-center gap-2 text-sm">
          <input name="publie" type="checkbox" /> Publier
        </label>
        <button type="submit" className="rounded-lg bg-[var(--afd-blue)] px-4 py-2 font-semibold text-white">
          Enregistrer
        </button>
      </form>
    </PublicationModuleShell>
  );
}
