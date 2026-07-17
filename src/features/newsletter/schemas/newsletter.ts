import { z } from "zod";

export const newsletterSubscriberSchema = z.object({
  email: z.string().email(),
  firstName: z.string().trim().min(1).max(100).optional(),
  lastName: z.string().trim().min(1).max(100).optional(),
  preferences: z.array(z.string()).default([]),
  consent: z.literal(true),
});

export const newsletterUnsubscribeSchema = z.object({
  email: z.string().email(),
  token: z.string().min(10).optional(),
});

export const newsletterPreferencesSchema = z.object({
  email: z.string().email(),
  preferences: z.array(z.string()),
});

export const newsletterCampaignSchema = z.object({
  name: z.string().min(2).max(200),
  subject: z.string().min(2).max(200),
  templateId: z.string().uuid().optional(),
  segmentId: z.string().uuid().optional(),
  scheduledAt: z.string().datetime().optional(),
});

export type NewsletterSubscriberInput = z.infer<typeof newsletterSubscriberSchema>;
export type NewsletterCampaignInput = z.infer<typeof newsletterCampaignSchema>;
