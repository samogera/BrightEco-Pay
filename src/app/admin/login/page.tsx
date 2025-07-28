import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Logo } from "@/components/shared/Logo";


export default function AdminLoginPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
            <div className="w-full max-w-sm">
                 <div className="flex justify-center mb-8">
                    <Logo />
                </div>
                <form>
                    <Card>
                        <CardHeader className="text-center">
                            <CardTitle className="font-headline text-2xl">Admin Access</CardTitle>
                            <CardDescription>
                                Enter your credentials to access the admin dashboard.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" placeholder="admin@brighteco.com" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input id="password" type="password" required />
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col gap-4">
                            <Button className="w-full" asChild>
                                <Link href="/admin">Login</Link>
                            </Button>
                              <p className="text-sm text-muted-foreground">
                                Not an admin?{' '}
                                <Link href="/login" className="font-semibold text-primary underline-offset-4 hover:underline">
                                    User login
                                </Link>
                            </p>
                        </CardFooter>
                    </Card>
                </form>
            </div>
        </div>
    )
}