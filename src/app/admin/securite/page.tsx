import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/module/admin-page-header";
import { requirePermission } from "@/lib/auth/require-permission";
import { getAdminSiteParameterMap } from "@/lib/queries/admin/parametres";

export default async function AdminSecuritePage() {
  await requirePermission("parametres:manage");
  const params = await getAdminSiteParameterMap();

  return (
    <main className="space-y-6 p-6">
      <AdminPageHeader
        title="Sécurité"
        description="Paramètres de session et accès."
        actions={
          <>
            <Link href="/admin/utilisateurs" className="rounded border px-3 py-2 text-sm">
              Utilisateurs
            </Link>
            <Link href="/admin/permissions" className="rounded border px-3 py-2 text-sm">
              Permissions
            </Link>
          </>
        }
      />
      <div className="rounded border bg-white p-4 text-sm">
        <p>
          Durée de session : <strong>{params["security.session_days"] ?? "non définie"}</strong> jours
        </p>
        <p className="mt-2">
          MFA obligatoire :{" "}
          <strong>{params["security.mfa_required"] === "true" ? "Oui" : "Non"}</strong>
        </p>
        <Link href="/admin/parametres" className="mt-4 inline-block text-[var(--afd-blue)]">
          Modifier dans les paramètres
        </Link>
      </div>
    </main>
  );
}
