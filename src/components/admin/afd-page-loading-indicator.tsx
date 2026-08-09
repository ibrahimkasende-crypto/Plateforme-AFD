"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

type AfdPageLoadingIndicatorProps = {
  className?: string;
  /** Force l’état « chargement » (ex. loading.tsx). */
  force?: boolean;
};

const MIN_VISIBLE_MS = 450;
const MAX_VISIBLE_MS = 12000;

/**
 * Badge flottant AFD pendant une navigation admin.
 */
export function AfdPageLoadingIndicator({
  className,
  force = false,
}: AfdPageLoadingIndicatorProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [navigating, setNavigating] = useState(false);
  const startedAtRef = useRef(0);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const maxTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function clearTimers() {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
    if (maxTimerRef.current) {
      clearTimeout(maxTimerRef.current);
      maxTimerRef.current = null;
    }
  }

  function beginNavigation() {
    clearTimers();
    startedAtRef.current = Date.now();
    setNavigating(true);
    maxTimerRef.current = setTimeout(() => {
      setNavigating(false);
    }, MAX_VISIBLE_MS);
  }

  function endNavigation() {
    const elapsed = Date.now() - startedAtRef.current;
    const wait = Math.max(0, MIN_VISIBLE_MS - elapsed);
    clearTimers();
    hideTimerRef.current = setTimeout(() => {
      setNavigating(false);
    }, wait);
  }

  useEffect(() => {
    if (!navigating && !force) return;
    endNavigation();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reset on route change only
  }, [pathname, searchParams]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const target = event.target as HTMLElement | null;
      const anchor = target?.closest("a");
      if (anchor) {
        if (anchor.target && anchor.target !== "_self") return;
        if (anchor.hasAttribute("download")) return;
        const href = anchor.getAttribute("href");
        if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) {
          return;
        }
        try {
          const url = new URL(href, window.location.href);
          if (url.origin !== window.location.origin) return;
          if (
            url.pathname === window.location.pathname &&
            url.search === window.location.search
          ) {
            return;
          }
          beginNavigation();
        } catch {
          // ignore
        }
        return;
      }

      // Boutons / éléments marqués pour navigation programmatique
      const navTrigger = target?.closest("[data-afd-nav-loading]");
      if (navTrigger) {
        beginNavigation();
      }
    };

    document.addEventListener("click", onClick, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      clearTimers();
    };
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (navigating || force) {
      root.classList.add("afd-page-navigating");
      root.style.cursor = "wait";
    } else {
      root.classList.remove("afd-page-navigating");
      root.style.cursor = "";
    }
    return () => {
      root.classList.remove("afd-page-navigating");
      root.style.cursor = "";
    };
  }, [navigating, force]);

  const busy = force || navigating;

  return (
    <>
      {busy ? (
        <div
          aria-hidden
          data-afd-nav-blocker
          className="fixed inset-0 z-[55] cursor-wait bg-[#01265d]/08 backdrop-blur-[1px]"
        />
      ) : null}

      {busy ? (
        <div
          role="status"
          aria-live="polite"
          aria-busy="true"
          aria-label="Chargement de la page"
          data-afd-page-loading
          data-busy="true"
          className={cn(
            "pointer-events-none fixed bottom-5 right-5 z-[60] flex scale-105 items-center gap-2.5 rounded-full border border-[#3ba3e6]/50 bg-[#01265d] px-3.5 py-2.5 text-white shadow-[0_12px_36px_rgba(1,26,87,0.35)] backdrop-blur-md transition-all duration-300",
            className,
          )}
        >
          <span className="relative inline-flex size-9 items-center justify-center">
            <span className="absolute inset-0 animate-ping rounded-full bg-[#3ba3e6]/40" />
            <span className="relative size-9 overflow-hidden rounded-full bg-white shadow-sm ring-2 ring-[#3ba3e6]/70 motion-safe:animate-[afd-logo-float_2.8s_ease-in-out_infinite]">
              <Image
                src={siteConfig.logo.src}
                alt=""
                width={36}
                height={36}
                className="size-full object-cover"
                priority
              />
            </span>
          </span>

          <span className="overflow-hidden whitespace-nowrap pr-1 text-[11px] font-semibold tracking-wide">
            Chargement…
          </span>
        </div>
      ) : null}
    </>
  );
}
