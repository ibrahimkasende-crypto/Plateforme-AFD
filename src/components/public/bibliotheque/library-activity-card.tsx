"use client";

import Image from "next/image";
import Link from "next/link";
import { Camera, MapPin } from "lucide-react";
import type { LibraryActivity } from "@/config/bibliotheque";
import { cn } from "@/lib/utils";

const statusLabel: Record<LibraryActivity["status"], string> = {
  en_cours: "En cours",
  terminee: "Terminée",
  archivee: "Archivée",
};

function isRecent(activity: LibraryActivity): boolean {
  const raw = activity.publishedAt ?? activity.eventDate;
  if (!raw) return false;
  const ts = Date.parse(raw);
  if (Number.isNaN(ts)) return false;
  return Date.now() - ts < 1000 * 60 * 60 * 24 * 90;
}

export function LibraryActivityCard({
  activity,
  className,
}: {
  activity: LibraryActivity;
  className?: string;
}) {
  const badges: string[] = [];
  if (isRecent(activity)) badges.push("Récent");
  if (activity.status === "archivee") badges.push("Archivé");
  if (activity.status === "en_cours") badges.push("En cours");
  if (activity.photoCount > 0) badges.push("Galerie disponible");

  const eventDate = activity.eventDate
    ? new Date(activity.eventDate).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;

  return (
    <article
      className={cn(
        "group overflow-hidden rounded-2xl border border-[var(--afd-border)] bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md",
        className,
      )}
    >
      <Link href={`/bibliotheque/${activity.slug}`} className="block">
        <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
          {activity.coverImageUrl ? (
            <Image
              src={activity.coverImageUrl}
              alt={activity.images[0]?.alt ?? activity.title}
              fill
              className="object-cover transition duration-500 group-hover:scale-[1.03]"
              sizes="(max-width:768px) 100vw, 33vw"
            />
          ) : null}
          <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-[var(--afd-ink)] shadow-sm">
            {activity.categoryLabel}
          </span>
          <span className="absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-full bg-black/65 px-2.5 py-1 text-[11px] font-medium text-white">
            <Camera className="size-3" aria-hidden />
            {activity.photoCount}
          </span>
        </div>
        <div className="space-y-2 p-4">
          <div className="flex flex-wrap items-center gap-2 text-[11px] text-[var(--afd-muted)]">
            <span className="rounded-full bg-slate-100 px-2 py-0.5 font-semibold text-slate-700">
              {statusLabel[activity.status]}
            </span>
            {eventDate ? <span>{eventDate}</span> : null}
            {activity.province ? (
              <span className="inline-flex items-center gap-1">
                <MapPin className="size-3" aria-hidden />
                {activity.province}
              </span>
            ) : null}
          </div>
          {badges.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {badges.map((badge) => (
                <span
                  key={badge}
                  className="rounded-md bg-[var(--afd-blue)]/10 px-1.5 py-0.5 text-[10px] font-semibold text-[var(--afd-blue)]"
                >
                  {badge}
                </span>
              ))}
            </div>
          ) : null}
          <h3 className="font-display text-[17px] font-bold leading-snug text-[var(--afd-ink)]">
            {activity.title}
          </h3>
          {activity.locationName || activity.locality ? (
            <p className="text-xs text-[var(--afd-muted)]">
              {[activity.locationName, activity.locality]
                .filter(Boolean)
                .join(" · ")}
            </p>
          ) : null}
          {activity.project ? (
            <p className="text-xs font-medium text-[var(--afd-ink)]">
              Projet : {activity.project}
            </p>
          ) : null}
          <p className="line-clamp-2 text-sm leading-relaxed text-[var(--afd-muted)]">
            {activity.summary}
          </p>
          <span className="inline-flex text-sm font-semibold text-[var(--afd-blue)]">
            Voir l’activité →
          </span>
        </div>
      </Link>
    </article>
  );
}
