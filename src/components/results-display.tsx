
'use client';

import type * as React from 'react';
import type { CalculateCapillaryTubeOutput } from '@/ai/flows/calculate-capillary-tube';
import type { CalculateCapillaryTubeInput } from '@/lib/schemas';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { exportCalculationResults } from '@/lib/export';
import { Download, Ruler, CircleDot, FileText, ThermometerSnowflake } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface ResultsDisplayProps {
  results: CalculateCapillaryTubeOutput | null;
  inputs: CalculateCapillaryTubeInput | null;
  isLoading: boolean;
}

export function ResultsDisplay({ results, inputs, isLoading }: ResultsDisplayProps) {
  if (isLoading) {
    return (
      <Card className="w-full shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Resultados del Cálculo</CardTitle>
          <CardDescription>Las dimensiones óptimas aparecerán aquí.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Skeleton className="h-6 w-1/2 mb-2" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-1/3" />
              <Skeleton className="h-8 w-1/2" />
            </div>
            <div className="space-y-2 mt-1">
              <Skeleton className="h-5 w-2/5" />
              <Skeleton className="h-8 w-1/2" />
            </div>
          </div>
          <Skeleton className="h-px w-full" />
           <div>
            <Skeleton className="h-6 w-3/4 mb-2" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-1/3" />
              <Skeleton className="h-8 w-1/2" />
            </div>
             <div className="space-y-2 mt-1">
              <Skeleton className="h-5 w-2/5" />
              <Skeleton className="h-8 w-1/2" />
            </div>
          </div>
          <div className="space-y-2">
            <Skeleton className="h-5 w-1/4" />
            <Skeleton className="h-20 w-full" />
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full text-base py-6" disabled>
            <Download className="mr-2 h-5 w-5" />
            Exportar Resultados
          </Button>
        </CardFooter>
      </Card>
    );
  }

  if (!results || !inputs) {
    return null; // Don't render if no results and not loading (initial state)
  }

  const handleExport = () => {
    if (inputs && results) {
      exportCalculationResults(inputs, results);
    }
  };

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Resultados del Cálculo</CardTitle>
        <CardDescription>Dimensiones basadas en tus entradas.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2 flex items-center">
            <ThermometerSnowflake className="mr-2 h-5 w-5 text-accent" />
            Dimensiones Óptimas Generales
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <h4 className="flex items-center text-sm font-medium text-muted-foreground mb-1">
                <Ruler className="mr-2 h-4 w-4 text-primary" />
                Longitud Óptima
              </h4>
              <p className="text-xl font-semibold">{results.overallOptimal.lengthMeters.toFixed(3)} m</p>
            </div>
            <div>
              <h4 className="flex items-center text-sm font-medium text-muted-foreground mb-1">
                <CircleDot className="mr-2 h-4 w-4 text-primary" />
                Diámetro Interno Óptimo
              </h4>
              <p className="text-xl font-semibold">{results.overallOptimal.internalDiameterMillimeters.toFixed(2)} mm</p>
            </div>
          </div>
        </div>

        {results.selectedDiameterCalculation && inputs.selectedCapillaryTubeInternalDiameterMillimeters && (
          <>
            <Separator />
            <div>
              <h3 className="text-lg font-semibold mb-2 flex items-center">
                <ThermometerSnowflake className="mr-2 h-5 w-5 text-accent" />
                Para Tu Diámetro Seleccionado ({inputs.selectedCapillaryTubeInternalDiameterMillimeters.toFixed(2)} mm)
              </h3>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h4 className="flex items-center text-sm font-medium text-muted-foreground mb-1">
                    <CircleDot className="mr-2 h-4 w-4 text-primary" />
                    Diámetro Interno Seleccionado
                  </h4>
                  <p className="text-xl font-semibold">{results.selectedDiameterCalculation.inputDiameterMillimeters.toFixed(2)} mm</p>
                </div>
                <div>
                  <h4 className="flex items-center text-sm font-medium text-muted-foreground mb-1">
                    <Ruler className="mr-2 h-4 w-4 text-primary" />
                    Longitud Óptima Calculada
                  </h4>
                  <p className="text-xl font-semibold">{results.selectedDiameterCalculation.optimalLengthMeters.toFixed(3)} m</p>
                </div>
              </div>
            </div>
          </>
        )}
        
        <Separator />
        <div>
          <h3 className="flex items-center text-lg font-semibold mb-1">
            <FileText className="mr-2 h-5 w-5 text-accent" />
            Detalles del Cálculo
          </h3>
          <p className="text-sm whitespace-pre-wrap bg-muted/50 p-3 rounded-md">{results.calculationDetails}</p>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleExport} className="w-full text-base py-6">
          <Download className="mr-2 h-5 w-5" />
          Exportar Resultados
        </Button>
      </CardFooter>
    </Card>
  );
}
