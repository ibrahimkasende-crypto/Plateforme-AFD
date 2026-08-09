/**
 * Génère une fiche projet Word d’exemple (Kinshasa) pour l’import intelligent.
 * Usage: npx tsx scripts/generate-sample-projet-docx.ts
 */
import { mkdirSync } from "node:fs";
import { resolve } from "node:path";
import {
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
} from "docx";
import { writeFileSync } from "node:fs";

function field(label: string, value: string) {
  return new Paragraph({
    spacing: { after: 120 },
    children: [
      new TextRun({ text: `${label} : `, bold: true }),
      new TextRun({ text: value }),
    ],
  });
}

function sectionTitle(text: string) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 280, after: 120 },
    children: [new TextRun({ text, bold: true })],
  });
}

function body(text: string) {
  return new Paragraph({
    spacing: { after: 140 },
    children: [new TextRun({ text })],
  });
}

function bullet(text: string) {
  return new Paragraph({
    spacing: { after: 80 },
    children: [new TextRun({ text: `• ${text}` })],
  });
}

async function main() {
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: "FICHE PROJET AFD",
                bold: true,
                size: 36,
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 320 },
            children: [
              new TextRun({
                text: "Exemple prêt pour import intelligent — Plateforme AFD RDC",
                italics: true,
                size: 20,
              }),
            ],
          }),

          field(
            "Titre",
            "Académie entrepreneuriale des femmes de Kinshasa",
          ),
          field(
            "Programme",
            "Autonomisation économique des femmes",
          ),
          field("Statut", "en cours"),
          field("Secteur", "Autonomisation des femmes"),

          field("Province", "Kinshasa"),
          field("Territoire", "Ville-province de Kinshasa"),
          field(
            "Zone",
            "Communes de Ngaliema, Lemba et Kisenso",
          ),
          field(
            "Localisation",
            "Kinshasa, communes de Ngaliema, Lemba et Kisenso",
          ),

          field("Date de début", "15/01/2026"),
          field("Date de fin", "31/12/2027"),

          field("Budget", "285000 USD"),
          field("Devise", "USD"),

          field("Nombre de bénéficiaires", "1800"),
          field("Chef de projet", "Marie-Claire Kabongo"),
          field(
            "Partenaires",
            "Ministère du Genre, Fédération des femmes entrepreneures du Congo, UNCDF",
          ),
          field(
            "Bailleurs",
            "AFD, Union européenne, Fondation privée partenaires",
          ),

          sectionTitle("Description"),
          body(
            "Le projet Académie entrepreneuriale des femmes de Kinshasa vise à renforcer l’autonomie économique des femmes entrepreneurs et des jeunes porteuses d’initiatives dans trois communes stratégiques de la capitale. Face aux obstacles d’accès au financement, à la formation pratique et aux marchés, l’AFD met en place un parcours intégré combinant formation en gestion, mentorat, accompagnement à la formalisation et mise en relation avec des opportunités commerciales. L’approche privilégie les filières à fort potentiel local (agro-transformation, services de proximité, artisanat et commerce digital) tout en intégrant la prévention des violences économiques et le renforcement du leadership communautaire. Le projet s’appuie sur des centres d’appui de proximité, des formateurs locaux et un suivi trimestriel des résultats avec les communautés bénéficiaires.",
          ),

          sectionTitle("Objectifs"),
          bullet(
            "Former 1 200 femmes aux bases de l’entrepreneuriat, de la gestion financière et du marketing digital.",
          ),
          bullet(
            "Accompagner 400 micro-entreprises féminines vers la formalisation et l’accès à un premier financement.",
          ),
          bullet(
            "Créer 3 centres d’appui entrepreneuriaux de proximité à Ngaliema, Lemba et Kisenso.",
          ),
          bullet(
            "Renforcer les réseaux de femmes entrepreneures et leur accès aux marchés publics et privés locaux.",
          ),

          sectionTitle("Résultats attendus"),
          bullet(
            "Au moins 70 % des femmes formées améliorent le chiffre d’affaires de leur activité sous 12 mois.",
          ),
          bullet(
            "400 dossiers de financement structurés et présentés à des institutions financières partenaires.",
          ),
          bullet(
            "1 800 bénéficiaires directes accompagnées d’ici fin 2027.",
          ),
          bullet(
            "Mise en place d’un dispositif de suivi-évaluation trimestriel partagé avec les autorités locales.",
          ),

          sectionTitle("Résultats obtenus"),
          bullet(
            "Lancement opérationnel des 3 centres d’appui et recrutement de 12 formatrices locales.",
          ),
          bullet(
            "Première cohorte de 320 femmes inscrites au parcours entrepreneurial (trimestre 1).",
          ),
          bullet(
            "Signature de 2 partenariats avec des institutions de microfinance pour l’accès au crédit.",
          ),
          bullet(
            "Non encore disponible : impacts économiques consolidés (mesure prévue fin 2026).",
          ),

          sectionTitle("Coordonnées GPS"),
          body("Coordonnées GPS : -4.3276, 15.3136"),
        ],
      },
    ],
  });

  const outDir = resolve(process.cwd(), "Deploy");
  mkdirSync(outDir, { recursive: true });
  const outPath = resolve(
    outDir,
    "Fiche-Projet-AFD-Academie-Femmes-Kinshasa.docx",
  );
  const buffer = await Packer.toBuffer(doc);
  writeFileSync(outPath, buffer);
  writeFileSync(
    resolve(process.cwd(), "Fiche-Projet-AFD-Academie-Femmes-Kinshasa.docx"),
    buffer,
  );
  console.log("DOCX_OK", outPath);
}

void main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
