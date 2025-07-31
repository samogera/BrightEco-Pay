
'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { TrendingUp, Users, Home, Zap, RefreshCcw } from 'lucide-react';
import { Separator } from '../ui/separator';
import Link from 'next/link';

// Constants for calculation
const KES_PER_KWH = 25; // Average cost of grid electricity in KES per kWh
const SOLAR_GENERATION_PER_SQM_PER_DAY = 0.5; // Estimated kWh generated per sq meter of panel per day
const KG_CO2_PER_KWH = 0.5; // Estimated CO2 reduction per kWh from grid

const initialValues = {
  monthlyBill: 2000,
  roofSpace: 20,
};

export function SolarSavingsCalculator() {
  const [monthlyBill, setMonthlyBill] = useState(initialValues.monthlyBill);
  const [roofSpace, setRoofSpace] = useState(initialValues.roofSpace);
  const [showResults, setShowResults] = useState(false);

  const results = useMemo(() => {
    // Estimate daily usage from bill
    const dailyUsageKWh = monthlyBill / KES_PER_KWH / 30;
    
    // Calculate what the solar panels can generate
    const dailySolarGeneration = roofSpace * SOLAR_GENERATION_PER_SQM_PER_DAY;
    
    // The effective solar usage is the lesser of what's needed vs what's generated
    const effectiveDailyKWh = Math.min(dailyUsageKWh, dailySolarGeneration);

    const yearlySavings = effectiveDailyKWh * 30 * 12 * KES_PER_KWH;
    const carbonReduction = effectiveDailyKWh * 365 * KG_CO2_PER_KWH;
    const numberOfPanels = Math.ceil(dailySolarGeneration / 2); // Assuming 2kWh/day/panel

    return {
      panels: numberOfPanels,
      savings: yearlySavings,
      co2: carbonReduction,
    };
  }, [monthlyBill, roofSpace]);

  const handleCalculate = () => {
    if(monthlyBill > 0 && roofSpace > 0) {
      setShowResults(true);
    }
  };
  
  const handleReset = () => {
    setMonthlyBill(initialValues.monthlyBill);
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
               See how much you can save with BrightEco Pay solar. Enter your details to get an instant estimate.
            </p>
        </div>

        <Card className="bg-card/90 backdrop-blur-sm p-4 md:p-8 border-primary/20 shadow-lg">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                <div className="space-y-6">
                    <div>
                        <Label htmlFor="bill" className="text-base font-medium">
                            <Zap className="inline-block mr-2 text-primary" />
                            What's your current monthly electricity bill?
                        </Label>
                        <div className="flex items-center gap-2 mt-2">
                           <span className="text-lg font-semibold text-muted-foreground">KES</span>
                           <Input id="bill" type="number" value={monthlyBill} onChange={(e) => setMonthlyBill(Number(e.target.value))} className="text-lg font-bold" />
                        </div>
                    </div>
                     <div>
                        <Label htmlFor="roof" className="text-base font-medium">
                           <Home className="inline-block mr-2 text-primary" />
                           How much roof space do you have?
                        </Label>
                        <div className="flex items-center gap-2 mt-2">
                           <Input id="roof" type="number" value={roofSpace} onChange={(e) => setRoofSpace(Number(e.target.value))} className="text-lg font-bold" />
                           <span className="text-lg font-semibold text-muted-foreground">m²</span>
                        </div>
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
                    <h3 className="font-headline text-2xl mb-4">Your Estimated Yearly Savings</h3>
                    {showResults ? (
                        <div className="space-y-4">
                           <p className="text-5xl font-bold text-primary">KES {results.savings.toLocaleString('en-US', { maximumFractionDigits: 0 })}</p>
                            <Separator className="my-4" />
                            <div className="grid grid-cols-2 gap-4 text-left">
                                <div>
                                    <p className="text-muted-foreground font-semibold">Recommended Panels</p>
                                    <p className="text-xl font-bold text-foreground">{results.panels}</p>
                                </div>
                                 <div>
                                    <p className="text-muted-foreground font-semibold">CO₂ Reduction / Year</p>
                                    <p className="text-xl font-bold text-foreground">{results.co2.toFixed(0)} kg</p>
                                </div>
                            </div>
                             <p className="text-xs text-muted-foreground pt-4">
                                Estimates are approximate. <Link href="/dashboard/support" className="underline text-primary">Contact us</Link> for a detailed quote.
                            </p>
                        </div>
                    ) : (
                         <p className="text-muted-foreground py-12">Enter your details and click "Calculate" to see your potential results.</p>
                    )}
                </div>
            </div>
        </Card>
    </div>
  );
}
