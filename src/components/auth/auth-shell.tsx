import Link from "next/link";
import type { ReactNode } from "react";

type AuthShellProps = {
  title: string;
  children: ReactNode;
  subtitle?: string;
};

export function AuthShell({ title, children, subtitle }: AuthShellProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-[#0d254e] via-[#0d254e] to-[#1a3a6e] px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-white text-xl font-bold text-[#0d254e] shadow-lg">
            AFD
          </div>
          <h1 className="mt-4 font-display text-2xl font-semibold text-white">
            {title}
          </h1>
          {subtitle ? (
            <p className="mt-2 text-sm text-white/70">{subtitle}</p>
          ) : null}
        </div>

        <div className="rounded-2xl border border-white/10 bg-white p-6 shadow-xl md:p-8">
          {children}
        </div>

        <p className="mt-6 text-center">
          <Link
            href="/"
            className="text-sm text-white/70 transition hover:text-white"
          >
            ← Retour au site public
          </Link>
        </p>
      </div>
    </div>
  );
}
