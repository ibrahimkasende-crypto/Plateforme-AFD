import { useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import { Heart } from 'lucide-react';
import { obtenirImageProgramme } from '../lib/programImages';

interface ProgramImageProps {
  slug: string;
  imageUrl?: string;
  title: string;
  /** Icône Lucide affichée si l'image est absente ou cassée. */
  FallbackIcon?: LucideIcon;
}

/**
 * Affiche l'image d'un programme (BDD en priorité, puis fallback Pexels par slug).
 * En cas d'erreur de chargement (image cassée), affiche une icône centrée sur fond doux.
 * Le conteneur parent doit fournir les dimensions et overflow-hidden.
 */
export function ProgramImage({ slug, imageUrl, title, FallbackIcon = Heart }: ProgramImageProps) {
  const [erreur, setErreur] = useState(false);
  const src = obtenirImageProgramme(slug, imageUrl);

  if (erreur) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-afd-100 dark:bg-afd-900/30">
        <FallbackIcon className="h-12 w-12 text-afd-400 dark:text-afd-300" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={`Terrain — ${title}`}
      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      loading="lazy"
      onError={() => setErreur(true)}
    />
  );
}
