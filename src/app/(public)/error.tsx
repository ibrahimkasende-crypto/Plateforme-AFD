"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function PublicError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-4 py-16 text-center">
      <h1 className="font-display text-2xl font-semibold text-[var(--afd-ink)]">
        Une erreur est survenue
      </h1>
      <p className="mt-3 max-w-md text-sm text-[var(--afd-muted)]">
        Le contenu n’a pas pu être chargé. Vous pouvez réessayer ou revenir à l’accueil.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={() => reset()}
          className="inline-flex min-h-10 items-center rounded-lg bg-[var(--afd-blue)] px-4 text-sm font-semibold text-white transition hover:bg-[var(--afd-blue-hover)]"
        >
          Réessayer
        </button>
        <Link
          href="/"
          className="inline-flex min-h-10 items-center rounded-lg border border-[var(--afd-border)] px-4 text-sm font-semibold text-[var(--afd-ink)] transition hover:border-[var(--afd-blue)]/40"
        >
          Accueil
        </Link>
      </div>
    </div>
  );
}
