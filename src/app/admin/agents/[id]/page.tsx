import Link from "next/link";
import { notFound } from "next/navigation";
import { saveAgent } from "@/features/agents/actions/manage-agent";
import { requirePermission } from "@/lib/auth/require-permission";
import { getAdminAgent } from "@/lib/queries/admin/agents";

type PageProps = { params: Promise<{ id: string }> };

export default async function AgentDetailPage({ params }: PageProps) {
  await requirePermission("agents:write");
  const { id } = await params;
  const item = await getAdminAgent(id);
  if (!item) notFound();

  return (
    <main className="max-w-2xl space-y-6 p-6">
      <Link href="/admin/agents" className="text-sm font-semibold text-[var(--afd-blue)]">
        ← Agents
      </Link>
      <h1 className="text-2xl font-bold">{item.full_name}</h1>
      <form action={saveAgent} className="space-y-4 rounded-2xl border bg-white p-6">
        <input type="hidden" name="id" value={item.id} />
        <input required name="full_name" defaultValue={item.full_name} className="w-full rounded-lg border p-3" />
        <input name="matricule" defaultValue={item.matricule ?? ""} className="w-full rounded-lg border p-3" />
        <input name="fonction" defaultValue={item.fonction ?? ""} className="w-full rounded-lg border p-3" />
        <input name="telephone" defaultValue={item.telephone ?? ""} className="w-full rounded-lg border p-3" />
        <input name="province" defaultValue={item.province ?? ""} className="w-full rounded-lg border p-3" />
        <input name="territoire" defaultValue={item.territoire ?? ""} className="w-full rounded-lg border p-3" />
        <input name="disponibilite" defaultValue={item.disponibilite ?? ""} className="w-full rounded-lg border p-3" />
        <input
          name="date_affectation"
          type="date"
          defaultValue={item.date_affectation ?? ""}
          className="w-full rounded-lg border p-3"
        />
        <label className="flex items-center gap-2 text-sm">
          <input name="actif" type="checkbox" defaultChecked={item.actif} /> Actif
        </label>
        <button type="submit" className="rounded-lg bg-[var(--afd-blue)] px-4 py-2 font-semibold text-white">
          Enregistrer
        </button>
      </form>
    </main>
  );
}
