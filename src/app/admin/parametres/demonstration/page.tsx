import Link from "next/link";
import { requireAdmin } from "@/lib/auth/require-admin";
import { redirect } from "next/navigation";

export default async function DemonstrationSettingsPage() {
  const session = await requireAdmin();
  const allowed =
    session.role === "super_admin" ||
    session.role === "platform_owner" ||
    session.roles.includes("super_admin") ||
    session.roles.includes("platform_owner");
  if (!allowed) {
    redirect("/acces-refuse");
  }

  const demoAdmin =
    process.env.NEXT_PUBLIC_ENABLE_ADMIN_DEMO_DATA === "true";
  const demoPublic =
    process.env.NEXT_PUBLIC_ENABLE_DEMO_CONTENT === "true";

  return (
    <main className="mx-auto max-w-2xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Données de démonstration
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Réservé au Super Administrateur. Les données `is_demo=true` sont
          distinctes des données réelles.
        </p>
      </div>

      <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        Cet environnement {demoAdmin || demoPublic ? "contient" : "peut contenir"}{" "}
        des données de démonstration destinées à la présentation.
      </div>

      <dl className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-slate-600">NEXT_PUBLIC_ENABLE_ADMIN_DEMO_DATA</dt>
          <dd className="font-semibold">{demoAdmin ? "true" : "false"}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-slate-600">NEXT_PUBLIC_ENABLE_DEMO_CONTENT</dt>
          <dd className="font-semibold">{demoPublic ? "true" : "false"}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-slate-600">Lot démo</dt>
          <dd className="font-mono text-xs">afd-demo-client-2026</dd>
        </div>
      </dl>

      <section className="space-y-2 rounded-xl border border-slate-200 bg-white p-4 text-sm">
        <h2 className="font-semibold text-slate-900">Commandes serveur</h2>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-3 text-xs text-slate-100">
{`npm run demo:seed -- --dry-run
npm run demo:seed -- --execute
npm run demo:clear -- --execute
npm run demo:reset`}
        </pre>
        <p className="text-slate-600">
          Le reset ne supprime que les lignes marquées `is_demo=true`. Les données
          réelles sont conservées.
        </p>
      </section>

      <Link href="/admin/parametres" className="text-sm text-[var(--afd-blue)] underline">
        Retour aux paramètres
      </Link>
    </main>
  );
}
