"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requirePermission } from "@/lib/auth/require-permission";
import { createClientSafe } from "@/lib/supabase/safe";
import { appendAuditLog } from "@/features/identity/services/audit.service";
import { NewsletterProviderNotConfiguredError } from "@/features/newsletter/types/provider";
import {
  isEmailProviderConfigured,
  resolveNewsletterProvider,
} from "@/features/newsletter/providers/resolve-provider";

const campagneSchema = z.object({
  title: z.string().min(3),
  subject: z.string().min(3),
  status: z.enum(["brouillon", "programmee", "envoyee"]).optional(),
  scheduled_at: z.string().optional(),
});

const modeleSchema = z.object({
  title: z.string().min(3),
  body: z.string().min(1),
  active: z.string().optional(),
});

export async function saveCampagne(formData: FormData) {
  await requirePermission("newsletter:write");
  const parsed = campagneSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;

  const supabase = await createClientSafe();
  if (!supabase) return;

  // Interdire de créer directement en statut « envoyee » sans fournisseur
  const status =
    parsed.data.status === "envoyee" ? "brouillon" : parsed.data.status || "brouillon";

  await supabase.from("newsletter_campagnes" as never).insert({
    title: parsed.data.title,
    subject: parsed.data.subject,
    status,
    scheduled_at: parsed.data.scheduled_at || null,
    is_demo: false,
    demo_batch_id: null,
  } as never);

  revalidatePath("/admin/newsletter/campagnes");
  redirect("/admin/newsletter/campagnes");
}

export async function saveModele(formData: FormData) {
  await requirePermission("newsletter:write");
  const parsed = modeleSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;

  const supabase = await createClientSafe();
  if (!supabase) return;

  await supabase.from("newsletter_modeles" as never).insert({
    title: parsed.data.title,
    body: parsed.data.body,
    active: parsed.data.active === "on",
    is_demo: false,
    demo_batch_id: null,
  } as never);

  revalidatePath("/admin/newsletter/modeles");
  redirect("/admin/newsletter/modeles");
}

export async function updateAbonneStatut(id: string, statut: string) {
  await requirePermission("newsletter:write");
  if (!z.string().uuid().safeParse(id).success) return;
  const supabase = await createClientSafe();
  if (!supabase) return;
  await supabase
    .from("abonnes_newsletter" as never)
    .update({ statut, updated_at: new Date().toISOString() } as never)
    .eq("id", id);
  revalidatePath("/admin/newsletter/abonnes");
}

/**
 * Tentative d’envoi réel. Sans fournisseur configuré : aucune mutation « envoyee ».
 */
export async function sendCampagneAction(
  id: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  await requirePermission("newsletter:send");
  if (!z.string().uuid().safeParse(id).success) {
    return { ok: false, error: "Identifiant invalide" };
  }

  if (!isEmailProviderConfigured()) {
    return {
      ok: false,
      error:
        "Configuration requise : EMAIL_PROVIDER, EMAIL_API_KEY, EMAIL_FROM. Aucun e-mail n’a été envoyé.",
    };
  }

  try {
    resolveNewsletterProvider();
  } catch (error) {
    const message =
      error instanceof NewsletterProviderNotConfiguredError
        ? error.message
        : "Configuration requise — envoi bloqué.";
    return { ok: false, error: message };
  }

  // Point d’extension : appeler provider.send puis mettre à jour status.
  // Inatteignable tant que l’adaptateur n’est pas activé.
  return { ok: false, error: "Adaptateur fournisseur non activé." };
}

/** @deprecated Ne plus marquer envoyée sans envoi réel — redirige vers sendCampagneAction */
export async function markCampagneSent(id: string) {
  const result = await sendCampagneAction(id);
  if (!result.ok) {
    // Pas de faux succès : on journalise le blocage
    const supabase = await createClientSafe();
    if (supabase) {
      await appendAuditLog(supabase, {
        action: "newsletter.send.blocked",
        module: "newsletter",
        entityType: "newsletter_campagnes",
        entityId: id,
        result: "blocked",
        reason: result.error,
      });
    }
  }
  revalidatePath("/admin/newsletter/campagnes");
}
