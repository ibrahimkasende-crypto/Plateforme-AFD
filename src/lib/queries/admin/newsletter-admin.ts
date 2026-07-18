import { createClientSafe } from "@/lib/supabase/safe";

export type AbonneNewsletter = {
  id: string;
  email: string;
  nom: string | null;
  statut: string;
  consentement: boolean;
  subscribed_at: string;
  created_at: string;
};

export type NewsletterCampagne = {
  id: string;
  title: string;
  subject: string;
  status: string;
  scheduled_at: string | null;
  sent_at: string | null;
  created_at: string;
};

export type NewsletterModele = {
  id: string;
  title: string;
  body: string;
  active: boolean;
  created_at: string;
};

export async function getAdminAbonnes(filters: { q?: string; statut?: string } = {}): Promise<AbonneNewsletter[]> {
  try {
    const supabase = await createClientSafe();
    if (!supabase) return [];
    let query = supabase.from("abonnes_newsletter" as never).select("id, email, nom, statut, consentement, subscribed_at, created_at");
    if (filters.q?.trim()) {
      const q = filters.q.trim().replace(/[%_,]/g, " ").slice(0, 120);
      query = query.or(`email.ilike.%${q}%,nom.ilike.%${q}%`);
    }
    if (filters.statut?.trim()) {
      query = query.eq("statut", filters.statut);
    }
    const { data, error } = await query.order("subscribed_at", { ascending: false });
    return error || !data ? [] : (data as AbonneNewsletter[]);
  } catch {
    return [];
  }
}

export async function getAdminCampagnes(): Promise<NewsletterCampagne[]> {
  try {
    const supabase = await createClientSafe();
    if (!supabase) return [];
    const { data, error } = await supabase
      .from("newsletter_campagnes" as never)
      .select("*")
      .order("created_at", { ascending: false });
    return error || !data ? [] : (data as NewsletterCampagne[]);
  } catch {
    return [];
  }
}

export async function getAdminModeles(): Promise<NewsletterModele[]> {
  try {
    const supabase = await createClientSafe();
    if (!supabase) return [];
    const { data, error } = await supabase
      .from("newsletter_modeles" as never)
      .select("*")
      .order("created_at", { ascending: false });
    return error || !data ? [] : (data as NewsletterModele[]);
  } catch {
    return [];
  }
}

export async function getNewsletterStats(): Promise<{
  abonnesActifs: number;
  campagnesEnvoyees: number;
  campagnesBrouillon: number;
}> {
  const [abonnes, campagnes] = await Promise.all([
    getAdminAbonnes({ statut: "actif" }),
    getAdminCampagnes(),
  ]);
  return {
    abonnesActifs: abonnes.length,
    campagnesEnvoyees: campagnes.filter((c) => c.status === "envoyee").length,
    campagnesBrouillon: campagnes.filter((c) => c.status === "brouillon").length,
  };
}
