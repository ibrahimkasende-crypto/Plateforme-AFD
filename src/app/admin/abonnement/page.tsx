import { AdminPageHeader } from "@/components/admin/module/admin-page-header";
import { PoweredByLisungiHub } from "@/components/branding/powered-by-lisungi-hub";
import { organizationBrand } from "@/config/organization-brand";
import { productBrand } from "@/config/product-brand";
import { requireAdmin } from "@/lib/auth/require-admin";

/**
 * Page préparatoire — abonnement LISUNGI.
 * Ne bloque pas l’AFD ; données configurables (plan pilote interne).
 */
export default async function AdminAbonnementPage() {
  await requireAdmin("/admin/abonnement");

  const plan = {
    name: "Pilote interne",
    status: "Actif",
    startedAt: "2026-01-01",
    renewalAt: "2027-01-01",
    seats: "Illimité (pilote)",
    storage: "Selon infrastructure partagée",
    modules: "Modules opérationnels AFD activés",
    limits: "Aucune limite commerciale appliquée en phase pilote",
    contact: productBrand.supportName,
  };

  return (
    <main className="mx-auto max-w-3xl space-y-6 p-6">
      <AdminPageHeader
        title="Abonnement"
        description={`Plan ${productBrand.productName} pour ${organizationBrand.organizationShortName}.`}
        backFallbackHref="/admin/parametres"
      />

      <section
        className="rounded-xl border border-[var(--admin-border)] bg-white p-5"
        data-subscription-panel
      >
        <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
          Organisation
        </p>
        <h2 className="mt-1 font-display text-lg font-bold">
          {organizationBrand.organizationLegalName}
        </h2>

        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-slate-500">Plan</dt>
            <dd className="font-semibold text-[var(--admin-text)]">{plan.name}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Statut</dt>
            <dd className="font-semibold text-emerald-700">{plan.status}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Date de début</dt>
            <dd className="font-medium">{plan.startedAt}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Renouvellement</dt>
            <dd className="font-medium">{plan.renewalAt}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Utilisateurs autorisés</dt>
            <dd className="font-medium">{plan.seats}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Stockage</dt>
            <dd className="font-medium">{plan.storage}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-slate-500">Modules activés</dt>
            <dd className="font-medium">{plan.modules}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-slate-500">Limites</dt>
            <dd className="font-medium">{plan.limits}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-slate-500">Contact</dt>
            <dd className="font-medium">{plan.contact}</dd>
          </div>
        </dl>

        <p className="mt-4 text-xs text-slate-400">
          Aucun montant commercial n’est affiché en phase pilote. Les conditions
          définitives seront communiquées par {productBrand.publisherName}.
        </p>
        <PoweredByLisungiHub className="mt-3" theme="light" />
      </section>
    </main>
  );
}
