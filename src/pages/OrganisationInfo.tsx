import { Link, useLocation } from 'react-router-dom';
import { PageHero, ContactCTA } from '../components/common';
import { Button, Card, Container, Section } from '../components/ui';
import { organisationContent } from '../services/institutionalContent';
import { usePageMeta } from '../hooks/usePageMeta';

const information = {
  '/organisation/notre-histoire': { title: 'Notre histoire', text: organisationContent.history },
  '/organisation/mission-et-valeurs': { title: 'Mission et valeurs', text: `${organisationContent.mission} ${organisationContent.vision}` },
  '/organisation/gouvernance': { title: 'Gouvernance', text: organisationContent.governanceNote },
};

export default function OrganisationInfo() {
  const location = useLocation();
  const content = information[location.pathname as keyof typeof information] ?? information['/organisation/notre-histoire'];
  usePageMeta({ title: content.title, description: content.text });
  return <div><PageHero eyebrow="L’Organisation" title={content.title} description={content.text} /><Section><Container><Card className="max-w-3xl p-8"><p className="leading-8 text-brand-muted">{content.text}</p>{location.pathname === '/organisation/mission-et-valeurs' && <ul className="mt-7 grid gap-3 sm:grid-cols-2">{organisationContent.values.map((value) => <li key={value} className="rounded-xl bg-brand-sand p-4 font-bold text-brand-deep">{value}</li>)}</ul>}<Link className="mt-8 inline-block" to="/organisation"><Button variant="outline">Retour à l’organisation</Button></Link></Card></Container></Section><ContactCTA /></div>;
}
