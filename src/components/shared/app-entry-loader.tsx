"use client";

import { useEffect, useState } from "react";
import { AfdHeartLoader } from "@/components/shared/afd-heart-loader";
import { NewsletterPopup } from "@/components/newsletter/newsletter-popup";
import { LOADER_DURATION_MS, LOADER_STORAGE } from "@/config/newsletter-popup";
import { useNewsletterPopup } from "@/hooks/use-newsletter-popup";

function readLoaderSeen(): boolean {
  try {
    return sessionStorage.getItem(LOADER_STORAGE.seen) === "true";
  } catch {
    return false;
  }
}

function markLoaderSeen() {
  try {
    sessionStorage.setItem(LOADER_STORAGE.seen, "true");
  } catch {
    // ignore
  }
}

export function AppEntryExperience() {
  const [loaderVisible, setLoaderVisible] = useState(false);
  const [loaderDone, setLoaderDone] = useState(false);
  const popup = useNewsletterPopup({ loaderDone });

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (readLoaderSeen()) {
      const frame = window.requestAnimationFrame(() => {
        setLoaderDone(true);
      });
      return () => window.cancelAnimationFrame(frame);
    }

    const showFrame = window.requestAnimationFrame(() => {
      setLoaderVisible(true);
    });

    const duration = reduceMotion ? 400 : LOADER_DURATION_MS;
    const timer = window.setTimeout(() => {
      markLoaderSeen();
      setLoaderVisible(false);
      setLoaderDone(true);
    }, duration);

    return () => {
      window.cancelAnimationFrame(showFrame);
      window.clearTimeout(timer);
    };
  }, []);

  return (
    <>
      {loaderVisible ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white">
          <AfdHeartLoader />
        </div>
      ) : null}

      <NewsletterPopup
        open={popup.open}
        onDismiss={popup.dismiss}
        onSubscribed={popup.closeAfterSubscribe}
      />
    </>
  );
}
