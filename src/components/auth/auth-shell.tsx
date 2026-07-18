import Link from "next/link";
import type { ReactNode } from "react";
import { AnimatedUniverseBackground } from "@/components/auth/animated-universe-background";
import { AuthBrandPanel } from "@/components/auth/auth-brand-panel";

type AuthShellProps = {
  title: string;
  children: ReactNode;
  subtitle?: string;
};

export function AuthShell({ title, children, subtitle }: AuthShellProps) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-10 sm:px-5 md:py-12">
      <AnimatedUniverseBackground />

      <div className="relative z-10 w-full max-w-[460px]">
        <AuthBrandPanel className="mb-7" />

        <div className="rounded-2xl border border-white/15 bg-white p-6 shadow-2xl sm:p-8">
          <h1 className="font-display text-[1.35rem] font-bold leading-tight text-[#0c1733] md:text-[1.5rem]">
            {title}
          </h1>
          {subtitle ? (
            <p className="mt-2 text-sm leading-relaxed text-[#5f6f83]">
              {subtitle}
            </p>
          ) : null}
          <div className="mt-5">{children}</div>
        </div>

        <p className="mt-5 text-center text-xs text-white/55">
          Alliance des Femmes pour le Développement — R.D. Congo
        </p>
        <p className="mt-2.5 text-center">
          <Link
            href="/"
            className="text-sm font-medium text-white/85 transition hover:text-white"
          >
            ← Retour au site public
          </Link>
        </p>
      </div>
    </div>
  );
}
