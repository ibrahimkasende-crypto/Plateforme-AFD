"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useEffect, useMemo, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import {
  checkboxClassName,
  errorClassName,
  fieldClassName,
  formClassName,
  formShellClassName,
  labelClassName,
  submitClassName,
} from "@/components/ui/form-styles";
import { BankDetailsCard } from "@/components/public/dons/bank-details-card";
import { siteConfig, type AllowedCurrency, type SupportType } from "@/config/site";
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
import { createDonationIntentAction } from "@/features/dons/actions/create-donation-intent";
import type { Database } from "@/types/database.types";

type BankCoordinates = Database["public"]["Tables"]["dons_coordonnees_bancaires"]["Row"];

const SUPPORT_TYPE_LABELS: Record<SupportType, string> = {
  don_general: "Don général",
  soutien_programme: "Soutien à un programme",
  soutien_projet: "Soutien à un projet",
  soutien_urgence: "Soutien aux urgences",
  partenariat_institutionnel: "Partenariat institutionnel",
  contribution_nature: "Contribution en nature",
};

type PaymentMethodChoice = "bank_transfer" | "serdipay";
type Step =
  | "method"
  | "currency"
  | "amount"
  | "donor"
  | "instructions"
  | "proof"
  | "done"
  | "serdipay";

const donorSchema = z.object({
  donor_name: z.string().trim().min(2, "Le nom est requis").max(120),
  donor_email: z.string().trim().email("Adresse e-mail invalide"),
  donor_phone: z.string().trim().max(40).optional(),
  donor_country: z.string().trim().min(2, "Le pays est requis").max(80),
  message: z.string().trim().max(1000).optional(),
  is_anonymous: z.boolean().optional(),
  support_type: z.enum(siteConfig.supportTypes, {
    error: "Veuillez sélectionner un type de soutien",
  }),
  consent: z.boolean().refine((v) => v === true, {
    message: "Le consentement est obligatoire",
  }),
  website: z.string().max(0).optional(),
});

type DonorValues = z.infer<typeof donorSchema>;

const serdipaySchema = z.object({
  donor_name: z.string().trim().min(2).max(120),
  donor_email: z.string().trim().email(),
  donor_phone: z.string().trim().max(40).optional(),
  amount: z
    .string()
    .trim()
    .min(1)
    .refine((v) => !Number.isNaN(Number(v)) && Number(v) > 0),
  currency: z.enum(siteConfig.currencies),
  support_type: z.enum(siteConfig.supportTypes),
  message: z.string().trim().max(1000).optional(),
  consent: z.boolean().refine((v) => v === true),
  website: z.string().max(0).optional(),
});

type SerdipayValues = z.infer<typeof serdipaySchema>;

type SupportDonationWizardProps = {
  bankCoordinates: BankCoordinates;
  serdiPayAvailable: boolean;
};

