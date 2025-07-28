import Link from 'next/link';
import {ArrowLeft} from 'lucide-react';
import {AdminDashboard} from '@/components/admin/AdminDashboard';
import {Logo} from '@/components/shared/Logo';
import {Button} from '@/components/ui/button';
import { CustomerAnalytics } from '@/components/admin/CustomerAnalytics';
import { Separator } from '@/components/ui/separator';

export default function AdminPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Logo />
          <Button variant="outline" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to App
            </Link>
          </Button>
        </div>
      </header>
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="font-headline text-3xl md:text-4xl font-bold">
              Admin & Analytics Dashboard
            </h1>
            <p className="text-muted-foreground mt-2">
              Generate business insights and analyze customer data using AI.
            </p>
          </div>
          <AdminDashboard />
          <Separator className="my-8" />
          <CustomerAnalytics />
        </div>
      </main>
    </div>
  );
}
