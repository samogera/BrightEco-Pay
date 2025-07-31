
'use client';

import { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { TrendingUp, Zap, Lightbulb, Tv, Smartphone, Refrigerator, RefreshCcw, ArrowRight, CheckCircle, Fan, Router, Laptop } from 'lucide-react';
import Link from 'next/link';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { cn } from '@/lib/utils';
import { Checkbox } from '../ui/checkbox';
import { Separator } from '../ui/separator';

const applianceOptions = [
  { id: 'lights', label: 'Lighting', icon: Lightbulb, power: 20 },
  { id: 'tv', label: 'Television', icon: Tv, power: 100 },
  { id: 'phone', label: 'Phone Charging', icon: Smartphone, power: 10 },
  { id: 'fridge', label: 'Small Fridge', icon: Refrigerator, power: 150 },
  { id: 'fan', label: 'Fan', icon: Fan, power: 60 },
  { id: 'router', label: 'Wi-Fi Router', icon: Router, power: 15 },
  { id: 'laptop', label: 'Laptop', icon: Laptop, power: 50 },
];

const usageOptions = [
  { id: 'low', label: '< 4 hours', hours: 3 },
  { id: 'medium', label: '4-8 hours', hours: 6 },
  { id: 'high', label: '8+ hours', hours: 10 },
];

// Simplified recommendation logic based on total power consumption
const getRecommendation = (totalPower: number) => {
  if (totalPower <= 50) return { kit: '50W Basic', payment: 850, coverage: 'basic lighting and charging' };
  if (totalPower <= 100) return { kit: '100W Standard', payment: 1500, coverage: 'lights, phone, and a small TV' };
  if (totalPower <= 200) return { kit: '200W Plus', payment: 3000, coverage: 'TV, lights, fan, and multiple devices' };
  if (totalPower <= 350) return { kit: '350W Premium', payment: 4800, coverage: 'powering small fridges and more' };
  if (totalPower <= 500) return { kit: '500W Pro', payment: 7000, coverage: 'a complete home power solution' };
  return { kit: '600W+ Pro', payment: 8500, coverage: 'heavy usage and multiple large appliances' };
};

type UsageHours = 'low' | 'medium' | 'high';

export function SolarSavingsCalculator() {
  const [selectedAppliances, setSelectedAppliances] = useState<string[]>([]);
  const [usageHours, setUsageHours] = useState<UsageHours | null>(null);
  const [showResults, setShowResults] = useState(false);

  const handleApplianceChange = (applianceId: string) => {
    setSelectedAppliances(prev =>
      prev.includes(applianceId)
        ? prev.filter(id => id !== applianceId)
        : [...prev, applianceId]
    );
  };

  const totalPowerConsumption = useMemo(() => {
    const selectedPower = selectedAppliances.reduce((total, id) => {
      const appliance = applianceOptions.find(a => a.id === id);
      return total + (appliance?.power || 0);
    }, 0);
    
    const usageMultiplier = usageHours ? usageOptions.find(u => u.id === usageHours)!.hours / 6 : 1;
    
    return selectedPower * usageMultiplier;
  }, [selectedAppliances, usageHours]);

  const result = useMemo(() => {
    if (!selectedAppliances.length || !usageHours) return null;
    return getRecommendation(totalPowerConsumption);
  }, [totalPowerConsumption, selectedAppliances, usageHours]);

  const handleCalculate = () => {
    if (selectedAppliances.length > 0 && usageHours) {
      setShowResults(true);
    }
  };
  
  const handleReset = () => {
    setSelectedAppliances([]);
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

        <Card className="bg-card/90 backdrop-blur-sm p-6 md:p-10 border-primary/20 shadow-lg">
            {!showResults ? (
                 <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
                    <div className="space-y-8">
                        <div>
                            <Label className="text-base font-medium block mb-4">
                                What appliances do you want to power?
                            </Label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {applianceOptions.map((opt) => (
                                <Label key={opt.id} htmlFor={opt.id} className={cn(
                                "flex items-center gap-2 rounded-lg border-2 p-3 cursor-pointer transition-all hover:border-primary/80 hover:bg-accent/50",
                                selectedAppliances.includes(opt.id) && "border-primary bg-primary/10 text-primary"
                                )}>
                                <Checkbox id={opt.id} checked={selectedAppliances.includes(opt.id)} onCheckedChange={() => handleApplianceChange(opt.id)} className="h-5 w-5"/>
                                <opt.icon className="h-5 w-5" />
                                <span className="font-semibold text-sm">{opt.label}</span>
                                </Label>
                            ))}
                            </div>
                        </div>
                        <div>
                            <Label className="text-base font-medium block mb-4">
                            How many hours per day do you need power?
                            </Label>
                            <RadioGroup value={usageHours || ''} onValueChange={(value: UsageHours) => setUsageHours(value)} className="flex flex-col sm:flex-row gap-3">
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

                    <div className="flex items-center justify-center rounded-2xl bg-muted/50 p-8">
                        <div className="text-center space-y-4">
                             <TrendingUp className="mx-auto h-12 w-12 text-primary" />
                            <h3 className="text-xl font-headline">Your Recommendation Awaits</h3>
                            <p className="text-muted-foreground">Select your needs on the left to get a personalized solar plan.</p>
                            <Button onClick={handleCalculate} size="lg" disabled={!selectedAppliances.length || !usageHours} className="w-full">
                                <CheckCircle className="mr-2" /> Calculate My Plan
                            </Button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-center">
                    <h3 className="text-2xl font-headline font-bold">Your Personalized Recommendation</h3>
                    <p className="text-muted-foreground mt-2">Based on your selections, here's the ideal plan for your home.</p>
                    <div className="grid md:grid-cols-3 gap-6 my-8 text-left">
                        <Card className="p-6 bg-primary/5">
                            <CardHeader className="p-0">
                               <p className="text-sm text-muted-foreground">Recommended Kit</p>
                               <CardTitle className="text-primary text-3xl">{result?.kit}</CardTitle>
                            </CardHeader>
                        </Card>
                         <Card className="p-6 bg-muted/50">
                            <CardHeader className="p-0">
                               <p className="text-sm text-muted-foreground">Est. Monthly PAYG Payment</p>
                               <CardTitle className="text-2xl">KES {result?.payment.toLocaleString()}</CardTitle>
                            </CardHeader>
                        </Card>
                         <Card className="p-6 bg-muted/50">
                            <CardHeader className="p-0">
                               <p className="text-sm text-muted-foreground">Energy Coverage</p>
                               <CardTitle className="text-lg">Powers {result?.coverage}</CardTitle>
                            </CardHeader>
                        </Card>
                    </div>
                     <Separator className="my-6"/>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Button size="lg" asChild>
                            <Link href="/signup">
                            Get Started with this Plan <ArrowRight className="ml-2" />
                            </Link>
                        </Button>
                        <Button onClick={handleReset} size="lg" variant="outline">
                            <RefreshCcw className="mr-2 h-4 w-4"/> Start Over
                        </Button>
                    </div>
                     <p className="text-xs text-muted-foreground mt-6">
                        Disclaimer: This is an estimate based on your selections. Actual performance and costs may vary. A detailed quote will be provided after a site assessment.
                    </p>
                </div>
            )}
        </Card>
    </div>
  );
}
