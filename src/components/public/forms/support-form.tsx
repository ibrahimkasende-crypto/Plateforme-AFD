"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState, useTransition } from "react";
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
import { siteConfig, type AllowedCurrency, type SupportType } from "@/config/site";
import { createDonationIntentAction } from "@/features/dons/actions/create-donation-intent";

const SUPPORT_TYPE_LABELS: Record<SupportType, string> = {
  don_general: "Don général",
  soutien_programme: "Soutien à un programme",
  soutien_projet: "Soutien à un projet",
  soutien_urgence: "Soutien aux urgences",
  partenariat_institutionnel: "Partenariat institutionnel",
  contribution_nature: "Contribution en nature",
};

const formSchema = z.object({
  donor_name: z.string().trim().min(2, "Le nom est requis").max(120),
  donor_email: z.string().trim().email("Adresse e-mail invalide"),
  donor_phone: z.string().trim().max(40).optional(),
  amount: z
    .string()
    .trim()
    .min(1, "Le montant est requis")
    .refine((value) => !Number.isNaN(Number(value)) && Number(value) > 0, {
      message: "Le montant doit être positif",
    }),
  currency: z.enum(siteConfig.currencies),
  support_type: z.enum(siteConfig.supportTypes, {
    error: "Veuillez sélectionner un type de soutien",
  }),
  message: z.string().trim().max(1000).optional(),
  consent: z.boolean().refine((value) => value === true, {
    message: "Le consentement est obligatoire",
  }),
  website: z.string().max(0).optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function SupportForm() {
  const [pending, startTransition] = useTransition();
  const [intentRecorded, setIntentRecorded] = useState(false);
  const [lastMessage, setLastMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
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

  function onSubmit(values: FormValues) {
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
        setIntentRecorded(false);
        setLastMessage(null);
        return;
      }

      setIntentRecorded(true);
      setLastMessage(result.message);
      toast.success(result.message);
      reset();
    });
  }

  return (
    <div className="space-y-6">
      {intentRecorded && lastMessage ? (
        <div
          role="status"
          className="rounded-xl border border-[var(--afd-border)] bg-[var(--afd-accent-soft)] px-4 py-3 text-sm leading-relaxed text-[var(--afd-ink)]"
        >
          {lastMessage}
        </div>
      ) : null}

      <div className={formShellClassName}>
      <form onSubmit={handleSubmit(onSubmit)} className={formClassName} noValidate>
        <div className="sr-only" aria-hidden>
          <label htmlFor="support-website">Site web</label>
          <input
            id="support-website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            {...register("website")}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="support-name"
              className={labelClassName}
            >
              Nom complet
            </label>
            <input
              id="support-name"
              type="text"
              className={fieldClassName}
              {...register("donor_name")}
            />
            {errors.donor_name ? (
              <p className={errorClassName}>
                {errors.donor_name.message}
              </p>
            ) : null}
          </div>

          <div>
            <label
              htmlFor="support-email"
              className={labelClassName}
            >
              E-mail
            </label>
            <input
              id="support-email"
              type="email"
              className={fieldClassName}
              {...register("donor_email")}
            />
            {errors.donor_email ? (
              <p className={errorClassName}>
                {errors.donor_email.message}
              </p>
            ) : null}
          </div>
        </div>

        <div>
          <label
            htmlFor="support-phone"
            className={labelClassName}
          >
            Téléphone <span className="font-normal text-[var(--afd-muted)]">(facultatif)</span>
          </label>
          <input
            id="support-phone"
            type="tel"
            className={fieldClassName}
            {...register("donor_phone")}
          />
        </div>

        <div>
          <label
            htmlFor="support-type"
            className={labelClassName}
          >
            Type de soutien
          </label>
          <select
            id="support-type"
            className="min-h-12 w-full rounded-lg border border-[var(--afd-border)] bg-[var(--afd-background)] px-3 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--afd-blue)]"
            {...register("support_type")}
          >
            <option value="">Sélectionner</option>
            {siteConfig.supportTypes.map((type) => (
              <option key={type} value={type}>
                {SUPPORT_TYPE_LABELS[type]}
              </option>
            ))}
          </select>
          {errors.support_type ? (
            <p className={errorClassName}>
              {errors.support_type.message}
            </p>
          ) : null}
        </div>

        <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
          <div>
            <label
              htmlFor="support-amount"
              className={labelClassName}
            >
              Montant
            </label>
            <input
              id="support-amount"
              type="number"
              min="1"
              step="0.01"
              className={fieldClassName}
              {...register("amount")}
            />
            {errors.amount ? (
              <p className={errorClassName}>
                {errors.amount.message}
              </p>
            ) : null}
          </div>

          <div>
            <label
              htmlFor="support-currency"
              className={labelClassName}
            >
              Devise
            </label>
            <select
              id="support-currency"
              className="min-h-12 w-full rounded-lg border border-[var(--afd-border)] bg-[var(--afd-background)] px-3 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--afd-blue)]"
              {...register("currency")}
            >
              {siteConfig.currencies.map((currency) => (
                <option key={currency} value={currency}>
                  {currency}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label
            htmlFor="support-message"
            className={labelClassName}
          >
            Message <span className="font-normal text-[var(--afd-muted)]">(facultatif)</span>
          </label>
          <textarea
            id="support-message"
            rows={4}
            className="min-h-28 w-full rounded-lg border border-[var(--afd-border)] px-3 py-3 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--afd-blue)]"
            {...register("message")}
          />
        </div>

        <label className="flex items-start gap-3 text-sm leading-relaxed text-[var(--afd-muted)]">
          <input
            type="checkbox"
            className={checkboxClassName}
            {...register("consent")}
          />
          <span>
            J’accepte que l’AFD traite mes données pour enregistrer mon intention de soutien.{" "}
            <Link
              href="/politique-confidentialite"
              className="font-semibold text-[var(--afd-blue)] underline-offset-2 hover:underline"
            >
              Politique de confidentialité
            </Link>
          </span>
        </label>
        {errors.consent ? (
          <p className={errorClassName}>{errors.consent.message}</p>
        ) : null}

        <button
          type="submit"
          disabled={pending}
          className={submitClassName}
        >
          {pending ? "Enregistrement…" : "Enregistrer mon intention de soutien"}
        </button>
      </form>
      </div>
    </div>
  );
}
