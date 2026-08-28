"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Building2, CreditCard, Smartphone } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState, useTransition, type FormEvent } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import {
  checkboxClassName,
  errorClassName,
  fieldClassName,
  formClassName,
  labelClassName,
  submitClassName,
} from "@/components/ui/form-styles";
import { BankDetailsCard } from "@/components/public/dons/bank-details-card";
import {
  QUICK_AMOUNTS,
  formatDonationAmount,
  type BankDonationCurrency,
} from "@/features/dons/config/bank-donation";
import {
  createBankDonationIntentAction,
  getPrefillDonorAction,
  submitBankTransferProofAction,
} from "@/features/dons/actions/bank-donation";
import type { Database } from "@/types/database.types";

type BankCoordinates = Database["public"]["Tables"]["dons_coordonnees_bancaires"]["Row"];

type PaymentMethodId = "bank_transfer" | "card" | "mobile_money";
type Step = "donate" | "transfer" | "done";

const donorSchema = z.object({
  donor_name: z.string().trim().min(2, "Le nom est requis").max(120),
  donor_email: z.string().trim().email("Adresse e-mail invalide"),
  donor_phone: z.string().trim().max(40).optional(),
  consent: z
    .boolean()
    .refine((v) => v === true, { message: "Veuillez accepter le traitement de vos données." }),
});

type DonorValues = z.infer<typeof donorSchema>;

type SupportDonationWizardProps = {
  bankCoordinates: BankCoordinates;
  cardPaymentAvailable: boolean;
};

const methodTileClass =
  "flex flex-col items-center gap-2 rounded-2xl border px-3 py-4 text-center transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--afd-blue)]";

