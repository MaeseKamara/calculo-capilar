
import type { CalculateCapillaryTubeOutput } from '@/ai/flows/calculate-capillary-tube';
import type { CalculateCapillaryTubeInput } from '@/lib/schemas';


export function exportCalculationResults(
  inputs: CalculateCapillaryTubeInput,
  results: CalculateCapillaryTubeOutput
): void {
  const content = `
Capillary Calc Results
============================

Inputs:
-------
Compressor Power: ${inputs.compressorPowerWatts} W
Refrigerant Type: ${inputs.refrigerantType.toUpperCase()}

Results:
--------
Optimal Capillary Tube Length: ${results.capillaryTubeLengthMeters.toFixed(3)} m
Optimal Capillary Tube Internal Diameter: ${results.capillaryTubeInternalDiameterMillimeters.toFixed(2)} mm

Calculation Details:
--------------------
${results.calculationDetails}
  `.trim();

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'capillary-calc-results.txt';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}
