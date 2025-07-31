
'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { TrendingUp, Zap, Lightbulb, Tv, Smartphone, Refrigerator, RefreshCcw, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Separator } from '../ui/separator';
import Link from 'next/link';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { cn } from '@/lib/utils';

// Simplified recommendation logic
const recommendations = {
  'lights-only_less-than-4': { kit: '50W Basic', payment: 850, coverage: '4+ hours of lighting and phone charging.' },
  'lights-only_4-8': { kit: '80W Basic', payment: 1100, coverage: '8+ hours of lighting and phone charging.' },
  'lights-only_8+': { kit: '100W Standard', payment: 1500, coverage: 'All-night lighting, plus TV and phone charging.' },
  'lights-tv-phone_less-than-4': { kit: '100W Standard', payment: 1500, coverage: 'Powers lights, TV, and phones for over 4 hours.' },
  'lights-tv-phone_4-8': { kit: '150W Standard', payment: 2200, coverage: 'Powers lights, TV, and phones for over 8 hours.' },
  'lights-tv-phone_8+': { kit: '200W Plus', payment: 3000, coverage: 'Full evening power for lights, TV, phones, and a fan.' },
  'add-fridge-fan_less-than-4': { kit: '250W Plus', payment: 3800, coverage: 'Supports essential appliances and a small fridge.' },
  'add-fridge-fan_4-8': { kit: '300W Premium', payment: 4500, coverage: 'Reliable power for a small fridge, TV, and more.' },
  'add-fridge-fan_8+': { kit: '400W Premium', payment: 5500, coverage: 'Powers multiple appliances including a fridge, all day.' },
  'full-home_less-than-4': { kit: '400W Premium', payment: 5500, coverage: 'Complete home power for moderate usage.' },
  'full-home_4-8': { kit: '500W Pro', payment: 7000, coverage: 'Full home power solution for extended daily use.' },
  'full-home_8+': { kit: '600W Pro', payment: 8500, coverage: 'Ultimate power for a fully electrified home experience.' },
};

const applianceOptions = [
  { id: 'lights-only', label: 'Lights & Phone Charging', icon: Lightbulb },
  { id: 'lights-tv-phone', label: 'Lights, TV & Phones', icon: Tv },
  { id: 'add-fridge-fan', label: 'Add a Fridge or Fan', icon: Refrigerator },
  { id: 'full-home', label: 'Full Home Setup', icon: Zap },
];

const usageOptions = [
  { id: 'less-than-4', label: 'Less than 4 hours' },
  { id: '4-8', label: '4-8 hours' },
  { id: '8+', label: '8+ hours' },
];

type ApplianceSetup = 'lights-only' | 'lights-tv-phone' | 'add-fridge-fan' | 'full-home';
type UsageHours = 'less-than-4' | '4-8' | '8+';


