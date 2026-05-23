import { useApp } from '../context/AppContext';
import { formatCurrency, formatDate } from '../utils/cn';
import { useState } from 'react';
import { FileText, BarChart3, TrendingUp, Users, Plane, AlertTriangle, RefreshCw } from 'lucide-react';

const reportTypes = [
  { id: 'daily-sales', label: 'Daily Sales Report', icon: <BarChart3 size={18} /> },
  { id: 'monthly-sales', label: 'Monthly Sales Report', icon: <TrendingUp size={18} /> },
  { id: 'profit', label: 'Profit Report', icon: <TrendingUp size={18} /> },
  { id: 'staff', label: 'Staff Performance', icon: <Users size={18} /> },
  { id: 'airline', label: 'Airline Performance', icon: <Plane size={18} /> },
  { id: 'outstanding', label: 'Outstanding Payments', icon: <AlertTriangle size={18} /> },
  { id: 'refund', label: 'Refund Reports', icon: <RefreshCw size={18} /> },
];

export default function Reports() {
  const { bookings, expenses, refunds } = useApp();
  const [activeReport, setActiveReport] = useState('daily-sales');

  // Daily Sales
  const recentBookings = [...bookings].sort((a, b) => b.bookingDate.localeCompare(a.bookingDate)).slice(0, 10);
  const todayBookings = bookings.filter(b => b.bookingDate === new Date().toISOString().split('T')[0]);
  const totalDailyRevenue = todayBookings.reduce((s, b) => s + b.totalCharged, 0);

  // Staff performance
  const staffStats: Record<string, { count: number; revenue: number; profit: number; pending: number }> = {};
  bookings.forEach(b => {
    if (!staffStats[b.staffName]) staffStats[b.staffName] = { count: 0, revenue: 0, profit: 0, pending: 0 };
    staffStats[b.staffName].count++;
    staffStats[b.staffName].revenue += b.totalCharged;
    staffStats[b.staffName].profit += b.profitEarned;
    staffStats[b.staffName].pending += b.pendingAmount;
  });

  // Airline stats
  const airlineStats: Record<string, { count: number; revenue: number; profit: number }> = {};
  bookings.forEach(b => {
    if (!airlineStats[b.airline]) airlineStats[b.airline] = { count: 0, revenue: 0, profit: 0 };
    airlineStats[b.airline].count++;
    airlineStats[b.airline].revenue += b.totalCharged;
    airlineStats[b.airline].profit += b.profitEarned;
  });

  // Outstanding
  const outstandingBookings = bookings.filter(b => b.pendingAmount > 0);
  const totalOutstanding = outstandingBookings.reduce((s, b) => s + b.pendingAmount, 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Reports</h2>
        <p className="text-sm text-slate-500 mt-1">Automated business reports and analytics</p>
      </div>

      {/* Report Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
        {reportTypes.map(r => (
          <button
            key={r.id}
            onClick={() => setActiveReport(r.id)}
            className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${activeReport === r.id ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300 hover:bg-blue-50'}`}
          >
            {r.icon}
            <span className="text-xs font-medium text-center leading-tight">{r.label}</span>
          </button>
        ))}
      </div>

      {/* Report Content */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        {activeReport === 'daily-sales' && (
          <div className="space-y-4">
            <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2"><FileText size={18} />Daily Sales Report</h3>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="bg-blue-50 p-4 rounded-lg"><p className="text-xs text-blue-600">Today&apos;s Bookings</p><p className="text-xl font-bold text-blue-700">{todayBookings.length}</p></div>
              <div className="bg-green-50 p-4 rounded-lg"><p className="text-xs text-green-600">Today&apos;s Revenue</p><p className="text-xl font-bold text-green-700">{formatCurrency(totalDailyRevenue)}</p></div>
              <div className="bg-purple-50 p-4 rounded-lg"><p className="text-xs text-purple-600">Total Bookings</p><p className="text-xl font-bold text-purple-700">{bookings.length}</p></div>
            </div>
            <table className="w-full text-sm">
              <thead><tr className="bg-slate-50 border-b"><th className="px-3 py-2 text-left">Booking ID</th><th className="px-3 py-2 text-left">Customer</th><th className="px-3 py-2 text-left">Date</th><th className="px-3 py-2 text-left">Sector</th><th className="px-3 py-2 text-left">Total</th><th className="px-3 py-2 text-left">Status</th></tr></thead>
              <tbody>
                {recentBookings.map(b => (
                  <tr key={b.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-3 py-2 font-mono text-xs text-blue-600">{b.id}</td>
                    <td className="px-3 py-2 text-sm">{b.customerName}</td>
                    <td className="px-3 py-2 text-xs">{formatDate(b.bookingDate)}</td>
                    <td className="px-3 py-2 text-sm">{b.sector}</td>
                    <td className="px-3 py-2 font-medium">{formatCurrency(b.totalCharged)}</td>
                    <td className="px-3 py-2"><span className={`px-2 py-0.5 rounded-full text-xs ${b.bookingStatus === 'Confirmed' ? 'bg-green-100 text-green-700' : b.bookingStatus === 'Travelled' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}`}>{b.bookingStatus}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeReport === 'monthly-sales' && (
          <div className="space-y-4">
            <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2"><BarChart3 size={18} />Monthly Sales Report</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-sm text-slate-700 mb-3">Monthly Summary</h4>
                <table className="w-full text-sm">
                  <thead><tr className="bg-slate-50"><th className="px-3 py-2 text-left">Month</th><th className="px-3 py-2 text-right">Bookings</th><th className="px-3 py-2 text-right">Revenue</th><th className="px-3 py-2 text-right">Profit</th></tr></thead>
                  <tbody>
                    <tr className="border-b border-slate-100"><td className="px-3 py-2">January</td><td className="px-3 py-2 text-right">3</td><td className="px-3 py-2 text-right">{formatCurrency(37300)}</td><td className="px-3 py-2 text-right text-green-600">{formatCurrency(2700)}</td></tr>
                    <tr className="border-b border-slate-100"><td className="px-3 py-2">February</td><td className="px-3 py-2 text-right">7</td><td className="px-3 py-2 text-right">{formatCurrency(226520)}</td><td className="px-3 py-2 text-right text-green-600">{formatCurrency(25070)}</td></tr>
                    <tr className="font-bold bg-slate-50"><td className="px-3 py-2">Total</td><td className="px-3 py-2 text-right">{bookings.length}</td><td className="px-3 py-2 text-right">{formatCurrency(bookings.reduce((s, b) => s + b.totalCharged, 0))}</td><td className="px-3 py-2 text-right text-green-600">{formatCurrency(bookings.reduce((s, b) => s + b.profitEarned, 0))}</td></tr>
                  </tbody>
                </table>
              </div>
              <div>
                <h4 className="font-medium text-sm text-slate-700 mb-3">Expense Impact</h4>
                <div className="space-y-2">
                  <div className="flex justify-between p-3 bg-red-50 rounded-lg"><span className="text-sm text-red-600">Total Expenses</span><span className="font-bold text-red-700">{formatCurrency(expenses.reduce((s, e) => s + e.amount, 0))}</span></div>
                  <div className="flex justify-between p-3 bg-green-50 rounded-lg"><span className="text-sm text-green-600">Gross Profit</span><span className="font-bold text-green-700">{formatCurrency(bookings.reduce((s, b) => s + b.profitEarned, 0))}</span></div>
                  <div className="flex justify-between p-3 bg-blue-50 rounded-lg font-bold"><span className="text-sm text-blue-600">Net Profit</span><span className="text-blue-700">{formatCurrency(bookings.reduce((s, b) => s + b.profitEarned, 0) - expenses.reduce((s, e) => s + e.amount, 0))}</span></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeReport === 'profit' && (
          <div className="space-y-4">
            <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2"><TrendingUp size={18} />Profit Report</h3>
            <div className="max-w-lg">
              {[
                { label: 'Total Revenue', value: bookings.reduce((s, b) => s + b.totalCharged, 0) },
                { label: 'Ticket Cost', value: -bookings.reduce((s, b) => s + b.actualTicketCost, 0) },
                { label: 'Gross Profit', value: bookings.reduce((s, b) => s + b.profitEarned, 0), highlight: true },
                { label: 'Operating Expenses', value: -expenses.reduce((s, e) => s + e.amount, 0) },
                { label: 'Refund Losses', value: -refunds.reduce((s, r) => s + r.agencyLoss, 0) },
                { label: 'Net Profit', value: bookings.reduce((s, b) => s + b.profitEarned, 0) - expenses.reduce((s, e) => s + e.amount, 0) - refunds.reduce((s, r) => s + r.agencyLoss, 0), highlight: true, bold: true },
              ].map((row, i) => (
                <div key={i} className={`flex justify-between p-3 ${row.bold ? 'bg-slate-100 font-bold rounded-lg' : 'border-b border-slate-100'}`}>
                  <span className="text-sm text-slate-700">{row.label}</span>
                  <span className={`text-sm font-medium ${row.highlight ? 'text-green-600' : 'text-slate-900'}`}>{formatCurrency(Math.abs(row.value))}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeReport === 'staff' && (
          <div className="space-y-4">
            <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2"><Users size={18} />Staff Performance</h3>
            <table className="w-full text-sm">
              <thead><tr className="bg-slate-50 border-b"><th className="px-3 py-2 text-left">Staff</th><th className="px-3 py-2 text-right">Bookings</th><th className="px-3 py-2 text-right">Revenue</th><th className="px-3 py-2 text-right">Profit</th><th className="px-3 py-2 text-right">Pending</th></tr></thead>
              <tbody>
                {Object.entries(staffStats).map(([name, data]) => (
                  <tr key={name} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-3 py-2 font-medium">{name}</td>
                    <td className="px-3 py-2 text-right">{data.count}</td>
                    <td className="px-3 py-2 text-right">{formatCurrency(data.revenue)}</td>
                    <td className="px-3 py-2 text-right text-green-600">{formatCurrency(data.profit)}</td>
                    <td className="px-3 py-2 text-right text-red-600">{formatCurrency(data.pending)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeReport === 'airline' && (
          <div className="space-y-4">
            <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2"><Plane size={18} />Airline Performance</h3>
            <table className="w-full text-sm">
              <thead><tr className="bg-slate-50 border-b"><th className="px-3 py-2 text-left">Airline</th><th className="px-3 py-2 text-right">Bookings</th><th className="px-3 py-2 text-right">Revenue</th><th className="px-3 py-2 text-right">Profit</th><th className="px-3 py-2 text-right">Avg Profit</th></tr></thead>
              <tbody>
                {Object.entries(airlineStats).sort(([, a], [, b]) => b.profit - a.profit).map(([name, data]) => (
                  <tr key={name} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-3 py-2 font-medium">{name}</td>
                    <td className="px-3 py-2 text-right">{data.count}</td>
                    <td className="px-3 py-2 text-right">{formatCurrency(data.revenue)}</td>
                    <td className="px-3 py-2 text-right text-green-600">{formatCurrency(data.profit)}</td>
                    <td className="px-3 py-2 text-right">{formatCurrency(data.count > 0 ? data.profit / data.count : 0)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeReport === 'outstanding' && (
          <div className="space-y-4">
            <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2"><AlertTriangle size={18} />Outstanding Payments</h3>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-red-600">Total Outstanding Amount</p>
              <p className="text-2xl font-bold text-red-700">{formatCurrency(totalOutstanding)}</p>
              <p className="text-xs text-red-500 mt-1">{outstandingBookings.length} bookings with pending payments</p>
            </div>
            <table className="w-full text-sm">
              <thead><tr className="bg-slate-50 border-b"><th className="px-3 py-2 text-left">Booking ID</th><th className="px-3 py-2 text-left">Customer</th><th className="px-3 py-2 text-left">Sector</th><th className="px-3 py-2 text-right">Total</th><th className="px-3 py-2 text-right">Pending</th><th className="px-3 py-2 text-right">% Pending</th></tr></thead>
              <tbody>
                {outstandingBookings.map(b => (
                  <tr key={b.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-3 py-2 font-mono text-xs text-blue-600">{b.id}</td>
                    <td className="px-3 py-2">{b.customerName}</td>
                    <td className="px-3 py-2">{b.sector}</td>
                    <td className="px-3 py-2 text-right">{formatCurrency(b.totalCharged)}</td>
                    <td className="px-3 py-2 text-right text-red-600 font-bold">{formatCurrency(b.pendingAmount)}</td>
                    <td className="px-3 py-2 text-right text-red-600">{Math.round(b.pendingAmount / b.totalCharged * 100)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeReport === 'refund' && (
          <div className="space-y-4">
            <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2"><RefreshCw size={18} />Refund Report</h3>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="bg-amber-50 p-4 rounded-lg"><p className="text-xs text-amber-600">Total Refund Expected</p><p className="text-lg font-bold text-amber-700">{formatCurrency(refunds.reduce((s, r) => s + r.refundExpected, 0))}</p></div>
              <div className="bg-green-50 p-4 rounded-lg"><p className="text-xs text-green-600">Total Refund Received</p><p className="text-lg font-bold text-green-700">{formatCurrency(refunds.reduce((s, r) => s + r.refundReceived, 0))}</p></div>
              <div className="bg-red-50 p-4 rounded-lg"><p className="text-xs text-red-600">Total Agency Loss</p><p className="text-lg font-bold text-red-700">{formatCurrency(refunds.reduce((s, r) => s + r.agencyLoss, 0))}</p></div>
            </div>
            {refunds.length === 0 ? <p className="text-sm text-slate-500 text-center py-8">No refund records</p> : (
              <table className="w-full text-sm">
                <thead><tr className="bg-slate-50 border-b"><th className="px-3 py-2 text-left">Refund ID</th><th className="px-3 py-2 text-left">Customer</th><th className="px-3 py-2 text-right">Expected</th><th className="px-3 py-2 text-right">Received</th><th className="px-3 py-2 text-right">Loss</th><th className="px-3 py-2 text-left">Status</th></tr></thead>
                <tbody>
                  {refunds.map(r => (
                    <tr key={r.id} className="border-b border-slate-100">
                      <td className="px-3 py-2 font-mono text-xs">{r.id}</td>
                      <td className="px-3 py-2">{r.customerName}</td>
                      <td className="px-3 py-2 text-right">{formatCurrency(r.refundExpected)}</td>
                      <td className="px-3 py-2 text-right text-green-600">{formatCurrency(r.refundReceived)}</td>
                      <td className="px-3 py-2 text-right text-red-600">{formatCurrency(r.agencyLoss)}</td>
                      <td className="px-3 py-2"><span className={`px-2 py-0.5 rounded-full text-xs ${r.refundStatus === 'Processed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{r.refundStatus}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
