
'use client';

import type * as React from 'react';
import type { CalculateCapillaryTubeOutput } from '@/ai/flows/calculate-capillary-tube';
import type { CalculateCapillaryTubeInput } from '@/lib/schemas';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { exportCalculationResults } from '@/lib/export';
import { Download, Ruler, CircleDot, FileText } from 'lucide-react';

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
          <CardTitle className="text-2xl">Calculation Results</CardTitle>
          <CardDescription>Optimal dimensions will appear here.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-5 w-1/3" />
            <Skeleton className="h-8 w-1/2" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-5 w-2/5" />
            <Skeleton className="h-8 w-1/2" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-5 w-1/4" />
            <Skeleton className="h-20 w-full" />
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full text-base py-6" disabled>
            <Download className="mr-2 h-5 w-5" />
            Export Results
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
        <CardTitle className="text-2xl">Calculation Results</CardTitle>
        <CardDescription>Optimal dimensions based on your inputs.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="flex items-center text-sm font-medium text-muted-foreground mb-1">
            <Ruler className="mr-2 h-4 w-4 text-primary" />
            Optimal Capillary Tube Length
          </h3>
          <p className="text-2xl font-semibold">{results.capillaryTubeLengthMeters.toFixed(3)} m</p>
        </div>
        <div>
          <h3 className="flex items-center text-sm font-medium text-muted-foreground mb-1">
            <CircleDot className="mr-2 h-4 w-4 text-primary" />
            Optimal Capillary Tube Internal Diameter
          </h3>
          <p className="text-2xl font-semibold">{results.capillaryTubeInternalDiameterMillimeters.toFixed(2)} mm</p>
        </div>
        <div>
          <h3 className="flex items-center text-sm font-medium text-muted-foreground mb-1">
            <FileText className="mr-2 h-4 w-4 text-primary" />
            Calculation Details
          </h3>
          <p className="text-sm whitespace-pre-wrap bg-muted/50 p-3 rounded-md">{results.calculationDetails}</p>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleExport} className="w-full text-base py-6">
          <Download className="mr-2 h-5 w-5" />
          Export Results
        </Button>
      </CardFooter>
    </Card>
  );
}
