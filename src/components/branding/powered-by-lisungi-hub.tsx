"use client";

import { PublisherBrand } from "@/components/branding/publisher-brand";
import { productBrand } from "@/config/product-brand";
import { cn } from "@/lib/utils";

type PoweredByLisungiHubProps = {
  variant?: "powered" | "propelled" | "product";
  theme?: "light" | "dark";
  className?: string;
  compact?: boolean;
};

export function PoweredByLisungiHub({
  variant = "powered",
  theme = "light",
  className,
  compact = false,
}: PoweredByLisungiHubProps) {
  const label =
    variant === "propelled"
      ? productBrand.propelledByLabel
      : variant === "product"
        ? productBrand.poweredByLabel
        : productBrand.poweredByLabel;

  if (compact) {
    return (
      <PublisherBrand
        mode="compact"
        theme={theme}
        className={className}
      />
    );
  }

  return (
    <p
      className={cn(
        "text-[11px]",
        theme === "dark" ? "text-white/50" : "text-slate-500",
        className,
      )}
      data-powered-by-lisungi
    >
      {label}
    </p>
  );
}
