import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/cn';
import { useState } from 'react';
import { Plus, X, Building2, Phone, Mail, AlertTriangle } from 'lucide-react';

export default function CorporateClients() {
  const { corporateClients } = useApp();
  const [showAdd, setShowAdd] = useState(false);

  const totalOutstanding = corporateClients.reduce((s, c) => s + c.outstandingAmount, 0);
  const totalVolume = corporateClients.reduce((s, c) => s + c.monthlyBusinessVolume, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Corporate Clients</h2>
          <p className="text-sm text-slate-500 mt-1">{corporateClients.length} corporate accounts</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Plus size={14} /> Add Client
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-violet-50 to-violet-100 border border-violet-200 rounded-xl p-5">
          <div className="flex items-center gap-2"><Building2 size={16} className="text-violet-600" /><p className="text-sm font-medium text-violet-600">Total Clients</p></div>
          <p className="text-2xl font-bold text-violet-700 mt-1">{corporateClients.length}</p>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-5">
          <p className="text-sm font-medium text-blue-600">Monthly Volume</p>
          <p className="text-2xl font-bold text-blue-700 mt-1">{formatCurrency(totalVolume)}</p>
        </div>
        <div className="bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 rounded-xl p-5">
          <p className="text-sm font-medium text-amber-600 flex items-center gap-2"><AlertTriangle size={14} />Outstanding</p>
          <p className="text-2xl font-bold text-amber-700 mt-1">{formatCurrency(totalOutstanding)}</p>
        </div>
      </div>

      {/* Client Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {corporateClients.map(c => (
          <div key={c.id} className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center">
                  <Building2 size={20} className="text-violet-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">{c.companyName}</h3>
                  <p className="text-xs text-slate-500">{c.id}</p>
                </div>
              </div>
              {c.outstandingAmount > 0 ? (
                <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold">{formatCurrency(c.outstandingAmount)}</span>
              ) : (
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">Clear</span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-slate-50 p-3 rounded-lg">
                <p className="text-xs text-slate-500">Contact Person</p>
                <p className="text-sm font-medium text-slate-900">{c.contactPerson}</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg">
                <p className="text-xs text-slate-500">GST Number</p>
                <p className="text-sm font-mono text-slate-900">{c.gstNumber}</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg">
                <p className="text-xs text-slate-500">Credit Limit</p>
                <p className="text-sm font-bold text-slate-900">{formatCurrency(c.creditLimit)}</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg">
                <p className="text-xs text-slate-500">Payment Cycle</p>
                <p className="text-sm font-medium text-slate-900">{c.paymentCycle}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1"><Phone size={12} />{c.phone}</span>
              <span className="flex items-center gap-1"><Mail size={12} />{c.email}</span>
            </div>

            {/* Credit utilization */}
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-500">Credit Utilization</span>
                <span className="font-medium">{Math.round(c.outstandingAmount / c.creditLimit * 100)}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div className={`h-2 rounded-full ${c.outstandingAmount / c.creditLimit > 0.7 ? 'bg-red-500' : c.outstandingAmount / c.creditLimit > 0.4 ? 'bg-amber-500' : 'bg-green-500'}`} style={{ width: `${Math.min(c.outstandingAmount / c.creditLimit * 100, 100)}%` }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {showAdd && <CorporateForm onClose={() => setShowAdd(false)} />}
    </div>
  );
}

function CorporateForm({ onClose }: { onClose: () => void }) {
  const { corporateClients, setCorporateClients } = useApp();
  const [form, setForm] = useState({ companyName: '', contactPerson: '', gstNumber: '', phone: '', email: '', creditLimit: 500000, paymentCycle: 'Monthly' });

  const handleSubmit = () => {
    const id = `CORP-${String(corporateClients.length + 1).padStart(4, '0')}`;
    setCorporateClients(prev => [...prev, { id, ...form, outstandingAmount: 0, monthlyBusinessVolume: 0 }]);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-slate-200">
          <h3 className="text-lg font-bold text-slate-900">Add Corporate Client</h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded"><X size={20} /></button>
        </div>
        <div className="p-5 space-y-3">
          <input placeholder="Company Name" value={form.companyName} onChange={e => setForm({...form, companyName: e.target.value})} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <input placeholder="Contact Person" value={form.contactPerson} onChange={e => setForm({...form, contactPerson: e.target.value})} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <input placeholder="GST Number" value={form.gstNumber} onChange={e => setForm({...form, gstNumber: e.target.value})} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <input placeholder="Phone" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <input placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <input type="number" placeholder="Credit Limit" value={form.creditLimit || ''} onChange={e => setForm({...form, creditLimit: parseInt(e.target.value) || 0})} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <select value={form.paymentCycle} onChange={e => setForm({...form, paymentCycle: e.target.value})} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            {['Monthly', 'Bi-Monthly', 'Quarterly'].map(c => <option key={c}>{c}</option>)}
          </select>
          <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
            <button onClick={onClose} className="px-5 py-2 text-sm border border-slate-300 rounded-lg hover:bg-slate-50">Cancel</button>
            <button onClick={handleSubmit} className="px-5 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">Add Client</button>
          </div>
        </div>
      </div>
    </div>
  );
}
