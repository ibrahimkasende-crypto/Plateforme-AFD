import type { Metadata } from "next";
import Link from "next/link";
import { PublicPageShell } from "@/components/public/PublicPageShell";

type PageProps = {
  searchParams: Promise<{ ref?: string; slug?: string }>;
};

export const metadata: Metadata = {
  title: "Candidature enregistrée",
  robots: { index: false, follow: false },
};

export default async function CandidatureConfirmeePage({
  searchParams,
}: PageProps) {
  const params = await searchParams;
  const reference = params.ref?.trim() || null;
  const slug = params.slug?.trim() || null;
  const sentAt = new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(new Date());

  return (
    <PublicPageShell
      eyebrow="Candidature"
      title="Candidature enregistrée"
      description="Votre candidature a bien été enregistrée. Conservez votre numéro de référence pour tout suivi."
      breadcrumbs={[
        { label: "Accueil", href: "/" },
        { label: "Opportunités", href: "/ressources/opportunites" },
        { label: "Confirmation" },
      ]}
    >
      <div className="mx-auto max-w-xl rounded-[22px] border border-[var(--afd-border)] bg-white p-6 text-center shadow-sm sm:p-8">
        <p className="text-sm text-[var(--afd-muted)]">Date d’envoi</p>
        <p className="mt-1 font-semibold text-[var(--afd-navy)]">{sentAt}</p>
        {reference ? (
          <>
            <p className="mt-5 text-sm text-[var(--afd-muted)]">
              Numéro de référence
            </p>
            <p className="mt-1 font-heading text-xl font-extrabold tracking-wide text-[var(--afd-blue)]">
              {reference}
            </p>
          </>
        ) : null}
        <p className="mt-5 text-sm leading-relaxed text-[var(--afd-muted)]">
          Aucune promesse d’entretien ou de réponse automatique n’est associée à
          cet accusé de réception.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {slug ? (
            <Link
              href={`/ressources/opportunites/${slug}`}
              className="rounded-xl border border-[var(--afd-border)] px-4 py-2.5 text-sm font-semibold text-[var(--afd-navy)]"
            >
              Revoir l’offre
            </Link>
          ) : null}
          <Link
            href="/ressources/opportunites"
            className="rounded-xl bg-[var(--afd-blue)] px-4 py-2.5 text-sm font-semibold text-white"
          >
            Autres opportunités
          </Link>
        </div>
      </div>
    </PublicPageShell>
  );
}
