import Link from 'next/link';

import {Button} from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';

export default function SignupPage() {
  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="font-headline text-2xl">Create an Account</CardTitle>
        <CardDescription>
          Enter your mobile number to get started.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="mobile">Mobile Number</Label>
          <Input id="mobile" type="tel" placeholder="+1 (555) 000-0000" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="code">Verification Code</Label>
          <Input id="code" type="text" placeholder="Enter 6-digit code" />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <Button className="w-full" asChild>
          <Link href="/dashboard">Create Account</Link>
        </Button>
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
