import { notFound } from "next/navigation";
import { requirePermission } from "@/lib/auth/require-permission";
import { saveOpportunity } from "@/features/opportunites/actions/manage-opportunity";
import { getAdminOpportunity } from "@/lib/queries/admin/opportunites";

export default async function ModifierOpportunitePage({ params }: { params: Promise<{ id: string }> }) {
  await requirePermission("opportunites:write");
  const item = await getAdminOpportunity((await params).id);
  if (!item) notFound();
  return <main className="max-w-2xl p-6"><h1 className="mb-6 text-2xl font-bold">Modifier l’opportunité</h1><form action={saveOpportunity} className="space-y-4"><input name="id" type="hidden" value={item.id} /><input required name="titre" defaultValue={item.titre} className="w-full rounded border p-3" /><input required name="slug" defaultValue={item.slug} className="w-full rounded border p-3" /><input required name="type" defaultValue={item.type} className="w-full rounded border p-3" /><input name="localisation" defaultValue={item.localisation ?? ""} className="w-full rounded border p-3" /><textarea required name="description" defaultValue={item.description} className="min-h-40 w-full rounded border p-3" /><select name="statut" defaultValue={item.statut} className="w-full rounded border p-3"><option value="brouillon">Brouillon</option><option value="ouverte">Ouverte</option><option value="bientot_cloturee">Bientôt clôturée</option><option value="cloturee">Clôturée</option><option value="suspendue">Suspendue</option><option value="pourvue">Pourvue</option></select><label><input name="publie" type="checkbox" defaultChecked={item.publie} /> Publier</label><button className="block rounded bg-[var(--afd-blue)] px-4 py-2 text-white">Enregistrer</button></form></main>;
}
