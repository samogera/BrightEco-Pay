
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
  Bell,
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
  DropdownMenuShortcut,
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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';


const menuItems = [
  {href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard},
  {href: '/dashboard/devices', label: 'Devices', icon: Smartphone},
  {href: '/dashboard/billing', label: 'Billing', icon: CreditCard},
  {href: '/dashboard/profile', label: 'Profile', icon: User},
  {href: '/dashboard/support', label: 'Support', icon: LifeBuoy},
];

const notifications = [
    { title: "Payment Due Soon", description: "Your next payment of KES 2,550 is due in 5 days.", time: "5m ago" },
    { title: "Device Offline", description: "Solar Panel Array B is offline. Please check connections.", time: "1h ago" },
    { title: "Payment Received", description: "Your payment of KES 1,000 has been successfully processed.", time: "yesterday" },
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
                  <AvatarImage src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName || user.email}&background=primary&color=primary-foreground`} alt={user.displayName || 'User'} />
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
              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings">
                  <Settings className="mr-2" /> Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="mr-2" /> Logout
                <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
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
             <Popover>
                <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon" aria-label="Notifications">
                         <Bell className="h-5 w-5" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80" align="end">
                    <div className="p-4">
                        <h4 className="font-medium text-sm">Notifications</h4>
                         <div className="mt-4 space-y-4">
                            {notifications.map((notification, index) => (
                                <div key={index} className="grid grid-cols-[25px_1fr] items-start pb-4 last:pb-0">
                                    <span className="flex h-2 w-2 translate-y-1.5 rounded-full bg-primary" />
                                    <div className="grid gap-1">
                                        <p className="font-medium text-sm">{notification.title}</p>
                                        <p className="text-xs text-muted-foreground">{notification.description}</p>
                                        <p className="text-xs text-muted-foreground">{notification.time}</p>
                                    </div>
                                </div>
                            ))}
                         </div>
                    </div>
                </PopoverContent>
             </Popover>
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
