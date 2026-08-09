"use client";

import { useState } from "react";
import { toast } from "sonner";
import { GoogleIcon } from "@/components/newsletter/google-icon";
import {
  isNewsletterGoogleButtonVisible,
  startGoogleNewsletterOAuth,
} from "@/lib/newsletter/google-oauth";
import { cn } from "@/lib/utils";

export function NewsletterGoogleButton({
  disabled = false,
  className,
}: {
  disabled?: boolean;
  className?: string;
}) {
  const [pending, setPending] = useState(false);

  if (!isNewsletterGoogleButtonVisible()) {
    return null;
  }

  async function onClick() {
    if (pending || disabled) return;

    setPending(true);
    try {
      const result = await startGoogleNewsletterOAuth();
      if (!result.ok) {
        toast.error(result.message);
        setPending(false);
      }
      // Si ok, redirection Google — le pending reste affiché
    } catch {
      toast.error(
        "Impossible de démarrer Google. Inscrivez-vous avec votre e-mail.",
      );
      setPending(false);
    }
  }

  return (
    <button
      type="button"
      onClick={() => void onClick()}
      disabled={disabled || pending}
      aria-busy={pending}
      aria-label="Continuer avec Google"
      className={cn(
        "inline-flex min-h-12 w-full items-center justify-center gap-2.5 rounded-xl border border-[#dadce0] bg-white px-4 text-[15px] font-semibold text-[#3c4043] shadow-sm transition hover:bg-[#f8f9fa] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--afd-blue)] focus-visible:ring-offset-2 disabled:opacity-60",
        className,
      )}
    >
      <GoogleIcon className="size-5 shrink-0" />
      {pending ? "Redirection vers Google…" : "Continuer avec Google"}
    </button>
  );
}
