
import { z } from 'zod';

export const CalculateCapillaryTubeInputSchema = z.object({
  compressorPowerWatts: z
    .number()
    .describe('Compressor power in watts.')
    .gt(0, 'Compressor power must be greater than 0.'),
  refrigerantType: z.enum(['r134a', 'r404a', 'r290', 'r600']).describe('Refrigerant type.'),
});

export type CalculateCapillaryTubeInput = z.infer<
  typeof CalculateCapillaryTubeInputSchema
>;
