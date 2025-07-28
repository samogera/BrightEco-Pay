
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Logo } from "@/components/shared/Logo";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Loader } from 'lucide-react';


export default function AdminLoginPage() {
    const router = useRouter();
    const { toast } = useToast();
    const { signInWithEmail } = useAuth();
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('admin@brighteco.com');
    const [password, setPassword] = useState('adminpass');

    const handleAdminLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            // In a real app, you'd have specific admin authentication logic
            // For now, we'll use a simple email/password check
            if(email === 'admin@brighteco.com' && password === 'adminpass') {
                await signInWithEmail(email, password).catch(() => {
                    // This might fail if the admin user doesn't exist, we can ignore for demo
                });
                toast({ title: 'Admin Login Successful' });
                router.push('/admin');
            } else {
                 toast({ title: 'Login Failed', description: 'Invalid admin credentials.', variant: 'destructive' });
            }
        } catch (error: any) {
             toast({ title: 'Login Failed', description: error.message, variant: 'destructive' });
        }
        setLoading(false);
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
            <div className="w-full max-w-sm">
                 <div className="flex justify-center mb-8">
                    <Logo />
                </div>
                <form onSubmit={handleAdminLogin}>
                    <Card>
                        <CardHeader className="text-center">
                            <CardTitle className="font-headline text-2xl">Admin Login</CardTitle>
                            <CardDescription>
                                Access the BrightEco Pay management dashboard.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" placeholder="admin@brighteco.com" required value={email} onChange={e => setEmail(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input id="password" type="password" required value={password} onChange={e => setPassword(e.target.value)} />
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col gap-4">
                            <Button className="w-full" type="submit" disabled={loading}>
                                {loading ? <Loader className="animate-spin" /> : 'Login to Admin Dashboard'}
                            </Button>
                              <p className="text-sm text-muted-foreground">
                                Not an admin?{' '}
                                <Link href="/login" className="font-semibold text-primary underline-offset-4 hover:underline">
                                    Return to User Login
                                </Link>
                            </p>
                        </CardFooter>
                    </Card>
                </form>
            </div>
        </div>
    )
}
