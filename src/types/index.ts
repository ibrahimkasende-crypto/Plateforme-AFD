export interface Program {
  id: string;
  title: string;
  slug: string;
  description: string;
  long_description: string;
  icon: string;
  color: string;
  /** URL d'image optionnelle — si absente, une image de démonstration est utilisée */
  image_url?: string;
  order: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  program_id: string;
  title: string;
  slug: string;
  description: string;
  location: string;
  status: 'en_cours' | 'termine' | 'futur';
  start_date: string;
  end_date?: string;
  budget?: number;
  beneficiaries?: number;
  results?: string;
  image_url?: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface News {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: 'article' | 'communique' | 'evenement';
  image_url?: string;
  published: boolean;
  published_at?: string;
  author: string;
  created_at: string;
  updated_at: string;
}

export interface Member {
  id: string;
  full_name: string;
  gender: 'homme' | 'femme' | 'autre';
  email: string;
  phone: string;
  address: string;
  motivation: string;
  member_type: 'adherent' | 'sympathisant';
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  description?: string;
  media_type: 'photo' | 'video';
  media_url: string;
  thumbnail_url?: string;
  program_id?: string;
  project_id?: string;
  active: boolean;
  created_at: string;
}

export interface Contact {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export interface Donation {
  donor_name: string;
  donor_email: string;
  donor_phone?: string;
  amount: number;
  currency: 'USD' | 'CDF';
  payment_method: 'mobile_money' | 'card';
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  description: string;
  gender: 'homme' | 'femme';
  photo_url?: string;
  order: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Partner {
  id: string;
  name: string;
  logo_url?: string;
  category: 'international' | 'gouvernement' | 'ong' | 'privé';
  order: number;
  active: boolean;
  created_at: string;
}

export interface Cluster {
  id: string;
  name: string;
  type: 'cluster' | 'working_group';
  description?: string;
  icon: string;
  order: number;
  active: boolean;
  created_at: string;
}

export interface SiteSetting {
  id: string;
  key: string;
  value: string;
  created_at: string;
  updated_at: string;
}

