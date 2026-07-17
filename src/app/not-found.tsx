import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page introuvable",
  description: "La page demandée n’existe pas ou n’est plus disponible.",
};

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center">
      <p className="text-sm font-semibold uppercase tracking-wide text-[var(--afd-muted)]">
        Erreur 404
      </p>
      <h1 className="mt-2 font-display text-3xl font-semibold text-[var(--afd-ink)]">
        Page introuvable
      </h1>
      <p className="mt-3 max-w-md text-sm text-[var(--afd-muted)]">
        La page que vous recherchez n’existe pas, a été déplacée ou n’est plus disponible.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="inline-flex min-h-10 items-center rounded-lg bg-[var(--afd-blue)] px-4 text-sm font-semibold text-white transition hover:bg-[var(--afd-blue-hover)]"
        >
          Retour à l’accueil
        </Link>
        <Link
          href="/contact"
          className="inline-flex min-h-10 items-center rounded-lg border border-[var(--afd-border)] px-4 text-sm font-semibold text-[var(--afd-ink)] transition hover:border-[var(--afd-blue)]/40"
        >
          Nous contacter
        </Link>
      </div>
    </div>
  );
}
