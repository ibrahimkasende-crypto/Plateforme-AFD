import { notFound } from "next/navigation";
import { PublicationModuleShell } from "@/components/admin/publications/publication-module-shell";
import { saveHistoire } from "@/features/impact/actions/manage-histoire";
import { requirePermission } from "@/lib/auth/require-permission";
import { getAdminHistoire } from "@/lib/queries/admin/histoires";

type PageProps = { params: Promise<{ id: string }> };

export default async function ModifierHistoirePage({ params }: PageProps) {
  await requirePermission("histoires:write");
  const { id } = await params;
  const item = await getAdminHistoire(id);
  if (!item) notFound();

  return (
    <PublicationModuleShell
      title="Modifier l’histoire"
      description="Mettez à jour le récit. La publication reste bloquée sans consentement valide."
    >
      <form action={saveHistoire} className="max-w-2xl space-y-4 rounded-2xl border border-[var(--afd-border)] bg-white p-6">
        <input type="hidden" name="id" value={item.id} />
        <input required name="title" defaultValue={item.title} className="w-full rounded-lg border p-3" />
        <input required name="slug" defaultValue={item.slug} className="w-full rounded-lg border p-3" />
        <textarea name="excerpt" defaultValue={item.excerpt ?? ""} className="min-h-24 w-full rounded-lg border p-3" />
        <textarea name="content" defaultValue={item.content ?? ""} className="min-h-40 w-full rounded-lg border p-3" />
        <input name="person_or_community" defaultValue={item.person_or_community ?? ""} className="w-full rounded-lg border p-3" />
        <input name="location" defaultValue={item.location ?? ""} className="w-full rounded-lg border p-3" />
        <input name="quote" defaultValue={item.quote ?? ""} className="w-full rounded-lg border p-3" />
        <textarea name="results" defaultValue={item.results ?? ""} className="min-h-24 w-full rounded-lg border p-3" />
        <input name="image_url" defaultValue={item.image_url ?? ""} className="w-full rounded-lg border p-3" />
        <select name="consent_status" defaultValue={item.consent_status} className="w-full rounded-lg border p-3">
          <option value="to-review">À revoir</option>
          <option value="approved">Approuvé</option>
          <option value="not-required">Non requis</option>
          <option value="refused">Refusé</option>
          <option value="absent">Absent</option>
        </select>
        <select name="status" defaultValue={item.status} className="w-full rounded-lg border p-3">
          <option value="brouillon">Brouillon</option>
          <option value="en_revision">En révision</option>
          <option value="approuve">Approuvé</option>
          <option value="publie">Publié</option>
          <option value="depublie">Dépublié</option>
          <option value="archive">Archivé</option>
        </select>
        <label className="flex items-center gap-2 text-sm">
          <input name="anonymized" type="checkbox" defaultChecked={item.anonymized} /> Anonymiser
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input name="featured" type="checkbox" defaultChecked={item.featured} /> Mise en avant
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input name="published" type="checkbox" defaultChecked={item.published} /> Publier
        </label>
        <button type="submit" className="rounded-lg bg-[var(--afd-blue)] px-4 py-2 font-semibold text-white">
          Enregistrer
        </button>
      </form>
    </PublicationModuleShell>
  );
}
