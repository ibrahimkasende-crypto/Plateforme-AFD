import { z } from "zod";

const boolFromEnv = (fallback: boolean) =>
  z
    .string()
    .optional()
    .transform((v) => {
      if (v === undefined || v === "") return fallback;
      return v === "true" || v === "1";
    });

const publicSchema = z.object({
  NEXT_PUBLIC_APP_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  NEXT_PUBLIC_SITE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().optional(),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().optional(),
  NEXT_PUBLIC_APP_NAME: z.string().default("Plateforme-AFD"),
  NEXT_PUBLIC_ENABLE_DEMO_CONTENT: boolFromEnv(false),
  NEXT_PUBLIC_ENABLE_ADMIN_DEMO_DATA: boolFromEnv(false),
  NEXT_PUBLIC_ENABLE_SPONTANEOUS_APPLICATIONS: boolFromEnv(false),
  NEXT_PUBLIC_ENABLE_WATER_RIPPLE: boolFromEnv(true),
  NEXT_PUBLIC_ENABLE_SECTION_ANIMATIONS: boolFromEnv(true),
  NEXT_PUBLIC_ENABLE_MOBILE_RAILS: boolFromEnv(true),
});

const serverSchema = z.object({
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  NEWSLETTER_SEND_ENABLED: boolFromEnv(false),
  EMAIL_PROVIDER: z.string().optional(),
  EMAIL_API_KEY: z.string().optional(),
  EMAIL_FROM: z.string().optional(),
  CARD_PAYMENT_ENABLED: boolFromEnv(false),
  CARD_PAYMENT_PROVIDER_ID: z.string().optional(),
  CARD_PAYMENT_BASE_URL: z.string().optional(),
  CARD_PAYMENT_MERCHANT_ID: z.string().optional(),
  CARD_PAYMENT_API_KEY: z.string().optional(),
  CARD_PAYMENT_API_SECRET: z.string().optional(),
  CARD_PAYMENT_WEBHOOK_SECRET: z.string().optional(),
  OCR_CLOUD_ENABLED: boolFromEnv(false),
  OCR_PROVIDER: z.string().default("native"),
  OCR_WORKER_SECRET: z.string().optional(),
});

export type PublicEnv = z.infer<typeof publicSchema>;
export type ServerEnv = z.infer<typeof serverSchema>;

function readPublicEnv(): PublicEnv {
  return publicSchema.parse({
    NEXT_PUBLIC_APP_ENV: process.env.NEXT_PUBLIC_APP_ENV,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
    NEXT_PUBLIC_ENABLE_DEMO_CONTENT: process.env.NEXT_PUBLIC_ENABLE_DEMO_CONTENT,
    NEXT_PUBLIC_ENABLE_ADMIN_DEMO_DATA:
      process.env.NEXT_PUBLIC_ENABLE_ADMIN_DEMO_DATA,
    NEXT_PUBLIC_ENABLE_SPONTANEOUS_APPLICATIONS:
      process.env.NEXT_PUBLIC_ENABLE_SPONTANEOUS_APPLICATIONS,
    NEXT_PUBLIC_ENABLE_WATER_RIPPLE: process.env.NEXT_PUBLIC_ENABLE_WATER_RIPPLE,
    NEXT_PUBLIC_ENABLE_SECTION_ANIMATIONS:
      process.env.NEXT_PUBLIC_ENABLE_SECTION_ANIMATIONS,
    NEXT_PUBLIC_ENABLE_MOBILE_RAILS: process.env.NEXT_PUBLIC_ENABLE_MOBILE_RAILS,
  });
}

function readServerEnv(): ServerEnv {
  return serverSchema.parse({
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    NEWSLETTER_SEND_ENABLED: process.env.NEWSLETTER_SEND_ENABLED,
    EMAIL_PROVIDER: process.env.EMAIL_PROVIDER,
    EMAIL_API_KEY: process.env.EMAIL_API_KEY,
    EMAIL_FROM: process.env.EMAIL_FROM,
    CARD_PAYMENT_ENABLED: process.env.CARD_PAYMENT_ENABLED,
    CARD_PAYMENT_PROVIDER_ID: process.env.CARD_PAYMENT_PROVIDER_ID,
    CARD_PAYMENT_BASE_URL: process.env.CARD_PAYMENT_BASE_URL,
    CARD_PAYMENT_MERCHANT_ID: process.env.CARD_PAYMENT_MERCHANT_ID,
    CARD_PAYMENT_API_KEY: process.env.CARD_PAYMENT_API_KEY,
    CARD_PAYMENT_API_SECRET: process.env.CARD_PAYMENT_API_SECRET,
    CARD_PAYMENT_WEBHOOK_SECRET: process.env.CARD_PAYMENT_WEBHOOK_SECRET,
    OCR_CLOUD_ENABLED: process.env.OCR_CLOUD_ENABLED,
    OCR_PROVIDER: process.env.OCR_PROVIDER,
    OCR_WORKER_SECRET: process.env.OCR_WORKER_SECRET,
  });
}

