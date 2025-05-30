
'use client';

import * as React from 'react';
import { useState } from 'react';
import { CapillaryCalcForm } from '@/components/capillary-calc-form';
import { ResultsDisplay } from '@/components/results-display';
import { handleCalculateCapillaryTube } from '@/app/actions';
import type { CalculateCapillaryTubeOutput } from '@/ai/flows/calculate-capillary-tube';
import type { CalculateCapillaryTubeInput } from '@/lib/schemas';
import { useToast } from '@/hooks/use-toast';
import { Calculator } from 'lucide-react';

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [resultsData, setResultsData] = useState<CalculateCapillaryTubeOutput | null>(null);
  const [formData, setFormData] = useState<CalculateCapillaryTubeInput | null>(null);
  const { toast } = useToast();

  const handleFormSubmit = async (data: CalculateCapillaryTubeInput) => {
    setIsLoading(true);
    setResultsData(null); // Clear previous results
    setFormData(data); // Store current form data for export

    try {
      const result = await handleCalculateCapillaryTube(data);
      setResultsData(result);
      toast({
        title: "Cálculo Exitoso",
        description: "Las dimensiones del tubo capilar han sido calculadas.",
      });
    } catch (error) {
      console.error("Calculation error:", error);
      const errorMessage = error instanceof Error ? error.message : "Ocurrió un error desconocido.";
      toast({
        variant: "destructive",
        title: "Cálculo Fallido",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="container mx-auto px-4 py-8 md:px-8 md:py-12 flex flex-col items-center min-h-screen">
      <div className="flex items-center space-x-3 mb-10">
        <Calculator className="h-10 w-10 text-primary" />
        <h1 className="text-4xl font-bold tracking-tight">Calculadora Capilar</h1>
      </div>
      <div className="w-full max-w-xl space-y-8">
        <CapillaryCalcForm onSubmit={handleFormSubmit} isLoading={isLoading} />
        {(isLoading || resultsData) && (
           <ResultsDisplay results={resultsData} inputs={formData} isLoading={isLoading} />
        )}
      </div>
       <footer className="mt-12 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Calculadora Capilar. Todos los derechos reservados.</p>
        <p>Desarrollado con Firebase y Genkit AI.</p>
      </footer>
    </main>
  );
}
