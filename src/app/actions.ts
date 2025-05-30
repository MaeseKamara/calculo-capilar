
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
    console.error('Error in GenAI calculation:', error);
    throw new Error('Failed to calculate capillary tube dimensions. Please try again.');
  }
}
