import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PublicSurveyForm } from "@/components/public/enquetes/PublicSurveyForm";
import { PublicPageShell } from "@/components/public/PublicPageShell";
import { EmptyState } from "@/components/shared/EmptyState";
import { siteConfig } from "@/config/site";
import { getPublicSurveyBySlug } from "@/lib/queries/public/enquetes";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const survey = await getPublicSurveyBySlug(slug);
  if (!survey) return { title: "Enquête introuvable" };
  return {
    title: survey.titre,
    description: survey.description || undefined,
    alternates: { canonical: `${siteConfig.url}/enquetes/${survey.slug}` },
    robots: { index: false, follow: false },
  };
}

export default async function PublicEnquetePage({ params }: PageProps) {
  const { slug } = await params;
  const survey = await getPublicSurveyBySlug(slug);
  if (!survey) notFound();

  return (
    <PublicPageShell
      eyebrow="Enquête"
      title={survey.titre}
      description={survey.description || undefined}
      breadcrumbs={[
        { label: "Accueil", href: "/" },
        { label: survey.titre },
      ]}
    >
      {survey.questions.length === 0 ? (
        <EmptyState
          title="Aucun contenu n’est actuellement publié dans cette section"
          description="Cette enquête ne contient pas encore de questions validées."
          action={
            <Link
              href="/contact"
              className="inline-flex min-h-10 items-center rounded-lg border px-4 text-sm font-semibold"
            >
              Nous contacter
            </Link>
          }
        />
      ) : (
        <PublicSurveyForm
          enqueteId={survey.id}
          slug={survey.slug}
          consentRequired={survey.consentement_requis}
          questions={survey.questions}
        />
      )}
    </PublicPageShell>
  );
}
