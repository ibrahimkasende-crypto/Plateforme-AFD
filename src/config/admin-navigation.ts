import type { Permission } from "@/config/permissions";

export type AdminNavBadgeKey =
  | "newsletter"
  | "messages"
  | "adhesions"
  | "notifications";

export type AdminNavItem = {
  label: string;
  href: string;
  badgeKey?: AdminNavBadgeKey;
};

export type AdminNavGroupDef = {
  id: string;
  label: string;
  icon: string;
  items: AdminNavItem[];
  /** Lien direct sans sous-éléments (ex. tableau de bord). */
  href?: string;
  permissionGate?: Permission | Permission[];
};

export const adminNavGroups: AdminNavGroupDef[] = [
  {
    id: "dashboard",
    label: "Tableau de bord",
    icon: "LayoutDashboard",
    href: "/admin",
    items: [],
  },
  {
    id: "operations",
    label: "Opérations",
    icon: "FolderKanban",
    items: [
      { label: "Programmes", href: "/admin/programmes" },
      { label: "Projets", href: "/admin/projets" },
      { label: "Activités", href: "/admin/activites" },
      { label: "Zones d'intervention", href: "/admin/zones-intervention" },
      { label: "Urgences", href: "/admin/urgences" },
      { label: "Clusters", href: "/admin/clusters" },
      { label: "Stocks", href: "/admin/stocks" },
      { label: "Logistique", href: "/admin/logistique" },
    ],
  },
  {
    id: "suivi-impact",
    label: "Suivi et impact",
    icon: "Target",
    items: [
      { label: "Bénéficiaires", href: "/admin/beneficiaires" },
      { label: "Indicateurs et résultats", href: "/admin/indicateurs" },
      { label: "Enquêtes", href: "/admin/enquetes" },
      { label: "Histoires d'impact", href: "/admin/histoires-impact" },
      { label: "Témoignages", href: "/admin/temoignages" },
    ],
  },
  {
    id: "communication",
    label: "Communication",
    icon: "Newspaper",
    items: [
      { label: "Actualités", href: "/admin/actualites" },
      { label: "Médiathèque", href: "/admin/mediatheque" },
      { label: "Newsletter", href: "/admin/newsletter", badgeKey: "newsletter" },
      { label: "Pages publiques", href: "/admin/publications/pages" },
    ],
  },
  {
    id: "engagement",
    label: "Engagement",
    icon: "MessageSquare",
    items: [
      { label: "Messages", href: "/admin/messages", badgeKey: "messages" },
      { label: "Adhésions", href: "/admin/adhesions", badgeKey: "adhesions" },
      { label: "Partenariats", href: "/admin/partenariats" },
      { label: "Dons", href: "/admin/dons" },
      { label: "Opportunités", href: "/admin/opportunites" },
      { label: "Candidatures", href: "/admin/candidatures" },
      { label: "Appels d'offres", href: "/admin/appels-offres" },
    ],
  },
  {
    id: "organisation",
    label: "Organisation",
    icon: "UsersRound",
    items: [
      { label: "Partenaires", href: "/admin/partenaires" },
      { label: "Équipe publique", href: "/admin/equipe" },
      { label: "Tableau de bord RH", href: "/admin/rh" },
      { label: "Personnel", href: "/admin/rh/personnel" },
      { label: "Départements et postes", href: "/admin/rh/departements" },
      { label: "Recrutement", href: "/admin/rh/recrutement" },
      { label: "Présences", href: "/admin/rh/presences" },
      { label: "Congés", href: "/admin/rh/conges" },
      { label: "Performance", href: "/admin/rh/performance" },
      { label: "Formation", href: "/admin/rh/formations" },
      { label: "Paie", href: "/admin/rh/paie" },
      { label: "Utilisateurs et accès", href: "/admin/utilisateurs" },
      { label: "Invitations", href: "/admin/invitations" },
      { label: "Périmètres d'accès", href: "/admin/acces" },
      { label: "Agents terrain", href: "/admin/agents" },
    ],
  },
  {
    id: "finances",
    label: "Finances",
    icon: "Wallet",
    permissionGate: "finances:read",
    items: [
      { label: "Vue d'ensemble", href: "/admin/finances" },
      { label: "Budgets", href: "/admin/finances/budgets" },
      { label: "Dépenses", href: "/admin/finances/depenses" },
      { label: "Transactions", href: "/admin/finances/transactions" },
    ],
  },
  {
    id: "rapports-documents",
    label: "Rapports et documents",
    icon: "FileText",
    items: [
      { label: "Rapports", href: "/admin/rapports" },
      { label: "Documents", href: "/admin/documents" },
      { label: "Import intelligent", href: "/admin/import-intelligent" },
      { label: "Générateur", href: "/admin/rapports/nouveau" },
      { label: "Exports", href: "/admin/exports" },
    ],
  },
  {
    id: "administration",
    label: "Administration",
    icon: "Shield",
    permissionGate: ["journal:read", "parametres:manage", "utilisateurs:write"],
    items: [
      { label: "Journal d'activité", href: "/admin/journal-activite" },
      { label: "Sessions", href: "/admin/securite/sessions" },
      { label: "Sécurité", href: "/admin/securite" },
      { label: "Mon profil", href: "/admin/mon-profil" },
      { label: "Sauvegardes", href: "/admin/sauvegardes" },
      { label: "Santé du système", href: "/admin/systeme" },
    ],
  },
];

/** Liste plate dérivée des groupes — résolution de titre dans l'en-tête admin. */
export const adminSidebarItems: AdminNavItem[] = adminNavGroups.flatMap((group) => {
  if (group.href) {
    return [{ label: group.label, href: group.href }];
  }
  return group.items;
});

export function resolveAdminNavTitle(pathname: string): string {
  const sorted = [...adminSidebarItems].sort((a, b) => b.href.length - a.href.length);
  const match = sorted.find((item) =>
    item.href === "/admin"
      ? pathname === "/admin"
      : pathname === item.href || pathname.startsWith(`${item.href}/`),
  );
  return match?.label ?? "Administration";
}

export function navGroupAllowed(
  group: AdminNavGroupDef,
  has: (permission: Permission) => boolean,
): boolean {
  if (!group.permissionGate) return true;
  if (Array.isArray(group.permissionGate)) {
    return group.permissionGate.some((permission) => has(permission));
  }
  return has(group.permissionGate);
}
