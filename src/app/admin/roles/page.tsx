import { EmptyState } from "@/components/shared/EmptyState";
import { roleLabels } from "@/config/roles";
import { toggleRolePermission } from "@/features/roles/actions/manage-role-permissions";
import { requirePermission } from "@/lib/auth/require-permission";
import { getAdminRolesWithPermissions, getAllPermissions } from "@/lib/queries/admin/roles";

export default async function AdminRolesPage() {
  await requirePermission("roles:manage");
  const [rolesList, permissions] = await Promise.all([
    getAdminRolesWithPermissions(),
    getAllPermissions(),
  ]);

  const appPermissions = permissions.filter((p) => p.nom.includes(":"));

  return (
    <main className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">Rôles et permissions</h1>
        <p className="text-sm text-[var(--afd-muted)]">
          Matrice des permissions applicatives stockées en base Supabase.
        </p>
      </div>

      {rolesList.length === 0 ? (
        <EmptyState
          title="Aucun rôle configuré"
          description="Exécutez les migrations auth admin pour initialiser les rôles organisationnels."
        />
      ) : (
        <div className="space-y-8">
          {rolesList.map((role) => (
            <section key={role.id} className="rounded border bg-white p-4">
              <h2 className="text-lg font-semibold">
                {roleLabels[role.nom as keyof typeof roleLabels] ?? role.nom}
              </h2>
              {role.description ? (
                <p className="mt-1 text-sm text-[var(--afd-muted)]">{role.description}</p>
              ) : null}
              <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {appPermissions.map((permission) => {
                  const enabled = role.permissions.includes(permission.nom);
                  return (
                    <form key={permission.id} action={toggleRolePermission} className="flex items-start gap-2 rounded border p-2 text-sm">
                      <input type="hidden" name="role_id" value={role.id} />
                      <input type="hidden" name="permission_id" value={permission.id} />
                      <input type="hidden" name="enabled" value={enabled ? "false" : "true"} />
                      <button
                        type="submit"
                        className={enabled ? "font-medium text-green-700" : "text-[var(--afd-muted)]"}
                        title={permission.description ?? permission.nom}
                      >
                        {enabled ? "✓" : "○"} {permission.nom}
                      </button>
                    </form>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}
    </main>
  );
}
