import { PublicationModuleShell } from "@/components/admin/publications/publication-module-shell";
import { saveHistoire } from "@/features/impact/actions/manage-histoire";
import { requirePermission } from "@/lib/auth/require-permission";

export default async function NouvelleHistoirePage() {
  await requirePermission("histoires:write");

  return (
    <PublicationModuleShell
      title="Nouvelle histoire d’impact"
      description="Le consentement doit être validé avant toute publication publique."
    >
      <form action={saveHistoire} className="max-w-2xl space-y-4 rounded-2xl border border-[var(--afd-border)] bg-white p-6">
        <input required name="title" placeholder="Titre" className="w-full rounded-lg border p-3" />
        <input required name="slug" placeholder="slug-de-lhistoire" className="w-full rounded-lg border p-3" />
        <textarea name="excerpt" placeholder="Extrait" className="min-h-24 w-full rounded-lg border p-3" />
        <textarea name="content" placeholder="Récit" className="min-h-40 w-full rounded-lg border p-3" />
        <input name="person_or_community" placeholder="Personne ou communauté" className="w-full rounded-lg border p-3" />
        <input name="location" placeholder="Localisation" className="w-full rounded-lg border p-3" />
        <input name="quote" placeholder="Citation" className="w-full rounded-lg border p-3" />
        <textarea name="results" placeholder="Résultats" className="min-h-24 w-full rounded-lg border p-3" />
        <input name="image_url" placeholder="URL image Supabase Storage" className="w-full rounded-lg border p-3" />
        <select name="consent_status" defaultValue="to-review" className="w-full rounded-lg border p-3">
          <option value="to-review">À revoir</option>
          <option value="approved">Approuvé</option>
          <option value="not-required">Non requis</option>
          <option value="refused">Refusé</option>
          <option value="absent">Absent</option>
        </select>
        <select name="status" defaultValue="brouillon" className="w-full rounded-lg border p-3">
          <option value="brouillon">Brouillon</option>
          <option value="en_revision">En révision</option>
          <option value="approuve">Approuvé</option>
          <option value="publie">Publié</option>
        </select>
        <label className="flex items-center gap-2 text-sm">
          <input name="anonymized" type="checkbox" /> Anonymiser
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input name="featured" type="checkbox" /> Mise en avant
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input name="published" type="checkbox" /> Publier (consentement requis)
        </label>
        <button type="submit" className="rounded-lg bg-[var(--afd-blue)] px-4 py-2 font-semibold text-white">
          Enregistrer
        </button>
      </form>
    </PublicationModuleShell>
  );
}
