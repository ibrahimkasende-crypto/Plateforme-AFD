"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { submitMembershipAction } from "@/features/adhesions/actions/submit-membership";

const formSchema = z.object({
  full_name: z.string().trim().min(2, "Le nom est requis").max(120),
  email: z.string().trim().email("Adresse e-mail invalide"),
  phone: z.string().trim().min(6, "Le téléphone est requis").max(40),
  address: z.string().trim().min(5, "L’adresse est requise").max(300),
  gender: z.enum(["femme", "homme", "autre", "non_precise"], {
    error: "Veuillez sélectionner une option",
  }),
  member_type: z.enum(["actif", "sympathisant", "jeune", "institutionnel"], {
    error: "Veuillez sélectionner un type de membre",
  }),
  motivation: z.string().trim().min(20, "Décrivez votre motivation (20 caractères minimum)").max(3000),
  consent: z.boolean().refine((value) => value === true, {
    message: "Le consentement est obligatoire",
  }),
  website: z.string().max(0).optional(),
});

type FormValues = z.infer<typeof formSchema>;

const GENDER_OPTIONS = [
  { value: "femme", label: "Femme" },
  { value: "homme", label: "Homme" },
  { value: "autre", label: "Autre" },
  { value: "non_precise", label: "Ne souhaite pas préciser" },
] as const;

const MEMBER_TYPE_OPTIONS = [
  { value: "actif", label: "Membre actif" },
  { value: "sympathisant", label: "Membre sympathisant" },
  { value: "jeune", label: "Membre jeune" },
  { value: "institutionnel", label: "Membre institutionnel" },
] as const;

export function MembershipForm() {
  const [pending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: "",
      email: "",
      phone: "",
      address: "",
      gender: undefined,
      member_type: undefined,
      motivation: "",
      consent: false,
      website: "",
    },
  });

  function onSubmit(values: FormValues) {
    startTransition(async () => {
      const result = await submitMembershipAction({
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
        <label htmlFor="membership-website">Site web</label>
        <input id="membership-website" type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="membership-name" className="mb-1 block text-sm font-semibold text-[var(--afd-ink)]">
            Nom complet
          </label>
          <input
            id="membership-name"
            type="text"
            className="min-h-12 w-full rounded-lg border border-[var(--afd-border)] px-3 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--afd-blue)]"
            {...register("full_name")}
          />
          {errors.full_name ? <p className="mt-1 text-sm text-[var(--afd-error)]">{errors.full_name.message}</p> : null}
        </div>

        <div>
          <label htmlFor="membership-email" className="mb-1 block text-sm font-semibold text-[var(--afd-ink)]">
            E-mail
          </label>
          <input
            id="membership-email"
            type="email"
            className="min-h-12 w-full rounded-lg border border-[var(--afd-border)] px-3 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--afd-blue)]"
            {...register("email")}
          />
          {errors.email ? <p className="mt-1 text-sm text-[var(--afd-error)]">{errors.email.message}</p> : null}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="membership-phone" className="mb-1 block text-sm font-semibold text-[var(--afd-ink)]">
            Téléphone
          </label>
          <input
            id="membership-phone"
            type="tel"
            className="min-h-12 w-full rounded-lg border border-[var(--afd-border)] px-3 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--afd-blue)]"
            {...register("phone")}
          />
          {errors.phone ? <p className="mt-1 text-sm text-[var(--afd-error)]">{errors.phone.message}</p> : null}
        </div>

        <div>
          <label htmlFor="membership-gender" className="mb-1 block text-sm font-semibold text-[var(--afd-ink)]">
            Genre
          </label>
          <select
            id="membership-gender"
            className="min-h-12 w-full rounded-lg border border-[var(--afd-border)] bg-[var(--afd-background)] px-3 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--afd-blue)]"
            {...register("gender")}
          >
            <option value="">Sélectionner</option>
            {GENDER_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.gender ? <p className="mt-1 text-sm text-[var(--afd-error)]">{errors.gender.message}</p> : null}
        </div>
      </div>

      <div>
        <label htmlFor="membership-address" className="mb-1 block text-sm font-semibold text-[var(--afd-ink)]">
          Adresse
        </label>
        <input
          id="membership-address"
          type="text"
          className="min-h-12 w-full rounded-lg border border-[var(--afd-border)] px-3 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--afd-blue)]"
          {...register("address")}
        />
        {errors.address ? <p className="mt-1 text-sm text-[var(--afd-error)]">{errors.address.message}</p> : null}
      </div>

      <div>
        <label htmlFor="membership-type" className="mb-1 block text-sm font-semibold text-[var(--afd-ink)]">
          Type de membre
        </label>
        <select
          id="membership-type"
          className="min-h-12 w-full rounded-lg border border-[var(--afd-border)] bg-[var(--afd-background)] px-3 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--afd-blue)]"
          {...register("member_type")}
        >
          <option value="">Sélectionner</option>
          {MEMBER_TYPE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {errors.member_type ? <p className="mt-1 text-sm text-[var(--afd-error)]">{errors.member_type.message}</p> : null}
      </div>

      <div>
        <label htmlFor="membership-motivation" className="mb-1 block text-sm font-semibold text-[var(--afd-ink)]">
          Motivation
        </label>
        <textarea
          id="membership-motivation"
          rows={5}
          className="min-h-32 w-full rounded-lg border border-[var(--afd-border)] px-3 py-3 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--afd-blue)]"
          {...register("motivation")}
        />
        {errors.motivation ? <p className="mt-1 text-sm text-[var(--afd-error)]">{errors.motivation.message}</p> : null}
      </div>

      <label className="flex items-start gap-3 text-sm leading-relaxed text-[var(--afd-muted)]">
        <input type="checkbox" className="mt-0.5 size-5 shrink-0 rounded border-[var(--afd-border)]" {...register("consent")} />
        <span>
          J’accepte que l’AFD traite mes données pour examiner ma demande d’adhésion.{" "}
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
        {pending ? "Envoi en cours…" : "Soumettre ma demande"}
      </button>
    </form>
  );
}
