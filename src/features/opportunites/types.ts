export type OpportunityStatus =
  | "brouillon"
  | "ouverte"
  | "bientot_cloturee"
  | "cloturee"
  | "suspendue"
  | "pourvue";

export type Opportunity = {
  id: string;
  titre: string;
  slug: string;
  reference: string | null;
  type: string;
  departement: string | null;
  localisation: string | null;
  mode_travail: string | null;
  type_contrat: string | null;
  duree: string | null;
  description: string;
  responsabilites: string | null;
  profil_recherche: string | null;
  competences: string[];
  niveau_etudes: string | null;
  experience: string | null;
  conditions: string | null;
  pieces_requises: string[];
  methode_candidature: string;
  url_externe: string | null;
  email_candidature: string | null;
  date_publication: string | null;
  date_limite: string | null;
  statut: OpportunityStatus;
  publie: boolean;
  candidatures_spontanees_autorisees: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type ApplicationInput = {
  opportuniteId?: string;
  estSpontanee: boolean;
  prenom: string;
  nom: string;
  email: string;
  telephone?: string;
  localisation?: string;
  lettreMotivation: string;
  consentement: boolean;
};
