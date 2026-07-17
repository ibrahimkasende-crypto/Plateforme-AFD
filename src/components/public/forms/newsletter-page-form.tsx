"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { homeContent } from "@/config/home-content";
import { subscribeNewsletterAction } from "@/features/newsletter/actions/subscribe";

const formSchema = z.object({
  name: z.string().trim().max(100).optional(),
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
      ? selectedInterests.filter((item) => item !== id)
      : [...selectedInterests, id];
    setValue("interests", next, { shouldValidate: true });
  }

  function onSubmit(values: FormValues) {
    startTransition(async () => {
      const result = await subscribeNewsletterAction({
        email: values.email,
        firstName: values.name || undefined,
        preferences: values.interests ?? [],
        consent: true,
        website: values.website,
        source: "page_newsletter",
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
        <label htmlFor="newsletter-website">Site web</label>
        <input
          id="newsletter-website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          {...register("website")}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="newsletter-name"
            className="mb-1 block text-sm font-semibold text-[var(--afd-ink)]"
          >
            Prénom ou nom{" "}
            <span className="font-normal text-[var(--afd-muted)]">(facultatif)</span>
          </label>
          <input
            id="newsletter-name"
            type="text"
            className="min-h-12 w-full rounded-lg border border-[var(--afd-border)] px-3 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--afd-blue)]"
            {...register("name")}
          />
        </div>

        <div>
          <label
            htmlFor="newsletter-email"
            className="mb-1 block text-sm font-semibold text-[var(--afd-ink)]"
          >
            E-mail
          </label>
          <input
            id="newsletter-email"
            type="email"
            className="min-h-12 w-full rounded-lg border border-[var(--afd-border)] px-3 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--afd-blue)]"
            {...register("email")}
          />
          {errors.email ? (
            <p className="mt-1 text-sm text-[var(--afd-error)]">{errors.email.message}</p>
          ) : null}
        </div>
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
              className="flex cursor-pointer items-center gap-3 rounded-lg border border-[var(--afd-border)] px-3 py-2.5 text-sm text-[var(--afd-ink)] transition hover:border-[var(--afd-blue)]/40"
            >
              <input
                type="checkbox"
                className="size-4 shrink-0 rounded border-[var(--afd-border)]"
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
          className="mt-0.5 size-5 shrink-0 rounded border-[var(--afd-border)]"
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
        <p className="text-sm text-[var(--afd-error)]">{errors.consent.message}</p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-12 items-center justify-center rounded-lg bg-[var(--afd-orange)] px-6 text-base font-bold text-white transition hover:bg-[var(--afd-orange-hover)] disabled:opacity-60"
      >
        {pending ? "Inscription…" : "S’inscrire à la newsletter"}
      </button>
    </form>
  );
}
