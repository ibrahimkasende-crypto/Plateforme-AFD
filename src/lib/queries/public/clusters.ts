import { withClient } from "@/lib/queries/public/client";
import type { Database } from "@/types/database.types";

type Cluster = Database["public"]["Tables"]["clusters"]["Row"];

export type ActiveCluster = Pick<
  Cluster,
  "id" | "name" | "description" | "icon" | "type" | "order"
>;

export async function getActiveClusters(): Promise<ActiveCluster[]> {
  return withClient([], async (supabase) => {
    const { data, error } = await supabase
      .from("clusters")
      .select("id, name, description, icon, type, order")
      .eq("active", true)
      .order("order", { ascending: true });

    if (error || !data) return [];
    return data;
  });
}
