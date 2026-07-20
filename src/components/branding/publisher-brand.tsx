"use client";

import Image from "next/image";
import { productBrand } from "@/config/product-brand";
import { cn } from "@/lib/utils";

type PublisherBrandProps = {
  mode?: "compact" | "extended";
  theme?: "light" | "dark";
  className?: string;
  showLogo?: boolean;
};

export function PublisherBrand({
  mode = "extended",
  theme = "dark",
  className,
  showLogo = true,
}: PublisherBrandProps) {
  const isDark = theme === "dark";
  const compact = mode === "compact";

  return (
    <div
      className={cn(
        "flex items-center gap-1.5",
        compact && "justify-center",
        className,
      )}
      data-publisher-brand
      title={productBrand.poweredByLabel}
    >
      {showLogo ? (
        <span className="relative inline-flex size-5 shrink-0 overflow-hidden rounded-full bg-white/90">
          <Image
            src={productBrand.publisherLogo.src}
            alt=""
            width={20}
            height={20}
            className="size-full object-contain p-px"
          />
        </span>
      ) : null}
      <span
        className={cn(
          "text-[10px] leading-tight",
          isDark ? "text-white/50" : "text-slate-500",
          compact && "sr-only",
        )}
      >
        {productBrand.poweredByLabel}
      </span>
    </div>
  );
}
