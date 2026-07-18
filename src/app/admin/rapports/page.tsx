import Link from "next/link";
import { requirePermission } from "@/lib/auth/require-permission";
import { getAdminDocuments } from "@/lib/queries/admin/documents";

export default async function Page() {
  await requirePermission("documents:read");
  const reports = await getAdminDocuments("rapport");
  return (
    <main className="space-y-6 p-6">
      <div className="flex items-center justify-between"><h1 className="text-2xl font-bold">Rapports</h1><Link href="/admin/documents/nouveau" className="text-[var(--afd-blue)]">Ajouter un document</Link></div>
      <ul className="divide-y rounded border bg-white">{reports.map((report) => <li className="p-4" key={report.id}><Link href={`/admin/documents/${report.id}/modifier`} className="font-medium text-[var(--afd-blue)]">{report.titre}</Link></li>)}</ul>
    </main>
  );
}
