import type { Enquete, QuestionEnquete } from "@/features/enquetes/types";
import { createClientSafe } from "@/lib/supabase/safe";

export async function getAdminEnquetes(): Promise<Enquete[]> {
  try {
    const supabase = await createClientSafe();
    if (!supabase) return [];
    const { data, error } = await supabase
      .from("enquetes")
      .select("*")
      .is("deleted_at", null)
      .order("updated_at", { ascending: false });
    return error || !data ? [] : (data as Enquete[]);
  } catch {
    return [];
  }
}

export async function getAdminEnquete(id: string): Promise<Enquete | null> {
  try {
    const supabase = await createClientSafe();
    if (!supabase) return null;
    const { data, error } = await supabase
      .from("enquetes")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    return error || !data ? null : (data as Enquete);
  } catch {
    return null;
  }
}

export async function getAdminQuestions(
  enqueteId: string,
): Promise<QuestionEnquete[]> {
  try {
    const supabase = await createClientSafe();
    if (!supabase) return [];
    const { data, error } = await supabase
      .from("questions_enquete")
      .select("*")
      .eq("enquete_id", enqueteId)
      .order("ordre", { ascending: true });
    return error || !data
      ? []
      : (data as QuestionEnquete[]).map((q) => ({
          ...q,
          configuration:
            q.configuration &&
            typeof q.configuration === "object" &&
            !Array.isArray(q.configuration)
              ? q.configuration
              : {},
        }));
  } catch {
    return [];
  }
}
