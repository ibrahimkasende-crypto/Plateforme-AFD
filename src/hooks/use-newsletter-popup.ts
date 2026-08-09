"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
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
import { NEWSLETTER_GOOGLE_OPEN_EVENT } from "@/components/newsletter/newsletter-google-return";
import { NEWSLETTER_GOOGLE_SUCCESS_QUERY } from "@/lib/newsletter/google-oauth";

type Options = {
  loaderDone: boolean;
};

export function useNewsletterPopup({ loaderDone }: Options) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const googleOpenedRef = useRef(false);

  const isExcluded = NEWSLETTER_EXCLUDED_PATH_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );

  useEffect(() => {
    const status = searchParams.get("newsletter");
    if (status !== NEWSLETTER_GOOGLE_SUCCESS_QUERY) return;
    if (googleOpenedRef.current) return;
    googleOpenedRef.current = true;
    markNewsletterSeenSession();
    setOpen(true);
  }, [searchParams]);

  useEffect(() => {
    function onGoogleOpen() {
      if (googleOpenedRef.current) return;
      googleOpenedRef.current = true;
      markNewsletterSeenSession();
      setOpen(true);
    }
    window.addEventListener(NEWSLETTER_GOOGLE_OPEN_EVENT, onGoogleOpen);
    return () => {
      window.removeEventListener(NEWSLETTER_GOOGLE_OPEN_EVENT, onGoogleOpen);
    };
  }, []);

  useEffect(() => {
    if (!loaderDone || isExcluded) return;
    if (searchParams.get("newsletter") === NEWSLETTER_GOOGLE_SUCCESS_QUERY) {
      return;
    }

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
  }, [loaderDone, isExcluded, pathname, searchParams]);

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
