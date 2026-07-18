"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { z } from "zod";
import { signIn } from "@/actions/auth";

const loginSchema = z.object({
  email: z.string().trim().email("Adresse e-mail invalide").max(200),
  password: z.string().min(8, "Mot de passe requis").max(200),
  next: z.string().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const inputClassName =
  "min-h-12 w-full rounded-lg border border-slate-200 px-3 text-base text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb]";

export function LoginForm() {
  const searchParams = useSearchParams();
  const nextParam = searchParams.get("next");
  const safeNext =
    nextParam && nextParam.startsWith("/") && !nextParam.startsWith("//")
      ? nextParam
      : undefined;

  const [pending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      next: safeNext,
    },
  });

  function onSubmit(values: LoginFormValues) {
    setErrorMessage(null);
    startTransition(async () => {
      const result = await signIn({
        email: values.email,
        password: values.password,
        next: values.next,
      });

      if (!result.ok) {
        setErrorMessage(result.message);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <input type="hidden" {...register("next")} />

      <div className="border-b border-slate-100 pb-4">
        <p className="text-sm font-semibold text-[#0d254e]">Connexion</p>
        <p className="mt-1 text-xs text-slate-500">
          Utilisez vos identifiants administrateur AFD.
        </p>
      </div>

      {errorMessage ? (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {errorMessage}
        </div>
      ) : null}

      <div>
        <label
          htmlFor="login-email"
          className="mb-1 block text-sm font-semibold text-[#0d254e]"
        >
          Adresse e-mail
        </label>
        <input
          id="login-email"
          type="email"
          autoComplete="email"
          className={inputClassName}
          disabled={pending}
          {...register("email")}
        />
        {errors.email ? (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        ) : null}
      </div>

      <div>
        <div className="mb-1 flex items-center justify-between">
          <label
            htmlFor="login-password"
            className="block text-sm font-semibold text-[#0d254e]"
          >
            Mot de passe
          </label>
          <Link
            href="/mot-de-passe-oublie"
            className="text-xs font-medium text-[#2563eb] hover:underline"
          >
            Mot de passe oublié ?
          </Link>
        </div>
        <div className="relative">
          <input
            id="login-password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
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

      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#2563eb] text-sm font-semibold text-white transition hover:bg-[#1d4ed8] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? (
          <>
            <Loader2 className="size-4 animate-spin" aria-hidden />
            Connexion en cours…
          </>
        ) : (
          "Se connecter"
        )}
      </button>
    </form>
  );
}
