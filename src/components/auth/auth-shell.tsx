import Link from "next/link";
import type { ReactNode } from "react";
import { AnimatedUniverseBackground } from "@/components/auth/animated-universe-background";
import { AuthBrandPanel } from "@/components/auth/auth-brand-panel";
import { organizationBrand } from "@/config/organization-brand";
import { productBrand } from "@/config/product-brand";

type AuthShellProps = {
  title: string;
  children: ReactNode;
  subtitle?: string;
};

export function AuthShell({ title, children, subtitle }: AuthShellProps) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-3 py-6 sm:px-4 md:py-8">
      <AnimatedUniverseBackground />

      <div className="relative z-10 w-full max-w-[360px] sm:max-w-[380px]">
        <AuthBrandPanel compact className="mb-4" />

        <div className="rounded-xl border border-white/15 bg-white px-4 py-4 shadow-2xl sm:px-5 sm:py-5">
          <h1 className="font-display text-[1.15rem] font-bold leading-tight text-[#0c1733] sm:text-[1.25rem]">
            {title}
          </h1>
          {subtitle ? (
            <p className="mt-1.5 text-[12px] leading-snug text-[#5f6f83]">
              {subtitle}
            </p>
          ) : null}
          <div className="mt-3.5">{children}</div>
        </div>

        <p className="mt-3.5 text-center text-[11px] text-white/55" data-afd-platform-brand>
          {productBrand.poweredByLabel}
        </p>
        <p className="mt-1 text-center text-[10px] text-white/40">
          {organizationBrand.organizationLegalName}
        </p>
        <p className="mt-1.5 text-center">
          <Link
            href="/"
            className="text-xs font-medium text-white/85 transition hover:text-white"
          >
            ← Retour au site public
          </Link>
        </p>
      </div>
    </div>
  );
}
