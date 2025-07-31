
'use client';

import Link from 'next/link';
import {usePathname, useRouter} from 'next/navigation';
import {
  CreditCard,
  LayoutDashboard,
  LogOut,
  PanelLeft,
  Settings,
  Smartphone,
  User,
  LifeBuoy,
  Moon,
  Sun,
  Loader,
  BookOpen,
} from 'lucide-react';
import type {PropsWithChildren} from 'react';

import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {Button} from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import {Logo} from '@/components/shared/Logo';
import { useTheme } from 'next-themes';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import React from 'react';


const menuItems = [
  {href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard},
  {href: '/dashboard/devices', label: 'Devices', icon: Smartphone},
  {href: '/dashboard/billing', label: 'Billing', icon: CreditCard},
  {href: '/dashboard/profile', label: 'Profile', icon: User},
  {href: '/dashboard/support', label: 'Support', icon: LifeBuoy},
];

export default function DashboardLayout({children}: PropsWithChildren) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { user, loading, signOut } = useAuth();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({ title: 'Signed Out', description: 'You have been successfully signed out.' });
      router.push('/login');
    } catch (error: any) {
      toast({ title: 'Sign Out Failed', description: error.message, variant: 'destructive' });
    }
  };

  React.useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);
  
  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="group-data-[collapsible=icon]:hidden">
            <Logo />
          </div>
          <div className="hidden group-data-[collapsible=icon]:block">
            <Logo />
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {menuItems.map(item => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname.startsWith(item.href) && (item.href !== '/dashboard' || pathname === '/dashboard')}
                  tooltip={{children: item.label}}
                >
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-3 w-full p-2 rounded-md outline-none text-left text-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground ring-sidebar-ring focus-visible:ring-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.photoURL || "https://placehold.co/40x40.png"} alt={user.displayName || 'User'} data-ai-hint="user avatar" />
                  <AvatarFallback>{user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}</AvatarFallback>
                </Avatar>
                <span className="group-data-[collapsible=icon]:hidden font-medium truncate">
                  {user.displayName || user.email}
                </span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="right" align="start" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard/profile">
                  <User className="mr-2" /> Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2" /> Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="mr-2" /> Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex items-center justify-between p-4 border-b bg-card sticky top-0 z-10">
          <SidebarTrigger>
            <PanelLeft />
          </SidebarTrigger>
          <div className="flex items-center gap-4">
             <h1 className="font-headline text-xl font-semibold capitalize hidden sm:block">{pathname.split('/').pop()?.replace('-', ' ') || 'Dashboard'}</h1>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                aria-label="Toggle theme"
              >
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-background">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
