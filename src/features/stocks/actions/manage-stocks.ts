"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requirePermission } from "@/lib/auth/require-permission";
import { createClientSafe } from "@/lib/supabase/safe";
import {
  archiveStockArticle,
  archiveStockEntrepot,
  createStockArticle,
  createStockCategory,
  createStockEntrepot,
  createStockMouvement,
  createStockTransfert,
  updateStockArticle,
} from "@/features/stocks/services/stocks.service";

function revalidateStocks() {
  revalidatePath("/admin/stocks");
  revalidatePath("/admin/stocks/mouvements");
  revalidatePath("/admin/stocks/entrepots");
  revalidatePath("/admin/stocks/categories");
}

export async function createStockArticleAction(formData: FormData) {
  await requirePermission("stocks:write");
  const parsed = z
    .object({
      sku: z.string().min(1),
      nom: z.string().min(2),
      unite_code: z.string().optional(),
      seuil_min: z.coerce.number().optional(),
      categorie_id: z.string().uuid().optional().or(z.literal("")),
    })
    .safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;
  const supabase = await createClientSafe();
  if (!supabase) return;
  await createStockArticle(supabase, {
    sku: parsed.data.sku,
    nom: parsed.data.nom,
    uniteCode: parsed.data.unite_code,
    seuilMin: parsed.data.seuil_min,
    categorieId: parsed.data.categorie_id || undefined,
  });
  revalidateStocks();
}

export async function updateStockArticleAction(formData: FormData) {
  await requirePermission("stocks:write");
  const parsed = z
    .object({
      id: z.string().uuid(),
      nom: z.string().min(2),
      seuil_min: z.coerce.number().optional(),
      unite_code: z.string().optional(),
    })
    .safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;
  const supabase = await createClientSafe();
  if (!supabase) return;
  await updateStockArticle(supabase, parsed.data.id, {
    nom: parsed.data.nom,
    seuilMin: parsed.data.seuil_min,
    uniteCode: parsed.data.unite_code,
  });
  revalidateStocks();
}

export async function archiveStockArticleAction(formData: FormData) {
  await requirePermission("stocks:write");
  const id = String(formData.get("id") || "");
  if (!z.string().uuid().safeParse(id).success) return;
  const supabase = await createClientSafe();
  if (!supabase) return;
  await archiveStockArticle(supabase, id);
  revalidateStocks();
}

export async function createStockEntrepotAction(formData: FormData) {
  await requirePermission("stocks:write");
  const parsed = z
    .object({
      code: z.string().min(2),
      nom: z.string().min(2),
      province: z.string().optional(),
    })
    .safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;
  const supabase = await createClientSafe();
  if (!supabase) return;
  await createStockEntrepot(supabase, parsed.data);
  revalidateStocks();
}

export async function archiveStockEntrepotAction(formData: FormData) {
  await requirePermission("stocks:write");
  const id = String(formData.get("id") || "");
  if (!z.string().uuid().safeParse(id).success) return;
  const supabase = await createClientSafe();
  if (!supabase) return;
  await archiveStockEntrepot(supabase, id);
  revalidateStocks();
}

export async function createStockCategoryAction(formData: FormData) {
  await requirePermission("stocks:write");
  const parsed = z
    .object({
      code: z.string().min(1),
      nom: z.string().min(2),
    })
    .safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;
  const supabase = await createClientSafe();
  if (!supabase) return;
  await createStockCategory(supabase, parsed.data);
  revalidateStocks();
}

export async function createStockMouvementAction(formData: FormData) {
  const session = await requirePermission("stocks:write");
  const parsed = z
    .object({
      article_id: z.string().uuid(),
      entrepot_id: z.string().uuid(),
      type: z.enum([
        "entree",
        "sortie",
        "transfert",
        "retour",
        "ajustement",
        "reservation",
      ]),
      quantite: z.coerce.number().positive(),
      reference: z.string().optional(),
      lot: z.string().optional(),
    })
    .safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;
  const supabase = await createClientSafe();
  if (!supabase) return;
  try {
    await createStockMouvement(supabase, {
      articleId: parsed.data.article_id,
      entrepotId: parsed.data.entrepot_id,
      type: parsed.data.type,
      quantite: parsed.data.quantite,
      userId: session.user.id,
      reference: parsed.data.reference,
      lot: parsed.data.lot,
    });
  } catch {
    return;
  }
  revalidateStocks();
}

export async function createStockTransfertAction(formData: FormData) {
  const session = await requirePermission("stocks:write");
  const parsed = z
    .object({
      article_id: z.string().uuid(),
      from_entrepot_id: z.string().uuid(),
      to_entrepot_id: z.string().uuid(),
      quantite: z.coerce.number().positive(),
      note: z.string().optional(),
    })
    .safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;
  const supabase = await createClientSafe();
  if (!supabase) return;
  try {
    await createStockTransfert(supabase, {
      articleId: parsed.data.article_id,
      fromEntrepotId: parsed.data.from_entrepot_id,
      toEntrepotId: parsed.data.to_entrepot_id,
      quantite: parsed.data.quantite,
      userId: session.user.id,
      note: parsed.data.note,
    });
  } catch {
    return;
  }
  revalidateStocks();
}
