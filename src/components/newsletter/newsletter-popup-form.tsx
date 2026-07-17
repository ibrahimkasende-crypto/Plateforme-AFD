"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Heart } from "lucide-react";
import Link from "next/link";
import { homeContent } from "@/config/home-content";
import { subscribeNewsletterAction } from "@/features/newsletter/actions/subscribe";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  name: z.string().trim().max(100).optional(),
  email: z.string().email("Adresse e-mail invalide"),
  interests: z.array(z.string()),
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
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      interests: [],
      consent: false,
      website: "",
    },
  });

  const selectedInterests = watch("interests") ?? [];

  function toggleInterest(id: string) {
    const next = selectedInterests.includes(id)
      ? selectedInterests.filter((value) => value !== id)
      : [...selectedInterests, id];
    setValue("interests", next, { shouldValidate: true });
  }

  function onSubmit(values: FormValues) {
    startTransition(async () => {
      const result = await subscribeNewsletterAction({
        email: values.email,
        firstName: values.name || undefined,
        preferences: values.interests,
        consent: true,
        website: values.website,
        source: "popup_accueil",
      });

      if (!result.ok) {
        toast.error(result.message);
        return;
      }

      setSuccess(true);
      toast.success(result.message);
      window.setTimeout(() => onSuccess(), 1600);
    });
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
        <Heart className="afd-heart-breathe size-10 fill-[var(--afd-orange)] text-[var(--afd-orange)]" />
        <p className="font-heading text-xl font-extrabold text-[var(--afd-navy)]">
          Merci de suivre les actions de l’AFD
        </p>
        <p className="text-sm text-[var(--afd-muted)]">
          Votre inscription a bien été prise en compte.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="absolute -left-[9999px]" aria-hidden>
        <label htmlFor="popup-newsletter-website">Site web</label>
        <input
          id="popup-newsletter-website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          {...register("website")}
        />
      </div>

      <div>
        <label
          htmlFor="popup-newsletter-name"
          className="mb-1.5 block text-sm font-semibold text-[var(--afd-navy)]"
        >
          Nom <span className="font-normal text-[var(--afd-muted)]">(facultatif)</span>
        </label>
        <input
          id="popup-newsletter-name"
          type="text"
          className="min-h-11 w-full rounded-lg border border-[var(--afd-border)] px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--afd-blue)]"
          {...register("name")}
        />
      </div>

      <div>
        <label
          htmlFor="popup-newsletter-email"
          className="mb-1.5 block text-sm font-semibold text-[var(--afd-navy)]"
        >
          E-mail
        </label>
        <input
          id="popup-newsletter-email"
          type="email"
          required
          aria-invalid={Boolean(errors.email)}
          className="min-h-11 w-full rounded-lg border border-[var(--afd-border)] px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--afd-blue)]"
          {...register("email")}
        />
        {errors.email ? (
          <p className="mt-1 text-xs text-[var(--afd-error)]">{errors.email.message}</p>
        ) : null}
      </div>

      <fieldset>
        <legend className="mb-2 text-sm font-semibold text-[var(--afd-navy)]">
          Centres d’intérêt{" "}
          <span className="font-normal text-[var(--afd-muted)]">(facultatif)</span>
        </legend>
        <div className="flex flex-wrap gap-2">
          {homeContent.newsletter.interests.map((interest) => {
            const active = selectedInterests.includes(interest.id);
            return (
              <button
                key={interest.id}
                type="button"
                onClick={() => toggleInterest(interest.id)}
                aria-pressed={active}
                className={cn(
                  "min-h-9 rounded-lg border px-3 text-[12px] font-semibold transition duration-150",
                  active
                    ? "border-[var(--afd-blue)] bg-[var(--afd-light-blue)] text-[var(--afd-blue)]"
                    : "border-[var(--afd-border)] text-[var(--afd-muted)] hover:bg-[var(--afd-background)]",
                )}
              >
                {interest.label}
              </button>
            );
          })}
        </div>
      </fieldset>

      <label className="flex items-start gap-3 text-[13px] leading-relaxed text-[var(--afd-muted)]">
        <input
          type="checkbox"
          className="mt-0.5 size-4 rounded border-[var(--afd-border)]"
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
        <p className="text-xs text-[var(--afd-error)]">{errors.consent.message}</p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="afd-btn-text inline-flex min-h-12 w-full items-center justify-center rounded-lg bg-[var(--afd-orange)] px-5 text-white transition duration-180 hover:bg-[var(--afd-orange-hover)] disabled:opacity-60"
      >
        {pending ? "Inscription…" : "S’inscrire"}
      </button>
    </form>
  );
}
