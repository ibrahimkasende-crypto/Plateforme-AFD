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
    <Section className="bg-white">
      <SiteContainer>
        <FadeIn>
          <div className="overflow-hidden rounded-2xl border border-[var(--afd-border)] bg-[linear-gradient(135deg,#0f355f_0%,#1a4f8c_100%)] p-8 text-white md:p-10">
            <div className="grid gap-8 lg:grid-cols-2">
              <div>
                <h2 className="font-display text-3xl font-semibold tracking-tight">
                  {homeContent.newsletter.title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-white/80 md:text-base">
                  {homeContent.newsletter.description}
                </p>
              </div>

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-4"
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

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="newsletter-name"
                      className="mb-1.5 block text-xs font-medium text-white/80"
                    >
                      Prénom ou nom (facultatif)
                    </label>
                    <input
                      id="newsletter-name"
                      type="text"
                      className="min-h-11 w-full rounded-lg border border-white/20 bg-white/10 px-3 text-sm text-white placeholder:text-white/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                      {...register("name")}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="newsletter-email"
                      className="mb-1.5 block text-xs font-medium text-white/80"
                    >
                      E-mail
                    </label>
                    <input
                      id="newsletter-email"
                      type="email"
                      required
                      aria-invalid={Boolean(errors.email)}
                      aria-describedby={
                        errors.email ? "newsletter-email-error" : undefined
                      }
                      className="min-h-11 w-full rounded-lg border border-white/20 bg-white/10 px-3 text-sm text-white placeholder:text-white/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                      {...register("email")}
                    />
                    {errors.email ? (
                      <p
                        id="newsletter-email-error"
                        className="mt-1 text-xs text-amber-200"
                      >
                        {errors.email.message}
                      </p>
                    ) : null}
                  </div>
                </div>

                <fieldset>
                  <legend className="mb-2 text-xs font-medium text-white/80">
                    Centres d’intérêt (facultatif)
                  </legend>
                  <div className="flex flex-wrap gap-2">
                    {homeContent.newsletter.interests.map((interest) => {
                      const active = selectedInterests.includes(interest.id);
                      return (
                        <button
                          key={interest.id}
                          type="button"
                          onClick={() => toggleInterest(interest.id)}
                          className={cn(
                            "min-h-10 rounded-full border px-3 text-xs font-medium transition duration-150",
                            active
                              ? "border-white bg-white text-[var(--afd-accent-strong)]"
                              : "border-white/25 text-white hover:bg-white/10",
                          )}
                          aria-pressed={active}
                        >
                          {interest.label}
                        </button>
                      );
                    })}
                  </div>
                </fieldset>

                <label className="flex items-start gap-3 text-xs leading-relaxed text-white/85">
                  <input
                    type="checkbox"
                    className="mt-0.5 size-4 rounded border-white/30"
                    {...register("consent")}
                  />
                  <span>{homeContent.newsletter.consentLabel}</span>
                </label>
                {errors.consent ? (
                  <p className="text-xs text-amber-200">
                    {errors.consent.message}
                  </p>
                ) : null}

                <button
                  type="submit"
                  disabled={pending}
                  className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[var(--afd-support)] px-5 text-sm font-semibold text-white transition duration-150 hover:bg-[var(--afd-support-strong)] disabled:opacity-60"
                >
                  {pending ? "Inscription…" : "S’inscrire"}
                </button>

                <div aria-live="polite" className="min-h-5 text-xs text-white/75">
                  {statusMessage}
                </div>
              </form>
            </div>
          </div>
        </FadeIn>
      </SiteContainer>
    </Section>
  );
}
