import type { Database } from "@/types/database.types";

type Programme = Database["public"]["Tables"]["programmes"]["Row"];
type Projet = Database["public"]["Tables"]["projets"]["Row"];
type Actualite = Database["public"]["Tables"]["actualites"]["Row"];

/**
 * Services de données — accès centralisé.
 * Les composants de présentation ne doivent pas appeler Supabase directement.
 */
export async function listProgrammes(): Promise<Programme[]> {
  return [];
}

export async function getProgrammeBySlug(slug: string): Promise<Programme | null> {
  void slug;
  return null;
}

export async function listProjets(): Promise<Projet[]> {
  return [];
}

export async function getProjetBySlug(slug: string): Promise<Projet | null> {
  void slug;
  return null;
}

export async function listActualites(): Promise<Actualite[]> {
  return [];
}

export async function getActualiteBySlug(
  slug: string,
): Promise<Actualite | null> {
  void slug;
  return null;
}
