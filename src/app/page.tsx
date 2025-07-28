import Image from 'next/image';
import Link from 'next/link';
import {ArrowRight} from 'lucide-react';

import {Button} from '@/components/ui/button';
import {Logo} from '@/components/shared/Logo';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Logo />
        <nav className="flex items-center gap-2">
          <Button variant="ghost" asChild>
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">
              Sign Up <ArrowRight className="ml-2" />
            </Link>
          </Button>
        </nav>
      </header>

      <main className="flex-grow">
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
              Powering Communities with Clean Energy
            </h1>
            <p className="mt-6 text-lg md:text-xl text-muted-foreground">
              BrightEco Pay provides affordable, reliable solar energy solutions
              through a simple Pay-As-You-Go model.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/signup">Get Started</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/#features">Learn More</Link>
              </Button>
            </div>
          </div>
        </section>

        <section id="features" className="bg-muted py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h2 className="font-headline text-3xl md:text-4xl font-bold">
                  Flexible Payments for a Brighter Future
                </h2>
                <p className="text-lg text-muted-foreground">
                  Our PAYG system makes clean energy accessible to everyone. No
                  large upfront costs, just simple, regular payments for the
                  energy you use.
                </p>
                <ul className="space-y-4 text-left">
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold text-xl">✓</span>
                    <div>
                      <h3 className="font-semibold">Affordable & Flexible</h3>
                      <p className="text-muted-foreground">
                        Pay for solar energy in small, manageable installments.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold text-xl">✓</span>
                    <div>
                      <h3 className="font-semibold">Community Focused</h3>
                      <p className="text-muted-foreground">
                        We partner with local agents to provide jobs and support.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold text-xl">✓</span>
                    <div>
                      <h3 className="font-semibold">Reliable & Safe</h3>
                      <p className="text-muted-foreground">
                        High-quality solar systems built to last.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="relative h-64 lg:h-auto lg:aspect-square rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="https://placehold.co/600x600.png"
                  alt="Solar panels on a modern house"
                  data-ai-hint="solar panels"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-muted-foreground border-t">
        <p>
          &copy; {new Date().getFullYear()} BrightEco Pay. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
