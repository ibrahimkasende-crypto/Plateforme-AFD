import { notFound } from "next/navigation";
import { PublicPageShell } from "@/components/public/PublicPageShell";
import { getDocumentBySlug } from "@/lib/queries/public/documents";

export default async function DocumentDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const document = await getDocumentBySlug(slug);
  if (!document) notFound();
  return (
    <PublicPageShell eyebrow="Ressources" title={document.titre} description={document.description ?? "Document institutionnel publié par l’AFD."} breadcrumbs={[{ label: "Accueil", href: "/" }, { label: "Documents", href: "/ressources/documents" }, { label: document.titre }]}>
      {document.type_mime === "application/pdf" ? <iframe title={`Aperçu de ${document.titre}`} src={`/api/documents/${document.slug}/download?inline=1`} className="mb-6 h-[70vh] w-full rounded-xl border border-[var(--afd-border)]" /> : null}
      <a className="inline-flex rounded-lg bg-[var(--afd-blue)] px-5 py-3 font-semibold text-white" href={`/api/documents/${document.slug}/download`}>
        Télécharger le document
      </a>
    </PublicPageShell>
  );
}
