
'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { LifeBuoy, Phone, MessageSquare, MapPin } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import Image from "next/image";


export default function SupportPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Ticket Submitted",
        description: "Our support team will get back to you shortly.",
      });
      setLoading(false);
    }, 1500)
  }

  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-xl">Get In Touch</CardTitle>
            <CardDescription>
              Have an issue or a question? Fill out the form below and we'll get back to you.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" placeholder="Enter your name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" placeholder="user@example.com" required />
                </div>
              </div>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" placeholder="+254 712 345 678" />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="location">Your Location (Optional)</Label>
                    <Input id="location" placeholder="e.g., Nairobi" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Select name="subject" required>
                  <SelectTrigger id="subject">
                    <SelectValue placeholder="Select a reason..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="appointment">Book an Appointment</SelectItem>
                    <SelectItem value="demo">Request a Demo</SelectItem>
                    <SelectItem value="pricing">Pricing Inquiry</SelectItem>
                    <SelectItem value="hardware">Hardware Support</SelectItem>
                    <SelectItem value="payment">Payment Issue</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" placeholder="Describe your issue or request in detail..." rows={5} required/>
              </div>
              <Button type="submit" disabled={loading}>
                {loading ? 'Submitting...' : 'Submit Ticket'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-xl flex items-center gap-2">
              <LifeBuoy className="text-primary" /> Contact Channels
            </CardTitle>
            <CardDescription>
              For immediate assistance, reach us through the channels below.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-4">
              <Phone className="h-6 w-6 text-muted-foreground mt-1" />
              <div>
                <p className="font-semibold">Call Us</p>
                <a href="tel:+254712345678" className="text-primary hover:underline">+254 712 345 678</a>
              </div>
            </div>
             <div className="flex items-start gap-4">
              <MessageSquare className="h-6 w-6 text-muted-foreground mt-1" />
              <div>
                <p className="font-semibold">WhatsApp</p>
                <a href="https://wa.me/254712345678" target="_blank" className="text-primary hover:underline">+254 712 345 678</a>
              </div>
            </div>
             <div className="flex items-start gap-4">
              <MapPin className="h-6 w-6 text-muted-foreground mt-1" />
              <div>
                <p className="font-semibold">Our Office</p>
                <p className="text-sm text-muted-foreground">123 Solar Avenue, Nairobi, Kenya</p>
              </div>
            </div>
            <div className="relative h-48 w-full rounded-md overflow-hidden mt-4">
                <Image 
                    src="https://placehold.co/600x400.png"
                    alt="Map showing office location"
                    layout="fill"
                    objectFit="cover"
                    data-ai-hint="map location"
                />
            </div>
          </CardContent>
        </Card>
         <Card>
          <CardHeader>
            <CardTitle className="font-headline text-xl">Frequently Asked Questions</CardTitle>
             <CardDescription>
              Find instant answers to common questions.
            </CardDescription>
          </CardHeader>
          <CardContent>
             <Button variant="outline" asChild>
                <a href="#">Visit FAQ Page</a>
             </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
