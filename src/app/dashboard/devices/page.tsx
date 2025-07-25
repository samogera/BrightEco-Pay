import { Smartphone, BatteryFull, Zap, Sun } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const devices = [
  {
    id: 'DEV001',
    name: 'Solar Panel Array A',
    type: 'Solar Panel',
    status: 'Online',
    icon: Sun,
    details: {
      output: '2.1 kWh',
      efficiency: '18.5%',
    },
  },
  {
    id: 'DEV002',
    name: 'Main Battery Bank',
    type: 'Battery',
    status: 'Online',
    icon: BatteryFull,
    details: {
      charge: '92%',
      health: '99%',
      runtime: '20.1 hours',
    },
  },
  {
    id: 'DEV003',
    name: 'Primary Inverter',
    type: 'Inverter',
    status: 'Online',
    icon: Zap,
    details: {
      load: '1.2 kW',
      temperature: '45°C',
    },
  },
    {
    id: 'DEV004',
    name: 'Solar Panel Array B',
    type: 'Solar Panel',
    status: 'Offline',
    icon: Sun,
    details: {
        output: '0 kWh',
        efficiency: '0%',
    },
  },
];

export default function DevicesPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8">
      <div className="grid gap-6">
        {devices.map((device) => (
          <Card key={device.id}>
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-4">
                <device.icon className="h-8 w-8 text-primary" />
                <div>
                  <CardTitle>{device.name}</CardTitle>
                  <CardDescription>{device.id} - {device.type}</CardDescription>
                </div>
              </div>
              <Badge variant={device.status === 'Online' ? 'default' : 'destructive'}>
                {device.status}
              </Badge>
            </CardHeader>
            <CardContent>
              <Separator className="my-4" />
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                {Object.entries(device.details).map(([key, value]) => (
                  <div key={key}>
                    <p className="text-muted-foreground capitalize">{key}</p>
                    <p className="font-semibold">{value}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
