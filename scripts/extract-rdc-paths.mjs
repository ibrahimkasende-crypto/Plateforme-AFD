import fs from "node:fs";

const svg = fs.readFileSync("public/maps/rdc-provinces.svg", "utf8");

// Find svg root attributes
const svgOpen = svg.match(/<svg\b[^>]*>/i)?.[0] ?? "";
console.log("svgOpen", svgOpen.slice(0, 300));

const pathIndex = svg.indexOf("<path");
console.log("first path snippet:");
console.log(svg.slice(pathIndex, pathIndex + 400));

const paths = [];
const seen = new Set();

// Match any path tag (self-closing or with closing tag)
const pathRegex = /<path\b([^>]*?)(?:\/>|>)/g;
let match;
while ((match = pathRegex.exec(svg)) !== null) {
  const attrs = match[1];
  const id = attrs.match(/\bid="(CD[A-Z]{2})"/)?.[1];
  if (!id || seen.has(id)) continue;
  const d = attrs.match(/\bd="([^"]+)"/)?.[1];
  const name = attrs.match(/\bname="([^"]+)"/)?.[1];
  if (!d || !name) {
    console.log("skip incomplete", id, { hasD: !!d, hasName: !!name });
    continue;
  }
  seen.add(id);
  paths.push({ id, name, d });
}

console.log("extracted", paths.length);

const width = svgOpen.match(/(?:^|\s)width="([\d.]+)"/)?.[1];
const height = svgOpen.match(/(?:^|\s)height="([\d.]+)"/)?.[1];
const viewBoxAttr = svgOpen.match(/\bview[Bb]ox="([^"]+)"/)?.[1];
const viewBox = viewBoxAttr ?? `0 0 ${width ?? 1000} ${height ?? 1000}`;
console.log({ width, height, viewBox });

const out = `/**
 * Chemins SVG des 26 provinces de la RDC.
 * Source : Simplemaps.com (free for commercial use)
 * https://simplemaps.com/resources/svg-license
 * Fichier source : public/maps/rdc-provinces.svg
 * Généré par scripts/extract-rdc-paths.mjs — ne pas éditer à la main.
 */

export type RdcProvincePath = {
  id: string;
  code: string;
  name: string;
  d: string;
};

export const RDC_MAP_VIEWBOX = ${JSON.stringify(viewBox)} as const;

export const RDC_PROVINCE_PATHS: readonly RdcProvincePath[] = ${JSON.stringify(
  paths
    .map((p) => ({
      id: p.id,
      code: p.id.replace(/^CD/, ""),
      name: p.name,
      d: p.d,
    }))
    .sort((a, b) => a.name.localeCompare(b.name, "fr")),
  null,
  2,
)} as const;
`;

fs.mkdirSync("src/features/intervention-zones/data", { recursive: true });
fs.writeFileSync(
  "src/features/intervention-zones/data/rdc-province-paths.ts",
  out,
  "utf8",
);
console.log("written", paths.length, "to rdc-province-paths.ts");
