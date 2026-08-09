"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";
import { ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";

type SafeImageProps = Omit<ImageProps, "onError"> & {
  fallbackClassName?: string;
};

/** next/image avec fallback neutre en cas d’erreur 404/403. */
export function SafeImage({
  className,
  fallbackClassName,
  alt,
  ...props
}: SafeImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed || !props.src) {
    return (
      <span
        className={cn(
          "flex h-full w-full items-center justify-center bg-slate-100 text-slate-400",
          fallbackClassName,
          className,
        )}
        role="img"
        aria-label={alt || "Image indisponible"}
      >
        <ImageOff className="size-6 opacity-60" aria-hidden />
      </span>
    );
  }

  return (
    <Image
      {...props}
      alt={alt}
      className={className}
      onError={() => setFailed(true)}
    />
  );
}
