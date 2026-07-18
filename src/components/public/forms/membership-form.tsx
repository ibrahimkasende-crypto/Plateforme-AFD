"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useTransition } from "react";
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
  selectClassName,
  submitClassName,
  textareaClassName,
} from "@/components/ui/form-styles";
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
    <div className={formShellClassName}>
    <form onSubmit={handleSubmit(onSubmit)} className={formClassName} noValidate>
      <div className="sr-only" aria-hidden>
        <label htmlFor="membership-website">Site web</label>
        <input id="membership-website" type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="membership-name" className={labelClassName}>
            Nom complet
          </label>
          <input
            id="membership-name"
            type="text"
            className={fieldClassName}
            {...register("full_name")}
          />
          {errors.full_name ? <p className={errorClassName}>{errors.full_name.message}</p> : null}
        </div>

        <div>
          <label htmlFor="membership-email" className={labelClassName}>
            E-mail
          </label>
          <input
            id="membership-email"
            type="email"
            className={fieldClassName}
            {...register("email")}
          />
          {errors.email ? <p className={errorClassName}>{errors.email.message}</p> : null}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="membership-phone" className={labelClassName}>
            Téléphone
          </label>
          <input
            id="membership-phone"
            type="tel"
            className={fieldClassName}
            {...register("phone")}
          />
          {errors.phone ? <p className={errorClassName}>{errors.phone.message}</p> : null}
        </div>

        <div>
          <label htmlFor="membership-gender" className={labelClassName}>
            Genre
          </label>
          <select
            id="membership-gender"
            className={selectClassName}
            {...register("gender")}
          >
            <option value="">Sélectionner</option>
            {GENDER_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.gender ? <p className={errorClassName}>{errors.gender.message}</p> : null}
        </div>
      </div>

      <div>
        <label htmlFor="membership-address" className={labelClassName}>
          Adresse
        </label>
        <input
          id="membership-address"
          type="text"
          className={fieldClassName}
          {...register("address")}
        />
        {errors.address ? <p className={errorClassName}>{errors.address.message}</p> : null}
      </div>

      <div>
        <label htmlFor="membership-type" className={labelClassName}>
          Type de membre
        </label>
        <select
          id="membership-type"
          className={selectClassName}
          {...register("member_type")}
        >
          <option value="">Sélectionner</option>
          {MEMBER_TYPE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {errors.member_type ? <p className={errorClassName}>{errors.member_type.message}</p> : null}
      </div>

      <div>
        <label htmlFor="membership-motivation" className={labelClassName}>
          Motivation
        </label>
        <textarea
          id="membership-motivation"
          rows={5}
          className={textareaClassName}
          {...register("motivation")}
        />
        {errors.motivation ? <p className={errorClassName}>{errors.motivation.message}</p> : null}
      </div>

      <label className="flex items-start gap-3 text-sm leading-relaxed text-[var(--afd-muted)]">
        <input type="checkbox" className={checkboxClassName} {...register("consent")} />
        <span>
          J’accepte que l’AFD traite mes données pour examiner ma demande d’adhésion.{" "}
          <Link href="/politique-confidentialite" className="font-semibold text-[var(--afd-blue)] underline-offset-2 hover:underline">
            Politique de confidentialité
          </Link>
        </span>
      </label>
      {errors.consent ? <p className={errorClassName}>{errors.consent.message}</p> : null}

      <button
        type="submit"
        disabled={pending}
        className={submitClassName}
      >
        {pending ? "Envoi en cours…" : "Soumettre ma demande"}
      </button>
    </form>
    </div>
  );
}
