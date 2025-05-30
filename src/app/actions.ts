
'use server';

import { calculateCapillaryTubeDimensions, type CalculateCapillaryTubeOutput } from '@/ai/flows/calculate-capillary-tube';
import type { CalculateCapillaryTubeInput } from '@/lib/schemas';

export async function handleCalculateCapillaryTube(
  data: CalculateCapillaryTubeInput
): Promise<CalculateCapillaryTubeOutput> {
  try {
    const result = await calculateCapillaryTubeDimensions(data);
    return result;
  } catch (error) {
    console.error('Error in GenAI calculation:');
    let errorMessage = 'Failed to calculate capillary tube dimensions. Please try again.';

    if (error instanceof Error) {
      console.error('Error Name:', error.name);
      console.error('Error Message:', error.message);
      console.error('Error Stack:', error.stack);
      errorMessage = error.message; // Use the specific error message from the caught error
    } else {
      console.error('Non-Error object thrown:', error);
    }

    // Log additional details if available (e.g., from Genkit or API responses)
    if (error && typeof error === 'object') {
      if ('details' in error || 'response' in error || 'status' in error || 'code' in error) {
        console.error('Additional error details:', JSON.stringify(error, null, 2));
      }
    }
    // Ensure the user gets a more informative message to check logs
    throw new Error(`${errorMessage} Check server logs for more details.`);
  }
}

