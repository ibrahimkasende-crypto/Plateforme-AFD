import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/module/admin-page-header";
import { requirePermission } from "@/lib/auth/require-permission";
import { createClientSafe } from "@/lib/supabase/safe";

export default async function AdminLogistiquePage() {
  await requirePermission("logistique:read");
  const supabase = await createClientSafe();

  let demandes: Array<Record<string, unknown>> = [];
  let vehicules: Array<Record<string, unknown>> = [];
  let missions: Array<Record<string, unknown>> = [];

  if (supabase) {
    const [d, v, m] = await Promise.all([
      supabase
        .from("logistique_demandes" as never)
        .select("id, reference, titre, statut, created_at")
        .order("created_at", { ascending: false })
        .limit(50),
      supabase
        .from("logistique_vehicules" as never)
        .select("id, immatriculation, type, statut")
        .eq("actif", true)
        .limit(50),
      supabase
        .from("logistique_missions" as never)
        .select("id, reference, titre, statut, province")
        .order("created_at", { ascending: false })
        .limit(50),
    ]);
    demandes = (d.data ?? []) as Array<Record<string, unknown>>;
    vehicules = (v.data ?? []) as Array<Record<string, unknown>>;
    missions = (m.data ?? []) as Array<Record<string, unknown>>;
  }

  return (
    <main className="space-y-6 p-6">
      <AdminPageHeader
        title="Logistique"
        description="Demandes, véhicules et missions — traçabilité opérationnelle."
        actions={
          <>
            <Link href="/admin/logistique/demandes" className="rounded border px-3 py-2 text-sm">
              Demandes
            </Link>
            <Link href="/admin/logistique/vehicules" className="rounded border px-3 py-2 text-sm">
              Véhicules
            </Link>
            <Link href="/admin/logistique/missions" className="rounded border px-3 py-2 text-sm">
              Missions
            </Link>
          </>
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded border bg-white p-4">
          <p className="text-sm text-[var(--afd-muted)]">Demandes</p>
          <p className="text-2xl font-bold">{demandes.length}</p>
        </div>
        <div className="rounded border bg-white p-4">
          <p className="text-sm text-[var(--afd-muted)]">Véhicules actifs</p>
          <p className="text-2xl font-bold">{vehicules.length}</p>
        </div>
        <div className="rounded border bg-white p-4">
          <p className="text-sm text-[var(--afd-muted)]">Missions</p>
          <p className="text-2xl font-bold">{missions.length}</p>
        </div>
      </div>

      <section className="rounded border bg-white p-4">
        <h2 className="mb-2 font-semibold">Dernières demandes</h2>
        <ul className="space-y-2 text-sm">
          {demandes.slice(0, 8).map((d) => (
            <li key={String(d.id)} className="flex justify-between border-b py-1">
              <span>
                {String(d.reference)} — {String(d.titre)}
              </span>
              <span className="text-[var(--afd-muted)]">{String(d.statut)}</span>
            </li>
          ))}
          {demandes.length === 0 ? (
            <li className="text-[var(--afd-muted)]">Aucune demande pour le moment.</li>
          ) : null}
        </ul>
      </section>
    </main>
  );
}
