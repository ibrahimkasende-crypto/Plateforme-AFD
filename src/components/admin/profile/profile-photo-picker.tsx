"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Camera, Trash2, Upload } from "lucide-react";

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp"]);

type Props = {
  /** Nom du champ fichier dans le FormData */
  name?: string;
  initials?: string;
  label?: string;
  disabled?: boolean;
};

/**
 * Sélecteur de photo carrée avec aperçu circulaire, drag & drop et compression légère.
 * Le fichier final est injecté dans un input file contrôlé pour la soumission FormData.
 */
export function ProfilePhotoPicker({
  name = "photo",
  initials = "?",
  label = "Photo de profil",
  disabled = false,
}: Props) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const applyFile = useCallback(async (file: File | null) => {
    setError(null);
    if (!file) {
      if (preview) URL.revokeObjectURL(preview);
      setPreview(null);
      if (inputRef.current) {
        const dt = new DataTransfer();
        inputRef.current.files = dt.files;
      }
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("Fichier trop volumineux (max 5 Mo).");
      return;
    }
    if (!ALLOWED.has(file.type)) {
      setError("Formats autorisés : JPG, JPEG, PNG, WebP.");
      return;
    }

    try {
      const compressed = await compressToSquareJpeg(file, 512, 0.85);
      if (preview) URL.revokeObjectURL(preview);
      const url = URL.createObjectURL(compressed);
      setPreview(url);
      if (inputRef.current) {
        const dt = new DataTransfer();
        dt.items.add(compressed);
        inputRef.current.files = dt.files;
      }
    } catch {
      setError("Impossible de traiter l’image.");
    }
  }, [preview]);

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    void applyFile(file);
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    if (disabled) return;
    const file = e.dataTransfer.files?.[0] ?? null;
    void applyFile(file);
  }

  return (
    <div className="space-y-3">
      <p className="text-sm font-semibold text-slate-800">{label}</p>
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
        <div className="aspect-square size-28 overflow-hidden rounded-full bg-slate-200 ring-2 ring-slate-100">
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={preview}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="flex h-full w-full items-center justify-center text-2xl font-bold text-slate-600">
              {initials.slice(0, 2).toUpperCase()}
            </span>
          )}
        </div>

        <div className="w-full flex-1 space-y-2">
          <div
            onDragOver={(e) => {
              e.preventDefault();
              if (!disabled) setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
            className={`rounded-xl border-2 border-dashed p-4 text-center text-sm transition ${
              dragOver
                ? "border-[var(--afd-blue)] bg-blue-50"
                : "border-slate-200 bg-slate-50"
            } ${disabled ? "opacity-50" : ""}`}
          >
            <Upload className="mx-auto mb-2 size-5 text-slate-500" />
            <p className="text-slate-600">
              Glissez une photo ici ou
            </p>
            <label
              htmlFor={inputId}
              className="mt-2 inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[var(--afd-blue)] px-3 py-2 text-xs font-semibold text-white"
            >
              <Camera className="size-3.5" />
              Ajouter une photo
            </label>
            <input
              id={inputId}
              ref={inputRef}
              type="file"
              name={name}
              accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
              className="sr-only"
              disabled={disabled}
              onChange={onInputChange}
            />
            <p className="mt-2 text-xs text-slate-500">
              JPG, PNG ou WebP — max 5 Mo — recadrage carré automatique
            </p>
          </div>

          {preview ? (
            <button
              type="button"
              disabled={disabled}
              onClick={() => void applyFile(null)}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold text-red-700 sm:w-auto"
            >
              <Trash2 className="size-4" />
              Supprimer la photo
            </button>
          ) : null}

          {error ? (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

async function compressToSquareJpeg(
  file: File,
  size: number,
  quality: number,
): Promise<File> {
  const bitmap = await createImageBitmap(file);
  const min = Math.min(bitmap.width, bitmap.height);
  const sx = (bitmap.width - min) / 2;
  const sy = (bitmap.height - min) / 2;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("canvas");
  ctx.drawImage(bitmap, sx, sy, min, min, 0, 0, size, size);
  bitmap.close();

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("blob"))),
      "image/jpeg",
      quality,
    );
  });

  return new File([blob], "avatar.jpg", { type: "image/jpeg" });
}
