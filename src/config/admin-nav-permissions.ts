import type { Permission } from "@/config/permissions";

/**
 * Permission minimale pour afficher un lien de la sidebar admin.
 * Les routes restent protégées côté serveur via requireAdmin / requirePermission.
 */
export const adminNavPermissions: Record<string, Permission | Permission[]> = {
  "/admin": "dashboard:read",
  "/admin/programmes": "programmes:read",
  "/admin/projets": "projets:read",
  "/admin/activites": "activites:read",
  "/admin/beneficiaires": "beneficiaires:read",
  "/admin/indicateurs": "indicateurs:read",
  "/admin/finances": "finances:read",
  "/admin/zones-intervention": "projets:read",
  "/admin/actualites": "actualites:read",
  "/admin/mediatheque": "mediatheque:read",
  "/admin/newsletter": "newsletter:read",
  "/admin/newsletter/abonnes": "newsletter:read",
  "/admin/newsletter/campagnes": "newsletter:read",
  "/admin/messages": "messages:read",
  "/admin/adhesions": "adhesions:read",
  "/admin/dons": "dons:read",
  "/admin/dons/intentions": "dons:read",
  "/admin/dons/transactions": "payments:read",
  "/admin/dons/remboursements": "payments:manage",
  "/admin/partenaires": "partenaires:read",
  "/admin/equipe": "equipe:read",
  "/admin/departements": "equipe:read",
  "/admin/clusters": "partenaires:read",
  "/admin/statistiques": "statistiques:read",
  "/admin/rapports": "rapports:read",
  "/admin/rapports/nouveau": "rapports:write",
  "/admin/rapports/modeles": "rapports:read",
  "/admin/rapports/historique": "rapports:read",
  "/admin/utilisateurs": "utilisateurs:read",
  "/admin/roles": "roles:manage",
  "/admin/parametres": "parametres:manage",
  "/admin/journal-activite": "journal:read",
};

export function navItemAllowed(
  href: string,
  has: (permission: Permission) => boolean,
): boolean {
  const required = adminNavPermissions[href];
  if (!required) return true;
  if (Array.isArray(required)) {
    return required.some((permission) => has(permission));
  }
  return has(required);
}
