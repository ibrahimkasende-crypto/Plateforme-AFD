"use client";

import Image from "next/image";
import { productBrand } from "@/config/product-brand";
import { cn } from "@/lib/utils";

type ProductLogoProps = {
  size?: "sm" | "md" | "lg";
  className?: string;
  priority?: boolean;
  rounded?: boolean;
};

const SIZES = {
  sm: 28,
  md: 40,
  lg: 64,
} as const;

export function ProductLogo({
  size = "md",
  className,
  priority = false,
  rounded = true,
}: ProductLogoProps) {
  const px = SIZES[size];
  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden bg-white",
        rounded && "rounded-full",
        className,
      )}
      style={{ width: px, height: px }}
    >
      <Image
        src={productBrand.logo.src}
        alt={productBrand.logo.alt}
        width={px}
        height={px}
        className="size-full object-contain p-0.5"
        priority={priority}
      />
    </span>
  );
}
