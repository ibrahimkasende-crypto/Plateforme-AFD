import { notFound } from "next/navigation";
import { PublicationModuleShell } from "@/components/admin/publications/publication-module-shell";
import { savePage } from "@/features/pages/actions/manage-page";
import { requirePermission } from "@/lib/auth/require-permission";
import { getAdminPage } from "@/lib/queries/admin/pages";
import { createClientSafe } from "@/lib/supabase/safe";

type PageProps = { params: Promise<{ id: string }> };

export default async function ModifierPageCmsPage({ params }: PageProps) {
  await requirePermission("pages:write");
  const { id } = await params;
  const item = await getAdminPage(id);
  if (!item) notFound();

  let contenuPrincipal = "";
  const supabase = await createClientSafe();
  if (supabase) {
    const { data } = await supabase
      .from("sections_pages")
      .select("contenu")
      .eq("page_id", id)
      .eq("type_section", "contenu")
      .order("ordre", { ascending: true })
      .limit(1)
      .maybeSingle();
    contenuPrincipal = data?.contenu ?? "";
  }

  return (
    <PublicationModuleShell title="Modifier la page" description="Mettez à jour le contenu publié sur le site public.">
      <form action={savePage} className="max-w-2xl space-y-4 rounded-2xl border border-[var(--afd-border)] bg-white p-6">
        <input type="hidden" name="id" value={item.id} />
        <input required name="route" defaultValue={item.route} className="w-full rounded-lg border p-3 font-mono text-sm" />
        <input required name="titre" defaultValue={item.titre} className="w-full rounded-lg border p-3" />
        <input name="surtitre" defaultValue={item.surtitre ?? ""} className="w-full rounded-lg border p-3" />
        <textarea name="resume" defaultValue={item.resume ?? ""} className="min-h-24 w-full rounded-lg border p-3" />
        <textarea name="description_seo" defaultValue={item.description_seo ?? ""} className="min-h-20 w-full rounded-lg border p-3" />
        <textarea name="contenu_principal" defaultValue={contenuPrincipal} className="min-h-48 w-full rounded-lg border p-3" />
        <select name="statut" defaultValue={item.statut} className="w-full rounded-lg border p-3">
          <option value="brouillon">Brouillon</option>
          <option value="en_revision">En révision</option>
          <option value="publie">Publié</option>
          <option value="depublie">Dépublié</option>
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
