"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Loader2, LogOut } from "lucide-react";

type Props = {
  className?: string;
  label?: string;
};

export function LogoutButton({
  className,
  label = "Se déconnecter",
}: Props) {
  const router = useRouter();
  const [pending, start] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      className={className}
      onClick={() => {
        start(async () => {
          try {
            await fetch("/api/auth/logout", {
              method: "POST",
              credentials: "same-origin",
            });
          } catch {
            // ignore
          }
          router.replace("/connexion");
          router.refresh();
        });
      }}
    >
      {pending ? (
        <Loader2 className="size-4 animate-spin" aria-hidden />
      ) : (
        <LogOut className="size-4" aria-hidden />
      )}
      {label}
    </button>
  );
}
