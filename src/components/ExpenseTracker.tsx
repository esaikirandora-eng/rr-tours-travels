import { useApp } from '../context/AppContext';
import { formatCurrency, formatDate } from '../utils/cn';
import { useState } from 'react';
import { Plus, X, Download } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const CATEGORIES = ['Office Rent', 'Internet', 'Marketing', 'Salary', 'Software Subscription', 'Travel', 'Miscellaneous'];
const COLORS = ['#3b82f6', '#06b6d4', '#f59e0b', '#8b5cf6', '#ef4444', '#10b981', '#ec4899'];

export default function ExpenseTracker() {
  const { expenses, setExpenses } = useApp();
  const [showAdd, setShowAdd] = useState(false);

  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);

  const catBreakdown: Record<string, number> = {};
  expenses.forEach(e => { catBreakdown[e.category] = (catBreakdown[e.category] || 0) + e.amount; });
  const catData = Object.entries(catBreakdown).map(([name, value]) => ({ name, value }));

  const handleSubmit = (form: { category: string; description: string; amount: number; paymentMode: string }) => {
    const id = `EXP-${String(expenses.length + 1).padStart(4, '0')}`;
    setExpenses(prev => [...prev, {
      id, category: form.category, description: form.description, amount: form.amount,
      date: new Date().toISOString().split('T')[0], paymentMode: form.paymentMode,
      receiptNumber: `${form.category.substring(0, 3).toUpperCase()}${Date.now().toString().slice(-6)}`
    }]);
    setShowAdd(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Expense Tracker</h2>
          <p className="text-sm text-slate-500 mt-1">Track operational expenses and profit impact</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => {
            const csv = 'ID,Category,Description,Amount,Date,Mode,Receipt\n' +
              expenses.map(e => `${e.id},${e.category},${e.description},${e.amount},${e.date},${e.paymentMode},${e.receiptNumber}`).join('\n');
            const blob = new Blob([csv], { type: 'text/csv' });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = 'expenses.csv';
            a.click();
          }} className="flex items-center gap-2 px-4 py-2 text-sm bg-white border border-slate-300 rounded-lg hover:bg-slate-50">
            <Download size={14} /> Export
          </button>
          <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Plus size={14} /> Add Expense
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-xl p-5">
          <p className="text-sm font-medium text-red-600">Total Expenses</p>
          <p className="text-2xl font-bold text-red-700 mt-1">{formatCurrency(totalExpenses)}</p>
        </div>
        <div className="bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-xl p-5">
          <p className="text-sm font-medium text-slate-600">Expense Categories</p>
          <p className="text-2xl font-bold text-slate-700 mt-1">{catData.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="font-semibold text-slate-900 mb-4">Category Breakdown</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={catData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
              <YAxis stroke="#64748b" fontSize={12} tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}K`} />
              <Tooltip formatter={(value: unknown) => [formatCurrency(Number(value)), '']} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {catData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="font-semibold text-slate-900 mb-4">Expense Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={catData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}>
                {catData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(value: unknown) => [formatCurrency(Number(value)), '']} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Expense Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-4 py-3 text-left font-medium text-slate-600">Expense ID</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Category</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Description</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Amount</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Date</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Mode</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Receipt</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map(e => (
                <tr key={e.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-4 py-3 font-mono text-xs text-blue-600">{e.id}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-full text-xs font-medium">{e.category}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-700">{e.description}</td>
                  <td className="px-4 py-3 font-medium text-red-600">{formatCurrency(e.amount)}</td>
                  <td className="px-4 py-3 text-xs">{formatDate(e.date)}</td>
                  <td className="px-4 py-3 text-xs">{e.paymentMode}</td>
                  <td className="px-4 py-3 font-mono text-xs text-slate-500">{e.receiptNumber}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAdd && <ExpenseForm categories={CATEGORIES} onClose={() => setShowAdd(false)} onSubmit={handleSubmit} />}
    </div>
  );
}

function ExpenseForm({ categories, onClose, onSubmit }: { categories: string[]; onClose: () => void; onSubmit: (form: { category: string; description: string; amount: number; paymentMode: string }) => void }) {
  const [form, setForm] = useState({ category: 'Office Rent', description: '', amount: 0, paymentMode: 'Bank Transfer' });

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-slate-200">
          <h3 className="text-lg font-bold text-slate-900">Add Expense</h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded"><X size={20} /></button>
        </div>
        <div className="p-5 space-y-3">
          <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            {categories.map(c => <option key={c}>{c}</option>)}
          </select>
          <input placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <input type="number" placeholder="Amount" value={form.amount || ''} onChange={e => setForm({...form, amount: parseInt(e.target.value) || 0})} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <select value={form.paymentMode} onChange={e => setForm({...form, paymentMode: e.target.value})} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            {['Bank Transfer', 'UPI', 'Cash', 'Credit Card', 'Cheque'].map(m => <option key={m}>{m}</option>)}
          </select>
          <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
            <button onClick={onClose} className="px-5 py-2 text-sm border border-slate-300 rounded-lg hover:bg-slate-50">Cancel</button>
            <button onClick={() => onSubmit(form)} className="px-5 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">Add Expense</button>
          </div>
        </div>
      </div>
    </div>
  );
}
