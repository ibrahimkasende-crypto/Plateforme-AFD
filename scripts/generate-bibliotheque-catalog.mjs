/**
 * Régénère src/config/bibliotheque-catalog.json depuis
 * public/assets/Banque des images AFD - Classees
 *
 * Usage: npx tsx scripts/generate-bibliotheque-catalog.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const bankRoot = path.join(
  root,
  "public",
  "assets",
  "Banque des images AFD - Classees",
);

const CATEGORIES = {
  "01_sante": { slug: "sante", label: "Santé", domain: "sante-maternelle-infantile" },
  "02_education": { slug: "education", label: "Éducation", domain: "education" },
  "03_protection": { slug: "protection", label: "Protection", domain: "protection-vbg-droits-femmes" },
  "04_vbg": { slug: "vbg", label: "VBG", domain: "protection-vbg-droits-femmes" },
  "05_nutrition": { slug: "nutrition", label: "Nutrition", domain: "nutrition" },
  "06_wash": { slug: "wash", label: "WASH", domain: "eau-hygiene-assainissement" },
  "07_agriculture": { slug: "agriculture", label: "Agriculture", domain: "agriculture" },
  "08_securite_alimentaire": { slug: "securite-alimentaire", label: "Sécurité alimentaire", domain: "securite-alimentaire" },
  "09_autonomisation_economique": { slug: "autonomisation", label: "Autonomisation", domain: "autonomisation-economique" },
  "10_entrepreneuriat_feminin": { slug: "entrepreneuriat", label: "Entrepreneuriat", domain: "autonomisation-economique" },
  "11_inclusion_handicap": { slug: "inclusion", label: "Inclusion", domain: "inclusion" },
  "12_enfance": { slug: "enfance", label: "Enfance", domain: "enfance" },
  "13_jeunesse": { slug: "jeunesse", label: "Jeunesse", domain: "jeunesse" },
  "14_formation": { slug: "formation", label: "Formation", domain: "formation" },
  "15_renforcement_capacites": { slug: "renforcement-capacites", label: "Renforcement des capacités", domain: "formation" },
  "16_distribution_humanitaire": { slug: "distribution-humanitaire", label: "Distribution humanitaire", domain: "femmes-reponse-humanitaire-urgence" },
  "17_missions_terrain": { slug: "missions-terrain", label: "Missions de terrain", domain: "femmes-reponse-humanitaire-urgence" },
  "18_coordination": { slug: "coordination", label: "Coordination", domain: "femmes-leadership-gouvernance-communautaire" },
  "19_gouvernance": { slug: "gouvernance", label: "Gouvernance", domain: "femmes-leadership-gouvernance-communautaire" },
  "20_partenariats": { slug: "partenariats", label: "Partenariats", domain: "partenariats" },
  "21_plaidoyer": { slug: "plaidoyer", label: "Plaidoyer", domain: "plaidoyer" },
  "22_sensibilisation": { slug: "sensibilisation", label: "Sensibilisation", domain: "protection-vbg-droits-femmes" },
  "23_reunions": { slug: "reunions", label: "Réunions", domain: "coordination" },
  "24_visites_institutionnelles": { slug: "visites-institutionnelles", label: "Événements institutionnels", domain: "femmes-leadership-gouvernance-communautaire" },
  "25_communication": { slug: "communication", label: "Communication", domain: "communication" },
  "26_evenements": { slug: "evenements", label: "Événements", domain: "evenements" },
};

function titleFromStem(stem) {
  return stem
    .replace(/^afd_[a-z]+_/, "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
}

const activities = new Map();
for (const [folder, meta] of Object.entries(CATEGORIES)) {
  const dir = path.join(bankRoot, folder);
  if (!fs.existsSync(dir)) continue;
  const files = fs
    .readdirSync(dir)
    .filter((f) => /\.(jpe?g|png|webp)$/i.test(f))
    .sort();
  for (const file of files) {
    const base = file.replace(/\.(jpe?g|png|webp)$/i, "");
    const stem = base.replace(/_(\d{2,4})$/, "");
    const slug = `${stem.replace(/^afd_/, "").replace(/_/g, "-")}-${meta.slug}`
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
    if (!activities.has(slug)) {
      activities.set(slug, {
        id: `lib-${slug}`,
        slug,
        categorySlug: meta.slug,
        categoryLabel: meta.label,
        domainSlug: meta.domain,
        folder,
        title: titleFromStem(stem),
        summary: `Archive photographique officielle AFD — ${meta.label}.`,
        description: `Cette fiche documente une activité AFD dans le domaine « ${meta.label} ». Les images proviennent de la banque institutionnelle classée.`,
        status: "terminee",
        published: true,
        featured: false,
        eventDate: null,
        province: null,
        territory: null,
        locality: null,
        locationName: null,
        project: null,
        partners: [],
        tags: [meta.label],
        author: "AFD ASBL",
        images: [],
      });
    }
    const act = activities.get(slug);
    act.images.push({
      id: `${act.id}-${act.images.length}`,
      src: `/assets/Banque des images AFD - Classees/${folder}/${file}`,
      alt: `${act.title} — photo ${act.images.length + 1}`,
      title: act.title,
      caption: null,
      isCover: act.images.length === 0,
      orderIndex: act.images.length + 1,
    });
  }
}

const list = [...activities.values()].filter((a) => a.images.length > 0);
list.forEach((a, i) => {
  a.coverImageUrl = a.images[0].src;
  a.photoCount = a.images.length;
  a.downloadCount = 0;
  a.publishedAt = null;
  a.updatedAt = null;
  a.status = i % 3 === 0 ? "archivee" : i % 5 === 0 ? "en_cours" : "terminee";
});

const categories = Object.values(CATEGORIES).map((c) => {
  const items = list.filter((a) => a.categorySlug === c.slug);
  return {
    slug: c.slug,
    label: c.label,
    domainSlug: c.domain,
    coverImageUrl: items[0]?.coverImageUrl ?? null,
    activityCount: items.length,
    photoCount: items.reduce((n, a) => n + a.images.length, 0),
    latestTitle: items[0]?.title ?? null,
    latestSlug: items[0]?.slug ?? null,
  };
});

const out = path.join(root, "src", "config", "bibliotheque-catalog.json");
fs.writeFileSync(
  out,
  JSON.stringify(
    { generatedAt: new Date().toISOString(), categories, activities: list },
    null,
    2,
  ),
);
console.log(
  `OK ${list.length} activités, ${list.reduce((n, a) => n + a.images.length, 0)} photos → ${out}`,
);
