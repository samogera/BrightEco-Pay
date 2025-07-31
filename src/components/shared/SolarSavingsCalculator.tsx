
'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TrendingUp, Zap, Leaf, RefreshCcw, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Separator } from '../ui/separator';

// Simplified recommendation logic based on monthly bill
const getRecommendation = (bill: number) => {
  if (bill <= 1500) return { kit: '50W Basic Kit', savings: bill * 0.20 };
  if (bill <= 3000) return { kit: '100W Standard Kit', savings: bill * 0.25 };
  if (bill <= 5000) return { kit: '200W Plus Kit', savings: bill * 0.30 };
  if (bill <= 8000) return { kit: '350W Premium Kit', savings: bill * 0.35 };
  return { kit: '500W Pro Kit', savings: bill * 0.40 };
};

export function SolarSavingsCalculator() {
  const [monthlyBill, setMonthlyBill] = useState('');
  const [showResults, setShowResults] = useState(false);

  const result = useMemo(() => {
    const bill = Number(monthlyBill);
    if (isNaN(bill) || bill <= 0) return null;
    return getRecommendation(bill);
  }, [monthlyBill]);
  
  const handleCalculate = () => {
    if (Number(monthlyBill) > 0) {
      setShowResults(true);
    }
  }

  const handleReset = () => {
    setMonthlyBill('');
    setShowResults(false);
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="text-center mb-12">
            <h2 className="font-headline text-3xl md:text-4xl font-bold text-accent-foreground/90">
                Solar Savings Calculator
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-muted-foreground mt-4">
               Enter your current monthly electricity bill to see how much you could save with a BrightEco solar system.
            </p>
        </div>

        <Card className="bg-card/90 backdrop-blur-sm p-6 md:p-10 border-primary/20 shadow-lg">
            {!showResults ? (
                 <div className="max-w-md mx-auto space-y-6">
                    <div className="space-y-2 text-center">
                        <Label htmlFor="monthly-bill" className="text-lg font-medium">
                            What's your average monthly electricity bill?
                        </Label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold">KES</span>
                            <Input 
                                id="monthly-bill" 
                                type="number" 
                                value={monthlyBill}
                                onChange={(e) => setMonthlyBill(e.target.value)}
                                placeholder="e.g., 3500"
                                className="h-14 text-2xl font-bold text-center pl-14 pr-4"
                            />
                        </div>
                    </div>
                    <Button onClick={handleCalculate} size="lg" disabled={!monthlyBill || Number(monthlyBill) <= 0} className="w-full h-14 text-lg">
                        <TrendingUp className="mr-2" /> Calculate My Savings
                    </Button>
                </div>
            ) : (
                <div className="text-center">
                    <p className="text-muted-foreground">For a monthly bill of KES {Number(monthlyBill).toLocaleString()}, here is your estimate:</p>
                    <div className="grid md:grid-cols-2 gap-6 my-8 text-left">
                        <Card className="p-6 bg-primary/10 text-center">
                            <CardHeader className="p-0 items-center">
                               <Zap className="h-10 w-10 text-primary mb-2" />
                               <p className="text-sm text-muted-foreground">Recommended Kit</p>
                               <CardTitle className="text-primary text-3xl">{result?.kit}</CardTitle>
                            </CardHeader>
                        </Card>
                         <Card className="p-6 bg-green-500/10 text-center">
                            <CardHeader className="p-0 items-center">
                               <Leaf className="h-10 w-10 text-green-500 mb-2" />
                               <p className="text-sm text-muted-foreground">Estimated Monthly Savings</p>
                               <CardTitle className="text-2xl text-green-600">~KES {result?.savings.toLocaleString(undefined, { maximumFractionDigits: 0 })}</CardTitle>
                            </CardHeader>
                        </Card>
                    </div>
                     <Separator className="my-6"/>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Button size="lg" asChild>
                            <Link href="/dashboard/support">
                                Get Started with this Plan <ArrowRight className="ml-2" />
                            </Link>
                        </Button>
                        <Button onClick={handleReset} size="lg" variant="outline">
                            <RefreshCcw className="mr-2 h-4 w-4"/> Calculate Again
                        </Button>
                    </div>
                     <p className="text-xs text-muted-foreground mt-6">
                        Disclaimer: This is an estimate based on your bill. Actual savings and kit requirements may vary. A detailed quote will be provided after a site assessment.
                    </p>
                </div>
            )}
        </Card>
    </div>
  );
}