export function SupportDonationWizard({
  bankCoordinates,
  serdiPayAvailable,
}: SupportDonationWizardProps) {
  const [step, setStep] = useState<Step>("method");
  const [currency, setCurrency] = useState<BankDonationCurrency>("USD");
  const [amount, setAmount] = useState<string>("");
  const [customAmount, setCustomAmount] = useState(false);
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
      donor_country: "République démocratique du Congo",
      message: "",
      is_anonymous: false,
      support_type: undefined,
      consent: false,
      website: "",
    },
  });

  const serdipayForm = useForm<SerdipayValues>({
    resolver: zodResolver(serdipaySchema),
    defaultValues: {
      donor_name: "",
      donor_email: "",
      donor_phone: "",
      amount: "",
      currency: siteConfig.defaultCurrency,
      support_type: undefined,
      message: "",
      consent: false,
      website: "",
    },
  });

  useEffect(() => {
    void getPrefillDonorAction().then((prefill) => {
      if (prefill.name) {
        donorForm.setValue("donor_name", prefill.name);
        serdipayForm.setValue("donor_name", prefill.name);
      }
      if (prefill.email) {
        donorForm.setValue("donor_email", prefill.email);
        serdipayForm.setValue("donor_email", prefill.email);
      }
      if (prefill.phone) {
        donorForm.setValue("donor_phone", prefill.phone);
        serdipayForm.setValue("donor_phone", prefill.phone);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const quickAmounts = useMemo(() => QUICK_AMOUNTS[currency], [currency]);
  const parsedAmount = Number(amount);

  function chooseMethod(next: PaymentMethodChoice) {
    if (next === "serdipay") setStep("serdipay");
    else setStep("currency");
  }

  function onDonorSubmit(values: DonorValues) {
    if (!parsedAmount || parsedAmount <= 0) {
      toast.error("Indiquez un montant valide.");
      setStep("amount");
      return;
    }
    startTransition(async () => {
      const result = await createBankDonationIntentAction({
        ...values,
        amount: parsedAmount,
        currency,
        consent: true,
      });
      if (!result.ok) {
        toast.error(result.message);
        return;
      }
      setDonationId(result.donationId ?? null);
      setReference(result.reference ?? null);
      setStep("instructions");
      toast.success("Référence de don créée.");
    });
  }

  function onSerdipaySubmit(values: SerdipayValues) {
    startTransition(async () => {
      const supportLabel = SUPPORT_TYPE_LABELS[values.support_type];
      const composedMessage = [
        `Type de soutien : ${supportLabel}`,
        values.message?.trim(),
      ]
        .filter(Boolean)
        .join("\n\n");
      const result = await createDonationIntentAction({
        donor_name: values.donor_name,
        donor_email: values.donor_email,
        donor_phone: values.donor_phone,
        amount: Number(values.amount),
        currency: values.currency as AllowedCurrency,
        message: composedMessage || undefined,
        consent: true,
        website: values.website,
      });
      if (!result.ok) {
        toast.error(result.message);
        return;
      }
      setDoneMessage(result.message);
      setStep("done");
      toast.success(result.message);
    });
  }

  function onProofSubmit(formData: FormData) {
    if (!donationId) return;
    formData.set("donationId", donationId);
    startTransition(async () => {
      const result = await submitBankTransferProofAction(formData);
      if (!result.ok) {
        toast.error(result.message);
        return;
      }
      setDoneMessage(result.message);
      setStep("done");
    });
  }

  return (
    <div className="space-y-6">
      {step === "method" ? (
        <div className="space-y-4">
          <h3 className="font-display text-lg font-semibold text-[var(--afd-ink)]">
            Choisir un moyen de paiement
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => chooseMethod("bank_transfer")}
              className="rounded-2xl border border-[var(--afd-border)] bg-white p-5 text-left transition hover:border-[var(--afd-blue)] hover:shadow-sm"
            >
              <p className="font-semibold text-[var(--afd-ink)]">Virement bancaire</p>
              <p className="mt-2 text-sm text-[var(--afd-muted)]">
                USD ou CDF vers les comptes officiels Equity BCDC de l’AFD.
              </p>
            </button>
            <button
              type="button"
              onClick={() => chooseMethod("serdipay")}
              className="rounded-2xl border border-[var(--afd-border)] bg-white p-5 text-left transition hover:border-[var(--afd-blue)] hover:shadow-sm"
            >
              <p className="font-semibold text-[var(--afd-ink)]">Paiement en ligne / Mobile Money</p>
              <p className="mt-2 text-sm text-[var(--afd-muted)]">
                {serdiPayAvailable
                  ? "Via SerdiPay (module en cours d’activation complète)."
                  : "SerdiPay sera activé après configuration officielle — vous pouvez enregistrer une intention."}
              </p>
            </button>
          </div>
        </div>
      ) : null}

      {step === "currency" ? (
        <div className="space-y-4">
          <h3 className="font-display text-lg font-semibold">
            Dans quelle devise souhaitez-vous effectuer votre don ?
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {(["USD", "CDF"] as const)
              .filter((c) => (c === "USD" ? bankCoordinates.usd_enabled : bankCoordinates.cdf_enabled))
              .map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => {
                    setCurrency(c);
                    setAmount("");
                    setCustomAmount(false);
                    setStep("amount");
                  }}
                  className="rounded-2xl border border-[var(--afd-border)] bg-white px-4 py-5 text-left font-semibold hover:border-[var(--afd-blue)]"
                >
                  {c === "USD" ? "USD — Dollar américain" : "CDF — Franc congolais"}
                </button>
              ))}
          </div>
          <button type="button" className="text-sm text-[var(--afd-blue)]" onClick={() => setStep("method")}>
            ← Retour
          </button>
        </div>
      ) : null}

      {step === "amount" ? (
        <div className="space-y-4">
          <h3 className="font-display text-lg font-semibold">Montant du don ({currency})</h3>
          <div className="flex flex-wrap gap-2">
            {quickAmounts.map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => {
                  setCustomAmount(false);
                  setAmount(String(value));
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
              }}
              className={`rounded-lg border px-3 py-2 text-sm font-semibold ${
                customAmount
                  ? "border-[var(--afd-blue)] bg-[var(--afd-blue)] text-white"
                  : "border-[var(--afd-border)]"
              }`}
            >
              Autre montant
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
              onChange={(e) => setAmount(e.target.value)}
            />
          ) : null}
          <div className="flex flex-wrap gap-3">
            <button type="button" className="text-sm text-[var(--afd-blue)]" onClick={() => setStep("currency")}>
              ← Retour
            </button>
            <button
              type="button"
              disabled={!parsedAmount || parsedAmount <= 0}
              className={submitClassName}
              onClick={() => setStep("donor")}
            >
              Continuer
            </button>
          </div>
        </div>
      ) : null}

      {step === "donor" ? (
        <div className={formShellClassName}>
          <form onSubmit={donorForm.handleSubmit(onDonorSubmit)} className={formClassName} noValidate>
            <p className="text-sm text-[var(--afd-muted)]">
              Montant :{" "}
              <strong className="text-[var(--afd-ink)]">
                {formatDonationAmount(parsedAmount, currency)} {currency}
              </strong>
            </p>
            <div className="sr-only" aria-hidden>
              <input type="text" tabIndex={-1} autoComplete="off" {...donorForm.register("website")} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClassName}>Nom complet</label>
                <input className={fieldClassName} {...donorForm.register("donor_name")} />
                {donorForm.formState.errors.donor_name ? (
                  <p className={errorClassName}>{donorForm.formState.errors.donor_name.message}</p>
                ) : null}
              </div>
              <div>
                <label className={labelClassName}>E-mail</label>
                <input type="email" className={fieldClassName} {...donorForm.register("donor_email")} />
                {donorForm.formState.errors.donor_email ? (
                  <p className={errorClassName}>{donorForm.formState.errors.donor_email.message}</p>
                ) : null}
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClassName}>
                  Téléphone <span className="font-normal text-[var(--afd-muted)]">(facultatif)</span>
                </label>
                <input type="tel" className={fieldClassName} {...donorForm.register("donor_phone")} />
              </div>
              <div>
                <label className={labelClassName}>Pays</label>
                <input className={fieldClassName} {...donorForm.register("donor_country")} />
                {donorForm.formState.errors.donor_country ? (
                  <p className={errorClassName}>{donorForm.formState.errors.donor_country.message}</p>
                ) : null}
              </div>
            </div>
            <div>
              <label className={labelClassName}>Type de soutien</label>
              <select
                className="min-h-12 w-full rounded-lg border border-[var(--afd-border)] bg-[var(--afd-background)] px-3"
                {...donorForm.register("support_type")}
              >
                <option value="">Sélectionner</option>
                {siteConfig.supportTypes.map((type) => (
                  <option key={type} value={type}>
                    {SUPPORT_TYPE_LABELS[type]}
                  </option>
                ))}
              </select>
              {donorForm.formState.errors.support_type ? (
                <p className={errorClassName}>{donorForm.formState.errors.support_type.message}</p>
              ) : null}
            </div>
            <div>
              <label className={labelClassName}>
                Message <span className="font-normal text-[var(--afd-muted)]">(facultatif)</span>
              </label>
              <textarea rows={3} className="min-h-24 w-full rounded-lg border px-3 py-3" {...donorForm.register("message")} />
            </div>
            <label className="flex items-start gap-3 text-sm text-[var(--afd-muted)]">
              <input type="checkbox" className={checkboxClassName} {...donorForm.register("is_anonymous")} />
              <span>Don anonyme (le nom ne sera pas affiché publiquement)</span>
            </label>
            <label className="flex items-start gap-3 text-sm text-[var(--afd-muted)]">
              <input type="checkbox" className={checkboxClassName} {...donorForm.register("consent")} />
              <span>
                J’accepte que l’AFD traite mes données pour enregistrer mon don.{" "}
                <Link href="/politique-confidentialite" className="font-semibold text-[var(--afd-blue)]">
                  Politique de confidentialité
                </Link>
              </span>
            </label>
            {donorForm.formState.errors.consent ? (
              <p className={errorClassName}>{donorForm.formState.errors.consent.message}</p>
            ) : null}
            <div className="flex flex-wrap gap-3">
              <button type="button" className="text-sm text-[var(--afd-blue)]" onClick={() => setStep("amount")}>
                ← Retour
              </button>
              <button type="submit" disabled={pending} className={submitClassName}>
                {pending ? "Enregistrement…" : "Continuer vers les coordonnées bancaires"}
              </button>
            </div>
          </form>
        </div>
      ) : null}

      {step === "instructions" && reference ? (
        <div className="space-y-5">
          <BankDetailsCard coords={bankCoordinates} currency={currency} reference={reference} />
          <p className="text-sm text-[var(--afd-muted)]">
            Effectuez le virement depuis votre application bancaire, puis revenez ici pour déclarer
            l’envoi et joindre une preuve.
          </p>
          <button type="button" className={submitClassName} onClick={() => setStep("proof")}>
            J’ai effectué le virement
          </button>
        </div>
      ) : null}

      {step === "proof" && donationId ? (
        <div className="space-y-4">
          <h3 className="font-display text-lg font-semibold">Ajouter une preuve de paiement</h3>
          <p className="text-sm text-[var(--afd-muted)]">
            Formats acceptés : PDF, JPG, JPEG, PNG. Votre don restera « en attente de vérification »
            jusqu’à confirmation par l’AFD.
          </p>
          {reference ? (
            <p className="rounded-lg bg-[var(--afd-accent-soft)] px-3 py-2 text-sm">
              Référence : <strong>{reference}</strong>
            </p>
          ) : null}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              onProofSubmit(fd);
            }}
            className="space-y-4"
          >
            <input type="hidden" name="donationId" value={donationId} />
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
      ) : null}

      {step === "serdipay" ? (
        <div className={formShellClassName}>
          <form
            onSubmit={serdipayForm.handleSubmit(onSerdipaySubmit)}
            className={formClassName}
            noValidate
          >
            <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
              SerdiPay n’est pas encore pleinement activé. Ce formulaire enregistre une intention —
              aucun paiement en ligne n’est confirmé ici.
            </p>
            <div className="sr-only" aria-hidden>
              <input type="text" tabIndex={-1} autoComplete="off" {...serdipayForm.register("website")} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClassName}>Nom complet</label>
                <input className={fieldClassName} {...serdipayForm.register("donor_name")} />
              </div>
              <div>
                <label className={labelClassName}>E-mail</label>
                <input type="email" className={fieldClassName} {...serdipayForm.register("donor_email")} />
              </div>
            </div>
            <div>
              <label className={labelClassName}>Téléphone (facultatif)</label>
              <input type="tel" className={fieldClassName} {...serdipayForm.register("donor_phone")} />
            </div>
            <div>
              <label className={labelClassName}>Type de soutien</label>
              <select
                className="min-h-12 w-full rounded-lg border px-3"
                {...serdipayForm.register("support_type")}
              >
                <option value="">Sélectionner</option>
                {siteConfig.supportTypes.map((type) => (
                  <option key={type} value={type}>
                    {SUPPORT_TYPE_LABELS[type]}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
              <div>
                <label className={labelClassName}>Montant</label>
                <input type="number" min={1} step="0.01" className={fieldClassName} {...serdipayForm.register("amount")} />
              </div>
              <div>
                <label className={labelClassName}>Devise</label>
                <select className="min-h-12 rounded-lg border px-3" {...serdipayForm.register("currency")}>
                  {siteConfig.currencies.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className={labelClassName}>Message (facultatif)</label>
              <textarea rows={3} className="min-h-24 w-full rounded-lg border px-3 py-3" {...serdipayForm.register("message")} />
            </div>
            <label className="flex items-start gap-3 text-sm text-[var(--afd-muted)]">
              <input type="checkbox" className={checkboxClassName} {...serdipayForm.register("consent")} />
              <span>J’accepte le traitement de mes données pour cette intention de soutien.</span>
            </label>
            <div className="flex flex-wrap gap-3">
              <button type="button" className="text-sm text-[var(--afd-blue)]" onClick={() => setStep("method")}>
                ← Retour
              </button>
              <button type="submit" disabled={pending} className={submitClassName}>
                {pending ? "Enregistrement…" : "Enregistrer mon intention"}
              </button>
            </div>
          </form>
        </div>
      ) : null}

      {step === "done" ? (
        <div
          role="status"
          className="space-y-3 rounded-2xl border border-[var(--afd-border)] bg-[var(--afd-accent-soft)] px-5 py-5 text-[var(--afd-ink)]"
        >
          <h3 className="font-display text-xl font-semibold">Merci pour votre soutien à l’AFD</h3>
          <p className="text-sm leading-relaxed">
            {doneMessage ??
              "Votre déclaration de don a bien été enregistrée. Votre don sera confirmé après vérification de la réception du virement par l’AFD."}
          </p>
          {reference ? (
            <p className="rounded-lg bg-white/70 px-3 py-2 font-mono text-sm">
              Référence : <strong>{reference}</strong>
            </p>
          ) : null}
          <p className="text-xs text-[var(--afd-muted)]">
            Aucun « paiement réussi » n’est confirmé avant validation manuelle par l’AFD.
          </p>
        </div>
      ) : null}
    </div>
  );
}
