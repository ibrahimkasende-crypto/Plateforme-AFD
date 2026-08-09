"use client";

import {
  checkboxClassName,
  errorClassName,
  fieldClassName,
  labelClassName,
  submitClassName,
} from "@/components/ui/form-styles";

import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { NewsletterGoogleBlock } from "@/components/newsletter/newsletter-google-block";
import { homeContent } from "@/config/home-content";
import { subscribeNewsletterAction } from "@/features/newsletter/actions/subscribe";
import { markNewsletterSubscribed } from "@/lib/newsletter/client-storage";
import { createClient } from "@/lib/supabase/client";
import { NEWSLETTER_GOOGLE_SUCCESS_QUERY } from "@/lib/newsletter/google-oauth";

const formSchema = z.object({
  email: z.string().email("Adresse e-mail invalide"),
  consent: z.boolean().refine((value) => value === true, {
    message: "Le consentement est obligatoire",
  }),
  website: z.string().max(0).optional(),
});

type FormValues = z.infer<typeof formSchema>;

type GoogleProfile = {
  email: string;
  name?: string;
  avatarUrl?: string;
};

type Step = "initial" | "googleConfirm" | "success";

export function NewsletterPopupForm({
  onSuccess,
  onCancel,
}: {
  onSuccess: () => void;
  onCancel?: () => void;
}) {
  const [pending, startTransition] = useTransition();
  const [googlePending, setGooglePending] = useState(false);
  const [step, setStep] = useState<Step>("initial");
  const [googleProfile, setGoogleProfile] = useState<GoogleProfile | null>(
    null,
  );
  const [googleConsent, setGoogleConsent] = useState(false);
  const [googleConsentError, setGoogleConsentError] = useState<string | null>(
    null,
  );
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      consent: false,
      website: "",
    },
  });

  useEffect(() => {
    const status = searchParams.get("newsletter");
    if (status !== NEWSLETTER_GOOGLE_SUCCESS_QUERY) return;

    let cancelled = false;

    void (async () => {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (cancelled) return;

        const email =
          user?.email?.trim() ||
          (typeof user?.user_metadata?.email === "string"
            ? user.user_metadata.email.trim()
            : "");

        if (!email) {
          toast.error(
            "Google n’a pas fourni d’adresse e-mail. Utilisez l’inscription manuelle.",
          );
        } else {
          const meta = user?.user_metadata ?? {};
          const name =
            (typeof meta.full_name === "string" && meta.full_name) ||
            (typeof meta.name === "string" && meta.name) ||
            undefined;
          const avatarUrl =
            (typeof meta.avatar_url === "string" && meta.avatar_url) ||
            (typeof meta.picture === "string" && meta.picture) ||
            undefined;

          setGoogleProfile({ email, name, avatarUrl });
          setGoogleConsent(false);
          setStep("googleConfirm");
        }
      } catch {
        if (!cancelled) {
          toast.error(
            "Impossible de récupérer votre adresse Google. Réessayez.",
          );
        }
      } finally {
        const params = new URLSearchParams(searchParams.toString());
        params.delete("newsletter");
        const query = params.toString();
        router.replace(query ? `${pathname}?${query}` : pathname, {
          scroll: false,
        });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [searchParams, router, pathname]);

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
      setStep("success");
      toast.success(result.message);
      window.setTimeout(() => onSuccess(), 1400);
    });
  }

  async function confirmGoogleSubscribe() {
    if (!googleConsent) {
      setGoogleConsentError(
        "Cochez la case pour confirmer votre inscription.",
      );
      return;
    }
    setGoogleConsentError(null);
    setGooglePending(true);

    try {
      const response = await fetch("/api/newsletter/google-subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ consent: true }),
      });
      const data = (await response.json()) as {
        ok?: boolean;
        message?: string;
        status?: string;
      };

      if (!response.ok || !data.ok) {
        toast.error(
          data.message ||
            "L’inscription via Google n’a pas pu être finalisée.",
        );
        setGooglePending(false);
        return;
      }

      markNewsletterSubscribed();
      setStep("success");
      toast.success(
        data.message ||
          "Votre inscription a été enregistrée. Merci de suivre les actions de l’AFD.",
      );
      window.setTimeout(() => onSuccess(), 1400);
    } catch {
      toast.error(
        "Erreur réseau. Vérifiez votre connexion puis réessayez.",
      );
      setGooglePending(false);
    }
  }

  function resetToManual() {
    setStep("initial");
    setGoogleProfile(null);
    setGoogleConsent(false);
    setGoogleConsentError(null);
  }

  if (step === "success") {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-6 text-center">
        <Heart className="afd-heart-breathe size-8 fill-[var(--afd-orange)] text-[var(--afd-orange)]" />
        <p className="font-heading text-lg font-extrabold text-[var(--afd-navy)]">
          Merci de suivre les actions de l’AFD
        </p>
      </div>
    );
  }

  if (step === "googleConfirm" && googleProfile) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3 rounded-xl border border-[var(--afd-border)] bg-[var(--afd-surface)]/60 p-3">
          {googleProfile.avatarUrl ? (
            <Image
              src={googleProfile.avatarUrl}
              alt=""
              width={44}
              height={44}
              className="size-11 rounded-full object-cover"
              unoptimized
            />
          ) : (
            <div className="flex size-11 items-center justify-center rounded-full bg-[var(--afd-blue)]/10 text-sm font-bold text-[var(--afd-blue)]">
              {googleProfile.email.slice(0, 1).toUpperCase()}
            </div>
          )}
          <div className="min-w-0">
            {googleProfile.name ? (
              <p className="truncate text-sm font-semibold text-[var(--afd-navy)]">
                {googleProfile.name}
              </p>
            ) : null}
            <p className="text-[13px] text-[var(--afd-muted)]">
              Adresse détectée :
            </p>
            <p className="truncate font-semibold text-[var(--afd-navy)]">
              {googleProfile.email}
            </p>
          </div>
        </div>

        <label className="flex items-start gap-3 text-[13px] leading-relaxed text-[var(--afd-muted)]">
          <input
            type="checkbox"
            className={checkboxClassName}
            checked={googleConsent}
            onChange={(e) => {
              setGoogleConsent(e.target.checked);
              setGoogleConsentError(null);
            }}
          />
          <span>
            J’accepte de recevoir les actualités et communications de l’AFD.{" "}
            <Link
              href="/politique-confidentialite"
              className="font-semibold text-[var(--afd-blue)] underline-offset-2 hover:underline"
            >
              Politique de confidentialité
            </Link>
          </span>
        </label>
        {googleConsentError ? (
          <p className={errorClassName}>{googleConsentError}</p>
        ) : null}

        <button
          type="button"
          disabled={googlePending}
          onClick={() => void confirmGoogleSubscribe()}
          className={submitClassName}
        >
          {googlePending ? "Inscription…" : "Confirmer mon inscription"}
        </button>

        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            disabled={googlePending}
            onClick={resetToManual}
            className="min-h-11 w-full rounded-xl border border-[var(--afd-border)] px-3 text-sm font-semibold text-[var(--afd-navy)]"
          >
            Utiliser une autre adresse
          </button>
          <button
            type="button"
            disabled={googlePending}
            onClick={() => (onCancel ? onCancel() : onSuccess())}
            className="min-h-11 w-full rounded-xl px-3 text-sm font-semibold text-[var(--afd-muted)]"
          >
            Annuler
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="relative space-y-3"
      noValidate
    >
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

      <div>
        <label htmlFor="popup-newsletter-email" className={labelClassName}>
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
          <p className={errorClassName}>{errors.email.message}</p>
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

      <button type="submit" disabled={pending} className={submitClassName}>
        {pending ? "Inscription…" : "S’inscrire avec mon e-mail"}
      </button>

      <NewsletterGoogleBlock disabled={pending} />
    </form>
  );
}
