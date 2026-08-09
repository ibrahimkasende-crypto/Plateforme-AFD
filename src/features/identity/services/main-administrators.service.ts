import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import { PRINCIPAL_DIRECTION_ROLE, PRINCIPAL_IT_ROLE } from "@/config/afd-staff";

export type MainAdminCard = {
  seat: "direction" | "it";
  role: string;
  roleLabel: string;
  id: string | null;
  email: string | null;
  nom_complet: string | null;
  fonction: string | null;
  telephone: string | null;
  statut_compte: string | null;
  derniere_connexion: string | null;
  must_change_password: boolean | null;
  avatar_bucket: string | null;
  avatar_path: string | null;
  initials: string;
};

function initialsFromName(name: string | null | undefined, fallback: string) {
  if (!name?.trim()) return fallback;
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return `${parts[0]?.[0] ?? ""}${parts[1]?.[0] ?? ""}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

async function loadSeat(
  supabase: SupabaseClient,
  roleName: string,
  seat: "direction" | "it",
  roleLabel: string,
  fallbackInitials: string,
): Promise<MainAdminCard> {
  const empty: MainAdminCard = {
    seat,
    role: roleName,
    roleLabel,
    id: null,
    email: null,
    nom_complet: null,
    fonction: null,
    telephone: null,
    statut_compte: null,
    derniere_connexion: null,
    must_change_password: null,
    avatar_bucket: null,
    avatar_path: null,
    initials: fallbackInitials,
  };

  const { data: roleRow } = await supabase
    .from("roles" as never)
    .select("id")
    .eq("nom", roleName)
    .maybeSingle();

  const roleId = (roleRow as { id?: string } | null)?.id;
  if (!roleId) return empty;

  const { data: assignment } = await supabase
    .from("utilisateurs_roles" as never)
    .select("utilisateur_id")
    .eq("role_id", roleId)
    .limit(1)
    .maybeSingle();

  const userId = (assignment as { utilisateur_id?: string } | null)?.utilisateur_id;
  if (!userId) return empty;

  const { data: profile } = await supabase
    .from("profils_administrateurs" as never)
    .select(
      "id, email, nom_complet, fonction, telephone, statut_compte, derniere_connexion, must_change_password, avatar_bucket, avatar_path, actif",
    )
    .eq("id", userId)
    .maybeSingle();

  const row = profile as {
    id: string;
    email: string;
    nom_complet: string | null;
    fonction: string | null;
    telephone: string | null;
    statut_compte: string | null;
    derniere_connexion: string | null;
    must_change_password: boolean | null;
    avatar_bucket: string | null;
    avatar_path: string | null;
    actif: boolean | null;
  } | null;

  if (!row || row.actif === false) return empty;

  return {
    seat,
    role: roleName,
    roleLabel,
    id: row.id,
    email: row.email,
    nom_complet: row.nom_complet,
    fonction: row.fonction,
    telephone: row.telephone,
    statut_compte: row.statut_compte,
    derniere_connexion: row.derniere_connexion,
    must_change_password: row.must_change_password,
    avatar_bucket: row.avatar_bucket,
    avatar_path: row.avatar_path,
    initials: initialsFromName(row.nom_complet, fallbackInitials),
  };
}

export async function listMainAdministrators(
  supabase: SupabaseClient,
): Promise<{ direction: MainAdminCard; it: MainAdminCard }> {
  const [direction, it] = await Promise.all([
    loadSeat(
      supabase,
      PRINCIPAL_DIRECTION_ROLE,
      "direction",
      "Administrateur principal — Direction",
      "CS",
    ),
    loadSeat(
      supabase,
      PRINCIPAL_IT_ROLE,
      "it",
      "Administratrice principale — IT",
      "EM",
    ),
  ]);
  return { direction, it };
}
