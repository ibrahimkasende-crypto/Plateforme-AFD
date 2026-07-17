import type { Metadata } from "next";
import { Building2, Handshake, Landmark, Users } from "lucide-react";
import { PartnershipForm } from "@/components/public/forms/partnership-form";
import { PublicPageShell } from "@/components/public/PublicPageShell";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Devenir partenaire",
  description:
    "Proposez un partenariat avec l’Alliance des Femmes pour le Développement — institutionnel, technique ou financier.",
  alternates: { canonical: `${siteConfig.url}/partenariat` },
};

const PARTNERSHIP_TYPES = [
  {
    id: "institutionnel",
    title: "Partenariat institutionnel",
    description:
      "Collaboration avec des institutions publiques, agences ou autorités pour des programmes structurants.",
    icon: Landmark,
  },
  {
    id: "entreprise",
    title: "Entreprise",
    description:
      "Engagement RSE, mécénat ou co-financement de projets à impact social et communautaire.",
    icon: Building2,
  },
  {
    id: "ong",
    title: "ONG / association",
    description:
      "Coopération opérationnelle, échange de bonnes pratiques et interventions conjointes sur le terrain.",
    icon: Users,
  },
  {
    id: "technique",
    title: "Partenaire technique",
    description:
      "Apport d’expertise, de méthodologies ou de capacités spécialisées au service des programmes AFD.",
    icon: Handshake,
  },
  {
    id: "financier",
    title: "Partenaire financier",
    description:
      "Soutien financier ciblé à des programmes, projets ou réponses d’urgence validés institutionnellement.",
    icon: Handshake,
  },
] as const;

export default function PartenariatPage() {
  return (
    <PublicPageShell
      eyebrow="Collaboration"
      title="Devenir partenaire"
      description="Construisons ensemble des programmes inclusifs, mesurables et ancrés dans les réalités locales."
      breadcrumbs={[
        { label: "Accueil", href: "/" },
        { label: "Devenir partenaire" },
      ]}
    >
      <section className="mb-10">
        <h2 className="font-display text-2xl font-semibold text-[var(--afd-ink)]">
          Types de partenariat
        </h2>
        <p className="mt-2 max-w-2xl text-[var(--afd-muted)]">
          L’AFD collabore avec des acteurs variés pour renforcer l’impact de ses interventions
          humanitaires et de développement en République démocratique du Congo.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PARTNERSHIP_TYPES.map((type) => {
            const Icon = type.icon;
            return (
              <div
                key={type.id}
                className="rounded-2xl border border-[var(--afd-border)] bg-[var(--afd-surface)] p-5"
              >
                <div className="inline-flex size-10 items-center justify-center rounded-xl bg-[var(--afd-blue)]/10 text-[var(--afd-blue)]">
                  <Icon className="size-5" aria-hidden />
                </div>
                <h3 className="mt-3 font-semibold text-[var(--afd-ink)]">{type.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--afd-muted)]">
                  {type.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <div className="rounded-2xl border border-[var(--afd-border)] bg-[var(--afd-background)] p-6 md:p-8">
        <h2 className="font-display text-xl font-semibold text-[var(--afd-ink)]">
          Proposer une collaboration
        </h2>
        <p className="mt-2 text-sm text-[var(--afd-muted)]">
          Décrivez votre organisation et votre proposition. L’équipe AFD examinera votre demande.
        </p>
        <div className="mt-6">
          <PartnershipForm />
        </div>
      </div>
    </PublicPageShell>
  );
}
