"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { submitContactAction } from "@/features/contact/actions/submit-contact";

const formSchema = z.object({
  name: z.string().trim().min(2, "Le nom est requis").max(120),
  email: z.string().trim().email("Adresse e-mail invalide"),
  phone: z.string().trim().max(40).optional(),
  subject: z.string().trim().min(3, "Le sujet est requis").max(200),
  message: z.string().trim().min(10, "Le message est requis").max(5000),
  consent: z.boolean().refine((value) => value === true, {
    message: "Le consentement est obligatoire",
  }),
  website: z.string().max(0).optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function ContactForm() {
  const [pending, startTransition] = useTransition();
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
      phone: "",
      subject: "",
      message: "",
      consent: false,
      website: "",
    },
  });

  function onSubmit(values: FormValues) {
    startTransition(async () => {
      const result = await submitContactAction({
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
        <label htmlFor="contact-website">Site web</label>
        <input id="contact-website" type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className="mb-1 block text-sm font-semibold text-[var(--afd-ink)]">
            Nom complet
          </label>
          <input
            id="contact-name"
            type="text"
            className="min-h-12 w-full rounded-lg border border-[var(--afd-border)] px-3 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--afd-blue)]"
            {...register("name")}
          />
          {errors.name ? <p className="mt-1 text-sm text-[var(--afd-error)]">{errors.name.message}</p> : null}
        </div>

        <div>
          <label htmlFor="contact-email" className="mb-1 block text-sm font-semibold text-[var(--afd-ink)]">
            E-mail
          </label>
          <input
            id="contact-email"
            type="email"
            className="min-h-12 w-full rounded-lg border border-[var(--afd-border)] px-3 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--afd-blue)]"
            {...register("email")}
          />
          {errors.email ? <p className="mt-1 text-sm text-[var(--afd-error)]">{errors.email.message}</p> : null}
        </div>
      </div>

      <div>
        <label htmlFor="contact-phone" className="mb-1 block text-sm font-semibold text-[var(--afd-ink)]">
          Téléphone <span className="font-normal text-[var(--afd-muted)]">(facultatif)</span>
        </label>
        <input
          id="contact-phone"
          type="tel"
          className="min-h-12 w-full rounded-lg border border-[var(--afd-border)] px-3 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--afd-blue)]"
          {...register("phone")}
        />
      </div>

      <div>
        <label htmlFor="contact-subject" className="mb-1 block text-sm font-semibold text-[var(--afd-ink)]">
          Sujet
        </label>
        <input
          id="contact-subject"
          type="text"
          className="min-h-12 w-full rounded-lg border border-[var(--afd-border)] px-3 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--afd-blue)]"
          {...register("subject")}
        />
        {errors.subject ? <p className="mt-1 text-sm text-[var(--afd-error)]">{errors.subject.message}</p> : null}
      </div>

      <div>
        <label htmlFor="contact-message" className="mb-1 block text-sm font-semibold text-[var(--afd-ink)]">
          Message
        </label>
        <textarea
          id="contact-message"
          rows={6}
          className="min-h-32 w-full rounded-lg border border-[var(--afd-border)] px-3 py-3 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--afd-blue)]"
          {...register("message")}
        />
        {errors.message ? <p className="mt-1 text-sm text-[var(--afd-error)]">{errors.message.message}</p> : null}
      </div>

      <label className="flex items-start gap-3 text-sm leading-relaxed text-[var(--afd-muted)]">
        <input type="checkbox" className="mt-0.5 size-5 shrink-0 rounded border-[var(--afd-border)]" {...register("consent")} />
        <span>
          J’accepte que l’AFD traite mes données pour répondre à ma demande.{" "}
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
        {pending ? "Envoi en cours…" : "Envoyer le message"}
      </button>
    </form>
  );
}
