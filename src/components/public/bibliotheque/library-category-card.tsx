"use client";

import Image from "next/image";
import Link from "next/link";
import { Camera, FolderOpen } from "lucide-react";
import type { LibraryCategory } from "@/config/bibliotheque";
import { cn } from "@/lib/utils";

export function LibraryCategoryCard({
  category,
  className,
}: {
  category: LibraryCategory;
  className?: string;
}) {
  return (
    <Link
      href={`/bibliotheque?categorie=${category.slug}`}
      className={cn(
        "group relative flex min-h-[220px] flex-col overflow-hidden rounded-2xl border border-[var(--afd-border)] bg-[var(--afd-surface)] shadow-sm transition hover:-translate-y-0.5 hover:shadow-md",
        className,
      )}
    >
      <div className="relative h-36 w-full overflow-hidden bg-slate-100">
        {category.coverImageUrl ? (
          <Image
            src={category.coverImageUrl}
            alt={`Couverture — ${category.label}`}
            fill
            className="object-cover transition duration-500 group-hover:scale-[1.03]"
            sizes="(max-width:768px) 100vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-[var(--afd-muted)]">
            <FolderOpen className="size-8" aria-hidden />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="font-display text-lg font-bold text-[var(--afd-ink)]">
          {category.label}
        </h3>
        <p className="text-sm text-[var(--afd-muted)]">
          {category.activityCount} activité
          {category.activityCount > 1 ? "s" : ""} · {category.photoCount} photo
          {category.photoCount > 1 ? "s" : ""}
        </p>
        {category.latestTitle ? (
          <p className="line-clamp-2 text-xs text-[var(--afd-muted)]">
            Dernier : {category.latestTitle}
          </p>
        ) : null}
        <span className="mt-auto inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--afd-blue)]">
          <Camera className="size-3.5" aria-hidden />
          Consulter
        </span>
      </div>
    </Link>
  );
}
