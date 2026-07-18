import { ParametresTabs } from "@/components/admin/parametres/parametres-tabs";
import { AdminPageHeader } from "@/components/admin/module/admin-page-header";
import { requirePermission } from "@/lib/auth/require-permission";
import { getAdminSiteParameterMap } from "@/lib/queries/admin/parametres";

export default async function AdminParametresPage() {
  await requirePermission("parametres:manage");
  const values = await getAdminSiteParameterMap();

  return (
    <main className="space-y-6 p-6">
      <AdminPageHeader
        title="Paramètres du site"
        description="Configuration générale, identité, coordonnées et intégrations."
      />
      <ParametresTabs values={values} />
    </main>
  );
}
