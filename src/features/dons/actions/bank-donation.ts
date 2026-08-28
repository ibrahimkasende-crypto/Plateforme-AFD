"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  BANK_TRANSFER_METHOD,
  PROOF_ALLOWED_MIME,
  PROOF_MAX_BYTES,
  DONS_PREUVES_BUCKET,
  accountForCurrency,
  type BankDonationCurrency,
} from "@/features/dons/config/bank-donation";
import { getActiveBankCoordinates } from "@/features/dons/services/bank-coordinates.service";
import { appendAuditLog } from "@/features/identity/services/audit.service";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { createAdminServiceClient } from "@/lib/supabase/admin-service";

const bankIntentSchema = z.object({
  donor_name: z.string().trim().min(2).max(120),
  donor_email: z.string().trim().email().max(200),
  donor_phone: z.string().trim().max(40).optional(),
  donor_country: z.string().trim().min(2).max(80),
  amount: z.coerce.number().positive(),
  currency: z.enum(["USD", "CDF"]),
  message: z.string().trim().max(1000).optional(),
  is_anonymous: z.boolean().optional(),
  support_type: z.string().trim().max(80).optional(),
  consent: z.literal(true),
  website: z.string().max(0).optional(),
});

export type BankDonationResult = {
  ok: boolean;
  message: string;
  donationId?: string;
  reference?: string;
};

async function nextReference(
  service: NonNullable<ReturnType<typeof createAdminServiceClient>>,
): Promise<string> {
  const { data, error } = await service.rpc("next_don_reference");
  if (!error && typeof data === "string" && data.length > 0) return data;
  const stamp = Date.now().toString().slice(-6);
  const year = new Date().getUTCFullYear();
  return `AFD-DON-${year}-${stamp}`;
}

async function recordHistory(
  service: NonNullable<ReturnType<typeof createAdminServiceClient>>,
  donId: string,
  fromStatus: string | null,
  toStatus: string,
  changedBy: string | null,
  note?: string,
) {
  await service.from("dons_status_history").insert({
    don_id: donId,
    from_status: fromStatus,
    to_status: toStatus,
    changed_by: changedBy,
    note: note ?? null,
  });
}

export async function createBankDonationIntentAction(
  input: unknown,
): Promise<BankDonationResult> {
  const parsed = bankIntentSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: "Veuillez vérifier les informations du formulaire." };
  }
  if (parsed.data.website) {
    return {
      ok: true,
      message: "Votre déclaration de don a bien été enregistrée. Merci.",
      reference: "AFD-DON-HIDDEN",
    };
  }

  const service = createAdminServiceClient();
  if (!service) {
    return {
      ok: false,
      message: "Le service de don n’est pas disponible pour le moment. Réessayez plus tard.",
    };
  }

  const coords = await getActiveBankCoordinates();
  const currency = parsed.data.currency as BankDonationCurrency;
  if (currency === "USD" && !coords.usd_enabled) {
    return { ok: false, message: "Les dons en USD ne sont pas disponibles actuellement." };
  }
  if (currency === "CDF" && !coords.cdf_enabled) {
    return { ok: false, message: "Les dons en CDF ne sont pas disponibles actuellement." };
  }

  const user = await getCurrentUser();
  const reference = await nextReference(service);
  const account = accountForCurrency(coords, currency);

  const { data, error } = await service
    .from("dons")
    .insert({
      donor_name: parsed.data.donor_name,
      donor_email: parsed.data.donor_email,
      donor_phone: parsed.data.donor_phone?.trim() || null,
      donor_country: parsed.data.donor_country,
      amount: parsed.data.amount,
      currency,
      payment_method: BANK_TRANSFER_METHOD,
      status: "pending",
      message: parsed.data.message?.trim() || null,
      is_anonymous: Boolean(parsed.data.is_anonymous),
      support_type: parsed.data.support_type ?? null,
      reference,
      beneficiary_account: account,
      bank_name: coords.bank_name,
      user_id: user?.id ?? null,
    })
    .select("id, reference")
    .single();

  if (error || !data) {
    console.error("[dons] createBankDonationIntentAction insert failed", error?.message ?? error);
    return {
      ok: false,
      message:
        error?.message?.includes("permission") || error?.code === "42501"
          ? "Enregistrement refusé par la base. Contactez l’administrateur AFD."
          : "Votre don n’a pas pu être enregistré. Réessayez plus tard.",
    };
  }

  await recordHistory(service, data.id, null, "pending", user?.id ?? null, "Création intention virement");

  return {
    ok: true,
    message: "Votre déclaration de don a été enregistrée. Utilisez la référence pour votre virement.",
    donationId: data.id,
    reference: data.reference ?? reference,
  };
}

