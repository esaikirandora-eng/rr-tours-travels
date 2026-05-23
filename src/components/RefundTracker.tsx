import { useApp } from '../context/AppContext';
import { formatCurrency, formatDate } from '../utils/cn';
import { useState } from 'react';
import { AlertTriangle, Plus, X, Clock, CheckCircle } from 'lucide-react';

export default function RefundTracker() {
  const { refunds } = useApp();
  const [showAdd, setShowAdd] = useState(false);

  const totalExpected = refunds.reduce((s, r) => s + r.refundExpected, 0);
  const totalReceived = refunds.reduce((s, r) => s + r.refundReceived, 0);
  const totalLoss = refunds.reduce((s, r) => s + r.agencyLoss, 0);
  const pendingCount = refunds.filter(r => r.refundStatus === 'Pending').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Refund & Cancellation Tracker</h2>
          <p className="text-sm text-slate-500 mt-1">Track cancelled tickets and refund processing</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Plus size={14} /> Add Refund
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 rounded-xl p-5">
          <p className="text-sm font-medium text-amber-600">Total Refund Expected</p>
          <p className="text-2xl font-bold text-amber-700 mt-1">{formatCurrency(totalExpected)}</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-5">
          <p className="text-sm font-medium text-green-600">Total Refund Received</p>
          <p className="text-2xl font-bold text-green-700 mt-1">{formatCurrency(totalReceived)}</p>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-xl p-5">
          <p className="text-sm font-medium text-red-600">Total Agency Loss</p>
          <p className="text-2xl font-bold text-red-700 mt-1">{formatCurrency(totalLoss)}</p>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-5">
          <p className="text-sm font-medium text-blue-600">Pending Refunds</p>
          <p className="text-2xl font-bold text-blue-700 mt-1">{pendingCount}</p>
        </div>
      </div>

      {/* Refund Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {refunds.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-4 py-3 text-left font-medium text-slate-600">Refund ID</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-600">Booking ID</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-600">Customer</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-600">Airline</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-600">Cancel Date</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-600">Expected</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-600">Received</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-600">Airline Charges</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-600">Agency Loss</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-600">Pending Days</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-600">Status</th>
                </tr>
              </thead>
              <tbody>
                {refunds.map(r => (
                  <tr key={r.id} className={`border-b border-slate-100 hover:bg-slate-50 ${r.refundStatus === 'Pending' && r.refundPendingDays > 14 ? 'bg-red-50/50' : ''}`}>
                    <td className="px-4 py-3 font-mono text-xs text-blue-600">{r.id}</td>
                    <td className="px-4 py-3 font-mono text-xs">{r.bookingId}</td>
                    <td className="px-4 py-3 font-medium text-slate-900">{r.customerName}</td>
                    <td className="px-4 py-3 text-xs">{r.airline}</td>
                    <td className="px-4 py-3 text-xs">{formatDate(r.cancellationDate)}</td>
                    <td className="px-4 py-3 font-medium">{formatCurrency(r.refundExpected)}</td>
                    <td className="px-4 py-3 text-green-600 font-medium">{formatCurrency(r.refundReceived)}</td>
                    <td className="px-4 py-3 text-orange-600 font-medium">{formatCurrency(r.airlineCharges)}</td>
                    <td className="px-4 py-3 text-red-600 font-medium">{formatCurrency(r.agencyLoss)}</td>
                    <td className="px-4 py-3">
                      {r.refundPendingDays > 0 && r.refundStatus === 'Pending' ? (
                        <span className="text-red-600 font-bold flex items-center gap-1"><Clock size={12} />{r.refundPendingDays} days</span>
                      ) : (
                        <span className="text-green-600 text-xs">Resolved</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {r.refundStatus === 'Processed' ? (
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium flex items-center gap-1 w-fit"><CheckCircle size={10} />Processed</span>
                      ) : r.refundStatus === 'Pending' ? (
                        <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-xs font-medium flex items-center gap-1 w-fit"><AlertTriangle size={10} />Pending</span>
                      ) : (
                        <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs font-medium">Rejected</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-slate-500">
            <AlertTriangle size={32} className="mx-auto mb-3 text-slate-300" />
            <p>No refunds processed yet</p>
          </div>
        )}
      </div>

      {showAdd && <RefundForm onClose={() => setShowAdd(false)} />}
    </div>
  );
}

function RefundForm({ onClose }: { onClose: () => void }) {
  const { refunds, bookings, setRefunds } = useApp();
  const [form, setForm] = useState({ bookingId: '', airline: '', refundExpected: 0, airlineCharges: 0 });

  const selectedBooking = bookings.find(b => b.id === form.bookingId);

  const handleSubmit = () => {
    const id = `REF-${String(refunds.length + 1).padStart(4, '0')}`;
    setRefunds(prev => [...prev, {
      id, bookingId: form.bookingId, customerName: selectedBooking?.customerName || '',
      airline: form.airline || selectedBooking?.airline || '', cancellationDate: new Date().toISOString().split('T')[0],
      refundExpected: form.refundExpected, refundReceived: 0, airlineCharges: form.airlineCharges,
      agencyLoss: form.airlineCharges, refundStatus: 'Pending' as const, refundPendingDays: 0,
    }]);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-slate-200">
          <h3 className="text-lg font-bold text-slate-900">Record Refund</h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded"><X size={20} /></button>
        </div>
        <div className="p-5 space-y-3">
          <select value={form.bookingId} onChange={e => {
            const b = bookings.find(booking => booking.id === e.target.value);
            setForm({...form, bookingId: e.target.value, airline: b?.airline || '', refundExpected: b?.refundAmount || 0});
          }} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Select Booking</option>
            {bookings.filter(b => b.refundAmount > 0).map(b => <option key={b.id} value={b.id}>{b.id} - {b.customerName}</option>)}
          </select>
          <input placeholder="Airline" value={form.airline} onChange={e => setForm({...form, airline: e.target.value})} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <input type="number" placeholder="Refund Expected" value={form.refundExpected || ''} onChange={e => setForm({...form, refundExpected: parseInt(e.target.value) || 0})} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <input type="number" placeholder="Airline Charges/Deduction" value={form.airlineCharges || ''} onChange={e => setForm({...form, airlineCharges: parseInt(e.target.value) || 0})} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
            <button onClick={onClose} className="px-5 py-2 text-sm border border-slate-300 rounded-lg hover:bg-slate-50">Cancel</button>
            <button onClick={handleSubmit} className="px-5 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">Record Refund</button>
          </div>
        </div>
      </div>
    </div>
  );
}
