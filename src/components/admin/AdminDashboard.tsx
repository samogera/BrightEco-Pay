'use client';

import {useState} from 'react';
import {Bot, Download, Loader, FileText} from 'lucide-react';

import {generateInsightsDashboard} from '@/ai/flows/generate-insights-dashboard';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardHeader, CardTitle, CardDescription} from '@/components/ui/card';
import {Label} from '@/components/ui/label';
import {Slider} from '@/components/ui/slider';
import {useToast} from '@/hooks/use-toast';

export function AdminDashboard() {
  const {toast} = useToast();
  const [paymentCompliance, setPaymentCompliance] = useState(85);
  const [systemUptime, setSystemUptime] = useState(99);
  const [customerChurnRate, setCustomerChurnRate] = useState(5);
  const [overallRevenue, setOverallRevenue] = useState(5000000);
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState<string | null>(null);

  const handleSubmit = async () => {
    setLoading(true);
    setInsights(null);
    try {
      const result = await generateInsightsDashboard({
        paymentCompliance,
        systemUptime,
        customerChurnRate,
        overallRevenue,
      });
      setInsights(result.dashboardContent);
    } catch (error) {
      console.error('Error generating insights:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate insights. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleDownload = () => {
    if (!insights) return;
    const blob = new Blob([insights.replace(/<br \/>/g, "\n")], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'insights-report.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="font-headline text-xl">
            Adjust KPIs
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="compliance" className="flex justify-between">
              <span>Payment Compliance</span>
              <span className="font-bold text-primary">{paymentCompliance}%</span>
            </Label>
            <Slider
              id="compliance"
              value={[paymentCompliance]}
              onValueChange={([v]) => setPaymentCompliance(v)}
              max={100}
              step={1}
            />
          </div>
          <div className="space-y-3">
            <Label htmlFor="uptime" className="flex justify-between">
              <span>System Uptime</span>
              <span className="font-bold text-primary">{systemUptime}%</span>
            </Label>
            <Slider
              id="uptime"
              value={[systemUptime]}
              onValueChange={([v]) => setSystemUptime(v)}
              max={100}
              step={0.1}
            />
          </div>
          <div className="space-y-3">
            <Label htmlFor="churn" className="flex justify-between">
              <span>Customer Churn Rate</span>
              <span className="font-bold text-primary">{customerChurnRate}%</span>
            </Label>
            <Slider
              id="churn"
              value={[customerChurnRate]}
              onValueChange={([v]) => setCustomerChurnRate(v)}
              max={50}
              step={0.5}
            />
          </div>
          <div className="space-y-3">
            <Label htmlFor="revenue" className="flex justify-between">
              <span>Overall Revenue</span>
              <span className="font-bold text-primary">
                Ksh {overallRevenue.toLocaleString()}
              </span>
            </Label>
            <Slider
              id="revenue"
              value={[overallRevenue]}
              onValueChange={([v]) => setOverallRevenue(v)}
              max={10000000}
              step={10000}
            />
          </div>
          <Button onClick={handleSubmit} disabled={loading} className="w-full">
            {loading ? (
              <Loader className="animate-spin" />
            ) : (
              <>
              <FileText className="mr-2 h-4 w-4" />
              Generate Insights
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle className="font-headline text-xl flex items-center gap-2">
                    <Bot className="text-primary" /> AI Generated Insights
                </CardTitle>
                <CardDescription>
                    Summary of the business performance based on the KPIs.
                </CardDescription>
            </div>
            <Button variant="outline" size="icon" onClick={handleDownload} disabled={!insights}>
                <Download className="h-4 w-4" />
            </Button>
        </CardHeader>
        <CardContent className="prose prose-sm dark:prose-invert max-w-none">
          {loading && (
            <div className="flex items-center justify-center p-8">
              <Loader className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
          {insights ? (
            <div
              className="space-y-4"
              dangerouslySetInnerHTML={{__html: insights.replace(/\n/g, '<br />')}}
            />
          ) : (
            !loading && (
              <p className="text-muted-foreground">
                Adjust the KPIs on the left and click &quot;Generate Insights&quot; to see AI-powered analysis.
              </p>
            )
          )}
        </CardContent>
      </Card>
    </div>
  );
}
