import "server-only";

import type { Database } from "@/types/database.types";
import { createClientSafe } from "@/lib/supabase/safe";
import { createAdminServiceClient } from "@/lib/supabase/admin-service";

export type BankCoordinates =
  Database["public"]["Tables"]["dons_coordonnees_bancaires"]["Row"];

const FALLBACK: BankCoordinates = {
  id: "fallback",
  bank_name: "Equity Banque Commerciale du Congo SA (Equity BCDC)",
  account_holder: "ASBL ALLIANCE DES FEMMES POUR LE DEVELOPPEMENT",
  account_usd: "00011050233200275289929",
  account_cdf: "00011050233200275377520",
  swift: "BCDCCDKI",
  usd_enabled: true,
  cdf_enabled: true,
  instructions:
    "Utilisez la référence de don AFD comme communication du virement lorsque votre banque le permet.",
  correspondent_usd_bank: "Citibank New York",
  correspondent_usd_address: "399 Park Avenue, New York, NY 10043, USA",
  correspondent_usd_swift: "CITIUS33",
  correspondent_eur_bank: "Citibank London",
  correspondent_eur_address: "Canada Square, Canary Wharf, London E14 5LB, GB",
  correspondent_eur_swift: "CITIGB2L",
  eur_note:
    "Veuillez contacter l'AFD avant tout virement en EUR afin de confirmer le compte bénéficiaire et les instructions applicables.",
  is_active: true,
  updated_by: null,
  updated_at: new Date(0).toISOString(),
  created_at: new Date(0).toISOString(),
};

export async function getActiveBankCoordinates(): Promise<BankCoordinates> {
  const supabase = (await createClientSafe()) ?? createAdminServiceClient();
  if (!supabase) return FALLBACK;

  const { data, error } = await supabase
    .from("dons_coordonnees_bancaires")
    .select("*")
    .eq("is_active", true)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) return FALLBACK;
  return data;
}
