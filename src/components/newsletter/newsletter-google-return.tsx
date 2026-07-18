"use client";

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { markNewsletterSubscribed } from "@/lib/newsletter/client-storage";

/**
 * Traite le retour OAuth newsletter (?newsletter=subscribed|already|error…).
 */
export function NewsletterGoogleReturn() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const status = searchParams.get("newsletter");
    if (!status) return;

    if (status === "subscribed") {
      markNewsletterSubscribed();
      toast.success(
        "Inscription réussie via Google. Merci de suivre les actions de l’AFD.",
      );
    } else if (status === "already") {
      markNewsletterSubscribed();
      toast.success("Cette adresse Google est déjà inscrite à la newsletter.");
    } else if (status === "missing_email") {
      toast.error(
        "Google n’a pas fourni d’adresse e-mail. Réessayez ou inscrivez-vous manuellement.",
      );
    } else if (status === "error") {
      toast.error(
        "L’inscription via Google n’a pas pu être finalisée. Réessayez avec votre e-mail.",
      );
    } else {
      return;
    }

    const params = new URLSearchParams(searchParams.toString());
    params.delete("newsletter");
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname);
  }, [searchParams, router, pathname]);

  return null;
}
