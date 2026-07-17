import {
  getActivePartners,
  type ActivePartner,
} from "@/lib/queries/home";

export type { ActivePartner };

export async function getPublishedPartners(): Promise<ActivePartner[]> {
  return getActivePartners();
}
