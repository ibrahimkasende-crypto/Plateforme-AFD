import { notFound } from "next/navigation";
import { saveEnquete } from "@/features/enquetes/actions/manage-enquete";
import { requirePermission } from "@/lib/auth/require-permission";
import { getAdminEnquete } from "@/lib/queries/admin/enquetes";

type PageProps = { params: Promise<{ id: string }> };

export default async function ModifierEnquetePage({ params }: PageProps) {
  await requirePermission("enquetes:write");
  const { id } = await params;
  const item = await getAdminEnquete(id);
  if (!item) notFound();

  return (
    <main className="max-w-2xl space-y-6 p-6">
      <h1 className="text-2xl font-bold">Modifier l’enquête</h1>
      <form action={saveEnquete} className="space-y-4 rounded-2xl border bg-white p-6">
        <input type="hidden" name="id" value={item.id} />
        <input required name="titre" defaultValue={item.titre} className="w-full rounded-lg border p-3" />
        <input required name="slug" defaultValue={item.slug} className="w-full rounded-lg border p-3" />
        <textarea name="description" defaultValue={item.description ?? ""} className="min-h-28 w-full rounded-lg border p-3" />
        <input name="province" defaultValue={item.province ?? ""} className="w-full rounded-lg border p-3" />
        <select name="statut" defaultValue={item.statut} className="w-full rounded-lg border p-3">
          <option value="brouillon">Brouillon</option>
          <option value="publiee">Publiée</option>
          <option value="cloturee">Clôturée</option>
          <option value="archivee">Archivée</option>
        </select>
        <select name="visibilite" defaultValue={item.visibilite} className="w-full rounded-lg border p-3">
          <option value="privee">Privée</option>
          <option value="publique">Publique</option>
          <option value="agents">Agents</option>
        </select>
        <label className="flex items-center gap-2 text-sm">
          <input
            name="consentement_requis"
            type="checkbox"
            defaultChecked={item.consentement_requis}
          />{" "}
          Consentement requis
        </label>
        <button type="submit" className="rounded-lg bg-[var(--afd-blue)] px-4 py-2 font-semibold text-white">
          Enregistrer
        </button>
      </form>
    </main>
  );
}
