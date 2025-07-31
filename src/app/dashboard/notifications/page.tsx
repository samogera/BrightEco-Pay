
'use client';

import { useNotifications, Notification } from '@/hooks/use-notifications';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Bell, Loader, CreditCard, Sun, Wallet } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { LoadingLogo } from '@/components/shared/LoadingLogo';

const iconMap: { [key in Notification['type']]: React.ElementType } = {
    payment: CreditCard,
    device: Sun,
    wallet: Wallet,
    alert: Bell,
};

export default function NotificationsPage() {
    const { notifications, loading, markAsRead, markAllAsRead, unreadCount } = useNotifications();

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold font-headline">Notifications</h1>
                    <p className="text-muted-foreground">View and manage all your account notifications.</p>
                </div>
                 {unreadCount > 0 && (
                    <Button onClick={markAllAsRead}>
                        <Check className="mr-2" /> Mark All as Read
                    </Button>
                )}
            </div>
            
            <Card>
                <CardContent className="p-0">
                    {loading ? (
                        <div className="flex justify-center items-center h-48">
                            <LoadingLogo />
                        </div>
                    ) : notifications.length > 0 ? (
                        <ul className="divide-y">
                            {notifications.map((notification) => {
                                const Icon = iconMap[notification.type] || Bell;
                                return (
                                <li key={notification.id} className={cn("p-4 flex items-start gap-4 transition-colors hover:bg-muted/50", !notification.isRead && "bg-primary/5")}>
                                    <div className={cn("mt-1 p-2 rounded-full bg-muted/80", !notification.isRead && "bg-primary/20")}>
                                       <Icon className={cn("h-5 w-5 text-muted-foreground", !notification.isRead && "text-primary")} />
                                    </div>
                                    <div className="flex-grow">
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-semibold">{notification.title}</h3>
                                            <p className="text-xs text-muted-foreground whitespace-nowrap pl-4">{formatDistanceToNow(notification.timestamp, { addSuffix: true })}</p>
                                        </div>
                                        <p className="text-sm text-muted-foreground mt-1">{notification.description}</p>
                                        
                                        <div className="mt-2 flex items-center justify-between">
                                            <Badge variant={notification.isRead ? 'secondary' : 'default'}>
                                                {notification.isRead ? 'Read' : 'Unread'}
                                            </Badge>
                                            {!notification.isRead && (
                                                <Button size="sm" variant="outline" onClick={() => markAsRead(notification.id)}>
                                                    Mark as Read
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </li>
                            )})}
                        </ul>
                    ) : (
                        <div className="text-center p-12 text-muted-foreground">
                            <Bell className="mx-auto h-12 w-12 mb-4" />
                            <h3 className="text-lg font-semibold">No notifications yet</h3>
                            <p className="text-sm">We'll let you know when something important happens.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

