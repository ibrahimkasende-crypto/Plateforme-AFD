"use server";

import {
  getNewsletterPopupEligibilityAction as getEligibility,
  subscribeNewsletterAction as subscribeAction,
  type NewsletterActionResult,
} from "@/features/newsletter/actions/subscribe";

export type { NewsletterActionResult };

export async function getNewsletterPopupEligibilityAction() {
  return getEligibility();
}

export async function subscribeNewsletterAction(input: unknown) {
  return subscribeAction(input);
}
