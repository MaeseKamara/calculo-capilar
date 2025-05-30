
// src/ai/flows/calculate-capillary-tube.ts
'use server';

/**
 * @fileOverview Capillary tube dimension calculation flow.
 *
 * This file defines a Genkit flow to calculate:
 * 1. The overall optimal capillary tube dimensions (length and diameter).
 * 2. If a specific diameter is provided by the user, the optimal length for that diameter.
 * All calculations consider the specified temperature range.
 *
 * @exports calculateCapillaryTubeDimensions - The function to trigger the calculation flow.
 * @exports CalculateCapillaryTubeOutput - The output type for the calculation.
 * @exports CalculateCapillaryTubeInputSchema - The Zod schema for the input.
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
Temperature Range: {{{temperatureRange}}} (where 'refrigeracion' means 0°C to 5°C and 'congelacion' means -18°C to -25°C)
{{#if selectedCapillaryTubeInternalDiameterMillimeters}}
User Selected Internal Diameter: {{{selectedCapillaryTubeInternalDiameterMillimeters}}} mm
{{/if}}

Calculations:
You MUST consider the specified Temperature Range in all your calculations.

1.  **Overall Optimal Dimensions:**
    Calculate the overall optimal capillary tube length (in meters) and internal diameter (in millimeters).
    Populate the \`overallOptimal\` object in the output with \`lengthMeters\` and \`internalDiameterMillimeters\`.

{{#if selectedCapillaryTubeInternalDiameterMillimeters}}
2.  **Length for Selected Diameter:**
    Given the User Selected Internal Diameter of {{{selectedCapillaryTubeInternalDiameterMillimeters}}} mm, calculate the optimal capillary tube length (in meters) for THIS specific diameter, considering the Temperature Range.
    Populate the \`selectedDiameterCalculation\` object in the output with this \`optimalLengthMeters\` and set \`inputDiameterMillimeters\` to {{{selectedCapillaryTubeInternalDiameterMillimeters}}}.
{{else}}
    <!-- If no specific diameter was selected by the user, the 'selectedDiameterCalculation' field in the output JSON should be omitted. Do not include it. -->
{{/if}}

Provide a detailed explanation of the calculation process in the \`calculationDetails\` field. This explanation MUST reflect how the Temperature Range influenced the calculations. If a user-selected diameter was provided, the details should cover calculations for both the overall optimal dimensions and the dimensions for the user-selected diameter. Otherwise, just explain the overall optimal calculation. Be concise.

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
    const response = await prompt(input);
    const output = response.output;

    if (!output) {
      console.error(
        'Genkit prompt did not return a valid output. Full response:',
        JSON.stringify(response, null, 2)
      );
      let reasonMessage = 'El modelo no produjo una salida válida que coincida con el esquema.';
      if (response.candidates && response.candidates.length > 0) {
        const topCandidate = response.candidates[0];
        if (topCandidate.finishReason && topCandidate.finishReason !== 'STOP' && topCandidate.finishReason !== 'UNKNOWN' && topCandidate.finishReason !== 'UNSPECIFIED') {
          reasonMessage += ` Razón de finalización: ${topCandidate.finishReason}.`;
        }
        if (topCandidate.finishMessage) {
          reasonMessage += ` Mensaje de finalización: "${topCandidate.finishMessage}".`;
        }
        if (topCandidate.safetyRatings && topCandidate.safetyRatings.some(r => r.blocked)) {
            const blockedCategories = topCandidate.safetyRatings
                .filter(rating => rating.blocked)
                .map(rating => rating.category);
            if (blockedCategories.length > 0) {
                reasonMessage += ` Contenido bloqueado debido a categorías de seguridad: ${blockedCategories.join(', ')}.`;
            }
        }
      }
      throw new Error(reasonMessage);
    }
    return output;
  }
);
