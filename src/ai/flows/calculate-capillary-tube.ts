
// src/ai/flows/calculate-capillary-tube.ts
'use server';

/**
 * @fileOverview Capillary tube dimension calculation flow.
 *
 * This file defines a Genkit flow to calculate the optimal capillary tube dimensions for a refrigeration system
 * based on compressor power and refrigerant type.
 *
 * @exports calculateCapillaryTubeDimensions - The function to trigger the calculation flow.
 * @exports CalculateCapillaryTubeOutput - The output type for the calculation.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type { CalculateCapillaryTubeInput } from '@/lib/schemas';
import { CalculateCapillaryTubeInputSchema } from '@/lib/schemas';


const CalculateCapillaryTubeOutputSchema = z.object({
  capillaryTubeLengthMeters: z
    .number()
    .describe('Optimal capillary tube length in meters.'),
  capillaryTubeInternalDiameterMillimeters: z
    .number()
    .describe('Optimal capillary tube internal diameter in millimeters.'),
  calculationDetails: z.string().describe('Details of the calculation process.'),
});

export type CalculateCapillaryTubeOutput = z.infer<
  typeof CalculateCapillaryTubeOutputSchema
>;

export async function calculateCapillaryTubeDimensions(
  input: CalculateCapillaryTubeInput
): Promise<CalculateCapillaryTubeOutput> {
  return calculateCapillaryTubeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'calculateCapillaryTubePrompt',
  input: {schema: CalculateCapillaryTubeInputSchema},
  output: {schema: CalculateCapillaryTubeOutputSchema},
  prompt: `You are an expert refrigeration engineer.

You will calculate the optimal capillary tube dimensions (length in meters and internal diameter in millimeters) for a refrigeration system.

Use the following information:

Compressor Power: {{{compressorPowerWatts}}} watts
Refrigerant Type: {{{refrigerantType}}}

Provide a detailed explanation of the calculation process and the assumptions made.  Be concise.

Ensure the output is valid JSON matching the schema.
`,
});

const calculateCapillaryTubeFlow = ai.defineFlow(
  {
    name: 'calculateCapillaryTubeFlow',
    inputSchema: CalculateCapillaryTubeInputSchema,
    outputSchema: CalculateCapillaryTubeOutputSchema,
  },
  async input => {
    const response = await prompt(input); // response is GenerateResponse<CalculateCapillaryTubeOutput>
    const output = response.output;     // output is CalculateCapillaryTubeOutput | null

    if (!output) {
      console.error(
        'Genkit prompt did not return a valid output. Full response:',
        JSON.stringify(response, null, 2)
      );
      let reasonMessage = 'Model did not produce a valid output matching the schema.';
      if (response.candidates && response.candidates.length > 0) {
        const topCandidate = response.candidates[0];
        if (topCandidate.finishReason && topCandidate.finishReason !== 'STOP' && topCandidate.finishReason !== 'UNKNOWN' && topCandidate.finishReason !== 'UNSPECIFIED') {
          reasonMessage += ` Finish Reason: ${topCandidate.finishReason}.`;
        }
        if (topCandidate.finishMessage) {
          reasonMessage += ` Finish Message: "${topCandidate.finishMessage}".`;
        }
        // Check for safety ratings if they exist and caused blocking
        if (topCandidate.safetyRatings && topCandidate.safetyRatings.some(r => r.blocked)) {
            const blockedCategories = topCandidate.safetyRatings
                .filter(rating => rating.blocked)
                .map(rating => rating.category);
            if (blockedCategories.length > 0) {
                reasonMessage += ` Content blocked due to safety categories: ${blockedCategories.join(', ')}.`;
            }
        }
      }
      throw new Error(reasonMessage);
    }
    return output;
  }
);

