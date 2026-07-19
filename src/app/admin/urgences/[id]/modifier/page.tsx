import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/module/admin-page-header";
import { saveUrgence } from "@/features/urgences/actions/manage-urgence";
import { requirePermission } from "@/lib/auth/require-permission";
import { createClientSafe } from "@/lib/supabase/safe";

export default async function AdminUrgenceModifierPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requirePermission("urgences:write");
  const { id } = await params;
  const supabase = await createClientSafe();
  if (!supabase) notFound();
  const { data: urgenceRaw } = await supabase
    .from("urgences" as never)
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (!urgenceRaw) notFound();
  const urgence = urgenceRaw as {
    title: string;
    slug: string;
    summary: string | null;
    province: string | null;
    started_at: string | null;
    status: string;
  };

  return (
    <main className="space-y-6 p-6">
      <AdminPageHeader title="Modifier l'urgence" description={urgence.title} />
      <form action={saveUrgence} className="grid max-w-2xl gap-3 rounded border bg-white p-4">
        <input type="hidden" name="id" value={id} />
        <input
          name="title"
          required
          defaultValue={urgence.title}
          className="rounded border p-2 text-sm"
        />
        <input name="slug" defaultValue={urgence.slug} className="rounded border p-2 text-sm" />
        <textarea
          name="summary"
          defaultValue={urgence.summary ?? ""}
          className="min-h-24 rounded border p-2 text-sm"
        />
        <input
          name="province"
          defaultValue={urgence.province ?? ""}
          className="rounded border p-2 text-sm"
        />
        <input
          name="started_at"
          type="date"
          defaultValue={urgence.started_at ?? ""}
          className="rounded border p-2 text-sm"
        />
        <select name="status" defaultValue={urgence.status} className="rounded border p-2 text-sm">
          <option value="active">Active</option>
          <option value="closed">Clôturée</option>
        </select>
        <button type="submit" className="rounded bg-[var(--afd-blue)] px-4 py-2 text-sm text-white">
          Enregistrer
        </button>
      </form>
    </main>
  );
}
