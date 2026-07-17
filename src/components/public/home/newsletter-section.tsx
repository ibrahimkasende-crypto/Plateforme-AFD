"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Mail } from "lucide-react";
import Link from "next/link";
import { FadeIn } from "@/components/motion/FadeIn";
import { Section } from "@/components/shared/Section";
import { SiteContainer } from "@/components/shared/SiteContainer";
import { homeContent } from "@/config/home-content";
import { subscribeNewsletterAction } from "@/features/newsletter/actions/subscribe";
import { markNewsletterSubscribed } from "@/lib/newsletter/client-storage";

const formSchema = z.object({
  name: z.string().trim().max(100).optional(),
  email: z.string().email("Adresse e-mail invalide"),
  consent: z.boolean().refine((value) => value === true, {
    message: "Le consentement est obligatoire",
  }),
  website: z.string().max(0).optional(),
});

type FormValues = z.infer<typeof formSchema>;

const fieldClassName =
  "min-h-12 w-full rounded-lg border-0 bg-[var(--afd-surface-elevated)] px-3.5 text-base text-[var(--afd-text)] placeholder:text-[var(--afd-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white";

export function NewsletterSection() {
  const [pending, startTransition] = useTransition();
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      consent: false,
      website: "",
    },
  });

  function onSubmit(values: FormValues) {
    startTransition(async () => {
      const result = await subscribeNewsletterAction({
        email: values.email,
        firstName: values.name || undefined,
        preferences: [],
        consent: true,
        website: values.website,
        source: "bandeau_accueil",
      });

      if (!result.ok) {
        setStatusMessage(result.message);
        toast.error(result.message);
        return;
      }

      markNewsletterSubscribed();
      setStatusMessage(result.message);
      toast.success(result.message);
      reset({
        name: "",
        email: "",
        consent: false,
        website: "",
      });
    });
  }

  return (
    <Section className="bg-[var(--afd-blue)] py-12 md:py-14">
      <SiteContainer>
        <FadeIn>
          <div className="grid items-center gap-8 text-white lg:grid-cols-12 lg:gap-10">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start lg:col-span-5">
              <span className="inline-flex size-14 shrink-0 items-center justify-center rounded-2xl bg-white/15">
                <Mail className="size-7" aria-hidden />
              </span>
              <div className="min-w-0">
                <h2 className="font-heading text-[1.55rem] font-extrabold tracking-tight sm:text-2xl md:text-3xl">
                  {homeContent.newsletter.title}
                </h2>
                <p className="mt-2 max-w-md text-[15px] leading-relaxed text-white/85">
                  {homeContent.newsletter.description}
                </p>
              </div>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="relative space-y-3 lg:col-span-7"
              noValidate
            >
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

              <div className="flex flex-col gap-3 lg:flex-row">
                <div className="min-w-0 flex-1">
                  <label htmlFor="newsletter-name" className="sr-only">
                    Votre nom
                  </label>
                  <input
                    id="newsletter-name"
                    type="text"
                    placeholder="Votre nom"
                    className={fieldClassName}
                    {...register("name")}
                  />
                </div>
                <div className="min-w-0 flex-1">
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
                    className={fieldClassName}
                    {...register("email")}
                  />
                </div>
                <button
                  type="submit"
                  disabled={pending}
                  className="afd-btn-text inline-flex min-h-12 w-full shrink-0 items-center justify-center rounded-lg bg-[var(--afd-orange)] px-6 text-base text-white transition duration-180 hover:bg-[var(--afd-orange-hover)] disabled:opacity-60 lg:w-auto lg:text-sm"
                >
                  {pending ? "…" : "S’inscrire"}
                </button>
              </div>

              {errors.email ? (
                <p id="newsletter-email-error" className="text-[13px] text-amber-100">
                  {errors.email.message}
                </p>
              ) : null}

              <label className="flex items-start gap-3 text-[13px] leading-relaxed text-white/90">
                <input
                  type="checkbox"
                  className="mt-0.5 size-5 shrink-0 rounded border-white/30"
                  {...register("consent")}
                />
                <span>
                  {homeContent.newsletter.consentLabel}{" "}
                  <Link
                    href="/politique-confidentialite"
                    className="underline underline-offset-2"
                  >
                    Politique de confidentialité
                  </Link>
                </span>
              </label>
              {errors.consent ? (
                <p className="text-[13px] text-amber-100">{errors.consent.message}</p>
              ) : null}

              <div aria-live="polite" className="min-h-5 text-[13px] text-white/75">
                {statusMessage}
              </div>
            </form>
          </div>
        </FadeIn>
      </SiteContainer>
    </Section>
  );
}
