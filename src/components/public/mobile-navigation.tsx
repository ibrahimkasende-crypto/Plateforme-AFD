"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import {
  isNavItemActive,
  publicNavigation,
} from "@/config/public-navigation";
import { siteConfig } from "@/config/site";
import { HeaderActions } from "@/components/public/header-actions";
import { HeaderLogo } from "@/components/public/header-logo";
import { cn } from "@/lib/utils";

export function MobileNavigation() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const backdropArmedRef = useRef(false);
  const panelId = useId();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) {
      backdropArmedRef.current = false;
      return;
    }

    const armTimer = window.setTimeout(() => {
      backdropArmedRef.current = true;
    }, 120);
    const previousOverflow = document.body.style.overflow;
    const triggerNode = triggerRef.current;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      window.clearTimeout(armTimer);
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      triggerNode?.focus();
    };
  }, [open]);

  function closeMenu() {
    setOpen(false);
    setExpanded(null);
  }

  function toggleMenu() {
    setOpen((value) => !value);
  }

  return (
    <div className="flex items-center gap-1.5 sm:gap-2">
      <HeaderActions
        compact
        showJoin={false}
        showSupport
        className="flex"
      />

      <button
        ref={triggerRef}
        type="button"
        data-testid="mobile-menu-trigger"
        className={cn(
          "inline-flex size-11 shrink-0 items-center justify-center rounded-md border border-[var(--afd-border)] text-[var(--afd-navy)] transition-colors duration-150 hover:bg-[var(--afd-light-blue)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--afd-blue)] focus-visible:ring-offset-2",
          open && "relative z-[70]",
        )}
        aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={toggleMenu}
      >
        {open ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
      </button>

      {open ? (
        <div className="fixed inset-0 z-[60]" role="presentation">
          <button
            type="button"
            className="absolute inset-0 bg-[var(--afd-navy)]/40"
            aria-label="Fermer le menu"
            onClick={() => {
              if (backdropArmedRef.current) closeMenu();
            }}
          />

          <div
            id={panelId}
            role="dialog"
            aria-modal="true"
            aria-label="Menu de navigation"
            data-testid="mobile-menu-panel"
            className="afd-drawer-panel absolute inset-y-0 right-0 flex w-[min(100%,88vw)] max-w-sm flex-col bg-[var(--afd-surface-elevated)] pb-[env(safe-area-inset-bottom)] shadow-[0_0_40px_rgba(15,39,68,0.12)]"
          >
            <div className="flex items-center justify-between border-b border-[var(--afd-border)] px-4 py-3">
              <HeaderLogo compact />
              <button
                ref={closeButtonRef}
                type="button"
                className="inline-flex size-11 items-center justify-center rounded-lg border border-[var(--afd-border)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--afd-accent)]"
                aria-label="Fermer le menu"
                onClick={closeMenu}
              >
                <X className="size-5" aria-hidden />
              </button>
            </div>

            <nav
              className="flex-1 overflow-y-auto overscroll-contain px-3 py-4"
              aria-label="Navigation mobile"
            >
              <ul className="space-y-1">
                {publicNavigation.map((item) => {
                  const active = isNavItemActive(pathname, item.href);
                  const hasChildren = Boolean(item.children?.length);
                  const isExpanded = expanded === item.href;

                  if (!hasChildren) {
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          aria-current={active ? "page" : undefined}
                          onClick={closeMenu}
                          className={cn(
                            "flex min-h-11 items-center rounded-lg px-3 text-[15px] font-medium transition-colors duration-150",
                            active
                              ? "bg-[var(--afd-accent-soft)] text-[var(--afd-accent-bright)]"
                              : "text-[var(--afd-ink)] hover:bg-[var(--afd-surface)]",
                          )}
                        >
                          {item.label}
                        </Link>
                      </li>
                    );
                  }

                  return (
                    <li key={item.href} className="rounded-lg">
                      <button
                        type="button"
                        className={cn(
                          "flex min-h-11 w-full items-center justify-between rounded-lg px-3 text-left text-[15px] font-medium transition-colors duration-150",
                          active
                            ? "bg-[var(--afd-accent-soft)] text-[var(--afd-accent-bright)]"
                            : "text-[var(--afd-ink)] hover:bg-[var(--afd-surface)]",
                        )}
                        aria-expanded={isExpanded}
                        onClick={() =>
                          setExpanded((current) =>
                            current === item.href ? null : item.href,
                          )
                        }
                      >
                        {item.label}
                        <ChevronDown
                          className={cn(
                            "size-4 shrink-0 transition-transform duration-200",
                            isExpanded && "rotate-180",
                          )}
                          aria-hidden
                        />
                      </button>

                      {isExpanded ? (
                        <ul className="mt-1 space-y-1 border-l border-[var(--afd-border)] py-1 pl-3">
                          {item.children?.map((child) => (
                            <li key={`${child.href}-${child.label}`}>
                              <Link
                                href={child.href}
                                onClick={closeMenu}
                                className="flex min-h-11 items-center rounded-lg px-3 text-sm text-[var(--afd-muted)] transition-colors duration-150 hover:bg-[var(--afd-surface)] hover:text-[var(--afd-ink)]"
                              >
                                {child.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="space-y-3 border-t border-[var(--afd-border)] p-4">
              <HeaderActions fullWidth onNavigate={closeMenu} />
              <p className="text-center text-xs text-[var(--afd-muted)]">
                {siteConfig.shortName} · {siteConfig.countryShort}
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
