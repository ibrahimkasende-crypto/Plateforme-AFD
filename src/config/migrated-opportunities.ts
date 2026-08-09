import type { Opportunity } from "@/features/opportunites/types";

/**
 * Offre migrée depuis afd-rdc.org — champs uniquement vérifiés.
 * Document PDF scanné : non retranscrit en texte.
 */
export const MAMBASA_OPPORTUNITY_SLUG = "chef-de-projet-base-a-mambasa";

export const MAMBASA_DOCUMENT = {
  originalFilename:
    "1784241669013-offre-afd-chef-de-projet-et-officier-sante-nutrition.pdf",
  publicFilename: "chef-projet-mambasa-afd.pdf",
  /** Copie servie par Next (document déjà public sur l’ancien site). */
  publicPath:
    "/documents/offres/chef-de-projet-mambasa/chef-projet-mambasa-afd.pdf",
  sourceUrl: null,
  mimeType: "application/pdf",
  sizeBytes: 7_858_560,
} as const;

export const MIGRATED_OPPORTUNITIES: Opportunity[] = [
  {
    id: "2bac6964-f1be-4069-8b56-783dd57fb093",
    titre:
      "Chef de projet basé à MAMBASA et Officier Santé nutrition basé aussi à MAMBASA",
    slug: MAMBASA_OPPORTUNITY_SLUG,
    reference: null,
    type: "emploi",
    departement: null,
    localisation: "MAMBASA",
    mode_travail: null,
    type_contrat: null,
    duree: null,
    description:
      "Recrutement des postes : Chef de projet basé à MAMBASA et Officier Santé nutrition basé aussi à MAMBASA. Consultez le document officiel de l’offre pour le détail des missions et du profil.",
    responsabilites: null,
    profil_recherche: null,
    competences: [],
    niveau_etudes: null,
    experience: null,
    conditions: null,
    pieces_requises: [],
    methode_candidature: "formulaire",
    url_externe: null,
    email_candidature: "ressourceshumainesafd871@gmail.com",
    date_publication: "2026-07-16T22:56:18.063+00:00",
    date_limite: null,
    // Offre expirée — retirée du site public (accueil, liste, candidature).
    statut: "cloturee",
    publie: false,
    candidatures_spontanees_autorisees: false,
    created_at: "2026-07-16T22:42:05.55553+00:00",
    updated_at: "2026-08-03T00:00:00.000+00:00",
    deleted_at: null,
  },
];

export function getMigratedOpportunityBySlug(
  slug: string,
): Opportunity | null {
  const item =
    MIGRATED_OPPORTUNITIES.find((entry) => entry.slug === slug) ?? null;
  if (!item || !item.publie || item.deleted_at) return null;
  return item;
}

export function getMigratedOpenOpportunities(limit = 3): Opportunity[] {
  return MIGRATED_OPPORTUNITIES.filter(
    (item) =>
      item.publie &&
      !item.deleted_at &&
      (item.statut === "ouverte" || item.statut === "bientot_cloturee"),
  ).slice(0, limit);
}

export function getOpportunityDocumentUrl(slug: string): string | null {
  if (slug === MAMBASA_OPPORTUNITY_SLUG) return MAMBASA_DOCUMENT.publicPath;
  return null;
}
