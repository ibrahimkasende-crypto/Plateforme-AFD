"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useId, useRef, useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import {
  isNavItemActive,
  publicNavigation,
  type PublicNavItem,
} from "@/config/public-navigation";
import { cn } from "@/lib/utils";

function DesktopDropdown({
  item,
  open,
  onOpen,
  onClose,
}: {
  item: PublicNavItem;
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const active = isNavItemActive(pathname, item.href);
  const menuId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const columns = (item.children?.length ?? 0) > 5 ? 2 : 1;

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    function onPointerDown(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onPointerDown);
    };
  }, [open, onClose]);

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseEnter={onOpen}
      onMouseLeave={onClose}
    >
      <button
        type="button"
        className={cn(
          "afd-nav-link group relative inline-flex min-h-11 items-center gap-1.5 py-2 transition-colors duration-180 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--afd-blue)] focus-visible:ring-offset-2",
          active
            ? "text-[var(--afd-blue)]"
            : "text-[var(--afd-text)] hover:text-[var(--afd-blue)]",
        )}
        aria-expanded={open}
        aria-haspopup="true"
        aria-controls={menuId}
        onClick={() => (open ? onClose() : onOpen())}
      >
        {item.label}
        <ChevronDown
          className={cn(
            "size-3.5 transition-transform duration-200",
            open && "rotate-180",
          )}
          aria-hidden
        />
        <span
          className={cn(
            "absolute inset-x-0 -bottom-0.5 h-0.5 origin-left rounded-full bg-[var(--afd-blue)] transition-transform duration-200",
            active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
          )}
          aria-hidden
        />
      </button>

      <div
        id={menuId}
        role="menu"
        hidden={!open}
        className={cn(
          "absolute left-1/2 top-full z-50 w-max min-w-[20rem] max-w-[min(40rem,calc(100vw-2rem))] -translate-x-1/2 pt-3 transition-opacity duration-200",
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        )}
      >
        <div className="rounded-2xl border border-[var(--afd-border)] bg-white p-3 shadow-[0_12px_36px_rgba(16,35,63,0.1)]">
          <div
            className={cn(
              "grid gap-2.5",
              columns === 2 && "sm:grid-cols-2 sm:gap-x-3",
            )}
          >
            {item.children?.map((child) => {
              const childActive =
                pathname === child.href ||
                (child.href !== item.href &&
                  pathname.startsWith(`${child.href}/`));

              return (
                <Link
                  key={`${child.href}-${child.label}`}
                  href={child.href}
                  role="menuitem"
                  onClick={onClose}
                  className={cn(
                    "rounded-xl px-3.5 py-3 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--afd-blue)]",
                    childActive
                      ? "bg-[var(--afd-light-blue)]"
                      : "hover:bg-[var(--afd-background)]",
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
                    <span className="mt-1 block text-[13px] leading-snug text-[var(--afd-muted)]">
                      {child.description}
                    </span>
                  ) : null}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export function DesktopNavigation() {
  const pathname = usePathname();
  const [openHref, setOpenHref] = useState<string | null>(null);
  const [pathSnapshot, setPathSnapshot] = useState(pathname);

  if (pathname !== pathSnapshot) {
    setPathSnapshot(pathname);
    setOpenHref(null);
  }

  return (
    <nav
      className="hidden items-center gap-7 min-[1200px]:flex min-[1280px]:gap-8"
      aria-label="Navigation principale"
    >
      {publicNavigation.map((item) => {
        const active = isNavItemActive(pathname, item.href);
        const hasChildren = Boolean(item.children?.length);

        if (!hasChildren) {
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "afd-nav-link group relative inline-flex min-h-11 items-center py-2 transition-colors duration-180 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--afd-blue)] focus-visible:ring-offset-2",
                active
                  ? "text-[var(--afd-blue)]"
                  : "text-[var(--afd-text)] hover:text-[var(--afd-blue)]",
              )}
            >
              {item.label}
              <span
                className={cn(
                  "absolute inset-x-0 -bottom-0.5 h-0.5 origin-left rounded-full bg-[var(--afd-blue)] transition-transform duration-200",
                  active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
                )}
                aria-hidden
              />
            </Link>
          );
        }

        return (
          <DesktopDropdown
            key={item.href}
            item={item}
            open={openHref === item.href}
            onOpen={() => setOpenHref(item.href)}
            onClose={() => setOpenHref(null)}
          />
        );
      })}
    </nav>
  );
}
