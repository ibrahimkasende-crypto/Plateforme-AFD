export const NEWSLETTER_STORAGE = {
  subscribed: "afd_newsletter_subscribed",
  dismissedAt: "afd_newsletter_dismissed_at",
  seenSession: "afd_newsletter_seen_session",
} as const;

export const LOADER_STORAGE = {
  seen: "afd_loader_seen",
} as const;

export const NEWSLETTER_DISMISS_DAYS = 7;
export const NEWSLETTER_POPUP_DELAY_MS = 1200;
export const LOADER_DURATION_MS = 1200;

export const NEWSLETTER_EXCLUDED_PATH_PREFIXES = [
  "/admin",
  "/connexion",
  "/login",
  "/auth",
  "/ressources/newsletter/desabonnement",
  "/politique-confidentialite",
  "/api/payments",
  "/soutenir/retour",
  "/paiements",
] as const;
