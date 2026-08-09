"use client";

import { fieldClassName } from "@/components/ui/form-styles";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { ArrowLeft, Loader2 } from "lucide-react";
import { z } from "zod";
import { requestPasswordReset } from "@/actions/auth";

const forgotPasswordSchema = z.object({
  email: z.string().trim().email("Adresse e-mail invalide").max(200),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordForm() {
  const [pending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{
    ok: boolean;
    message: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  function onSubmit(values: ForgotPasswordFormValues) {
    setFeedback(null);
    startTransition(async () => {
      const result = await requestPasswordReset({ email: values.email });
      setFeedback(result);
    });
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-600">
        Saisissez l’adresse e-mail associée à votre compte administrateur. Si
        elle existe, vous recevrez un lien de réinitialisation.
      </p>

      {feedback ? (
        <div
          role="status"
          className={
            feedback.ok
              ? "rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
              : "rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          }
        >
          {feedback.message}
        </div>
      ) : null}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div>
          <label
            htmlFor="forgot-email"
            className="mb-1 block text-sm font-semibold text-[#0d254e]"
          >
            Adresse e-mail
          </label>
          <input
            id="forgot-email"
            type="email"
            autoComplete="email"
            className={fieldClassName}
            disabled={pending}
            {...register("email")}
          />
          {errors.email ? (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          ) : null}
        </div>

        <button
          type="submit"
          disabled={pending}
          className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#2563eb] text-sm font-semibold text-white transition hover:bg-[#1d4ed8] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden />
              Envoi en cours…
            </>
          ) : (
            "Envoyer le lien"
          )}
        </button>
      </form>

      <Link
        href="/connexion"
        className="inline-flex items-center gap-2 text-sm font-medium text-[#2563eb] hover:underline"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Retour à la connexion
      </Link>
    </div>
  );
}
