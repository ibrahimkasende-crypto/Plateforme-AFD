import Image from "next/image";

export function MediaPreview({
  src,
  alt,
}: {
  src: string | null | undefined;
  alt: string;
}) {
  if (!src) {
    return (
      <div className="flex aspect-video items-center justify-center rounded-xl bg-[var(--afd-light-blue)] text-sm text-[var(--afd-muted)]">
        Aperçu indisponible
      </div>
    );
  }

  return (
    <div className="relative aspect-video overflow-hidden rounded-xl bg-[var(--afd-light-blue)]">
      <Image src={src} alt={alt} fill className="object-cover" sizes="400px" />
    </div>
  );
}
