import { withClient } from "@/lib/queries/public/client";
import type { Database } from "@/types/database.types";

type TeamMember = Database["public"]["Tables"]["membres_equipe"]["Row"];

export type ActiveTeamMember = Pick<
  TeamMember,
  "id" | "name" | "role" | "description" | "photo_url" | "gender" | "order"
>;

export async function getActiveTeamMembers(): Promise<ActiveTeamMember[]> {
  return withClient([], async (supabase) => {
    const { data, error } = await supabase
      .from("membres_equipe")
      .select("id, name, role, description, photo_url, gender, order")
      .eq("active", true)
      .order("order", { ascending: true });

    if (error || !data) return [];
    return data;
  });
}
