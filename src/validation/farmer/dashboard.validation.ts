import { z } from "zod";

export const farmerIdSchema = z.object({
  farmerId: z.string().uuid(),
});

export const marketTrendSchema = z.object({
  productTypeId: z.string().uuid(),
  period: z.enum(["today", "week", "month"]).default("today"),
});

export const marketQuerySchema = z.object({
  productTypeId: z.string().uuid(),
});