export type DocumentConfidentiality = "public" | "interne" | "restreint";

export type DocumentCentre = {
  id: string;
  titre: string;
  slug: string;
  description: string | null;
  type: string;
  categorie_id: string | null;
  fichier_storage_path: string;
  nom_fichier: string | null;
  type_mime: string | null;
  taille_octets: number | null;
  niveau_confidentialite: DocumentConfidentiality;
  publie: boolean;
  date_publication: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type DocumentCategory = {
  id: string;
  nom: string;
  slug: string;
  description: string | null;
};
