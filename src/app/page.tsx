import Image from 'next/image';
import Link from 'next/link';
import {ArrowRight, Zap, Users, Shield} from 'lucide-react';

import {Button} from '@/components/ui/button';
import {Logo} from '@/components/shared/Logo';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Logo />
        <nav className="flex items-center gap-2">
          <Button variant="ghost" asChild>
            <Link href="/login">Login</Link>
          </Button>
          <Button className="bg-accent text-accent-foreground hover:bg-accent/90" asChild>
            <Link href="/signup">
              Sign Up <ArrowRight className="ml-2" />
            </Link>
          </Button>
        </nav>
      </header>

      <main className="flex-grow">
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24 text-center">
            <div className="max-w-4xl mx-auto">
                <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                    Clean, Reliable Energy for Every Kenyan Home.
                </h1>
                <p className="mt-6 text-lg md:text-xl text-muted-foreground">
                    BrightEco Pay is revolutionizing access to solar energy with an affordable Pay-As-You-Go model. Power your home, support your community, and build a brighter future with us.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                    <Link href="/signup">Get Started for Free</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                    <Link href="/admin">View Admin Dashboard</Link>
                </Button>
                </div>
            </div>
        </section>

        <section className="relative py-12 md:py-24">
            <div className="absolute inset-0 bg-primary/10 -skew-y-2 z-0"></div>
            <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div className="relative h-80 lg:h-auto lg:aspect-square rounded-2xl overflow-hidden shadow-2xl order-last lg:order-first">
                        <Image
                        src="https://placehold.co/800x800.png"
                        alt="A family enjoying light from a solar-powered lamp"
                        data-ai-hint="happy family solar light"
                        fill
                        className="object-cover"
                        priority
                        />
                    </div>
                    <div className="space-y-6">
                        <h2 className="font-headline text-3xl md:text-4xl font-bold">Empowering Communities, One Home at a Time</h2>
                        <p className="text-lg text-muted-foreground">
                        Our PAYG system makes clean energy accessible to everyone. No large upfront costs, just simple, regular payments for the energy you use. It's more than just power—it's an investment in health, education, and economic growth.
                        </p>
                        <ul className="space-y-4 text-left">
                            <li className="flex items-start gap-3">
                                <Zap className="h-6 w-6 text-primary mt-1 flex-shrink-0"/>
                                <div>
                                    <h3 className="font-semibold">Affordable & Flexible</h3>
                                    <p className="text-muted-foreground">Pay for solar energy in small, manageable installments that fit your budget.</p>
                                </div>
                            </li>
                             <li className="flex items-start gap-3">
                                <Users className="h-6 w-6 text-primary mt-1 flex-shrink-0"/>
                                <div>
                                    <h3 className="font-semibold">Community Focused</h3>
                                    <p className="text-muted-foreground">We partner with local agents to provide jobs and reliable customer support.</p>
                                </div>
                            </li>
                             <li className="flex items-start gap-3">
                                <Shield className="h-6 w-6 text-primary mt-1 flex-shrink-0"/>
                                <div>
                                    <h3 className="font-semibold">Reliable & Safe</h3>
                                    <p className="text-muted-foreground">Our high-quality solar systems are built to last, providing you with consistent power.</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>

         <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24 text-center">
            <h2 className="font-headline text-3xl md:text-4xl font-bold">How It Works</h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                Getting started with BrightEco Pay is simple.
            </p>
            <div className="mt-12 grid md:grid-cols-3 gap-8">
                <Card className="text-center">
                    <CardHeader>
                        <div className="mx-auto bg-primary/20 rounded-full h-16 w-16 flex items-center justify-center">
                            <span className="font-headline text-2xl font-bold text-primary">1</span>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <h3 className="font-headline text-xl font-semibold">Sign Up</h3>
                        <p className="mt-2 text-muted-foreground">Create an account in minutes with just your mobile number.</p>
                    </CardContent>
                </Card>
                <Card className="text-center">
                    <CardHeader>
                         <div className="mx-auto bg-primary/20 rounded-full h-16 w-16 flex items-center justify-center">
                            <span className="font-headline text-2xl font-bold text-primary">2</span>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <h3 className="font-headline text-xl font-semibold">Get Your System</h3>
                        <p className="mt-2 text-muted-foreground">A local agent installs your solar home system at no upfront cost.</p>
                    </CardContent>
                </Card>
                 <Card className="text-center">
                    <CardHeader>
                         <div className="mx-auto bg-primary/20 rounded-full h-16 w-16 flex items-center justify-center">
                            <span className="font-headline text-2xl font-bold text-primary">3</span>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <h3 className="font-headline text-xl font-semibold">Enjoy Clean Energy</h3>
                        <p className="mt-2 text-muted-foreground">Make small payments via M-Pesa or Airtel Money to keep your lights on.</p>
                    </CardContent>
                </Card>
            </div>
        </section>

      </main>

      <footer className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-muted-foreground border-t">
        <p>&copy; {new Date().getFullYear()} BrightEco Pay. All rights reserved.</p>
      </footer>
    </div>
  );
}
