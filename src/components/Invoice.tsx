import { useApp } from '../context/AppContext';
import { formatCurrency, formatDate } from '../utils/cn';
import { useState, useRef } from 'react';
import { Printer } from 'lucide-react';

export default function Invoice() {
  const { bookings } = useApp();
  const [selectedBookingId, setSelectedBookingId] = useState('');
  const invoiceRef = useRef<HTMLDivElement>(null);

  const booking = bookings.find(b => b.id === selectedBookingId);

  const handlePrint = () => {
    const content = invoiceRef.current;
    if (!content) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <!DOCTYPE html>
      <html><head><title>Invoice - ${booking?.id}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial, sans-serif; padding: 40px; color: #1a1a1a; }
        .header { display: flex; justify-content: space-between; border-bottom: 2px solid #3b82f6; padding-bottom: 20px; margin-bottom: 30px; }
        .logo { font-size: 24px; font-weight: bold; color: #3b82f6; }
        .invoice-title { text-align: right; }
        .invoice-title h2 { font-size: 20px; color: #3b82f6; }
        .section { margin-bottom: 20px; }
        .section h3 { font-size: 14px; color: #3b82f6; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px; margin-bottom: 10px; text-transform: uppercase; }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .item { padding: 5px 0; }
        .label { font-size: 11px; color: #6b7280; }
        .value { font-size: 13px; font-weight: 500; }
        table { width: 100%; border-collapse: collapse; margin: 10px 0; }
        th, td { padding: 8px 12px; text-align: left; font-size: 12px; border-bottom: 1px solid #e5e7eb; }
        th { background: #f3f4f6; font-weight: 600; }
        .total-row { font-weight: bold; background: #f0fdf4; }
        .footer { margin-top: 30px; padding-top: 15px; border-top: 1px solid #e5e7eb; font-size: 10px; color: #6b7280; }
      </style></head><body>
      ${content.innerHTML}
      </body></html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  if (!booking) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Invoice Generator</h2>
          <p className="text-sm text-slate-500 mt-1">Generate professional invoices from bookings</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-8 max-w-xl">
          <h3 className="font-semibold text-slate-900 mb-4">Select Booking</h3>
          <select value={selectedBookingId} onChange={e => setSelectedBookingId(e.target.value)} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4">
            <option value="">-- Choose a booking --</option>
            {bookings.filter(b => b.bookingStatus !== 'Refunded').map(b => (
              <option key={b.id} value={b.id}>{b.id} - {b.customerName} - {b.sector}</option>
            ))}
          </select>
          <p className="text-sm text-slate-500">Select a booking to generate an invoice preview.</p>
        </div>
      </div>
    );
  }

  const balanceDue = booking.totalCharged - booking.paymentReceived;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Invoice Generator</h2>
          <p className="text-sm text-slate-500 mt-1">Invoice for {booking.id}</p>
        </div>
        <div className="flex gap-2">
          <select value={selectedBookingId} onChange={e => setSelectedBookingId(e.target.value)} className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            {bookings.filter(b => b.bookingStatus !== 'Refunded').map(b => (
              <option key={b.id} value={b.id}>{b.id} - {b.customerName}</option>
            ))}
          </select>
          <button onClick={handlePrint} className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Printer size={14} /> Print / Download PDF
          </button>
        </div>
      </div>

      {/* Invoice Preview */}
      <div ref={invoiceRef} className="bg-white rounded-xl border border-slate-200 p-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-start border-b-4 border-[#0d1b3e] pb-6 mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center shadow">
                <span className="text-[#0d1b3e] font-extrabold text-xl">✈</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#0d1b3e]">RR Tours &amp; Travels</h1>
                <p className="text-xs text-slate-500 italic">Your Journey, Our Responsibility</p>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-2">Jharsuguda, Odisha, India — 768201</p>
            <p className="text-xs text-slate-500">Phone: +91 9827459223 | info.rrenterprises.in@gmail.com</p>
          </div>
          <div className="text-right">
            <h2 className="text-xl font-bold text-[#0d1b3e]">TAX INVOICE</h2>
            <p className="text-sm font-mono text-slate-600 mt-1">Invoice No: RR-INV-{booking.id}</p>
            <p className="text-xs text-slate-500">Date: {formatDate(booking.bookingDate)}</p>
            <p className="text-xs text-slate-500">PNR: {booking.pnr}</p>
          </div>
        </div>

        {/* Customer Details */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-xs font-bold text-blue-600 uppercase mb-2 border-b pb-1">Bill To</h3>
            <p className="font-bold text-slate-900">{booking.customerName}</p>
            {booking.companyName && <p className="text-sm text-slate-600">{booking.companyName}</p>}
            <p className="text-sm text-slate-500">Phone: {booking.customerPhone}</p>
            <p className="text-sm text-slate-500">Email: {booking.customerEmail}</p>
            {booking.city && <p className="text-sm text-slate-500">City: {booking.city}</p>}
            {booking.gstNumber && <p className="text-sm text-slate-500">GSTIN: {booking.gstNumber}</p>}
          </div>
          <div>
            <h3 className="text-xs font-bold text-blue-600 uppercase mb-2 border-b pb-1">Flight Details</h3>
            <p className="text-sm"><span className="text-slate-500">Airline:</span> {booking.airline}</p>
            <p className="text-sm"><span className="text-slate-500">Flight:</span> {booking.flightNumber || 'N/A'}</p>
            <p className="text-sm"><span className="text-slate-500">Route:</span> {booking.sector}</p>
            <p className="text-sm"><span className="text-slate-500">Departure:</span> {formatDate(booking.departureDate)}</p>
            <p className="text-sm"><span className="text-slate-500">Return:</span> {formatDate(booking.returnDate)}</p>
            <p className="text-sm"><span className="text-slate-500">Class:</span> {booking.travelClass}</p>
            <p className="text-sm"><span className="text-slate-500">Passengers:</span> {booking.passengerCount}</p>
          </div>
        </div>

        {/* Fare Breakdown */}
        <table className="w-full mb-6">
          <thead>
            <tr className="bg-slate-50">
              <th className="text-left py-2 px-3 text-xs font-semibold text-slate-600">Description</th>
              <th className="text-right py-2 px-3 text-xs font-semibold text-slate-600">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-slate-100"><td className="py-2 px-3 text-sm">Airline Fare</td><td className="py-2 px-3 text-right text-sm">{formatCurrency(booking.airlineFare)}</td></tr>
            <tr className="border-b border-slate-100"><td className="py-2 px-3 text-sm">Taxes & Fees</td><td className="py-2 px-3 text-right text-sm">{formatCurrency(booking.taxes)}</td></tr>
            <tr className="border-b border-slate-100"><td className="py-2 px-3 text-sm">Service Charge</td><td className="py-2 px-3 text-right text-sm">{formatCurrency(booking.serviceCharge)}</td></tr>
            <tr className="border-b border-slate-100"><td className="py-2 px-3 text-sm">Convenience Fee</td><td className="py-2 px-3 text-right text-sm">{formatCurrency(booking.convenienceFee)}</td></tr>
            <tr className="total-row"><td className="py-3 px-3 text-sm font-bold">Total Amount</td><td className="py-3 px-3 text-right text-sm font-bold text-blue-600">{formatCurrency(booking.totalCharged)}</td></tr>
          </tbody>
        </table>

        {/* Payment Summary */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-xs text-green-600 font-medium">Amount Paid ({booking.paymentMode})</p>
            <p className="text-xl font-bold text-green-700">{formatCurrency(booking.paymentReceived)}</p>
          </div>
          <div className={balanceDue > 0 ? 'bg-red-50 p-4 rounded-lg' : 'bg-green-50 p-4 rounded-lg'}>
            <p className={`text-xs font-medium ${balanceDue > 0 ? 'text-red-600' : 'text-green-600'}`}>{balanceDue > 0 ? 'Balance Due' : 'Fully Paid'}</p>
            <p className={`text-xl font-bold ${balanceDue > 0 ? 'text-red-700' : 'text-green-700'}`}>{formatCurrency(Math.max(0, balanceDue))}</p>
          </div>
        </div>

        {/* Terms */}
        <div className="border-t border-slate-200 pt-4">
          <h3 className="text-xs font-bold text-slate-600 uppercase mb-2">Terms & Conditions</h3>
          <ul className="text-xs text-slate-500 space-y-1">
            <li>1. This invoice is generated based on the booking details provided.</li>
            <li>2. Payment is due within 7 days of invoice date unless otherwise agreed.</li>
            <li>3. Cancellation/refund policies as per airline terms and conditions.</li>
            <li>4. Service charges are non-refundable after ticket issuance.</li>
            <li>5. All disputes subject to Jharsuguda, Odisha jurisdiction only.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
