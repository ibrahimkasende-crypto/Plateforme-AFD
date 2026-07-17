"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { FadeIn } from "@/components/motion/FadeIn";
import { Section } from "@/components/shared/Section";
import { SiteContainer } from "@/components/shared/SiteContainer";
import { homeContent } from "@/config/home-content";
import { subscribeNewsletterAction } from "@/features/newsletter/actions/subscribe";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  name: z.string().trim().max(100).optional(),
  email: z.string().email("Adresse e-mail invalide"),
  interests: z.array(z.string()),
  consent: z
    .boolean()
    .refine((value) => value === true, {
      message: "Le consentement est obligatoire",
    }),
  website: z.string().max(0).optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function NewsletterSection() {
  const [pending, startTransition] = useTransition();
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
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
      });

      if (!result.ok) {
        setStatusMessage(result.message);
        toast.error(result.message);
        return;
      }

      setStatusMessage(result.message);
      toast.success(result.message);
      reset({
        name: "",
        email: "",
        interests: [],
        consent: false,
        website: "",
      });
    });
  }

  return (
    <Section className="bg-[var(--afd-accent)] py-10 md:py-12">
      <SiteContainer>
        <FadeIn>
          <div className="grid items-center gap-8 text-white lg:grid-cols-12">
            <div className="lg:col-span-5">
              <h2 className="font-display text-2xl font-semibold tracking-tight md:text-3xl">
                {homeContent.newsletter.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-white/80">
                {homeContent.newsletter.description}
              </p>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-3 lg:col-span-7"
              noValidate
            >
              <div className="absolute -left-[9999px]" aria-hidden>
                <label htmlFor="newsletter-website">Site web</label>
                <input
                  id="newsletter-website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  {...register("website")}
                />
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="flex-1">
                  <label htmlFor="newsletter-name" className="sr-only">
                    Votre nom
                  </label>
                  <input
                    id="newsletter-name"
                    type="text"
                    placeholder="Votre nom"
                    className="min-h-11 w-full rounded-lg border-0 bg-white px-3 text-sm text-[var(--afd-ink)] placeholder:text-[var(--afd-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                    {...register("name")}
                  />
                </div>
                <div className="flex-1">
                  <label htmlFor="newsletter-email" className="sr-only">
                    Votre e-mail
                  </label>
                  <input
                    id="newsletter-email"
                    type="email"
                    required
                    placeholder="Votre e-mail"
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={
                      errors.email ? "newsletter-email-error" : undefined
                    }
                    className="min-h-11 w-full rounded-lg border-0 bg-white px-3 text-sm text-[var(--afd-ink)] placeholder:text-[var(--afd-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                    {...register("email")}
                  />
                </div>
                <button
                  type="submit"
                  disabled={pending}
                  className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-lg bg-[var(--afd-support)] px-5 text-sm font-semibold text-white transition duration-150 hover:bg-[var(--afd-support-strong)] disabled:opacity-60"
                >
                  {pending ? "…" : "S’inscrire"}
                </button>
              </div>

              {errors.email ? (
                <p id="newsletter-email-error" className="text-xs text-amber-200">
                  {errors.email.message}
                </p>
              ) : null}

              <div className="flex flex-wrap gap-2">
                {homeContent.newsletter.interests.map((interest) => {
                  const active = selectedInterests.includes(interest.id);
                  return (
                    <button
                      key={interest.id}
                      type="button"
                      onClick={() => toggleInterest(interest.id)}
                      className={cn(
                        "min-h-9 rounded-full border px-3 text-xs font-medium transition duration-150",
                        active
                          ? "border-white bg-white text-[var(--afd-accent-strong)]"
                          : "border-white/30 text-white hover:bg-white/10",
                      )}
                      aria-pressed={active}
                    >
                      {interest.label}
                    </button>
                  );
                })}
              </div>

              <label className="flex items-start gap-3 text-xs leading-relaxed text-white/85">
                <input
                  type="checkbox"
                  className="mt-0.5 size-4 rounded border-white/30"
                  {...register("consent")}
                />
                <span>{homeContent.newsletter.consentLabel}</span>
              </label>
              {errors.consent ? (
                <p className="text-xs text-amber-200">{errors.consent.message}</p>
              ) : null}

              <div aria-live="polite" className="min-h-5 text-xs text-white/75">
                {statusMessage}
              </div>
            </form>
          </div>
        </FadeIn>
      </SiteContainer>
    </Section>
  );
}
