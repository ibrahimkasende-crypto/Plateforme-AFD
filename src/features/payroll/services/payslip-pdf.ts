import "server-only";

/**
 * Génère un bulletin PDF minimal (texte) côté serveur.
 * Stockage privé uniquement — jamais de bucket public.
 */
export type PayslipPdfInput = {
  organisation: string;
  employeNom: string;
  matricule: string;
  poste: string;
  departement: string;
  periodeLabel: string;
  reference: string;
  brut: number;
  retenues: number;
  net: number;
  currency: string;
  lines: Array<{ label: string; kind: string; amount: number }>;
  generatedAt: string;
};

function escapePdfText(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

export function buildPayslipPdf(input: PayslipPdfInput): Uint8Array {
  const lines: string[] = [
    "BULLETIN DE PAIE — DÉMONSTRATION",
    input.organisation,
    `Référence: ${input.reference}`,
    `Employé: ${input.employeNom} (${input.matricule})`,
    `Poste: ${input.poste} — ${input.departement}`,
    `Période: ${input.periodeLabel}`,
    `Généré: ${input.generatedAt}`,
    "---",
    ...input.lines.map(
      (l) => `${l.kind.toUpperCase()} ${l.label}: ${l.amount.toFixed(2)} ${input.currency}`,
    ),
    "---",
    `Brut: ${input.brut.toFixed(2)} ${input.currency}`,
    `Retenues: ${input.retenues.toFixed(2)} ${input.currency}`,
    `Net: ${input.net.toFixed(2)} ${input.currency}`,
    "Statut: non validé juridiquement (démonstration)",
  ];

  const contentStream = lines
    .map((line, index) => `BT /F1 10 Tf 50 ${780 - index * 14} Td (${escapePdfText(line)}) Tj ET`)
    .join("\n");

  const objects: string[] = [];
  objects.push("1 0 obj<< /Type /Catalog /Pages 2 0 R >>endobj\n");
  objects.push("2 0 obj<< /Type /Pages /Kids [3 0 R] /Count 1 >>endobj\n");
  objects.push(
    "3 0 obj<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources<< /Font<< /F1 5 0 R >> >> >>endobj\n",
  );
  objects.push(
    `4 0 obj<< /Length ${Buffer.byteLength(contentStream, "utf8")} >>stream\n${contentStream}\nendstream\nendobj\n`,
  );
  objects.push("5 0 obj<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>endobj\n");

  let pdf = "%PDF-1.4\n";
  const offsets: number[] = [0];
  for (const obj of objects) {
    offsets.push(Buffer.byteLength(pdf, "utf8"));
    pdf += obj;
  }
  const xrefStart = Buffer.byteLength(pdf, "utf8");
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += "0000000000 65535 f \n";
  for (let i = 1; i < offsets.length; i += 1) {
    pdf += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
  }
  pdf += `trailer<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF\n`;

  return new Uint8Array(Buffer.from(pdf, "utf8"));
}
