import { z } from "zod";

export const predictionSchema = z.object({
  matchId: z.string().uuid(),
  predictedHome: z.number().int().min(0).max(20),
  predictedAway: z.number().int().min(0).max(20),
});

export type PredictionInput = z.infer<typeof predictionSchema>;
