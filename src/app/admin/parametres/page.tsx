import { ParametresTabs } from "@/components/admin/parametres/parametres-tabs";
import { AdminPageHeader } from "@/components/admin/module/admin-page-header";
import { ProductLogo } from "@/components/branding/product-logo";
import { OrganizationLogo } from "@/components/branding/organization-logo";
import { organizationBrand } from "@/config/organization-brand";
import { productBrand } from "@/config/product-brand";
import { requirePermission } from "@/lib/auth/require-permission";
import { getAdminSiteParameterMap } from "@/lib/queries/admin/parametres";
import Link from "next/link";

export default async function AdminParametresPage() {
  await requirePermission("parametres:manage");
  const values = await getAdminSiteParameterMap();
  const envLabel =
    process.env.NEXT_PUBLIC_APP_ENV ?? process.env.NODE_ENV ?? "development";

  return (
    <main className="space-y-6 p-6">
      <AdminPageHeader
        title="Paramètres"
        description="Configuration de la plateforme AFD, de l’organisation et des préférences."
      />

      <div className="grid gap-4 md:grid-cols-3">
        <section
          className="rounded-xl border border-[var(--admin-border)] bg-white p-4"
          data-settings-product
        >
          <div className="flex items-center gap-3">
            <ProductLogo size="md" />
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                Plateforme
              </p>
              <h2 className="font-display text-base font-bold text-[var(--admin-text)]">
                {productBrand.productName}
              </h2>
            </div>
          </div>
          <dl className="mt-3 space-y-1.5 text-sm text-slate-600">
            <div className="flex justify-between gap-2">
              <dt>Version</dt>
              <dd className="font-medium text-slate-800">{productBrand.version}</dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt>Organisation</dt>
              <dd className="font-medium text-slate-800">
                {productBrand.publisherName}
              </dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt>Support</dt>
              <dd className="font-medium text-slate-800">
                {productBrand.supportName}
              </dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt>Environnement</dt>
              <dd className="font-medium text-slate-800">{envLabel}</dd>
            </div>
          </dl>
          <Link
            href="/admin/abonnement"
            className="mt-3 inline-block text-sm font-medium text-[var(--admin-primary)] hover:underline"
          >
            Voir l’abonnement →
          </Link>
        </section>

        <section
          className="rounded-xl border border-[var(--admin-border)] bg-white p-4"
          data-settings-organization
        >
          <div className="flex items-center gap-3">
            <OrganizationLogo size="md" />
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                Organisation
              </p>
              <h2 className="font-display text-base font-bold text-[var(--admin-text)]">
                {organizationBrand.organizationShortName}
              </h2>
            </div>
          </div>
          <p className="mt-3 text-sm text-slate-600">
            {organizationBrand.organizationLegalName}
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Domaine : {organizationBrand.organizationDomain}
          </p>
          <Link
            href="/admin/parametres/organisation"
            className="mt-3 inline-block text-sm font-medium text-[var(--admin-primary)] hover:underline"
          >
            Paramètres institutionnels →
          </Link>
        </section>

        <section
          className="rounded-xl border border-[var(--admin-border)] bg-white p-4"
          data-settings-user
        >
          <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
            Utilisateur
          </p>
          <h2 className="mt-1 font-display text-base font-bold text-[var(--admin-text)]">
            Profil et accès
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Photo, fonction, rôles, permissions et sessions.
          </p>
          <Link
            href="/admin/mon-profil"
            className="mt-3 inline-block text-sm font-medium text-[var(--admin-primary)] hover:underline"
          >
            Mon profil →
          </Link>
        </section>
      </div>

      <ParametresTabs values={values} />
    </main>
  );
}
