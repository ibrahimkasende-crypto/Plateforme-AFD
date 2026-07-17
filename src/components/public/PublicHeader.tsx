"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { publicCtas, publicNavigation } from "@/config/public-navigation";
import { siteConfig } from "@/config/site";
import { SiteContainer } from "@/components/shared/SiteContainer";
import { cn } from "@/lib/utils";

export function PublicHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--adf-border)] bg-white/95 backdrop-blur">
      <SiteContainer className="flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/adf-logo.jpg"
            alt=""
            className="size-10 rounded-full object-cover"
          />
          <div className="min-w-0">
            <p className="truncate font-display text-sm font-semibold text-[var(--adf-ink)] sm:text-base">
              {siteConfig.shortName}
            </p>
            <p className="hidden truncate text-xs text-[var(--adf-muted)] sm:block">
              Alliance des Femmes pour le Développement
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Navigation principale">
          {publicNavigation.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname === item.href || pathname.startsWith(`${item.href}/`);
            const hasChildren = Boolean(item.children?.length);

            if (!hasChildren) {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-lg px-3 py-2 text-sm font-medium transition",
                    active
                      ? "bg-[var(--adf-accent-soft)] text-[var(--adf-accent)]"
                      : "text-[var(--adf-ink)] hover:bg-[var(--adf-surface)]",
                  )}
                >
                  {item.label}
                </Link>
              );
            }

            return (
              <div
                key={item.href}
                className="relative"
                onMouseEnter={() => setOpenMenu(item.href)}
                onMouseLeave={() => setOpenMenu(null)}
              >
                <button
                  type="button"
                  className={cn(
                    "inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition",
                    active
                      ? "bg-[var(--adf-accent-soft)] text-[var(--adf-accent)]"
                      : "text-[var(--adf-ink)] hover:bg-[var(--adf-surface)]",
                  )}
                  aria-expanded={openMenu === item.href}
                  aria-haspopup="true"
                  onClick={() =>
                    setOpenMenu((current) =>
                      current === item.href ? null : item.href,
                    )
                  }
                >
                  {item.label}
                  <ChevronDown className="size-4" aria-hidden />
                </button>
                {openMenu === item.href ? (
                  <div className="absolute left-0 top-full z-50 min-w-64 rounded-xl border border-[var(--adf-border)] bg-white p-2 shadow-lg">
                    <Link
                      href={item.href}
                      className="block rounded-lg px-3 py-2 text-sm font-medium text-[var(--adf-accent)] hover:bg-[var(--adf-surface)]"
                    >
                      Vue d’ensemble
                    </Link>
                    {item.children?.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block rounded-lg px-3 py-2 text-sm text-[var(--adf-ink)] hover:bg-[var(--adf-surface)]"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          {publicCtas.map((cta) => (
            <Link
              key={cta.href}
              href={cta.href}
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-semibold transition",
                cta.variant === "primary"
                  ? "bg-[var(--adf-accent)] text-white hover:bg-[var(--adf-accent-strong)]"
                  : "border border-[var(--adf-border)] text-[var(--adf-ink)] hover:bg-[var(--adf-surface)]",
              )}
            >
              {cta.label}
            </Link>
          ))}
        </div>

        <button
          type="button"
          className="inline-flex size-10 items-center justify-center rounded-lg border border-[var(--adf-border)] lg:hidden"
          aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
          onClick={() => setMobileOpen((value) => !value)}
        >
          {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </SiteContainer>

      {mobileOpen ? (
        <div className="border-t border-[var(--adf-border)] bg-white lg:hidden">
          <SiteContainer className="space-y-2 py-4">
            {publicNavigation.map((item) => (
              <div key={item.href} className="space-y-1">
                <Link
                  href={item.href}
                  className="block rounded-lg px-3 py-2 text-sm font-semibold text-[var(--adf-ink)]"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
                {item.children?.map((child) => (
                  <Link
                    key={child.href}
                    href={child.href}
                    className="block rounded-lg px-5 py-1.5 text-sm text-[var(--adf-muted)]"
                    onClick={() => setMobileOpen(false)}
                  >
                    {child.label}
                  </Link>
                ))}
              </div>
            ))}
            <div className="flex flex-col gap-2 pt-2">
              {publicCtas.map((cta) => (
                <Link
                  key={cta.href}
                  href={cta.href}
                  className={cn(
                    "rounded-lg px-3 py-2 text-center text-sm font-semibold",
                    cta.variant === "primary"
                      ? "bg-[var(--adf-accent)] text-white"
                      : "border border-[var(--adf-border)]",
                  )}
                  onClick={() => setMobileOpen(false)}
                >
                  {cta.label}
                </Link>
              ))}
            </div>
          </SiteContainer>
        </div>
      ) : null}
    </header>
  );
}
