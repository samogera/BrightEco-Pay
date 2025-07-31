
import Image from 'next/image';
import Link from 'next/link';
import {ArrowRight, GraduationCap, Zap, Leaf} from 'lucide-react';

import {Button} from '@/components/ui/button';
import {Logo} from '@/components/shared/Logo';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const features = [
    {
        icon: Zap,
        title: 'Reliable Power for Your Home',
        description: 'Experience uninterrupted power with our smart solar systems, ensuring your lights stay on and devices stay charged.'
    },
    {
        icon: Leaf,
        title: 'Sustainable & Affordable Energy',
        description: 'Go green with clean solar energy. Our flexible PAYG plans make it affordable for any household budget.'
    },
    {
        icon: GraduationCap,
        title: 'For Communities & Businesses',
        description: 'Custom PAYGo plans that align with the unique needs of communities, schools, and small businesses.'
    }
]

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center sticky top-0 z-20 bg-background/80 backdrop-blur-md">
        <Logo />
        <nav className="flex items-center gap-2">
          <Button variant="ghost" asChild>
            <Link href="/admin/login">Admin Login</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/login">User Login</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">
              Get Started <ArrowRight className="ml-2" />
            </Link>
          </Button>
        </nav>
      </header>

      <main className="flex-grow">
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
              Clean, Reliable Solar Energy for Your Home
            </h1>
            <p className="mt-6 text-lg md:text-xl text-muted-foreground">
              BrightEco Pay provides affordable solar solutions for Kenyan households through a simple Pay-As-You-Go model. Power your life, sustainably.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/signup">Get Your System</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#features">Learn More</Link>
              </Button>
            </div>
          </div>
        </section>
        
        <section id="features" className="py-16 md:py-24 bg-muted/30">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                 <h2 className="font-headline text-3xl md:text-4xl font-bold mb-2">
                    A Brighter Future for Your Home
                </h2>
                <p className="max-w-2xl mx-auto text-lg text-muted-foreground mb-12">
                    Our platform is built from the ground up to meet the unique energy needs of residential customers.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <Card key={index} className="text-left bg-card/80 backdrop-blur-sm">
                            <CardHeader>
                                <div className="p-3 bg-primary/10 rounded-lg w-min mb-4">
                                   <feature.icon className="h-6 w-6 text-primary" />
                                </div>
                                <CardTitle className="font-headline">{feature.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">{feature.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>

        <section className="bg-background py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
               <div className="relative h-80 lg:h-auto lg:aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl order-last lg:order-first">
                <Image
                  src="https://placehold.co/800x600.png"
                  alt="Family enjoying light in their home"
                  data-ai-hint="happy family home"
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
                <ul className="space-y-4 text-left">
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold text-xl mt-1">✓</span>
                    <div>
                      <h3 className="font-semibold">Mobile Money Payments</h3>
                      <p className="text-muted-foreground">
                        Easily pay your bill with M-Pesa or Airtel Money.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold text-xl mt-1">✓</span>
                    <div>
                      <h3 className="font-semibold">Live Usage Tracking</h3>
                      <p className="text-muted-foreground">
                       Monitor your energy consumption in real-time from our app.
                      </p>
                    </div>
                  </li>
                   <li className="flex items-start gap-3">
                    <span className="text-primary font-bold text-xl mt-1">✓</span>
                    <div>
                      <h3 className="font-semibold">24/7 Customer Support</h3>
                      <p className="text-muted-foreground">
                        Our team is always ready to help you with any issues.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-muted-foreground border-t">
        <p>
          &copy; {new Date().getFullYear()} BrightEco Pay. Powering Communities.
        </p>
      </footer>
    </div>
  );
}
