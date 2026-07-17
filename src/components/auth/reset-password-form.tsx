"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { z } from "zod";
import { updatePassword } from "@/actions/auth";

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Le mot de passe doit contenir au moins 8 caractères")
      .max(200),
    confirmPassword: z
      .string()
      .min(8, "Confirmez votre mot de passe")
      .max(200),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

const inputClassName =
  "min-h-12 w-full rounded-lg border border-slate-200 px-3 text-base text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb]";

export function ResetPasswordForm() {
  const [pending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [feedback, setFeedback] = useState<{
    ok: boolean;
    message: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  function onSubmit(values: ResetPasswordFormValues) {
    setFeedback(null);
    startTransition(async () => {
      const result = await updatePassword({
        password: values.password,
        confirmPassword: values.confirmPassword,
      });
      setFeedback(result);
    });
  }

  if (feedback?.ok) {
    return (
      <div className="space-y-4 text-center">
        <div
          role="status"
          className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
        >
          {feedback.message}
        </div>
        <Link
          href="/connexion"
          className="inline-flex min-h-12 w-full items-center justify-center rounded-lg bg-[#2563eb] text-sm font-semibold text-white transition hover:bg-[#1d4ed8]"
        >
          Se connecter
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {feedback && !feedback.ok ? (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {feedback.message}
        </div>
      ) : null}

      <div>
        <label
          htmlFor="reset-password"
          className="mb-1 block text-sm font-semibold text-[#0d254e]"
        >
          Nouveau mot de passe
        </label>
        <div className="relative">
          <input
            id="reset-password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            className={`${inputClassName} pr-11`}
            disabled={pending}
            {...register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
            aria-label={
              showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"
            }
          >
            {showPassword ? (
              <EyeOff className="size-5" aria-hidden />
            ) : (
              <Eye className="size-5" aria-hidden />
            )}
          </button>
        </div>
        {errors.password ? (
          <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
        ) : null}
      </div>

      <div>
        <label
          htmlFor="reset-confirm-password"
          className="mb-1 block text-sm font-semibold text-[#0d254e]"
        >
          Confirmer le mot de passe
        </label>
        <div className="relative">
          <input
            id="reset-confirm-password"
            type={showConfirm ? "text" : "password"}
            autoComplete="new-password"
            className={`${inputClassName} pr-11`}
            disabled={pending}
            {...register("confirmPassword")}
          />
          <button
            type="button"
            onClick={() => setShowConfirm((value) => !value)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
            aria-label={
              showConfirm
                ? "Masquer la confirmation"
                : "Afficher la confirmation"
            }
          >
            {showConfirm ? (
              <EyeOff className="size-5" aria-hidden />
            ) : (
              <Eye className="size-5" aria-hidden />
            )}
          </button>
        </div>
        {errors.confirmPassword ? (
          <p className="mt-1 text-sm text-red-600">
            {errors.confirmPassword.message}
          </p>
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
            Mise à jour…
          </>
        ) : (
          "Mettre à jour le mot de passe"
        )}
      </button>
    </form>
  );
}
