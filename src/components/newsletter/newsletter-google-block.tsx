"use client";

import { NewsletterGoogleButton } from "@/components/newsletter/newsletter-google-button";
import { isNewsletterGoogleButtonVisible } from "@/lib/newsletter/google-oauth";

/**
 * Séparateur « ou » + bouton Google — masqué si OAuth Google désactivé.
 */
export function NewsletterGoogleBlock({
  disabled = false,
}: {
  disabled?: boolean;
}) {
  if (!isNewsletterGoogleButtonVisible()) {
    return null;
  }

  return (
    <>
      <div className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-wide text-[var(--afd-muted)]">
        <span className="h-px flex-1 bg-[var(--afd-border)]" />
        ou
        <span className="h-px flex-1 bg-[var(--afd-border)]" />
      </div>
      <NewsletterGoogleButton disabled={disabled} />
    </>
  );
}
