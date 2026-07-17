import type { Metadata } from "next";
import Link from "next/link";
import {
  Briefcase,
  FileText,
  ImageIcon,
  Mail,
  Megaphone,
} from "lucide-react";
import { PublicPageShell } from "@/components/public/PublicPageShell";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Ressources",
  description:
    "Médiathèque, documents, appels d’offres, opportunités et newsletter de l’Alliance des Femmes pour le Développement.",
  alternates: { canonical: `${siteConfig.url}/ressources` },
};

const RESOURCE_CARDS = [
  {
    href: "/ressources/mediatheque",
    title: "Médiathèque",
    description: "Photos, vidéos et médias des actions de l’AFD sur le terrain.",
    icon: ImageIcon,
  },
  {
    href: "/ressources/documents",
    title: "Documents",
    description: "Documents institutionnels et ressources téléchargeables.",
    icon: FileText,
  },
  {
    href: "/ressources/appels-offres",
    title: "Appels d’offres",
    description: "Consultations et appels d’offres publiés par l’AFD.",
    icon: Megaphone,
  },
  {
    href: "/ressources/opportunites",
    title: "Opportunités",
    description: "Offres de collaboration, stages et opportunités d’engagement.",
    icon: Briefcase,
  },
  {
    href: "/ressources/newsletter",
    title: "Newsletter",
    description: "Inscrivez-vous pour recevoir actualités, rapports et opportunités.",
    icon: Mail,
  },
] as const;

export default function RessourcesPage() {
  return (
    <PublicPageShell
      eyebrow="Ressources"
      title="Centre de ressources"
      description="Accédez aux médias, documents et informations publiées par l’AFD."
      breadcrumbs={[
        { label: "Accueil", href: "/" },
        { label: "Ressources" },
      ]}
    >
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {RESOURCE_CARDS.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.href}
              href={card.href}
              className="group flex flex-col rounded-2xl border border-[var(--afd-border)] bg-[var(--afd-surface)] p-6 transition hover:border-[var(--afd-blue)]/40 hover:shadow-sm"
            >
              <div className="inline-flex size-11 items-center justify-center rounded-xl bg-[var(--afd-blue)]/10 text-[var(--afd-blue)] transition group-hover:bg-[var(--afd-blue)] group-hover:text-white">
                <Icon className="size-5" aria-hidden />
              </div>
              <h2 className="mt-4 font-display text-lg font-semibold text-[var(--afd-ink)]">
                {card.title}
              </h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-[var(--afd-muted)]">
                {card.description}
              </p>
              <span className="mt-4 text-sm font-semibold text-[var(--afd-blue)]">
                Accéder →
              </span>
            </Link>
          );
        })}
      </div>

      <p className="mt-10 text-sm text-[var(--afd-muted)]">
        Les rapports et publications institutionnelles sont également disponibles dans la section{" "}
        <Link href="/impact/rapports" className="font-semibold text-[var(--afd-blue)] hover:underline">
          Impact · Rapports
        </Link>
        .
      </p>
    </PublicPageShell>
  );
}
