import type { LucideIcon } from 'lucide-react';
import { Briefcase, HeartPulse, Scale, Sprout } from 'lucide-react';

export interface InterventionArea {
  name: string;
  province: string;
}

export const interventionAreas: InterventionArea[] = [
  { name: 'Kinshasa', province: 'Kinshasa' },
  { name: 'Nord-Kivu', province: 'Goma et territoires voisins' },
  { name: 'Sud-Kivu', province: 'Bukavu et communautés rurales' },
  { name: 'Ituri', province: 'Zones affectées par les déplacements' },
  { name: 'Kasaï Oriental', province: 'Aires de santé prioritaires' },
  { name: 'Tshopo', province: 'Maternités et communautés' },
];

export const impactStory = {
  quote: 'Quand une femme accède à une activité économique, elle renforce aussi la sécurité et l’avenir de sa famille.',
  attribution: 'Une participante à nos activités de renforcement économique',
};

export const programmeHighlights: Array<{ icon: LucideIcon; title: string; description: string }> = [
  { icon: Briefcase, title: 'Autonomie économique', description: 'Des compétences, des réseaux et des opportunités pour décider de son avenir.' },
  { icon: HeartPulse, title: 'Santé et protection', description: 'Une réponse attentive aux besoins de santé, de dignité et de sécurité.' },
  { icon: Scale, title: 'Droits et leadership', description: 'Un plaidoyer porté avec les femmes et les communautés.' },
  { icon: Sprout, title: 'Résilience communautaire', description: 'Des solutions ancrées dans les réalités locales et durables.' },
];
