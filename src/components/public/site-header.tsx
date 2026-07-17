"use client";

import { useEffect, useState } from "react";
import { SiteContainer } from "@/components/shared/SiteContainer";
import { DesktopNavigation } from "@/components/public/desktop-navigation";
import { HeaderActions } from "@/components/public/header-actions";
import { HeaderLogo } from "@/components/public/header-logo";
import { MobileNavigation } from "@/components/public/mobile-navigation";
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
        "sticky top-0 z-50 border-b bg-white transition-[box-shadow,background-color,border-color] duration-200",
        scrolled
          ? "border-[var(--afd-border)]/80 bg-white/95 shadow-[0_1px_0_rgba(16,35,63,0.04),0_10px_28px_rgba(16,35,63,0.05)] backdrop-blur-sm"
          : "border-[var(--afd-border)] shadow-none",
      )}
    >
      <SiteContainer
        className={cn(
          "flex items-center justify-between gap-8 transition-[height] duration-200 min-[1200px]:gap-10",
          scrolled ? "h-[84px]" : "h-[88px]",
        )}
      >
        <HeaderLogo compact={scrolled} />
        <DesktopNavigation />
        <div className="hidden items-center gap-8 min-[1200px]:flex">
          <HeaderActions compact={scrolled} />
        </div>
        <MobileNavigation />
      </SiteContainer>
    </header>
  );
}
