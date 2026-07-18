import { notFound } from "next/navigation";
import { PublicationModuleShell } from "@/components/admin/publications/publication-module-shell";
import { saveAppelOffre } from "@/features/appels-offres/actions/manage-appel-offre";
import { requirePermission } from "@/lib/auth/require-permission";
import { getAdminAppelOffre } from "@/lib/queries/admin/appels-offres";

type PageProps = { params: Promise<{ id: string }> };

function toLocalInput(value: string | null): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export default async function ModifierAppelOffrePage({ params }: PageProps) {
  await requirePermission("appels-offres:write");
  const { id } = await params;
  const item = await getAdminAppelOffre(id);
  if (!item) notFound();

  return (
    <PublicationModuleShell title="Modifier l’appel d’offres" description="Mettez à jour le statut, la date limite et les documents.">
      <form action={saveAppelOffre} className="max-w-2xl space-y-4 rounded-2xl border border-[var(--afd-border)] bg-white p-6">
        <input type="hidden" name="id" value={item.id} />
        <input required name="titre" defaultValue={item.titre} className="w-full rounded-lg border p-3" />
        <input required name="slug" defaultValue={item.slug} className="w-full rounded-lg border p-3" />
        <textarea name="resume" defaultValue={item.resume ?? ""} className="min-h-24 w-full rounded-lg border p-3" />
        <textarea name="description" defaultValue={item.description ?? ""} className="min-h-40 w-full rounded-lg border p-3" />
        <textarea name="procedure" defaultValue={item.procedure ?? ""} className="min-h-24 w-full rounded-lg border p-3" />
        <input name="contact_email" type="email" defaultValue={item.contact_email ?? ""} className="w-full rounded-lg border p-3" />
        <input name="localisation" defaultValue={item.localisation ?? ""} className="w-full rounded-lg border p-3" />
        <input name="date_limite" type="datetime-local" defaultValue={toLocalInput(item.date_limite)} className="w-full rounded-lg border p-3" />
        <input name="document_principal_path" defaultValue={item.document_principal_path ?? ""} className="w-full rounded-lg border p-3" />
        <select name="statut" defaultValue={item.statut} className="w-full rounded-lg border p-3">
          <option value="brouillon">Brouillon</option>
          <option value="ouvert">Ouvert</option>
          <option value="cloture">Clôturé</option>
          <option value="suspendu">Suspendu</option>
          <option value="archive">Archivé</option>
        </select>
        <label className="flex items-center gap-2 text-sm">
          <input name="publie" type="checkbox" defaultChecked={item.publie} /> Publier
        </label>
        <button type="submit" className="rounded-lg bg-[var(--afd-blue)] px-4 py-2 font-semibold text-white">
          Enregistrer
        </button>
      </form>
    </PublicationModuleShell>
  );
}
