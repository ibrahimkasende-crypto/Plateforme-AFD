"use client";

export function MediaMetadataForm({
  altText,
  caption,
  credit,
  onChange,
}: {
  altText: string;
  caption: string;
  credit: string;
  onChange: (values: {
    altText: string;
    caption: string;
    credit: string;
  }) => void;
}) {
  return (
    <div className="space-y-3">
      <label className="block text-sm">
        <span className="font-semibold text-[var(--afd-navy)]">Texte alternatif</span>
        <input
          className="mt-1 w-full rounded-xl border border-[var(--afd-border)] px-3 py-2"
          value={altText}
          onChange={(event) =>
            onChange({ altText: event.target.value, caption, credit })
          }
        />
      </label>
      <label className="block text-sm">
        <span className="font-semibold text-[var(--afd-navy)]">Légende</span>
        <input
          className="mt-1 w-full rounded-xl border border-[var(--afd-border)] px-3 py-2"
          value={caption}
          onChange={(event) =>
            onChange({ altText, caption: event.target.value, credit })
          }
        />
      </label>
      <label className="block text-sm">
        <span className="font-semibold text-[var(--afd-navy)]">Crédit</span>
        <input
          className="mt-1 w-full rounded-xl border border-[var(--afd-border)] px-3 py-2"
          value={credit}
          onChange={(event) =>
            onChange({ altText, caption, credit: event.target.value })
          }
        />
      </label>
    </div>
  );
}
