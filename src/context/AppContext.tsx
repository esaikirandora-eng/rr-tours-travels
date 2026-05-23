import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Page, Booking, Customer, Payment, Expense, Refund, CorporateClient } from '../types';
import { bookings as initialBookings, customers as initialCustomers, payments as initialPayments, expenses as initialExpenses, refunds as initialRefunds, corporateClients as initialCorporate } from '../data';

interface AppContextType {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  bookings: Booking[];
  setBookings: React.Dispatch<React.SetStateAction<Booking[]>>;
  customers: Customer[];
  setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>;
  payments: Payment[];
  setPayments: React.Dispatch<React.SetStateAction<Payment[]>>;
  expenses: Expense[];
  setExpenses: React.Dispatch<React.SetStateAction<Expense[]>>;
  refunds: Refund[];
  setRefunds: React.Dispatch<React.SetStateAction<Refund[]>>;
  corporateClients: CorporateClient[];
  setCorporateClients: React.Dispatch<React.SetStateAction<CorporateClient[]>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [payments, setPayments] = useState<Payment[]>(initialPayments);
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [refunds, setRefunds] = useState<Refund[]>(initialRefunds);
  const [corporateClients, setCorporateClients] = useState<CorporateClient[]>(initialCorporate);

  return (
    <AppContext.Provider value={{
      currentPage, setCurrentPage,
      bookings, setBookings,
      customers, setCustomers,
      payments, setPayments,
      expenses, setExpenses,
      refunds, setRefunds,
      corporateClients, setCorporateClients,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
