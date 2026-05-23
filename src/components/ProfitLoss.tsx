import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/cn';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Plane, PieChart as PieIcon } from 'lucide-react';

const COLORS = ['#3b82f6', '#8b5cf6', '#06b6d4', '#f59e0b', '#10b981', '#ef4444', '#ec4899'];

export default function ProfitLoss() {
  const { bookings, expenses, refunds } = useApp();

  const totalRevenue = bookings.reduce((s, b) => s + b.totalCharged, 0);
  const totalTicketCost = bookings.reduce((s, b) => s + b.actualTicketCost, 0);
  const grossProfit = bookings.reduce((s, b) => s + b.profitEarned, 0);
  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
  const totalRefunds = refunds.reduce((s, r) => s + r.agencyLoss, 0);
  const netProfit = grossProfit - totalExpenses - totalRefunds;
  const profitMargin = totalRevenue > 0 ? (grossProfit / totalRevenue * 100).toFixed(1) : '0';

  // Monthly breakdown
  const monthlyData = [
    { month: 'January', revenue: 37300, cost: 34600, profit: 2700 },
    { month: 'February', revenue: 226520, cost: 191450, profit: 25070 },
    { month: 'March', revenue: 0, cost: 0, profit: 0 },
  ];

  // Airline-wise profitability
  const airlineProfits: Record<string, { revenue: number; cost: number; profit: number }> = {};
  bookings.forEach(b => {
    if (!airlineProfits[b.airline]) airlineProfits[b.airline] = { revenue: 0, cost: 0, profit: 0 };
    airlineProfits[b.airline].revenue += b.totalCharged;
    airlineProfits[b.airline].cost += b.actualTicketCost;
    airlineProfits[b.airline].profit += b.profitEarned;
  });
  const airlineProfitData = Object.entries(airlineProfits).map(([name, data]) => ({ name, ...data }));

  // Agent-wise profitability
  const agentProfits: Record<string, { revenue: number; profit: number }> = {};
  bookings.forEach(b => {
    if (!agentProfits[b.staffName]) agentProfits[b.staffName] = { revenue: 0, profit: 0 };
    agentProfits[b.staffName].revenue += b.totalCharged;
    agentProfits[b.staffName].profit += b.profitEarned;
  });
  const agentProfitData = Object.entries(agentProfits).map(([name, data]) => ({ name, ...data }));

  // Expense breakdown for pie
  const expenseBreakdown: Record<string, number> = {};
  expenses.forEach(e => { expenseBreakdown[e.category] = (expenseBreakdown[e.category] || 0) + e.amount; });
  const expensePieData = Object.entries(expenseBreakdown).map(([name, value]) => ({ name, value }));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Profit & Loss Statement</h2>
        <p className="text-sm text-slate-500 mt-1">Automated accounting summary and analysis</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-5">
          <div className="flex items-center gap-2"><Plane size={16} className="text-blue-600" /><p className="text-sm font-medium text-blue-600">Total Revenue</p></div>
          <p className="text-xl font-bold text-blue-700 mt-1">{formatCurrency(totalRevenue)}</p>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-xl p-5">
          <div className="flex items-center gap-2"><TrendingDown size={16} className="text-orange-600" /><p className="text-sm font-medium text-orange-600">Ticket Cost</p></div>
          <p className="text-xl font-bold text-orange-700 mt-1">{formatCurrency(totalTicketCost)}</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-5">
          <div className="flex items-center gap-2"><TrendingUp size={16} className="text-green-600" /><p className="text-sm font-medium text-green-600">Gross Profit</p></div>
          <p className="text-xl font-bold text-green-700 mt-1">{formatCurrency(grossProfit)}</p>
          <p className="text-xs text-green-500 mt-1">{profitMargin}% margin</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-5">
          <div className="flex items-center gap-2"><PieIcon size={16} className="text-purple-600" /><p className="text-sm font-medium text-purple-600">Expenses</p></div>
          <p className="text-xl font-bold text-purple-700 mt-1">{formatCurrency(totalExpenses)}</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 rounded-xl p-5">
          <div className="flex items-center gap-2"><DollarSign size={16} className="text-emerald-600" /><p className="text-sm font-medium text-emerald-600">Net Profit</p></div>
          <p className="text-xl font-bold text-emerald-700 mt-1">{formatCurrency(netProfit)}</p>
        </div>
      </div>

      {/* Monthly Comparison */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="font-semibold text-slate-900 mb-4">Monthly Revenue vs Cost vs Profit</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
            <YAxis stroke="#64748b" fontSize={12} tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}K`} />
            <Tooltip formatter={(value: unknown) => [formatCurrency(Number(value)), '']} />
            <Legend />
            <Bar dataKey="revenue" fill="#3b82f6" name="Revenue" radius={[4, 4, 0, 0]} />
            <Bar dataKey="cost" fill="#f59e0b" name="Ticket Cost" radius={[4, 4, 0, 0]} />
            <Bar dataKey="profit" fill="#10b981" name="Profit" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Airline-wise */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="font-semibold text-slate-900 mb-4">Airline-wise Profitability</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={airlineProfitData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={12} tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}K`} />
              <Tooltip formatter={(value: unknown) => [formatCurrency(Number(value)), '']} />
              <Legend />
              <Bar dataKey="revenue" stackId="a" fill="#3b82f6" name="Revenue" />
              <Bar dataKey="profit" stackId="a" fill="#10b981" name="Profit" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Agent-wise */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="font-semibold text-slate-900 mb-4">Agent-wise Profitability</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={agentProfitData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}K`} />
              <Tooltip formatter={(value: unknown) => [formatCurrency(Number(value)), '']} />
              <Legend />
              <Bar dataKey="revenue" fill="#8b5cf6" name="Revenue" radius={[4, 4, 0, 0]} />
              <Bar dataKey="profit" fill="#06b6d4" name="Profit" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Expense Breakdown */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="font-semibold text-slate-900 mb-4">Expense Breakdown</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={expensePieData} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}>
                {expensePieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(value: unknown) => [formatCurrency(Number(value)), '']} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2">
            {expensePieData.map((e, i) => (
              <div key={e.name} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  <span className="text-sm text-slate-700">{e.name}</span>
                </div>
                <span className="text-sm font-bold text-slate-900">{formatCurrency(e.value)}</span>
              </div>
            ))}
            <div className="flex items-center justify-between p-3 bg-slate-100 rounded-lg font-bold">
              <span className="text-sm text-slate-900">Total Expenses</span>
              <span className="text-sm text-slate-900">{formatCurrency(totalExpenses)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* P&L Summary Table */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="font-semibold text-slate-900 mb-4">P&L Summary</h3>
        <div className="max-w-lg space-y-2">
          {[
            { label: 'Total Revenue', value: totalRevenue, bold: true },
            { label: 'Less: Ticket Cost', value: -totalTicketCost },
            { label: 'Gross Profit', value: grossProfit, highlight: 'text-green-600' },
            { label: 'Less: Operating Expenses', value: -totalExpenses },
            { label: 'Less: Refund Losses', value: -totalRefunds },
            { label: 'Net Profit', value: netProfit, bold: true, highlight: 'text-emerald-700' },
          ].map((row, i) => (
            <div key={i} className={`flex items-center justify-between p-3 ${row.bold ? 'bg-slate-100 rounded-lg font-bold' : 'border-b border-slate-100'}`}>
              <span className="text-sm text-slate-700">{row.label}</span>
              <span className={`text-sm font-medium ${row.highlight || 'text-slate-900'}`}>{formatCurrency(Math.abs(row.value))}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
