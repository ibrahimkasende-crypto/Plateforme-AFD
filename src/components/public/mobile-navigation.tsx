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
import { useBodyScrollLock } from "@/hooks/use-body-scroll-lock";
import { cn } from "@/lib/utils";

export function MobileNavigation() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const backdropArmedRef = useRef(false);
  const panelId = useId();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useBodyScrollLock(open);

  useEffect(() => {
    if (!open) {
      backdropArmedRef.current = false;
      return;
    }

    const armTimer = window.setTimeout(() => {
      backdropArmedRef.current = true;
    }, 120);
    const triggerNode = triggerRef.current;
    closeButtonRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      window.clearTimeout(armTimer);
      document.removeEventListener("keydown", onKeyDown);
      triggerNode?.focus();
    };
  }, [open]);

  // Reset menu when the route changes (pattern React « adjust state while rendering »)
  const [menuPath, setMenuPath] = useState(pathname);
  if (pathname !== menuPath) {
    setMenuPath(pathname);
    setOpen(false);
    setExpanded(null);
  }

  function closeMenu() {
    setOpen(false);
    setExpanded(null);
  }

  function toggleMenu() {
    setOpen((value) => !value);
  }

  return (
    <div className="flex items-center">
      <button
        ref={triggerRef}
        type="button"
        data-testid="mobile-menu-trigger"
        className={cn(
          "inline-flex size-11 shrink-0 items-center justify-center rounded-xl",
          "border border-[color-mix(in_srgb,var(--afd-blue)_18%,var(--afd-border))]",
          "bg-[color-mix(in_srgb,var(--afd-blue)_6%,var(--afd-surface-elevated))]",
          "text-[var(--afd-navy)] shadow-[0_1px_2px_rgba(6,38,83,0.04)]",
          "transition-[background-color,border-color,box-shadow,transform] duration-200",
          "hover:border-[color-mix(in_srgb,var(--afd-blue)_35%,var(--afd-border))] hover:bg-[var(--afd-light-blue)]",
          "active:scale-[0.97]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--afd-blue)] focus-visible:ring-offset-2",
          open && "pointer-events-none opacity-0",
        )}
        aria-label="Ouvrir le menu"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={toggleMenu}
      >
        <Menu className="size-5" aria-hidden />
      </button>

      {open ? (
        <div className="fixed inset-0 z-[60]" role="presentation">
          <button
            type="button"
            className="afd-drawer-backdrop absolute inset-0 bg-[color-mix(in_srgb,var(--afd-navy)_52%,transparent)] backdrop-blur-[3px]"
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
            className={cn(
              "afd-drawer-panel absolute right-0 top-0 flex h-[100dvh] max-h-[100dvh]",
              "w-[min(100%,22.5rem)] max-w-[100vw] flex-col overflow-hidden",
              "border-l border-white/10",
              "bg-[var(--afd-surface-elevated)]",
              "pb-[env(safe-area-inset-bottom)] pt-[env(safe-area-inset-top)]",
              "shadow-[-12px_0_40px_rgba(6,38,83,0.18)]",
            )}
          >
            {/* Bandeau marque */}
            <div className="relative overflow-hidden border-b border-[var(--afd-border)]">
              <div
                className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,color-mix(in_srgb,var(--afd-navy)_92%,#0877d1)_0%,color-mix(in_srgb,var(--afd-blue)_88%,#062653)_55%,#0a4f8a_100%)]"
                aria-hidden
              />
              <div
                className="pointer-events-none absolute -right-8 -top-10 size-36 rounded-full bg-white/10 blur-2xl"
                aria-hidden
              />
              <div
                className="pointer-events-none absolute -bottom-10 left-6 size-28 rounded-full bg-[var(--afd-orange)]/20 blur-2xl"
                aria-hidden
              />

              <div className="relative flex items-center justify-between gap-3 px-4 py-4">
                <div className="min-w-0">
                  <HeaderLogo onDark variant="compact" />
                  <p className="mt-1.5 truncate text-[11px] font-medium tracking-wide text-white/75">
                    {siteConfig.countryShort} · Ensemble pour le développement
                  </p>
                </div>
                <button
                  ref={closeButtonRef}
                  type="button"
                  className={cn(
                    "inline-flex size-11 shrink-0 items-center justify-center rounded-xl",
                    "border border-white/25 bg-white/10 text-white backdrop-blur-sm",
                    "transition-colors duration-150 hover:bg-white/20",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70",
                  )}
                  aria-label="Fermer le menu"
                  onClick={closeMenu}
                >
                  <X className="size-5" aria-hidden />
                </button>
              </div>
            </div>

            <nav
              className="flex-1 overflow-y-auto overscroll-contain px-3 py-4"
              aria-label="Navigation mobile"
            >
              <p className="mb-3 px-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--afd-muted)]">
                Menu
              </p>
              <ul className="space-y-1.5">
                {publicNavigation.map((item, index) => {
                  const active = isNavItemActive(pathname, item.href);
                  const hasChildren = Boolean(item.children?.length);
                  const isExpanded = expanded === item.href;

                  if (!hasChildren) {
                    return (
                      <li
                        key={item.href}
                        className="afd-drawer-item"
                        style={{ animationDelay: `${40 + index * 28}ms` }}
                      >
                        <Link
                          href={item.href}
                          aria-current={active ? "page" : undefined}
                          onClick={closeMenu}
                          className={cn(
                            "group relative flex min-h-12 items-center gap-3 overflow-hidden rounded-2xl px-3.5 text-[15px] font-semibold tracking-[0.01em] transition-colors duration-150",
                            active
                              ? "bg-[color-mix(in_srgb,var(--afd-blue)_10%,transparent)] text-[var(--afd-blue)]"
                              : "text-[var(--afd-ink)] hover:bg-[var(--afd-surface)]",
                          )}
                        >
                          <span
                            className={cn(
                              "absolute inset-y-2 left-0 w-1 rounded-full bg-[var(--afd-blue)] transition-opacity duration-150",
                              active ? "opacity-100" : "opacity-0 group-hover:opacity-40",
                            )}
                            aria-hidden
                          />
                          {item.label}
                        </Link>
                      </li>
                    );
                  }

                  return (
                    <li
                      key={item.href}
                      className="afd-drawer-item overflow-hidden rounded-2xl border border-transparent"
                      style={{ animationDelay: `${40 + index * 28}ms` }}
                    >
                      <button
                        type="button"
                        className={cn(
                          "flex min-h-12 w-full items-center justify-between gap-3 rounded-2xl px-3.5 text-left text-[15px] font-semibold tracking-[0.01em] transition-colors duration-150",
                          active || isExpanded
                            ? "bg-[color-mix(in_srgb,var(--afd-blue)_10%,transparent)] text-[var(--afd-blue)]"
                            : "text-[var(--afd-ink)] hover:bg-[var(--afd-surface)]",
                        )}
                        aria-expanded={isExpanded}
                        onClick={() =>
                          setExpanded((current) =>
                            current === item.href ? null : item.href,
                          )
                        }
                      >
                        <span>{item.label}</span>
                        <span
                          className={cn(
                            "inline-flex size-8 items-center justify-center rounded-lg transition-colors duration-150",
                            isExpanded
                              ? "bg-[var(--afd-blue)] text-white"
                              : "bg-[var(--afd-surface)] text-[var(--afd-muted)]",
                          )}
                        >
                          <ChevronDown
                            className={cn(
                              "size-4 transition-transform duration-200 ease-out",
                              isExpanded && "rotate-180",
                            )}
                            aria-hidden
                          />
                        </span>
                      </button>

                      {isExpanded ? (
                        <ul className="afd-drawer-submenu space-y-1 px-2 pb-2 pt-1">
                          {item.children?.map((child) => {
                            const childActive =
                              pathname === child.href ||
                              (child.href !== item.href &&
                                pathname.startsWith(`${child.href}/`));

                            return (
                              <li key={`${child.href}-${child.label}`}>
                                <Link
                                  href={child.href}
                                  onClick={closeMenu}
                                  className={cn(
                                    "block rounded-xl px-3 py-2.5 transition-colors duration-150",
                                    childActive
                                      ? "bg-[var(--afd-light-blue)]"
                                      : "hover:bg-[var(--afd-surface)]",
                                  )}
                                >
                                  <span
                                    className={cn(
                                      "block text-sm font-semibold",
                                      childActive
                                        ? "text-[var(--afd-blue)]"
                                        : "text-[var(--afd-navy)]",
                                    )}
                                  >
                                    {child.label}
                                  </span>
                                  {child.description ? (
                                    <span className="mt-0.5 block text-[12px] leading-snug text-[var(--afd-muted)]">
                                      {child.description}
                                    </span>
                                  ) : null}
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="space-y-3 border-t border-[var(--afd-border)] bg-[color-mix(in_srgb,var(--afd-surface)_55%,var(--afd-surface-elevated))] p-4">
              <HeaderActions fullWidth onNavigate={closeMenu} />
              <p className="text-center text-[11px] font-medium tracking-wide text-[var(--afd-muted)]">
                {siteConfig.shortName} · {siteConfig.countryShort}
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
