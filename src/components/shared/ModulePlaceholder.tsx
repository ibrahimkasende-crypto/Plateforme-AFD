import { Construction } from "lucide-react";
import { Breadcrumb, type BreadcrumbItem } from "./Breadcrumb";
import { PageHero } from "./PageHero";
import { Section } from "./Section";
import { SiteContainer } from "./SiteContainer";

export function ModulePlaceholder({
  title,
  description,
  breadcrumbs,
  eyebrow = "Module en préparation",
}: {
  title: string;
  description: string;
  breadcrumbs: BreadcrumbItem[];
  eyebrow?: string;
}) {
  return (
    <>
      <PageHero title={title} description={description} eyebrow={eyebrow} />
      <Section>
        <SiteContainer>
          <Breadcrumb items={breadcrumbs} />
          <div className="rounded-2xl border border-dashed border-[var(--adf-border)] bg-[var(--adf-surface)] p-8 md:p-12">
            <div className="flex max-w-2xl flex-col gap-4">
              <div className="inline-flex size-12 items-center justify-center rounded-full bg-[var(--adf-accent-soft)] text-[var(--adf-accent)]">
                <Construction className="size-6" aria-hidden />
              </div>
              <h2 className="font-display text-2xl font-semibold text-[var(--adf-ink)]">
                Module en préparation
              </h2>
              <p className="leading-relaxed text-[var(--adf-muted)]">
                Cette section fait partie de l’architecture validée de la
                Plateforme-ADF. Le contenu et les fonctionnalités seront
                développés progressivement. Aucune donnée fictive n’est
                présentée ici comme réelle.
              </p>
            </div>
          </div>
        </SiteContainer>
      </Section>
    </>
  );
}
