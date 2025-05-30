
import type { CalculateCapillaryTubeOutput } from '@/ai/flows/calculate-capillary-tube';
import type { CalculateCapillaryTubeInput } from '@/lib/schemas';

export function exportCalculationResults(
  inputs: CalculateCapillaryTubeInput,
  results: CalculateCapillaryTubeOutput
): void {
  let temperatureRangeText = '';
  if (inputs.temperatureRange === 'refrigeracion') {
    temperatureRangeText = 'Refrigeración (0°C a 5°C)';
  } else if (inputs.temperatureRange === 'congelacion') {
    temperatureRangeText = 'Congelación (-18°C a -25°C)';
  }


  let content = `
Resultados de Calculadora Capilar
==================================

Entradas:
---------
Potencia del Compresor: ${inputs.compressorPowerWatts} W
Tipo de Refrigerante: ${inputs.refrigerantType.toUpperCase()}
Rango de Temperatura: ${temperatureRangeText}
`;

  if (inputs.selectedCapillaryTubeInternalDiameterMillimeters) {
    content += `Diámetro Seleccionado por Usuario: ${inputs.selectedCapillaryTubeInternalDiameterMillimeters.toFixed(2)} mm\n`;
  }

  content += `
Resultados:
-----------
Dimensiones Óptimas Generales:
  Longitud: ${results.overallOptimal.lengthMeters.toFixed(3)} m
  Diámetro Interno: ${results.overallOptimal.internalDiameterMillimeters.toFixed(2)} mm
`;

  if (results.selectedDiameterCalculation && inputs.selectedCapillaryTubeInternalDiameterMillimeters) {
    content += `
Para Diámetro Seleccionado por Usuario (${results.selectedDiameterCalculation.inputDiameterMillimeters.toFixed(2)} mm):
  Longitud Óptima Calculada: ${results.selectedDiameterCalculation.optimalLengthMeters.toFixed(3)} m
`;
  }

  content += `
Detalles del Cálculo:
---------------------
${results.calculationDetails}
  `.trim();

  const blob = new Blob([content.replace(/\n{3,}/g, '\n\n')], { type: 'text/plain;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'resultados-calculadora-capilar.txt';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}
