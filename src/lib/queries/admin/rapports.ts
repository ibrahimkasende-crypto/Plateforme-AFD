import { createClientSafe } from "@/lib/supabase/safe";

export type RapportGenere = {
  id: string;
  title: string;
  type: string;
  status: string;
  period_start: string | null;
  period_end: string | null;
  file_url: string | null;
  created_at: string;
};

export async function getAdminRapports(): Promise<RapportGenere[]> {
  try {
    const supabase = await createClientSafe();
    if (!supabase) return [];
    const { data, error } = await supabase
      .from("rapports_generes" as never)
      .select("*")
      .order("created_at", { ascending: false });
    return error || !data ? [] : (data as RapportGenere[]);
  } catch {
    return [];
  }
}

export async function getAdminRapport(id: string): Promise<RapportGenere | null> {
  try {
    const supabase = await createClientSafe();
    if (!supabase) return null;
    const { data, error } = await supabase
      .from("rapports_generes" as never)
      .select("*")
      .eq("id", id)
      .maybeSingle();
    return error || !data ? null : (data as RapportGenere);
  } catch {
    return null;
  }
}
