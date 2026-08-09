"use client";

import { fieldClassName } from "@/components/ui/form-styles";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import {
  scorePasswordStrength,
  validatePasswordPolicy,
} from "@/lib/auth/password-policy";

type Props = {
  email?: string | null;
  displayName?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  requireCurrentPassword?: boolean;
  redirectTo?: string;
};

const STRENGTH_LABELS = ["Très faible", "Faible", "Moyen", "Bon", "Fort", "Excellent"];

export function ChangePasswordForm({
  email,
  displayName,
  firstName,
  lastName,
  requireCurrentPassword = false,
  redirectTo = "/admin",
}: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [feedback, setFeedback] = useState<{ ok: boolean; message: string } | null>(
    null,
  );

  const score = useMemo(() => scorePasswordStrength(password), [password]);
  const liveCheck = useMemo(
    () =>
      password
        ? validatePasswordPolicy(password, {
            email,
            displayName,
            firstName,
            lastName,
          })
        : null,
    [password, email, displayName, firstName, lastName],
  );

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFeedback(null);
    startTransition(async () => {
      try {
        const res = await fetch("/api/auth/change-password", {
          method: "POST",
          credentials: "same-origin",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            currentPassword: requireCurrentPassword
              ? currentPassword
              : undefined,
            password,
            confirmPassword,
          }),
        });
        const result = (await res.json()) as {
          ok?: boolean;
          message?: string;
          next?: string;
        };
        setFeedback({
          ok: Boolean(result.ok),
          message:
            result.message ||
            (result.ok
              ? "Mot de passe mis à jour."
              : "Le mot de passe n’a pas pu être mis à jour. Réessayez."),
        });
        if (result.ok) {
          setTimeout(() => router.replace(result.next || redirectTo), 800);
        }
      } catch {
        setFeedback({
          ok: false,
          message: "Le mot de passe n’a pas pu être mis à jour. Réessayez.",
        });
      }
    });
  }

  if (feedback?.ok) {
    return (
      <div
        role="status"
        className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
      >
        {feedback.message}
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      {feedback && !feedback.ok ? (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {feedback.message}
        </div>
      ) : null}

      <ul className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-600 space-y-1">
        <li>Au moins 12 caractères</li>
        <li>Une majuscule, une minuscule, un chiffre et un caractère spécial</li>
        <li>Différent de votre e-mail, de votre nom et des mots de passe temporaires</li>
      </ul>

      {requireCurrentPassword ? (
        <div>
          <label className="mb-1 block text-sm font-semibold text-slate-800">
            Mot de passe actuel
          </label>
          <div className="relative">
            <input
              type={showCurrent ? "text" : "password"}
              autoComplete="current-password"
              className={fieldClassName}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
              onClick={() => setShowCurrent((v) => !v)}
              aria-label={showCurrent ? "Masquer" : "Afficher"}
            >
              {showCurrent ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </div>
      ) : null}

      <div>
        <label className="mb-1 block text-sm font-semibold text-slate-800">
          Nouveau mot de passe
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            className={fieldClassName}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={12}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Masquer" : "Afficher"}
          >
            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
        <p className="mt-1 text-xs text-slate-500">
          Robustesse : {STRENGTH_LABELS[Math.min(score, STRENGTH_LABELS.length - 1)]}
        </p>
        {liveCheck && !liveCheck.ok ? (
          <p className="mt-1 text-xs text-amber-700">{liveCheck.message}</p>
        ) : null}
      </div>

      <div>
        <label className="mb-1 block text-sm font-semibold text-slate-800">
          Confirmation
        </label>
        <div className="relative">
          <input
            type={showConfirm ? "text" : "password"}
            autoComplete="new-password"
            className={fieldClassName}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={12}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
            onClick={() => setShowConfirm((v) => !v)}
            aria-label={showConfirm ? "Masquer" : "Afficher"}
          >
            {showConfirm ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-[var(--admin-primary,#0d254e)] px-4 text-sm font-semibold text-white disabled:opacity-60"
      >
        {pending ? <Loader2 className="size-4 animate-spin" /> : null}
        Enregistrer le nouveau mot de passe
      </button>
    </form>
  );
}
