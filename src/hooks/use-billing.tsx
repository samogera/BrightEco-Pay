
'use client';

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { addDays } from 'date-fns';

const MOCK_MONTHLY_FEE = 2550;

export interface Invoice {
    id: string;
    amount: number;
    date: Date;
    method: string;
    status: 'Paid' | 'Pending' | 'Failed';
    details: string;
}

interface BillingContextType {
  balance: number;
  dueDate: Date;
  invoices: Invoice[];
  makePayment: (amount: number) => void;
  addInvoice: (invoice: Invoice) => void;
}

const BillingContext = createContext<BillingContextType | undefined>(undefined);

export const BillingProvider = ({ children }: { children: ReactNode }) => {
  const [balance, setBalance] = useState(MOCK_MONTHLY_FEE);
  const [dueDate, setDueDate] = useState(addDays(new Date(), 8));
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  useEffect(() => {
    // In a real app, you would fetch these from Firestore
    const storedInvoices = localStorage.getItem('billingInvoices');
    if(storedInvoices) {
        setInvoices(JSON.parse(storedInvoices).map((inv: any) => ({...inv, date: new Date(inv.date)})));
    }
  }, [])
  
  const addInvoice = (invoice: Invoice) => {
    setInvoices(prev => {
        const newInvoices = [invoice, ...prev];
        localStorage.setItem('billingInvoices', JSON.stringify(newInvoices));
        return newInvoices;
    });
  }

  const makePayment = (amount: number) => {
    if (amount <= 0) {
        throw new Error("Payment amount must be positive.");
    }

    setBalance((prevBalance) => {
      const newBalance = prevBalance - amount;
      if (amount >= MOCK_MONTHLY_FEE || newBalance <= 0) {
        setDueDate((prevDate) => addDays(prevDate, 30));
      } else {
        const extensionDays = Math.floor((amount / MOCK_MONTHLY_FEE) * 30);
        setDueDate((prevDate) => addDays(prevDate, extensionDays));
      }
      return Math.max(0, newBalance);
    });
  };

  return (
    <BillingContext.Provider value={{ balance, dueDate, makePayment, invoices, addInvoice }}>
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
