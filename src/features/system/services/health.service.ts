import "server-only";

import {
  getSupabaseProjectRefFromEnv,
  isSupabaseServiceRoleConfigured,
  MANDATED_SUPABASE_PROJECT_REF,
} from "@/config/env";
import { createClientSafe } from "@/lib/supabase/safe";

export type SystemHealthReport = {
  checkedAt: string;
  databaseOk: boolean | null;
  storageOk: boolean | null;
  jobsPending: number;
  jobsFailed: number;
  appVersion: string;
  emailConfigured: boolean;
  serdipayConfigured: boolean;
  supabasePublicConfigured: boolean;
  serviceRoleConfigured: boolean;
  supabaseProjectRef: string | null;
  mandatedProjectOk: boolean | null;
  notes: string[];
};

export async function collectSystemHealth(): Promise<SystemHealthReport> {
  const notes: string[] = [];
  const supabase = await createClientSafe();
  let databaseOk: boolean | null = null;
  let storageOk: boolean | null = null;
  let jobsPending = 0;
  let jobsFailed = 0;

  const supabasePublicConfigured = Boolean(supabase);
  const serviceRoleConfigured = isSupabaseServiceRoleConfigured();
  const supabaseProjectRef = getSupabaseProjectRefFromEnv();
  const mandatedProjectOk = supabaseProjectRef
    ? supabaseProjectRef === MANDATED_SUPABASE_PROJECT_REF
    : null;

  if (!supabase) {
    notes.push("Client Supabase non configuré — statut base inconnu.");
  } else {
    try {
      const { error } = await supabase
        .from("ref_statuts" as never)
        .select("code")
        .limit(1);
      databaseOk = !error;
      if (error) notes.push(`Base : ${error.message}`);
    } catch {
      databaseOk = false;
      notes.push("Base : erreur de connexion.");
    }

    try {
      const { error } = await supabase.storage.listBuckets();
      storageOk = !error;
      if (error) notes.push(`Storage : ${error.message}`);
    } catch {
      storageOk = false;
      notes.push("Storage : statut inconnu.");
    }

    const { data: jobs } = await supabase
      .from("background_jobs" as never)
      .select("statut")
      .in("statut", ["pending", "queued", "running", "failed"])
      .limit(500);
    const rows = (jobs ?? []) as Array<{ statut: string }>;
    jobsPending = rows.filter((j) =>
      ["pending", "queued", "running"].includes(j.statut),
    ).length;
    jobsFailed = rows.filter((j) => j.statut === "failed").length;
  }

  const emailConfigured = Boolean(
    process.env.EMAIL_PROVIDER &&
      process.env.EMAIL_API_KEY &&
      process.env.EMAIL_FROM,
  );
  const serdipayConfigured = Boolean(
    process.env.SERDIPAY_BASE_URL &&
      process.env.SERDIPAY_MERCHANT_ID &&
      process.env.SERDIPAY_API_KEY &&
      process.env.SERDIPAY_API_SECRET &&
      process.env.SERDIPAY_WEBHOOK_SECRET,
  );

  if (!emailConfigured) notes.push("Email newsletter : Configuration requise.");
  if (!serdipayConfigured) notes.push("SerdiPay : Configuration requise.");
  if (!serviceRoleConfigured) {
    notes.push(
      "SUPABASE_SERVICE_ROLE_KEY absente — invitations admin / OCR worker / jobs service indisponibles.",
    );
  }
  if (mandatedProjectOk === false) {
    notes.push(
      `Projet Supabase inattendu (${supabaseProjectRef}) — attendu ${MANDATED_SUPABASE_PROJECT_REF}.`,
    );
  }

  return {
    checkedAt: new Date().toISOString(),
    databaseOk,
    storageOk,
    jobsPending,
    jobsFailed,
    appVersion: process.env.npm_package_version || "0.1.0",
    emailConfigured,
    serdipayConfigured,
    supabasePublicConfigured,
    serviceRoleConfigured,
    supabaseProjectRef,
    mandatedProjectOk,
    notes,
  };
}
