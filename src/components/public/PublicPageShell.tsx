import type { ReactNode } from "react";
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
}: {
  title: string;
  description?: string;
  eyebrow?: string;
  breadcrumbs: BreadcrumbItem[];
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <>
      <PageHero
        title={title}
        description={description}
        eyebrow={eyebrow}
        actions={actions}
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
