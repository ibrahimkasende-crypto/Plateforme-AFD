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
          "group relative inline-flex min-h-11 items-center gap-1 px-2.5 py-2 text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--afd-accent)] focus-visible:ring-offset-2",
          active
            ? "font-semibold text-[var(--afd-accent-bright)]"
            : "text-[var(--afd-ink)] hover:text-[var(--afd-accent)]",
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
            "absolute inset-x-2 -bottom-0.5 h-0.5 origin-left rounded-full bg-[var(--afd-accent-bright)] transition-transform duration-200",
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
          "absolute left-1/2 top-full z-50 w-max min-w-[18rem] max-w-[min(36rem,calc(100vw-2rem))] -translate-x-1/2 pt-2 transition-opacity duration-200",
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        )}
      >
        <div className="rounded-xl border border-[var(--afd-border)] bg-white p-2 shadow-[0_8px_28px_rgba(15,39,68,0.08)]">
          <div
            className={cn(
              "grid gap-1",
              columns === 2 && "sm:grid-cols-2 sm:gap-x-1",
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
                    "rounded-lg px-3 py-2.5 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--afd-accent)]",
                    childActive
                      ? "bg-[var(--afd-accent-soft)]"
                      : "hover:bg-[var(--afd-surface)]",
                  )}
                >
                  <span
                    className={cn(
                      "block text-sm font-medium",
                      childActive
                        ? "text-[var(--afd-accent-bright)]"
                        : "text-[var(--afd-ink)]",
                    )}
                  >
                    {child.label}
                  </span>
                  {child.description ? (
                    <span className="mt-0.5 block text-xs leading-snug text-[var(--afd-muted)]">
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
      className="hidden items-center gap-0.5 xl:flex"
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
                "group relative inline-flex min-h-11 items-center px-2.5 py-2 text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--afd-accent)] focus-visible:ring-offset-2",
                active
                  ? "font-semibold text-[var(--afd-accent-bright)]"
                  : "text-[var(--afd-ink)] hover:text-[var(--afd-accent)]",
              )}
            >
              {item.label}
              <span
                className={cn(
                  "absolute inset-x-2 -bottom-0.5 h-0.5 origin-left rounded-full bg-[var(--afd-accent-bright)] transition-transform duration-200",
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
