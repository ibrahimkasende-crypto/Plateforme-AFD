"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { NewsletterGoogleButton } from "@/components/newsletter/newsletter-google-button";
import {
  checkboxClassName,
  errorClassName,
  fieldClassName,
  formClassName,
  formShellClassName,
  labelClassName,
  submitClassName,
} from "@/components/ui/form-styles";
import { homeContent } from "@/config/home-content";
import { subscribeNewsletterAction } from "@/features/newsletter/actions/subscribe";
import { markNewsletterSubscribed } from "@/lib/newsletter/client-storage";

const formSchema = z.object({
  email: z.string().trim().email("Adresse e-mail invalide"),
  interests: z.array(z.string()).optional(),
  consent: z.boolean().refine((value) => value === true, {
    message: "Le consentement est obligatoire",
  }),
  website: z.string().max(0).optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function NewsletterPageForm() {
  const [pending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      interests: [],
      consent: false,
      website: "",
    },
  });

  const selectedInterests = watch("interests") ?? [];
  const consentChecked = watch("consent");

  function toggleInterest(id: string) {
    const next = selectedInterests.includes(id)
      ? selectedInterests.filter((item) => item !== id)
      : [...selectedInterests, id];
    setValue("interests", next, { shouldValidate: true });
  }

  function onSubmit(values: FormValues) {
    startTransition(async () => {
      const result = await subscribeNewsletterAction({
        email: values.email,
        preferences: values.interests ?? [],
        consent: true,
        website: values.website,
        source: "page_newsletter",
      });

      if (!result.ok) {
        toast.error(result.message);
        return;
      }

      markNewsletterSubscribed();
      toast.success(result.message);
      reset();
    });
  }

  return (
    <div className={formShellClassName}>
    <form onSubmit={handleSubmit(onSubmit)} className={formClassName} noValidate>
      <div className="sr-only" aria-hidden>
        <label htmlFor="newsletter-website">Site web</label>
        <input
          id="newsletter-website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          {...register("website")}
        />
      </div>

      <NewsletterGoogleButton
        consentChecked={Boolean(consentChecked)}
        disabled={pending}
        returnPath="/ressources/newsletter"
      />

      <div className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-wide text-[var(--afd-muted)]">
        <span className="h-px flex-1 bg-[var(--afd-border)]" />
        ou
        <span className="h-px flex-1 bg-[var(--afd-border)]" />
      </div>

      <div>
        <label
          htmlFor="newsletter-email"
          className={labelClassName}
        >
          E-mail
        </label>
        <input
          id="newsletter-email"
          type="email"
          className={fieldClassName}
          {...register("email")}
        />
        {errors.email ? (
          <p className={errorClassName}>{errors.email.message}</p>
        ) : null}
      </div>

      <fieldset className="space-y-3">
        <legend className="text-sm font-semibold text-[var(--afd-ink)]">
          Centres d’intérêt{" "}
          <span className="font-normal text-[var(--afd-muted)]">(facultatif)</span>
        </legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {homeContent.newsletter.interests.map((interest) => (
            <label
              key={interest.id}
              className="afd-interest-chip"
            >
              <input
                type="checkbox"
                className={checkboxClassName}
                checked={selectedInterests.includes(interest.id)}
                onChange={() => toggleInterest(interest.id)}
              />
              {interest.label}
            </label>
          ))}
        </div>
      </fieldset>

      <label className="flex items-start gap-3 text-sm leading-relaxed text-[var(--afd-muted)]">
        <input
          type="checkbox"
          className={checkboxClassName}
          {...register("consent")}
        />
        <span>
          {homeContent.newsletter.consentLabel}{" "}
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
        {pending ? "Inscription…" : "S’inscrire à la newsletter"}
      </button>
    </form>
    </div>
  );
}
