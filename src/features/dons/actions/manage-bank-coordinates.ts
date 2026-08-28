"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { appendAuditLog } from "@/features/identity/services/audit.service";
import { requirePermission } from "@/lib/auth/require-permission";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { createClientSafe } from "@/lib/supabase/safe";
import { createAdminServiceClient } from "@/lib/supabase/admin-service";

const schema = z.object({
  id: z.string().uuid().optional(),
  bank_name: z.string().trim().min(2).max(200),
  account_holder: z.string().trim().min(2).max(200),
  account_usd: z.string().trim().min(5).max(40),
  account_cdf: z.string().trim().min(5).max(40),
  swift: z.string().trim().min(4).max(20),
  usd_enabled: z.boolean(),
  cdf_enabled: z.boolean(),
  instructions: z.string().trim().max(2000).optional(),
  correspondent_usd_bank: z.string().trim().max(200).optional(),
  correspondent_usd_address: z.string().trim().max(300).optional(),
  correspondent_usd_swift: z.string().trim().max(20).optional(),
  correspondent_eur_bank: z.string().trim().max(200).optional(),
  correspondent_eur_address: z.string().trim().max(300).optional(),
  correspondent_eur_swift: z.string().trim().max(20).optional(),
  eur_note: z.string().trim().max(500).optional(),
});

export async function saveBankCoordinatesAction(input: unknown) {
  await requirePermission("dons:bank_settings");
  const parsed = schema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: "Données invalides." };
  }

  const supabase = createAdminServiceClient() ?? (await createClientSafe());
  if (!supabase) return { ok: false, message: "Service indisponible." };

  const user = await getCurrentUser();
  const now = new Date().toISOString();

  const { data: existing } = await supabase
    .from("dons_coordonnees_bancaires")
    .select("*")
    .eq("is_active", true)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const payload = {
    bank_name: parsed.data.bank_name,
    account_holder: parsed.data.account_holder,
    account_usd: parsed.data.account_usd.replace(/\s+/g, ""),
    account_cdf: parsed.data.account_cdf.replace(/\s+/g, ""),
    swift: parsed.data.swift.toUpperCase().replace(/\s+/g, ""),
    usd_enabled: parsed.data.usd_enabled,
    cdf_enabled: parsed.data.cdf_enabled,
    instructions: parsed.data.instructions ?? null,
    correspondent_usd_bank: parsed.data.correspondent_usd_bank ?? null,
    correspondent_usd_address: parsed.data.correspondent_usd_address ?? null,
    correspondent_usd_swift: parsed.data.correspondent_usd_swift?.toUpperCase() ?? null,
    correspondent_eur_bank: parsed.data.correspondent_eur_bank ?? null,
    correspondent_eur_address: parsed.data.correspondent_eur_address ?? null,
    correspondent_eur_swift: parsed.data.correspondent_eur_swift?.toUpperCase() ?? null,
    eur_note: parsed.data.eur_note ?? null,
    is_active: true,
    updated_by: user?.id ?? null,
    updated_at: now,
  };

  if (existing?.id) {
    const { error } = await supabase
      .from("dons_coordonnees_bancaires")
      .update(payload)
      .eq("id", existing.id);
    if (error) return { ok: false, message: "Enregistrement impossible." };

    await appendAuditLog(supabase, {
      action: "don.bank_coordinates_update",
      module: "dons",
      entityType: "dons_coordonnees_bancaires",
      entityId: existing.id,
      oldValues: {
        account_usd: existing.account_usd,
        account_cdf: existing.account_cdf,
        swift: existing.swift,
      },
      newValues: {
        account_usd: payload.account_usd,
        account_cdf: payload.account_cdf,
        swift: payload.swift,
      },
      sensitivity: "critique",
    });
  } else {
    const { data, error } = await supabase
      .from("dons_coordonnees_bancaires")
      .insert(payload)
      .select("id")
      .single();
    if (error || !data) return { ok: false, message: "Création impossible." };
    await appendAuditLog(supabase, {
      action: "don.bank_coordinates_create",
      module: "dons",
      entityType: "dons_coordonnees_bancaires",
      entityId: data.id,
      newValues: {
        account_usd: payload.account_usd,
        account_cdf: payload.account_cdf,
      },
      sensitivity: "critique",
    });
  }

  revalidatePath("/admin/parametres/dons-paiements");
  revalidatePath("/soutenir");
  return { ok: true, message: "Coordonnées bancaires enregistrées." };
}
