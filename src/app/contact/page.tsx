
'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { LifeBuoy, Phone, MessageSquare, MapPin, FileText, Send, Mail, HelpCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import Link from "next/link";
import { submitTicket } from "@/ai/flows/submit-ticket";
import { Logo } from "@/components/shared/Logo";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LoadingLogo } from "@/components/shared/LoadingLogo";

export default function ContactPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [subject, setSubject] = useState("");
  const [customSubject, setCustomSubject] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const finalSubject = subject === 'other' ? customSubject : subject;

    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      title: finalSubject,
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
          title: "Message Sent!",
          description: result.message,
        });
        const form = e.target as HTMLFormElement;
        form.reset();
        setSubject("");
        setCustomSubject("");
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
                <Mail className="mx-auto h-12 w-12 text-primary mb-4" />
                <h1 className="font-headline text-3xl md:text-4xl font-bold">
                Contact Us
                </h1>
                <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                Have questions about our solar solutions or want a personalized quote? We'd love to hear from you.
                </p>
            </div>
            <div className="grid gap-12 md:grid-cols-5">
              <div className="md:col-span-3">
                <Card>
                  <CardHeader>
                    <CardTitle className="font-headline text-xl">Send us a Message</CardTitle>
                    <CardDescription>
                      Fill out the form below and our team will get back to you shortly.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-4" onSubmit={handleSubmit}>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input id="name" name="name" required disabled={loading} placeholder="e.g. Jane Doe" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address</Label>
                          <Input id="email" name="email" type="email" required disabled={loading} placeholder="e.g. jane@example.com"/>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number (Optional)</Label>
                        <Input id="phone" name="phone" disabled={loading} placeholder="+254 712 345 678" />
                      </div>
                       <div className="space-y-2">
                          <Label htmlFor="title">Reason for Contact</Label>
                           <Select onValueChange={setSubject} value={subject} required>
                            <SelectTrigger id="subject-select">
                                <SelectValue placeholder="Select a reason..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="General Inquiry">General Inquiry</SelectItem>
                                <SelectItem value="Quote Request">Quote Request</SelectItem>
                                <SelectItem value="Technical Support">Technical Support</SelectItem>
                                <SelectItem value="Partnership">Partnership</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        {subject === 'other' && (
                            <div className="space-y-2">
                                <Label htmlFor="custom-subject">Custom Subject</Label>
                                <Input 
                                    id="custom-subject" 
                                    placeholder="Please specify your subject" 
                                    value={customSubject} 
                                    onChange={(e) => setCustomSubject(e.target.value)} 
                                    required 
                                    disabled={loading} 
                                />
                            </div>
                        )}
                      <div className="space-y-2">
                        <Label htmlFor="message">Message</Label>
                        <Textarea id="message" name="message" placeholder="Tell us about your energy needs..." rows={5} required disabled={loading}/>
                      </div>
                      <Button type="submit" disabled={loading} className="w-full">
                        {loading ? <LoadingLogo /> : <><Send className="mr-2"/> Send Message</>}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-8 md:col-span-2">
                 <Card>
                    <CardHeader>
                        <CardTitle className="font-headline text-lg flex items-center gap-2"><HelpCircle className="text-primary"/> Looking for Answers?</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground mb-4">Check our FAQ page for quick answers to common questions.</p>
                        <Button variant="outline" asChild>
                            <Link href="/faq">Visit FAQ Page</Link>
                        </Button>
                    </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="font-headline text-lg flex items-center gap-2">
                      <LifeBuoy className="text-primary" /> Other Channels
                    </CardTitle>
                    <CardDescription>
                      For immediate assistance, reach us through the channels below.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start gap-4">
                      <Phone className="h-5 w-5 text-muted-foreground mt-1" />
                      <div>
                        <p className="font-semibold">Call Us</p>
                        <a href="tel:+254746610345" className="text-primary hover:underline">+254746610345</a>
                      </div>
                    </div>
                     <div className="flex items-start gap-4">
                      <MessageSquare className="h-5 w-5 text-muted-foreground mt-1" />
                      <div>
                        <p className="font-semibold">WhatsApp</p>
                        <a href="https://wa.me/254746610345" target="_blank" className="text-primary hover:underline">+254746610345</a>
                      </div>
                    </div>
                     <div className="flex items-start gap-4">
                      <MapPin className="h-5 w-5 text-muted-foreground mt-1" />
                      <div>
                        <p className="font-semibold">Our Office</p>
                         <a 
                          href="https://www.google.com/maps/search/?api=1&query=123+Solar+Avenue,+Nairobi,+Kenya" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline"
                        >
                          123 Solar Avenue, Nairobi, Kenya
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
        </div>
      </main>
    </div>
  );
}
