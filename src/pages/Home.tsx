// =============================================================
// Home.tsx — Page d'accueil du site AFD
// Palette AFD : #36A2E0 (afd-400), #1F6FA8 (afd-600), #EAF6FD (afd-50)
// Toutes les couleurs décoratives sont harmonisées avec la charte.
// =============================================================

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Quote } from 'lucide-react';
import { supabase, queryWithRetry } from '../lib/supabase';
import type { News, Partner, Program, Project } from '../types';
import { fallbackNews, fallbackPartners, fallbackPrograms, fallbackProjects, fallbackSettings } from '../lib/fallbackData';
import { ProgramImage } from '../components/ProgramImage';
import { Badge, Button, Card, Container, EmptyState, Input, Section, SectionHeader } from '../components/ui';
import { impactStory, interventionAreas, programmeHighlights } from '../services/homeContent';
import img1 from '../assets/adf1.jpg';

export default function Home() {
  const [programs, setPrograms] = useState<Program[]>(fallbackPrograms);
  const [projects, setProjects] = useState<Project[]>(fallbackProjects);
  const [news, setNews] = useState<News[]>(fallbackNews);
  const [partners, setPartners] = useState<Partner[]>(fallbackPartners);
  const [settings, setSettings] = useState<Record<string, string>>(fallbackSettings);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterMessage, setNewsletterMessage] = useState<string | null>(null);

  useEffect(() => {
    void Promise.all([
      loadPrograms(), loadProjects(), loadNews(), loadPartners(), loadSettings(),
    ]);
  }, []);

  async function loadPrograms() {
    const { data } = await queryWithRetry(() => supabase.from('programmes').select('*').eq('active', true).order('order'));
    if (data?.length) setPrograms(data as Program[]);
  }

  async function loadProjects() {
    const { data } = await queryWithRetry(() => supabase.from('projets').select('*').eq('active', true).order('created_at', { ascending: false }).limit(3));
    if (data?.length) setProjects(data as Project[]);
  }

  async function loadNews() {
    const { data } = await queryWithRetry(() => supabase.from('actualites').select('*').eq('published', true).order('published_at', { ascending: false }).limit(3));
    if (data?.length) setNews(data as News[]);
  }

  async function loadPartners() {
    const { data } = await queryWithRetry(() => supabase.from('partenaires').select('*').eq('active', true).order('order'));
    if (data?.length) setPartners(data as Partner[]);
  }

  async function loadSettings() {
    const { data } = await queryWithRetry(() => supabase.from('parametres_site').select('*'));
    if (data?.length) setSettings(Object.fromEntries(data.map((setting) => [setting.key, setting.value])));
  }

  return (
    <div className="overflow-hidden">
      <section className="relative isolate min-h-[560px] bg-brand-ink text-white"><img src={img1} alt="Femmes participant à une activité communautaire de l’AFD" className="absolute inset-0 -z-20 h-full w-full object-cover" /><div className="absolute inset-0 -z-10 bg-gradient-to-r from-brand-ink via-brand-ink/85 to-brand-deep/25" /><Container className="flex min-h-[560px] items-center py-20"><div className="max-w-3xl"><Badge className="bg-brand-gold text-brand-ink">Engagées depuis {settings.founded_year}</Badge><h1 className="mt-6 text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">Le leadership des femmes au cœur du développement communautaire.</h1><p className="mt-6 max-w-2xl text-lg leading-8 text-white/85 sm:text-xl">L’Alliance des Femmes pour le Développement agit avec les communautés pour la dignité, la résilience et des opportunités durables en RDC.</p><div className="mt-9 flex flex-col gap-3 sm:flex-row"><Link to="/donate"><Button variant="secondary">Faire un don <ArrowRight className="h-4 w-4" /></Button></Link><Link to="/programs"><Button className="border-white text-white hover:bg-white/10" variant="outline">Découvrir nos programmes</Button></Link></div></div></Container></section>
      <Section><Container><div className="grid gap-10 lg:grid-cols-[1fr_1.3fr] lg:items-end"><SectionHeader eyebrow="L’AFD en bref" title="Agir avec les femmes, pour des communautés plus fortes." description="Notre approche relie l’expertise locale, l’écoute des personnes concernées et une action concrète, mesurable et responsable." /><Link to="/about" className="justify-self-start lg:justify-self-end"><Button variant="outline">Connaître l’organisation <ArrowRight className="h-4 w-4" /></Button></Link></div><div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{programmeHighlights.map(({ icon: Icon, title, description }) => <Card key={title} className="p-6"><Icon className="h-7 w-7 text-brand-emerald" aria-hidden="true" /><h3 className="mt-5 text-lg font-bold">{title}</h3><p className="mt-2 text-sm leading-6 text-brand-muted">{description}</p></Card>)}</div></Container></Section>
      <section id="impact" className="bg-brand-sand"><Container className="py-12 sm:py-16"><div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{[{ label: 'Personnes accompagnées', value: `${Number(settings.beneficiaries).toLocaleString('fr-FR')}+` }, { label: 'Projets actifs', value: settings.active_projects }, { label: 'Provinces couvertes', value: settings.provinces_count }, { label: 'Années d’expérience', value: `${settings.experience_years} ans` }].map((stat) => <div key={stat.label} className="border-l-2 border-brand-gold pl-5"><p className="text-3xl font-bold text-brand-deep">{stat.value}</p><p className="mt-1 text-sm font-semibold text-brand-muted">{stat.label}</p></div>)}</div></Container></section>
      <Section><Container><SectionHeader eyebrow="Programmes" title="Des priorités guidées par les besoins du terrain." description="Découvrez les domaines dans lesquels l’AFD concentre ses ressources et ses partenariats." /><div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">{programs.slice(0, 6).map((program) => <Link key={program.id} to={`/programs/${program.slug}`} className="group"><Card className="h-full overflow-hidden transition group-hover:-translate-y-1 group-hover:shadow-xl"><div className="h-40 bg-brand-sand"><ProgramImage slug={program.slug} imageUrl={program.image_url} title={program.title} /></div><div className="p-6"><h3 className="text-xl font-bold group-hover:text-brand-emerald">{program.title}</h3><p className="mt-3 line-clamp-3 text-sm leading-6 text-brand-muted">{program.description}</p><span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-brand-deep">Explorer <ArrowRight className="h-4 w-4" /></span></div></Card></Link>)}</div></Container></Section>
      <Section className="bg-brand-deep text-white"><Container><div className="grid gap-12 lg:grid-cols-2 lg:items-center"><div><p className="text-sm font-bold uppercase tracking-[.16em] text-brand-gold">Présence en RDC</p><h2 className="mt-4 text-3xl font-bold sm:text-4xl">Une présence au plus près des réalités locales.</h2><p className="mt-5 leading-8 text-white/75">Nos interventions s’adaptent aux contextes des provinces, avec les organisations locales, les autorités et les communautés concernées.</p><Link to="/projects" className="mt-7 inline-block"><Button variant="secondary">Voir nos projets</Button></Link></div><div className="grid gap-3 sm:grid-cols-2">{interventionAreas.map((area) => <div key={area.name} className="rounded-xl border border-white/15 bg-white/5 p-4"><MapPin className="h-5 w-5 text-brand-gold" aria-hidden="true" /><p className="mt-3 font-bold">{area.name}</p><p className="mt-1 text-sm text-white/70">{area.province}</p></div>)}</div></div></Container></Section>
      <Section><Container><div className="grid gap-8 lg:grid-cols-2"><div><SectionHeader eyebrow="Projets prioritaires" title="Des actions concrètes, des résultats suivis." description="Les projets présentés ici sont alimentés par les contenus publiés dans l’espace de gestion." /><Link to="/projects" className="mt-7 inline-block"><Button variant="outline">Tous les projets <ArrowRight className="h-4 w-4" /></Button></Link></div><div className="grid gap-4">{projects.length ? projects.map((project) => <Link key={project.id} to={`/projects/${project.slug}`}><Card className="p-5 transition hover:border-brand-emerald/40"><p className="text-sm font-bold text-brand-emerald">{project.location}</p><h3 className="mt-2 text-lg font-bold">{project.title}</h3><p className="mt-2 line-clamp-2 text-sm text-brand-muted">{project.description}</p></Card></Link>) : <EmptyState title="Aucun projet prioritaire publié" description="Les prochains projets apparaîtront ici dès leur publication." />}</div></div></Container></Section>
      <section className="bg-brand-aubergine text-white"><Container className="py-16 sm:py-20"><Quote className="h-10 w-10 text-brand-gold" aria-hidden="true" /><blockquote className="mt-6 max-w-4xl text-2xl font-semibold leading-10 sm:text-3xl">« {impactStory.quote} »</blockquote><p className="mt-6 text-sm text-white/70">{impactStory.attribution}</p></Container></section>
      <Section><Container><div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end"><SectionHeader eyebrow="Actualités" title="Suivre nos engagements sur le terrain." description="Nos dernières informations, publications et annonces." /><Link to="/news"><Button variant="outline">Toutes les actualités</Button></Link></div><div className="mt-12 grid gap-6 md:grid-cols-3">{news.length ? news.map((article) => <Link key={article.id} to={`/news/${article.slug}`} className="group"><Card className="h-full overflow-hidden transition group-hover:-translate-y-1 group-hover:shadow-xl">{article.image_url && <img src={article.image_url} alt="" className="h-40 w-full object-cover" />}<div className="p-6"><Badge>{article.category}</Badge><h3 className="mt-4 text-xl font-bold group-hover:text-brand-emerald">{article.title}</h3><p className="mt-3 line-clamp-3 text-sm leading-6 text-brand-muted">{article.excerpt}</p></div></Card></Link>) : <div className="md:col-span-3"><EmptyState title="Aucune actualité publiée" description="Les prochaines actualités de l’AFD seront disponibles ici." /></div>}</div></Container></Section>
      <section className="bg-brand-sand"><Container className="py-14"><p className="text-center text-sm font-bold uppercase tracking-[.16em] text-brand-muted">Partenaires de confiance</p><div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">{partners.map((partner) => <div key={partner.id} className="flex min-h-20 items-center justify-center rounded-xl bg-white p-4 text-center text-sm font-bold text-brand-deep">{partner.logo_url ? <img src={partner.logo_url} alt={partner.name} className="max-h-10 max-w-full object-contain" /> : partner.name}</div>)}</div></Container></section>
      <section className="bg-brand-deep text-white"><Container className="grid gap-10 py-14 lg:grid-cols-[1fr_auto] lg:items-center"><div><p className="text-sm font-bold uppercase tracking-[.16em] text-brand-gold">Restons en lien</p><h2 className="mt-3 text-3xl font-bold">Recevez les informations de l’AFD.</h2><p className="mt-3 max-w-xl text-white/75">Inscrivez-vous pour recevoir nos prochaines actualités. Le stockage des inscriptions sera activé après validation de la politique de données.</p></div><form className="w-full max-w-md" onSubmit={(event) => { event.preventDefault(); setNewsletterMessage(`Merci. Nous vous contacterons à ${newsletterEmail} lorsque les inscriptions seront activées.`); }}><div className="flex flex-col gap-3 sm:flex-row"><Input aria-label="Votre adresse e-mail" type="email" required value={newsletterEmail} onChange={(event) => setNewsletterEmail(event.target.value)} className="mt-0" placeholder="vous@exemple.cd" /><Button variant="secondary" type="submit">S’inscrire</Button></div>{newsletterMessage && <p role="status" className="mt-3 text-sm text-white/80">{newsletterMessage}</p>}</form></Container></section>
    </div>
  );
}




// Force Vite reload
