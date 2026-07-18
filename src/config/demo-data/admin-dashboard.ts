/**
 * Jeu de données de DÉMONSTRATION pour le dashboard admin.
 * Visible uniquement en développement lorsque le mode démo est actif.
 * Ne jamais présenter ces valeurs comme des indicateurs réels de l’AFD.
 */

import type { DashboardBundle } from "@/features/statistiques/types/dashboard";

export const ADMIN_DEMO_BADGE = "Mode présentation";
export const ADMIN_DEMO_NOTICE =
  "Cet environnement utilise un jeu de données de présentation non officiel.";

function kpi(
  label: string,
  value: number,
  variationPct: number,
  formatted?: string,
) {
  return {
    label,
    value,
    formatted:
      formatted ??
      new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(value),
    variationPct,
    available: true,
    tooltip: ADMIN_DEMO_NOTICE,
  };
}

export const adminDashboardDemoBundle: Omit<
  DashboardBundle,
  "viewer" | "badges" | "filterOptions"
> & {
  filterOptions: DashboardBundle["filterOptions"];
  badges: DashboardBundle["badges"];
} = {
  demoMode: true,
  presentationMode: true,
  summary: {
    demoMode: true,
    kpis: {
      personnesTouchees: kpi("Personnes touchées", 24356, 18.6),
      femmesTouchees: kpi("Femmes touchées", 15842, 21.4),
      projetsActifs: kpi("Projets actifs", 128, 12.5),
      activitesRealisees: kpi("Activités réalisées", 542, 16.7),
      partenairesActifs: kpi("Partenaires actifs", 35, 9.4),
      budgetDepense: kpi("Budget dépensé", 1245780, 23.8, "1 245 780 $"),
    },
  },
  beneficiaryEvolution: [
    { label: "Jan", femmes: 2100, hommes: 900, enfants: 1200, jeunes: 800 },
    { label: "Fév", femmes: 2400, hommes: 980, enfants: 1300, jeunes: 860 },
    { label: "Mar", femmes: 2800, hommes: 1100, enfants: 1450, jeunes: 920 },
    { label: "Avr", femmes: 3200, hommes: 1180, enfants: 1600, jeunes: 1000 },
    { label: "Mai", femmes: 3600, hommes: 1250, enfants: 1720, jeunes: 1100 },
  ],
  projectsByStatus: [
    { name: "En cours", value: 62, percent: 48, color: "#2563eb" },
    { name: "Planifiés", value: 28, percent: 22, color: "#16a34a" },
    { name: "Terminés", value: 24, percent: 19, color: "#7c3aed" },
    { name: "Suspendus", value: 8, percent: 6, color: "#f97316" },
    { name: "Archivés", value: 6, percent: 5, color: "#94a3b8" },
  ],
  projectsBySector: [
    { name: "Santé, nutrition et WASH", value: 32, percent: 25, color: "#0877d1" },
    { name: "Protection, VBG et droits des femmes", value: 28, percent: 22, color: "#16a34a" },
    { name: "Autonomisation économique", value: 22, percent: 17, color: "#f59e0b" },
    { name: "Éducation et leadership", value: 18, percent: 14, color: "#7c3aed" },
    { name: "Sécurité alimentaire et agriculture", value: 16, percent: 13, color: "#0d9488" },
    { name: "Urgences, relèvement et cohésion sociale", value: 12, percent: 9, color: "#e11d48" },
  ],
  projectsByProvince: [
    { name: "Kinshasa", value: 5, percent: 17, beneficiaries: 420, slug: "kinshasa" },
    { name: "Nord-Kivu", value: 4, percent: 13, beneficiaries: 350, slug: "nord-kivu" },
    { name: "Ituri", value: 4, percent: 13, beneficiaries: 310, slug: "ituri" },
    { name: "Kwilu", value: 4, percent: 13, beneficiaries: 260, slug: "kwilu" },
    { name: "Haut-Katanga", value: 4, percent: 13, beneficiaries: 230, slug: "haut-katanga" },
    { name: "Tshopo", value: 3, percent: 10, beneficiaries: 180, slug: "tshopo" },
    { name: "Kwango", value: 3, percent: 10, beneficiaries: 140, slug: "kwango" },
    { name: "Tshuapa", value: 3, percent: 10, beneficiaries: 125, slug: "tshuapa" },
  ],
  topProjects: [
    {
      id: "demo-1",
      title: "Autonomisation économique des femmes — Sud-Kivu",
      location: "Sud-Kivu",
      beneficiaries: 4200,
      imageUrl: null,
    },
    {
      id: "demo-2",
      title: "Santé communautaire et WASH — Nord-Kivu",
      location: "Nord-Kivu",
      beneficiaries: 3800,
      imageUrl: null,
    },
    {
      id: "demo-3",
      title: "Protection et lutte contre les VBG",
      location: "Kinshasa",
      beneficiaries: 2900,
      imageUrl: null,
    },
    {
      id: "demo-4",
      title: "Sécurité alimentaire et AGR",
      location: "Ituri",
      beneficiaries: 2450,
      imageUrl: null,
    },
    {
      id: "demo-5",
      title: "Éducation et leadership des jeunes",
      location: "Haut-Katanga",
      beneficiaries: 2100,
      imageUrl: null,
    },
  ],
  beneficiariesByProvince: [
    { name: "Sud-Kivu", value: 8200 },
    { name: "Nord-Kivu", value: 7100 },
    { name: "Kinshasa", value: 3400 },
    { name: "Ituri", value: 2800 },
    { name: "Haut-Katanga", value: 1856 },
  ],
  monthlyActivities: [
    {
      label: "Jan",
      formations: 18,
      sensibilisations: 22,
      distributions: 10,
      reunions: 8,
      missions: 4,
      autres: 3,
    },
    {
      label: "Fév",
      formations: 20,
      sensibilisations: 24,
      distributions: 12,
      reunions: 9,
      missions: 5,
      autres: 2,
    },
    {
      label: "Mar",
      formations: 24,
      sensibilisations: 28,
      distributions: 14,
      reunions: 10,
      missions: 6,
      autres: 4,
    },
    {
      label: "Avr",
      formations: 26,
      sensibilisations: 30,
      distributions: 16,
      reunions: 11,
      missions: 5,
      autres: 3,
    },
    {
      label: "Mai",
      formations: 28,
      sensibilisations: 32,
      distributions: 18,
      reunions: 12,
      missions: 7,
      autres: 4,
    },
  ],
  budgetComparison: [
    { label: "Jan", planned: 180000, actual: 150000, currency: "USD" },
    { label: "Fév", planned: 200000, actual: 175000, currency: "USD" },
    { label: "Mar", planned: 220000, actual: 210000, currency: "USD" },
    { label: "Avr", planned: 240000, actual: 230000, currency: "USD" },
    { label: "Mai", planned: 260000, actual: 245000, currency: "USD" },
  ],
  alerts: [
    {
      id: "demo-a1",
      message: "Rapport trimestriel en attente de validation",
      level: "warning",
      href: "/admin/rapports",
      dateLabel: "Il y a 2 j",
    },
    {
      id: "demo-a2",
      message: "Projet sans activité récente (plus de 30 jours)",
      level: "critical",
      href: "/admin/projets",
      dateLabel: "Il y a 5 j",
    },
    {
      id: "demo-a3",
      message: "18 messages de contact non traités",
      level: "info",
      href: "/admin/messages",
      dateLabel: "Aujourd’hui",
    },
  ],
  secondaryStats: [
    {
      id: "messages",
      label: "Messages non traités",
      value: 18,
      formatted: "18",
      href: "/admin/messages",
      available: true,
    },
    {
      id: "adhesions",
      label: "Adhésions en attente",
      value: 24,
      formatted: "24",
      href: "/admin/adhesions",
      available: true,
    },
    {
      id: "dons",
      label: "Intentions de dons",
      value: 13,
      formatted: "13",
      href: "/admin/dons/intentions",
      available: true,
    },
    {
      id: "newsletter",
      label: "Abonnés newsletter",
      value: 3254,
      formatted: "3 254",
      href: "/admin/newsletter/abonnes",
      variationPct: 11.3,
      available: true,
    },
    {
      id: "documents",
      label: "Documents téléchargés",
      value: 842,
      formatted: "842",
      href: "/admin/mediatheque",
      available: true,
    },
    {
      id: "rapports",
      label: "Rapports générés",
      value: 126,
      formatted: "126",
      href: "/admin/rapports",
      available: true,
    },
  ],
  filterOptions: {
    programmes: [
      { id: "demo-p1", title: "Programme Santé & WASH" },
      { id: "demo-p2", title: "Programme Protection" },
    ],
    provinces: ["Sud-Kivu", "Nord-Kivu", "Kinshasa", "Ituri", "Haut-Katanga"],
    projects: [
      { id: "demo-1", title: "Autonomisation économique — Sud-Kivu" },
      { id: "demo-2", title: "Santé communautaire — Nord-Kivu" },
    ],
  },
  badges: {
    newsletter: 324,
    messages: 18,
    adhesions: 24,
    notifications: 12,
  },
  accessibleSummary:
    "Données de démonstration : 128 projets au total, dont 62 en cours, 28 planifiés et 24 terminés. Environ 24 356 personnes touchées.",
};
