
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Bell, FileText, Shield, Trash2, Loader } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";


export default function SettingsPage() {
    const { toast } = useToast();
    const { signOut } = useAuth();
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDeleteAccount = async () => {
        setIsDeleting(true);
        // In a real app, you would make an API call to delete the user's data from your database
        // and then delete their Firebase Auth account.
        console.log("Simulating account deletion...");
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        try {
            await signOut();
            toast({
                title: "Account Deleted",
                description: "Your account and all associated data have been permanently deleted.",
            });
            router.push('/');
        } catch (error: any) {
            toast({
                title: "Deletion Failed",
                description: "Could not sign out after deletion. Please clear your cookies.",
                variant: "destructive"
            })
        } finally {
            setIsDeleting(false);
        }
    }


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
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button 
                                    variant="destructive" 
                                    size="sm"
                                >
                                    Delete <Trash2 className="ml-2 h-4 w-4" />
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete your
                                    account and remove your data from our servers.
                                </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={handleDeleteAccount}
                                    disabled={isDeleting}
                                    className="bg-destructive hover:bg-destructive/90"
                                >
                                    {isDeleting ? <Loader className="animate-spin" /> : "Yes, delete account"}
                                </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
