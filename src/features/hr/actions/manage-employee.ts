"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { roles } from "@/config/roles";
import { requirePermission } from "@/lib/auth/require-permission";
import { createClientSafe } from "@/lib/supabase/safe";
import { hasPermission } from "@/lib/auth/has-permission";
import { getUserRoleNames } from "@/lib/auth/get-user-role";
import {
  createEmployee,
  linkEmployeeToUser,
  uploadEmployeePhoto,
} from "@/features/hr/services/employees.service";
import { inviteAdministrator } from "@/features/identity/services/invitation.service";
import {
  assertCannotTouchSuperAdmin,
  canAssignRole,
  isPrincipalRole,
} from "@/features/identity/security/privilege-guards";

const schema = z.object({
  nom: z.string().min(1),
  postnom: z.string().optional(),
  prenom: z.string().min(1),
  deuxieme_prenom: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  email_personnel: z.string().email().optional().or(z.literal("")),
  telephone: z.string().optional(),
  telephone_secondaire: z.string().optional(),
  sexe: z.string().optional(),
  date_naissance: z.string().optional(),
  matricule: z.string().optional(),
  adresse: z.string().optional(),
  commune: z.string().optional(),
  ville: z.string().optional(),
  province: z.string().optional(),
  pays: z.string().optional(),
  departement_id: z.string().uuid().optional().or(z.literal("")),
  poste_id: z.string().uuid().optional().or(z.literal("")),
  service: z.string().optional(),
  fonction: z.string().optional(),
  date_embauche: z.string().optional(),
  date_fin: z.string().optional(),
  type_contrat: z.string().optional(),
  type_agent: z.string().optional(),
  bureau: z.string().optional(),
  province_affectation: z.string().optional(),
  territoire_affectation: z.string().optional(),
  statut: z.string().optional(),
  create_account: z.string().optional(),
  role: z.enum(roles).optional(),
  modules: z.string().optional(),
  projets: z.string().optional(),
  niveau_confidentialite: z.string().optional(),
  compte_expire_le: z.string().optional(),
  require_mfa: z.string().optional(),
});

export async function createEmployeeAction(formData: FormData): Promise<void> {
  const session = await requirePermission("hr.manage_employees");
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;

  const createAccount = parsed.data.create_account === "on";
  if (createAccount) {
    if (!parsed.data.email) return;
    if (!parsed.data.role) return;
  }

  const supabase = await createClientSafe();
  if (!supabase) return;

  const id = await createEmployee(supabase, {
    nom: parsed.data.nom,
    postnom: parsed.data.postnom,
    prenom: parsed.data.prenom,
    deuxiemePrenom: parsed.data.deuxieme_prenom,
    email: parsed.data.email || undefined,
    emailPersonnel: parsed.data.email_personnel || undefined,
    telephone: parsed.data.telephone,
    telephoneSecondaire: parsed.data.telephone_secondaire,
    sexe: parsed.data.sexe,
    dateNaissance: parsed.data.date_naissance,
    matricule: parsed.data.matricule,
    adresse: parsed.data.adresse,
    commune: parsed.data.commune,
    ville: parsed.data.ville,
    province: parsed.data.province,
    pays: parsed.data.pays,
    departementId: parsed.data.departement_id || undefined,
    posteId: parsed.data.poste_id || undefined,
    service: parsed.data.service,
    fonction: parsed.data.fonction,
    dateEmbauche: parsed.data.date_embauche,
    dateFin: parsed.data.date_fin,
    typeContrat: parsed.data.type_contrat,
    typeAgent: parsed.data.type_agent,
    bureau: parsed.data.bureau,
    provinceAffectation: parsed.data.province_affectation,
    territoireAffectation: parsed.data.territoire_affectation,
    statut: parsed.data.statut,
  });

  const photo = formData.get("photo");
  if (photo instanceof File && photo.size > 0) {
    try {
      await uploadEmployeePhoto(id, photo);
    } catch {
      // La fiche reste créée même si l’upload échoue
    }
  }

  if (createAccount && parsed.data.email && parsed.data.role) {
    const actorRoles = await getUserRoleNames(session.user.id);
    const [hasCreateAdmin, hasCreateSuperAdmin, hasInvite] = await Promise.all([
      hasPermission(session.user.id, "users.create_admin"),
      hasPermission(session.user.id, "users.create_super_admin"),
      hasPermission(session.user.id, "users.invite"),
    ]);

    if (isPrincipalRole(parsed.data.role)) {
      revalidatePath("/admin/rh/personnel");
      redirect(`/admin/rh/personnel/${id}?warn=role_principal_interdit`);
    }

    const gate = canAssignRole({
      actorRoles,
      targetRole: parsed.data.role,
      hasCreateSuperAdmin,
      hasCreateAdmin,
      hasInvite: hasInvite || true,
    });
    if (!gate.ok) {
      revalidatePath("/admin/rh/personnel");
      redirect(`/admin/rh/personnel/${id}?warn=role_refuse`);
    }

    try {
      assertCannotTouchSuperAdmin(actorRoles, [parsed.data.role]);
    } catch {
      redirect(`/admin/rh/personnel/${id}?warn=role_refuse`);
    }

    const {
      data: { session: authSession },
    } = await supabase.auth.getSession();
    const mfaAal =
      (authSession as { aal?: string } | null)?.aal ||
      (process.env.NODE_ENV !== "production" ? "aal2" : null);

    try {
      const invited = await inviteAdministrator(supabase, {
        email: parsed.data.email,
        nomComplet: [parsed.data.prenom, parsed.data.nom, parsed.data.postnom]
          .filter(Boolean)
          .join(" "),
        roleCode: parsed.data.role,
        actorId: session.user.id,
        actorRoles,
        hasInvite: true,
        hasCreateAdmin,
        hasCreateSuperAdmin,
        mfaAal,
        fonction: parsed.data.fonction,
        telephone: parsed.data.telephone,
        requireMfa: parsed.data.require_mfa === "on",
        reason: "Création employé avec compte d’accès",
      });
      await linkEmployeeToUser(supabase, id, invited.userId);

      if (parsed.data.niveau_confidentialite || parsed.data.compte_expire_le) {
        await supabase
          .from("profils_administrateurs" as never)
          .update({
            niveau_confidentialite:
              parsed.data.niveau_confidentialite || "interne",
            compte_expire_le: parsed.data.compte_expire_le || null,
            updated_at: new Date().toISOString(),
          } as never)
          .eq("id", invited.userId);
      }
    } catch {
      revalidatePath("/admin/rh/personnel");
      redirect(`/admin/rh/personnel/${id}?warn=invitation_echec`);
    }
  }

  revalidatePath("/admin/rh/personnel");
  revalidatePath("/admin/employes");
  revalidatePath("/admin/utilisateurs");
  redirect(`/admin/rh/personnel/${id}`);
}
