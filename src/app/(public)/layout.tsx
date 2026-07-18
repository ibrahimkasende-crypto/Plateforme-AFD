import { AppEntryExperience } from "@/components/shared/app-entry-loader";
import { AfdCursor } from "@/components/shared/afd-cursor";
import { FloatingDonateButton } from "@/components/public/floating-donate-button";
import { SiteFooter } from "@/components/public/site-footer";
import { SiteHeader } from "@/components/public/site-header";
import type { ReactNode } from "react";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-full min-w-0 flex-1 flex-col">
      <a
        href="#contenu-principal"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-[var(--afd-blue)] focus:px-4 focus:py-2.5 focus:text-sm focus:font-bold focus:text-white"
      >
        Aller au contenu principal
      </a>
      <AfdCursor />
      <SiteHeader />
      <main id="contenu-principal" className="min-w-0 flex-1">
        {children}
      </main>
      <SiteFooter />
      <FloatingDonateButton />
      <AppEntryExperience />
    </div>
  );
}
