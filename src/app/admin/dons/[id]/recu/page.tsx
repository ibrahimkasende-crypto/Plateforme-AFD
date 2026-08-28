import { notFound } from "next/navigation";
import { PrintReceiptButton } from "@/components/admin/dons/print-receipt-button";
import { formatDonationAmount } from "@/features/dons/config/bank-donation";
import { requirePermission } from "@/lib/auth/require-permission";
import { getAdminDonById } from "@/lib/queries/admin/dons";

export default async function DonReceiptPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requirePermission("dons:read");
  const { id } = await params;
  const don = await getAdminDonById(id);
  if (!don) notFound();
  if (!["verified", "confirmed"].includes(don.status ?? "")) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-2xl space-y-6 bg-white p-8 text-[var(--afd-ink)] print:p-0">
      <div className="flex items-start justify-between gap-4 border-b pb-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--afd-muted)]">
            Reçu officiel
          </p>
          <h1 className="mt-1 font-display text-2xl font-semibold">
            ALLIANCE DES FEMMES POUR LE DÉVELOPPEMENT
          </h1>
        </div>
        <PrintReceiptButton />
      </div>

      <dl className="space-y-3 text-sm">
        <div>
          <dt className="text-[var(--afd-muted)]">Référence du don</dt>
          <dd className="font-mono font-semibold">{don.reference}</dd>
        </div>
        <div>
          <dt className="text-[var(--afd-muted)]">Nom du donateur</dt>
          <dd className="font-semibold">
            {don.is_anonymous ? "Don anonyme" : don.donor_name}
          </dd>
        </div>
        <div>
          <dt className="text-[var(--afd-muted)]">Montant</dt>
          <dd className="font-semibold">
            {formatDonationAmount(don.amount, don.currency ?? "USD")} {don.currency}
          </dd>
        </div>
        <div>
          <dt className="text-[var(--afd-muted)]">Devise</dt>
          <dd>{don.currency}</dd>
        </div>
        <div>
          <dt className="text-[var(--afd-muted)]">Date</dt>
          <dd>{(don.verified_at ?? don.created_at)?.slice(0, 10)}</dd>
        </div>
        <div>
          <dt className="text-[var(--afd-muted)]">Méthode</dt>
          <dd>
            {don.payment_method === "bank_transfer" || don.payment_method === "virement"
              ? "Virement bancaire"
              : don.payment_method}
          </dd>
        </div>
        <div>
          <dt className="text-[var(--afd-muted)]">Statut</dt>
          <dd className="font-semibold text-emerald-700">Confirmé</dd>
        </div>
      </dl>

      <p className="pt-6 text-xs text-[var(--afd-muted)]">
        Document généré après validation administrative de la réception du don par l’AFD.
      </p>
    </main>
  );
}
