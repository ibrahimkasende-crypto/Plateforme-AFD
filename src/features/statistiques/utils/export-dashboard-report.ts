import type {
  DashboardBundle,
  DashboardFilters,
} from "@/features/statistiques/types/dashboard";
import { organizationBrand } from "@/config/organization-brand";
import { productBrand } from "@/config/product-brand";

function escapeCsv(value: string | number | null | undefined): string {
  const text = value == null ? "" : String(value);
  return `"${text.replace(/"/g, '""')}"`;
}

function stamp(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}`;
}

function filterLabel(filters: DashboardFilters): string {
  const parts = [
    `Période: ${filters.period}`,
    filters.programmeId ? `Programme: ${filters.programmeId}` : null,
    filters.province ? `Province: ${filters.province}` : null,
    filters.projectId ? `Projet: ${filters.projectId}` : null,
    filters.from ? `Du: ${filters.from}` : null,
    filters.to ? `Au: ${filters.to}` : null,
  ].filter(Boolean);
  return parts.join(" · ");
}

export function buildDashboardReportCsv(
  bundle: DashboardBundle,
  filters: DashboardFilters,
): string {
  const lines: string[][] = [
    [`Rapport — ${organizationBrand.organizationLegalName}`],
    ["Produit", productBrand.productName],
    ["Généré le", new Date().toLocaleString("fr-FR")],
    ["Filtres", filterLabel(filters)],
    ["Environnement", process.env.NEXT_PUBLIC_APP_ENV ?? process.env.NODE_ENV ?? ""],
    [],
    ["=== INDICATEURS CLÉS ==="],
    ["Indicateur", "Valeur", "Variation (%)", "Disponible"],
    ...Object.values(bundle.summary.kpis).map((kpi) => [
      kpi.label,
      kpi.formatted,
      kpi.variationPct?.toString() ?? "",
      kpi.available ? "Oui" : "Non",
    ]),
    [],
    ["=== PROJETS PAR STATUT ==="],
    ["Statut", "Nombre", "Part (%)"],
    ...bundle.projectsByStatus.map((row) => [
      row.name,
      String(row.value),
      row.percent?.toString() ?? "",
    ]),
    [],
    ["=== PROJETS PAR SECTEUR ==="],
    ["Secteur", "Nombre", "Part (%)"],
    ...bundle.projectsBySector.map((row) => [
      row.name,
      String(row.value),
      row.percent?.toString() ?? "",
    ]),
    [],
    ["=== PROJETS PAR PROVINCE ==="],
    ["Province", "Projets", "Bénéficiaires", "Part (%)"],
    ...bundle.projectsByProvince.map((row) => [
      row.name,
      String(row.value),
      row.beneficiaries?.toString() ?? "",
      row.percent?.toString() ?? "",
    ]),
    [],
    ["=== TOP PROJETS ==="],
    ["Titre", "Localisation", "Bénéficiaires"],
    ...bundle.topProjects.map((row) => [
      row.title,
      row.location ?? "",
      row.beneficiaries?.toString() ?? "",
    ]),
    [],
    ["=== ÉVOLUTION DES BÉNÉFICIAIRES ==="],
    ["Mois", "Femmes", "Hommes", "Enfants", "Jeunes"],
    ...bundle.beneficiaryEvolution.map((row) => [
      row.label,
      String(row.femmes),
      String(row.hommes),
      String(row.enfants),
      String(row.jeunes),
    ]),
    [],
    ["=== ACTIVITÉS PAR MOIS ==="],
    ["Mois", "Formations", "Sensibilisations", "Distributions", "Réunions", "Missions", "Autres"],
    ...bundle.monthlyActivities.map((row) => [
      row.label,
      String(row.formations ?? 0),
      String(row.sensibilisations ?? 0),
      String(row.distributions ?? 0),
      String(row.reunions ?? 0),
      String(row.missions ?? 0),
      String(row.autres ?? 0),
    ]),
  ];

  if (bundle.budgetComparison.length > 0) {
    lines.push(
      [],
      ["=== BUDGET PRÉVU VS DÉPENSÉ ==="],
      ["Mois", "Prévu", "Dépensé", "Devise"],
      ...bundle.budgetComparison.map((row) => [
        row.label,
        String(row.planned),
        String(row.actual),
        row.currency,
      ]),
    );
  }

  lines.push(
    [],
    ["=== STATISTIQUES SECONDAIRES ==="],
    ["Indicateur", "Valeur"],
    ...bundle.secondaryStats.map((row) => [row.label, row.formatted]),
  );

  return "\uFEFF" + lines.map((row) => row.map(escapeCsv).join(";")).join("\n");
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export function downloadDashboardCsv(
  bundle: DashboardBundle,
  filters: DashboardFilters,
) {
  const csv = buildDashboardReportCsv(bundle, filters);
  downloadBlob(
    new Blob([csv], { type: "text/csv;charset=utf-8;" }),
    `rapport-dashboard-afd-${stamp()}.csv`,
  );
}

export function printDashboardReport(
  bundle: DashboardBundle,
  filters: DashboardFilters,
) {
  const kpis = Object.values(bundle.summary.kpis)
    .map(
      (kpi) =>
        `<tr><td>${kpi.label}</td><td><strong>${kpi.formatted}</strong></td><td>${kpi.variationPct ?? "—"}%</td></tr>`,
    )
    .join("");

  const statuses = bundle.projectsByStatus
    .map(
      (row) =>
        `<tr><td>${row.name}</td><td>${row.value}</td><td>${row.percent ?? "—"}%</td></tr>`,
    )
    .join("");

  const provinces = bundle.projectsByProvince
    .map(
      (row) =>
        `<tr><td>${row.name}</td><td>${row.value}</td><td>${row.beneficiaries ?? "—"}</td></tr>`,
    )
    .join("");

  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <title>Rapport — ${organizationBrand.organizationShortName}</title>
  <style>
    body { font-family: Georgia, "Times New Roman", serif; color: #0f172a; margin: 32px; }
    h1 { font-size: 22px; margin: 0 0 8px; color: #034ea2; }
    h2 { font-size: 16px; margin: 28px 0 10px; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px; }
    p { color: #475569; font-size: 13px; margin: 4px 0; }
    table { width: 100%; border-collapse: collapse; font-size: 13px; margin-top: 8px; }
    th, td { border: 1px solid #e2e8f0; padding: 8px 10px; text-align: left; }
    th { background: #f1f5f9; }
    .report-footer { margin-top: 32px; font-size: 11px; color: #94a3b8; }
    @media print { body { margin: 12mm; } }
  </style>
</head>
<body>
  <h1>${organizationBrand.organizationName}</h1>
  <p>Rapport du tableau de bord — ${organizationBrand.organizationLegalName}</p>
  <p>Généré le ${new Date().toLocaleString("fr-FR")}</p>
  <p>${filterLabel(filters)}</p>

  <h2>Indicateurs clés</h2>
  <table><thead><tr><th>Indicateur</th><th>Valeur</th><th>Variation</th></tr></thead><tbody>${kpis}</tbody></table>

  <h2>Projets par statut</h2>
  <table><thead><tr><th>Statut</th><th>Nombre</th><th>Part</th></tr></thead><tbody>${statuses || "<tr><td colspan='3'>Aucune donnée</td></tr>"}</tbody></table>

  <h2>Projets par province</h2>
  <table><thead><tr><th>Province</th><th>Projets</th><th>Bénéficiaires</th></tr></thead><tbody>${provinces || "<tr><td colspan='3'>Aucune donnée</td></tr>"}</tbody></table>

  <p class="report-footer">${productBrand.reportFooter}</p>
  <script>window.onload = function () { window.print(); }</script>
</body>
</html>`;

  const win = window.open("", "_blank", "noopener,noreferrer,width=960,height=720");
  if (!win) {
    // Popup bloquée : télécharger le HTML à la place
    downloadBlob(
      new Blob([html], { type: "text/html;charset=utf-8;" }),
      `rapport-dashboard-afd-${stamp()}.html`,
    );
    return;
  }
  win.document.open();
  win.document.write(html);
  win.document.close();
}
