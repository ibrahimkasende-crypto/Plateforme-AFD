import { AdminPageHeader } from "@/components/admin/module/admin-page-header";
import { OrganizationLogo } from "@/components/branding/organization-logo";
import { organizationBrand } from "@/config/organization-brand";
import { productBrand } from "@/config/product-brand";
import { requirePermission } from "@/lib/auth/require-permission";
import { getAdminSiteParameterMap } from "@/lib/queries/admin/parametres";

export default async function AdminOrganisationParametresPage() {
  await requirePermission("parametres:manage");
  const values = await getAdminSiteParameterMap();

  return (
    <main className="mx-auto max-w-3xl space-y-6 p-6">
      <AdminPageHeader
        title="Organisation"
        description={`${productBrand.tenantLabel} — paramètres institutionnels de l’organisation cliente.`}
        backFallbackHref="/admin/parametres"
      />

      <section
        className="flex items-start gap-4 rounded-xl border border-[var(--admin-border)] bg-white p-5"
        data-organization-profile
      >
        <OrganizationLogo size="lg" />
        <div className="min-w-0 space-y-1">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
            {productBrand.tenantLabel}
          </p>
          <h2 className="font-display text-xl font-bold text-[var(--admin-text)]">
            {organizationBrand.organizationName}
          </h2>
          <p className="text-sm text-slate-600">
            {organizationBrand.organizationLegalName}
          </p>
          <p className="text-sm text-slate-500">
            Domaine : {organizationBrand.organizationDomain}
          </p>
        </div>
      </section>

      <section className="space-y-3 rounded-xl border border-[var(--admin-border)] bg-white p-5 text-sm">
        <h3 className="font-semibold text-[var(--admin-text)]">
          Identité institutionnelle
        </h3>
        <dl className="grid gap-2 sm:grid-cols-2">
          <div>
            <dt className="text-slate-500">Nom court</dt>
            <dd className="font-medium">
              {values["org.name"] || organizationBrand.organizationShortName}
            </dd>
          </div>
          <div>
            <dt className="text-slate-500">Slogan</dt>
            <dd className="font-medium">{values["org.slogan"] || "—"}</dd>
          </div>
          <div>
            <dt className="text-slate-500">E-mail</dt>
            <dd className="font-medium">{values["contact.email"] || "—"}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Téléphone</dt>
            <dd className="font-medium">{values["contact.phone"] || "—"}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-slate-500">Adresse</dt>
            <dd className="font-medium">{values["contact.address"] || "—"}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Couleur primaire</dt>
            <dd className="font-medium">{organizationBrand.primaryColor}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Couleur secondaire</dt>
            <dd className="font-medium">{organizationBrand.secondaryColor}</dd>
          </div>
        </dl>
        <p className="pt-2 text-xs text-slate-400">
          Ces paramètres concernent l’organisation cliente, pas l’éditeur{" "}
          {productBrand.publisherName}.
        </p>
      </section>
    </main>
  );
}
