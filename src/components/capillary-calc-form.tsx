
'use client';

import type * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CalculateCapillaryTubeInputSchema, type CalculateCapillaryTubeInput } from '@/lib/schemas';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription as FormDesc, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Zap, FlaskConical, Loader2, ThermometerSnowflake } from 'lucide-react';

interface CapillaryCalcFormProps {
  onSubmit: (data: CalculateCapillaryTubeInput) => Promise<void>;
  isLoading: boolean;
}

const refrigerantTypes = ['r134a', 'r404a', 'r290', 'r600'] as const;

export function CapillaryCalcForm({ onSubmit, isLoading }: CapillaryCalcFormProps) {
  const form = useForm<CalculateCapillaryTubeInput>({
    resolver: zodResolver(CalculateCapillaryTubeInputSchema),
    defaultValues: {
      compressorPowerWatts: 100,
      refrigerantType: 'r134a',
      selectedCapillaryTubeInternalDiameterMillimeters: undefined,
    },
  });

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Input Parameters</CardTitle>
        <CardDescription>Enter the details below to calculate capillary tube dimensions.</CardDescription>
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
                    Compressor Power (Watts)
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="e.g., 150"
                      {...field}
                      onChange={e => {
                        const value = e.target.value;
                        // Allow clearing the input, which parseFloat would turn to NaN
                        // Zod validation will catch empty or non-positive values
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
                    Refrigerant Type
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="text-base">
                        <SelectValue placeholder="Select refrigerant" />
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
              name="selectedCapillaryTubeInternalDiameterMillimeters"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    <ThermometerSnowflake className="mr-2 h-5 w-5 text-primary" />
                    Selected Capillary Diameter (mm) (Optional)
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="e.g., 0.8"
                      {...field}
                      value={field.value === undefined ? '' : field.value} // Ensure value is never undefined for the input element
                      onChange={e => {
                        const value = e.target.value;
                        if (value === '') {
                          field.onChange(undefined); // Inform react-hook-form it's undefined
                        } else {
                          const numValue = parseFloat(value);
                          field.onChange(isNaN(numValue) ? undefined : numValue); // Store number or undefined
                        }
                      }}
                      className="text-base"
                      step="0.01"
                    />
                  </FormControl>
                  <FormDesc>
                    If you have a specific capillary tube diameter, enter it here. The AI will calculate the optimal length for it.
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
                  Calculating...
                </>
              ) : (
                'Calculate Dimensions'
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
