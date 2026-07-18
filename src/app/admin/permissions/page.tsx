import { permissions, roleHasPermission, rolePermissions } from "@/config/permissions";
import { roleLabels, type Role } from "@/config/roles";
import { requirePermission } from "@/lib/auth/require-permission";

export default async function AdminPermissionsPage() {
  await requirePermission("roles:manage");
  const roles = Object.keys(rolePermissions) as Role[];

  return (
    <main className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">Matrice des permissions</h1>
        <p className="text-sm text-[var(--afd-muted)]">
          Permissions applicatives définies dans la configuration (référence côté serveur).
        </p>
      </div>
      <div className="overflow-x-auto rounded border bg-white">
        <table className="w-full text-left text-xs">
          <thead>
            <tr>
              <th className="sticky left-0 bg-white p-2">Permission</th>
              {roles.map((role) => (
                <th key={role} className="p-2 whitespace-nowrap">
                  {roleLabels[role] ?? role}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {permissions.map((permission) => (
              <tr className="border-t" key={permission}>
                <td className="sticky left-0 bg-white p-2 font-medium">{permission}</td>
                {roles.map((role) => (
                  <td key={role} className="p-2 text-center">
                    {roleHasPermission(role, permission) ? "✓" : "—"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
