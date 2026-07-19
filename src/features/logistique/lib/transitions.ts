export type DemandeStatut =
  | "brouillon"
  | "soumis"
  | "approuve"
  | "rejete"
  | "commande"
  | "recu"
  | "annule";

export type MissionStatut = "planifiee" | "en_cours" | "terminee" | "annulee";

const DEMANDE_TRANSITIONS: Record<DemandeStatut, DemandeStatut[]> = {
  brouillon: ["soumis", "annule"],
  soumis: ["approuve", "rejete", "annule"],
  approuve: ["commande", "annule"],
  rejete: ["annule"],
  commande: ["recu", "annule"],
  recu: [],
  annule: [],
};

const MISSION_TRANSITIONS: Record<MissionStatut, MissionStatut[]> = {
  planifiee: ["en_cours", "annulee"],
  en_cours: ["terminee", "annulee"],
  terminee: [],
  annulee: [],
};

export function canTransitionDemande(from: DemandeStatut, to: DemandeStatut): boolean {
  return DEMANDE_TRANSITIONS[from]?.includes(to) ?? false;
}

export function canTransitionMission(from: MissionStatut, to: MissionStatut): boolean {
  return MISSION_TRANSITIONS[from]?.includes(to) ?? false;
}