export function SolarSavingsCalculator() {
  const [applianceSetup, setApplianceSetup] = useState<ApplianceSetup | null>(null);
  const [usageHours, setUsageHours] = useState<UsageHours | null>(null);
  const [showResults, setShowResults] = useState(false);

  const result = useMemo(() => {
    if (!applianceSetup || !usageHours) return null;
    const key = `${applianceSetup}_${usageHours}` as keyof typeof recommendations;
    return recommendations[key];
  }, [applianceSetup, usageHours]);

  const handleCalculate = () => {
    if (applianceSetup && usageHours) {
      setShowResults(true);
    }
  };
  
  const handleReset = () => {
    setApplianceSetup(null);
    setUsageHours(null);
    setShowResults(false);
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="text-center mb-12">
            <h2 className="font-headline text-3xl md:text-4xl font-bold text-accent-foreground/90">
                Find Your Perfect Solar Plan
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-muted-foreground mt-4">
               Answer two simple questions to get an instant recommendation for your home.
            </p>
        </div>

        <Card className="bg-card/90 backdrop-blur-sm p-4 md:p-8 border-primary/20 shadow-lg">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                <div className="space-y-8">
                    <div>
                        <Label className="text-base font-medium block mb-4">
                            1. What appliances do you want to power?
                        </Label>
                        <RadioGroup value={applianceSetup || ''} onValueChange={(value: ApplianceSetup) => setApplianceSetup(value)} className="grid grid-cols-2 gap-4">
                          {applianceOptions.map((opt) => (
                            <Label key={opt.id} htmlFor={opt.id} className={cn(
                              "flex flex-col items-center justify-center gap-2 rounded-lg border-2 p-4 cursor-pointer transition-all hover:bg-accent/50",
                              applianceSetup === opt.id && "border-primary bg-primary/10 text-primary"
                            )}>
                              <opt.icon className="h-8 w-8" />
                              <span className="text-center font-semibold text-sm">{opt.label}</span>
                              <RadioGroupItem value={opt.id} id={opt.id} className="sr-only" />
                            </Label>
                          ))}
                        </RadioGroup>
                    </div>
                     <div>
                        <Label className="text-base font-medium block mb-4">
                           2. How many hours per day do you need power?
                        </Label>
                         <RadioGroup value={usageHours || ''} onValueChange={(value: UsageHours) => setUsageHours(value)} className="flex gap-4">
                          {usageOptions.map(opt => (
                            <Label key={opt.id} htmlFor={opt.id} className={cn(
                              "flex-1 text-center rounded-lg border-2 p-4 cursor-pointer transition-all hover:bg-accent/50",
                              usageHours === opt.id && "border-primary bg-primary/10 text-primary"
                            )}>
                              <span className="font-semibold">{opt.label}</span>
                              <RadioGroupItem value={opt.id} id={opt.id} className="sr-only" />
                            </Label>
                          ))}
                        </RadioGroup>
                    </div>
                </div>

                <div className="text-center rounded-2xl bg-muted/50 p-8">
                    {showResults && result ? (
                        <div className="space-y-4">
                           <h3 className="font-headline text-xl text-primary">Your Recommended Plan</h3>
                           <div className="bg-primary text-primary-foreground rounded-lg p-4">
                                <p className="text-lg">Recommended Kit</p>
                                <p className="text-4xl font-bold">{result.kit}</p>
                           </div>
                           <div className="grid grid-cols-2 gap-4 text-left">
                                <div className="bg-card p-3 rounded-md">
                                    <p className="text-sm text-muted-foreground">Est. Monthly Payment</p>
                                    <p className="text-xl font-bold">KES {result.payment.toLocaleString()}</p>
                                </div>
                                 <div className="bg-card p-3 rounded-md">
                                    <p className="text-sm text-muted-foreground">Energy Coverage</p>
                                    <p className="text-md font-bold">{result.coverage}</p>
                                </div>
                            </div>
                             <Button onClick={handleReset} size="sm" variant="ghost">
                                <RefreshCcw className="mr-2 h-4 w-4"/> Reset Calculator
                            </Button>
                        </div>
                    ) : (
                         <div className="flex flex-col items-center justify-center h-full min-h-[200px] space-y-4">
                            <p className="text-muted-foreground text-center">Your personalized recommendation will appear here.</p>
                             <Button onClick={handleCalculate} size="lg" disabled={!applianceSetup || !usageHours}>
                                <CheckCircle2 className="mr-2" /> Show My Plan
                            </Button>
                         </div>
                    )}
                </div>
            </div>
             {showResults && (
                <div className="mt-8 text-center border-t pt-6">
                    <h4 className="font-headline text-lg">Ready to Get Started?</h4>
                    <p className="text-muted-foreground mt-2">Take the next step towards reliable, clean energy for your home.</p>
                     <Button size="lg" asChild className="mt-4">
                        <Link href="/signup">
                           Sign Up Now <ArrowRight className="ml-2" />
                        </Link>
                    </Button>
                </div>
            )}
        </Card>
    </div>
  );
}
