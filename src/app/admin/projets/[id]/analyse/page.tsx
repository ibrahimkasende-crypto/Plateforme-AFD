import Link from "next/link";
import { notFound } from "next/navigation";
import { requirePermission } from "@/lib/auth/require-permission";
import { getAdminProjet } from "@/lib/queries/admin/projets";

export default async function AdminProjetAnalysePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requirePermission("projets:read");
  const { id } = await params;
  const projet = await getAdminProjet(id);
  if (!projet) notFound();

  return (
    <main className="space-y-6 p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Link
            href="/admin/analyse/projets"
            className="text-sm font-medium text-[var(--admin-primary)] hover:underline"
          >
            ← Analyse des projets
          </Link>
          <h1 className="mt-2 font-display text-2xl font-extrabold">
            {projet.title}
          </h1>
          <p className="mt-1 text-sm text-[var(--admin-muted)]">
            {projet.location} · {projet.status}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/admin/projets/${id}/modifier`}
            className="rounded-lg bg-[var(--admin-primary)] px-3 py-2 text-sm font-semibold text-white"
          >
            Modifier
          </Link>
          <Link
            href={`/admin/activites/nouvelle?projet=${id}`}
            className="rounded-lg border px-3 py-2 text-sm font-semibold"
          >
            Ajouter une activité
          </Link>
          <Link
            href={`/admin/indicateurs/nouveau?projet=${id}`}
            className="rounded-lg border px-3 py-2 text-sm font-semibold"
          >
            Ajouter un indicateur
          </Link>
          <Link
            href={`/admin/rapports/nouveau?projet=${id}`}
            className="rounded-lg border px-3 py-2 text-sm font-semibold"
          >
            Générer un rapport
          </Link>
        </div>
      </div>

      <section className="grid gap-4 md:grid-cols-4">
        {[
          {
            label: "Bénéficiaires",
            value: projet.beneficiaries?.toLocaleString("fr-FR") ?? "—",
          },
          {
            label: "Budget",
            value:
              projet.budget != null
                ? new Intl.NumberFormat("fr-FR", {
                    style: "currency",
                    currency: "USD",
                    maximumFractionDigits: 0,
                  }).format(Number(projet.budget))
                : "—",
          },
          { label: "Statut", value: projet.status ?? "—" },
          { label: "Actif", value: projet.active ? "Oui" : "Non" },
        ].map((kpi) => (
          <article
            key={kpi.label}
            className="rounded-2xl border border-[var(--admin-border)] bg-white p-4"
          >
            <p className="text-xs text-[var(--admin-muted)]">{kpi.label}</p>
            <p className="mt-2 font-display text-xl font-extrabold">
              {kpi.value}
            </p>
          </article>
        ))}
      </section>

      <section className="rounded-2xl border border-[var(--admin-border)] bg-white p-5">
        <h2 className="font-display text-sm font-bold">Présentation</h2>
        <p className="mt-2 whitespace-pre-wrap text-sm text-[var(--admin-text)]">
          {projet.description}
        </p>
      </section>
    </main>
  );
}
