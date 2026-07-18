import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { siteConfig } from "@/config/site";

type AuthShellProps = {
  title: string;
  children: ReactNode;
  subtitle?: string;
};

export function AuthShell({ title, children, subtitle }: AuthShellProps) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#0d254e] px-4 py-12">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -20%, #2563eb66, transparent), radial-gradient(ellipse 60% 40% at 100% 100%, #0877d133, transparent)",
        }}
      />

      <div className="relative w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto flex size-24 items-center justify-center rounded-full bg-white p-2 shadow-xl ring-4 ring-white/20">
            <Image
              src={siteConfig.logo.src}
              alt={siteConfig.logo.alt}
              width={88}
              height={88}
              className="size-full rounded-full object-cover"
              priority
            />
          </div>

          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#7dd3fc]">
            {siteConfig.shortName}
          </p>
          <h1 className="mt-2 font-display text-2xl font-semibold text-white md:text-[1.65rem]">
            {title}
          </h1>
          {subtitle ? (
            <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-white/75">
              {subtitle}
            </p>
          ) : null}
        </div>

        <div className="rounded-2xl border border-white/10 bg-white p-6 shadow-2xl md:p-8">
          {children}
        </div>

        <p className="mt-6 text-center text-xs text-white/55">
          Alliance des Femmes pour le Développement — R.D. Congo
        </p>
        <p className="mt-3 text-center">
          <Link
            href="/"
            className="text-sm font-medium text-white/80 transition hover:text-white"
          >
            ← Retour au site public
          </Link>
        </p>
      </div>
    </div>
  );
}
