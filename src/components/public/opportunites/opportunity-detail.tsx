import Link from "next/link";
import {
  ArrowRight,
  CalendarClock,
  Download,
  ExternalLink,
  FileText,
  MapPin,
} from "lucide-react";
import type { Opportunity } from "@/features/opportunites/types";
import { isOpportunityOpenForApplications } from "@/features/opportunites/utils/status";
import { getOpportunityDocumentUrl } from "@/config/migrated-opportunities";

function formatDate(value: string | null): string | null {
  if (!value) return null;
  const parsed = Date.parse(value);
  if (Number.isNaN(parsed)) return null;
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(parsed);
}

export function OpportunityDetail({
  opportunity,
}: {
  opportunity: Opportunity;
}) {
  const open = isOpportunityOpenForApplications(opportunity.statut);
  const documentUrl = getOpportunityDocumentUrl(opportunity.slug);
  const published = formatDate(opportunity.date_publication);
  const deadline = formatDate(opportunity.date_limite);
  const typeLabel =
    opportunity.type === "emploi" ? "Emploi" : opportunity.type;

  const accordionSections = [
    opportunity.responsabilites
      ? { id: "responsabilites", title: "Responsabilités", body: opportunity.responsabilites }
      : null,
    opportunity.profil_recherche
      ? { id: "profil", title: "Profil recherché", body: opportunity.profil_recherche }
      : null,
    opportunity.competences.length
      ? {
          id: "competences",
          title: "Compétences",
          body: opportunity.competences.join("\n"),
        }
      : null,
    opportunity.pieces_requises.length
      ? {
          id: "pieces",
          title: "Pièces à fournir",
          body: opportunity.pieces_requises.join("\n"),
        }
      : null,
  ].filter(Boolean) as { id: string; title: string; body: string }[];

  const SummaryCard = (
    <aside className="rounded-[22px] border border-[var(--afd-border)] bg-white p-5 shadow-[0_12px_32px_rgba(6,38,83,0.06)] lg:sticky lg:top-24">
      <p className="text-[11px] font-bold tracking-[0.14em] text-[var(--afd-blue)] uppercase">
        Récapitulatif
      </p>
      <dl className="mt-4 space-y-3 text-sm">
        {opportunity.localisation ? (
          <div className="flex gap-2">
            <MapPin className="mt-0.5 size-4 shrink-0 text-[var(--afd-blue)]" aria-hidden />
            <div>
              <dt className="font-semibold text-[var(--afd-navy)]">Localisation</dt>
              <dd className="text-[var(--afd-muted)]">{opportunity.localisation}</dd>
            </div>
          </div>
        ) : null}
        {opportunity.type_contrat ? (
          <div>
            <dt className="font-semibold text-[var(--afd-navy)]">Contrat</dt>
            <dd className="text-[var(--afd-muted)]">{opportunity.type_contrat}</dd>
          </div>
        ) : null}
        {opportunity.duree ? (
          <div>
            <dt className="font-semibold text-[var(--afd-navy)]">Durée</dt>
            <dd className="text-[var(--afd-muted)]">{opportunity.duree}</dd>
          </div>
        ) : null}
        {deadline ? (
          <div className="flex gap-2">
            <CalendarClock className="mt-0.5 size-4 shrink-0 text-[var(--afd-orange)]" aria-hidden />
            <div>
              <dt className="font-semibold text-[var(--afd-navy)]">Date limite</dt>
              <dd className="font-semibold text-[var(--afd-orange-hover)]">{deadline}</dd>
            </div>
          </div>
        ) : null}
        {opportunity.reference ? (
          <div>
            <dt className="font-semibold text-[var(--afd-navy)]">Référence</dt>
            <dd className="text-[var(--afd-muted)]">{opportunity.reference}</dd>
          </div>
        ) : null}
        <div>
          <dt className="font-semibold text-[var(--afd-navy)]">Statut</dt>
          <dd className="text-[var(--afd-muted)]">
            {opportunity.statut === "cloturee"
              ? "Offre clôturée"
              : opportunity.statut === "bientot_cloturee"
                ? "Bientôt clôturée"
                : "Ouverte"}
          </dd>
        </div>
      </dl>

      <div className="mt-5 space-y-2.5">
        {open ? (
          <Link
            href={`/ressources/opportunites/${opportunity.slug}/postuler`}
            className="afd-btn-text inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[var(--afd-blue)] px-4 text-white hover:bg-[var(--afd-blue-hover)]"
          >
            Postuler maintenant
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        ) : (
          <p className="rounded-xl bg-[var(--afd-surface)] px-3 py-3 text-sm text-[var(--afd-muted)]">
            Cette offre n’accepte plus de candidatures.
          </p>
        )}

        {documentUrl ? (
          <>
            <a
              href={documentUrl}
              download
              className="afd-btn-text inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-[var(--afd-blue)]/25 px-4 text-[var(--afd-blue)]"
            >
              <Download className="size-4" aria-hidden />
              Télécharger l’offre complète
            </a>
            <a
              href={documentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="afd-btn-text inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-[var(--afd-border)] px-4 text-[var(--afd-navy)]"
            >
              <ExternalLink className="size-4" aria-hidden />
              Consulter le document
            </a>
          </>
        ) : null}
      </div>
    </aside>
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(280px,0.9fr)] lg:items-start">
      <div className="space-y-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-md bg-[var(--afd-blue)]/10 px-2.5 py-1 text-[11px] font-bold tracking-wide text-[var(--afd-blue)] uppercase">
            {typeLabel}
          </span>
          {!open ? (
            <span className="rounded-md bg-gray-200 px-2.5 py-1 text-[11px] font-bold text-gray-700 uppercase">
              Offre clôturée
            </span>
          ) : null}
        </div>

        <div className="lg:hidden">{SummaryCard}</div>

        <section className="rounded-[20px] border border-[var(--afd-border)] bg-white p-5 sm:p-6">
          <h2 className="font-heading text-lg font-bold text-[var(--afd-navy)]">
            Résumé
          </h2>
          <p className="mt-3 whitespace-pre-line text-[15px] leading-relaxed text-[var(--afd-muted)]">
            {opportunity.description}
          </p>
          <ul className="mt-4 space-y-1.5 text-sm text-[var(--afd-muted)]">
            {published ? <li>Publication : {published}</li> : null}
            {opportunity.localisation ? (
              <li>Localisation : {opportunity.localisation}</li>
            ) : null}
            {opportunity.email_candidature ? (
              <li>Contact : {opportunity.email_candidature}</li>
            ) : null}
          </ul>
        </section>

        {documentUrl ? (
          <section className="flex items-start gap-3 rounded-[20px] border border-[var(--afd-orange)]/25 bg-[#fff8ee] p-5">
            <FileText className="mt-0.5 size-5 shrink-0 text-[var(--afd-orange)]" aria-hidden />
            <div>
              <h2 className="font-heading text-base font-bold text-[var(--afd-navy)]">
                Document officiel
              </h2>
              <p className="mt-1 text-sm text-[var(--afd-muted)]">
                Le détail des missions et du profil figure dans le PDF de l’offre.
                Aucun élément non vérifié n’a été retranscrit ici.
              </p>
            </div>
          </section>
        ) : null}

        {accordionSections.length > 0 ? (
          <div className="space-y-2 rounded-[20px] border border-[var(--afd-border)] bg-white p-2">
            {accordionSections.map((section) => (
              <details
                key={section.id}
                className="group rounded-xl px-3 py-1 open:bg-[var(--afd-surface)]/60"
              >
                <summary className="cursor-pointer list-none py-3 font-semibold text-[var(--afd-navy)] marker:content-none [&::-webkit-details-marker]:hidden">
                  <span className="flex items-center justify-between gap-3">
                    {section.title}
                    <span className="text-[var(--afd-muted)] transition group-open:rotate-180">
                      ▾
                    </span>
                  </span>
                </summary>
                <p className="whitespace-pre-line pb-3 text-sm text-[var(--afd-muted)]">
                  {section.body}
                </p>
              </details>
            ))}
          </div>
        ) : null}

        {!open ? (
          <div className="rounded-[20px] border border-[var(--afd-border)] bg-white p-5">
            <p className="text-sm text-[var(--afd-muted)]">
              Cette offre est clôturée. Vous pouvez consulter les autres
              opportunités ou vous inscrire à la newsletter.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href="/ressources/opportunites"
                className="rounded-lg bg-[var(--afd-blue)] px-4 py-2.5 text-sm font-semibold text-white"
              >
                Autres opportunités
              </Link>
              <Link
                href="/ressources/newsletter"
                className="rounded-lg border border-[var(--afd-border)] px-4 py-2.5 text-sm font-semibold text-[var(--afd-blue)]"
              >
                Newsletter
              </Link>
            </div>
          </div>
        ) : null}
      </div>

      <div className="hidden lg:block">{SummaryCard}</div>
    </div>
  );
}
