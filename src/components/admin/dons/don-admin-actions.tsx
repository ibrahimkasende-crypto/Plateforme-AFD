"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { rejectBankDon, verifyBankDon } from "@/features/dons/actions/manage-don";
import { BANK_TRANSFER_METHOD } from "@/features/dons/config/bank-donation";
import type { Don } from "@/lib/queries/admin/dons";

export function DonAdminActions({ don }: { don: Don }) {
  const [pending, startTransition] = useTransition();
  const canReview =
    don.payment_method === BANK_TRANSFER_METHOD &&
    ["pending", "proof_submitted"].includes(don.status ?? "");

  if (!canReview) return null;

  return (
    <section className="flex flex-wrap gap-3 rounded border bg-white p-5">
      <button
        type="button"
        disabled={pending}
        className="rounded bg-emerald-700 px-4 py-2 text-sm text-white disabled:opacity-50"
        onClick={() => {
          if (!window.confirm("Confirmer la réception réelle de ce virement ?")) return;
          startTransition(async () => {
            const res = await verifyBankDon(don.id);
            if (!res.ok) toast.error(res.message);
            else toast.success(res.message);
          });
        }}
      >
        Confirmer la réception
      </button>
      <button
        type="button"
        disabled={pending}
        className="rounded border border-red-300 px-4 py-2 text-sm text-red-700 disabled:opacity-50"
        onClick={() => {
          const reason = window.prompt("Motif du rejet (facultatif) :") ?? undefined;
          if (!window.confirm("Rejeter ce don ?")) return;
          startTransition(async () => {
            const res = await rejectBankDon(don.id, reason);
            if (!res.ok) toast.error(res.message);
            else toast.success(res.message);
          });
        }}
      >
        Rejeter
      </button>
    </section>
  );
}
