import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function write(rel, content) {
  const full = path.join(root, rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content, "utf8");
  console.log("W", rel);
}

function placeholderPage(title, description, crumbs) {
  return `import { ModulePlaceholder } from "@/components/shared/ModulePlaceholder";

export default function Page() {
  return (
    <ModulePlaceholder
      title=${JSON.stringify(title)}
      description=${JSON.stringify(description)}
      breadcrumbs={${JSON.stringify(crumbs, null, 6)}}
    />
  );
}
`;
}

function adminPlaceholder(title, description) {
  return `import { ModulePlaceholder } from "@/components/shared/ModulePlaceholder";

export default function Page() {
  return (
    <ModulePlaceholder
      title=${JSON.stringify(title)}
      description=${JSON.stringify(description)}
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: ${JSON.stringify(title)} },
      ]}
      eyebrow="Administration"
    />
  );
}
`;
}

const publicPages = [
  [
    "src/app/(public)/qui-sommes-nous/page.tsx",
    "Présentation de l’AFD",
    "Découvrez l’Alliance des Femmes pour le Développement, son identité institutionnelle et son ancrage en RDC.",
    [
      { label: "Accueil", href: "/" },
      { label: "Qui sommes-nous" },
    ],
  ],
  [
    "src/app/(public)/qui-sommes-nous/histoire/page.tsx",
    "Notre histoire",
    "Le parcours institutionnel de l’AFD.",
    [
      { label: "Accueil", href: "/" },
      { label: "Qui sommes-nous", href: "/qui-sommes-nous" },
      { label: "Notre histoire" },
    ],
  ],
  [
    "src/app/(public)/qui-sommes-nous/mission-vision-valeurs/page.tsx",
    "Mission, vision et valeurs",
    "Les fondements stratégiques de l’AFD.",
    [
      { label: "Accueil", href: "/" },
      { label: "Qui sommes-nous", href: "/qui-sommes-nous" },
      { label: "Mission, vision et valeurs" },
    ],
  ],
  [
    "src/app/(public)/qui-sommes-nous/gouvernance/page.tsx",
    "Gouvernance",
    "Les instances de direction et de contrôle de l’AFD.",
    [
      { label: "Accueil", href: "/" },
      { label: "Qui sommes-nous", href: "/qui-sommes-nous" },
      { label: "Gouvernance" },
    ],
  ],
  [
    "src/app/(public)/qui-sommes-nous/equipe/page.tsx",
    "Équipe",
    "Les équipes et profils de l’AFD.",
    [
      { label: "Accueil", href: "/" },
      { label: "Qui sommes-nous", href: "/qui-sommes-nous" },
      { label: "Équipe" },
    ],
  ],
  [
    "src/app/(public)/qui-sommes-nous/organigramme/page.tsx",
    "Organigramme",
    "La structure organisationnelle de l’AFD.",
    [
      { label: "Accueil", href: "/" },
      { label: "Qui sommes-nous", href: "/qui-sommes-nous" },
      { label: "Organigramme" },
    ],
  ],
  [
    "src/app/(public)/qui-sommes-nous/politiques-engagements/page.tsx",
    "Politiques et engagements",
    "Les politiques institutionnelles et engagements de l’AFD.",
    [
      { label: "Accueil", href: "/" },
      { label: "Qui sommes-nous", href: "/qui-sommes-nous" },
      { label: "Politiques et engagements" },
    ],
  ],
  [
    "src/app/(public)/actions/page.tsx",
    "Nos actions",
    "Programmes, projets et réponses opérationnelles de l’AFD.",
    [
      { label: "Accueil", href: "/" },
      { label: "Nos actions" },
    ],
  ],
  [
    "src/app/(public)/actions/domaines-intervention/page.tsx",
    "Domaines d’intervention",
    "Les secteurs d’intervention de l’AFD.",
    [
      { label: "Accueil", href: "/" },
      { label: "Nos actions", href: "/actions" },
      { label: "Domaines d’intervention" },
    ],
  ],
  [
    "src/app/(public)/actions/programmes/page.tsx",
    "Programmes",
    "Les programmes institutionnels de l’AFD.",
    [
      { label: "Accueil", href: "/" },
      { label: "Nos actions", href: "/actions" },
      { label: "Programmes" },
    ],
  ],
  [
    "src/app/(public)/actions/programmes/[slug]/page.tsx",
    "Détail du programme",
    "Fiche détaillée d’un programme AFD.",
    [
      { label: "Accueil", href: "/" },
      { label: "Nos actions", href: "/actions" },
      { label: "Programmes", href: "/actions/programmes" },
      { label: "Détail" },
    ],
  ],
  [
    "src/app/(public)/actions/projets/page.tsx",
    "Projets",
    "Les projets mis en œuvre par l’AFD.",
    [
      { label: "Accueil", href: "/" },
      { label: "Nos actions", href: "/actions" },
      { label: "Projets" },
    ],
  ],
  [
    "src/app/(public)/actions/projets/[slug]/page.tsx",
    "Détail du projet",
    "Fiche détaillée d’un projet AFD.",
    [
      { label: "Accueil", href: "/" },
      { label: "Nos actions", href: "/actions" },
      { label: "Projets", href: "/actions/projets" },
      { label: "Détail" },
    ],
  ],
  [
    "src/app/(public)/actions/urgences/page.tsx",
    "Réponses d’urgence",
    "Les interventions d’urgence de l’AFD.",
    [
      { label: "Accueil", href: "/" },
      { label: "Nos actions", href: "/actions" },
      { label: "Réponses d’urgence" },
    ],
  ],
  [
    "src/app/(public)/actions/zones-intervention/page.tsx",
    "Zones d’intervention",
    "Les territoires d’intervention de l’AFD.",
    [
      { label: "Accueil", href: "/" },
      { label: "Nos actions", href: "/actions" },
      { label: "Zones d’intervention" },
    ],
  ],
  [
    "src/app/(public)/actions/clusters/page.tsx",
    "Clusters et groupes de travail",
    "La participation de l’AFD aux clusters et groupes de travail.",
    [
      { label: "Accueil", href: "/" },
      { label: "Nos actions", href: "/actions" },
      { label: "Clusters" },
    ],
  ],
  [
    "src/app/(public)/impact/page.tsx",
    "Notre impact",
    "Chiffres clés et résultats de l’AFD — contenus en cours de structuration.",
    [
      { label: "Accueil", href: "/" },
      { label: "Notre impact" },
    ],
  ],
  [
    "src/app/(public)/impact/resultats/page.tsx",
    "Résultats",
    "Les résultats et indicateurs consolidés.",
    [
      { label: "Accueil", href: "/" },
      { label: "Notre impact", href: "/impact" },
      { label: "Résultats" },
    ],
  ],
  [
    "src/app/(public)/impact/histoires/page.tsx",
    "Histoires d’impact",
    "Récits d’impact issus des interventions de l’AFD.",
    [
      { label: "Accueil", href: "/" },
      { label: "Notre impact", href: "/impact" },
      { label: "Histoires d’impact" },
    ],
  ],
  [
    "src/app/(public)/impact/histoires/[slug]/page.tsx",
    "Histoire d’impact",
    "Détail d’une histoire d’impact.",
    [
      { label: "Accueil", href: "/" },
      { label: "Notre impact", href: "/impact" },
      { label: "Histoires", href: "/impact/histoires" },
      { label: "Détail" },
    ],
  ],
  [
    "src/app/(public)/impact/temoignages/page.tsx",
    "Témoignages",
    "Témoignages liés aux actions de l’AFD.",
    [
      { label: "Accueil", href: "/" },
      { label: "Notre impact", href: "/impact" },
      { label: "Témoignages" },
    ],
  ],
  [
    "src/app/(public)/impact/rapports/page.tsx",
    "Rapports et publications",
    "Rapports institutionnels et publications.",
    [
      { label: "Accueil", href: "/" },
      { label: "Notre impact", href: "/impact" },
      { label: "Rapports" },
    ],
  ],
  [
    "src/app/(public)/actualites/page.tsx",
    "Actualités",
    "Les actualités institutionnelles de l’AFD.",
    [
      { label: "Accueil", href: "/" },
      { label: "Actualités" },
    ],
  ],
  [
    "src/app/(public)/actualites/[slug]/page.tsx",
    "Actualité",
    "Détail d’une actualité.",
    [
      { label: "Accueil", href: "/" },
      { label: "Actualités", href: "/actualites" },
      { label: "Détail" },
    ],
  ],
  [
    "src/app/(public)/ressources/page.tsx",
    "Ressources",
    "Médiathèque, documents et opportunités.",
    [
      { label: "Accueil", href: "/" },
      { label: "Ressources" },
    ],
  ],
  [
    "src/app/(public)/ressources/mediatheque/page.tsx",
    "Médiathèque",
    "Galerie et ressources multimédias.",
    [
      { label: "Accueil", href: "/" },
      { label: "Ressources", href: "/ressources" },
      { label: "Médiathèque" },
    ],
  ],
  [
    "src/app/(public)/ressources/documents/page.tsx",
    "Documents",
    "Documents institutionnels téléchargeables.",
    [
      { label: "Accueil", href: "/" },
      { label: "Ressources", href: "/ressources" },
      { label: "Documents" },
    ],
  ],
  [
    "src/app/(public)/ressources/appels-offres/page.tsx",
    "Appels d’offres",
    "Appels d’offres et consultations.",
    [
      { label: "Accueil", href: "/" },
      { label: "Ressources", href: "/ressources" },
      { label: "Appels d’offres" },
    ],
  ],
  [
    "src/app/(public)/ressources/opportunites/page.tsx",
    "Opportunités",
    "Opportunités de collaboration et recrutement.",
    [
      { label: "Accueil", href: "/" },
      { label: "Ressources", href: "/ressources" },
      { label: "Opportunités" },
    ],
  ],
  [
    "src/app/(public)/ressources/newsletter/page.tsx",
    "Newsletter",
    "Inscription et informations sur la newsletter AFD.",
    [
      { label: "Accueil", href: "/" },
      { label: "Ressources", href: "/ressources" },
      { label: "Newsletter" },
    ],
  ],
  [
    "src/app/(public)/contact/page.tsx",
    "Contact",
    "Contacter l’Alliance des Femmes pour le Développement.",
    [
      { label: "Accueil", href: "/" },
      { label: "Contact" },
    ],
  ],
  [
    "src/app/(public)/adhesion/page.tsx",
    "Nous rejoindre",
    "Adhésion et engagement auprès de l’AFD.",
    [
      { label: "Accueil", href: "/" },
      { label: "Nous rejoindre" },
    ],
  ],
  [
    "src/app/(public)/soutenir/page.tsx",
    "Soutenir l’AFD",
    "Soutenir les actions de l’AFD. Les paiements SerdiPay seront activés après configuration officielle.",
    [
      { label: "Accueil", href: "/" },
      { label: "Soutenir l’AFD" },
    ],
  ],
  [
    "src/app/(public)/mentions-legales/page.tsx",
    "Mentions légales",
    "Informations légales de la plateforme.",
    [
      { label: "Accueil", href: "/" },
      { label: "Mentions légales" },
    ],
  ],
  [
    "src/app/(public)/politique-confidentialite/page.tsx",
    "Politique de confidentialité",
    "Traitement des données personnelles.",
    [
      { label: "Accueil", href: "/" },
      { label: "Politique de confidentialité" },
    ],
  ],
];

