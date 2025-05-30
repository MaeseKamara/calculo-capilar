
// src/ai/flows/calculate-capillary-tube.ts
'use server';

/**
 * @fileOverview Capillary tube dimension calculation flow.
 *
 * This file defines a Genkit flow to calculate:
 * 1. The overall optimal capillary tube dimensions (length and diameter).
 * 2. If a specific diameter is provided by the user, the optimal length for that diameter.
 * All calculations consider the specified temperature range and a fixed ambient temperature of 35°C.
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
  prompt: `Eres un ingeniero experto en refrigeración.

Calcularás las dimensiones del tubo capilar para un sistema de refrigeración.

Entradas:
Potencia del Compresor: {{{compressorPowerWatts}}} vatios
Tipo de Refrigerante: {{{refrigerantType}}}
Rango de Temperatura de Operación: {{{temperatureRange}}} (donde 'refrigeracion' significa 0°C a 5°C y 'congelacion' significa -18°C a -25°C)
{{#if selectedCapillaryTubeInternalDiameterMillimeters}}
Diámetro Interno Seleccionado por el Usuario: {{{selectedCapillaryTubeInternalDiameterMillimeters}}} mm
{{/if}}

Consideraciones Adicionales:
DEBES considerar una temperatura ambiente de 35°C para todos los cálculos.
DEBES considerar el Rango de Temperatura de Operación especificado en todos tus cálculos.

Cálculos:
1.  **Dimensiones Óptimas Generales:**
    Calcula la longitud (en metros) y el diámetro interno (en milímetros) óptimos generales del tubo capilar.
    Rellena el objeto \`overallOptimal\` en la salida con \`lengthMeters\` y \`internalDiameterMillimeters\`.

{{#if selectedCapillaryTubeInternalDiameterMillimeters}}
2.  **Longitud para el Diámetro Seleccionado:**
    Dado el Diámetro Interno Seleccionado por el Usuario de {{{selectedCapillaryTubeInternalDiameterMillimeters}}} mm, calcula la longitud óptima del tubo capilar (en metros) para ESTE diámetro específico.
    Rellena el objeto \`selectedDiameterCalculation\` en la salida con esta \`optimalLengthMeters\` y establece \`inputDiameterMillimeters\` a {{{selectedCapillaryTubeInternalDiameterMillimeters}}}.
{{else}}
    <!-- Si el usuario no seleccionó un diámetro específico, el campo 'selectedDiameterCalculation' en el JSON de salida debe omitirse. No lo incluyas. -->
{{/if}}

Proporciona una explicación detallada del proceso de cálculo en el campo \`calculationDetails\`. Esta explicación DEBE estar en ESPAÑOL y reflejar cómo el Rango de Temperatura de Operación y la temperatura ambiente de 35°C influyeron en los cálculos. Si se proporcionó un diámetro seleccionado por el usuario, los detalles deben cubrir los cálculos tanto para las dimensiones óptimas generales como para las dimensiones del diámetro seleccionado por el usuario. De lo contrario, solo explica el cálculo óptimo general. Sé conciso.

Asegúrate de que la salida sea un JSON válido que coincida con el esquema.
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
