"use client";

export function MediaUploader({
  bucket,
  onUploaded,
}: {
  bucket: string;
  onUploaded?: () => void;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-[var(--afd-border)] bg-[var(--afd-surface)] p-5">
      <p className="text-sm font-bold text-[var(--afd-navy)]">Importer un fichier</p>
      <p className="mt-1 text-sm text-[var(--afd-muted)]">
        Bucket cible : <code className="text-[12px]">{bucket}</code>. Les binaires
        vont dans Supabase Storage ; PostgreSQL ne stocke que les métadonnées.
      </p>
      <input
        type="file"
        className="mt-4 block w-full text-sm"
        multiple
        onChange={() => onUploaded?.()}
      />
    </div>
  );
}
