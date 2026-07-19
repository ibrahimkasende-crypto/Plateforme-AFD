"use client";

import { DashboardContextMenu } from "@/components/admin/dashboard/dashboard-context-menu";

type ChartActionsProps = {
  detailsHref?: string;
  onExportCsv?: () => void;
  onShowTable?: () => void;
  onFullscreen?: () => void;
  onReset?: () => void;
};

export function ChartActions({
  detailsHref,
  onExportCsv,
  onShowTable,
  onFullscreen,
  onReset,
}: ChartActionsProps) {
  const actions = [
    detailsHref
      ? { id: "details", label: "Voir les détails", href: detailsHref }
      : null,
    onShowTable
      ? { id: "table", label: "Afficher le tableau", onClick: onShowTable }
      : null,
    onExportCsv
      ? { id: "csv", label: "Exporter les données", onClick: onExportCsv }
      : null,
    onFullscreen
      ? { id: "fullscreen", label: "Agrandir", onClick: onFullscreen }
      : null,
    onReset
      ? { id: "reset", label: "Réinitialiser", onClick: onReset }
      : null,
  ].filter(Boolean) as Array<{
    id: string;
    label: string;
    href?: string;
    onClick?: () => void;
  }>;

  return <DashboardContextMenu actions={actions} />;
}
