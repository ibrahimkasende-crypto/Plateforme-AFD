import type { Database } from "@/types/database.types";

type Actualite = Database["public"]["Tables"]["actualites"]["Row"];

export async function listActualites(): Promise<Actualite[]> {
  return [];
}

export async function getActualiteBySlug(
  slug: string,
): Promise<Actualite | null> {
  void slug;
  return null;
}
