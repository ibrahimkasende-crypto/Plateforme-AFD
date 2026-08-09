import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ExternalLink, Mail } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/module/admin-page-header";
import { AssociateMailboxForm } from "@/features/messagerie/components/associate-mailbox-form";
import { MailboxStatusActions } from "@/features/messagerie/components/mailbox-status-actions";
import { listMailboxes } from "@/features/messagerie/services/mailbox.service";
import { isSuperActor } from "@/features/identity/security/privilege-guards";
import {
  cyberpanelCreateEmailUrl,
  cyberpanelEmailListUrl,
  getCyberPanelConfig,
} from "@/lib/cyberpanel/client";
import { requireAdmin } from "@/lib/auth/require-admin";
import { createClientSafe } from "@/lib/supabase/safe";

export const metadata: Metadata = {
  title: "Comptes email professionnels",
  robots: { index: false, follow: false },
};

export default async function MessagerieComptesPage() {
  const session = await requireAdmin("/admin/messagerie/comptes");
  const allowed =
    isSuperActor(session.roles) ||
    session.roles.includes("admin_principal_it");
  if (!allowed) redirect("/acces-refuse");

  const supabase = await createClientSafe();
  const mailboxes = supabase ? await listMailboxes(supabase) : [];
  const cp = getCyberPanelConfig();

  let users: Array<{ id: string; email: string; nom_complet: string | null }> =
    [];
  if (supabase) {
    const { data } = await supabase
      .from("profils_administrateurs" as never)
      .select("id, email, nom_complet")
      .eq("actif", true)
      .order("email")
      .limit(500);
    users = (data ?? []) as typeof users;
  }

  const linkedUserIds = new Set(mailboxes.map((m) => m.user_id));
  const unlinked = users.filter((u) => !linkedUserIds.has(u.id));

  return (
    <main className="mx-auto w-full max-w-5xl space-y-6 p-4 md:p-6">
      <AdminPageHeader
        title="Comptes email professionnels"
        description="Association dashboard ↔ boîtes @afd-rdc.org. Les opérations CyberPanel s’ouvrent dans un nouvel onglet, sans transmission automatique d’identifiants."
        backFallbackHref="/admin/messagerie"
      />

      <section className="flex flex-wrap gap-2">
        <a
          href={cyberpanelEmailListUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold"
        >
          Lister les emails (CyberPanel)
          <ExternalLink className="size-3.5" />
        </a>
        <a
          href={cyberpanelCreateEmailUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold"
        >
          Créer un email (CyberPanel)
          <ExternalLink className="size-3.5" />
        </a>
        <p className="w-full text-xs text-slate-500">
          Panneau : {cp.panelUrl} · API :{" "}
          {cp.hasCredentials ? "credentials serveur présents (non exposés)" : "non configurée"}
        </p>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4">
        <h2 className="text-sm font-semibold text-slate-900">
          Associer une adresse à un utilisateur
        </h2>
        <AssociateMailboxForm users={users} />
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 space-y-3">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-900">
          <Mail className="size-4" />
          Boîtes associées ({mailboxes.length})
        </h2>
        {mailboxes.length === 0 ? (
          <p className="text-sm text-slate-600">Aucune boîte enregistrée.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {mailboxes.map((box) => {
              const user = users.find((u) => u.id === box.user_id);
              return (
                <li
                  key={box.id}
                  className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-slate-900">
                      {box.email_address}
                    </p>
                    <p className="text-xs text-slate-500">
                      {user?.nom_complet || user?.email || box.user_id} ·{" "}
                      {box.mailbox_status}
                      {box.imap_enabled ? " · IMAP" : ""}
                      {box.smtp_enabled ? " · SMTP" : ""}
                    </p>
                  </div>
                  <MailboxStatusActions
                    mailboxId={box.id}
                    status={box.mailbox_status}
                  />
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 space-y-3">
        <h2 className="text-sm font-semibold text-slate-900">
          Utilisateurs sans boîte associée ({unlinked.length})
        </h2>
        {unlinked.length === 0 ? (
          <p className="text-sm text-slate-600">Tous les comptes actifs ont une boîte, ou aucun utilisateur.</p>
        ) : (
          <ul className="grid gap-1 text-sm text-slate-700 sm:grid-cols-2">
            {unlinked.slice(0, 40).map((u) => (
              <li key={u.id} className="truncate">
                {u.nom_complet || "—"} &lt;{u.email}&gt;
              </li>
            ))}
          </ul>
        )}
        {unlinked.length > 40 ? (
          <p className="text-xs text-slate-500">… et {unlinked.length - 40} autres</p>
        ) : null}
      </section>

      <p className="text-sm">
        <Link href="/admin/messagerie" className="font-semibold hover:underline">
          ← Ma messagerie
        </Link>
      </p>
    </main>
  );
}
