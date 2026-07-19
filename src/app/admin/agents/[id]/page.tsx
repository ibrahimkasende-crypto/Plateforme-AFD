import Link from "next/link";
import { notFound } from "next/navigation";
import { saveAgent } from "@/features/agents/actions/manage-agent";
import {
  registerAgentDeviceAction,
  revokeAgentDeviceAction,
} from "@/features/agents/actions/manage-devices";
import { requirePermission } from "@/lib/auth/require-permission";
import { getAdminAgent } from "@/lib/queries/admin/agents";
import { createClientSafe } from "@/lib/supabase/safe";

type PageProps = { params: Promise<{ id: string }> };

export default async function AgentDetailPage({ params }: PageProps) {
  await requirePermission("agents:write");
  const { id } = await params;
  const item = await getAdminAgent(id);
  if (!item) notFound();

  const supabase = await createClientSafe();
  const { data: devicesRaw } = supabase
    ? await supabase
        .from("agent_appareils" as never)
        .select("id, device_label, device_fingerprint, statut, last_sync_at")
        .eq("agent_id", id)
        .order("created_at", { ascending: false })
        .limit(50)
    : { data: [] };
  const devices = (devicesRaw ?? []) as Array<{
    id: string;
    device_label: string;
    device_fingerprint: string;
    statut: string;
    last_sync_at: string | null;
  }>;

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

      <section className="space-y-3 rounded-2xl border bg-white p-6">
        <h2 className="font-semibold">Appareils</h2>
        <form action={registerAgentDeviceAction} className="grid gap-2 sm:grid-cols-3">
          <input type="hidden" name="agent_id" value={id} />
          <input name="device_label" required placeholder="Libellé" className="rounded border p-2 text-sm" />
          <input
            name="device_fingerprint"
            required
            placeholder="Empreinte appareil"
            className="rounded border p-2 text-sm"
          />
          <button type="submit" className="rounded bg-[var(--afd-blue)] px-3 py-2 text-sm text-white">
            Enregistrer
          </button>
        </form>
        <ul className="space-y-2 text-sm">
          {devices.map((d) => (
            <li key={d.id} className="flex items-center justify-between border-t pt-2">
              <span>
                {d.device_label} · {d.statut}
                <span className="ml-2 font-mono text-xs text-slate-500">{d.device_fingerprint}</span>
              </span>
              {d.statut === "actif" ? (
                <form action={revokeAgentDeviceAction}>
                  <input type="hidden" name="id" value={d.id} />
                  <input type="hidden" name="agent_id" value={id} />
                  <button type="submit" className="text-red-700">
                    Révoquer
                  </button>
                </form>
              ) : null}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
