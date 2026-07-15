import { useCallback, useMemo, useState } from 'react';
import { EmptyState, PageHero, TeamMemberCard } from '../components/common';
import { Container, ErrorState, LoadingState, Section, Select } from '../components/ui';
import { useContentResource } from '../hooks/useContentResource';
import { usePageMeta } from '../hooks/usePageMeta';
import { equipeService } from '../services/contentService';
import type { TeamMember } from '../types';

const categories = ['toutes', 'direction', 'coordination', 'administration', 'terrain'] as const;

function memberCategory(member: TeamMember) {
  const role = member.role.toLocaleLowerCase('fr-FR');
  if (role.includes('président') || role.includes('directrice')) return 'direction';
  if (role.includes('coordinateur')) return 'coordination';
  if (role.includes('logistique') || role.includes('finance') || role.includes('it')) return 'administration';
  return 'terrain';
}

export default function Team() {
  const loader = useCallback(() => equipeService.list(), []);
  const { data: members, loading, error, reload } = useContentResource(loader, []);
  const [category, setCategory] = useState<(typeof categories)[number]>('toutes');
  const visibleMembers = useMemo(() => category === 'toutes' ? members : members.filter((member) => memberCategory(member) === category), [category, members]);
  usePageMeta({ title: 'Notre équipe', description: 'Découvrez les femmes et les hommes qui portent les actions de l’AFD.' });
  return <div><PageHero eyebrow="L’Organisation" title="Une équipe engagée, une expertise ancrée dans le terrain." description="Découvrez les personnes qui contribuent à transformer les engagements de l’AFD en actions concrètes." /><Section><Container><div className="max-w-xs"><Select label="Filtrer par équipe" value={category} onChange={(event) => setCategory(event.target.value as (typeof categories)[number])}>{categories.map((item) => <option key={item} value={item}>{item === 'toutes' ? 'Toutes les équipes' : item.charAt(0).toUpperCase() + item.slice(1)}</option>)}</Select></div>{loading ? <div className="mt-10"><LoadingState /></div> : error && !members.length ? <div className="mt-10"><ErrorState description="L’équipe est indisponible pour le moment." onRetry={() => { void reload(); }} /></div> : visibleMembers.length ? <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{visibleMembers.map((member) => <TeamMemberCard key={member.id} member={member} />)}</div> : <div className="mt-10"><EmptyState title="Aucun membre dans cette catégorie" description="Choisissez une autre catégorie pour découvrir l’équipe." /></div>}</Container></Section></div>;
}
