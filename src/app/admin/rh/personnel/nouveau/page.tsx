import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/module/admin-page-header";
import { EmployeeCreateForm } from "@/components/admin/hr/employee-create-form";
import { principalAssignableRoles } from "@/config/afd-staff";
import { roles, type Role } from "@/config/roles";
import { createEmployeeAction } from "@/features/hr/actions/manage-employee";
import {
  isPrincipalActor,
  isSuperActor,
} from "@/features/identity/security/privilege-guards";
import { requirePermission } from "@/lib/auth/require-permission";
import { requireAdmin } from "@/lib/auth/require-admin";
import { createClientSafe } from "@/lib/supabase/safe";

type RefRow = { id: string; nom?: string; titre?: string };

export default async function AdminRhPersonnelNouveauPage() {
  await requirePermission("hr.manage_employees");
  const session = await requireAdmin();
  const supabase = await createClientSafe();

  const [{ data: departements }, { data: postes }] = supabase
    ? await Promise.all([
        supabase
          .from("hr_departements" as never)
          .select("id, nom")
          .eq("actif", true)
          .order("nom"),
        supabase
          .from("hr_postes" as never)
          .select("id, titre")
          .eq("actif", true)
          .order("titre"),
      ])
    : [{ data: [] }, { data: [] }];

  const deptList = (departements ?? []) as RefRow[];
  const posteList = (postes ?? []) as RefRow[];

  let selectableRoles: Role[] = ["agent", "lecture_seule"];
  if (isSuperActor(session.roles)) {
    selectableRoles = (principalAssignableRoles as readonly string[]).filter(
      (code): code is Role => (roles as readonly string[]).includes(code),
    );
  } else if (isPrincipalActor(session.roles)) {
    selectableRoles = (principalAssignableRoles as readonly string[]).filter(
      (code): code is Role => (roles as readonly string[]).includes(code),
    );
  }

  const defaultRole = selectableRoles.includes("agent")
    ? "agent"
    : selectableRoles[0] ?? "employe";

  return (
    <main className="mx-auto w-full max-w-3xl space-y-6 p-4 md:p-6">
      <AdminPageHeader
        title="Nouvel employé"
        description="Fiche RH. Optionnellement, créez aussi un compte d’accès avec invitation sécurisée."
        actions={
          <Link
            href="/admin/rh/personnel"
            className="rounded border px-4 py-2 text-sm"
          >
            Retour
          </Link>
        }
      />

      <EmployeeCreateForm
        action={createEmployeeAction}
        departements={deptList}
        postes={posteList}
        selectableRoles={selectableRoles}
        defaultRole={defaultRole}
      />
    </main>
  );
}
