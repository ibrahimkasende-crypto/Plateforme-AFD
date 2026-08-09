import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink, Mail, ShieldAlert } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/module/admin-page-header";
import { RequestEmailPasswordResetButton } from "@/features/messagerie/components/request-password-reset-button";
import { getMailboxForUser } from "@/features/messagerie/services/mailbox.service";
import { getMailServerConfig } from "@/lib/mail/mail-config";
import { requireAdmin } from "@/lib/auth/require-admin";
import { createClientSafe } from "@/lib/supabase/safe";
import { isSuperActor } from "@/features/identity/security/privilege-guards";

export const metadata: Metadata = {
  title: "Messagerie professionnelle",
  robots: { index: false, follow: false },
};

export default async function AdminMessageriePage() {
  const session = await requireAdmin("/admin/messagerie");
  const cfg = getMailServerConfig();
  const supabase = await createClientSafe();
  const mailbox = supabase
    ? await getMailboxForUser(supabase, session.user.id)
    : null;

  const canManage =
    isSuperActor(session.roles) ||
    session.roles.includes("admin_principal_it");

  const statusLabel = mailbox
    ? {
        active: "Active",
        pending: "En attente",
        suspended: "Suspendue",
        disabled: "Désactivée",
        error: "Erreur",
      }[mailbox.mailbox_status]
    : "Aucune boîte associée";

  const unread =
    mailbox?.imap_enabled && mailbox.mailbox_status === "active"
      ? mailbox.unread_count
      : null;

  return (
    <main className="mx-auto w-full max-w-3xl space-y-6 p-4 md:p-6">
      <AdminPageHeader
        title="Messagerie professionnelle"
        description="Accédez à votre boîte @afd-rdc.org via le webmail sécurisé. Aucun identifiant administrateur CyberPanel n’est exposé ici."
        backFallbackHref="/admin"
      />

      {canManage ? (
        <p className="text-sm">
          <Link
            href="/admin/messagerie/comptes"
            className="font-semibold text-[var(--admin-primary)] hover:underline"
          >
            Gérer les comptes email →
          </Link>
        </p>
      ) : null}

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
        <div className="flex items-start gap-3">
          <span className="flex size-11 items-center justify-center rounded-xl bg-[var(--admin-primary)]/10 text-[var(--admin-primary)]">
            <Mail className="size-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Adresse professionnelle
            </p>
            <p className="mt-1 truncate text-lg font-semibold text-slate-900">
              {mailbox?.email_address ?? "Non configurée"}
            </p>
            <p className="mt-1 text-sm text-slate-600">
              Statut : <span className="font-medium">{statusLabel}</span>
              {unread != null ? (
                <>
                  {" · "}
                  Non lus : <span className="font-medium">{unread}</span>
                </>
              ) : null}
            </p>
          </div>
        </div>

        {mailbox?.mailbox_status === "active" && cfg.webmailUrl ? (
          <a
            href={cfg.webmailUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[var(--admin-primary,#0d254e)] px-4 text-sm font-semibold text-white"
          >
            Ouvrir ma messagerie professionnelle
            <ExternalLink className="size-4" />
          </a>
        ) : mailbox?.mailbox_status === "active" && !cfg.webmailUrl ? (
          <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
            <ShieldAlert className="mt-0.5 size-4 shrink-0" />
            <p>
              Boîte active, mais <code>MAIL_WEBMAIL_URL</code> n’est pas
              configurée côté serveur. Contactez l’IT.
            </p>
          </div>
        ) : (
          <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
            Aucune boîte professionnelle active n’est associée à votre compte
            dashboard. Demandez à l’administratrice IT de lier votre adresse
            @afd-rdc.org.
          </div>
        )}

        {mailbox ? (
          <RequestEmailPasswordResetButton />
        ) : null}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-700 space-y-2">
        <h2 className="font-semibold text-slate-900">Instructions</h2>
        <ol className="list-decimal space-y-1 pl-5">
          <li>
            Cliquez sur « Ouvrir ma messagerie professionnelle » (nouvel onglet).
          </li>
          <li>
            Connectez-vous avec votre adresse @afd-rdc.org et votre mot de passe
            email (distinct du mot de passe dashboard).
          </li>
          <li>
            Ne partagez jamais vos identifiants. En cas d’oubli, utilisez la
            demande de réinitialisation ci-dessus.
          </li>
        </ol>
        {!cfg.integratedMailEnabled ? (
          <p className="pt-2 text-xs text-slate-500">
            La lecture IMAP intégrée dans le dashboard (phase 2) n’est pas encore
            activée. Utilisez le webmail pour lire et envoyer vos messages.
          </p>
        ) : null}
      </section>
    </main>
  );
}
