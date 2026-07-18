import { revalidatePath, revalidateTag } from "next/cache";
import { createClientSafe } from "@/lib/supabase/safe";

export type NewsAdminListItem = {
  id: string;
  title: string;
  slug: string;
  published: boolean | null;
  published_at: string | null;
  category: string | null;
  updated_at: string | null;
};

export async function listNewsForAdmin(): Promise<NewsAdminListItem[]> {
  const supabase = await createClientSafe();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("actualites")
    .select("id, title, slug, published, published_at, category, updated_at")
    .order("updated_at", { ascending: false })
    .limit(100);

  if (error || !data) return [];
  return data;
}

export async function revalidateNewsCache() {
  revalidateTag("actualites", "max");
  revalidatePath("/");
  revalidatePath("/actualites");
}
