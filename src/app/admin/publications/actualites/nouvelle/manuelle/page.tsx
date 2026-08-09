import { PublicationModuleShell } from "@/components/admin/publications/publication-module-shell";
import { requirePermission } from "@/lib/auth/require-permission";
import { createClientSafe } from "@/lib/supabase/safe";
import { revalidatePublicContent } from "@/lib/cache/revalidate-public";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function saveActualiteManual(formData: FormData) {
  "use server";
  await requirePermission("actualites:write");
  const title = String(formData.get("title") || "").trim();
  const content = String(formData.get("content") || "").trim();
  const excerpt = String(formData.get("excerpt") || "").trim();
  if (title.length < 3 || content.length < 10) return;

  const supabase = await createClientSafe();
  if (!supabase) return;

  const slug = title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

  const publish = formData.get("published") === "on";
  await supabase.from("actualites").insert({
    title,
    slug,
    excerpt: excerpt || content.slice(0, 180),
    content,
    published: publish,
    published_at: publish ? new Date().toISOString() : null,
    status: publish ? "publie" : "brouillon",
    updated_at: new Date().toISOString(),
  } as never);

  revalidatePath("/admin/publications/actualites");
  revalidatePublicContent(["/actualites", "/"]);
  redirect("/admin/publications/actualites");
}

export default async function NouvelleActualiteManuellePage() {
  await requirePermission("actualites:write");

  return (
    <PublicationModuleShell
      title="Nouvelle actualité (manuel)"
      description="Formulaire rapide. Préférez l’import intelligent si vous avez un document source."
    >
      <form action={saveActualiteManual} className="mx-auto max-w-2xl space-y-4 p-6">
        <label className="block space-y-1 text-sm">
          <span className="font-medium">Titre</span>
          <input required name="title" className="w-full rounded-lg border px-3 py-2" />
        </label>
        <label className="block space-y-1 text-sm">
          <span className="font-medium">Résumé</span>
          <textarea name="excerpt" className="min-h-20 w-full rounded-lg border px-3 py-2" />
        </label>
        <label className="block space-y-1 text-sm">
          <span className="font-medium">Contenu</span>
          <textarea required name="content" className="min-h-48 w-full rounded-lg border px-3 py-2" />
        </label>
        <label className="inline-flex items-center gap-2 text-sm">
          <input name="published" type="checkbox" defaultChecked />
          Publier immédiatement
        </label>
        <button
          type="submit"
          className="rounded-lg bg-[var(--afd-blue)] px-4 py-2 text-sm font-semibold text-white"
        >
          Enregistrer
        </button>
      </form>
    </PublicationModuleShell>
  );
}
