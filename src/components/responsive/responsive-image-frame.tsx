import type { CSSProperties } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

type Focal = {
  mobile?: string;
  tablet?: string;
  desktop?: string;
};

export function ResponsiveImageFrame({
  src,
  alt,
  sizes,
  priority = false,
  className,
  frameClassName,
  aspectClassName = "aspect-[16/10]",
  objectPosition,
  focal,
}: {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
  frameClassName?: string;
  aspectClassName?: string;
  objectPosition?: string;
  focal?: Focal;
}) {
  const mobilePos = focal?.mobile ?? objectPosition ?? "50% 40%";
  const tabletPos = focal?.tablet ?? mobilePos;
  const desktopPos = focal?.desktop ?? tabletPos;

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-[var(--afd-light-blue)]",
        aspectClassName,
        frameClassName,
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className={cn(
          "object-cover transition duration-300",
          "object-[var(--afd-img-pos-mobile)]",
          "md:object-[var(--afd-img-pos-tablet)]",
          "lg:object-[var(--afd-img-pos-desktop)]",
          className,
        )}
        style={
          {
            "--afd-img-pos-mobile": mobilePos,
            "--afd-img-pos-tablet": tabletPos,
            "--afd-img-pos-desktop": desktopPos,
          } as CSSProperties
        }
      />
    </div>
  );
}
