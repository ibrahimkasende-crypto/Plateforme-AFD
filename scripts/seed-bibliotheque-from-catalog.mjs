/**
 * Applique le schéma bibliothèque + seed depuis bibliotheque-catalog.json
 * Usage: DATABASE_URL=... node scripts/seed-bibliotheque-from-catalog.mjs
 */
import fs from "fs";
import path from "path";
import pg from "pg";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error("DATABASE_URL manquant");
  process.exit(1);
}

const schemaSql = fs.readFileSync(
  path.join(root, "supabase/migrations/20260804_010_bibliotheque_institutionnelle.sql"),
  "utf8",
);
const catalog = JSON.parse(
  fs.readFileSync(path.join(root, "src/config/bibliotheque-catalog.json"), "utf8"),
);

const statusMap = {
  en_cours: "en_cours",
  terminee: "terminee",
  archivee: "archivee",
};

const client = new pg.Client({
  connectionString: databaseUrl,
  ssl: { rejectUnauthorized: false },
});

await client.connect();
await client.query(schemaSql);
console.log("SCHEMA_OK");

let events = 0;
let images = 0;

for (const activity of catalog.activities) {
  const statut = statusMap[activity.status] ?? "terminee";
  const publie = activity.published !== false;
  const upsert = await client.query(
    `insert into public.bibliotheque_evenements (
       slug, titre, resume, description, domaine_slug, categorie_slug, categorie_label,
       lieu_nom, province, territoire, localite, projet, partenaires, tags, auteur,
       cover_image_url, statut, publie, featured, source, published_at
     ) values (
       $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13::text[],$14::text[],$15,$16,$17,$18,$19,'banque-images-afd',
       case when $18 then now() else null end
     )
     on conflict (slug) do update set
       titre = excluded.titre,
       resume = excluded.resume,
       description = excluded.description,
       domaine_slug = excluded.domaine_slug,
       categorie_slug = excluded.categorie_slug,
       categorie_label = excluded.categorie_label,
       cover_image_url = excluded.cover_image_url,
       statut = excluded.statut,
       publie = excluded.publie,
       tags = excluded.tags,
       updated_at = now()
     returning id`,
    [
      activity.slug,
      activity.title,
      activity.summary,
      activity.description,
      activity.domainSlug,
      activity.categorySlug,
      activity.categoryLabel,
      activity.locationName,
      activity.province,
      activity.territory,
      activity.locality,
      activity.project,
      activity.partners ?? [],
      activity.tags ?? [],
      activity.author ?? "AFD ASBL",
      activity.coverImageUrl,
      statut,
      publie,
      Boolean(activity.featured),
    ],
  );
  const eventId = upsert.rows[0].id;
  events += 1;

  await client.query(
    `delete from public.bibliotheque_images where evenement_id = $1`,
    [eventId],
  );

  for (const image of activity.images ?? []) {
    await client.query(
      `insert into public.bibliotheque_images (
         evenement_id, domaine_slug, title, caption, alt_text,
         local_asset_path, public_url, is_cover, order_index, visibility, consent_status, source
       ) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,'public','to-review','banque-images-afd')`,
      [
        eventId,
        activity.domainSlug,
        image.title,
        image.caption,
        image.alt,
        image.src,
        image.src,
        Boolean(image.isCover),
        image.orderIndex ?? 0,
      ],
    );
    images += 1;
  }
}

const counts = await client.query(
  `select
     (select count(*)::int from bibliotheque_evenements where deleted_at is null) as events,
     (select count(*)::int from bibliotheque_images where deleted_at is null) as images`,
);
console.log("SEEDED", counts.rows[0]);
console.log(`upserted_events=${events} upserted_images=${images}`);
await client.end();
