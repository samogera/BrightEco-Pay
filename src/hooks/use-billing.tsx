
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

const getInitialState = () => {
    if (typeof window === 'undefined') {
        return {
            balance: MOCK_MONTHLY_FEE,
            dueDate: addDays(new Date(), 8),
            invoices: [],
        };
    }
    const storedBalance = localStorage.getItem('billingBalance');
    const storedDueDate = localStorage.getItem('billingDueDate');
    const storedInvoices = localStorage.getItem('billingInvoices');

    return {
        balance: storedBalance ? JSON.parse(storedBalance) : MOCK_MONTHLY_FEE,
        dueDate: storedDueDate ? new Date(JSON.parse(storedDueDate)) : addDays(new Date(), 8),
        invoices: storedInvoices ? JSON.parse(storedInvoices).map((inv: any) => ({...inv, date: new Date(inv.date)})) : [],
    }
}


export const BillingProvider = ({ children }: { children: ReactNode }) => {
  const [balance, setBalance] = useState(getInitialState().balance);
  const [dueDate, setDueDate] = useState(getInitialState().dueDate);
  const [invoices, setInvoices] = useState<Invoice[]>(getInitialState().invoices);

  useEffect(() => {
    localStorage.setItem('billingBalance', JSON.stringify(balance));
  }, [balance]);

  useEffect(() => {
    localStorage.setItem('billingDueDate', JSON.stringify(dueDate));
  }, [dueDate]);
  
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
      if (newBalance < MOCK_MONTHLY_FEE) { // If they paid more than or equal to their monthly fee, extend by 30 days
        setDueDate((prevDate) => addDays(prevDate, 30));
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
