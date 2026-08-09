"use client";

import { useEffect, useState } from "react";
import { DesktopNavigation } from "@/components/public/desktop-navigation";
import { HeaderActions } from "@/components/public/header-actions";
import { MobileNavigation } from "@/components/public/mobile-navigation";
import { OrganizationBrand } from "@/components/public/organization-brand";
import { ThemeToggle } from "@/components/public/theme-toggle";
import { cn } from "@/lib/utils";

function useScrolled(threshold = 16) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > threshold);
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return scrolled;
}

/**
 * Header public — 3 zones stables :
 * gauche (marque) | centre (nav desktop) | droite (actions / hamburger)
 *
 * Breakpoints :
 * - &lt; 1280 : menu mobile
 * - 1280–1439 : desktop compact + « Plus »
 * - ≥ 1440 : desktop complet + marque full
 */
export function SiteHeader() {
  const scrolled = useScrolled();

  return (
    <header
      data-testid="site-header"
      data-scrolled={scrolled ? "true" : "false"}
      className={cn(
        "sticky top-0 z-50 border-b transition-[box-shadow,background-color,border-color] duration-200",
        "border-[var(--afd-border)] bg-[var(--afd-header-bg)]",
        "pt-[env(safe-area-inset-top)]",
        scrolled &&
          "shadow-[0_1px_0_rgba(16,35,63,0.04),0_10px_28px_rgba(16,35,63,0.05)] backdrop-blur-sm",
      )}
    >
      <div
        className={cn(
          "mx-auto flex w-full max-w-[1600px] min-w-0 items-center",
          "h-16 min-[1280px]:h-[4.5rem] min-[1440px]:h-[5rem]",
          "gap-3 px-4 sm:px-5 min-[1280px]:gap-4 min-[1280px]:px-6 min-[1440px]:gap-6 min-[1440px]:px-8",
        )}
      >
        {/* ZONE GAUCHE — marque */}
        <div
          data-header-zone="left"
          className="flex min-w-0 shrink-0 items-center"
        >
          <OrganizationBrand variant="auto" />
        </div>

        {/* ZONE CENTRE — navigation desktop (≥1280) */}
        <div
          data-header-zone="center"
          className="hidden min-w-0 flex-1 items-center justify-center min-[1280px]:flex"
        >
          <DesktopNavigation />
        </div>

        {/* ZONE DROITE — actions desktop / mobile */}
        <div
          data-header-zone="right"
          className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2"
        >
          <div className="hidden items-center gap-2 min-[1280px]:flex">
            <ThemeToggle />
            <HeaderActions compact={scrolled} />
          </div>

          <div className="flex items-center gap-1.5 min-[1280px]:hidden sm:gap-2">
            <ThemeToggle className="size-10 shrink-0" />
            <MobileNavigation />
          </div>
        </div>
      </div>
    </header>
  );
}
