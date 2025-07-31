
'use client';

import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Video, FileText } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const educationalContent = [
  {
    type: 'Article',
    title: 'Understanding Your Solar PV System',
    description: 'A comprehensive guide to how your school\'s solar panels, batteries, and inverters work together to provide clean energy.',
    icon: FileText,
    link: '#',
  },
  {
    type: 'Article',
    title: 'Optimizing Energy Usage in the Classroom',
    description: 'Learn simple tips and tricks to reduce energy consumption and maximize the benefits of your solar system.',
    icon: FileText,
    link: '#',
  },
  {
    type: 'Video',
    title: 'Video Tutorial: Reading Your Energy Bill',
    description: 'A step-by-step walkthrough of your BrightEco Pay statement, explaining usage, charges, and payment cycles.',
    icon: Video,
    link: '#',
  },
  {
    type: 'Article',
    title: 'The Impact of Solar on Education',
    description: 'Discover how reliable power can improve student outcomes, from enabling evening studies to powering digital learning tools.',
    icon: FileText,
    link: '#',
  },
  {
    type: 'Video',
    title: 'Video: Basic System Maintenance',
    description: 'Learn how to safely clean your solar panels and check your system for optimal performance.',
    icon: Video,
    link: '#',
  },
];

export default function EducationPage() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="font-headline text-3xl md:text-4xl font-bold">
          <BookOpen className="inline-block h-10 w-10 mr-2 text-primary" />
          Education Hub
        </h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          Empowering your school with the knowledge to make the most of solar energy.
        </p>
      </div>
      
      <Separator />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {educationalContent.map((item, index) => (
          <Card key={index} className="flex flex-col">
            <CardHeader>
              <div className="flex items-center gap-4">
                  <item.icon className="h-8 w-8 text-primary" />
                  <div>
                      <CardTitle>{item.title}</CardTitle>
                      <CardDescription>{item.type}</CardDescription>
                  </div>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-muted-foreground">{item.description}</p>
            </CardContent>
            <div className="p-6 pt-0">
                <a href={item.link} className="font-semibold text-primary hover:underline">
                    {item.type === 'Video' ? 'Watch Now' : 'Read More'} &rarr;
                </a>
            </div>
          </Card>>
        ))}
      </div>

       <Card className="mt-8 bg-primary/10">
          <CardHeader className="text-center">
            <CardTitle>Want to Learn More?</CardTitle>
            <CardDescription>
              Schedule a personalized training session for your school staff.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
             <a href="/dashboard/support" className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-semibold shadow hover:bg-primary/90 transition-colors">
                Book a Training
             </a>
          </CardContent>
        </Card>

    </div>
  );
}
