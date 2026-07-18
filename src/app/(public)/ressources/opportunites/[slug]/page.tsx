import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PublicPageShell } from "@/components/public/PublicPageShell";
import { ApplicationForm } from "@/components/public/opportunites/application-form";
import { getOpportunityBySlug } from "@/lib/queries/public/opportunites";
import { siteConfig } from "@/config/site";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const opportunity = await getOpportunityBySlug((await params).slug);
  if (!opportunity) return { title: "Opportunité introuvable" };
  return {
    title: opportunity.titre,
    description: opportunity.description.slice(0, 160),
    alternates: { canonical: `${siteConfig.url}/ressources/opportunites/${opportunity.slug}` },
  };
}

export default async function OpportuniteDetailPage(props: PageProps) {
  const { slug } = await props.params;
  const opportunity = await getOpportunityBySlug(slug);
  if (!opportunity) notFound();
  return (
    <PublicPageShell eyebrow="Opportunités" title={opportunity.titre} description={opportunity.description} breadcrumbs={[{ label: "Accueil", href: "/" }, { label: "Opportunités", href: "/ressources/opportunites" }, { label: opportunity.titre }]}>
      <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-6 text-[var(--afd-muted)]">
          <dl className="grid gap-3 rounded-xl border border-[var(--afd-border)] bg-white p-5 sm:grid-cols-2">
            {[
              ["Référence", opportunity.reference], ["Type", opportunity.type], ["Département", opportunity.departement],
              ["Localisation", opportunity.localisation], ["Mode de travail", opportunity.mode_travail], ["Contrat", opportunity.type_contrat],
              ["Durée", opportunity.duree], ["Publication", opportunity.date_publication], ["Date limite", opportunity.date_limite],
              ["Niveau d’études", opportunity.niveau_etudes], ["Expérience", opportunity.experience],
            ].filter(([, value]) => value).map(([label, value]) => <div key={label}><dt className="text-sm font-semibold text-[var(--afd-ink)]">{label}</dt><dd>{value}</dd></div>)}
          </dl>
          <section><h2 className="font-semibold text-[var(--afd-ink)]">Description et contexte</h2><p className="mt-2 whitespace-pre-line">{opportunity.description}</p></section>
          {opportunity.responsabilites ? <section><h2 className="font-semibold text-[var(--afd-ink)]">Responsabilités</h2><p className="mt-2 whitespace-pre-line">{opportunity.responsabilites}</p></section> : null}
          {opportunity.profil_recherche ? <section><h2 className="font-semibold text-[var(--afd-ink)]">Profil recherché</h2><p className="mt-2 whitespace-pre-line">{opportunity.profil_recherche}</p></section> : null}
          {opportunity.competences?.length ? <section><h2 className="font-semibold text-[var(--afd-ink)]">Compétences</h2><ul className="mt-2 list-disc space-y-1 pl-5">{opportunity.competences.map((competence) => <li key={competence}>{competence}</li>)}</ul></section> : null}
          {opportunity.conditions ? <section><h2 className="font-semibold text-[var(--afd-ink)]">Conditions</h2><p className="mt-2 whitespace-pre-line">{opportunity.conditions}</p></section> : null}
          {opportunity.pieces_requises?.length ? <section><h2 className="font-semibold text-[var(--afd-ink)]">Pièces requises</h2><ul className="mt-2 list-disc space-y-1 pl-5">{opportunity.pieces_requises.map((piece) => <li key={piece}>{piece}</li>)}</ul></section> : null}
        </div>
        <aside className="space-y-4">
          {opportunity.email_candidature ? <p className="rounded-xl border border-[var(--afd-border)] bg-white p-4 text-sm text-[var(--afd-muted)]">Contact : {opportunity.email_candidature}</p> : null}
          {opportunity.methode_candidature === "externe" && opportunity.url_externe ? <a href={opportunity.url_externe} target="_blank" rel="noreferrer" className="inline-flex rounded-lg bg-[var(--afd-blue)] px-5 py-3 font-semibold text-white">Postuler sur le site externe</a> : null}
          {opportunity.methode_candidature === "email" && opportunity.email_candidature ? <a href={`mailto:${opportunity.email_candidature}?subject=${encodeURIComponent(`Candidature — ${opportunity.titre}`)}`} className="inline-flex rounded-lg bg-[var(--afd-blue)] px-5 py-3 font-semibold text-white">Postuler par e-mail</a> : null}
          {["ouverte", "bientot_cloturee"].includes(opportunity.statut) && opportunity.methode_candidature === "formulaire" ? <ApplicationForm opportunityId={opportunity.id} /> : <Link href="/ressources/opportunites" className="text-sm font-semibold text-[var(--afd-blue)]">Voir les autres opportunités</Link>}
        </aside>
      </div>
    </PublicPageShell>
  );
}
