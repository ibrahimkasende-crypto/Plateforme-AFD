"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { Download, X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import type { LibraryImage } from "@/config/bibliotheque";
import { SafeImage } from "@/components/media/safe-image";
import { useBodyScrollLock } from "@/hooks/use-body-scroll-lock";
import { getSupabaseImageUrl } from "@/lib/images/supabase-image";
import { cn } from "@/lib/utils";

const INITIAL_COUNT = 8;
const LOAD_MORE = 8;

export function LibraryMasonryGallery({
  images,
  activityTitle,
}: {
  images: LibraryImage[];
  activityTitle: string;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);
  const [imagesLen, setImagesLen] = useState(images.length);
  if (images.length !== imagesLen) {
    setImagesLen(images.length);
    setVisibleCount(INITIAL_COUNT);
  }
  const open = openIndex !== null;
  const current = openIndex !== null ? images[openIndex] : null;

  useBodyScrollLock(open);

  const visibleImages = useMemo(
    () => images.slice(0, visibleCount),
    [images, visibleCount],
  );
  const hasMore = visibleCount < images.length;

  const close = useCallback(() => setOpenIndex(null), []);
  const prev = useCallback(() => {
    setOpenIndex((i) =>
      i === null ? null : (i - 1 + images.length) % images.length,
    );
  }, [images.length]);
  const next = useCallback(() => {
    setOpenIndex((i) => (i === null ? null : (i + 1) % images.length));
  }, [images.length]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close, prev, next]);

  useEffect(() => {
    if (!open) return;
    let startX = 0;
    let startY = 0;
    function onTouchStart(e: TouchEvent) {
      startX = e.changedTouches[0]?.clientX ?? 0;
      startY = e.changedTouches[0]?.clientY ?? 0;
    }
    function onTouchEnd(e: TouchEvent) {
      const endX = e.changedTouches[0]?.clientX ?? 0;
      const endY = e.changedTouches[0]?.clientY ?? 0;
      const dx = endX - startX;
      const dy = endY - startY;
      // Uniquement gestes clairement horizontaux
      if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy)) return;
      if (dx > 0) prev();
      else next();
    }
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [open, prev, next]);

  function onThumbKey(
    e: ReactKeyboardEvent<HTMLButtonElement>,
    index: number,
  ) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setOpenIndex(index);
    }
  }

  if (images.length === 0) return null;

  return (
    <section aria-label={`Galerie — ${activityTitle}`} className="space-y-4">
      <div className="columns-1 gap-3 sm:columns-2 lg:columns-3">
        {visibleImages.map((image, index) => (
          <button
            key={image.id}
            type="button"
            onClick={() => setOpenIndex(index)}
            onKeyDown={(e) => onThumbKey(e, index)}
            className="mb-3 block w-full break-inside-avoid overflow-hidden rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--afd-blue)]"
            aria-label={`Agrandir : ${image.alt}`}
          >
            <span className="relative block aspect-[4/3] bg-slate-100">
              <SafeImage
                src={getSupabaseImageUrl(image.src, { variant: "card" })}
                alt={image.alt}
                fill
                className="object-cover transition duration-300 hover:opacity-95"
                loading="lazy"
                sizes="(max-width:768px) 100vw, 33vw"
              />
              <span className="pointer-events-none absolute inset-0 flex items-end bg-gradient-to-t from-black/40 to-transparent p-3 opacity-0 transition hover:opacity-100">
                <Maximize2 className="size-4 text-white" aria-hidden />
              </span>
            </span>
            {image.caption ? (
              <span className="mt-1 block text-left text-xs text-[var(--afd-muted)]">
                {image.caption}
              </span>
            ) : null}
          </button>
        ))}
      </div>

      {hasMore ? (
        <div className="flex justify-center pt-2">
          <button
            type="button"
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-[var(--afd-border)] bg-white px-5 text-sm font-semibold text-[var(--afd-navy)] shadow-sm hover:bg-slate-50"
            onClick={() => setVisibleCount((c) => c + LOAD_MORE)}
          >
            Voir plus ({images.length - visibleCount} restantes)
          </button>
        </div>
      ) : null}

      {open && current ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={current.alt}
          className="fixed inset-0 z-[80] flex items-center justify-center overscroll-contain bg-black/90 p-4"
          onClick={close}
        >
          <button
            type="button"
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
            onClick={close}
            aria-label="Fermer"
          >
            <X className="size-5" />
          </button>
          <button
            type="button"
            className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            aria-label="Photo précédente"
          >
            <ChevronLeft className="size-6" />
          </button>
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            aria-label="Photo suivante"
          >
            <ChevronRight className="size-6" />
          </button>
          <div
            className="relative max-h-[85vh] max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <SafeImage
              src={getSupabaseImageUrl(current.src, { variant: "hero" })}
              alt={current.alt}
              width={1600}
              height={1200}
              className="max-h-[80vh] w-auto rounded-lg object-contain"
              priority
            />
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-sm text-white/90">
              <p>
                {(openIndex ?? 0) + 1} / {images.length} — {current.alt}
              </p>
              <a
                href={current.src}
                download
                className={cn(
                  "inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 hover:bg-white/25",
                )}
              >
                <Download className="size-4" aria-hidden />
                Télécharger
              </a>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
