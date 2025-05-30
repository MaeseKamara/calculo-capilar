
'use client';

import type * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CalculateCapillaryTubeInputSchema, type CalculateCapillaryTubeInput, type TemperatureRange } from '@/lib/schemas';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription as FormDesc, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Zap, FlaskConical, Loader2, ThermometerSnowflake, Thermometer } from 'lucide-react';

interface CapillaryCalcFormProps {
  onSubmit: (data: CalculateCapillaryTubeInput) => Promise<void>;
  isLoading: boolean;
}

const refrigerantTypes = ['r134a', 'r404a', 'r290', 'r600'] as const;
const temperatureRanges: { value: TemperatureRange; label: string; icon: React.ElementType }[] = [
  { value: 'refrigeracion', label: 'Refrigeración (0°C a 5°C)', icon: Thermometer },
  { value: 'congelacion', label: 'Congelación (-18°C a -25°C)', icon: ThermometerSnowflake },
];

export function CapillaryCalcForm({ onSubmit, isLoading }: CapillaryCalcFormProps) {
  const form = useForm<CalculateCapillaryTubeInput>({
    resolver: zodResolver(CalculateCapillaryTubeInputSchema),
    defaultValues: {
      compressorPowerWatts: 100,
      refrigerantType: 'r134a',
      temperatureRange: 'refrigeracion',
      selectedCapillaryTubeInternalDiameterMillimeters: undefined,
    },
  });

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Parámetros de Entrada</CardTitle>
        <CardDescription>Ingresa los detalles a continuación para calcular las dimensiones del tubo capilar.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="compressorPowerWatts"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    <Zap className="mr-2 h-5 w-5 text-primary" />
                    Potencia del Compresor (Vatios)
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="ej., 150"
                      {...field}
                      value={field.value === undefined ? '' : field.value}
                      onChange={e => {
                        const value = e.target.value;
                        field.onChange(value === '' ? undefined : parseFloat(value));
                      }}
                      className="text-base"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="refrigerantType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    <FlaskConical className="mr-2 h-5 w-5 text-primary" />
                    Tipo de Refrigerante
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="text-base">
                        <SelectValue placeholder="Selecciona refrigerante" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {refrigerantTypes.map((type) => (
                        <SelectItem key={type} value={type} className="text-base">
                          {type.toUpperCase()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="temperatureRange"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                     {/* Dynamically render icon based on selected value */}
                    {field.value === 'congelacion' ? 
                      <ThermometerSnowflake className="mr-2 h-5 w-5 text-primary" /> : 
                      <Thermometer className="mr-2 h-5 w-5 text-primary" />
                    }
                    Rango de Temperatura de Operación
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="text-base">
                        <SelectValue placeholder="Selecciona rango de temperatura" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {temperatureRanges.map((range) => (
                        <SelectItem key={range.value} value={range.value} className="text-base">
                          <div className="flex items-center">
                            <range.icon className="mr-2 h-4 w-4" />
                            {range.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="selectedCapillaryTubeInternalDiameterMillimeters"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-ruler mr-2 text-primary"><path d="M20.42 4.58a2.1 2.1 0 0 0-2.92 0L4.58 17.5a2.06 2.06 0 0 0 0 2.92 2.06 2.06 0 0 0 2.92 0L17.5 7.5a2.1 2.1 0 0 0 0-2.92Zm0 0L16 3m4.42 1.58L19 6M3 16l4 4M16 3l-1.5 1.5M7.5 17.5L6 19M17.5 7.5l-1.5 1.5"/></svg>
                    Diámetro de Capilar Seleccionado (mm) (Opcional)
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="ej., 0.8"
                      {...field}
                      value={field.value === undefined ? '' : field.value}
                      onChange={e => {
                        const value = e.target.value;
                        if (value === '') {
                          field.onChange(undefined); 
                        } else {
                          const numValue = parseFloat(value);
                          field.onChange(isNaN(numValue) ? undefined : numValue); 
                        }
                      }}
                      className="text-base"
                      step="0.01"
                    />
                  </FormControl>
                  <FormDesc>
                    Si tienes un diámetro de tubo capilar específico, ingrésalo aquí. La IA calculará la longitud óptima para él.
                  </FormDesc>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full text-base py-6 bg-accent hover:bg-accent/90" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Calculando...
                </>
              ) : (
                'Calcular Dimensiones'
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
