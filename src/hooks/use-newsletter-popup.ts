"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  NEWSLETTER_EXCLUDED_PATH_PREFIXES,
  NEWSLETTER_POPUP_DELAY_MS,
} from "@/config/newsletter-popup";
import {
  isNewsletterSubscribedLocally,
  markNewsletterDismissed,
  markNewsletterSeenSession,
  markNewsletterSubscribed,
  wasNewsletterDismissedRecently,
  wasNewsletterSeenThisSession,
} from "@/lib/newsletter/client-storage";
import { getNewsletterPopupEligibilityAction } from "@/actions/newsletter-actions";

type Options = {
  loaderDone: boolean;
};

export function useNewsletterPopup({ loaderDone }: Options) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isExcluded = NEWSLETTER_EXCLUDED_PATH_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );

  useEffect(() => {
    if (!loaderDone || isExcluded) return;

    if (
      isNewsletterSubscribedLocally() ||
      wasNewsletterSeenThisSession() ||
      wasNewsletterDismissedRecently()
    ) {
      return;
    }

    let cancelled = false;
    const timer = window.setTimeout(() => {
      void (async () => {
        try {
          const eligibility = await getNewsletterPopupEligibilityAction();
          if (cancelled) return;
          if (!eligibility.shouldShow) {
            if (eligibility.reason === "subscribed") {
              markNewsletterSubscribed();
            }
            return;
          }
          markNewsletterSeenSession();
          setOpen(true);
        } catch {
          if (!cancelled) {
            markNewsletterSeenSession();
            setOpen(true);
          }
        }
      })();
    }, NEWSLETTER_POPUP_DELAY_MS);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [loaderDone, isExcluded, pathname]);

  const dismiss = useCallback(() => {
    markNewsletterDismissed();
    setOpen(false);
  }, []);

  const closeAfterSubscribe = useCallback(() => {
    markNewsletterSubscribed();
    setOpen(false);
  }, []);

  return {
    open,
    dismiss,
    closeAfterSubscribe,
  };
}
