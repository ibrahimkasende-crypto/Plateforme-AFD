"use client";

import { cn } from "@/lib/utils";
import { Upload } from "lucide-react";

export function FileUploader({
  label = "Téléverser un fichier",
  accept,
  onChange,
  className,
  disabled = false,
}: {
  label?: string;
  accept?: string;
  onChange: (files: FileList | null) => void;
  className?: string;
  disabled?: boolean;
}) {
  return (
    <label
      className={cn(
        "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-[var(--afd-border)] bg-[var(--afd-surface)] px-6 py-10 text-center transition hover:border-[var(--afd-accent)]",
        disabled && "cursor-not-allowed opacity-60",
        className,
      )}
    >
      <Upload className="size-6 text-[var(--afd-accent)]" aria-hidden />
      <span className="text-sm font-medium text-[var(--afd-ink)]">{label}</span>
      <input
        type="file"
        className="sr-only"
        accept={accept}
        disabled={disabled}
        onChange={(event) => onChange(event.target.files)}
      />
    </label>
  );
}

export function ImagePicker({
  label = "Choisir une image",
  onChange,
  previewUrl,
  className,
}: {
  label?: string;
  onChange: (files: FileList | null) => void;
  previewUrl?: string;
  className?: string;
}) {
  return (
    <div className={cn("space-y-3", className)}>
      <FileUploader label={label} accept="image/*" onChange={onChange} />
      {previewUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={previewUrl}
          alt="Aperçu sélectionné"
          className="h-40 w-full rounded-xl object-cover"
        />
      ) : null}
    </div>
  );
}
