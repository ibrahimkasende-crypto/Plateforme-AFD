"use client";

import { useState } from "react";
import type { Database } from "@/types/database.types";
import {
  accountForCurrency,
  formatDonationAmount,
  type BankDonationCurrency,
} from "@/features/dons/config/bank-donation";
import { CopyButton } from "@/components/public/dons/copy-button";
import { EquityUssdActions } from "@/components/public/dons/equity-ussd-actions";

type BankCoordinates = Database["public"]["Tables"]["dons_coordonnees_bancaires"]["Row"];

type BankDetailsCardProps = {
  coords: BankCoordinates;
  currency: BankDonationCurrency;
  reference?: string | null;
  amount?: number;
};

export function BankDetailsCard({
  coords,
  currency,
  reference,
  amount,
}: BankDetailsCardProps) {
  const [intlOpen, setIntlOpen] = useState(false);
  const account = accountForCurrency(coords, currency);
  const showUssd = Boolean(reference && amount && amount > 0);

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-2xl border border-[var(--afd-border)] bg-gradient-to-br from-[#0b3d5c] via-[#0f4c75] to-[#163a5f] p-5 text-white shadow-md md:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/70">
          Coordonnées bancaires AFD
        </p>
        <h3 className="mt-2 font-display text-xl font-semibold leading-snug">
          {coords.account_holder}
        </h3>

        <dl className="mt-5 space-y-4 text-sm">
          <div>
            <dt className="text-white/65">Banque</dt>
            <dd className="mt-1 font-medium">{coords.bank_name}</dd>
          </div>
          <div>
            <dt className="text-white/65">Devise</dt>
            <dd className="mt-1 font-medium">{currency}</dd>
          </div>
          {amount && amount > 0 ? (
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div className="min-w-0 flex-1">
                <dt className="text-white/65">Montant à virer</dt>
                <dd className="mt-1 font-mono text-base font-semibold tracking-wide">
                  {formatDonationAmount(amount, currency)} {currency}
                </dd>
              </div>
              <CopyButton value={`${amount}`} label="Copier montant" />
            </div>
          ) : null}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0 flex-1">
              <dt className="text-white/65">Numéro de compte</dt>
              <dd className="mt-1 break-all font-mono text-base font-semibold tracking-wide">
                {account}
              </dd>
            </div>
            <CopyButton value={account} />
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0 flex-1">
              <dt className="text-white/65">SWIFT</dt>
              <dd className="mt-1 font-mono text-base font-semibold">{coords.swift}</dd>
            </div>
            <CopyButton value={coords.swift} />
          </div>
          {reference ? (
            <div className="flex flex-col gap-2 border-t border-white/15 pt-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="min-w-0 flex-1">
                <dt className="text-white/65">Référence de votre don</dt>
                <dd className="mt-1 break-all font-mono text-base font-semibold">{reference}</dd>
                <p className="mt-1 text-xs text-white/70">
                  Indiquez cette référence comme communication du virement si votre banque le
                  permet.
                </p>
              </div>
              <CopyButton value={reference} />
            </div>
          ) : null}
        </dl>
      </div>

      {showUssd && reference && amount ? (
        <EquityUssdActions
          account={account}
          amount={amount}
          currency={currency}
          reference={reference}
          accountHolder={coords.account_holder}
        />
      ) : null}

      {coords.instructions ? (
        <p className="rounded-xl border border-[var(--afd-border)] bg-[var(--afd-surface)] px-4 py-3 text-sm text-[var(--afd-muted)]">
          {coords.instructions}
        </p>
      ) : null}

      <div className="rounded-xl border border-[var(--afd-border)] bg-white">
        <button
          type="button"
          className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-semibold text-[var(--afd-ink)]"
          onClick={() => setIntlOpen((v) => !v)}
          aria-expanded={intlOpen}
        >
          Vous effectuez un virement depuis l’étranger ?
          <span aria-hidden>{intlOpen ? "−" : "+"}</span>
        </button>
        {intlOpen ? (
          <div className="space-y-4 border-t border-[var(--afd-border)] px-4 py-4 text-sm text-[var(--afd-muted)]">
            {currency === "USD" ? (
              <div className="space-y-2">
                <p className="font-semibold text-[var(--afd-ink)]">Virement USD</p>
                <p>
                  <span className="font-medium text-[var(--afd-ink)]">Banque correspondante :</span>{" "}
                  {coords.correspondent_usd_bank}
                  <br />
                  {coords.correspondent_usd_address}
                  <br />
                  SWIFT : {coords.correspondent_usd_swift}
                </p>
                <p>
                  <span className="font-medium text-[var(--afd-ink)]">Banque bénéficiaire :</span>{" "}
                  Equity BCDC
                  <br />
                  SWIFT banque bénéficiaire : {coords.swift}
                  <br />
                  Compte bénéficiaire AFD : {coords.account_usd}
                </p>
              </div>
            ) : null}
            <div className="space-y-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-3 text-amber-950">
              <p className="font-semibold">Banque correspondante indiquée pour les paiements en euros</p>
              <p>
                {coords.correspondent_eur_bank}
                <br />
                {coords.correspondent_eur_address}
                <br />
                SWIFT : {coords.correspondent_eur_swift}
              </p>
              <p className="font-medium">
                {coords.eur_note ||
                  "Veuillez contacter l’AFD avant tout virement en EUR afin de confirmer le compte bénéficiaire et les instructions applicables."}
              </p>
              <p className="text-xs">
                L’AFD ne dispose pas d’un compte bénéficiaire en EUR dans le document bancaire
                officiel actuel.
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
