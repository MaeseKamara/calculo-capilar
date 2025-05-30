
import { z } from 'zod';

export const CalculateCapillaryTubeInputSchema = z.object({
  compressorPowerWatts: z
    .number()
    .describe('Compressor power in watts.')
    .gt(0, 'Compressor power must be greater than 0.'),
  refrigerantType: z.enum(['r134a', 'r404a', 'r290', 'r600']).describe('Refrigerant type.'),
  selectedCapillaryTubeInternalDiameterMillimeters: z
    .number()
    .gt(0, 'Selected diameter must be greater than 0 if provided.') // Apply .gt() before .optional()
    .optional()
    .describe('Optional user-selected internal diameter for the capillary tube in millimeters. If provided, the AI will calculate the optimal length for this diameter.'),
});

export type CalculateCapillaryTubeInput = z.infer<
  typeof CalculateCapillaryTubeInputSchema
>;

export const CalculateCapillaryTubeOutputSchema = z.object({
  overallOptimal: z.object({
    lengthMeters: z.number().describe('Overall optimal capillary tube length in meters.'),
    internalDiameterMillimeters: z.number().describe('Overall optimal capillary tube internal diameter in millimeters.'),
  }),
  selectedDiameterCalculation: z.optional(z.object({
    inputDiameterMillimeters: z.number().describe('The user-selected internal diameter in millimeters.'),
    optimalLengthMeters: z.number().describe('Optimal capillary tube length in meters for the selected diameter.'),
  })),
  calculationDetails: z.string().describe('Details of the calculation process, covering both calculations if applicable.'),
});

export type CalculateCapillaryTubeOutput = z.infer<
  typeof CalculateCapillaryTubeOutputSchema
>;
