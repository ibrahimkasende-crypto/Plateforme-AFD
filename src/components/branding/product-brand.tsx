"use client";

import { ProductLogo } from "@/components/branding/product-logo";
import { productBrand } from "@/config/product-brand";
import { cn } from "@/lib/utils";

type ProductBrandProps = {
  mode?: "compact" | "extended";
  theme?: "light" | "dark";
  className?: string;
  showDescription?: boolean;
  logoAsButton?: boolean;
  onLogoClick?: () => void;
  logoAriaLabel?: string;
  logoTitle?: string;
};

export function ProductBrandBlock({
  mode = "extended",
  theme = "dark",
  className,
  showDescription = true,
  logoAsButton = false,
  onLogoClick,
  logoAriaLabel,
  logoTitle,
}: ProductBrandProps) {
  const isDark = theme === "dark";
  const compact = mode === "compact";

  const logo = (
    <ProductLogo size={compact ? "md" : "md"} priority />
  );

  return (
    <div
      className={cn(
        "flex min-w-0 items-center",
        compact ? "justify-center" : "gap-2.5",
        className,
      )}
      data-product-brand
      data-mode={mode}
    >
      {logoAsButton && onLogoClick ? (
        <button
          type="button"
          onClick={onLogoClick}
          className="relative size-10 shrink-0 overflow-hidden rounded-full bg-white ring-2 ring-white/20 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          aria-label={logoAriaLabel}
          title={logoTitle}
        >
          {logo}
        </button>
      ) : (
        <span className="shrink-0" title={productBrand.productName}>
          {logo}
        </span>
      )}

      <div
        className={cn(
          "min-w-0 transition-opacity duration-200",
          compact ? "sr-only opacity-0" : "opacity-100",
        )}
      >
        <p
          className={cn(
            "font-display text-[13.5px] font-bold leading-tight tracking-wide",
            isDark ? "text-white" : "text-slate-900",
          )}
        >
          {productBrand.productName}
        </p>
        {showDescription ? (
          <p
            className={cn(
              "mt-0.5 line-clamp-2 text-[10px] leading-snug",
              isDark ? "text-white/65" : "text-slate-500",
            )}
          >
            {productBrand.productTaglineShort}
          </p>
        ) : null}
      </div>
    </div>
  );
}
