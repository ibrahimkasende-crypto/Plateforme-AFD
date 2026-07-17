import {
  NEWSLETTER_DISMISS_DAYS,
  NEWSLETTER_STORAGE,
} from "@/config/newsletter-popup";

function setCookie(name: string, value: string, maxAgeDays: number) {
  if (typeof document === "undefined") return;
  const maxAge = maxAgeDays * 24 * 60 * 60;
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`));
  if (!match) return null;
  return decodeURIComponent(match.slice(name.length + 1));
}

export function markNewsletterSubscribed() {
  setCookie(NEWSLETTER_STORAGE.subscribed, "true", 365);
  try {
    sessionStorage.setItem(NEWSLETTER_STORAGE.seenSession, "true");
  } catch {
    // ignore
  }
}

export function markNewsletterDismissed() {
  setCookie(
    NEWSLETTER_STORAGE.dismissedAt,
    new Date().toISOString(),
    NEWSLETTER_DISMISS_DAYS,
  );
  try {
    sessionStorage.setItem(NEWSLETTER_STORAGE.seenSession, "true");
  } catch {
    // ignore
  }
}

export function markNewsletterSeenSession() {
  try {
    sessionStorage.setItem(NEWSLETTER_STORAGE.seenSession, "true");
  } catch {
    // ignore
  }
}

export function isNewsletterSubscribedLocally(): boolean {
  return getCookie(NEWSLETTER_STORAGE.subscribed) === "true";
}

export function wasNewsletterDismissedRecently(): boolean {
  const raw = getCookie(NEWSLETTER_STORAGE.dismissedAt);
  if (!raw) return false;
  const dismissedAt = Date.parse(raw);
  if (Number.isNaN(dismissedAt)) return false;
  const elapsed = Date.now() - dismissedAt;
  return elapsed < NEWSLETTER_DISMISS_DAYS * 24 * 60 * 60 * 1000;
}

export function wasNewsletterSeenThisSession(): boolean {
  try {
    return sessionStorage.getItem(NEWSLETTER_STORAGE.seenSession) === "true";
  } catch {
    return false;
  }
}
