
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Bell, FileText, Shield, Trash2 } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

export default function SettingsPage() {
    const { toast } = useToast();

    return (
        <div className="space-y-8 max-w-3xl mx-auto">
             <div>
                <h1 className="text-2xl font-bold font-headline">Settings</h1>
                <p className="text-muted-foreground">Manage your account and notification preferences.</p>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Bell /> Notifications</CardTitle>
                    <CardDescription>Choose how you want to be notified.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                        <div>
                            <Label htmlFor="email-notifications" className="font-medium">Email Notifications</Label>
                            <p className="text-sm text-muted-foreground">Receive emails for payment reminders, system alerts, and promotions.</p>
                        </div>
                        <Switch id="email-notifications" defaultChecked />
                    </div>
                     <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                        <div>
                            <Label htmlFor="sms-notifications" className="font-medium">SMS Notifications</Label>
                            <p className="text-sm text-muted-foreground">Get critical alerts and payment confirmations via SMS.</p>
                        </div>
                        <Switch id="sms-notifications" />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Shield /> Account & Privacy</CardTitle>
                    <CardDescription>Manage your account data and view our policies.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                     <div className="flex items-center justify-between">
                        <p className="font-medium">Privacy Policy</p>
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/privacy-policy" target="_blank">View Policy <FileText className="ml-2 h-4 w-4" /></Link>
                        </Button>
                    </div>
                     <Separator />
                     <div className="flex items-center justify-between">
                        <p className="font-medium">Terms of Service</p>
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/terms-of-service" target="_blank">View Terms <FileText className="ml-2 h-4 w-4" /></Link>
                        </Button>
                    </div>
                    <Separator />
                     <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium text-destructive">Delete Account</p>
                            <p className="text-sm text-muted-foreground">Permanently delete your account and all associated data.</p>
                        </div>
                        <Button 
                            variant="destructive" 
                            size="sm" 
                            onClick={() => toast({ title: "Action Not Available", description: "This feature is not yet implemented.", variant: "destructive"})}
                        >
                            Delete <Trash2 className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
