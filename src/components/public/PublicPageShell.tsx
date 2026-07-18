import type { ReactNode } from "react";
import { backHrefFromBreadcrumbs } from "@/components/public/secondary-page-back";
import { Breadcrumb, type BreadcrumbItem } from "@/components/shared/Breadcrumb";
import { PageHero } from "@/components/shared/PageHero";
import { Section } from "@/components/shared/Section";
import { SiteContainer } from "@/components/shared/SiteContainer";

export function PublicPageShell({
  title,
  description,
  eyebrow,
  breadcrumbs,
  actions,
  children,
  backLabel = "Retour",
}: {
  title: string;
  description?: string;
  eyebrow?: string;
  breadcrumbs: BreadcrumbItem[];
  actions?: ReactNode;
  children: ReactNode;
  backLabel?: string;
}) {
  const backHref = backHrefFromBreadcrumbs(breadcrumbs);

  return (
    <>
      <PageHero
        title={title}
        description={description}
        eyebrow={eyebrow}
        actions={actions}
        backHref={backHref}
        backLabel={backLabel}
        showBack
      />
      <Section>
        <SiteContainer>
          <Breadcrumb items={breadcrumbs} />
          {children}
        </SiteContainer>
      </Section>
    </>
  );
}
