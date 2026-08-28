import type { Metadata } from "next";
import { Heart } from "lucide-react";
import { SupportDonationWizard } from "@/components/public/forms/support-donation-wizard";
import { PublicPageShell } from "@/components/public/PublicPageShell";
import { homeContent } from "@/config/home-content";
import { siteConfig } from "@/config/site";
import { getSerdiPayConfig } from "@/features/paiements/providers/serdipay";
import { getActiveBankCoordinates } from "@/features/dons/services/bank-coordinates.service";

export const metadata: Metadata = {
  title: "Soutenir l’AFD",
  description:
    "Soutenez les actions de l’Alliance des Femmes pour le Développement par virement bancaire ou intention de paiement en ligne.",
  alternates: { canonical: `${siteConfig.url}/soutenir` },
};

export default async function SoutenirPage() {
  const supportAction = homeContent.supportActions.find((item) => item.id === "soutenir");
  const bankCoordinates = await getActiveBankCoordinates();
  const serdiPay = getSerdiPayConfig();

  return (
    <PublicPageShell
      eyebrow="Soutien"
      title="Soutenir l’AFD"
      description={
        supportAction?.description ??
        "Contribuez aux interventions humanitaires et de développement de l’AFD."
      }
      breadcrumbs={[
        { label: "Accueil", href: "/" },
        { label: "Soutenir l’AFD" },
      ]}
    >
      <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-14">
        <div className="space-y-6">
          <div className="inline-flex size-12 items-center justify-center rounded-full bg-[var(--afd-orange)]/10 text-[var(--afd-orange)]">
            <Heart className="size-6" aria-hidden />
          </div>

          <section>
            <h2 className="font-display text-2xl font-semibold text-[var(--afd-ink)]">
              Votre soutien compte
            </h2>
            <p className="mt-3 leading-relaxed text-[var(--afd-muted)]">
              Chaque contribution permet à l’AFD de renforcer ses réponses humanitaires, ses
              programmes de développement et son accompagnement des communautés vulnérables,
              en particulier les femmes et les jeunes.
            </p>
          </section>

          <ul className="space-y-3 text-sm text-[var(--afd-muted)]">
            <li className="rounded-lg border border-[var(--afd-border)] bg-[var(--afd-surface)] px-4 py-3">
              Virement bancaire officiel Equity BCDC (USD ou CDF)
            </li>
            <li className="rounded-lg border border-[var(--afd-border)] bg-[var(--afd-surface)] px-4 py-3">
              Paiement en ligne / Mobile Money via SerdiPay (activation progressive)
            </li>
            <li className="rounded-lg border border-[var(--afd-border)] bg-[var(--afd-surface)] px-4 py-3">
              Référence unique et vérification manuelle avant confirmation
            </li>
          </ul>
        </div>

        <div className="rounded-2xl border border-[var(--afd-border)] bg-[var(--afd-background)] p-6 md:p-8">
          <h2 className="font-display text-xl font-semibold text-[var(--afd-ink)]">
            Faire un don
          </h2>
          <p className="mt-2 text-sm text-[var(--afd-muted)]">
            Choisissez votre moyen de paiement. Un virement n’est jamais considéré comme payé
            avant vérification par l’AFD.
          </p>
          <div className="mt-6">
            <SupportDonationWizard
              bankCoordinates={bankCoordinates}
              serdiPayAvailable={serdiPay.configured}
            />
          </div>
        </div>
      </div>
    </PublicPageShell>
  );
}
