import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/module/admin-page-header";
import { DonAdminActions } from "@/components/admin/dons/don-admin-actions";
import { STATUS_LABELS, formatDonationAmount } from "@/features/dons/config/bank-donation";
import { getDonProofSignedUrl } from "@/features/dons/actions/manage-don";
import { requirePermission } from "@/lib/auth/require-permission";
import {
  getAdminDonById,
  getDonProofs,
  getDonStatusHistory,
} from "@/lib/queries/admin/dons";

export default async function AdminDonDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requirePermission("dons:read");
  const { id } = await params;
  const don = await getAdminDonById(id);
  if (!don) notFound();

  const [proofs, history] = await Promise.all([
    getDonProofs(don.id),
    getDonStatusHistory(don.id),
  ]);

  const proofLinks = await Promise.all(
    proofs.map(async (p) => ({
      ...p,
      url: await getDonProofSignedUrl(don.id, p.storage_path),
    })),
  );

  return (
    <main className="space-y-6 p-6">
      <AdminPageHeader
        title={don.reference ?? "Détail du don"}
        description="Fiche donateur, preuve et validation."
        actions={
          <Link href="/admin/dons" className="rounded border px-3 py-2 text-sm">
            Retour à la liste
          </Link>
        }
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="space-y-3 rounded border bg-white p-5 text-sm">
          <h2 className="font-semibold">Donateur</h2>
          <p>
            <strong>Nom :</strong> {don.is_anonymous ? "Don anonyme" : don.donor_name}
          </p>
          <p>
            <strong>E-mail :</strong> {don.donor_email}
          </p>
          <p>
            <strong>Téléphone :</strong> {don.donor_phone || "—"}
          </p>
          <p>
            <strong>Pays :</strong> {don.donor_country || "—"}
          </p>
          <p>
            <strong>Message :</strong> {don.message || "—"}
          </p>
        </section>

        <section className="space-y-3 rounded border bg-white p-5 text-sm">
          <h2 className="font-semibold">Don</h2>
          <p>
            <strong>Montant :</strong>{" "}
            {formatDonationAmount(don.amount, don.currency ?? "USD")} {don.currency}
          </p>
          <p>
            <strong>Devise :</strong> {don.currency}
          </p>
          <p>
            <strong>Méthode :</strong> {don.payment_method}
          </p>
          <p>
            <strong>Compte AFD destinataire :</strong>{" "}
            <span className="break-all font-mono">{don.beneficiary_account || "—"}</span>
          </p>
          <p>
            <strong>Banque :</strong> {don.bank_name || "—"}
          </p>
          <p>
            <strong>Référence :</strong> {don.reference || "—"}
          </p>
          <p>
            <strong>Date :</strong> {don.created_at?.slice(0, 19) || "—"}
          </p>
          <p>
            <strong>Statut :</strong> {STATUS_LABELS[don.status ?? ""] ?? don.status}
          </p>
        </section>
      </div>

      <section className="space-y-3 rounded border bg-white p-5">
        <h2 className="font-semibold">Preuves</h2>
        {proofLinks.length === 0 ? (
          <p className="text-sm text-[var(--afd-muted)]">Aucune preuve téléversée.</p>
        ) : (
          <ul className="space-y-2 text-sm">
            {proofLinks.map((p) => (
              <li key={p.id} className="flex flex-wrap items-center justify-between gap-2 border-t py-2">
                <span>
                  {p.original_filename || p.storage_path} · {p.uploaded_at.slice(0, 19)}
                </span>
                {p.url ? (
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold text-[var(--afd-blue)]"
                  >
                    Voir la preuve
                  </a>
                ) : (
                  <span className="text-[var(--afd-muted)]">Lien indisponible</span>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="space-y-3 rounded border bg-white p-5">
        <h2 className="font-semibold">Historique</h2>
        {history.length === 0 ? (
          <p className="text-sm text-[var(--afd-muted)]">Aucun événement.</p>
        ) : (
          <ul className="space-y-2 text-sm">
            {history.map((h) => (
              <li key={h.id} className="border-t py-2">
                {h.created_at.slice(0, 19)} · {h.from_status ?? "∅"} → {h.to_status}
                {h.note ? ` — ${h.note}` : ""}
              </li>
            ))}
          </ul>
        )}
      </section>

      <DonAdminActions don={don} />

      {don.status === "verified" || don.status === "confirmed" ? (
        <Link
          href={`/admin/dons/${don.id}/recu`}
          className="inline-flex rounded bg-[var(--afd-blue)] px-4 py-2 text-sm text-white"
        >
          Télécharger / imprimer le reçu
        </Link>
      ) : null}
    </main>
  );
}
