import { type ReactNode } from 'react';
import { ArrowRight, CalendarDays, ChevronRight, MapPin, Share2, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { News, Partner, Program, Project, TeamMember } from '../../types';
import { Badge, Button, Card, Container, EmptyState, Input, Section } from '../ui';
import { ProgramImage } from '../ProgramImage';

export function PageHero({ eyebrow, title, description, children }: { eyebrow?: string; title: string; description: string; children?: ReactNode }) {
  return <section className="bg-brand-deep text-white"><Container className="py-16 sm:py-20 lg:py-24"><div className="max-w-3xl">{eyebrow && <p className="text-sm font-bold uppercase tracking-[.16em] text-brand-gold">{eyebrow}</p>}<h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">{title}</h1><p className="mt-5 text-lg leading-8 text-white/80">{description}</p>{children && <div className="mt-8">{children}</div>}</div></Container></section>;
}

export function Breadcrumbs({ items }: { items: Array<{ label: string; to?: string }> }) {
  return <nav aria-label="Fil d’Ariane" className="mb-7 flex flex-wrap items-center gap-2 text-sm text-brand-muted">{items.map((item, index) => <span key={`${item.label}-${index}`} className="flex items-center gap-2">{item.to ? <Link className="hover:text-brand-deep" to={item.to}>{item.label}</Link> : <span aria-current="page" className="text-brand-ink">{item.label}</span>}{index < items.length - 1 && <ChevronRight className="h-4 w-4" aria-hidden="true" />}</span>)}</nav>;
}

export function ProgramCard({ program }: { program: Program }) {
  return <Link to={`/programmes/${program.slug}`} className="group block"><Card className="h-full overflow-hidden transition group-hover:-translate-y-1 group-hover:shadow-xl"><div className="h-44 bg-brand-sand"><ProgramImage slug={program.slug} imageUrl={program.image_url} title={program.title} /></div><div className="p-6"><Badge>Programme actif</Badge><h2 className="mt-4 text-xl font-bold group-hover:text-brand-emerald">{program.title}</h2><p className="mt-3 line-clamp-3 text-sm leading-6 text-brand-muted">{program.description}</p><span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-brand-deep">Consulter <ArrowRight className="h-4 w-4" /></span></div></Card></Link>;
}

export function ProjectCard({ project, program }: { project: Project; program?: Program }) {
  const statusLabel = { en_cours: 'En cours', termine: 'Terminé', futur: 'Planifié' }[project.status];
  return <Link to={`/projets/${project.slug}`} className="group block"><Card className="h-full overflow-hidden transition group-hover:-translate-y-1 group-hover:shadow-xl">{project.image_url && <img src={project.image_url} alt="" className="h-44 w-full object-cover" loading="lazy" />}<div className="p-6"><div className="flex flex-wrap gap-2"><Badge>{statusLabel}</Badge>{program && <Badge className="bg-brand-sand text-brand-aubergine">{program.title}</Badge>}</div><h2 className="mt-4 text-xl font-bold group-hover:text-brand-emerald">{project.title}</h2><p className="mt-3 line-clamp-2 text-sm leading-6 text-brand-muted">{project.description}</p><dl className="mt-5 space-y-2 text-sm text-brand-muted"><div className="flex gap-2"><MapPin className="h-4 w-4 text-brand-emerald" aria-hidden="true" /><dd>{project.location}</dd></div><div className="flex gap-2"><CalendarDays className="h-4 w-4 text-brand-emerald" aria-hidden="true" /><dd>{new Date(project.start_date).toLocaleDateString('fr-FR')}</dd></div></dl></div></Card></Link>;
}

export function NewsCard({ article }: { article: News }) {
  return <Link to={`/actualites/${article.slug}`} className="group block"><Card className="h-full overflow-hidden transition group-hover:-translate-y-1 group-hover:shadow-xl">{article.image_url && <img src={article.image_url} alt="" className="h-44 w-full object-cover" loading="lazy" />}<div className="p-6"><Badge>{article.category}</Badge><h2 className="mt-4 text-xl font-bold group-hover:text-brand-emerald">{article.title}</h2><p className="mt-3 line-clamp-3 text-sm leading-6 text-brand-muted">{article.excerpt}</p><p className="mt-5 text-xs font-semibold text-brand-muted">{article.published_at && new Date(article.published_at).toLocaleDateString('fr-FR')} · {article.author}</p></div></Card></Link>;
}

export function TeamMemberCard({ member }: { member: TeamMember }) {
  const initial = member.name.charAt(0).toLocaleUpperCase('fr-FR');
  return <Card className="overflow-hidden"><div className="flex aspect-[4/3] items-center justify-center bg-brand-sand">{member.photo_url ? <img src={member.photo_url} alt={`Portrait de ${member.name}`} className="h-full w-full object-cover" loading="lazy" /> : <span aria-label={`Photo indisponible pour ${member.name}`} className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-deep text-3xl font-bold text-white">{initial}</span>}</div><div className="p-6"><h2 className="text-xl font-bold">{member.name}</h2><p className="mt-1 text-sm font-bold text-brand-emerald">{member.role}</p><p className="mt-4 line-clamp-3 text-sm leading-6 text-brand-muted">{member.description}</p></div></Card>;
}

export function PartnerCard({ partner }: { partner: Partner }) {
  return <Card className="flex min-h-40 flex-col items-center justify-center p-6 text-center">{partner.logo_url ? <img src={partner.logo_url} alt={partner.name} className="max-h-14 max-w-full object-contain" loading="lazy" /> : <Users className="h-8 w-8 text-brand-emerald" aria-hidden="true" />}<h2 className="mt-4 font-bold">{partner.name}</h2><p className="mt-1 text-xs capitalize text-brand-muted">{partner.category}</p></Card>;
}

export function FilterBar({ children }: { children: ReactNode }) {
  return <div className="flex flex-col gap-3 rounded-2xl border border-brand-deep/10 bg-brand-sand p-4 sm:flex-row sm:flex-wrap sm:items-end">{children}</div>;
}

export function SearchInput({ value, onChange, placeholder = 'Rechercher…' }: { value: string; onChange: (value: string) => void; placeholder?: string }) {
  return <Input label="Recherche" value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} />;
}

export function MediaGallery({ title = 'Médiathèque', children }: { title?: string; children: ReactNode }) {
  return <section><h2 className="text-2xl font-bold">{title}</h2><div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{children}</div></section>;
}

export function ShareButtons({ title }: { title: string }) {
  const share = async () => {
    if (navigator.share) await navigator.share({ title, url: window.location.href });
    else await navigator.clipboard?.writeText(window.location.href);
  };
  return <Button type="button" variant="outline" onClick={() => { void share(); }}><Share2 className="h-4 w-4" />Partager</Button>;
}

export function RelatedContent({ title = 'À découvrir également', children }: { title?: string; children: ReactNode }) {
  return <Section className="bg-brand-sand"><Container><h2 className="text-2xl font-bold">{title}</h2><div className="mt-6 grid gap-6 md:grid-cols-3">{children}</div></Container></Section>;
}

export function ContactCTA({ title = 'Construisons un impact durable ensemble.', description = 'Contactez l’AFD pour contribuer, proposer un partenariat ou en savoir plus.' }: { title?: string; description?: string }) {
  return <section className="bg-brand-aubergine text-white"><Container className="flex flex-col gap-6 py-12 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="text-2xl font-bold">{title}</h2><p className="mt-2 max-w-2xl text-white/75">{description}</p></div><Link to="/contact"><Button variant="secondary">Nous contacter</Button></Link></Container></section>;
}

export function ContentSkeleton({ cards = 3 }: { cards?: number }) {
  return <div className="grid gap-6 md:grid-cols-3">{Array.from({ length: cards }, (_, index) => <div key={index} className="h-72 animate-pulse rounded-2xl bg-brand-sand" />)}</div>;
}

export function FormSuccessState({ title, description, action }: { title: string; description: string; action?: ReactNode }) {
  return <Card className="mx-auto max-w-xl p-8 text-center"><h1 className="text-2xl font-bold text-brand-success">{title}</h1><p className="mt-3 leading-7 text-brand-muted">{description}</p>{action && <div className="mt-6">{action}</div>}</Card>;
}

export function FormErrorState({ message }: { message: string }) {
  return <p role="alert" className="rounded-xl border border-brand-error/20 bg-red-50 p-4 text-sm text-brand-error">{message}</p>;
}

export { EmptyState };
