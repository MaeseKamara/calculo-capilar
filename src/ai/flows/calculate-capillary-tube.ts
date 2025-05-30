
// src/ai/flows/calculate-capillary-tube.ts
'use server';

/**
 * @fileOverview Capillary tube dimension calculation flow.
 *
 * This file defines a Genkit flow to calculate:
 * 1. The overall optimal capillary tube dimensions (length and diameter).
 * 2. If a specific diameter is provided by the user, the optimal length for that diameter.
 *
 * @exports calculateCapillaryTubeDimensions - The function to trigger the calculation flow.
 * @exports CalculateCapillaryTubeOutput - The output type for the calculation.
 */

import {ai} from '@/ai/genkit';
import type { CalculateCapillaryTubeInput, CalculateCapillaryTubeOutput } from '@/lib/schemas';
import { CalculateCapillaryTubeInputSchema, CalculateCapillaryTubeOutputSchema } from '@/lib/schemas';


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

You will calculate capillary tube dimensions for a refrigeration system.

Inputs:
Compressor Power: {{{compressorPowerWatts}}} watts
Refrigerant Type: {{{refrigerantType}}}
{{#if selectedCapillaryTubeInternalDiameterMillimeters}}
User Selected Internal Diameter: {{{selectedCapillaryTubeInternalDiameterMillimeters}}} mm
{{/if}}

Calculations:

1.  **Overall Optimal Dimensions:**
    Calculate the overall optimal capillary tube length (in meters) and internal diameter (in millimeters).
    Populate the \`overallOptimal\` object in the output with \`lengthMeters\` and \`internalDiameterMillimeters\`.

{{#if selectedCapillaryTubeInternalDiameterMillimeters}}
2.  **Length for Selected Diameter:**
    Given the User Selected Internal Diameter of {{{selectedCapillaryTubeInternalDiameterMillimeters}}} mm, calculate the optimal capillary tube length (in meters) for THIS specific diameter.
    Populate the \`selectedDiameterCalculation\` object in the output with this \`optimalLengthMeters\` and set \`inputDiameterMillimeters\` to {{{selectedCapillaryTubeInternalDiameterMillimeters}}}.
{{else}}
    <!-- If no specific diameter was selected by the user, the 'selectedDiameterCalculation' field in the output JSON should be omitted. Do not include it. -->
{{/if}}

Provide a detailed explanation of the calculation process in the \`calculationDetails\` field. If a user-selected diameter was provided, the details should cover calculations for both the overall optimal dimensions and the dimensions for the user-selected diameter. Otherwise, just explain the overall optimal calculation. Be concise.

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
