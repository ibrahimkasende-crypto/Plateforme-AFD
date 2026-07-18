import { PublicationModuleShell } from "@/components/admin/publications/publication-module-shell";
import { saveTemoignage } from "@/features/impact/actions/manage-temoignage";
import { requirePermission } from "@/lib/auth/require-permission";

export default async function NouveauTemoignagePage() {
  await requirePermission("temoignages:write");

  return (
    <PublicationModuleShell
      title="Nouveau témoignage"
      description="Publication bloquée sans consentement approuvé ou non requis."
    >
      <form action={saveTemoignage} className="max-w-2xl space-y-4 rounded-2xl border border-[var(--afd-border)] bg-white p-6">
        <input required name="display_name" placeholder="Nom affiché" className="w-full rounded-lg border p-3" />
        <input name="slug" placeholder="slug (optionnel)" className="w-full rounded-lg border p-3" />
        <input name="role_or_profile" placeholder="Fonction ou profil" className="w-full rounded-lg border p-3" />
        <textarea required name="quote" minLength={10} placeholder="Citation" className="min-h-32 w-full rounded-lg border p-3" />
        <input name="province" placeholder="Province" className="w-full rounded-lg border p-3" />
        <input name="image_url" placeholder="URL image Supabase Storage" className="w-full rounded-lg border p-3" />
        <input name="order_index" type="number" defaultValue={0} className="w-full rounded-lg border p-3" />
        <select name="consent_status" defaultValue="to-review" className="w-full rounded-lg border p-3">
          <option value="to-review">À revoir</option>
          <option value="approved">Approuvé</option>
          <option value="not-required">Non requis</option>
          <option value="refused">Refusé</option>
          <option value="absent">Absent</option>
        </select>
        <label className="flex items-center gap-2 text-sm">
          <input name="anonymized" type="checkbox" /> Anonymiser
        </label>
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
