"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requirePermission } from "@/lib/auth/require-permission";
import { createClientSafe } from "@/lib/supabase/safe";
import {
  createStockArticle,
  createStockMouvement,
} from "@/features/stocks/services/stocks.service";

export async function createStockArticleAction(formData: FormData) {
  await requirePermission("stocks:write");
  const parsed = z
    .object({
      sku: z.string().min(1),
      nom: z.string().min(2),
      unite_code: z.string().optional(),
      seuil_min: z.coerce.number().optional(),
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
  });
  revalidatePath("/admin/stocks");
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
    });
  } catch {
    return;
  }
  revalidatePath("/admin/stocks");
  revalidatePath("/admin/stocks/mouvements");
}
