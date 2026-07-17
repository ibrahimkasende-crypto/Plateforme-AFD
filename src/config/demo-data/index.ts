/**
 * Jeux de données clairement identifiés comme DÉMO.
 * Ne jamais présenter ces valeurs comme des indicateurs réels de l’AFD.
 */
export const DEMO_DATA_NOTICE =
  "Données de démonstration uniquement — non représentatives de l’impact réel de l’AFD.";

export const demoDashboardKpis = {
  __demo: true as const,
  personnesTouchees: 0,
  femmesTouchees: 0,
  projetsActifs: 0,
  activitesRealisees: 0,
  partenairesActifs: 0,
  budgetDepense: 0,
  abonnesNewsletter: 0,
  rapportsGeneres: 0,
};

export const demoBeneficiaryEvolution = [
  { label: "Jan", value: 0 },
  { label: "Fév", value: 0 },
  { label: "Mar", value: 0 },
] as const;
