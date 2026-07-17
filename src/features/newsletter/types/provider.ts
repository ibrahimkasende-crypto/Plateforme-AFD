/**
 * Interface fournisseur d’email newsletter.
 * Les clés privées restent côté serveur.
 * Aucun envoi fictif n’est implémenté dans cette phase.
 */
export type NewsletterEmailMessage = {
  to: string[];
  subject: string;
  html: string;
  text?: string;
};

export type NewsletterSendResult = {
  providerMessageId: string;
  accepted: number;
  rejected: number;
};

export interface NewsletterProvider {
  readonly name: string;
  send(message: NewsletterEmailMessage): Promise<NewsletterSendResult>;
}

export class NewsletterProviderNotConfiguredError extends Error {
  constructor(
    message = "Le fournisseur d’email newsletter n’est pas encore configuré",
  ) {
    super(message);
    this.name = "NewsletterProviderNotConfiguredError";
  }
}
