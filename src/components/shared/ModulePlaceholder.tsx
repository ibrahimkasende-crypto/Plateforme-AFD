import Link from "next/link";
import { Inbox } from "lucide-react";
import { Breadcrumb, type BreadcrumbItem } from "./Breadcrumb";
import { PageHero } from "./PageHero";
import { Section } from "./Section";
import { SiteContainer } from "./SiteContainer";

/**
 * État vide professionnel — ne doit plus afficher « Module en préparation ».
 * Préférer les pages CRUD admin dédiées ; ce composant reste un filet de sécurité.
 */
export function ModulePlaceholder({
  title,
  description,
  breadcrumbs,
  actionHref = "/admin",
  actionLabel = "Retour au tableau de bord",
}: {
  title: string;
  description: string;
  breadcrumbs: BreadcrumbItem[];
  eyebrow?: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <>
      <PageHero title={title} description={description} eyebrow="Administration" />
      <Section>
        <SiteContainer>
          <Breadcrumb items={breadcrumbs} />
          <div className="rounded-2xl border border-dashed border-[var(--afd-border)] bg-[var(--afd-surface)] p-8 md:p-12">
            <div className="flex max-w-2xl flex-col gap-4">
              <div className="inline-flex size-12 items-center justify-center rounded-full bg-[var(--afd-accent-soft)] text-[var(--afd-accent)]">
                <Inbox className="size-6" aria-hidden />
              </div>
              <h2 className="font-display text-2xl font-semibold text-[var(--afd-ink)]">
                Aucun contenu pour le moment
              </h2>
              <p className="leading-relaxed text-[var(--afd-muted)]">
                {description}
              </p>
              <Link
                href={actionHref}
                className="inline-flex w-fit rounded-md bg-[var(--afd-blue)] px-4 py-2 text-sm font-semibold text-white"
              >
                {actionLabel}
              </Link>
            </div>
          </div>
        </SiteContainer>
      </Section>
    </>
  );
}
