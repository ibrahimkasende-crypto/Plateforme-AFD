import Link from "next/link";
import { requirePermission } from "@/lib/auth/require-permission";
import { getAdminOpportunities } from "@/lib/queries/admin/opportunites";

export default async function AdminOpportunitesPage() {
  await requirePermission("opportunites:read");
  const items = await getAdminOpportunities();
  return <main className="space-y-6 p-6"><div className="flex items-center justify-between"><h1 className="text-2xl font-bold">Opportunités</h1><Link className="rounded bg-[var(--afd-blue)] px-4 py-2 text-white" href="/admin/opportunites/nouvelle">Nouvelle opportunité</Link></div><div className="overflow-x-auto rounded border bg-white"><table className="w-full text-left text-sm"><thead><tr><th className="p-3">Titre</th><th>Type</th><th>Statut</th><th /></tr></thead><tbody>{items.map((item) => <tr className="border-t" key={item.id}><td className="p-3">{item.titre}</td><td>{item.type}</td><td>{item.statut}</td><td><Link className="text-[var(--afd-blue)]" href={`/admin/opportunites/${item.id}/modifier`}>Modifier</Link></td></tr>)}</tbody></table></div></main>;
}
