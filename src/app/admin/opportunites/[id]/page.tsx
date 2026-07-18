import Link from "next/link";
import { notFound } from "next/navigation";
import { requirePermission } from "@/lib/auth/require-permission";
import { getAdminOpportunity } from "@/lib/queries/admin/opportunites";
import {
  closeOpportunity, duplicateOpportunity, publishOpportunity, restoreOpportunity,
  softDeleteOpportunity, suspendOpportunity, unpublishOpportunity,
} from "@/features/opportunites/actions/manage-opportunity";

export default async function AdminOpportunityPage({ params }: { params: Promise<{ id: string }> }) {
  await requirePermission("opportunites:read");
  const item = await getAdminOpportunity((await params).id);
  if (!item) notFound();
  const action = (label: string, fn: (id: string) => Promise<void>) => <form action={fn.bind(null, item.id)}><button className="rounded border px-3 py-2 text-sm">{label}</button></form>;
  return <main className="max-w-3xl space-y-6 p-6"><div className="flex flex-wrap items-center justify-between gap-3"><div><h1 className="text-2xl font-bold">{item.titre}</h1><p className="text-sm text-gray-600">{item.statut} · {item.publie ? "Publié" : "Non publié"}</p></div><div className="flex gap-3"><Link className="rounded border px-3 py-2" href={`/admin/opportunites/${item.id}/modifier`}>Modifier</Link>{item.publie ? <Link className="rounded bg-[var(--afd-blue)] px-3 py-2 text-white" href={`/ressources/opportunites/${item.slug}`}>Prévisualiser</Link> : null}</div></div><article className="rounded border bg-white p-5"><p className="whitespace-pre-line">{item.description}</p></article><div className="flex flex-wrap gap-3">{action("Publier", publishOpportunity)}{action("Dépublier", unpublishOpportunity)}{action("Suspendre", suspendOpportunity)}{action("Clôturer", closeOpportunity)}{action("Dupliquer", duplicateOpportunity)}{item.deleted_at ? action("Restaurer", restoreOpportunity) : action("Supprimer", softDeleteOpportunity)}</div></main>;
}
