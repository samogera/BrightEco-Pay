
'use client';

import {useState} from 'react';
import {Bot, Download, Loader, FileText} from 'lucide-react';

import {generateInsightsDashboard} from '@/ai/flows/generate-insights-dashboard';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardHeader, CardTitle, CardDescription} from '@/components/ui/card';
import {Label} from '@/components/ui/label';
import {Slider} from '@/components/ui/slider';
import {useToast} from '@/hooks/use-toast';
import { LoadingLogo } from '@/components/shared/LoadingLogo';

export function AdminDashboard() {
  const {toast} = useToast();
  const [schoolsOnTime, setSchoolsOnTime] = useState(85);
  const [systemUptime, setSystemUptime] = useState(99);
  const [avgStudyHours, setAvgStudyHours] = useState(6);
  const [overallRevenue, setOverallRevenue] = useState(5000000);
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState<string | null>(null);

  const handleSubmit = async () => {
    setLoading(true);
    setInsights(null);
    try {
      // Note: The flow expects different keys, this is a simulation.
      // For a real implementation, the flow input schema should be updated.
      const result = await generateInsightsDashboard({
        paymentCompliance: schoolsOnTime,
        systemUptime,
        customerChurnRate: 100 - schoolsOnTime, // Simulate churn
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
    const blob = new Blob([insights.replace(/<br \/>/g, "\n").replace(/<\/?[^>]+(>|$)/g, "")], { type: 'text/plain' });
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
            Education KPI Simulation
          </CardTitle>
           <CardDescription>
            Adjust the sliders to simulate school metrics and generate an AI report.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="compliance" className="flex justify-between">
              <span>Schools On Time</span>
              <span className="font-bold text-primary">{schoolsOnTime}%</span>
            </Label>
            <Slider
              id="compliance"
              value={[schoolsOnTime]}
              onValueChange={([v]) => setSchoolsOnTime(v)}
              max={100}
              step={1}
            />
          </div>
           <div className="space-y-3">
            <Label htmlFor="study-hours" className="flex justify-between">
              <span>Avg. Daily Study Hours</span>
              <span className="font-bold text-primary">{avgStudyHours} hrs</span>
            </Label>
            <Slider
              id="study-hours"
              value={[avgStudyHours]}
              onValueChange={([v]) => setAvgStudyHours(v)}
              max={12}
              step={0.5}
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
            <Label htmlFor="revenue" className="flex justify-between">
              <span>Termly Revenue</span>
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
              <LoadingLogo />
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
                    Analysis of school performance based on the KPIs.
                </CardDescription>
            </div>
            <Button variant="outline" size="icon" onClick={handleDownload} disabled={!insights}>
                <Download className="h-4 w-4" />
            </Button>
        </CardHeader>
        <CardContent className="prose prose-sm dark:prose-invert max-w-none">
          {loading && (
            <div className="flex items-center justify-center p-8">
              <LoadingLogo />
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
                Adjust the KPIs on the left and click &quot;Generate Insights&quot; to see AI-powered analysis for your schools.
              </p>
            )
          )}
        </CardContent>
      </Card>
    </div>
  );
}
