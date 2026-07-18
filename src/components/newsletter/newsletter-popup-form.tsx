"use client";

import {
  checkboxClassName,
  errorClassName,
  fieldClassName,
  labelClassName,
  submitClassName,
} from "@/components/ui/form-styles";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Heart } from "lucide-react";
import Link from "next/link";
import { NewsletterGoogleButton } from "@/components/newsletter/newsletter-google-button";
import { homeContent } from "@/config/home-content";
import { subscribeNewsletterAction } from "@/features/newsletter/actions/subscribe";
import { markNewsletterSubscribed } from "@/lib/newsletter/client-storage";

const formSchema = z.object({
  email: z.string().email("Adresse e-mail invalide"),
  consent: z.boolean().refine((value) => value === true, {
    message: "Le consentement est obligatoire",
  }),
  website: z.string().max(0).optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function NewsletterPopupForm({
  onSuccess,
}: {
  onSuccess: () => void;
}) {
  const [pending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      consent: false,
      website: "",
    },
  });

  const consentChecked = watch("consent");

  function onSubmit(values: FormValues) {
    startTransition(async () => {
      const result = await subscribeNewsletterAction({
        email: values.email,
        preferences: [],
        consent: true,
        website: values.website,
        source: "popup_accueil",
      });

      if (!result.ok) {
        toast.error(result.message);
        return;
      }

      markNewsletterSubscribed();
      setSuccess(true);
      toast.success(result.message);
      window.setTimeout(() => onSuccess(), 1400);
    });
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-6 text-center">
        <Heart className="afd-heart-breathe size-8 fill-[var(--afd-orange)] text-[var(--afd-orange)]" />
        <p className="font-heading text-lg font-extrabold text-[var(--afd-navy)]">
          Merci de suivre les actions de l’AFD
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="relative space-y-3" noValidate>
      <div className="sr-only" aria-hidden>
        <label htmlFor="popup-newsletter-website">Site web</label>
        <input
          id="popup-newsletter-website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          {...register("website")}
        />
      </div>

      <NewsletterGoogleButton
        consentChecked={Boolean(consentChecked)}
        disabled={pending}
        returnPath="/"
      />

      <div className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-wide text-[var(--afd-muted)]">
        <span className="h-px flex-1 bg-[var(--afd-border)]" />
        ou
        <span className="h-px flex-1 bg-[var(--afd-border)]" />
      </div>

      <div>
        <label
          htmlFor="popup-newsletter-email"
          className={labelClassName}
        >
          E-mail
        </label>
        <input
          id="popup-newsletter-email"
          type="email"
          required
          placeholder="vous@exemple.com"
          aria-invalid={Boolean(errors.email)}
          className={fieldClassName}
          {...register("email")}
        />
        {errors.email ? (
          <p className={errorClassName}>
            {errors.email.message}
          </p>
        ) : null}
      </div>

      <label className="flex items-start gap-3 text-[13px] leading-relaxed text-[var(--afd-muted)]">
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
        {pending ? "Inscription…" : "S’inscrire"}
      </button>
    </form>
  );
}