/** Variables publiques (safe côté client). */
export const publicEnv = readPublicEnv();

/** Feature flags production — jamais de secrets ici. */
export const featureFlags = {
  appEnv: publicEnv.NEXT_PUBLIC_APP_ENV,
  isProduction: publicEnv.NEXT_PUBLIC_APP_ENV === "production",
  demoContent: publicEnv.NEXT_PUBLIC_ENABLE_DEMO_CONTENT,
  adminDemoData: publicEnv.NEXT_PUBLIC_ENABLE_ADMIN_DEMO_DATA,
  spontaneousApplications: publicEnv.NEXT_PUBLIC_ENABLE_SPONTANEOUS_APPLICATIONS,
  waterRipple: publicEnv.NEXT_PUBLIC_ENABLE_WATER_RIPPLE,
  sectionAnimations: publicEnv.NEXT_PUBLIC_ENABLE_SECTION_ANIMATIONS,
  mobileRails: publicEnv.NEXT_PUBLIC_ENABLE_MOBILE_RAILS,
} as const;

/** Flags serveur pour intégrations optionnelles (désactivées par défaut). */
export function getIntegrationFlags() {
  const s = readServerEnv();
  return {
    newsletterSendEnabled: s.NEWSLETTER_SEND_ENABLED,
    cardPaymentEnabled: s.CARD_PAYMENT_ENABLED,
    ocrCloudEnabled: s.OCR_CLOUD_ENABLED,
    emailConfigured: Boolean(s.EMAIL_PROVIDER && s.EMAIL_API_KEY && s.EMAIL_FROM),
    cardPaymentConfigured: Boolean(
      s.CARD_PAYMENT_ENABLED &&
        s.CARD_PAYMENT_PROVIDER_ID &&
        s.CARD_PAYMENT_BASE_URL &&
        s.CARD_PAYMENT_MERCHANT_ID &&
        s.CARD_PAYMENT_API_KEY &&
        s.CARD_PAYMENT_API_SECRET &&
        s.CARD_PAYMENT_WEBHOOK_SECRET,
    ),
  } as const;
}

export function assertProductionPublicEnv(): void {
  if (publicEnv.NEXT_PUBLIC_APP_ENV !== "production") return;
  if (!publicEnv.NEXT_PUBLIC_SITE_URL) {
    throw new Error("NEXT_PUBLIC_SITE_URL obligatoire en production");
  }
  if (!publicEnv.NEXT_PUBLIC_SUPABASE_URL) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL obligatoire en production");
  }
  if (
    !publicEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    !publicEnv.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  ) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_ANON_KEY ou PUBLISHABLE_KEY obligatoire en production",
    );
  }
}

/** Indique si la clé service_role est présente (sans exposer la valeur). */
export function isSupabaseServiceRoleConfigured(): boolean {
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ||
    process.env.SUPABASE_SECRET_KEY?.trim() ||
    "";
  if (!key) return false;
  if (
    key.length < 20 ||
    /^(your-|changeme|xxx|placeholder|ta_vraie|sb_secret_your|sb_publishable_your)/i.test(
      key,
    )
  ) {
    return false;
  }
  return true;
}

/**
 * Vérifie que l’URL publique pointe vers le projet AFD mandaté.
 * Ne lit que le hostname — aucune clé secrète.
 */
export function getSupabaseProjectRefFromEnv(): string | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  if (!url) return null;
  try {
    const host = new URL(url).hostname;
    const match = host.match(/^([a-z0-9]+)\.supabase\.co$/i);
    return match?.[1] ?? null;
  } catch {
    return null;
  }
}

export const MANDATED_SUPABASE_PROJECT_REF = "mxxuxnoqnwjygawvvhcb";

export function assertMandatedSupabaseProject(): void {
  if (publicEnv.NEXT_PUBLIC_APP_ENV !== "production") return;
  const ref = getSupabaseProjectRefFromEnv();
  if (ref && ref !== MANDATED_SUPABASE_PROJECT_REF) {
    throw new Error(
      `NEXT_PUBLIC_SUPABASE_URL doit cibler ${MANDATED_SUPABASE_PROJECT_REF} (reçu : ${ref})`,
    );
  }
}
