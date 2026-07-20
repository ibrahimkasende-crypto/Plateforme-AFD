"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  removeAvatarAction,
  uploadAvatarAction,
} from "@/features/identity/actions/avatar";

type ProfileAvatarUploaderProps = {
  currentUrl: string | null;
  initials: string;
  hasAvatar: boolean;
};

export function ProfileAvatarUploader({
  currentUrl,
  initials,
  hasAvatar,
}: ProfileAvatarUploaderProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function onPick(f: File | null) {
    setError(null);
    if (!f) {
      setFile(null);
      setPreview(null);
      return;
    }
    if (f.size > 5 * 1024 * 1024) {
      setError("Fichier trop volumineux (max 5 Mo).");
      return;
    }
    if (!["image/jpeg", "image/png", "image/webp"].includes(f.type)) {
      setError("Format non supporté (JPEG, PNG ou WebP).");
      return;
    }
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }

  function cancel() {
    if (preview) URL.revokeObjectURL(preview);
    setFile(null);
    setPreview(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  function confirmUpload() {
    if (!file) return;
    setError(null);
    const fd = new FormData();
    fd.set("avatar", file);
    startTransition(async () => {
      try {
        await uploadAvatarAction(fd);
        cancel();
        toast.success("Photo de profil mise à jour");
        router.refresh();
      } catch (err) {
        const message =
          err instanceof Error && err.message
            ? err.message
            : "Échec de l’upload. Réessayez.";
        setError(message);
        toast.error(message);
      }
    });
  }

  function remove() {
    startTransition(async () => {
      await removeAvatarAction();
      cancel();
      router.refresh();
    });
  }

  const display = preview || currentUrl;

  return (
    <section className="rounded border bg-white p-4">
      <div className="flex items-center gap-4">
        {display ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={display}
            alt=""
            className="size-20 rounded-full object-cover ring-2 ring-[var(--afd-blue)]/20"
          />
        ) : (
          <span className="flex size-20 items-center justify-center rounded-full bg-[#0d254e] text-lg font-semibold text-white">
            {initials}
          </span>
        )}
        <div className="text-sm">
          <p className="font-medium text-slate-900">Photo de profil</p>
          <p className="text-[var(--afd-muted)]">
            JPEG, PNG ou WebP — max 5 Mo. Confirmez après sélection.
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <label className="inline-flex cursor-pointer items-center rounded border px-3 py-2 text-sm font-medium hover:bg-slate-50">
          Choisir une photo
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="sr-only"
            onChange={(e) => onPick(e.target.files?.[0] ?? null)}
          />
        </label>

        {file ? (
          <>
            <button
              type="button"
              disabled={pending}
              onClick={confirmUpload}
              className="rounded bg-[var(--afd-blue)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
            >
              {pending ? "Envoi…" : "Confirmer la photo"}
            </button>
            <button
              type="button"
              disabled={pending}
              onClick={cancel}
              className="rounded border px-3 py-2 text-sm"
            >
              Annuler
            </button>
          </>
        ) : null}

        {hasAvatar && !file ? (
          <button
            type="button"
            disabled={pending}
            onClick={remove}
            className="rounded px-3 py-2 text-sm text-red-700"
          >
            Supprimer la photo
          </button>
        ) : null}
      </div>

      {error ? (
        <p role="alert" className="mt-2 text-sm text-red-700">
          {error}
        </p>
      ) : null}
      {preview ? (
        <p className="mt-2 text-xs text-[var(--afd-muted)]">
          Aperçu prêt — cliquez sur « Confirmer la photo » pour enregistrer.
        </p>
      ) : null}
    </section>
  );
}
