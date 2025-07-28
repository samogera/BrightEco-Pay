import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { LifeBuoy, Phone, MessageSquare } from "lucide-react";

export default function SupportPage() {
  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-xl">Submit a Support Ticket</CardTitle>
            <CardDescription>
              Having an issue? Fill out the form below and our team will get back to you shortly.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="Enter your name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" placeholder="+254 712 345 678" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" placeholder="e.g., Payment issue, Device offline" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" placeholder="Describe your issue in detail..." rows={5} />
            </div>
            <Button>Submit Ticket</Button>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-xl flex items-center gap-2">
              <LifeBuoy className="text-primary" /> Contact Us
            </CardTitle>
            <CardDescription>
              For immediate assistance, you can reach us through the channels below.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Phone className="h-6 w-6 text-muted-foreground" />
              <div>
                <p className="font-semibold">Call Us</p>
                <a href="tel:+254712345678" className="text-primary hover:underline">+254 712 345 678</a>
              </div>
            </div>
             <div className="flex items-center gap-4">
              <MessageSquare className="h-6 w-6 text-muted-foreground" />
              <div>
                <p className="font-semibold">WhatsApp</p>
                <a href="https://wa.me/254712345678" target="_blank" className="text-primary hover:underline">+254 712 345 678</a>
              </div>
            </div>
          </CardContent>
        </Card>
         <Card>
          <CardHeader>
            <CardTitle className="font-headline text-xl">FAQs</CardTitle>
             <CardDescription>
              Find answers to common questions.
            </CardDescription>
          </CardHeader>
          <CardContent>
             <a href="#" className="text-primary font-semibold hover:underline">Visit our FAQ page &rarr;</a>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
