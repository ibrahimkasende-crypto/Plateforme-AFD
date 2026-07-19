import { createClient } from "@supabase/supabase-js";
import { describe, expect, it } from "vitest";

function getEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const anon =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim();
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  return { url, anon, service, ready: Boolean(url && anon && service) };
}

const env = getEnv();
const requireRls = process.env.AFD_REQUIRE_RLS === "1";

describe("RLS — audit catalogue + accès anonyme", () => {
  if (requireRls && !env.ready) {
    throw new Error(
      "AFD_REQUIRE_RLS=1 mais variables Supabase manquantes (URL, ANON, SERVICE_ROLE)",
    );
  }

  it.skipIf(!env.ready)(
    "rapport afd_rls_audit_report : RLS active et pas de USING true",
    async () => {
      const admin = createClient(env.url!, env.service!, {
        auth: { persistSession: false, autoRefreshToken: false },
      });

      const { data, error } = await admin.rpc("afd_rls_audit_report");
      expect(error, error?.message).toBeNull();
      expect(data).toBeTruthy();

      const report = data as {
        pass: boolean;
        tables_without_rls: string[] | null;
        permissive_true_policies: unknown[] | null;
        rls_enabled_count: number;
      };

      expect(report.tables_without_rls ?? []).toEqual([]);
      expect(report.permissive_true_policies ?? []).toEqual([]);
      expect(report.rls_enabled_count).toBeGreaterThanOrEqual(10);
      expect(report.pass).toBe(true);
    },
  );

  it.skipIf(!env.ready)(
    "anon ne lit pas stock_articles ni finances_transactions",
    async () => {
      const anon = createClient(env.url!, env.anon!, {
        auth: { persistSession: false, autoRefreshToken: false },
      });

      const stock = await anon.from("stock_articles").select("id").limit(5);
      const finances = await anon.from("finances_transactions").select("id").limit(5);
      const activites = await anon.from("activites").select("id").limit(5);

      expect((stock.data ?? []).length).toBe(0);
      expect((finances.data ?? []).length).toBe(0);
      expect((activites.data ?? []).length).toBe(0);
    },
  );

  it.skipIf(!env.ready)("anon ne peut pas écrire un mouvement de stock", async () => {
    const anon = createClient(env.url!, env.anon!, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { data, error } = await anon.from("stock_mouvements").insert({
      article_id: "00000000-0000-0000-0000-000000000001",
      entrepot_id: "00000000-0000-0000-0000-000000000001",
      type: "entree",
      quantite: 1,
      sens: 1,
    });

    expect(data).toBeNull();
    expect(error).toBeTruthy();
  });
});
