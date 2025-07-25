import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { User, Mail, Phone, MapPin } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-xl">Your Profile</CardTitle>
          <CardDescription>View and manage your account details.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-6">
            <Avatar className="h-20 w-20">
              <AvatarImage src="https://placehold.co/100x100.png" alt="User" data-ai-hint="user avatar" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h2 className="text-2xl font-bold">Alex Doe</h2>
              <p className="text-muted-foreground">alex.doe@example.com</p>
              <p className="text-muted-foreground">+254 712 345 678</p>
            </div>
          </div>
          <Separator />
          <div>
            <h3 className="text-lg font-medium mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="flex items-center gap-2">
                    <User className="text-muted-foreground" />
                    <Input id="name" defaultValue="Alex Doe" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="flex items-center gap-2">
                    <Mail className="text-muted-foreground" />
                    <Input id="email" type="email" defaultValue="alex.doe@example.com" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="flex items-center gap-2">
                    <Phone className="text-muted-foreground" />
                    <Input id="phone" type="tel" defaultValue="+254 712 345 678" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Physical Address</Label>
                <div className="flex items-center gap-2">
                    <MapPin className="text-muted-foreground" />
                    <Input id="address" defaultValue="123 Solar Lane, Nairobi" />
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline">Discard</Button>
            <Button>Save Changes</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
