
'use client';

import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import { addDays, addMonths } from 'date-fns';
import { useAuth } from './use-auth';
import { getFirestore, doc, setDoc, getDoc, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, Timestamp, runTransaction } from 'firebase/firestore';
import { app } from '@/lib/firebase';

const MOCK_MONTHLY_FEE = 2550;

export interface Invoice {
    id: string;
    amount: number;
    date: Date;
    method: string;
    status: 'Paid' | 'Pending' | 'Failed';
    details: string;
}

interface BillingState {
    balance: number;
    dueDate: Date | null;
    walletBalance: number;
}

interface BillingContextType extends BillingState {
  invoices: Invoice[];
  loading: boolean;
  makePayment: (amount: number) => Promise<void>;
  addInvoice: (invoice: Omit<Invoice, 'id' | 'date'>) => Promise<void>;
  addToWallet: (amount: number) => Promise<void>;
}

const BillingContext = createContext<BillingContextType | undefined>(undefined);

export const BillingProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [billingState, setBillingState] = useState<BillingState>({ balance: MOCK_MONTHLY_FEE, dueDate: addDays(new Date(), 8), walletBalance: 0 });
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
        setLoading(false);
        setBillingState({ balance: MOCK_MONTHLY_FEE, dueDate: addDays(new Date(), 8), walletBalance: 0 });
        setInvoices([]);
        return;
    }

    setLoading(true);
    const db = getFirestore(app);
    const billingDocRef = doc(db, 'billing', user.uid);
    const invoicesQuery = query(collection(db, 'billing', user.uid, 'invoices'), orderBy('date', 'desc'));

    const unsubscribeBilling = onSnapshot(billingDocRef, (doc) => {
        if (doc.exists()) {
            const data = doc.data();
            setBillingState({
                balance: data.balance,
                dueDate: (data.dueDate as Timestamp)?.toDate() || null,
                walletBalance: data.walletBalance || 0
            });
        } else {
            const initialDueDate = addDays(new Date(), 30);
            const initialData = { balance: MOCK_MONTHLY_FEE, dueDate: initialDueDate, walletBalance: 0 };
            setDoc(billingDocRef, initialData);
        }
        setLoading(false);
    });

    const unsubscribeInvoices = onSnapshot(invoicesQuery, (snapshot) => {
        const userInvoices: Invoice[] = [];
        snapshot.forEach(doc => {
            const data = doc.data();
            userInvoices.push({
                id: doc.id,
                ...data,
                date: (data.date as Timestamp).toDate(),
            } as Invoice);
        });
        setInvoices(userInvoices);
    });

    return () => {
        unsubscribeBilling();
        unsubscribeInvoices();
    }
  }, [user]);

  const addInvoice = useCallback(async (invoiceData: Omit<Invoice, 'id' | 'date'>) => {
    if (!user) throw new Error("User not authenticated");
    const db = getFirestore(app);
    const invoicesColRef = collection(db, 'billing', user.uid, 'invoices');
    await addDoc(invoicesColRef, {
        ...invoiceData,
        date: serverTimestamp(),
    });
  }, [user]);

  const addToWallet = useCallback(async (amount: number) => {
    if (!user) throw new Error("User not authenticated");
    if (amount <= 0) throw new Error("Top-up amount must be positive.");
    const db = getFirestore(app);
    const billingDocRef = doc(db, 'billing', user.uid);

    await runTransaction(db, async (transaction) => {
        const billingDoc = await transaction.get(billingDocRef);
        if (!billingDoc.exists()) {
            throw new Error("Billing document does not exist!");
        }
        const currentWallet = billingDoc.data().walletBalance || 0;
        const newWallet = currentWallet + amount;
        transaction.update(billingDocRef, { walletBalance: newWallet });
    });

  }, [user]);

  const makePayment = useCallback(async (amount: number) => {
    if (!user) throw new Error("User not authenticated");
    if (amount <= 0) throw new Error("Payment amount must be positive.");

    const db = getFirestore(app);
    const billingDocRef = doc(db, 'billing', user.uid);

    await runTransaction(db, async (transaction) => {
        const billingDoc = await transaction.get(billingDocRef);
        if (!billingDoc.exists()) {
            throw new Error("Billing document does not exist!");
        }
        
        const data = billingDoc.data();
        const currentBalance = data.balance;
        const currentDueDate = (data.dueDate as Timestamp).toDate();

        const newBalance = currentBalance - amount;
        let newDueDate = currentDueDate || new Date();

        if (newBalance < currentBalance) {
             const monthsPaid = Math.floor(amount / MOCK_MONTHLY_FEE);
             if (monthsPaid > 0) {
                 newDueDate = addMonths(newDueDate, monthsPaid);
             }

             if (newBalance < 0) {
                const credit = Math.abs(newBalance);
                const extraDays = Math.floor((credit / MOCK_MONTHLY_FEE) * 30);
                newDueDate = addDays(newDueDate, extraDays);
             }
        }
        
        transaction.update(billingDocRef, { 
            balance: Math.max(0, newBalance),
            dueDate: newDueDate,
        });
    });

  }, [user]);

  const value = { ...billingState, invoices, loading, makePayment, addInvoice, addToWallet };

  return (
    <BillingContext.Provider value={value}>
      {children}
    </BillingContext.Provider>
  );
};

export const useBilling = () => {
  const context = useContext(BillingContext);
  if (context === undefined) {
    throw new Error('useBilling must be used within a BillingProvider');
  }
  return context;
};
