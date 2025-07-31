
'use client';

import React, { createContext, useState, useContext, ReactNode } from 'react';
import { addDays } from 'date-fns';

const MOCK_MONTHLY_FEE = 2550;

interface BillingContextType {
  balance: number;
  dueDate: Date;
  makePayment: (amount: number) => void;
}

const BillingContext = createContext<BillingContextType | undefined>(undefined);

export const BillingProvider = ({ children }: { children: ReactNode }) => {
  const [balance, setBalance] = useState(MOCK_MONTHLY_FEE);
  // Set initial due date to 8 days from now to test amber/warning state
  const [dueDate, setDueDate] = useState(addDays(new Date(), 8));

  const makePayment = (amount: number) => {
    if (amount <= 0) {
        throw new Error("Payment amount must be positive.");
    }

    setBalance((prevBalance) => {
      const newBalance = prevBalance - amount;
      // If they pay off a full "cycle", extend the due date by 30 days
      if (amount >= MOCK_MONTHLY_FEE || newBalance <= 0) {
        setDueDate((prevDate) => addDays(prevDate, 30));
      } else {
        // Otherwise, extend proportionally, e.g., 15 days for a half payment.
        const extensionDays = Math.floor((amount / MOCK_MONTHLY_FEE) * 30);
        setDueDate((prevDate) => addDays(prevDate, extensionDays));
      }
      return Math.max(0, newBalance); // Don't let balance go negative
    });
  };

  return (
    <BillingContext.Provider value={{ balance, dueDate, makePayment }}>
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
