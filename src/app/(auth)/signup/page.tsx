
'use client';

import Link from 'next/link';
import { Mail, Phone } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { LoadingLogo } from '@/components/shared/LoadingLogo';


function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 48 48"
            width="24px"
            height="24px"
            {...props}
        >
            <path
                fill="#FFC107"
                d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
            />
            <path
                fill="#FF3D00"
                d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
            />
            <path
                fill="#4CAF50"
                d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.651-3.356-11.303-8H6.306C9.656,35.663,16.318,40,24,40z"
            />
            <path
                fill="#1976D2"
                d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.089,5.571l6.19,5.238C39.902,35.619,44,29.582,44,24C44,22.659,43.862,21.35,43.611,20.083z"
            />
        </svg>
    );
}

export default function SignupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { signUpWithEmail, signInWithGoogle, signInWithPhone } = useAuth();
  const [loading, setLoading] = useState(false);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<any>(null);

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
        toast({ title: 'Password Too Short', description: 'Password must be at least 6 characters long.', variant: 'destructive' });
        return;
    }
    if (password !== confirmPassword) {
        toast({ title: 'Passwords do not match', variant: 'destructive' });
        return;
    }
    setLoading(true);
    try {
      await signUpWithEmail(email, password);
      toast({ title: 'Account Created', description: 'Welcome! You can now log in.' });
      router.push('/dashboard');
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
         toast({ title: 'Sign-up Failed', description: 'This email is already registered. Please log in instead.', variant: 'destructive' });
      } else {
        toast({ title: 'Sign-up Failed', description: error.message, variant: 'destructive' });
      }
    }
    setLoading(false);
  };
  
  const handleGoogleSignup = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
      toast({ title: 'Login Successful', description: 'Welcome!' });
      router.push('/dashboard');
    } catch (error: any) {
      toast({ title: 'Sign-up Failed', description: error.message, variant: 'destructive' });
    }
    setLoading(false);
  };

  const handleSendCode = async () => {
    setLoading(true);
    try {
      const result = await signInWithPhone(phone);
      setConfirmationResult(result);
      toast({ title: 'Code Sent', description: 'A verification code has been sent to your phone.' });
    } catch (error: any) {
      toast({ title: 'Failed to Send Code', description: error.message, variant: 'destructive' });
    }
    setLoading(false);
  }

  const handlePhoneSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmationResult) {
        toast({ title: 'Verification Needed', description: 'Please request a verification code first.', variant: 'destructive' });
        return;
    }
    setLoading(true);
    try {
        await confirmationResult.confirm(code);
        toast({ title: 'Account Created', description: 'Welcome!' });
        router.push('/dashboard');
    } catch (error: any) {
        toast({ title: 'Sign-up Failed', description: 'The verification code is invalid.', variant: 'destructive' });
    }
    setLoading(false);
  }


  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="font-headline text-2xl">Create an Account</CardTitle>
        <CardDescription>
          Join our community for clean, reliable energy.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div id="recaptcha-container"></div>
        <Tabs defaultValue="email" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="email"><Mail className="mr-2" /> Email</TabsTrigger>
            <TabsTrigger value="phone"><Phone className="mr-2" /> Phone</TabsTrigger>
          </TabsList>
          <TabsContent value="email" className="mt-6">
            <form className="space-y-4" onSubmit={handleEmailSignup}>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="user@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} disabled={loading} />
              </div>
               <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input id="confirm-password" type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} disabled={loading} />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <LoadingLogo /> : 'Create Account with Email'}
              </Button>
            </form>
          </TabsContent>
          <TabsContent value="phone" className="mt-6">
            <form className="space-y-4" onSubmit={handlePhoneSignup}>
              <div className="space-y-2">
                <Label htmlFor="mobile">Mobile Number</Label>
                 <div className="flex gap-2">
                    <Input id="mobile" type="tel" placeholder="+254 712 345 678" required value={phone} onChange={(e) => setPhone(e.target.value)} disabled={loading || !!confirmationResult} />
                    <Button type="button" variant="outline" onClick={handleSendCode} disabled={loading || !!confirmationResult}>
                        {loading ? <LoadingLogo /> : 'Send Code'}
                    </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="code">Verification Code</Label>
                <Input id="code" type="text" placeholder="Enter 6-digit code" required value={code} onChange={(e) => setCode(e.target.value)} disabled={loading || !confirmationResult} />
              </div>
              <Button type="submit" className="w-full" disabled={loading || !confirmationResult}>
                 {loading ? <LoadingLogo /> : 'Create Account with Phone'}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
         <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or sign up with</span>
            </div>
        </div>

        <Button variant="outline" className="w-full" onClick={handleGoogleSignup} disabled={loading}>
          {loading ? <LoadingLogo /> : <><GoogleIcon className="mr-2" />Sign up with Google</>}
        </Button>
      </CardContent>
      <CardFooter className="flex-col gap-4 mt-4">
        <p className="text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-primary underline-offset-4 hover:underline">
            Log in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
