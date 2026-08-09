"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAnyPermission } from "@/lib/auth/guards";
import { createClientSafe } from "@/lib/supabase/safe";
import { createAdminServiceClient } from "@/lib/supabase/admin-service";
import { isSuperActor } from "@/features/identity/security/privilege-guards";
import { inviteAdministrator } from "@/features/identity/services/invitation.service";
import { assertCanCreatePrincipal } from "@/features/identity/services/principal-admin.service";
import { hasPermission } from "@/lib/auth/has-permission";
import { getUserRoleNames } from "@/lib/auth/get-user-role";

const schema = z.object({
  prenom: z.string().min(1),
  deuxieme_prenom: z.string().optional(),
  nom: z.string().min(1),
  postnom: z.string().optional(),
  sexe: z.string().optional(),
  date_naissance: z.string().optional(),
  email: z.string().email(),
  email_personnel: z.string().email().optional().or(z.literal("")),
  telephone: z.string().optional(),
  telephone_secondaire: z.string().optional(),
  adresse: z.string().optional(),
  commune: z.string().optional(),
  ville: z.string().optional(),
  province: z.string().optional(),
  pays: z.string().optional(),
  departement: z.string().optional(),
  service: z.string().optional(),
  fonction: z.string().optional(),
  poste: z.string().optional(),
  date_prise_fonction: z.string().optional(),
  type_contrat: z.string().optional(),
  bureau: z.string().optional(),
  province_affectation: z.string().optional(),
  biographie: z.string().optional(),
  competences: z.string().optional(),
  langues: z.string().optional(),
  require_mfa: z.string().optional(),
  niveau_confidentialite: z.string().optional(),
  compte_expire_le: z.string().optional(),
  reason: z.string().min(8),
  redirect_to: z.string().optional(),
});

export async function createPrincipalAdminAction(formData: FormData) {
  const session = await requireAnyPermission([
    "users.manage_principal",
    "users.create_super_admin",
  ]);
  if (!isSuperActor(session.roles)) {
    redirect("/acces-refuse");
  }

  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;

  const supabase = await createClientSafe();
  if (!supabase) return;

  try {
    await assertCanCreatePrincipal(supabase, "admin_principal");
  } catch {
    redirect("/admin/administrateur-principal?error=already_exists");
  }

  const nomComplet = [
    parsed.data.prenom,
    parsed.data.deuxieme_prenom,
    parsed.data.nom,
    parsed.data.postnom,
  ]
    .filter(Boolean)
    .join(" ");

  const actorRoles = await getUserRoleNames(session.user.id);
  const [hasCreateAdmin, hasCreateSuperAdmin, hasManagePrincipal] =
    await Promise.all([
      hasPermission(session.user.id, "users.create_admin"),
      hasPermission(session.user.id, "users.create_super_admin"),
      hasPermission(session.user.id, "users.manage_principal"),
    ]);

  const {
    data: { session: authSession },
  } = await supabase.auth.getSession();
  const mfaAal =
    (authSession as { aal?: string } | null)?.aal ||
    (process.env.NODE_ENV !== "production" ? "aal2" : null);

  let userId: string;
  try {
    const invited = await inviteAdministrator(supabase, {
      email: parsed.data.email,
      nomComplet,
      roleCode: "admin_principal",
      actorId: session.user.id,
      actorRoles,
      hasInvite: true,
      hasCreateAdmin,
      hasCreateSuperAdmin,
      hasManagePrincipal,
      mfaAal,
      reason: parsed.data.reason,
      fonction: parsed.data.fonction || "Administrateur principal AFD",
      telephone: parsed.data.telephone,
      requireMfa: parsed.data.require_mfa === "on" || true,
    });
    userId = invited.userId;
  } catch {
    return;
  }

  const service = createAdminServiceClient();
  const client = service ?? supabase;

  const competences = (parsed.data.competences || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const langues = (parsed.data.langues || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  await client
    .from("profils_administrateurs" as never)
    .update({
      prenom: parsed.data.prenom,
      deuxieme_prenom: parsed.data.deuxieme_prenom || null,
      nom_famille: parsed.data.nom,
      postnom: parsed.data.postnom || null,
      sexe: parsed.data.sexe || null,
      date_naissance: parsed.data.date_naissance || null,
      email_personnel: parsed.data.email_personnel || null,
      telephone_secondaire: parsed.data.telephone_secondaire || null,
      adresse: parsed.data.adresse || null,
      commune: parsed.data.commune || null,
      ville: parsed.data.ville || null,
      province: parsed.data.province || null,
      pays: parsed.data.pays || "RD Congo",
      departement: parsed.data.departement || null,
      service: parsed.data.service || null,
      fonction: parsed.data.fonction || "Administrateur principal AFD",
      poste: parsed.data.poste || null,
      date_entree: parsed.data.date_prise_fonction || null,
      type_contrat: parsed.data.type_contrat || null,
      bureau: parsed.data.bureau || null,
      province_affectation: parsed.data.province_affectation || null,
      biographie: parsed.data.biographie || null,
      competences,
      langues,
      niveau_confidentialite:
        parsed.data.niveau_confidentialite || "strictement_confidentiel",
      compte_expire_le: parsed.data.compte_expire_le || null,
      nom_complet: nomComplet,
      nom_affichage: nomComplet,
      updated_at: new Date().toISOString(),
    } as never)
    .eq("id", userId);

  const photo = formData.get("photo");
  if (photo instanceof File && photo.size > 0 && service) {
    const ext =
      photo.type === "image/png"
        ? "png"
        : photo.type === "image/webp"
          ? "webp"
          : "jpg";
    const path = `${userId}/processed/avatar.${ext}`;
    const buffer = Buffer.from(await photo.arrayBuffer());
    await service.storage.from("admin-avatars").remove([path]).catch(() => undefined);
    await service.storage.from("admin-avatars").upload(path, buffer, {
      contentType: photo.type || "image/jpeg",
      upsert: true,
    });
    await service
      .from("profils_administrateurs" as never)
      .update({
        avatar_bucket: "admin-avatars",
        avatar_path: path,
        updated_at: new Date().toISOString(),
      } as never)
      .eq("id", userId);
  }

  revalidatePath("/admin/administrateur-principal");
  revalidatePath("/admin/utilisateurs");
  redirect("/admin/administrateur-principal");
}
