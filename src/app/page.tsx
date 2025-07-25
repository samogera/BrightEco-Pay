import Image from 'next/image';
import Link from 'next/link';
import {ArrowRight} from 'lucide-react';

import {Button} from '@/components/ui/button';
import {Logo} from '@/components/shared/Logo';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
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

      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center py-12 lg:py-24">
          <div className="space-y-6">
            <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
              Powering a Brighter, Cleaner Future.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              BrightEco Pay makes managing your solar energy simple and
              efficient. Track usage, manage payments, and monitor your system
              in real-time, all from one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild>
                <Link href="/signup">Get Started for Free</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/admin">Admin Dashboard</Link>
              </Button>
            </div>
          </div>
          <div className="relative h-64 lg:h-auto lg:aspect-square rounded-2xl overflow-hidden shadow-2xl">
            <Image
              src="https://placehold.co/800x800.png"
              alt="Solar panels on a modern house"
              data-ai-hint="solar panels"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent"></div>
          </div>
        </div>
      </main>

      <footer className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} BrightEco Pay. All rights reserved.</p>
      </footer>
    </div>
  );
}
