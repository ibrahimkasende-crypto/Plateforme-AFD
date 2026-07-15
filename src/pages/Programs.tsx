import { useCallback, useMemo, useState } from 'react';
import { EmptyState, FilterBar, PageHero, ProgramCard, SearchInput } from '../components/common';
import { Container, ErrorState, LoadingState, Section } from '../components/ui';
import { useContentResource } from '../hooks/useContentResource';
import { usePageMeta } from '../hooks/usePageMeta';
import { programmeService } from '../services/contentService';

export default function Programs() {
  const loader = useCallback(() => programmeService.list(), []);
  const { data: programs, loading, error, reload } = useContentResource(loader, []);
  const [search, setSearch] = useState('');
  const visiblePrograms = useMemo(() => programs.filter((program) => `${program.title} ${program.description}`.toLocaleLowerCase('fr-FR').includes(search.toLocaleLowerCase('fr-FR'))), [programs, search]);
  usePageMeta({ title: 'Nos programmes', description: 'Explorez les programmes de l’AFD pour l’autonomie, la protection et le développement communautaire.' });
  return <div><PageHero eyebrow="Nos programmes" title="Des réponses concrètes aux réalités des communautés." description="Nos programmes conjuguent protection, autonomie et renforcement des capacités pour créer un impact durable." /><Section><Container><FilterBar><div className="w-full sm:w-80"><SearchInput value={search} onChange={setSearch} placeholder="Rechercher un programme" /></div></FilterBar>{loading ? <div className="mt-10"><LoadingState /></div> : error && !programs.length ? <div className="mt-10"><ErrorState description="Les programmes sont indisponibles." onRetry={() => { void reload(); }} /></div> : visiblePrograms.length ? <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">{visiblePrograms.map((program) => <ProgramCard key={program.id} program={program} />)}</div> : <div className="mt-10"><EmptyState title="Aucun programme trouvé" description="Modifiez votre recherche pour afficher les programmes disponibles." /></div>}</Container></Section></div>;
}
