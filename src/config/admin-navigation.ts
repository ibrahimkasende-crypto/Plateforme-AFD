export type AdminNavBadgeKey =
  | "newsletter"
  | "messages"
  | "adhesions"
  | "notifications";

export type AdminNavItem = {
  label: string;
  href: string;
  icon?: string;
  badgeKey?: AdminNavBadgeKey;
};

export type AdminNavGroup = {
  label: string;
  items: AdminNavItem[];
};

/** Menu plat aligné sur la maquette administrative AFD. */
export const adminSidebarItems: AdminNavItem[] = [
  { label: "Tableau de bord", href: "/admin", icon: "LayoutDashboard" },
  { label: "Programmes", href: "/admin/programmes", icon: "FolderKanban" },
  { label: "Projets", href: "/admin/projets", icon: "Briefcase" },
  { label: "Activités", href: "/admin/activites", icon: "ListChecks" },
  { label: "Bénéficiaires", href: "/admin/beneficiaires", icon: "Users" },
  {
    label: "Indicateurs et résultats",
    href: "/admin/indicateurs",
    icon: "Target",
  },
  { label: "Finances", href: "/admin/finances", icon: "Wallet" },
  {
    label: "Carte des interventions",
    href: "/admin/zones-intervention",
    icon: "Map",
  },
  { label: "Actualités", href: "/admin/actualites", icon: "Newspaper" },
  { label: "Médiathèque", href: "/admin/mediatheque", icon: "Images" },
  {
    label: "Newsletter",
    href: "/admin/newsletter",
    icon: "Mail",
    badgeKey: "newsletter",
  },
  {
    label: "Demandes et messages",
    href: "/admin/messages",
    icon: "MessageSquare",
    badgeKey: "messages",
  },
  { label: "Partenaires", href: "/admin/partenaires", icon: "Handshake" },
  { label: "Équipe et RH", href: "/admin/equipe", icon: "UsersRound" },
  { label: "Opportunités", href: "/admin/opportunites", icon: "Briefcase" },
  { label: "Candidatures", href: "/admin/candidatures", icon: "FileText" },
  { label: "Documents", href: "/admin/documents", icon: "FolderKanban" },
  { label: "Rapports", href: "/admin/rapports", icon: "FileText" },
  {
    label: "Utilisateurs et rôles",
    href: "/admin/utilisateurs",
    icon: "Shield",
  },
  { label: "Paramètres", href: "/admin/parametres", icon: "Settings" },
  {
    label: "Journal d’activité",
    href: "/admin/journal-activite",
    icon: "ScrollText",
  },
];

/** Navigation groupée (modules détaillés / sous-pages). */
export const adminNavigation: AdminNavGroup[] = [
  {
    label: "Principal",
    items: adminSidebarItems,
  },
  {
    label: "Finances détaillées",
    items: [
      {
        label: "Intentions de dons",
        href: "/admin/dons/intentions",
        icon: "HeartHandshake",
      },
      {
        label: "Transactions",
        href: "/admin/dons/transactions",
        icon: "CreditCard",
      },
      {
        label: "Remboursements",
        href: "/admin/dons/remboursements",
        icon: "RotateCcw",
      },
    ],
  },
  {
    label: "Newsletter",
    items: [
      {
        label: "Abonnés",
        href: "/admin/newsletter/abonnes",
        icon: "UserRound",
      },
      {
        label: "Campagnes",
        href: "/admin/newsletter/campagnes",
        icon: "Send",
      },
    ],
  },
  {
    label: "Rapports",
    items: [
      {
        label: "Nouveau rapport",
        href: "/admin/rapports/nouveau",
        icon: "FilePlus",
      },
      {
        label: "Modèles",
        href: "/admin/rapports/modeles",
        icon: "Files",
      },
      {
        label: "Historique",
        href: "/admin/rapports/historique",
        icon: "History",
      },
    ],
  },
];
