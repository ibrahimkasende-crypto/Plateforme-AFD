/**
 * Bootstrap one-shot — attribue platform_owner à PLATFORM_OWNER_EMAIL.
 *
 * Usage (serveur uniquement, jamais en CI sans garde) :
 *
 *   PLATFORM_OWNER_EMAIL=owner@exemple.org \
 *   NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co \
 *   SUPABASE_SERVICE_ROLE_KEY=eyJ... \
 *   npx tsx scripts/bootstrap-platform-owner.ts
 *
 * Refuse si un platform_owner actif existe déjà (RPC count_active_platform_owners).
 * Ne crée pas de mot de passe : l'utilisateur Auth doit exister ou sera invité.
 */

import { createClient } from "@supabase/supabase-js";

async function main() {
  const email = process.env.PLATFORM_OWNER_EMAIL?.trim().toLowerCase();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  if (!email || !url || !key) {
    console.error(`
Variables requises :
  PLATFORM_OWNER_EMAIL
  NEXT_PUBLIC_SUPABASE_URL
  SUPABASE_SERVICE_ROLE_KEY
`);
    process.exit(1);
  }

  const service = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data: ownerCount, error: countError } = await service.rpc(
    "count_active_platform_owners",
  );

  if (countError) {
    console.error("RPC count_active_platform_owners indisponible :", countError.message);
    process.exit(1);
  }

  if (typeof ownerCount === "number" && ownerCount > 0) {
    console.error(
      `Refus : ${ownerCount} platform_owner actif(s) déjà présent(s). Bootstrap annulé.`,
    );
    process.exit(1);
  }

  const { data: roleRow } = await service
    .from("roles")
    .select("id")
    .eq("nom", "platform_owner")
    .maybeSingle();

  if (!roleRow?.id) {
    console.error("Rôle platform_owner introuvable — appliquer la migration 20260719_050.");
    process.exit(1);
  }

  let userId: string | null = null;

  const { data: list } = await service.auth.admin.listUsers({ page: 1, perPage: 1000 });
  const existing = list?.users?.find((u) => u.email?.toLowerCase() === email);
  if (existing) {
    userId = existing.id;
  } else {
    const site =
      process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "http://localhost:3000";
    const { data: invited, error: inviteError } =
      await service.auth.admin.inviteUserByEmail(email, {
        redirectTo: `${site}/auth/callback?next=/nouveau-mot-de-passe`,
      });
    if (inviteError || !invited.user) {
      console.error("Invitation échouée :", inviteError?.message);
      process.exit(1);
    }
    userId = invited.user.id;
  }

  await service.from("profils_administrateurs").upsert(
    {
      id: userId,
      email,
      nom_complet: email.split("@")[0],
      actif: true,
      statut_compte: "active",
      doit_configurer_mfa: true,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" },
  );

  await service.from("utilisateurs_roles").upsert(
    {
      utilisateur_id: userId,
      role_id: roleRow.id,
    },
    { onConflict: "utilisateur_id,role_id" },
  );

  console.log(`platform_owner attribué à ${email} (${userId}).`);
}

void main().catch((err) => {
  console.error(err);
  process.exit(1);
});
