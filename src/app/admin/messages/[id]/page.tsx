import Link from "next/link";
import { revalidatePath } from "next/cache";
import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/module/admin-page-header";
import {
  markMessagePending,
  markMessageRead,
} from "@/features/messages/actions/manage-message";
import { updateMessageStatus } from "@/features/messages/services/messages.service";
import { requirePermission } from "@/lib/auth/require-permission";
import { getAdminMessage } from "@/lib/queries/admin/messages";
import { createClientSafe } from "@/lib/supabase/safe";

export default async function AdminMessageDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requirePermission("messages:read");
  const { id } = await params;
  const message = await getAdminMessage(id);
  if (!message) notFound();

  // Marquer comme lu après chargement réussi (sans appeler une Server Action en render)
  if (message.status === "unread" || message.status === "nouveau") {
    const supabase = await createClientSafe();
    if (supabase) {
      await updateMessageStatus(supabase, id, "read");
      revalidatePath("/admin");
      revalidatePath("/admin/messages");
      message.status = "read";
    }
  }

  return (
    <main className="mx-auto max-w-3xl space-y-6 p-6">
      <AdminPageHeader
        title={message.subject || "Message"}
        description={`${message.name} · ${message.email}`}
        backFallbackHref="/admin/messages"
      />

      <section className="space-y-3 rounded-xl border bg-white p-5 text-sm">
        <div className="flex flex-wrap gap-3 text-[var(--afd-muted)]">
          <span>
            Date :{" "}
            {message.created_at?.slice(0, 16)?.replace("T", " ") ?? "—"}
          </span>
          <span>Statut : {message.status ?? "—"}</span>
          {message.phone ? <span>Tél. : {message.phone}</span> : null}
          {message.organisation ? (
            <span>Organisation : {message.organisation}</span>
          ) : null}
          {message.request_type ? (
            <span>Type : {message.request_type}</span>
          ) : null}
          {message.province ? <span>Province : {message.province}</span> : null}
          {message.email_notification_status ? (
            <span>E-mail notif. : {message.email_notification_status}</span>
          ) : null}
        </div>
        <div className="whitespace-pre-wrap leading-relaxed text-[var(--admin-text)]">
          {message.message || "—"}
        </div>
        <div className="flex flex-wrap gap-2 border-t pt-4">
          <form action={markMessageRead.bind(null, id)}>
            <button type="submit" className="rounded border px-3 py-2 text-sm font-medium">
              Marquer comme lu
            </button>
          </form>
          <form action={markMessagePending.bind(null, id)}>
            <button type="submit" className="rounded border px-3 py-2 text-sm font-medium">
              En traitement
            </button>
          </form>
          <Link
            href={`mailto:${message.email}?subject=${encodeURIComponent(`Re: ${message.subject ?? ""}`)}`}
            className="rounded bg-[var(--afd-blue)] px-3 py-2 text-sm font-medium text-white"
          >
            Répondre
          </Link>
        </div>
      </section>
    </main>
  );
}
