import { useApp } from '../context/AppContext';
import { formatCurrency, formatDate } from '../utils/cn';
import { useState } from 'react';
import { Search, AlertTriangle, Filter, CheckCircle, Clock } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function PaymentTracker() {
  const { payments } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'paid'>('all');

  const filtered = payments.filter(p => {
    const matchSearch = p.bookingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.utrNumber.toLowerCase().includes(searchTerm.toLowerCase());
    if (filter === 'pending') return matchSearch && p.amountPending > 0;
    if (filter === 'paid') return matchSearch && p.amountPending === 0;
    return matchSearch;
  });

  const totalReceived = payments.reduce((s, p) => s + p.amountReceived, 0);
  const totalPending = payments.reduce((s, p) => s + p.amountPending, 0);
  const pendingCount = payments.filter(p => p.amountPending > 0).length;

  const pieData = [
    { name: 'Received', value: totalReceived },
    { name: 'Pending', value: totalPending },
  ];
  const COLORS = ['#10b981', '#ef4444'];

  const modeBreakdown: Record<string, number> = {};
  payments.forEach(p => { modeBreakdown[p.paymentMode] = (modeBreakdown[p.paymentMode] || 0) + p.amountReceived; });
  const modeData = Object.entries(modeBreakdown).map(([name, value]) => ({ name, value }));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Payment Tracker</h2>
          <p className="text-sm text-slate-500 mt-1">Track all incoming and outgoing payments</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-5">
          <p className="text-sm font-medium text-green-600">Total Received</p>
          <p className="text-2xl font-bold text-green-700 mt-1">{formatCurrency(totalReceived)}</p>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-xl p-5">
          <p className="text-sm font-medium text-red-600 flex items-center gap-2"><AlertTriangle size={14} />Total Pending</p>
          <p className="text-2xl font-bold text-red-700 mt-1">{formatCurrency(totalPending)}</p>
          <p className="text-xs text-red-500 mt-1">{pendingCount} bookings pending</p>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-5">
          <p className="text-sm font-medium text-blue-600">Collection Rate</p>
          <p className="text-2xl font-bold text-blue-700 mt-1">{totalReceived > 0 ? Math.round(totalReceived / (totalReceived + totalPending) * 100) : 0}%</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-4 flex-wrap">
        <div className="relative flex-1 min-w-[250px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search booking ID, name, UTR..." className="w-full pl-9 pr-4 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-slate-400" />
          {(['all', 'pending', 'paid'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${filter === f ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="font-semibold text-slate-900 mb-4">Payment Mode Breakdown</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={modeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={12} tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}K`} />
              <Tooltip formatter={(value: unknown) => [formatCurrency(Number(value)), '']} />
              <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="font-semibold text-slate-900 mb-4">Received vs Pending</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" outerRadius={70} dataKey="value" label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}>
                {pieData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip formatter={(value: unknown) => [formatCurrency(Number(value)), '']} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-4 py-3 text-left font-medium text-slate-600">Payment ID</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Booking ID</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Customer</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Amount</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Pending</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Date</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Mode</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">UTR/Ref</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id} className={`border-b border-slate-100 hover:bg-slate-50 ${p.amountPending > 0 ? 'bg-red-50/30' : ''}`}>
                  <td className="px-4 py-3 font-mono text-xs font-medium text-blue-600">{p.id}</td>
                  <td className="px-4 py-3 font-mono text-xs">{p.bookingId}</td>
                  <td className="px-4 py-3 font-medium text-slate-900">{p.customerName}</td>
                  <td className="px-4 py-3 font-medium text-green-600">{formatCurrency(p.amountReceived)}</td>
                  <td className="px-4 py-3">
                    {p.amountPending > 0 ? (
                      <span className="text-red-600 font-bold flex items-center gap-1"><AlertTriangle size={12} />{formatCurrency(p.amountPending)}</span>
                    ) : (
                      <span className="text-green-600 text-xs flex items-center gap-1"><CheckCircle size={12} />Paid</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs">{formatDate(p.paymentDate)}</td>
                  <td className="px-4 py-3 text-xs">{p.paymentMode}</td>
                  <td className="px-4 py-3 font-mono text-xs text-slate-500">{p.utrNumber}</td>
                  <td className="px-4 py-3">
                    {p.vendorPaymentStatus === 'Paid' ? (
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">Paid</span>
                    ) : p.vendorPaymentStatus === 'Partial' ? (
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-xs font-medium flex items-center gap-1 w-fit"><Clock size={10} />Partial</span>
                    ) : (
                      <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs font-medium">Pending</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