export function SupportDonationWizard({
  bankCoordinates,
  cardPaymentAvailable,
}: SupportDonationWizardProps) {
  const [step, setStep] = useState<Step>("donate");
  const [method, setMethod] = useState<PaymentMethodId>("bank_transfer");
  const [currency, setCurrency] = useState<BankDonationCurrency>("USD");
  const [amount, setAmount] = useState<string>("10");
  const [customAmount, setCustomAmount] = useState(false);
  const [amountError, setAmountError] = useState<string | null>(null);
  const [donationId, setDonationId] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [doneMessage, setDoneMessage] = useState<string | null>(null);

  const donorForm = useForm<DonorValues>({
    resolver: zodResolver(donorSchema),
    defaultValues: {
      donor_name: "",
      donor_email: "",
      donor_phone: "",
      consent: false,
    },
    mode: "onSubmit",
  });

  useEffect(() => {
    void getPrefillDonorAction().then((prefill) => {
      if (prefill.name) donorForm.setValue("donor_name", prefill.name);
      if (prefill.email) donorForm.setValue("donor_email", prefill.email);
      if (prefill.phone) donorForm.setValue("donor_phone", prefill.phone);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const quickAmounts = useMemo(() => QUICK_AMOUNTS[currency], [currency]);
  const parsedAmount = Number(amount);
  const usdOk = bankCoordinates.usd_enabled !== false;
  const cdfOk = bankCoordinates.cdf_enabled !== false;

  function selectMethod(next: PaymentMethodId) {
    setMethod(next);
    if (next === "card" && !cardPaymentAvailable) {
      toast.message("Carte Visa / Mastercard", {
        description: "Bientôt disponible — contrat marchand AFD en cours.",
      });
      return;
    }
    if (next === "mobile_money") {
      toast.message("Mobile Money", {
        description: "Bientôt disponible sur Plateforme-AFD.",
      });
    }
  }

  function onInvalid(errors: typeof donorForm.formState.errors) {
    const first =
      errors.donor_name?.message ||
      errors.donor_email?.message ||
      errors.consent?.message ||
      "Veuillez compléter le formulaire.";
    toast.error(first);
  }

  function onFormSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const hp = (
      event.currentTarget.elements.namedItem("afd_hp_company") as HTMLInputElement | null
    )?.value?.trim();
    if (hp) {
      setStep("done");
      setDoneMessage("Votre déclaration de don a bien été enregistrée. Merci.");
      return;
    }
    void donorForm.handleSubmit(onDonorSubmit, onInvalid)(event);
  }

  function onDonorSubmit(values: DonorValues) {
    if (method !== "bank_transfer") {
      toast.message(
        method === "card" ? "Carte bientôt disponible" : "Mobile Money bientôt disponible",
      );
      setMethod("bank_transfer");
      return;
    }

    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setAmountError("Sélectionnez ou saisissez un montant.");
      toast.error("Sélectionnez ou saisissez un montant.");
      return;
    }
    setAmountError(null);

    startTransition(async () => {
      try {
        const result = await createBankDonationIntentAction({
          donor_name: values.donor_name,
          donor_email: values.donor_email,
          donor_phone: values.donor_phone?.trim() || undefined,
          donor_country: "République démocratique du Congo",
          support_type: "don_general",
          amount: parsedAmount,
          currency,
          consent: true as const,
          is_anonymous: false,
        });

        if (!result.ok) {
          toast.error(result.message || "Impossible d’enregistrer le don.");
          return;
        }

        if (!result.reference) {
          toast.error("La référence de don n’a pas pu être générée. Réessayez.");
          return;
        }

        setDonationId(result.donationId ?? null);
        setReference(result.reference);
        setStep("transfer");
        toast.success("Référence créée — effectuez le virement.");
      } catch {
        toast.error("Une erreur est survenue. Veuillez réessayer.");
      }
    });
  }

  function onProofSubmit(formData: FormData) {
    if (!donationId) return;
    formData.set("donationId", donationId);
    startTransition(async () => {
      try {
        const result = await submitBankTransferProofAction(formData);
        if (!result.ok) {
          toast.error(result.message);
          return;
        }
        setDoneMessage(result.message);
        setStep("done");
      } catch {
        toast.error("Échec de l’envoi de la preuve. Réessayez.");
      }
    });
  }

  return (
    <div className="space-y-6">
      {step === "donate" ? (
        <form
          onSubmit={onFormSubmit}
          className={`${formClassName} space-y-6`}
          noValidate
        >
          <div className="space-y-3">
            <h3 className="font-display text-lg font-semibold text-[var(--afd-ink)]">
              Moyen de paiement
            </h3>
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => selectMethod("bank_transfer")}
                aria-pressed={method === "bank_transfer"}
                className={`${methodTileClass} ${
                  method === "bank_transfer"
                    ? "border-[var(--afd-blue)] bg-[var(--afd-blue)]/5 shadow-sm"
                    : "border-[var(--afd-border)] bg-white hover:border-[var(--afd-blue)]"
                }`}
              >
                <span className="inline-flex size-11 items-center justify-center rounded-full bg-[var(--afd-blue)]/10 text-[var(--afd-blue)]">
                  <Building2 className="size-5" aria-hidden />
                </span>
                <span className="text-xs font-semibold text-[var(--afd-ink)] sm:text-sm">
                  Virement
                </span>
                <span className="text-[10px] text-[var(--afd-muted)] sm:text-xs">Banque</span>
              </button>

              <button
                type="button"
                onClick={() => selectMethod("card")}
                aria-pressed={method === "card"}
                className={`${methodTileClass} ${
                  method === "card"
                    ? "border-[var(--afd-border)] bg-[var(--afd-surface)]"
                    : "border-dashed border-[var(--afd-border)] bg-[var(--afd-surface)]"
                }`}
              >
                <span className="inline-flex size-11 items-center justify-center rounded-full bg-[var(--afd-orange)]/10 text-[var(--afd-orange)]">
                  <CreditCard className="size-5" aria-hidden />
                </span>
                <span className="text-xs font-semibold text-[var(--afd-ink)] sm:text-sm">
                  Carte
                </span>
                <span className="text-[10px] font-medium text-[var(--afd-orange)] sm:text-xs">
                  {cardPaymentAvailable ? "Visa / MC" : "Bientôt"}
                </span>
              </button>

              <button
                type="button"
                onClick={() => selectMethod("mobile_money")}
                aria-pressed={method === "mobile_money"}
                className={`${methodTileClass} border-dashed border-[var(--afd-border)] bg-[var(--afd-surface)]`}
              >
                <span className="inline-flex size-11 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-700">
                  <Smartphone className="size-5" aria-hidden />
                </span>
                <span className="text-xs font-semibold text-[var(--afd-ink)] sm:text-sm">
                  Mobile Money
                </span>
                <span className="text-[10px] font-medium text-[var(--afd-orange)] sm:text-xs">
                  Bientôt
                </span>
              </button>
            </div>
          </div>

          {method === "bank_transfer" ? (
            <>
              <div className="space-y-3">
                <h3 className="font-display text-base font-semibold text-[var(--afd-ink)]">
                  Montant
                </h3>
                <div className="flex gap-2">
                  {usdOk ? (
                    <button
                      type="button"
                      onClick={() => {
                        setCurrency("USD");
                        setAmount(String(QUICK_AMOUNTS.USD[0]));
                        setCustomAmount(false);
                        setAmountError(null);
                      }}
                      className={`rounded-lg border px-4 py-2 text-sm font-semibold ${
                        currency === "USD"
                          ? "border-[var(--afd-blue)] bg-[var(--afd-blue)] text-white"
                          : "border-[var(--afd-border)]"
                      }`}
                    >
                      USD
                    </button>
                  ) : null}
                  {cdfOk ? (
                    <button
                      type="button"
                      onClick={() => {
                        setCurrency("CDF");
                        setAmount(String(QUICK_AMOUNTS.CDF[0]));
                        setCustomAmount(false);
                        setAmountError(null);
                      }}
                      className={`rounded-lg border px-4 py-2 text-sm font-semibold ${
                        currency === "CDF"
                          ? "border-[var(--afd-blue)] bg-[var(--afd-blue)] text-white"
                          : "border-[var(--afd-border)]"
                      }`}
                    >
                      CDF
                    </button>
                  ) : null}
                </div>
                <div className="flex flex-wrap gap-2">
                  {quickAmounts.map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => {
                        setCustomAmount(false);
                        setAmount(String(value));
                        setAmountError(null);
                      }}
                      className={`rounded-lg border px-3 py-2 text-sm font-semibold ${
                        amount === String(value) && !customAmount
                          ? "border-[var(--afd-blue)] bg-[var(--afd-blue)] text-white"
                          : "border-[var(--afd-border)]"
                      }`}
                    >
                      {formatDonationAmount(value, currency)} {currency}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      setCustomAmount(true);
                      setAmount("");
                      setAmountError(null);
                    }}
                    className={`rounded-lg border px-3 py-2 text-sm font-semibold ${
                      customAmount
                        ? "border-[var(--afd-blue)] bg-[var(--afd-blue)] text-white"
                        : "border-[var(--afd-border)]"
                    }`}
                  >
                    Autre
                  </button>
                </div>
                {customAmount ? (
                  <input
                    type="number"
                    min={1}
                    step={currency === "CDF" ? 1 : 0.01}
                    className={fieldClassName}
                    placeholder={`Montant en ${currency}`}
                    value={amount}
                    onChange={(e) => {
                      setAmount(e.target.value);
                      setAmountError(null);
                    }}
                  />
                ) : null}
                {amountError ? <p className={errorClassName}>{amountError}</p> : null}
              </div>

              <div className="space-y-4">
                <h3 className="font-display text-base font-semibold text-[var(--afd-ink)]">
                  Vos coordonnées
                </h3>
                {/* Honeypot hors RHF (évite l’autofill qui bloquait le submit sans message) */}
                <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden>
                  <label htmlFor="afd_hp_company">Société</label>
                  <input
                    id="afd_hp_company"
                    name="afd_hp_company"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelClassName} htmlFor="donor_name">
                      Nom complet
                    </label>
                    <input
                      id="donor_name"
                      className={fieldClassName}
                      autoComplete="name"
                      {...donorForm.register("donor_name")}
                    />
                    {donorForm.formState.errors.donor_name ? (
                      <p className={errorClassName}>{donorForm.formState.errors.donor_name.message}</p>
                    ) : null}
                  </div>
                  <div>
                    <label className={labelClassName} htmlFor="donor_email">
                      E-mail
                    </label>
                    <input
                      id="donor_email"
                      type="email"
                      className={fieldClassName}
                      autoComplete="email"
                      {...donorForm.register("donor_email")}
                    />
                    {donorForm.formState.errors.donor_email ? (
                      <p className={errorClassName}>{donorForm.formState.errors.donor_email.message}</p>
                    ) : null}
                  </div>
                </div>
                <div>
                  <label className={labelClassName} htmlFor="donor_phone">
                    Téléphone <span className="font-normal text-[var(--afd-muted)]">(facultatif)</span>
                  </label>
                  <input
                    id="donor_phone"
                    type="tel"
                    className={fieldClassName}
                    autoComplete="tel"
                    {...donorForm.register("donor_phone")}
                  />
                </div>
                <label className="flex items-start gap-3 text-sm text-[var(--afd-muted)]">
                  <input
                    type="checkbox"
                    className={checkboxClassName}
                    {...donorForm.register("consent")}
                  />
                  <span>
                    J’accepte le traitement de mes données pour ce don.{" "}
                    <Link href="/politique-confidentialite" className="font-semibold text-[var(--afd-blue)]">
                      Confidentialité
                    </Link>
                  </span>
                </label>
                {donorForm.formState.errors.consent ? (
                  <p className={errorClassName}>{donorForm.formState.errors.consent.message}</p>
                ) : null}
              </div>

              <button type="submit" disabled={pending} className={submitClassName}>
                {pending ? "Préparation…" : "Obtenir les coordonnées bancaires"}
              </button>
            </>
          ) : (
            <p className="rounded-xl border border-dashed border-[var(--afd-border)] bg-[var(--afd-surface)] px-4 py-4 text-sm text-[var(--afd-muted)]">
              {method === "card"
                ? "Le paiement par carte Visa / Mastercard sera activé dès que le contrat marchand AFD sera en place."
                : "Le paiement Mobile Money sera proposé dès qu’un canal officiel AFD sera disponible."}{" "}
              En attendant, choisissez le <strong className="text-[var(--afd-ink)]">virement bancaire</strong>.
            </p>
          )}
        </form>
      ) : null}

      {step === "transfer" && reference ? (
        <div className="space-y-5">
          <BankDetailsCard
            coords={bankCoordinates}
            currency={currency}
            reference={reference}
            amount={parsedAmount}
          />
          <div className="space-y-3 rounded-2xl border border-[var(--afd-border)] bg-white p-4">
            <h3 className="font-display text-base font-semibold text-[var(--afd-ink)]">
              Preuve de virement
            </h3>
            <p className="text-sm text-[var(--afd-muted)]">
              Après le virement, joignez un PDF ou une photo (JPG/PNG). Le don reste en attente
              jusqu’à vérification par l’AFD.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                onProofSubmit(new FormData(e.currentTarget));
              }}
              className="space-y-4"
            >
              <input type="hidden" name="donationId" value={donationId ?? ""} />
              <input
                type="file"
                name="proof"
                accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
                required
                className="block w-full text-sm"
              />
              <button type="submit" disabled={pending} className={submitClassName}>
                {pending ? "Envoi…" : "Envoyer la preuve"}
              </button>
            </form>
          </div>
        </div>
      ) : null}

      {step === "done" ? (
        <div
          role="status"
          className="space-y-3 rounded-2xl border border-[var(--afd-border)] bg-[var(--afd-accent-soft)] px-5 py-5 text-[var(--afd-ink)]"
        >
          <h3 className="font-display text-xl font-semibold">Merci pour votre soutien</h3>
          <p className="text-sm leading-relaxed">
            {doneMessage ??
              "Votre déclaration a été enregistrée. Confirmation après vérification du virement par l’AFD."}
          </p>
          {reference ? (
            <p className="rounded-lg bg-white/70 px-3 py-2 font-mono text-sm">
              Référence : <strong>{reference}</strong>
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
