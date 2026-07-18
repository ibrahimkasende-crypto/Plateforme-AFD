import { notFound } from "next/navigation";
import { requirePermission } from "@/lib/auth/require-permission";
import { saveDocument } from "@/features/documents/actions/manage-document";
import { getAdminDocument } from "@/lib/queries/admin/documents";

export default async function ModifierDocumentPage({ params }: { params: Promise<{ id: string }> }) {
  await requirePermission("documents:write");
  const item = await getAdminDocument((await params).id);
  if (!item) notFound();
  return <main className="max-w-2xl p-6"><h1 className="mb-6 text-2xl font-bold">Modifier le document</h1><form action={saveDocument} className="space-y-4"><input name="id" type="hidden" value={item.id} /><input name="titre" required defaultValue={item.titre} className="w-full rounded border p-3" /><input name="slug" required defaultValue={item.slug} className="w-full rounded border p-3" /><input name="type" required defaultValue={item.type} className="w-full rounded border p-3" /><textarea name="description" defaultValue={item.description ?? ""} className="min-h-24 w-full rounded border p-3" /><input name="fichier_storage_path" required defaultValue={item.fichier_storage_path} className="w-full rounded border p-3" /><input name="nom_fichier" defaultValue={item.nom_fichier ?? ""} className="w-full rounded border p-3" /><select name="niveau_confidentialite" defaultValue={item.niveau_confidentialite} className="w-full rounded border p-3"><option value="public">Public</option><option value="interne">Interne</option><option value="restreint">Restreint</option></select><label><input name="publie" type="checkbox" defaultChecked={item.publie} /> Publier</label><button className="block rounded bg-[var(--afd-blue)] px-4 py-2 text-white">Enregistrer</button></form></main>;
}
