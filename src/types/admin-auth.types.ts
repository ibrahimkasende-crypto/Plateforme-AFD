/**
 * Types RBAC admin — alignés sur les migrations 20260715 / 20260718.
 * Complément à database.types.ts tant que les types générés ne sont pas régénérés.
 */

export type ProfilAdministrateur = {
  id: string;
  nom_complet: string | null;
  email: string;
  photo_url: string | null;
  actif: boolean;
  derniere_connexion: string | null;
  created_at: string;
  updated_at: string;
};

export type RoleRow = {
  id: string;
  nom: string;
  description: string | null;
};

export type JournalActiviteInsert = {
  utilisateur_id?: string | null;
  action: string;
  details?: Record<string, unknown>;
};
