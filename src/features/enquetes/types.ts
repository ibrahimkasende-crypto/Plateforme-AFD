export type EnqueteStatut = "brouillon" | "publiee" | "cloturee" | "archivee";
export type EnqueteVisibilite = "publique" | "privee" | "agents";

export type Enquete = {
  id: string;
  titre: string;
  slug: string;
  description: string | null;
  statut: EnqueteStatut;
  visibilite: EnqueteVisibilite;
  date_ouverture: string | null;
  date_cloture: string | null;
  projet_id: string | null;
  province: string | null;
  consentement_requis: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type QuestionEnquete = {
  id: string;
  enquete_id: string;
  type_question: string;
  libelle: string;
  aide: string | null;
  obligatoire: boolean;
  ordre: number;
  configuration: Record<string, unknown>;
};

export type OptionQuestion = {
  id: string;
  question_id: string;
  libelle: string;
  valeur: string;
  ordre: number;
};
