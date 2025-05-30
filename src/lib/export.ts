
import type { CalculateCapillaryTubeOutput } from '@/ai/flows/calculate-capillary-tube';
import type { CalculateCapillaryTubeInput } from '@/lib/schemas';

export function exportCalculationResults(
  inputs: CalculateCapillaryTubeInput,
  results: CalculateCapillaryTubeOutput
): void {
  let content = `
Capillary Calc Results
============================

Inputs:
-------
Compressor Power: ${inputs.compressorPowerWatts} W
Refrigerant Type: ${inputs.refrigerantType.toUpperCase()}
`;

  if (inputs.selectedCapillaryTubeInternalDiameterMillimeters) {
    content += `User Selected Diameter: ${inputs.selectedCapillaryTubeInternalDiameterMillimeters.toFixed(2)} mm\n`;
  }

  content += `
Results:
--------
Overall Optimal Dimensions:
  Length: ${results.overallOptimal.lengthMeters.toFixed(3)} m
  Internal Diameter: ${results.overallOptimal.internalDiameterMillimeters.toFixed(2)} mm
`;

  if (results.selectedDiameterCalculation && inputs.selectedCapillaryTubeInternalDiameterMillimeters) {
    content += `
For User Selected Diameter (${results.selectedDiameterCalculation.inputDiameterMillimeters.toFixed(2)} mm):
  Calculated Optimal Length: ${results.selectedDiameterCalculation.optimalLengthMeters.toFixed(3)} m
`;
  }

  content += `
Calculation Details:
--------------------
${results.calculationDetails}
  `.trim();

  const blob = new Blob([content.replace(/\n{3,}/g, '\n\n')], { type: 'text/plain;charset=utf-8' }); // Replace triple newlines
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'capillary-calc-results.txt';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}
