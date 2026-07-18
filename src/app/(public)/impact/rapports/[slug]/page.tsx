import { notFound } from "next/navigation";
import { PublicPageShell } from "@/components/public/PublicPageShell";
import { getDocumentBySlug } from "@/lib/queries/public/documents";

export default async function RapportDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const report = await getDocumentBySlug(slug);
  if (!report || !report.type.toLowerCase().includes("rapport")) notFound();
  return <PublicPageShell eyebrow="Impact" title={report.titre} description={report.description ?? "Rapport institutionnel."} breadcrumbs={[{ label: "Accueil", href: "/" }, { label: "Rapports", href: "/impact/rapports" }, { label: report.titre }]}>{report.type_mime === "application/pdf" ? <iframe title={`Aperçu de ${report.titre}`} src={`/api/documents/${report.slug}/download?inline=1`} className="mb-6 h-[70vh] w-full rounded-xl border border-[var(--afd-border)]" /> : null}<a href={`/api/documents/${report.slug}/download`} className="inline-flex rounded-lg bg-[var(--afd-blue)] px-5 py-3 font-semibold text-white">Télécharger le rapport</a></PublicPageShell>;
}
