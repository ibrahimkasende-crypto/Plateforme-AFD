"use client";

import { Smartphone, Copy, ExternalLink } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  formatDonationAmount,
  type BankDonationCurrency,
} from "@/features/dons/config/bank-donation";

/** Canal USSD officiel Equity BCDC RDC (Eazzy) — pas de format public avec compte prérempli. */
export const EQUITY_EAZZY_USSD = "*420#";
export const EQUITY_EAZZY_TEL_HREF = "tel:*420%23";
export const EQUITY_MOBILE_PLAY_STORE =
  "https://play.google.com/store/apps/details?id=ke.co.equitygroup.equitymobilebcdc";

type EquityUssdActionsProps = {
  account: string;
  amount: number;
  currency: BankDonationCurrency;
  reference: string;
  accountHolder: string;
};

export function EquityUssdActions({
  account,
  amount,
  currency,
  reference,
  accountHolder,
}: EquityUssdActionsProps) {
  const [copiedPack, setCopiedPack] = useState(false);

  const summary = useMemo(() => {
    const amt = `${formatDonationAmount(amount, currency)} ${currency}`;
    return [
      `Don AFD — virement Equity BCDC`,
      `Bénéficiaire : ${accountHolder}`,
      `Compte ${currency} : ${account}`,
      `Montant : ${amt}`,
      `Référence (communication) : ${reference}`,
      `USSD Equity Eazzy : ${EQUITY_EAZZY_USSD}`,
    ].join("\n");
  }, [account, accountHolder, amount, currency, reference]);

  async function copyPack() {
    try {
      await navigator.clipboard.writeText(summary);
      setCopiedPack(true);
      toast.success("Coordonnées copiées — collez-les dans Eazzy / votre banque.");
      window.setTimeout(() => setCopiedPack(false), 2500);
    } catch {
      toast.error("Impossible de copier. Utilisez les boutons Copier individuels.");
    }
  }

  async function copyAccount() {
    try {
      await navigator.clipboard.writeText(account);
      toast.success("Numéro de compte copié.");
    } catch {
      toast.error("Copie impossible.");
    }
  }

  return (
    <div className="space-y-4 rounded-2xl border border-[var(--afd-border)] bg-[var(--afd-surface)] p-4 sm:p-5">
      <div className="flex items-start gap-3">
        <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-[var(--afd-blue)]/10 text-[var(--afd-blue)]">
          <Smartphone className="size-5" aria-hidden />
        </span>
        <div>
          <h3 className="font-display text-base font-semibold text-[var(--afd-ink)]">
            Paiement rapide Equity Eazzy (*420#)
          </h3>
          <p className="mt-1 text-sm text-[var(--afd-muted)]">
            Equity BCDC n’autorise pas un USSD avec compte et montant déjà remplis. Le site ouvre
            le menu officiel <strong className="text-[var(--afd-ink)]">{EQUITY_EAZZY_USSD}</strong> ;
            vous collez ensuite le compte AFD et confirmez avec votre PIN.
          </p>
        </div>
      </div>

      <ol className="list-decimal space-y-2 pl-5 text-sm text-[var(--afd-muted)]">
        <li>
          Sur mobile (ligne liée à votre compte Equity BCDC), ouvrez{" "}
          <strong className="text-[var(--afd-ink)]">{EQUITY_EAZZY_USSD}</strong>.
        </li>
        <li>
          Choisissez le transfert vers un autre compte Equity BCDC ({currency}).
        </li>
        <li>
          Collez le numéro de compte AFD, saisissez le montant{" "}
          <strong className="text-[var(--afd-ink)]">
            {formatDonationAmount(amount, currency)} {currency}
          </strong>
          , puis indiquez la référence{" "}
          <strong className="font-mono text-[var(--afd-ink)]">{reference}</strong> si demandé.
        </li>
        <li>Confirmez le virement avec votre code PIN Eazzy.</li>
      </ol>

      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        <a
          href={EQUITY_EAZZY_TEL_HREF}
          className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-[var(--afd-blue)] px-4 text-sm font-bold text-white transition hover:opacity-95"
        >
          <Smartphone className="size-4" aria-hidden />
          Ouvrir {EQUITY_EAZZY_USSD}
        </a>
        <button
          type="button"
          onClick={() => void copyAccount()}
          className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl border border-[var(--afd-border)] bg-white px-4 text-sm font-semibold text-[var(--afd-ink)]"
        >
          <Copy className="size-4" aria-hidden />
          Copier le compte AFD
        </button>
        <button
          type="button"
          onClick={() => void copyPack()}
          className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl border border-[var(--afd-border)] bg-white px-4 text-sm font-semibold text-[var(--afd-ink)]"
        >
          <Copy className="size-4" aria-hidden />
          {copiedPack ? "✓ Tout copié" : "Copier tout (compte + montant + réf.)"}
        </button>
      </div>

      <a
        href={EQUITY_MOBILE_PLAY_STORE}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--afd-blue)]"
      >
        <ExternalLink className="size-4" aria-hidden />
        Ouvrir l’app Equity BCDC Mobile
      </a>

      <p className="text-xs text-[var(--afd-muted)]">
        Réservé aux clients Equity BCDC abonnés à Eazzy. Sur iPhone, composez manuellement{" "}
        {EQUITY_EAZZY_USSD} si le lien n’ouvre pas le menu. Si votre banque n’est pas Equity,
        utilisez votre application bancaire avec les coordonnées ci-dessus.
      </p>
    </div>
  );
}
