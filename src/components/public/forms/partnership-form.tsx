"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { submitPartnershipAction } from "@/features/partenariat/actions/submit-partnership";

const formSchema = z.object({
  org_name: z.string().trim().min(2, "Le nom de l’organisation est requis").max(200),
  contact_name: z.string().trim().min(2, "Le nom du contact est requis").max(120),
  email: z.string().trim().email("Adresse e-mail invalide"),
  phone: z.string().trim().max(40).optional(),
  partnership_type: z.enum(
    ["institutionnel", "entreprise", "ong", "technique", "financier"],
    { error: "Veuillez sélectionner un type de partenariat" },
  ),
  org_description: z
    .string()
    .trim()
    .min(20, "Décrivez votre organisation (20 caractères minimum)")
    .max(3000),
  proposal: z
    .string()
    .trim()
    .min(20, "Décrivez votre proposition (20 caractères minimum)")
    .max(5000),
  consent: z.boolean().refine((value) => value === true, {
    message: "Le consentement est obligatoire",
  }),
  website: z.string().max(0).optional(),
});

type FormValues = z.infer<typeof formSchema>;

const PARTNERSHIP_OPTIONS = [
  { value: "institutionnel", label: "Partenariat institutionnel" },
  { value: "entreprise", label: "Entreprise" },
  { value: "ong", label: "ONG / association" },
  { value: "technique", label: "Partenaire technique" },
  { value: "financier", label: "Partenaire financier" },
] as const;

export function PartnershipForm() {
  const [pending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      org_name: "",
      contact_name: "",
      email: "",
      phone: "",
      partnership_type: undefined,
      org_description: "",
      proposal: "",
      consent: false,
      website: "",
    },
  });

  function onSubmit(values: FormValues) {
    startTransition(async () => {
      const result = await submitPartnershipAction({
        ...values,
        consent: true,
      });

      if (!result.ok) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      reset();
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="sr-only" aria-hidden>
        <label htmlFor="partnership-website">Site web</label>
        <input id="partnership-website" type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="partnership-org" className="mb-1 block text-sm font-semibold text-[var(--afd-ink)]">
            Organisation
          </label>
          <input
            id="partnership-org"
            type="text"
            className="min-h-12 w-full rounded-lg border border-[var(--afd-border)] px-3 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--afd-blue)]"
            {...register("org_name")}
          />
          {errors.org_name ? <p className="mt-1 text-sm text-[var(--afd-error)]">{errors.org_name.message}</p> : null}
        </div>

        <div>
          <label htmlFor="partnership-contact" className="mb-1 block text-sm font-semibold text-[var(--afd-ink)]">
            Personne de contact
          </label>
          <input
            id="partnership-contact"
            type="text"
            className="min-h-12 w-full rounded-lg border border-[var(--afd-border)] px-3 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--afd-blue)]"
            {...register("contact_name")}
          />
          {errors.contact_name ? <p className="mt-1 text-sm text-[var(--afd-error)]">{errors.contact_name.message}</p> : null}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="partnership-email" className="mb-1 block text-sm font-semibold text-[var(--afd-ink)]">
            E-mail
          </label>
          <input
            id="partnership-email"
            type="email"
            className="min-h-12 w-full rounded-lg border border-[var(--afd-border)] px-3 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--afd-blue)]"
            {...register("email")}
          />
          {errors.email ? <p className="mt-1 text-sm text-[var(--afd-error)]">{errors.email.message}</p> : null}
        </div>

        <div>
          <label htmlFor="partnership-phone" className="mb-1 block text-sm font-semibold text-[var(--afd-ink)]">
            Téléphone <span className="font-normal text-[var(--afd-muted)]">(facultatif)</span>
          </label>
          <input
            id="partnership-phone"
            type="tel"
            className="min-h-12 w-full rounded-lg border border-[var(--afd-border)] px-3 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--afd-blue)]"
            {...register("phone")}
          />
        </div>
      </div>

      <div>
        <label htmlFor="partnership-type" className="mb-1 block text-sm font-semibold text-[var(--afd-ink)]">
          Type de partenariat
        </label>
        <select
          id="partnership-type"
          className="min-h-12 w-full rounded-lg border border-[var(--afd-border)] bg-[var(--afd-background)] px-3 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--afd-blue)]"
          {...register("partnership_type")}
        >
          <option value="">Sélectionner</option>
          {PARTNERSHIP_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {errors.partnership_type ? (
          <p className="mt-1 text-sm text-[var(--afd-error)]">{errors.partnership_type.message}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="partnership-description" className="mb-1 block text-sm font-semibold text-[var(--afd-ink)]">
          Présentation de l’organisation
        </label>
        <textarea
          id="partnership-description"
          rows={4}
          className="min-h-28 w-full rounded-lg border border-[var(--afd-border)] px-3 py-3 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--afd-blue)]"
          {...register("org_description")}
        />
        {errors.org_description ? (
          <p className="mt-1 text-sm text-[var(--afd-error)]">{errors.org_description.message}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="partnership-proposal" className="mb-1 block text-sm font-semibold text-[var(--afd-ink)]">
          Proposition de collaboration
        </label>
        <textarea
          id="partnership-proposal"
          rows={5}
          className="min-h-32 w-full rounded-lg border border-[var(--afd-border)] px-3 py-3 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--afd-blue)]"
          {...register("proposal")}
        />
        {errors.proposal ? <p className="mt-1 text-sm text-[var(--afd-error)]">{errors.proposal.message}</p> : null}
      </div>

      <label className="flex items-start gap-3 text-sm leading-relaxed text-[var(--afd-muted)]">
        <input type="checkbox" className="mt-0.5 size-5 shrink-0 rounded border-[var(--afd-border)]" {...register("consent")} />
        <span>
          J’accepte que l’AFD traite mes données pour examiner ma proposition.{" "}
          <Link href="/politique-confidentialite" className="font-semibold text-[var(--afd-blue)] underline-offset-2 hover:underline">
            Politique de confidentialité
          </Link>
        </span>
      </label>
      {errors.consent ? <p className="text-sm text-[var(--afd-error)]">{errors.consent.message}</p> : null}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-12 items-center justify-center rounded-lg bg-[var(--afd-orange)] px-6 text-base font-bold text-white transition hover:bg-[var(--afd-orange-hover)] disabled:opacity-60"
      >
        {pending ? "Envoi en cours…" : "Proposer un partenariat"}
      </button>
    </form>
  );
}
