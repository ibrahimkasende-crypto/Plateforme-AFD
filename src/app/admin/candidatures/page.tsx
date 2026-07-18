import { requirePermission } from "@/lib/auth/require-permission";
import { getAdminApplications } from "@/lib/queries/admin/candidatures";

export default async function CandidaturesPage() {
  await requirePermission("candidatures:read");
  const items = await getAdminApplications();
  return <main className="space-y-6 p-6"><h1 className="text-2xl font-bold">Candidatures</h1><div className="overflow-x-auto rounded border bg-white"><table className="w-full text-left text-sm"><thead><tr><th className="p-3">Candidat·e</th><th>E-mail</th><th>Origine</th><th>Statut</th></tr></thead><tbody>{items.map((item) => <tr className="border-t" key={item.id}><td className="p-3">{item.prenom} {item.nom}</td><td>{item.email}</td><td>{item.est_spontanee ? "Spontanée" : "Opportunité"}</td><td>{item.statut}</td></tr>)}</tbody></table></div></main>;
}
