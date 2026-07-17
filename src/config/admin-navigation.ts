export type AdminNavItem = {
  label: string;
  href: string;
  icon?: string;
};

export type AdminNavGroup = {
  label: string;
  items: AdminNavItem[];
};

export const adminNavigation: AdminNavGroup[] = [
  {
    label: "Tableau de bord",
    items: [{ label: "Vue d’ensemble", href: "/admin", icon: "LayoutDashboard" }],
  },
  {
    label: "Gestion des actions",
    items: [
      { label: "Programmes", href: "/admin/programmes", icon: "FolderKanban" },
      { label: "Projets", href: "/admin/projets", icon: "Briefcase" },
      { label: "Activités", href: "/admin/activites", icon: "ListChecks" },
      { label: "Bénéficiaires", href: "/admin/beneficiaires", icon: "Users" },
      {
        label: "Indicateurs et résultats",
        href: "/admin/indicateurs",
        icon: "Target",
      },
      {
        label: "Zones d’intervention",
        href: "/admin/zones-intervention",
        icon: "Map",
      },
    ],
  },
  {
    label: "Finances",
    items: [
      { label: "Budgets", href: "/admin/finances", icon: "Wallet" },
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
    label: "Communication",
    items: [
      { label: "Actualités", href: "/admin/actualites", icon: "Newspaper" },
      { label: "Médiathèque", href: "/admin/mediatheque", icon: "Images" },
      { label: "Newsletter", href: "/admin/newsletter", icon: "Mail" },
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
    label: "Organisation",
    items: [
      { label: "Équipe et RH", href: "/admin/equipe", icon: "UsersRound" },
      {
        label: "Départements",
        href: "/admin/departements",
        icon: "Building2",
      },
      { label: "Partenaires", href: "/admin/partenaires", icon: "Handshake" },
      { label: "Clusters", href: "/admin/clusters", icon: "Network" },
    ],
  },
  {
    label: "Demandes",
    items: [
      { label: "Messages", href: "/admin/messages", icon: "MessageSquare" },
      { label: "Adhésions", href: "/admin/adhesions", icon: "UserPlus" },
      { label: "Dons", href: "/admin/dons", icon: "Heart" },
    ],
  },
  {
    label: "Suivi et rapports",
    items: [
      {
        label: "Statistiques",
        href: "/admin/statistiques",
        icon: "BarChart3",
      },
      { label: "Rapports", href: "/admin/rapports", icon: "FileText" },
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
  {
    label: "Administration",
    items: [
      { label: "Utilisateurs", href: "/admin/utilisateurs", icon: "Shield" },
      { label: "Rôles et permissions", href: "/admin/roles", icon: "KeyRound" },
      { label: "Paramètres", href: "/admin/parametres", icon: "Settings" },
      {
        label: "Journal d’activité",
        href: "/admin/journal-activite",
        icon: "ScrollText",
      },
    ],
  },
];
