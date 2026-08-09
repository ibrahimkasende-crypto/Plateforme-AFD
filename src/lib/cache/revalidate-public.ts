import { revalidatePath, revalidateTag } from "next/cache";

/**
 * Invalide le cache public après une mutation métier dashboard.
 */
export function revalidatePublicContent(extraPaths: string[] = []) {
  const paths = [
    "/",
    "/contact",
    "/qui-sommes-nous",
    "/qui-sommes-nous/mission-vision-valeurs",
    "/actions",
    "/actions/programmes",
    "/actions/projets",
    "/impact",
    "/impact/resultats",
    "/impact/histoires",
    "/partenaires",
    "/actualites",
    "/ressources",
    "/ressources/documents",
    "/ressources/mediatheque",
    "/ressources/appels-offres",
    "/ressources/opportunites",
    "/actions/domaines-intervention",
    ...extraPaths,
  ];

  for (const path of paths) {
    try {
      revalidatePath(path);
    } catch {
      // ignore
    }
  }

  for (const tag of [
    "public-site",
    "actualites",
    "programmes",
    "partenaires",
    "chiffres-impact",
    "histoires-impact",
  ]) {
    try {
      revalidateTag(tag, "max");
    } catch {
      // ignore
    }
  }
}
