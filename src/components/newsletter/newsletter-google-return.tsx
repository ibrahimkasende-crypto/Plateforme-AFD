"use client";

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { markNewsletterSubscribed } from "@/lib/newsletter/client-storage";
import { NEWSLETTER_GOOGLE_SUCCESS_QUERY } from "@/lib/newsletter/google-oauth";

export const NEWSLETTER_GOOGLE_OPEN_EVENT = "afd:newsletter-google-open";

/**
 * Traite les retours OAuth newsletter (erreurs / legacy) et signale
 * `google-success` pour rouverture de la fenêtre.
 */
export function NewsletterGoogleReturn() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const status = searchParams.get("newsletter");
    if (!status) return;

    if (status === NEWSLETTER_GOOGLE_SUCCESS_QUERY) {
      window.dispatchEvent(new CustomEvent(NEWSLETTER_GOOGLE_OPEN_EVENT));
      return;
    }

    if (status === "subscribed") {
      markNewsletterSubscribed();
      toast.success(
        "Inscription réussie via Google. Merci de suivre les actions de l’AFD.",
      );
    } else if (status === "already") {
      markNewsletterSubscribed();
      toast.success("Cette adresse est déjà inscrite à notre newsletter.");
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
    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  }, [searchParams, router, pathname]);

  return null;
}
