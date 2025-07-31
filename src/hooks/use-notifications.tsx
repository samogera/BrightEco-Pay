
'use client';

import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import { useAuth } from './use-auth';
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, Timestamp, writeBatch, doc, setDoc } from 'firebase/firestore';
import { app } from '@/lib/firebase';
import { CreditCard, Sun, Wallet, Bell } from 'lucide-react';

export interface Notification {
    id: string;
    type: 'payment' | 'device' | 'wallet' | 'alert';
    title: string;
    description: string;
    link?: string;
    isRead: boolean;
    timestamp: Date;
}

interface NotificationsContextType {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  addNotification: (notification: Omit<Notification, 'id' | 'isRead' | 'timestamp'>) => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export const NotificationsProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  useEffect(() => {
    if (!user) {
        setNotifications([]);
        setLoading(false);
        return;
    }

    setLoading(true);
    const db = getFirestore(app);
    const notificationsQuery = query(collection(db, 'users', user.uid, 'notifications'), orderBy('timestamp', 'desc'));

    const unsubscribe = onSnapshot(notificationsQuery, (snapshot) => {
        const userNotifications: Notification[] = [];
        snapshot.forEach(doc => {
            const data = doc.data();
            if (data.timestamp) { // Check if the timestamp field is not null
                userNotifications.push({
                    id: doc.id,
                    ...data,
                    timestamp: (data.timestamp as Timestamp).toDate(),
                } as Notification);
            }
        });
        setNotifications(userNotifications);
        setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const addNotification = useCallback(async (notificationData: Omit<Notification, 'id' | 'isRead' | 'timestamp'>) => {
    if (!user) throw new Error("User not authenticated");
    const db = getFirestore(app);
    const notificationsColRef = collection(db, 'users', user.uid, 'notifications');
    await addDoc(notificationsColRef, {
        ...notificationData,
        isRead: false,
        timestamp: serverTimestamp(),
    });
  }, [user]);

  const markAsRead = useCallback(async (id: string) => {
    if (!user) throw new Error("User not authenticated");
    const db = getFirestore(app);
    const notifDocRef = doc(db, 'users', user.uid, 'notifications', id);
    await setDoc(notifDocRef, { isRead: true }, { merge: true });
  }, [user]);

  const markAllAsRead = useCallback(async () => {
    if (!user || unreadCount === 0) return;
    const db = getFirestore(app);
    const batch = writeBatch(db);
    notifications.forEach(notification => {
        if (!notification.isRead) {
            const notifDocRef = doc(db, 'users', user.uid, 'notifications', notification.id);
            batch.update(notifDocRef, { isRead: true });
        }
    });
    await batch.commit();
  }, [user, notifications, unreadCount]);

  const value = { notifications, unreadCount, loading, addNotification, markAsRead, markAllAsRead };

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }
  return context;
};
