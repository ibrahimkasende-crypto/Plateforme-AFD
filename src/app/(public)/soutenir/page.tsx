import type { Metadata } from "next";
import { Heart } from "lucide-react";
import { SupportForm } from "@/components/public/forms/support-form";
import { PublicPageShell } from "@/components/public/PublicPageShell";
import { homeContent } from "@/config/home-content";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Soutenir l’AFD",
  description:
    "Soutenez les actions de l’Alliance des Femmes pour le Développement. Enregistrez votre intention de don.",
  alternates: { canonical: `${siteConfig.url}/soutenir` },
};

export default function SoutenirPage() {
  const supportAction = homeContent.supportActions.find((item) => item.id === "soutenir");

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
              Don général ou soutien ciblé à un programme, un projet ou une urgence
            </li>
            <li className="rounded-lg border border-[var(--afd-border)] bg-[var(--afd-surface)] px-4 py-3">
              Devises acceptées : {siteConfig.currencies.join(", ")}
            </li>
            <li className="rounded-lg border border-[var(--afd-border)] bg-[var(--afd-surface)] px-4 py-3">
              Votre intention de don est enregistrée de manière sécurisée
            </li>
          </ul>

          <div
            role="note"
            className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-950 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-100"
          >
            <p className="font-semibold">Paiement en ligne SerdiPay</p>
            <p className="mt-1">
              {supportAction?.note ??
                "L’intégration SerdiPay sera activée après configuration officielle."}{" "}
              En attendant, votre intention de don est enregistrée et l’équipe AFD vous contactera
              pour finaliser votre soutien. Aucun paiement n’est traité tant que SerdiPay n’est pas
              activé.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--afd-border)] bg-[var(--afd-background)] p-6 md:p-8">
          <h2 className="font-display text-xl font-semibold text-[var(--afd-ink)]">
            Enregistrer une intention de soutien
          </h2>
          <p className="mt-2 text-sm text-[var(--afd-muted)]">
            Ce formulaire enregistre votre intention. Il ne confirme pas un paiement en ligne.
          </p>
          <div className="mt-6">
            <SupportForm />
          </div>
        </div>
      </div>
    </PublicPageShell>
  );
}
