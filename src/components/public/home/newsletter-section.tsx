"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { ArrowRight, Mail, Sparkles } from "lucide-react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { FadeIn } from "@/components/motion/FadeIn";
import { NewsletterGoogleButton } from "@/components/newsletter/newsletter-google-button";
import { Section } from "@/components/shared/Section";
import { SiteContainer } from "@/components/shared/SiteContainer";
import {
  checkboxClassName,
  errorClassName,
  fieldClassName,
} from "@/components/ui/form-styles";
import { homeContent } from "@/config/home-content";
import { subscribeNewsletterAction } from "@/features/newsletter/actions/subscribe";
import { markNewsletterSubscribed } from "@/lib/newsletter/client-storage";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  email: z.string().email("Adresse e-mail invalide"),
  consent: z.boolean().refine((value) => value === true, {
    message: "Le consentement est obligatoire",
  }),
  website: z.string().max(0).optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function NewsletterSection() {
  const reduceMotion = useReducedMotion();
  const [pending, startTransition] = useTransition();
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
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
        email: "",
        consent: false,
        website: "",
      });
    });
  }

  return (
    <Section className="relative isolate overflow-hidden py-14 md:py-16 lg:py-20">
      <div
        className="absolute inset-0 bg-[linear-gradient(125deg,#031b3c_0%,#062653_38%,#0877d1_78%,#3ba3e6_100%)]"
        aria-hidden
      />
      <div
        className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-[var(--afd-sky)]/25 blur-3xl"
        aria-hidden
      />
      <div
        className="absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-[var(--afd-orange)]/20 blur-3xl"
        aria-hidden
      />
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
          backgroundSize: "22px 22px",
        }}
        aria-hidden
      />

      <SiteContainer className="relative z-[1]">
        <FadeIn>
          <div className="grid items-stretch gap-8 lg:grid-cols-12 lg:gap-12">
            <div className="flex flex-col justify-center text-white lg:col-span-5">
              <motion.span
                className="inline-flex w-fit items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-[11px] font-bold tracking-[0.14em] text-[#d6efff] uppercase backdrop-blur-sm"
                initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35 }}
              >
                <Sparkles className="size-3.5 text-[var(--afd-orange)]" aria-hidden />
                Newsletter AFD
              </motion.span>

              <h2 className="font-heading mt-4 text-[1.75rem] font-extrabold tracking-tight sm:text-3xl md:text-[2.15rem] md:leading-[1.15]">
                <span className="bg-gradient-to-br from-white via-[#e8f6ff] to-[var(--afd-sky)] bg-clip-text text-transparent">
                  {homeContent.newsletter.title}
                </span>
              </h2>

              <p className="mt-3 max-w-md text-[15px] leading-relaxed text-[#dcefff] sm:text-base">
                {homeContent.newsletter.description}
              </p>

              <ul className="mt-6 space-y-2.5 text-[13px] text-white/85 sm:text-[14px]">
                {[
                  "Actualités du terrain",
                  "Rapports et publications",
                  "Opportunités d’engagement",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2.5">
                    <span
                      className="size-1.5 shrink-0 rounded-full bg-[var(--afd-orange)] shadow-[0_0_10px_rgba(233,147,8,0.7)]"
                      aria-hidden
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-7">
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="relative overflow-hidden rounded-[22px] border border-white/30 bg-white p-5 shadow-[0_24px_60px_rgba(3,27,60,0.28)] sm:p-7"
                noValidate
                data-disable-water-effect=""
              >
                <div
                  className="pointer-events-none absolute -right-10 -top-10 size-36 rounded-full bg-[var(--afd-sky)]/20 blur-2xl"
                  aria-hidden
                />

                <div className="relative flex items-start gap-3">
                  <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--afd-blue)] text-white shadow-[0_8px_20px_rgba(8,119,209,0.35)]">
                    <Mail className="size-5" aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <p className="font-heading text-lg font-bold text-[var(--afd-navy)]">
                      Inscrivez-vous gratuitement
                    </p>
                    <p className="mt-0.5 text-[13px] text-[var(--afd-muted)]">
                      Avec Google ou votre adresse e-mail.
                    </p>
                  </div>
                </div>

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

                <div className="relative mt-5 space-y-3">
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

                  <div className="min-w-0">
                    <label
                      htmlFor="newsletter-email"
                      className="mb-1.5 block text-[12px] font-semibold text-[var(--afd-navy)]"
                    >
                      Votre e-mail
                    </label>
                    <input
                      id="newsletter-email"
                      type="email"
                      required
                      placeholder="vous@exemple.com"
                      aria-invalid={Boolean(errors.email)}
                      aria-describedby={
                        errors.email ? "newsletter-email-error" : undefined
                      }
                      className={fieldClassName}
                      {...register("email")}
                    />
                  </div>
                </div>

                {errors.email ? (
                  <p
                    id="newsletter-email-error"
                    className="mt-2 text-[13px] text-red-600"
                  >
                    {errors.email.message}
                  </p>
                ) : null}

                <button
                  type="submit"
                  disabled={pending}
                  className={cn(
                    "afd-btn-text mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[var(--afd-orange)] px-6 text-white shadow-[0_10px_28px_rgba(233,147,8,0.35)] transition duration-200 hover:bg-[var(--afd-orange-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--afd-orange)] focus-visible:ring-offset-2 disabled:opacity-60",
                  )}
                >
                  {pending ? "Inscription…" : "S’inscrire à la newsletter"}
                  {!pending ? (
                    <ArrowRight className="size-4" aria-hidden />
                  ) : null}
                </button>

                <label className="mt-4 flex items-start gap-3 text-[12px] leading-relaxed text-[var(--afd-muted)] sm:text-[13px]">
                  <input
                    type="checkbox"
                    className="mt-0.5 size-4 shrink-0 rounded border-[#c5d5e6] text-[var(--afd-blue)] focus-visible:ring-[var(--afd-blue)]"
                    {...register("consent")}
                  />
                  <span>
                    {homeContent.newsletter.consentLabel}{" "}
                    <Link
                      href="/politique-confidentialite"
                      className="font-semibold text-[var(--afd-blue)] underline underline-offset-2"
                    >
                      Politique de confidentialité
                    </Link>
                  </span>
                </label>
                {errors.consent ? (
                  <p className="mt-1.5 text-[13px] text-red-600">
                    {errors.consent.message}
                  </p>
                ) : null}

                <div
                  aria-live="polite"
                  className="mt-3 min-h-5 text-[13px] font-medium text-[var(--afd-blue)]"
                >
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
