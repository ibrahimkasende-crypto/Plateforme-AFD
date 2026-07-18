import Link from "next/link";
import { requirePermission } from "@/lib/auth/require-permission";
import { getAdminOpportunities } from "@/lib/queries/admin/opportunites";

export default async function AdminOpportunitesPage({ searchParams }: { searchParams: Promise<{ q?: string; statut?: string }> }) {
  await requirePermission("opportunites:read");
  const { q, statut } = await searchParams;
  const items = await getAdminOpportunities({ q, statut });
  return <main className="space-y-6 p-6"><div className="flex items-center justify-between"><h1 className="text-2xl font-bold">Opportunités</h1><Link className="rounded bg-[var(--afd-blue)] px-4 py-2 text-white" href="/admin/opportunites/nouvelle">Nouvelle opportunité</Link></div><form className="flex flex-wrap gap-3"><input name="q" defaultValue={q} placeholder="Rechercher" className="rounded border p-2" /><select name="statut" defaultValue={statut ?? ""} className="rounded border p-2"><option value="">Tous les statuts</option><option value="brouillon">Brouillon</option><option value="ouverte">Ouverte</option><option value="bientot_cloturee">Bientôt clôturée</option><option value="cloturee">Clôturée</option><option value="suspendue">Suspendue</option><option value="pourvue">Pourvue</option></select><button className="rounded border px-4 py-2">Filtrer</button></form><div className="overflow-x-auto rounded border bg-white"><table className="w-full text-left text-sm"><thead><tr><th className="p-3">Titre</th><th>Type</th><th>Statut</th><th /></tr></thead><tbody>{items.map((item) => <tr className="border-t" key={item.id}><td className="p-3">{item.titre}</td><td>{item.type}</td><td>{item.statut}</td><td className="space-x-3"><Link className="text-[var(--afd-blue)]" href={`/admin/opportunites/${item.id}`}>Voir</Link><Link className="text-[var(--afd-blue)]" href={`/admin/opportunites/${item.id}/modifier`}>Modifier</Link></td></tr>)}</tbody></table></div></main>;
}