for (const [file, title, description, crumbs] of publicPages) {
  write(file, placeholderPage(title, description, crumbs));
}

const adminPages = [
  ["programmes", "Programmes", "Gestion des programmes institutionnels."],
  ["projets", "Projets", "Gestion des projets."],
  ["activites", "Activités", "Suivi des activités opérationnelles."],
  ["beneficiaires", "Bénéficiaires", "Gestion des bénéficiaires."],
  ["indicateurs", "Indicateurs et résultats", "Suivi MEAL et indicateurs."],
  ["zones-intervention", "Zones d’intervention", "Territoires d’intervention."],
  ["finances", "Finances", "Budgets, dépenses et suivi financier."],
  ["actualites", "Actualités", "Gestion éditoriale des actualités."],
  ["mediatheque", "Médiathèque", "Gestion des médias."],
  ["newsletter", "Newsletter", "Pilotage de la newsletter."],
  ["newsletter/abonnes", "Abonnés newsletter", "Liste et segments des abonnés."],
  ["newsletter/campagnes", "Campagnes newsletter", "Création et suivi des campagnes."],
  ["newsletter/modeles", "Modèles newsletter", "Modèles d’emails."],
  ["newsletter/segments", "Segments newsletter", "Segmentation des audiences."],
  ["newsletter/statistiques", "Statistiques newsletter", "Indicateurs d’engagement."],
  ["messages", "Messages", "Messages reçus via le formulaire de contact."],
  ["adhesions", "Adhésions", "Demandes d’adhésion."],
  ["dons", "Dons", "Vue d’ensemble des dons."],
  ["dons/intentions", "Intentions de dons", "Intentions de don enregistrées."],
  ["dons/transactions", "Transactions", "Transactions de paiement."],
  ["dons/remboursements", "Remboursements", "Suivi des remboursements."],
  ["partenaires", "Partenaires", "Gestion des partenaires."],
  ["clusters", "Clusters", "Clusters et groupes de travail."],
  ["equipe", "Équipe et RH", "Gestion de l’équipe."],
  ["departements", "Départements", "Structure organisationnelle."],
  ["statistiques", "Statistiques", "Tableaux de bord analytiques."],
  ["rapports", "Rapports", "Génération et suivi des rapports."],
  ["rapports/nouveau", "Nouveau rapport", "Création d’un rapport."],
  ["rapports/modeles", "Modèles de rapports", "Bibliothèque de modèles."],
  ["rapports/historique", "Historique des rapports", "Rapports générés."],
  ["utilisateurs", "Utilisateurs", "Gestion des comptes."],
  ["roles", "Rôles et permissions", "Administration des rôles."],
  ["parametres", "Paramètres", "Paramètres du site."],
  ["journal-activite", "Journal d’activité", "Audit et traçabilité."],
];

for (const [slug, title, description] of adminPages) {
  write(`src/app/admin/${slug}/page.tsx`, adminPlaceholder(title, description));
}

console.log("Pages generated:", publicPages.length + adminPages.length);
