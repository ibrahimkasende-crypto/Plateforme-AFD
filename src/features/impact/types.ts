export type ConsentStatus =
  | "approved"
  | "to-review"
  | "not-required"
  | "refused"
  | "absent";

export type PublicationStatus =
  | "brouillon"
  | "en_revision"
  | "approuve"
  | "programme"
  | "publie"
  | "depublie"
  | "archive";

export type HistoireImpact = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string | null;
  image_url: string | null;
  media_id: string | null;
  person_or_community: string | null;
  anonymized: boolean;
  consent_status: ConsentStatus;
  location: string | null;
  programme_id: string | null;
  projet_id: string | null;
  quote: string | null;
  results: string | null;
  author: string | null;
  status: PublicationStatus;
  featured: boolean;
  seo_title: string | null;
  seo_description: string | null;
  published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type Temoignage = {
  id: string;
  slug: string | null;
  display_name: string;
  anonymized: boolean;
  role_or_profile: string | null;
  quote: string;
  image_url: string | null;
  media_id: string | null;
  projet_id: string | null;
  province: string | null;
  consent_status: ConsentStatus;
  active: boolean;
  publie: boolean;
  order_index: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};
