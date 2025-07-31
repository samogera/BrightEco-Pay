import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { CustomerAnalytics } from '@/components/admin/CustomerAnalytics';
import { Separator } from '@/components/ui/separator';

export default function AdminPage() {
  return (
    <div className="space-y-8">
       <div className="text-center">
        <h1 className="font-headline text-3xl md:text-4xl font-bold">
          Admin Dashboard
        </h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          Monitor performance, analyze school data, and manage the BrightEco platform.
        </p>
      </div>
      <CustomerAnalytics />
      <Separator className="my-8" />
      <AdminDashboard />
    </div>
  );
}
