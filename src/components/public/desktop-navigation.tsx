"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  getDesktopNavPrimary,
  getDesktopNavSecondary,
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
  align = "center",
  triggerLabel,
}: {
  item: PublicNavItem;
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
  align?: "start" | "center" | "end";
  triggerLabel?: string;
}) {
  const pathname = usePathname();
  const active = isNavItemActive(pathname, item.href);
  const menuId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const columns = (item.children?.length ?? 0) > 5 ? 2 : 1;
  const label = triggerLabel ?? item.label;

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
          "group relative inline-flex min-h-9 items-center gap-1 whitespace-nowrap rounded-md px-1.5 py-1.5 text-[12.5px] font-semibold leading-5 tracking-[0.01em] transition-colors duration-180",
          "min-[1440px]:min-h-10 min-[1440px]:px-1 min-[1440px]:text-[13px]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--afd-blue)] focus-visible:ring-offset-2",
          active
            ? "text-[var(--afd-blue)]"
            : "text-[var(--afd-text)] hover:text-[var(--afd-blue)]",
        )}
        aria-expanded={open}
        aria-haspopup="true"
        aria-controls={menuId}
        onClick={() => (open ? onClose() : onOpen())}
      >
        {label}
        <ChevronDown
          className={cn(
            "size-3.5 shrink-0 opacity-70 transition-transform duration-200",
            open && "rotate-180",
          )}
          aria-hidden
        />
        <span
          className={cn(
            "absolute inset-x-1.5 -bottom-0.5 h-0.5 origin-left rounded-full bg-[var(--afd-blue)] transition-transform duration-200",
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
          "absolute top-full z-50 w-max min-w-[18rem] max-w-[min(36rem,calc(100vw-2rem))] pt-2 transition-opacity duration-200",
          align === "start" && "left-0",
          align === "center" && "left-1/2 -translate-x-1/2",
          align === "end" && "right-0",
          open
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0",
        )}
      >
        <div className="rounded-2xl border border-[var(--afd-border)] bg-[var(--afd-surface-elevated)] p-3 shadow-[0_12px_36px_rgba(16,35,63,0.1)]">
          <div
            className={cn(
              "grid gap-2",
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
                    "rounded-xl px-3 py-2.5 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--afd-blue)]",
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
                    <span className="mt-1 block text-[12px] leading-snug text-[var(--afd-muted)]">
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

function NavLink({ item }: { item: PublicNavItem }) {
  const pathname = usePathname();
  const active = isNavItemActive(pathname, item.href);

  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "group relative inline-flex min-h-9 items-center whitespace-nowrap rounded-md px-1.5 py-1.5 text-[12.5px] font-semibold leading-5 tracking-[0.01em] transition-colors duration-180",
        "min-[1440px]:min-h-10 min-[1440px]:px-1 min-[1440px]:text-[13px]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--afd-blue)] focus-visible:ring-offset-2",
        active
          ? "text-[var(--afd-blue)]"
          : "text-[var(--afd-text)] hover:text-[var(--afd-blue)]",
      )}
    >
      {item.label}
      <span
        className={cn(
          "absolute inset-x-1.5 -bottom-0.5 h-0.5 origin-left rounded-full bg-[var(--afd-blue)] transition-transform duration-200",
          active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
        )}
        aria-hidden
      />
    </Link>
  );
}

function renderItem(
  item: PublicNavItem,
  openHref: string | null,
  setOpenHref: (href: string | null) => void,
  align: "start" | "center" | "end" = "center",
) {
  const hasChildren = Boolean(item.children?.length);
  if (!hasChildren) {
    return <NavLink key={item.href} item={item} />;
  }
  return (
    <DesktopDropdown
      key={item.href}
      item={item}
      open={openHref === item.href}
      onOpen={() => setOpenHref(item.href)}
      onClose={() => setOpenHref(null)}
      align={align}
    />
  );
}

export function DesktopNavigation({ className }: { className?: string }) {
  const pathname = usePathname();
  const [openHref, setOpenHref] = useState<string | null>(null);
  const [pathSnapshot, setPathSnapshot] = useState(pathname);

  if (pathname !== pathSnapshot) {
    setPathSnapshot(pathname);
    setOpenHref(null);
  }

  const primary = getDesktopNavPrimary();
  const secondary = getDesktopNavSecondary();
  const plusItem: PublicNavItem = {
    label: "Plus",
    href: "#plus",
    children: secondary.map((item) => ({
      label: item.label,
      href: item.href,
      description: item.children?.length
        ? `${item.children.length} sections`
        : undefined,
    })),
  };

  const moreActive = secondary.some((item) =>
    isNavItemActive(pathname, item.href),
  );

  return (
    <nav
      data-testid="desktop-navigation"
      className={cn(
        "flex min-w-0 max-w-full items-center justify-center gap-1.5 min-[1440px]:gap-3",
        className,
      )}
      aria-label="Navigation principale"
    >
      {primary.map((item, index) =>
        renderItem(
          item,
          openHref,
          setOpenHref,
          index === 0 ? "start" : "center",
        ),
      )}

      {/* Mode full ≥1440 : tous les liens secondaires */}
      <div className="hidden items-center gap-3 min-[1440px]:flex">
        {secondary.map((item, index) =>
          renderItem(
            item,
            openHref,
            setOpenHref,
            index === secondary.length - 1 ? "end" : "center",
          ),
        )}
      </div>

      {/* Mode compact 1280–1439 : menu Plus */}
      <div className="flex min-[1440px]:hidden" data-testid="nav-plus-menu">
        <DesktopDropdown
          item={plusItem}
          open={openHref === plusItem.href}
          onOpen={() => setOpenHref(plusItem.href)}
          onClose={() => setOpenHref(null)}
          align="end"
          triggerLabel={moreActive ? "Plus" : "Plus"}
        />
      </div>

      {/* Fallback SSR / accessibilité : liens complets non affichés en compact
          déjà couverts par primary + Plus / secondary */}
      <span className="sr-only">
        {publicNavigation.map((item) => item.label).join(", ")}
      </span>
    </nav>
  );
}
