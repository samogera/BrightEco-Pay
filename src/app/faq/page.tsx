
'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HelpCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Logo } from '@/components/shared/Logo';

const faqItems = [
  {
    question: 'How do I make a payment for my solar service?',
    answer:
      'You can easily make a payment through the "Billing" section of your dashboard after signing up. We support payments via M-Pesa, Card (Visa/Mastercard), and PayPal.',
  },
  {
    question: 'What is the BrightEco Pay-As-You-Go model?',
    answer:
      'Our PAYG model allows you to get a solar system with no large upfront cost. You pay for the energy you use in small, manageable installments. Once the system is paid off, the energy is yours for free.',
  },
   {
    question: 'What happens if I miss a payment?',
    answer:
      'We offer a grace period after the due date. If the balance remains unpaid after the grace period, your service may be temporarily interrupted. Service is restored immediately upon payment.',
  },
  {
    question: 'How do I know which solar kit is right for me?',
    answer:
      'Our interactive calculator on the homepage can give you a great starting recommendation. For a detailed assessment, please fill out our contact form, and one of our solar experts will help you find the perfect fit.',
  },
  {
    question: 'Do you provide installation and maintenance?',
    answer:
      'Yes! Every BrightEco solar system includes professional installation. We also provide ongoing support and maintenance to ensure your system is always running optimally. You can request support through your user dashboard after signing up.',
  },
];

export default function FaqPage() {
  return (
    <div className="bg-brand-gradient min-h-screen">
       <header className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Logo />
        <Button asChild>
          <Link href="/">Back to Home</Link>
        </Button>
      </header>
       <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <HelpCircle className="mx-auto h-12 w-12 text-primary mb-4" />
                    <h1 className="font-headline text-3xl md:text-4xl font-bold">
                    Frequently Asked Questions
                    </h1>
                    <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                    Find quick answers to common questions about BrightEco solar solutions.
                    </p>
                </div>

                 <Card>
                    <CardContent className="p-6">
                    <Accordion type="single" collapsible className="w-full">
                        {faqItems.map((item, index) => (
                        <AccordionItem key={index} value={`item-${index}`}>
                            <AccordionTrigger className="text-left font-semibold hover:no-underline">
                            {item.question}
                            </AccordionTrigger>
                            <AccordionContent className="text-muted-foreground">
                            {item.answer}
                            </AccordionContent>
                        </AccordionItem>
                        ))}
                    </Accordion>
                    </CardContent>
                </Card>

                 <div className="mt-8 text-center">
                    <Button asChild>
                        <Link href="/contact">
                            <ArrowLeft className="mr-2" /> Back to Contact Page
                        </Link>
                    </Button>
                 </div>

            </div>
       </main>
    </div>
  );
}
