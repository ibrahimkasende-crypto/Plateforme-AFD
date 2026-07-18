import { z } from "zod";

const kpiSchema = z.object({
  label: z.string(),
  value: z.number().nullable().optional(),
  formatted: z.string().optional(),
  variation_pct: z.number().nullable().optional(),
  variationPct: z.number().nullable().optional(),
  available: z.boolean().optional(),
  tooltip: z.string().nullable().optional(),
});

export const adminDashboardRpcSchema = z.object({
  summary: z
    .object({
      demo_mode: z.boolean().optional(),
      kpis: z.record(z.string(), kpiSchema).optional(),
    })
    .passthrough()
    .optional(),
  beneficiary_evolution: z.array(z.record(z.string(), z.unknown())).optional(),
  projects_by_status: z.array(z.record(z.string(), z.unknown())).optional(),
  projects_by_sector: z.array(z.record(z.string(), z.unknown())).optional(),
  top_projects: z.array(z.record(z.string(), z.unknown())).optional(),
  beneficiaries_by_province: z.array(z.record(z.string(), z.unknown())).optional(),
  monthly_activities: z.array(z.record(z.string(), z.unknown())).optional(),
  budget_comparison: z.array(z.record(z.string(), z.unknown())).optional(),
  alerts: z.array(z.record(z.string(), z.unknown())).optional(),
  secondary_stats: z.array(z.record(z.string(), z.unknown())).optional(),
  filter_options: z
    .object({
      programmes: z
        .array(z.object({ id: z.string(), title: z.string() }))
        .optional(),
      provinces: z.array(z.string()).optional(),
      projects: z
        .array(z.object({ id: z.string(), title: z.string() }))
        .optional(),
    })
    .optional(),
  is_demo: z.boolean().optional(),
  demo_batch_id: z.string().nullable().optional(),
  generated_at: z.string().optional(),
});

export type AdminDashboardRpcPayload = z.infer<typeof adminDashboardRpcSchema>;
