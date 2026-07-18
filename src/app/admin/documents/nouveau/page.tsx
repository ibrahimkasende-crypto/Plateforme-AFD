import { requirePermission } from "@/lib/auth/require-permission";
import { saveDocument } from "@/features/documents/actions/manage-document";

export default async function NouveauDocumentPage() {
  await requirePermission("documents:write");
  return <main className="max-w-2xl p-6"><h1 className="mb-6 text-2xl font-bold">Nouveau document</h1><form action={saveDocument} className="space-y-4"><input name="titre" required placeholder="Titre" className="w-full rounded border p-3" /><input name="slug" required placeholder="slug-du-document" className="w-full rounded border p-3" /><input name="type" required defaultValue="document" className="w-full rounded border p-3" /><textarea name="description" placeholder="Description" className="min-h-24 w-full rounded border p-3" /><input name="fichier_storage_path" required placeholder="Chemin dans documents-publics" className="w-full rounded border p-3" /><input name="nom_fichier" placeholder="Nom du fichier" className="w-full rounded border p-3" /><select name="niveau_confidentialite" className="w-full rounded border p-3"><option value="public">Public</option><option value="interne">Interne</option><option value="restreint">Restreint</option></select><label><input name="publie" type="checkbox" /> Publier</label><button className="block rounded bg-[var(--afd-blue)] px-4 py-2 text-white">Enregistrer</button></form></main>;
}
