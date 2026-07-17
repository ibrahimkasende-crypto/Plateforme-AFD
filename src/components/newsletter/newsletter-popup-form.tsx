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
import { createClient } from "@/lib/supabase/client";

const formSchema = z.object({
  name: z.string().trim().max(100).optional(),
  email: z.string().email("Adresse e-mail invalide"),
  consent: z.boolean().refine((value) => value === true, {
    message: "Le consentement est obligatoire",
  }),
  website: z.string().max(0).optional(),
});

type FormValues = z.infer<typeof formSchema>;

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      aria-hidden
      focusable="false"
    >
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

export function NewsletterPopupForm({
  onSuccess,
}: {
  onSuccess: () => void;
}) {
  const [pending, startTransition] = useTransition();
  const [googlePending, setGooglePending] = useState(false);
  const [success, setSuccess] = useState(false);
  const {
    register,
    handleSubmit,
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
        source: "popup_accueil",
      });

      if (!result.ok) {
        toast.error(result.message);
        return;
      }

      setSuccess(true);
      toast.success(result.message);
      window.setTimeout(() => onSuccess(), 1400);
    });
  }

  async function continueWithGoogle() {
    setGooglePending(true);
    try {
      const supabase = createClient();
      const origin = window.location.origin;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${origin}/`,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });

      if (error) {
        toast.error(
          "La connexion Google n’est pas encore configurée. Utilisez l’inscription par e-mail.",
        );
      }
    } catch {
      toast.error(
        "La connexion Google n’est pas disponible pour le moment. Utilisez l’inscription par e-mail.",
      );
    } finally {
      setGooglePending(false);
    }
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

      <button
        type="button"
        onClick={() => void continueWithGoogle()}
        disabled={googlePending || pending}
        className="inline-flex min-h-12 w-full items-center justify-center gap-2.5 rounded-lg border border-[var(--afd-border)] bg-white px-3 text-[15px] font-semibold text-[var(--afd-navy)] transition hover:bg-[var(--afd-background)] disabled:opacity-60"
      >
        <GoogleIcon className="size-4 shrink-0" />
        {googlePending ? "Redirection…" : "Continuer avec Google"}
      </button>

      <div className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-wide text-[var(--afd-muted)]">
        <span className="h-px flex-1 bg-[var(--afd-border)]" />
        ou
        <span className="h-px flex-1 bg-[var(--afd-border)]" />
      </div>

      <div>
        <label
          htmlFor="popup-newsletter-name"
          className="mb-1 block text-[12px] font-semibold text-[var(--afd-navy)]"
        >
          Nom <span className="font-normal text-[var(--afd-muted)]">(facultatif)</span>
        </label>
        <input
          id="popup-newsletter-name"
          type="text"
          className="min-h-12 w-full rounded-lg border border-[var(--afd-border)] px-3 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--afd-blue)]"
          {...register("name")}
        />
      </div>

      <div>
        <label
          htmlFor="popup-newsletter-email"
          className="mb-1 block text-[12px] font-semibold text-[var(--afd-navy)]"
        >
          E-mail
        </label>
        <input
          id="popup-newsletter-email"
          type="email"
          required
          aria-invalid={Boolean(errors.email)}
          className="min-h-12 w-full rounded-lg border border-[var(--afd-border)] px-3 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--afd-blue)]"
          {...register("email")}
        />
        {errors.email ? (
          <p className="mt-1 text-[13px] text-[var(--afd-error)]">{errors.email.message}</p>
        ) : null}
      </div>

      <label className="flex items-start gap-3 text-[13px] leading-relaxed text-[var(--afd-muted)]">
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
        <p className="text-[13px] text-[var(--afd-error)]">{errors.consent.message}</p>
      ) : null}

      <button
        type="submit"
        disabled={pending || googlePending}
        className="inline-flex min-h-12 w-full items-center justify-center rounded-lg bg-[var(--afd-orange)] px-4 text-base font-bold text-white transition hover:bg-[var(--afd-orange-hover)] disabled:opacity-60"
      >
        {pending ? "Inscription…" : "S’inscrire"}
      </button>
    </form>
  );
}
