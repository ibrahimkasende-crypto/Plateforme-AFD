"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { z } from "zod";
import { errorClassName } from "@/components/ui/form-styles";

const loginSchema = z.object({
  email: z.string().trim().email("Adresse e-mail invalide").max(200),
  password: z.string().min(8, "Mot de passe requis").max(200),
  next: z.string().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const compactLabel =
  "mb-1 block text-[12px] font-semibold tracking-tight text-[var(--afd-ink)]";
const compactField =
  "min-h-[40px] w-full rounded-lg border border-[var(--afd-border)] bg-[#f7fbff] px-3 text-sm text-[var(--afd-ink)] transition focus-visible:border-[var(--afd-blue)] focus-visible:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--afd-blue)]/25";

export function LoginForm() {
  const router = useRouter();
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
      try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: values.email.trim().toLowerCase(),
            password: values.password,
          }),
        });

        const data = (await res.json()) as {
          ok?: boolean;
          message?: string;
          next?: string;
        };

        if (!res.ok || !data.ok) {
          setErrorMessage(
            data.message ||
              "Identifiants incorrects ou compte inaccessible.",
          );
          return;
        }

        const destination =
          safeNext && safeNext.startsWith("/admin")
            ? safeNext
            : data.next || "/admin";

        router.replace(destination);
        router.refresh();
      } catch {
        setErrorMessage(
          "Impossible de joindre le serveur de connexion. Réessayez.",
        );
      }
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3" noValidate>
      <input type="hidden" {...register("next")} />

      <div className="border-b border-slate-100 pb-2.5">
        <p className="text-[13px] font-semibold text-[#0d254e]">Connexion</p>
        <p className="mt-0.5 text-[11px] text-slate-500">
          Identifiants administrateur AFD.
        </p>
      </div>

      {errorMessage ? (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-[12px] text-red-700"
        >
          {errorMessage}
        </div>
      ) : null}

      <div>
        <label htmlFor="login-email" className={compactLabel}>
          Adresse e-mail
        </label>
        <input
          id="login-email"
          type="email"
          autoComplete="email"
          className={compactField}
          disabled={pending}
          {...register("email")}
        />
        {errors.email ? (
          <p className={`${errorClassName} !mt-1 !text-[11px]`}>
            {errors.email.message}
          </p>
        ) : null}
      </div>

      <div>
        <div className="mb-1 flex items-center justify-between gap-2">
          <label htmlFor="login-password" className={`${compactLabel} !mb-0`}>
            Mot de passe
          </label>
          <Link
            href="/mot-de-passe-oublie"
            className="text-[11px] font-medium text-[#2563eb] hover:underline"
          >
            Oublié ?
          </Link>
        </div>
        <div className="relative">
          <input
            id="login-password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            className={`${compactField} pr-10`}
            disabled={pending}
            {...register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
            aria-label={
              showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"
            }
          >
            {showPassword ? (
              <EyeOff className="size-4" aria-hidden />
            ) : (
              <Eye className="size-4" aria-hidden />
            )}
          </button>
        </div>
        {errors.password ? (
          <p className={`${errorClassName} !mt-1 !text-[11px]`}>
            {errors.password.message}
          </p>
        ) : null}
      </div>

      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-[40px] w-full items-center justify-center gap-2 rounded-lg bg-[var(--afd-orange)] px-4 text-sm font-bold text-white shadow-[0_6px_16px_rgba(233,147,8,0.28)] transition hover:bg-[var(--afd-orange-hover)] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? (
          <>
            <Loader2 className="size-4 animate-spin" aria-hidden />
            Connexion…
          </>
        ) : (
          "Se connecter"
        )}
      </button>
    </form>
  );
}
