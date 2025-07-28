
'use client';

import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { User, Mail, Phone, MapPin, Upload, Loader } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';

export default function ProfilePage() {
  const { toast } = useToast();
  const { user, updateUserProfile, updateUserAvatar } = useAuth();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('123 Solar Lane, Nairobi');
  const [avatar, setAvatar] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
        setName(user.displayName || '');
        setEmail(user.email || '');
        setPhone(user.phoneNumber || '');
        setAvatar(user.photoURL || `https://placehold.co/100x100.png?text=${(user.displayName || 'U').charAt(0)}`);
    }
  }, [user]);

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
        if (avatarFile) {
            const photoURL = await updateUserAvatar(avatarFile);
            await updateUserProfile({ displayName: name, photoURL });
            setAvatar(photoURL);
            setAvatarFile(null);
        } else {
            await updateUserProfile({ displayName: name });
        }
        
      toast({
        title: 'Profile Updated',
        description: 'Your profile information has been saved.',
      });
    } catch(error: any) {
        toast({ title: 'Update Failed', description: error.message, variant: 'destructive' });
    }
    setLoading(false);
  };
  
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
        setAvatarFile(file);
      };
      reader.readAsDataURL(file);
    }
  }

  if (!user) {
    return <div className="flex items-center justify-center"><Loader className="animate-spin" /></div>
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-xl">Your Profile</CardTitle>
          <CardDescription>View and manage your account details.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSaveChanges}>
            <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="relative">
                <Avatar className="h-24 w-24">
                    <AvatarImage src={avatar} alt={name} data-ai-hint="user avatar" />
                    <AvatarFallback>{name.charAt(0) || 'U'}</AvatarFallback>
                </Avatar>
                <Button asChild size="icon" className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full">
                    <Label htmlFor="avatar-upload">
                        <Upload />
                        <span className="sr-only">Upload Avatar</span>
                    </Label>
                </Button>
                <Input id="avatar-upload" type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
                </div>
                <div className="text-center md:text-left">
                <h2 className="text-2xl font-bold">{name}</h2>
                <p className="text-muted-foreground">{email}</p>
                <p className="text-muted-foreground">{phone}</p>
                </div>
            </div>
            <Separator className="my-6" />

            <h3 className="text-lg font-medium mb-4">Edit Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="flex items-center gap-2">
                        <User className="text-muted-foreground" />
                        <Input id="name" value={name} onChange={e => setName(e.target.value)} />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="flex items-center gap-2">
                        <Mail className="text-muted-foreground" />
                        <Input id="email" type="email" value={email} disabled />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="flex items-center gap-2">
                        <Phone className="text-muted-foreground" />
                        <Input id="phone" type="tel" value={phone} onChange={e => setPhone(e.target.value)} disabled />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="address">Physical Address</Label>
                    <div className="flex items-center gap-2">
                        <MapPin className="text-muted-foreground" />
                        <Input id="address" value={address} onChange={e => setAddress(e.target.value)} />
                    </div>
                </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
                <Button type="button" variant="outline" disabled={loading}>Discard</Button>
                <Button type="submit" disabled={loading}>
                    {loading ? <Loader className="animate-spin" /> : 'Save Changes'}
                </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
