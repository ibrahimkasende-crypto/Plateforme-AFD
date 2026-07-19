import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import { appendAuditLog } from "@/features/identity/services/audit.service";

export async function createStockArticle(
  supabase: SupabaseClient,
  input: {
    sku: string;
    nom: string;
    uniteCode?: string;
    seuilMin?: number;
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
      is_demo: input.isDemo ?? false,
    } as never)
    .select("id")
    .single();
  if (error || !data) throw new Error(error?.message || "Échec article");
  return String((data as { id: string }).id);
}

export async function createStockMouvement(
  supabase: SupabaseClient,
  input: {
    articleId: string;
    entrepotId: string;
    type: "entree" | "sortie" | "transfert" | "retour" | "ajustement" | "reservation";
    quantite: number;
    userId: string;
    reference?: string;
    note?: string;
  },
) {
  if (input.quantite <= 0) throw new Error("Quantité invalide");

  const sens = ["sortie", "reservation"].includes(input.type) ? -1 : 1;

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
    if (qty < input.quantite) {
      throw new Error("Stock insuffisant — sortie refusée.");
    }
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

export async function listStockArticles(supabase: SupabaseClient) {
  const { data } = await supabase
    .from("stock_articles" as never)
    .select("id, sku, nom, seuil_min, actif, unite_code")
    .eq("actif", true)
    .order("nom")
    .limit(200);
  return (data ?? []) as Array<Record<string, unknown>>;
}

export async function listStockDisponibles(supabase: SupabaseClient) {
  const { data } = await supabase
    .from("v_stock_disponibles" as never)
    .select("article_id, entrepot_id, quantite_disponible")
    .limit(500);
  return (data ?? []) as Array<Record<string, unknown>>;
}