export async function submitBankTransferProofAction(formData: FormData): Promise<BankDonationResult> {
  const donationId = String(formData.get("donationId") ?? "");
  const file = formData.get("proof");
  if (!z.string().uuid().safeParse(donationId).success) {
    return { ok: false, message: "Don invalide." };
  }
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, message: "Veuillez sélectionner une preuve (PDF, JPG ou PNG)." };
  }
  if (file.size > PROOF_MAX_BYTES) {
    return { ok: false, message: "Le fichier dépasse 10 Mo." };
  }
  const mime = (file.type || "application/octet-stream").toLowerCase();
  if (!(PROOF_ALLOWED_MIME as readonly string[]).includes(mime) && !mime.includes("jpeg") && !mime.includes("jpg") && !mime.includes("png") && !mime.includes("pdf")) {
    return { ok: false, message: "Format non accepté. Utilisez PDF, JPG ou PNG." };
  }

  const service = createAdminServiceClient();
  if (!service) {
    return { ok: false, message: "Service indisponible." };
  }

  const { data: don, error: donError } = await service
    .from("dons")
    .select("id, status, payment_method, reference")
    .eq("id", donationId)
    .maybeSingle();

  if (donError || !don) {
    return { ok: false, message: "Don introuvable." };
  }
  if (don.payment_method !== BANK_TRANSFER_METHOD) {
    return { ok: false, message: "Ce don n’accepte pas de preuve de virement." };
  }
  if (!["pending", "proof_submitted"].includes(don.status ?? "")) {
    return { ok: false, message: "Ce don ne peut plus recevoir de preuve." };
  }

  const user = await getCurrentUser();
  const ext =
    mime.includes("pdf") ? "pdf" : mime.includes("png") ? "png" : "jpg";
  const storagePath = `${donationId}/${Date.now()}-proof.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error: uploadError } = await service.storage
    .from(DONS_PREUVES_BUCKET)
    .upload(storagePath, buffer, {
      contentType: mime,
      upsert: false,
    });

  if (uploadError) {
    return { ok: false, message: "Échec de l’envoi de la preuve. Réessayez." };
  }

  const { error: proofError } = await service.from("dons_preuves").insert({
    don_id: donationId,
    storage_path: storagePath,
    original_filename: file.name.slice(0, 200),
    mime_type: mime,
    uploaded_by: user?.id ?? null,
  });

  if (proofError) {
    await service.storage.from(DONS_PREUVES_BUCKET).remove([storagePath]).catch(() => undefined);
    return { ok: false, message: "La preuve n’a pas pu être enregistrée." };
  }

  const fromStatus = don.status;
  await service
    .from("dons")
    .update({
      status: "proof_submitted",
      updated_at: new Date().toISOString(),
    })
    .eq("id", donationId);

  await recordHistory(
    service,
    donationId,
    fromStatus,
    "proof_submitted",
    user?.id ?? null,
    "Preuve de virement téléversée",
  );

  return {
    ok: true,
    message:
      "Merci pour votre soutien à l’AFD. Votre déclaration de don a bien été enregistrée. Votre don sera confirmé après vérification de la réception du virement par l’AFD.",
    donationId,
    reference: don.reference ?? undefined,
  };
}

export async function getPublicBankCoordinatesAction() {
  return getActiveBankCoordinates();
}

export async function getPrefillDonorAction(): Promise<{
  name?: string;
  email?: string;
  phone?: string;
}> {
  const user = await getCurrentUser();
  if (!user) return {};
  const meta = user.user_metadata ?? {};
  return {
    name:
      (typeof meta.full_name === "string" && meta.full_name) ||
      (typeof meta.name === "string" && meta.name) ||
      undefined,
    email: user.email ?? undefined,
    phone: typeof meta.phone === "string" ? meta.phone : undefined,
  };
}

// keep revalidate helper for admin actions in same module tree
export async function revalidateDonsPaths() {
  revalidatePath("/admin/dons");
  revalidatePath("/admin/dons/intentions");
  revalidatePath("/soutenir");
}

export { appendAuditLog };
