/**
 * Mapping slug-keyword → URL Pexels (libre de droits).
 * Utilisé en fallback quand image_url n'est pas renseigné en base.
 * Exporté pour être partagé entre Home.tsx et Programs.tsx.
 */
export const IMAGE_PROGRAMMES: Record<string, string> = {
  /* Autonomisation économique des femmes */
  autonomisation:
    'https://images.pexels.com/photos/3943716/pexels-photo-3943716.jpeg?auto=compress&cs=tinysrgb&w=800',
  economique:
    'https://images.pexels.com/photos/3943716/pexels-photo-3943716.jpeg?auto=compress&cs=tinysrgb&w=800',
  /* Violences basées sur le genre (VBG) */
  vbg:
    'https://images.pexels.com/photos/6647037/pexels-photo-6647037.jpeg?auto=compress&cs=tinysrgb&w=800',
  violence:
    'https://images.pexels.com/photos/6647037/pexels-photo-6647037.jpeg?auto=compress&cs=tinysrgb&w=800',
  genre:
    'https://images.pexels.com/photos/6647037/pexels-photo-6647037.jpeg?auto=compress&cs=tinysrgb&w=800',
  /* Santé maternelle et infantile */
  sante:
    'https://images.pexels.com/photos/6233190/pexels-photo-6233190.jpeg?auto=compress&cs=tinysrgb&w=800',
  maternelle:
    'https://images.pexels.com/photos/6233190/pexels-photo-6233190.jpeg?auto=compress&cs=tinysrgb&w=800',
  /* Éducation et formation */
  education:
    'https://images.pexels.com/photos/8613089/pexels-photo-8613089.jpeg?auto=compress&cs=tinysrgb&w=800',
  formation:
    'https://images.pexels.com/photos/8613089/pexels-photo-8613089.jpeg?auto=compress&cs=tinysrgb&w=800',
  /* Eau, hygiène et assainissement (WASH) */
  wash:
    'https://images.pexels.com/photos/6647118/pexels-photo-6647118.jpeg?auto=compress&cs=tinysrgb&w=800',
  eau:
    'https://images.pexels.com/photos/6647118/pexels-photo-6647118.jpeg?auto=compress&cs=tinysrgb&w=800',
  /* Réponse humanitaire */
  humanitaire:
    'https://images.pexels.com/photos/6646918/pexels-photo-6646918.jpeg?auto=compress&cs=tinysrgb&w=800',
  urgence:
    'https://images.pexels.com/photos/6646918/pexels-photo-6646918.jpeg?auto=compress&cs=tinysrgb&w=800',
  /* Plaidoyer et droits */
  plaidoyer:
    'https://images.pexels.com/photos/6646917/pexels-photo-6646917.jpeg?auto=compress&cs=tinysrgb&w=800',
  droits:
    'https://images.pexels.com/photos/6646917/pexels-photo-6646917.jpeg?auto=compress&cs=tinysrgb&w=800',
  /* Urgences sanitaires */
  sanitaire:
    'https://images.pexels.com/photos/5863365/pexels-photo-5863365.jpeg?auto=compress&cs=tinysrgb&w=800',
};

/**
 * Retourne l'URL d'image adaptée au programme.
 * Priorité : image_url BDD > map par mot-clé du slug > fallback générique.
 */
export function obtenirImageProgramme(slug: string, imageUrl?: string): string {
  if (imageUrl) return imageUrl;

  const slugNorm = slug.toLowerCase().replace(/-/g, ' ');
  for (const [cle, url] of Object.entries(IMAGE_PROGRAMMES)) {
    if (slugNorm.includes(cle)) return url;
  }

  return 'https://images.pexels.com/photos/6646914/pexels-photo-6646914.jpeg?auto=compress&cs=tinysrgb&w=800';
}
