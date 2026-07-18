const BATCH = "afd-complete-admin-2026";

if (process.env.CONFIRM !== "yes") {
  console.error(`
Refus : seed complet non confirmé.

  CONFIRM=yes npm run seed:complete-admin

Lot : ${BATCH}
Applique aussi : supabase/seed-admin-presentation-data.sql puis
supabase/seed-complete-admin-presentation.sql
`);
  process.exit(1);
}

console.log(`
Seed complet administration AFD — lot ${BATCH}

Ordre recommandé (Supabase SQL Editor / CLI) :
  1. supabase/migrations/20260719_030_admin_missing_modules.sql
  2. supabase/seed-admin-presentation-data.sql
  3. supabase/seed-complete-admin-presentation.sql

Volumes attendus (lot complet) :
  • activités, bénéficiaires agrégés, urgences
  • campagnes / modèles newsletter
  • budgets / dépenses
  • rapports générés, départements, partenariats
  • messages / adhésions / dons / clusters (si tables présentes)

Purge :
  CONFIRM=yes npm run seed:complete-admin:clean
`);

process.exit(0);
