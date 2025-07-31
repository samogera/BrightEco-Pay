
'use client';

import Image from 'next/image';
import Link from 'next/link';
import {ArrowRight, Smartphone, BarChart, LifeBuoy, TrendingUp, Download} from 'lucide-react';
import { useState } from 'react';

import {Button} from '@/components/ui/button';
import {Logo} from '@/components/shared/Logo';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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

function WhatsAppIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          {...props}
        >
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
          <path d="M16.36 12c.14.3.24.63.31.98" />
          <path d="M12.6 8.62c.33.1.64.24.94.4" />
          <path d="M19.09 10.32c.18.33.32.68.42 1.05" />
          <path d="M7.64 12c-.14-.3-.24-.63-.31-.98" />
          <path d="M11.4 8.62c-.33-.1-.64-.24-.94-.4" />
          <path d="M4.91 10.32c-.18-.33-.32-.68-.42-1.05" />
        </svg>
    )
}

export default function Home() {
    const [monthlyBill, setMonthlyBill] = useState(3000);
    const yearlySavings = (monthlyBill * 12 * 0.3).toLocaleString('en-US', {
        style: 'currency',
        currency: 'KES',
        minimumFractionDigits: 0,
    });

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center sticky top-0 z-20 bg-background/80 backdrop-blur-md">
        <Logo />
        <nav className="hidden md:flex items-center gap-2">
          <Button variant="ghost" asChild>
            <Link href="/admin/login" className="font-semibold text-foreground hover:text-primary">Admin Login</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/login" className="font-semibold text-foreground hover:text-primary">User Login</Link>
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
                  <Link href="/signup">Get Started</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        <section id="features" className="py-16 md:py-24 bg-background">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                 <h2 className="font-headline text-3xl md:text-4xl font-bold mb-2 text-accent-foreground/90">
                    A Brighter Future for Your Home
                </h2>
                <p className="max-w-2xl mx-auto text-lg text-muted-foreground mb-12">
                    Our platform is built from the ground up to meet the unique energy needs of residential customers.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <Card key={index} className="text-left bg-card/80 backdrop-blur-sm border-2 border-primary/10 hover:border-primary/30 transition-all hover:shadow-primary/10">
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
                <h2 className="font-headline text-3xl md:text-4xl font-bold text-accent-foreground/90">
                  Flexible Payments for Uninterrupted Power
                </h2>
                <p className="text-lg text-muted-foreground">
                  Our PAYG system makes clean energy accessible. No large upfront costs, just simple, regular payments for the energy you use.
                </p>
                <p className="text-lg text-muted-foreground">
                    With BrightEco Pay, you are in complete control of your energy budget.
                </p>
                 <Button size="lg" asChild className="font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg">
                  <Link href="/signup">Get Started</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
        
         <section className="py-16 md:py-24 bg-brand-gradient">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <Card className="bg-card/90 backdrop-blur-sm p-8 md:p-12 border-primary/20 shadow-lg">
                     <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-4 text-center lg:text-left">
                             <h2 className="font-headline text-3xl md:text-4xl font-bold text-accent-foreground/90">Calculate Your Savings</h2>
                            <p className="text-lg text-muted-foreground">See how much you could save by switching to BrightEco solar. Enter your current monthly electricity bill below.</p>
                            <div className="space-y-2 !mt-6">
                                <Label htmlFor="bill" className="font-semibold">Your Current Monthly Bill (KES)</Label>
                                <Input 
                                    id="bill" 
                                    type="number" 
                                    value={monthlyBill} 
                                    onChange={(e) => setMonthlyBill(Number(e.target.value))} 
                                    className="max-w-xs mx-auto lg:mx-0 text-lg p-4"
                                />
                            </div>
                        </div>
                        <div className="text-center rounded-2xl bg-primary/10 p-8 border-2 border-dashed border-primary/50">
                            <p className="text-muted-foreground font-semibold">Potential Yearly Savings</p>
                            <p className="text-4xl md:text-5xl font-bold text-primary my-2">{yearlySavings}</p>
                            <p className="text-sm text-muted-foreground max-w-xs mx-auto">Based on an estimated 30% saving on your energy costs. Actual savings may vary.</p>
                        </div>
                    </div>
                </Card>
            </div>
        </section>

        <section className="py-16 md:py-24 bg-background">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="font-headline text-3xl md:text-4xl font-bold text-accent-foreground/90 mb-4">Manage Your BrightEco System on the Go</h2>
                <p className="max-w-2xl mx-auto text-lg text-muted-foreground mb-8">Download our mobile app to track usage, make payments, and get support anytime, anywhere.</p>
                <div className="flex justify-center items-center flex-wrap gap-4">
                     <a href="#" className="inline-block transition-transform hover:scale-105">
                        <Image src="https://logowik.com/content/uploads/images/google-play-store.jpg" width={180} height={60} alt="Get it on Google Play" />
                     </a>
                     <a href="#" className="inline-block transition-transform hover:scale-105">
                        <Image src="https://logowik.com/content/uploads/images/app-store6550.jpg" width={180} height={60} alt="Download on the App Store" />
                     </a>
                </div>
            </div>
        </section>


         <section className="py-16 md:py-24 bg-muted/30">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                 <h2 className="font-headline text-3xl md:text-4xl font-bold text-accent-foreground/90 mb-4">
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

      <footer className="bg-card border-t">
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
                      <li><Link href="/faq" className="hover:text-primary">FAQ</Link></li>
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
                      <li><a href="https://wa.me/254746610345" target="_blank" className="hover:text-primary flex items-center gap-2"><WhatsAppIcon className="h-4 w-4" /> WhatsApp</a></li>
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
