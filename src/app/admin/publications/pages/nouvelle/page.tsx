import { PublicationModuleShell } from "@/components/admin/publications/publication-module-shell";
import { savePage } from "@/features/pages/actions/manage-page";
import { requirePermission } from "@/lib/auth/require-permission";

export default async function NouvellePageCmsPage() {
  await requirePermission("pages:write");

  return (
    <PublicationModuleShell
      title="Nouvelle page CMS"
      description="Associez une route publique à un contenu administrable."
    >
      <form action={savePage} className="max-w-2xl space-y-4 rounded-2xl border border-[var(--afd-border)] bg-white p-6">
        <input required name="route" placeholder="/qui-sommes-nous/histoire" className="w-full rounded-lg border p-3 font-mono text-sm" />
        <input required name="titre" placeholder="Titre" className="w-full rounded-lg border p-3" />
        <input name="surtitre" placeholder="Surtitre" className="w-full rounded-lg border p-3" />
        <textarea name="resume" placeholder="Résumé" className="min-h-24 w-full rounded-lg border p-3" />
        <textarea name="description_seo" placeholder="Description SEO" className="min-h-20 w-full rounded-lg border p-3" />
        <textarea name="contenu_principal" placeholder="Contenu principal" className="min-h-48 w-full rounded-lg border p-3" />
        <select name="statut" defaultValue="brouillon" className="w-full rounded-lg border p-3">
          <option value="brouillon">Brouillon</option>
          <option value="en_revision">En révision</option>
          <option value="publie">Publié</option>
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
