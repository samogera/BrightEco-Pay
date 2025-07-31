
'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent } from '@/components/ui/card';
import { HelpCircle } from 'lucide-react';
import { Logo } from '@/components/shared/Logo';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const faqItems = [
  {
    question: 'How do I make a payment for my solar service?',
    answer:
      'You can easily make a payment through the "Billing" section of your dashboard. We support payments via M-Pesa, Card (Visa/Mastercard), PayPal, and your Solar Wallet balance. Simply enter the amount you wish to pay and choose your preferred method.',
  },
  {
    question: 'What is the Solar Wallet and how does the discount work?',
    answer:
      'The Solar Wallet is a feature that allows you to store credit for future payments. When you pay your bill using your Solar Wallet balance, you receive a 1.5% discount on the total amount due. You can top up your wallet at any time from the "Billing" page.',
  },
  {
    question: 'What happens if I miss a payment due date?',
    answer:
      'We offer a grace period after the due date to give you extra time to pay. However, if the balance remains unpaid after the grace period ends, your service may be temporarily interrupted. You will receive reminder notifications before any interruption occurs.',
  },
  {
    question: 'How can I track my daily energy usage?',
    answer:
      'Your main dashboard includes a detailed "Usage" section where you can view your energy consumption by the hour, day, week, month, or a custom date range. This helps you understand your habits and optimize your energy use.',
  },
  {
    question: 'My solar system status shows "Offline". What should I do?',
    answer:
      'If your system is offline, first check your main circuit breaker and ensure all connections to the inverter and battery are secure. If the issue persists, please navigate to the "Devices" page and use the AI Device Advisor for troubleshooting steps, or contact our support team via the form on the "Support" page.',
  },
  {
    question: 'How do I update my personal information?',
    answer:
      'You can update your name, address, and profile picture on the "Profile" page. Click on your avatar in the sidebar to access it. Email and phone numbers are used for account verification and cannot be changed directly.',
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
                Find quick answers to common questions about your BrightEco solar system, billing, and account.
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
        </div>
      </main>
    </div>
  );
}
