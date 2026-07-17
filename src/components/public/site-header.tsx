"use client";

import { useEffect, useState } from "react";
import { DesktopNavigation } from "@/components/public/desktop-navigation";
import { HeaderActions } from "@/components/public/header-actions";
import { HeaderLogo } from "@/components/public/header-logo";
import { MobileNavigation } from "@/components/public/mobile-navigation";
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

export function SiteHeader() {
  const scrolled = useScrolled();

  return (
    <header
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
          "mx-auto grid w-full max-w-[1600px] min-w-0 items-center px-3 sm:px-4 lg:px-4",
          "grid-cols-[minmax(0,1fr)_auto] min-[1200px]:grid-cols-[auto_minmax(0,1fr)_auto]",
          "min-[1200px]:gap-x-4",
          "h-16 min-[1200px]:h-[86px]",
          scrolled && "min-[1200px]:h-[80px]",
        )}
      >
        <HeaderLogo compact={scrolled} className="min-w-0 justify-self-start" />

        <DesktopNavigation className="hidden min-[1200px]:flex" />

        <div className="hidden items-center gap-2 justify-self-end min-[1200px]:flex">
          <ThemeToggle />
          <HeaderActions compact={scrolled} />
        </div>

        <div className="flex min-w-0 items-center gap-1.5 justify-self-end min-[1200px]:hidden sm:gap-2">
          <ThemeToggle className="size-10 shrink-0" />
          <MobileNavigation />
        </div>
      </div>
    </header>
  );
}
