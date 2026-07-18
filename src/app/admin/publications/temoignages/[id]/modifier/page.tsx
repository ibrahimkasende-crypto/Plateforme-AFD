import { notFound } from "next/navigation";
import { PublicationModuleShell } from "@/components/admin/publications/publication-module-shell";
import { saveTemoignage } from "@/features/impact/actions/manage-temoignage";
import { requirePermission } from "@/lib/auth/require-permission";
import { getAdminTemoignage } from "@/lib/queries/admin/temoignages";

type PageProps = { params: Promise<{ id: string }> };

export default async function ModifierTemoignagePage({ params }: PageProps) {
  await requirePermission("temoignages:write");
  const { id } = await params;
  const item = await getAdminTemoignage(id);
  if (!item) notFound();

  return (
    <PublicationModuleShell title="Modifier le témoignage" description="Mettez à jour le témoignage et son consentement.">
      <form action={saveTemoignage} className="max-w-2xl space-y-4 rounded-2xl border border-[var(--afd-border)] bg-white p-6">
        <input type="hidden" name="id" value={item.id} />
        <input required name="display_name" defaultValue={item.display_name} className="w-full rounded-lg border p-3" />
        <input name="slug" defaultValue={item.slug ?? ""} className="w-full rounded-lg border p-3" />
        <input name="role_or_profile" defaultValue={item.role_or_profile ?? ""} className="w-full rounded-lg border p-3" />
        <textarea required name="quote" defaultValue={item.quote} className="min-h-32 w-full rounded-lg border p-3" />
        <input name="province" defaultValue={item.province ?? ""} className="w-full rounded-lg border p-3" />
        <input name="image_url" defaultValue={item.image_url ?? ""} className="w-full rounded-lg border p-3" />
        <input name="order_index" type="number" defaultValue={item.order_index} className="w-full rounded-lg border p-3" />
        <select name="consent_status" defaultValue={item.consent_status} className="w-full rounded-lg border p-3">
          <option value="to-review">À revoir</option>
          <option value="approved">Approuvé</option>
          <option value="not-required">Non requis</option>
          <option value="refused">Refusé</option>
          <option value="absent">Absent</option>
        </select>
        <label className="flex items-center gap-2 text-sm">
          <input name="anonymized" type="checkbox" defaultChecked={item.anonymized} /> Anonymiser
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input name="publie" type="checkbox" defaultChecked={item.publie} /> Publier
        </label>
        <button type="submit" className="rounded-lg bg-[var(--afd-blue)] px-4 py-2 font-semibold text-white">
          Enregistrer
        </button>
      </form>
    </PublicationModuleShell>
  );
}
