import { z } from "zod";
import { siteConfig } from "@/config/site";

export const createDonationIntentSchema = z.object({
  donor_name: z.string().trim().min(2).max(120),
  donor_email: z.string().email(),
  donor_phone: z.string().trim().min(6).max(40).optional(),
  donor_country: z.string().trim().min(2).max(80).optional(),
  anonymous: z.boolean().default(false),
  support_type: z.enum(siteConfig.supportTypes),
  programme_id: z.string().uuid().optional(),
  project_id: z.string().uuid().optional(),
  amount: z.number().positive(),
  currency: z.enum(siteConfig.currencies),
  message: z.string().trim().max(1000).optional(),
  consent: z.literal(true),
});

export type CreateDonationIntentInput = z.infer<
  typeof createDonationIntentSchema
>;
