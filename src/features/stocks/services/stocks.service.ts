import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import { appendAuditLog } from "@/features/identity/services/audit.service";
import {
  assertSufficientStock,
  stockMovementSens,
  type StockMouvementType,
} from "@/features/stocks/lib/stock-rules";

export type { StockMouvementType };
export { assertSufficientStock, stockMovementSens };

export async function createStockArticle(
  supabase: SupabaseClient,
  input: {
    sku: string;
    nom: string;
    uniteCode?: string;
    seuilMin?: number;
    categorieId?: string;
    isDemo?: boolean;
  },
) {
  const { data, error } = await supabase
    .from("stock_articles" as never)
    .insert({
      sku: input.sku,
      nom: input.nom,
      unite_code: input.uniteCode || "u",
      seuil_min: input.seuilMin ?? 0,
      categorie_id: input.categorieId ?? null,
      is_demo: input.isDemo ?? false,
    } as never)
    .select("id")
    .single();
  if (error || !data) throw new Error(error?.message || "Échec article");
  return String((data as { id: string }).id);
}

export async function updateStockArticle(
  supabase: SupabaseClient,
  id: string,
  input: { nom?: string; seuilMin?: number; categorieId?: string | null; uniteCode?: string },
) {
  const { error } = await supabase
    .from("stock_articles" as never)
    .update({
      nom: input.nom,
      seuil_min: input.seuilMin,
      categorie_id: input.categorieId,
      unite_code: input.uniteCode,
      updated_at: new Date().toISOString(),
    } as never)
    .eq("id", id);
  if (error) throw new Error(error.message);
}

export async function archiveStockArticle(supabase: SupabaseClient, id: string) {
  const { error } = await supabase
    .from("stock_articles" as never)
    .update({ actif: false, updated_at: new Date().toISOString() } as never)
    .eq("id", id);
  if (error) throw new Error(error.message);
}

export async function createStockEntrepot(
  supabase: SupabaseClient,
  input: { code: string; nom: string; province?: string; isDemo?: boolean },
) {
  const { data, error } = await supabase
    .from("stock_entrepots" as never)
    .insert({
      code: input.code.toUpperCase(),
      nom: input.nom,
      province: input.province ?? null,
      is_demo: input.isDemo ?? false,
    } as never)
    .select("id")
    .single();
  if (error || !data) throw new Error(error?.message || "Échec entrepôt");
  return String((data as { id: string }).id);
}

export async function archiveStockEntrepot(supabase: SupabaseClient, id: string) {
  const { error } = await supabase
    .from("stock_entrepots" as never)
    .update({ actif: false } as never)
    .eq("id", id);
  if (error) throw new Error(error.message);
}

export async function createStockCategory(
  supabase: SupabaseClient,
  input: { code: string; nom: string; isDemo?: boolean },
) {
  const { data, error } = await supabase
    .from("stock_categories" as never)
    .insert({
      code: input.code.toUpperCase(),
      nom: input.nom,
      is_demo: input.isDemo ?? false,
    } as never)
    .select("id")
    .single();
  if (error || !data) throw new Error(error?.message || "Échec catégorie");
  return String((data as { id: string }).id);
}

export async function createStockMouvement(
  supabase: SupabaseClient,
  input: {
    articleId: string;
    entrepotId: string;
    type: StockMouvementType;
    quantite: number;
    userId: string;
    reference?: string;
    note?: string;
    lot?: string;
    expiresAt?: string;
  },
) {
  if (input.quantite <= 0) throw new Error("Quantité invalide");

  const sens = stockMovementSens(input.type);

  if (sens === -1) {
    const { data: dispo } = await supabase
      .from("v_stock_disponibles" as never)
      .select("quantite_disponible")
      .eq("article_id", input.articleId)
      .eq("entrepot_id", input.entrepotId)
      .maybeSingle();
    const qty =
      dispo && typeof dispo === "object" && "quantite_disponible" in dispo
        ? Number((dispo as { quantite_disponible: number }).quantite_disponible)
        : 0;
    assertSufficientStock(qty, input.quantite);
  }

  const { data, error } = await supabase
    .from("stock_mouvements" as never)
    .insert({
      article_id: input.articleId,
      entrepot_id: input.entrepotId,
      type: input.type,
      quantite: input.quantite,
      sens,
      reference: input.reference ?? null,
      note: input.note ?? null,
      lot: input.lot ?? null,
      expires_at: input.expiresAt ?? null,
      created_by: input.userId,
    } as never)
    .select("id")
    .single();

  if (error || !data) throw new Error(error?.message || "Échec mouvement");
  const id = String((data as { id: string }).id);
  await appendAuditLog(supabase, {
    action: "stocks.mouvement.create",
    module: "stocks",
    entityType: "stock_mouvements",
    entityId: id,
    newValues: { type: input.type, quantite: input.quantite },
  });
  return id;
}

