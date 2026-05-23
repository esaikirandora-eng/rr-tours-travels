export interface Customer {
  id: string;
  fullName: string;
  phone: string;
  whatsapp: string;
  email: string;
  dob: string;
  passportNumber: string;
  passportExpiry: string;
  frequentRoutes: string;
  totalBookings: number;
  totalRevenue: number;
  preferredAirline: string;
  tag: 'Corporate' | 'Individual';
  companyName?: string;
  gstNumber?: string;
  city: string;
  address: string;
  notes: string;
}

export interface Booking {
  id: string;
  bookingDate: string;
  pnr: string;
  ticketNumber: string;
  source: 'Direct' | 'Website' | 'Agent' | 'Corporate';
  type: 'Domestic' | 'International';
  airline: string;
  flightNumber: string;
  sector: string;
  departureDate: string;
  returnDate: string;
  travelClass: 'Economy' | 'Premium Economy' | 'Business' | 'First Class';
  passengerCount: number;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerWhatsapp: string;
  customerEmail: string;
  customerDob: string;
  passportNumber: string;
  passportExpiry: string;
  gstNumber: string;
  companyName: string;
  city: string;
  emergencyContact: string;
  airlineFare: number;
  taxes: number;
  serviceCharge: number;
  convenienceFee: number;
  markupAdded: number;
  totalCharged: number;
  actualTicketCost: number;
  profitEarned: number;
  paymentReceived: number;
  paymentMode: 'Cash' | 'UPI' | 'Credit Card' | 'Debit Card' | 'Net Banking' | 'Cheque' | 'Bank Transfer';
  pendingAmount: number;
  refundAmount: number;
  refundStatus: 'N/A' | 'Pending' | 'Processed' | 'Rejected';
  bookingStatus: 'Confirmed' | 'Cancelled' | 'Hold' | 'Refunded' | 'Travelled';
  staffName: string;
  followUpRequired: boolean;
  remarks: string;
}

export interface Payment {
  id: string;
  bookingId: string;
  customerName: string;
  amountReceived: number;
  amountPending: number;
  paymentDate: string;
  paymentMode: string;
  utrNumber: string;
  refundProcessed: boolean;
  refundDate: string;
  vendorPaymentStatus: 'Paid' | 'Pending' | 'Partial';
}

export interface Expense {
  id: string;
  category: string;
  description: string;
  amount: number;
  date: string;
  paymentMode: string;
  receiptNumber: string;
}

export interface Refund {
  id: string;
  bookingId: string;
  customerName: string;
  airline: string;
  cancellationDate: string;
  refundExpected: number;
  refundReceived: number;
  airlineCharges: number;
  agencyLoss: number;
  refundStatus: 'Pending' | 'Processed' | 'Rejected';
  refundPendingDays: number;
}

export interface CorporateClient {
  id: string;
  companyName: string;
  contactPerson: string;
  gstNumber: string;
  creditLimit: number;
  paymentCycle: string;
  outstandingAmount: number;
  monthlyBusinessVolume: number;
  phone: string;
  email: string;
}

export interface ExpenseCategory {
  name: string;
  color: string;
  budget: number;
}

export type Page = 'dashboard' | 'bookings' | 'customers' | 'payments' | 'profit-loss' | 'expenses' | 'refunds' | 'corporate' | 'reports' | 'invoice' | 'leads' | 'deploy';
