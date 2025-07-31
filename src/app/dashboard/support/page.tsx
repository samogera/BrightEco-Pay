
'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { LifeBuoy, Phone, MessageSquare, MapPin, Loader, FileText, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import Link from "next/link";
import { submitTicket } from "@/ai/flows/submit-ticket";
import { useAuth } from "@/hooks/use-auth";


export default function SupportPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  
  useEffect(() => {
    if(user) {
        setName(user.displayName || '');
        setEmail(user.email || '');
        setPhone(user.phoneNumber || '');
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: name,
      email: email,
      phone: phone,
      title: formData.get('title') as string,
      message: formData.get('message') as string,
    }

    if (!data.name || !data.email || !data.title || !data.message) {
      toast({
        title: "Missing Fields",
        description: "Please fill out all required fields.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    try {
      const result = await submitTicket(data);
      if (result.success) {
         toast({
          title: "Ticket Submitted Successfully!",
          description: result.message,
        });
        // Reset form if needed
        const form = e.target as HTMLFormElement;
        form.reset();
        // Since name/email/phone are controlled, we don't reset them
        // so they stay pre-filled for the next ticket.
      } else {
         toast({
          title: "Submission Failed",
          description: result.message || "An unknown error occurred.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
        toast({
          title: "Submission Error",
          description: error.message || "Failed to submit ticket. Please try again later.",
          variant: "destructive",
        });
    } finally {
        setLoading(false);
    }
  }

  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-xl">Get in Touch</CardTitle>
            <CardDescription>
              Have a question or need help? Fill out the form below and our team will get back to you shortly.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" name="name" value={name} onChange={e => setName(e.target.value)} required disabled={loading} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" name="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required disabled={loading} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number (Optional)</Label>
                <Input id="phone" name="phone" value={phone} onChange={e => setPhone(e.target.value)} disabled={loading} />
              </div>
               <div className="space-y-2">
                  <Label htmlFor="title">Subject</Label>
                  <Input id="title" name="title" placeholder="e.g., Payment Inquiry, System Offline" required disabled={loading} />
                </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" name="message" placeholder="Describe your issue or request in detail..." rows={5} required disabled={loading}/>
              </div>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? <><Loader className="animate-spin mr-2" /> Submitting...</> : <><Send className="mr-2"/> Submit Ticket</>}
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
                <a href="tel:+254746610345" className="text-primary hover:underline">+254746610345</a>
              </div>
            </div>
             <div className="flex items-start gap-4">
              <MessageSquare className="h-6 w-6 text-muted-foreground mt-1" />
              <div>
                <p className="font-semibold">WhatsApp</p>
                <a href="https://wa.me/254746610345" target="_blank" className="text-primary hover:underline">+254746610345</a>
              </div>
            </div>
             <div className="flex items-start gap-4">
              <MapPin className="h-6 w-6 text-muted-foreground mt-1" />
              <div>
                <p className="font-semibold">Our Office</p>
                <p className="text-sm text-muted-foreground">123 Solar Avenue, Nairobi, Kenya</p>
              </div>
            </div>
          </CardContent>
        </Card>
         <Card>
          <CardHeader>
            <CardTitle className="font-headline text-xl flex items-center gap-2"><FileText className="text-primary" /> Self-Service</CardTitle>
             <CardDescription>
              Find instant answers to common questions.
            </CardDescription>
          </CardHeader>
          <CardContent>
             <Button variant="outline" asChild>
                <Link href="/dashboard/support/faq">Visit FAQ Page</Link>
             </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
