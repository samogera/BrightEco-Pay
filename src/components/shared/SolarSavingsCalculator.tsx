
'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { TrendingUp, Users, Home, Zap, RefreshCcw } from 'lucide-react';
import { Separator } from '../ui/separator';
import Link from 'next/link';

// Constants for calculation
const PANEL_SIZE_SQM = 2; // Each panel takes up 2 square meters
const KES_PER_KWH_SAVED = 5; // Estimated savings per kWh in KES
const KG_CO2_PER_KWH = 0.5; // Estimated CO2 reduction per kWh

const initialValues = {
  householdSize: 4,
  dailyUsage: 5,
  roofSpace: 20,
};

export function SolarSavingsCalculator() {
  const [householdSize, setHouseholdSize] = useState(initialValues.householdSize);
  const [dailyUsage, setDailyUsage] = useState(initialValues.dailyUsage);
  const [roofSpace, setRoofSpace] = useState(initialValues.roofSpace);
  const [showResults, setShowResults] = useState(false);

  const results = useMemo(() => {
    const numberOfPanels = Math.floor(roofSpace / PANEL_SIZE_SQM);
    const monthlySavings = dailyUsage * 30 * KES_PER_KWH_SAVED;
    const carbonReduction = dailyUsage * 365 * KG_CO2_PER_KWH;

    return {
      panels: numberOfPanels,
      savings: monthlySavings,
      co2: carbonReduction,
    };
  }, [dailyUsage, roofSpace]);

  const handleCalculate = () => {
    setShowResults(true);
  };
  
  const handleReset = () => {
    setHouseholdSize(initialValues.householdSize);
    setDailyUsage(initialValues.dailyUsage);
    setRoofSpace(initialValues.roofSpace);
    setShowResults(false);
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="text-center mb-12">
            <h2 className="font-headline text-3xl md:text-4xl font-bold text-accent-foreground/90">
                Estimate Your Savings
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-muted-foreground mt-4">
               See how much you can save with BrightEco Pay solar. Adjust the sliders to match your home's profile.
            </p>
        </div>

        <Card className="bg-card/90 backdrop-blur-sm p-4 md:p-8 border-primary/20 shadow-lg">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                <div className="space-y-6">
                    <div>
                        <Label htmlFor="household" className="flex justify-between text-base">
                            <span><Users className="inline-block mr-2" />Household Size</span>
                            <span className="font-bold text-primary">{householdSize} people</span>
                        </Label>
                        <Slider id="household" value={[householdSize]} onValueChange={([v]) => setHouseholdSize(v)} max={10} min={1} step={1} className="mt-2" />
                    </div>
                     <div>
                        <Label htmlFor="usage" className="flex justify-between text-base">
                             <span><Zap className="inline-block mr-2" />Average Daily Usage</span>
                            <span className="font-bold text-primary">{dailyUsage} kWh</span>
                        </Label>
                        <Slider id="usage" value={[dailyUsage]} onValueChange={([v]) => setDailyUsage(v)} max={20} min={1} step={1} className="mt-2" />
                    </div>
                     <div>
                        <Label htmlFor="roof" className="flex justify-between text-base">
                           <span><Home className="inline-block mr-2" />Available Roof Space</span>
                           <span className="font-bold text-primary">{roofSpace} m²</span>
                        </Label>
                        <Slider id="roof" value={[roofSpace]} onValueChange={([v]) => setRoofSpace(v)} max={50} min={10} step={1} className="mt-2" />
                    </div>
                    <div className="flex gap-4 !mt-8">
                         <Button onClick={handleCalculate} size="lg" className="w-full">
                            <TrendingUp className="mr-2" />Calculate Savings
                        </Button>
                        <Button onClick={handleReset} size="lg" variant="outline">
                            <RefreshCcw className="mr-2"/> Reset
                        </Button>
                    </div>
                </div>

                <div className="text-center rounded-2xl bg-primary/5 p-8 border-2 border-dashed border-primary/30">
                    <h3 className="font-headline text-2xl mb-4">Your Estimated Results</h3>
                    {showResults ? (
                        <div className="space-y-4">
                            <div>
                                <p className="text-muted-foreground font-semibold">Number of Solar Panels</p>
                                <p className="text-3xl font-bold text-primary">{results.panels}</p>
                            </div>
                            <Separator />
                            <div>
                                <p className="text-muted-foreground font-semibold">Potential Monthly Savings</p>
                                <p className="text-3xl font-bold text-primary">KES {results.savings.toLocaleString()}</p>
                            </div>
                            <Separator />
                            <div>
                                <p className="text-muted-foreground font-semibold">Annual Carbon Reduction</p>
                                <p className="text-3xl font-bold text-primary">{results.co2.toFixed(0)} kg CO₂</p>
                            </div>
                             <p className="text-xs text-muted-foreground pt-4">
                                Estimates are approximate. <Link href="/dashboard/support" className="underline text-primary">Contact us</Link> for a detailed quote.
                            </p>
                        </div>
                    ) : (
                         <p className="text-muted-foreground py-12">Click "Calculate Savings" to see your potential results.</p>
                    )}
                </div>
            </div>
        </Card>
    </div>
  );
}
