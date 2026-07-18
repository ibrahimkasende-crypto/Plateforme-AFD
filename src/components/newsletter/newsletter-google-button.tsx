"use client";

import { useState } from "react";
import { toast } from "sonner";
import { GoogleIcon } from "@/components/newsletter/google-icon";
import { startGoogleNewsletterOAuth } from "@/lib/newsletter/google-oauth";
import { cn } from "@/lib/utils";

export function NewsletterGoogleButton({
  consentChecked,
  disabled = false,
  returnPath = "/",
  className,
}: {
  consentChecked: boolean;
  disabled?: boolean;
  returnPath?: string;
  className?: string;
}) {
  const [pending, setPending] = useState(false);

  async function onClick() {
    if (!consentChecked) {
      toast.error(
        "Cochez d’abord la case de consentement pour continuer avec Google.",
      );
      return;
    }

    setPending(true);
    const result = await startGoogleNewsletterOAuth(returnPath);
    if (!result.ok) {
      toast.error(result.message);
      setPending(false);
    }
    // Si ok, redirection Google — le pending reste affiché
  }

  return (
    <button
      type="button"
      onClick={() => void onClick()}
      disabled={disabled || pending}
      className={cn(
        "inline-flex min-h-12 w-full items-center justify-center gap-2.5 rounded-xl border border-[#dadce0] bg-white px-4 text-[15px] font-semibold text-[#3c4043] shadow-sm transition hover:bg-[#f8f9fa] disabled:opacity-60",
        className,
      )}
    >
      <GoogleIcon className="size-5 shrink-0" />
      {pending ? "Redirection vers Google…" : "Continuer avec Google"}
    </button>
  );
}
