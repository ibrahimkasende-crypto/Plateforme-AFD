import Link from "next/link";
import { requirePermission } from "@/lib/auth/require-permission";
import { getAdminDocuments } from "@/lib/queries/admin/documents";

export default async function AdminDocumentsPage() {
  await requirePermission("documents:read");
  const items = await getAdminDocuments();
  return <main className="space-y-6 p-6"><div className="flex items-center justify-between"><h1 className="text-2xl font-bold">Documents</h1><Link href="/admin/documents/nouveau" className="rounded bg-[var(--afd-blue)] px-4 py-2 text-white">Nouveau document</Link></div><div className="overflow-x-auto rounded border bg-white"><table className="w-full text-left text-sm"><thead><tr><th className="p-3">Titre</th><th>Type</th><th>Visibilité</th><th /></tr></thead><tbody>{items.map((item) => <tr className="border-t" key={item.id}><td className="p-3">{item.titre}</td><td>{item.type}</td><td>{item.publie ? item.niveau_confidentialite : "Brouillon"}</td><td><Link href={`/admin/documents/${item.id}/modifier`} className="text-[var(--afd-blue)]">Modifier</Link></td></tr>)}</tbody></table></div></main>;
}
