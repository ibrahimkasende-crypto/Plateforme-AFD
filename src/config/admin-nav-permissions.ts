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
  "/admin/activites/nouvelle": "activites:write",
  "/admin/zones-intervention": "projets:read",
  "/admin/zones-intervention/nouvelle": "programmes:write",
  "/admin/urgences": "urgences:read",
  "/admin/urgences/nouvelle": "urgences:write",
  "/admin/clusters": "clusters:read",
  "/admin/stocks": "ocr.view",
  "/admin/logistique": "ocr.view",
  "/admin/beneficiaires": "beneficiaires:read",
  "/admin/beneficiaires/nouveau": "beneficiaires:write",
  "/admin/indicateurs": "indicateurs:read",
  "/admin/resultats": "indicateurs:read",
  "/admin/enquetes": "enquetes:read",
  "/admin/enquetes/nouvelle": "enquetes:write",
  "/admin/histoires-impact": "histoires:read",
  "/admin/temoignages": "histoires:read",
  "/admin/actualites": "actualites:read",
  "/admin/publications": "actualites:read",
  "/admin/publications/pages": "pages:write",
  "/admin/mediatheque": "mediatheque:read",
  "/admin/newsletter": "newsletter:read",
  "/admin/newsletter/abonnes": "newsletter:read",
  "/admin/newsletter/campagnes": "newsletter:read",
  "/admin/newsletter/campagnes/nouvelle": "newsletter:write",
  "/admin/newsletter/modeles": "newsletter:read",
  "/admin/newsletter/segments": "newsletter:read",
  "/admin/newsletter/statistiques": "newsletter:read",
  "/admin/messages": "messages:read",
  "/admin/adhesions": "adhesions:read",
  "/admin/partenariats": "partenaires:read",
  "/admin/dons": "dons:read",
  "/admin/dons/intentions": "dons:read",
  "/admin/dons/transactions": "payments:read",
  "/admin/dons/remboursements": "payments:manage",
  "/admin/opportunites": "opportunites:read",
  "/admin/opportunites/nouvelle": "opportunites:write",
  "/admin/candidatures": "candidatures:read",
  "/admin/appels-offres": "appels-offres:read",
  "/admin/partenaires": "partenaires:read",
  "/admin/equipe": "equipe:read",
  "/admin/departements": "equipe:read",
  "/admin/utilisateurs": "utilisateurs:read",
  "/admin/agents": "agents:read",
  "/admin/agents/nouveau": "agents:write",
  "/admin/finances": "finances:read",
  "/admin/finances/budgets": "finances:read",
  "/admin/finances/depenses": "finances:read",
  "/admin/finances/transactions": ["finances:read", "payments:read"],
  "/admin/rapports": "rapports:read",
  "/admin/rapports/nouveau": "rapports:write",
  "/admin/rapports/modeles": "rapports:read",
  "/admin/rapports/historique": "rapports:read",
  "/admin/documents": "documents:read",
  "/admin/documents/nouveau": "documents:write",
  "/admin/import-intelligent": "ocr.view",
  "/admin/import-intelligent/nouveau": "ocr.upload",
  "/admin/import-intelligent/modeles": "ocr.manage_models",
  "/admin/import-intelligent/regles": "ocr.manage_rules",
  "/admin/import-intelligent/file-attente": "ocr.process",
  "/admin/exports": "rapports:export",
  "/admin/statistiques": "statistiques:read",
  "/admin/roles": "roles:manage",
  "/admin/permissions": "roles:manage",
  "/admin/parametres": "parametres:manage",
  "/admin/journal-activite": "journal:read",
  "/admin/securite": ["parametres:manage", "utilisateurs:write"],
  "/admin/sauvegardes": "parametres:manage",
  "/admin/systeme": "parametres:manage",
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
