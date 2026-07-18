export type AppelOffreStatut =
  | "brouillon"
  | "ouvert"
  | "cloture"
  | "suspendu"
  | "archive";

export type AppelOffre = {
  id: string;
  titre: string;
  slug: string;
  resume: string | null;
  description: string | null;
  procedure: string | null;
  contact_email: string | null;
  localisation: string | null;
  date_publication: string | null;
  date_limite: string | null;
  statut: AppelOffreStatut;
  publie: boolean;
  document_principal_path: string | null;
  seo_title: string | null;
  seo_description: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type AppelOffreDocument = {
  id: string;
  appel_offre_id: string;
  titre: string;
  storage_path: string;
  filename: string | null;
  mime_type: string | null;
  order_index: number;
  created_at: string;
};
