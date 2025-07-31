
import Image from 'next/image';
import Link from 'next/link';
import {ArrowRight, Smartphone, BarChart, LifeBuoy} from 'lucide-react';

import {Button} from '@/components/ui/button';
import {Logo} from '@/components/shared/Logo';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const features = [
    {
        icon: Smartphone,
        title: 'Mobile Money Payments',
        description: 'Easily pay your bill with M-Pesa or Airtel Money right from your phone. Simple, secure, and instant.'
    },
    {
        icon: BarChart,
        title: 'Live Usage Tracking',
        description: 'Monitor your energy consumption in real-time from our app to understand your usage and save money.'
    },
    {
        icon: LifeBuoy,
        title: '24/7 Customer Support',
        description: 'Our dedicated team is always ready to help you with any issues or questions you may have. We are here for you.'
    }
]

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center sticky top-0 z-20 bg-background/80 backdrop-blur-md">
        <Logo />
        <nav className="hidden md:flex items-center gap-2">
          <Button variant="ghost" asChild>
            <Link href="/admin/login" className="font-semibold">Admin Login</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/login" className="font-semibold">User Login</Link>
          </Button>
          <Button asChild className="font-bold bg-primary hover:bg-primary/90 text-primary-foreground">
            <Link href="/signup">
              Get Started <ArrowRight className="ml-2" />
            </Link>
          </Button>
        </nav>
      </header>

      <main className="flex-grow">
        <section className="bg-brand-gradient">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 text-center">
            <div className="max-w-4xl mx-auto">
              <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                Clean, Reliable Solar Energy for Your <span className="text-primary">Kenyan</span> Home
              </h1>
              <p className="mt-6 text-lg md:text-xl text-muted-foreground">
                Affordable PAYGo Solutions to Power Your Life Sustainably.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild className="font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg">
                  <Link href="/signup">Get Your System Today</Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="font-semibold">
                  <Link href="#features">Learn More</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        <section id="features" className="py-16 md:py-24 bg-background">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                 <h2 className="font-headline text-3xl md:text-4xl font-bold mb-2">
                    A Brighter Future for Your Home
                </h2>
                <p className="max-w-2xl mx-auto text-lg text-muted-foreground mb-12">
                    Our platform is built from the ground up to meet the unique energy needs of residential customers.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <Card key={index} className="text-left bg-card/80 backdrop-blur-sm border-2 border-primary/10 hover:border-primary/30 transition-all">
                            <CardHeader>
                                <div className="p-3 bg-primary/10 rounded-lg w-min mb-4">
                                   <feature.icon className="h-8 w-8 text-primary" />
                                </div>
                                <CardTitle className="font-headline text-xl">{feature.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">{feature.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>

        <section className="bg-muted/30 py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
               <div className="relative h-80 lg:h-auto lg:aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl order-last lg:order-first">
                <Image
                  src="https://placehold.co/800x600.png"
                  alt="Family enjoying light in their home"
                  data-ai-hint="kenyan family solar light"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="space-y-6">
                <h2 className="font-headline text-3xl md:text-4xl font-bold">
                  Flexible Payments for Uninterrupted Power
                </h2>
                <p className="text-lg text-muted-foreground">
                  Our PAYG system makes clean energy accessible. No large upfront costs, just simple, regular payments for the energy you use.
                </p>
                <p className="text-lg text-muted-foreground">
                    With BrightEco Pay, you are in complete control of your energy budget.
                </p>
                 <Button size="lg" asChild className="font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg">
                  <Link href="/dashboard/billing">Go to Billing</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

         <section className="py-16 md:py-24 bg-background">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                 <h2 className="font-headline text-3xl md:text-4xl font-bold mb-4">
                    Start Your Solar Journey Today
                </h2>
                <p className="max-w-2xl mx-auto text-lg text-muted-foreground mb-8">
                    Join hundreds of Kenyan homes enjoying reliable, clean, and affordable energy.
                </p>
                <Button size="lg" asChild className="font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg animate-pulse">
                  <Link href="/signup">Get Started Now</Link>
                </Button>
            </div>
        </section>
      </main>

      <footer className="bg-muted/20 border-t">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="space-y-4">
                  <Logo />
                  <p className="text-muted-foreground">Powering Kenyan communities with sustainable energy solutions.</p>
              </div>
              <div className="space-y-2">
                  <h4 className="font-headline font-semibold">Quick Links</h4>
                  <ul className="space-y-1 text-muted-foreground">
                      <li><Link href="/login" className="hover:text-primary">User Login</Link></li>
                      <li><Link href="/admin/login" className="hover:text-primary">Admin Login</Link></li>
                      <li><Link href="/dashboard/support/faq" className="hover:text-primary">FAQ</Link></li>
                  </ul>
              </div>
               <div className="space-y-2">
                  <h4 className="font-headline font-semibold">Legal</h4>
                  <ul className="space-y-1 text-muted-foreground">
                      <li><Link href="#" className="hover:text-primary">Terms of Service</Link></li>
                      <li><Link href="#" className="hover:text-primary">Privacy Policy</Link></li>
                  </ul>
              </div>
               <div className="space-y-2">
                  <h4 className="font-headline font-semibold">Contact Us</h4>
                  <ul className="space-y-1 text-muted-foreground">
                      <li><a href="https://wa.me/254746610345" target="_blank" className="hover:text-primary">WhatsApp</a></li>
                      <li><p>123 Solar Avenue, Nairobi, Kenya</p></li>
                  </ul>
              </div>
          </div>
           <div className="mt-8 border-t pt-6 text-center text-muted-foreground">
                <p>
                &copy; {new Date().getFullYear()} BrightEco Pay. Powering Communities.
                </p>
            </div>
        </div>
      </footer>
    </div>
  );
}