export async function createStockTransfert(
  supabase: SupabaseClient,
  input: {
    articleId: string;
    fromEntrepotId: string;
    toEntrepotId: string;
    quantite: number;
    userId: string;
    note?: string;
  },
) {
  if (input.fromEntrepotId === input.toEntrepotId) {
    throw new Error("Entrepôts source et destination identiques.");
  }
  const reference = `TRF-${Date.now().toString().slice(-10)}`;
  await createStockMouvement(supabase, {
    articleId: input.articleId,
    entrepotId: input.fromEntrepotId,
    type: "sortie",
    quantite: input.quantite,
    userId: input.userId,
    reference,
    note: input.note ?? "Transfert (sortie)",
  });
  await createStockMouvement(supabase, {
    articleId: input.articleId,
    entrepotId: input.toEntrepotId,
    type: "entree",
    quantite: input.quantite,
    userId: input.userId,
    reference,
    note: input.note ?? "Transfert (entrée)",
  });
  return reference;
}

export async function listStockArticles(supabase: SupabaseClient) {
  const { data } = await supabase
    .from("stock_articles" as never)
    .select("id, sku, nom, seuil_min, actif, unite_code, categorie_id")
    .eq("actif", true)
    .order("nom")
    .limit(200);
  return (data ?? []) as Array<{
    id: string;
    sku: string;
    nom: string;
    seuil_min: number;
    actif: boolean;
    unite_code: string | null;
    categorie_id: string | null;
  }>;
}

export async function listStockDisponibles(supabase: SupabaseClient) {
  const { data } = await supabase
    .from("v_stock_disponibles" as never)
    .select("article_id, entrepot_id, quantite_disponible")
    .limit(500);
  return (data ?? []) as Array<{
    article_id: string;
    entrepot_id: string;
    quantite_disponible: number;
  }>;
}

export async function listStockEntrepots(supabase: SupabaseClient) {
  const { data } = await supabase
    .from("stock_entrepots" as never)
    .select("id, code, nom, province, actif")
    .eq("actif", true)
    .order("nom")
    .limit(100);
  return (data ?? []) as Array<{
    id: string;
    code: string;
    nom: string;
    province: string | null;
    actif: boolean;
  }>;
}

export async function listStockCategories(supabase: SupabaseClient) {
  const { data } = await supabase
    .from("stock_categories" as never)
    .select("id, code, nom, actif")
    .eq("actif", true)
    .order("nom")
    .limit(100);
  return (data ?? []) as Array<{
    id: string;
    code: string;
    nom: string;
    actif: boolean;
  }>;
}

export async function listStockMouvements(supabase: SupabaseClient, limit = 100) {
  const { data } = await supabase
    .from("stock_mouvements" as never)
    .select(
      "id, article_id, entrepot_id, type, quantite, sens, reference, note, created_at, lot, expires_at",
    )
    .order("created_at", { ascending: false })
    .limit(limit);
  return (data ?? []) as Array<{
    id: string;
    article_id: string;
    entrepot_id: string;
    type: string;
    quantite: number;
    sens: number;
    reference: string | null;
    note: string | null;
    created_at: string;
    lot: string | null;
    expires_at: string | null;
  }>;
}
