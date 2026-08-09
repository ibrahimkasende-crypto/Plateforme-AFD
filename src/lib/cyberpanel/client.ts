import "server-only";

/**
 * Couche CyberPanel — serveur uniquement.
 * Ne jamais exposer CYBERPANEL_* au client / NEXT_PUBLIC_*.
 *
 * L’API CyberPanel (si activée côté panneau) doit être appelée ici seulement.
 * Phase 1 : liens admin vers le panneau + détection de config ; pas d’appel
 * navigateur avec credentials admin.
 */

export type CyberPanelConfig = {
  panelUrl: string;
  apiEnabled: boolean;
  domain: string;
  hasCredentials: boolean;
};

export function getCyberPanelConfig(): CyberPanelConfig {
  const panelUrl =
    process.env.CYBERPANEL_PANEL_URL?.trim() ||
    "https://panel.afd-rdc.org:8090";
  const user = process.env.CYBERPANEL_API_USER?.trim();
  const token = process.env.CYBERPANEL_API_TOKEN?.trim();
  const apiEnabled = process.env.CYBERPANEL_API_ENABLED === "true";

  return {
    panelUrl: panelUrl.replace(/\/$/, ""),
    apiEnabled,
    domain: process.env.MAIL_DOMAIN?.trim() || "afd-rdc.org",
    hasCredentials: Boolean(user && token && apiEnabled),
  };
}

export function cyberpanelEmailListUrl(): string {
  const { panelUrl } = getCyberPanelConfig();
  return `${panelUrl}/email/listEmails`;
}

export function cyberpanelCreateEmailUrl(): string {
  const { panelUrl } = getCyberPanelConfig();
  return `${panelUrl}/email/createEmail`;
}

/**
 * Appel API CyberPanel (Phase 1 : stub documenté).
 * Ne retourne jamais le token.
 */
export async function cyberpanelListEmails(): Promise<{
  ok: boolean;
  emails: string[];
  message: string;
}> {
  const cfg = getCyberPanelConfig();
  if (!cfg.hasCredentials) {
    return {
      ok: false,
      emails: [],
      message:
        "API CyberPanel non configurée. Ouvrez le panneau manuellement pour lister les comptes.",
    };
  }

  // Endpoint typique documenté via collection Postman CyberPanel.
  // Désactivé tant que CYBERPANEL_API_ENABLED n’est pas validé en prod.
  return {
    ok: false,
    emails: [],
    message:
      "API CyberPanel détectée mais non activée en production (validation requise).",
  };
}

export async function cyberpanelCreateEmail(_input: {
  localPart: string;
  password: string;
}): Promise<{ ok: boolean; message: string }> {
  return {
    ok: false,
    message:
      "Création via API non activée. Utilisez le panneau CyberPanel (nouvel onglet).",
  };
}
