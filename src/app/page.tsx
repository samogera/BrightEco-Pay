import Image from 'next/image';
import Link from 'next/link';
import {ArrowRight, GraduationCap, Zap, Leaf} from 'lucide-react';

import {Button} from '@/components/ui/button';
import {Logo} from '@/components/shared/Logo';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const features = [
    {
        icon: GraduationCap,
        title: 'For Educational Institutions',
        description: 'Custom PAYGo plans that align with school budget cycles and guarantee power during classroom hours.'
    },
    {
        icon: Zap,
        title: 'Reliable & Smart Power',
        description: 'Real-time monitoring and weather-adaptive technology ensure consistent energy for uninterrupted learning.'
    },
    {
        icon: Leaf,
        title: 'Sustainable & Affordable',
        description: 'Equip your school with clean solar energy through simple, manageable payments without large upfront costs.'
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
            <Link href="/login">School Login</Link>
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
              Empowering Education with Sustainable Solar Energy
            </h1>
            <p className="mt-6 text-lg md:text-xl text-muted-foreground">
              BrightEco Pay provides reliable, affordable solar solutions specifically designed for Kenyan schools through a simple Pay-As-You-Go model.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/signup">Request a Demo</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#features">Learn More</Link>
              </Button>
            </div>
          </div>
        </section>
        
        <section id="features" className="py-16 md:py-24 bg-muted/50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                 <h2 className="font-headline text-3xl md:text-4xl font-bold mb-2">
                    A Brighter Future for Your School
                </h2>
                <p className="max-w-2xl mx-auto text-lg text-muted-foreground mb-12">
                    Our platform is built from the ground up to meet the unique energy needs of educational institutions.
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
                  alt="Students studying in a well-lit classroom"
                  data-ai-hint="happy students classroom"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="space-y-6">
                <h2 className="font-headline text-3xl md:text-4xl font-bold">
                  Flexible Payments for Uninterrupted Learning
                </h2>
                <p className="text-lg text-muted-foreground">
                  Our PAYG system aligns with school funding cycles, making clean energy accessible. No large upfront costs, just simple, regular payments for the energy you use.
                </p>
                <ul className="space-y-4 text-left">
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold text-xl mt-1">✓</span>
                    <div>
                      <h3 className="font-semibold">Termly Payment Schedules</h3>
                      <p className="text-muted-foreground">
                        Align payments with fee collection in January, May, and September.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold text-xl mt-1">✓</span>
                    <div>
                      <h3 className="font-semibold">Guaranteed Uptime</h3>
                      <p className="text-muted-foreground">
                       We prioritize power to critical loads during school hours.
                      </p>
                    </div>
                  </li>
                   <li className="flex items-start gap-3">
                    <span className="text-primary font-bold text-xl mt-1">✓</span>
                    <div>
                      <h3 className="font-semibold">Track Educational Impact</h3>
                      <p className="text-muted-foreground">
                        See how solar power improves study hours and attendance.
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
          &copy; {new Date().getFullYear()} BrightEco Pay. Powering Education.
        </p>
      </footer>
    </div>
  );
}
