"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { BANK_TRANSFER_METHOD, DONS_PREUVES_BUCKET } from "@/features/dons/config/bank-donation";
import { appendAuditLog } from "@/features/identity/services/audit.service";
import { requirePermission } from "@/lib/auth/require-permission";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { createClientSafe } from "@/lib/supabase/safe";
import { createAdminServiceClient } from "@/lib/supabase/admin-service";

async function recordHistory(
  donId: string,
  fromStatus: string | null,
  toStatus: string,
  changedBy: string | null,
  note?: string,
) {
  const service = createAdminServiceClient() ?? (await createClientSafe());
  if (!service) return;
  await service.from("dons_status_history").insert({
    don_id: donId,
    from_status: fromStatus,
    to_status: toStatus,
    changed_by: changedBy,
    note: note ?? null,
  });
}

function revalidateAll() {
  revalidatePath("/admin/dons");
  revalidatePath("/admin/dons/intentions");
  revalidatePath("/admin/dons/transactions");
  revalidatePath("/admin/dons/remboursements");
  revalidatePath("/admin/finances/transactions");
}

export async function updateDonStatus(id: string, status: string) {
  await requirePermission("dons:write");
  if (!z.string().uuid().safeParse(id).success || !status.trim()) return;

  const supabase = (await createClientSafe()) ?? createAdminServiceClient();
  if (!supabase) return;

  const { data: current } = await supabase
    .from("dons")
    .select("id, status")
    .eq("id", id)
    .maybeSingle();

  const user = await getCurrentUser();
  await supabase.from("dons").update({ status: status.trim(), updated_at: new Date().toISOString() }).eq("id", id);
  await recordHistory(id, current?.status ?? null, status.trim(), user?.id ?? null);
  await appendAuditLog(supabase, {
    action: "don.status_update",
    module: "dons",
    entityType: "dons",
    entityId: id,
    oldValues: { status: current?.status },
    newValues: { status },
    sensitivity: "sensible",
  });
  revalidateAll();
}

export async function confirmDon(id: string) {
  return updateDonStatus(id, "confirmed");
}

export async function verifyBankDon(id: string) {
  await requirePermission("dons:write");
  if (!z.string().uuid().safeParse(id).success) {
    return { ok: false, message: "Identifiant invalide." };
  }

  const supabase = createAdminServiceClient() ?? (await createClientSafe());
  if (!supabase) return { ok: false, message: "Service indisponible." };

  const { data: current } = await supabase
    .from("dons")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!current) return { ok: false, message: "Don introuvable." };
  if (current.payment_method !== BANK_TRANSFER_METHOD) {
    return { ok: false, message: "Ce don n’est pas un virement bancaire." };
  }
  if (!["pending", "proof_submitted"].includes(current.status ?? "")) {
    return { ok: false, message: "Ce don ne peut pas être confirmé dans son état actuel." };
  }

  const user = await getCurrentUser();
  const now = new Date().toISOString();
  await supabase
    .from("dons")
    .update({
      status: "verified",
      verified_at: now,
      verified_by: user?.id ?? null,
      updated_at: now,
    })
    .eq("id", id);

  await recordHistory(id, current.status, "verified", user?.id ?? null, "Réception du virement confirmée");
  await appendAuditLog(supabase, {
    action: "don.verify_bank_transfer",
    module: "dons",
    entityType: "dons",
    entityId: id,
    oldValues: { status: current.status },
    newValues: { status: "verified", verified_at: now },
    sensitivity: "sensible",
  });

  revalidateAll();
  revalidatePath(`/admin/dons/${id}`);
  return { ok: true, message: "Don confirmé." };
}

export async function rejectBankDon(id: string, reason?: string) {
  await requirePermission("dons:write");
  if (!z.string().uuid().safeParse(id).success) {
    return { ok: false, message: "Identifiant invalide." };
  }

  const supabase = createAdminServiceClient() ?? (await createClientSafe());
  if (!supabase) return { ok: false, message: "Service indisponible." };

  const { data: current } = await supabase
    .from("dons")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!current) return { ok: false, message: "Don introuvable." };

  const user = await getCurrentUser();
  const now = new Date().toISOString();
  const rejectionReason = reason?.trim().slice(0, 500) || null;

  await supabase
    .from("dons")
    .update({
      status: "rejected",
      rejected_at: now,
      rejected_by: user?.id ?? null,
      rejection_reason: rejectionReason,
      updated_at: now,
    })
    .eq("id", id);

  await recordHistory(id, current.status, "rejected", user?.id ?? null, rejectionReason ?? "Rejeté");
  await appendAuditLog(supabase, {
    action: "don.reject_bank_transfer",
    module: "dons",
    entityType: "dons",
    entityId: id,
    oldValues: { status: current.status },
    newValues: { status: "rejected", rejection_reason: rejectionReason },
    sensitivity: "sensible",
  });

  revalidateAll();
  revalidatePath(`/admin/dons/${id}`);
  return { ok: true, message: "Don rejeté." };
}

export async function refundDon(id: string) {
  await requirePermission("payments:manage");
  return updateDonStatus(id, "refunded");
}

export async function getDonProofSignedUrl(donId: string, storagePath: string) {
  await requirePermission("dons:read");
  if (!z.string().uuid().safeParse(donId).success || !storagePath.trim()) {
    return null;
  }
  const supabase = createAdminServiceClient() ?? (await createClientSafe());
  if (!supabase) return null;
  const { data, error } = await supabase.storage
    .from(DONS_PREUVES_BUCKET)
    .createSignedUrl(storagePath, 120);
  if (error || !data?.signedUrl) return null;
  return data.signedUrl;
}
