
'use client';

import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import { addDays, addMonths } from 'date-fns';
import { useAuth } from './use-auth';
import { getFirestore, doc, setDoc, getDoc, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, Timestamp } from 'firebase/firestore';
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
}

interface BillingContextType extends BillingState {
  invoices: Invoice[];
  loading: boolean;
  makePayment: (amount: number) => Promise<void>;
  addInvoice: (invoice: Omit<Invoice, 'id' | 'date'>) => Promise<void>;
}

const BillingContext = createContext<BillingContextType | undefined>(undefined);

export const BillingProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [billingState, setBillingState] = useState<BillingState>({ balance: MOCK_MONTHLY_FEE, dueDate: addDays(new Date(), 8) });
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
        setLoading(false);
        setBillingState({ balance: MOCK_MONTHLY_FEE, dueDate: addDays(new Date(), 8) });
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
            });
        } else {
            // Initialize for new user
            const initialDueDate = addDays(new Date(), 30);
            setDoc(billingDocRef, { balance: MOCK_MONTHLY_FEE, dueDate: initialDueDate });
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

  const makePayment = useCallback(async (amount: number) => {
    if (!user) throw new Error("User not authenticated");
    if (amount <= 0) throw new Error("Payment amount must be positive.");

    const db = getFirestore(app);
    const billingDocRef = doc(db, 'billing', user.uid);

    setBillingState(prevState => {
        const newBalance = prevState.balance - amount;
        let newDueDate = prevState.dueDate || new Date();

        if (newBalance < prevState.balance) {
             // If they paid off a full monthly fee, extend by 30 days
             const monthsPaid = Math.floor((prevState.balance - newBalance) / MOCK_MONTHLY_FEE);
             if (monthsPaid > 0) {
                 newDueDate = addMonths(newDueDate, monthsPaid);
             }

             // Handle overpayment by extending due date further
             if (newBalance < 0) {
                const credit = Math.abs(newBalance);
                const extraDays = Math.floor((credit / MOCK_MONTHLY_FEE) * 30);
                newDueDate = addDays(newDueDate, extraDays);
             }
        }
        
        const updatedState = {
            balance: Math.max(0, newBalance),
            dueDate: newDueDate,
        };

        // Update firestore
        setDoc(billingDocRef, updatedState, { merge: true });
        
        return updatedState;
    });

  }, [user]);

  const value = { ...billingState, invoices, loading, makePayment, addInvoice };

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
