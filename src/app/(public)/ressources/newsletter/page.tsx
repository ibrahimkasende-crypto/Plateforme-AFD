import type { Metadata } from "next";
import { Mail } from "lucide-react";
import { NewsletterPageForm } from "@/components/public/forms/newsletter-page-form";
import { PublicPageShell } from "@/components/public/PublicPageShell";
import { homeContent } from "@/config/home-content";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Newsletter",
  description:
    "Inscrivez-vous à la newsletter de l’Alliance des Femmes pour le Développement.",
  alternates: { canonical: `${siteConfig.url}/ressources/newsletter` },
};

export default function NewsletterPage() {
  return (
    <PublicPageShell
      eyebrow="Ressources"
      title={homeContent.newsletter.title}
      description={homeContent.newsletter.description}
      breadcrumbs={[
        { label: "Accueil", href: "/" },
        { label: "Ressources", href: "/ressources" },
        { label: "Newsletter" },
      ]}
    >
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 flex items-center gap-3">
          <div className="inline-flex size-11 items-center justify-center rounded-full bg-[var(--afd-orange)]/10 text-[var(--afd-orange)]">
            <Mail className="size-5" aria-hidden />
          </div>
          <p className="text-sm leading-relaxed text-[var(--afd-muted)]">
            Recevez nos actualités, publications, opportunités et informations sur nos actions
            humanitaires et de développement.
          </p>
        </div>

        <div className="rounded-2xl border border-[var(--afd-border)] bg-[var(--afd-background)] p-6 md:p-8">
          <NewsletterPageForm />
        </div>
      </div>
    </PublicPageShell>
  );
}
