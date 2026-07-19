import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/module/admin-page-header";
import { requirePermission } from "@/lib/auth/require-permission";
import { getAdminProjet } from "@/lib/queries/admin/projets";

const TABS = [
  { id: "general", label: "Vue générale" },
  { id: "activites", label: "Activités", hash: "activites" },
  { id: "beneficiaires", label: "Bénéficiaires", hash: "beneficiaires" },
  { id: "indicateurs", label: "Indicateurs", hash: "indicateurs" },
  { id: "budget", label: "Budget", hash: "budget" },
  { id: "carte", label: "Carte", hash: "carte" },
  { id: "partenaires", label: "Partenaires", hash: "partenaires" },
  { id: "documents", label: "Documents", hash: "documents" },
  { id: "medias", label: "Médias", hash: "medias" },
  { id: "rapports", label: "Rapports", hash: "rapports" },
  { id: "historique", label: "Historique", hash: "historique" },
  { id: "analyse", label: "Analyse", hrefSuffix: "/analyse" },
] as const;

export default async function AdminProjetDetailPage({
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
      <AdminPageHeader
        title={projet.title}
        description={[projet.location, projet.status].filter(Boolean).join(" · ")}
        backFallbackHref="/admin/projets"
        actions={
          <Link
            href={`/admin/projets/${id}/modifier`}
            className="rounded-lg bg-[var(--admin-primary)] px-3 py-2 text-sm font-semibold text-white"
          >
            Modifier
          </Link>
        }
      />

      <nav className="flex flex-wrap gap-2 border-b border-[var(--admin-border)] pb-2">
        {TABS.map((tab) => {
          const href =
            "hrefSuffix" in tab && tab.hrefSuffix
              ? `/admin/projets/${id}${tab.hrefSuffix}`
              : "hash" in tab && tab.hash
                ? `/admin/projets/${id}#${tab.hash}`
                : `/admin/projets/${id}`;
          const isActive = tab.id === "general";
          return (
            <Link
              key={tab.id}
              href={href}
              className={
                isActive
                  ? "rounded-md bg-[var(--admin-primary)]/10 px-3 py-1.5 text-sm font-semibold text-[var(--admin-primary)]"
                  : "rounded-md px-3 py-1.5 text-sm font-medium text-[var(--admin-muted)] hover:bg-slate-50"
              }
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
          <div key={kpi.label} className="rounded-xl border bg-white p-4">
            <p className="text-xs font-medium text-[var(--admin-muted)]">{kpi.label}</p>
            <p className="mt-1 font-display text-2xl font-extrabold tabular-nums text-[var(--admin-navy,#0d254e)]">
              {kpi.value}
            </p>
          </div>
        ))}
      </section>

      {projet.description ? (
        <section className="rounded-xl border bg-white p-4">
          <h2 className="text-sm font-semibold text-[var(--admin-text)]">Description</h2>
          <p className="mt-2 whitespace-pre-wrap text-sm text-[var(--admin-muted)]">
            {projet.description}
          </p>
        </section>
      ) : null}

      <section id="activites" className="scroll-mt-24 rounded-xl border bg-white p-4">
        <h2 className="text-sm font-semibold">Activités</h2>
        <p className="mt-1 text-sm text-[var(--admin-muted)]">
          Consultez le module Activités filtré sur ce projet.
        </p>
        <Link
          href={`/admin/activites?projet=${id}`}
          className="mt-2 inline-block text-sm font-medium text-[var(--afd-blue)]"
        >
          Voir les activités
        </Link>
      </section>

      <section id="beneficiaires" className="scroll-mt-24 rounded-xl border bg-white p-4">
        <h2 className="text-sm font-semibold">Bénéficiaires</h2>
        <Link
          href={`/admin/analyse/beneficiaires?projetId=${id}`}
          className="mt-2 inline-block text-sm font-medium text-[var(--afd-blue)]"
        >
          Analyse bénéficiaires
        </Link>
      </section>

      <section id="indicateurs" className="scroll-mt-24 rounded-xl border bg-white p-4">
        <h2 className="text-sm font-semibold">Indicateurs</h2>
        <Link
          href={`/admin/projets/${id}/analyse`}
          className="mt-2 inline-block text-sm font-medium text-[var(--afd-blue)]"
        >
          Ouvrir l’analyse
        </Link>
      </section>

      <section id="budget" className="scroll-mt-24 rounded-xl border bg-white p-4">
        <h2 className="text-sm font-semibold">Budget</h2>
        <p className="mt-1 font-display text-xl font-extrabold tabular-nums">
          {projet.budget != null
            ? new Intl.NumberFormat("fr-FR", {
                style: "currency",
                currency: "USD",
                maximumFractionDigits: 0,
              }).format(Number(projet.budget))
            : "—"}
        </p>
      </section>

      <section id="carte" className="scroll-mt-24 rounded-xl border bg-white p-4">
        <h2 className="text-sm font-semibold">Carte</h2>
        <p className="mt-1 text-sm text-[var(--admin-muted)]">
          {projet.location || "Localisation non renseignée"}
        </p>
      </section>

      <section id="partenaires" className="scroll-mt-24 rounded-xl border bg-white p-4">
        <h2 className="text-sm font-semibold">Partenaires</h2>
        <Link href="/admin/partenaires" className="mt-2 inline-block text-sm font-medium text-[var(--afd-blue)]">
          Voir les partenaires
        </Link>
      </section>

      <section id="documents" className="scroll-mt-24 rounded-xl border bg-white p-4">
        <h2 className="text-sm font-semibold">Documents</h2>
        <Link href="/admin/documents" className="mt-2 inline-block text-sm font-medium text-[var(--afd-blue)]">
          Bibliothèque documents
        </Link>
      </section>

      <section id="medias" className="scroll-mt-24 rounded-xl border bg-white p-4">
        <h2 className="text-sm font-semibold">Médias</h2>
        <p className="mt-1 text-sm text-[var(--admin-muted)]">Médias du projet à venir.</p>
      </section>

      <section id="rapports" className="scroll-mt-24 rounded-xl border bg-white p-4">
        <h2 className="text-sm font-semibold">Rapports</h2>
        <Link href="/admin/rapports" className="mt-2 inline-block text-sm font-medium text-[var(--afd-blue)]">
          Voir les rapports
        </Link>
      </section>

      <section id="historique" className="scroll-mt-24 rounded-xl border bg-white p-4">
        <h2 className="text-sm font-semibold">Historique</h2>
        <p className="mt-1 text-sm text-[var(--admin-muted)]">
          Journal des modifications disponibles dans l’audit.
        </p>
      </section>
    </main>
  );
}
