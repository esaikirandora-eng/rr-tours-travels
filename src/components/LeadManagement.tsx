import { useState } from 'react';
import { Plus, X, MessageSquare, Mail, Search } from 'lucide-react';

interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  source: string;
  route: string;
  budget: number;
  status: 'New' | 'Contacted' | 'Quoted' | 'Won' | 'Lost';
  date: string;
  notes: string;
}

const initialLeads: Lead[] = [
  { id: 'LEAD-001', name: 'Sanjay Mehta', phone: '9876543220', email: 'sanjay@email.com', source: 'Referral', route: 'DEL-LHR', budget: 80000, status: 'New', date: '2025-02-14', notes: 'Interested in business class for family of 4' },
  { id: 'LEAD-002', name: 'Anita Gupta', phone: '9876543221', email: 'anita@gmail.com', source: 'Website', route: 'BOM-SIN', budget: 55000, status: 'Contacted', date: '2025-02-13', notes: 'Honeymoon package - looking for deals' },
  { id: 'LEAD-003', name: 'Rohit Enterprises', phone: '9876543222', email: 'rohit@ent.com', source: 'Cold Call', route: 'BLR-NYC', budget: 200000, status: 'Quoted', date: '2025-02-12', notes: 'Corporate booking - 5 executives, March travel' },
  { id: 'LEAD-004', name: 'Kavita Desai', phone: '9876543223', email: 'kavita.d@email.com', source: 'Social Media', route: 'CCU-BKK', budget: 35000, status: 'Won', date: '2025-02-10', notes: 'Converted to booking BK-0011' },
];

export default function LeadManagement() {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [showAdd, setShowAdd] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = leads.filter(l =>
    l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.route.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.source.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = (lead: Omit<Lead, 'id'>) => {
    setLeads(prev => [...prev, { ...lead, id: `LEAD-${String(prev.length + 1).padStart(3, '0')}` }]);
    setShowAdd(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New': return 'bg-blue-100 text-blue-700';
      case 'Contacted': return 'bg-amber-100 text-amber-700';
      case 'Quoted': return 'bg-purple-100 text-purple-700';
      case 'Won': return 'bg-green-100 text-green-700';
      case 'Lost': return 'bg-red-100 text-red-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const sendWhatsApp = (phone: string, name: string) => {
    const msg = encodeURIComponent(`Hello ${name}! Thank you for your interest in booking a flight with TravelPro. How can we assist you today?`);
    window.open(`https://wa.me/91${phone}?text=${msg}`, '_blank');
  };

  const sendEmail = (email: string, name: string, route: string) => {
    const subject = encodeURIComponent(`Flight Booking Enquiry - ${route}`);
    const body = encodeURIComponent(`Dear ${name},\n\nThank you for your interest in booking a flight for ${route} with TravelPro.\n\nOur team is working on the best available options for you. We'll share the detailed quotation shortly.\n\nBest regards,\nTravelPro Team`);
    window.open(`mailto:${email}?subject=${subject}&body=${body}`, '_blank');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Lead Management</h2>
          <p className="text-sm text-slate-500 mt-1">{leads.length} leads in pipeline</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Plus size={14} /> Add Lead
        </button>
      </div>

      {/* Pipeline Summary */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {['New', 'Contacted', 'Quoted', 'Won', 'Lost'].map(status => {
          const count = leads.filter(l => l.status === status).length;
          const total = leads.filter(l => l.status === status).reduce((s, l) => s + l.budget, 0);
          return (
            <div key={status} className={`p-4 rounded-xl border ${getStatusColor(status).includes('blue') ? 'bg-blue-50 border-blue-200' : getStatusColor(status).includes('amber') ? 'bg-amber-50 border-amber-200' : getStatusColor(status).includes('purple') ? 'bg-purple-50 border-purple-200' : getStatusColor(status).includes('green') ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
              <p className="text-xs font-medium text-slate-600">{status}</p>
              <p className="text-2xl font-bold text-slate-900">{count}</p>
              <p className="text-xs text-slate-500">{count > 0 ? `₹${(total / 1000).toFixed(0)}K pipeline` : ''}</p>
            </div>
          );
        })}
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search leads..." className="w-full pl-9 pr-4 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
      </div>

      {/* Leads */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(lead => (
          <div key={lead.id} className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-slate-900">{lead.name}</h3>
                <p className="text-xs text-slate-500">{lead.id} &bull; {lead.source}</p>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>{lead.status}</span>
            </div>
            <div className="space-y-2 mb-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">Route: <span className="font-medium text-slate-700">{lead.route}</span></span>
                <span className="text-xs text-slate-500">Budget: <span className="font-medium text-slate-700">₹{(lead.budget / 1000).toFixed(0)}K</span></span>
              </div>
              <p className="text-xs text-slate-500">📅 {lead.date}</p>
              {lead.notes && <p className="text-xs text-slate-600 bg-slate-50 p-2 rounded">{lead.notes}</p>}
            </div>
            <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
              <button onClick={() => sendWhatsApp(lead.phone, lead.name)} className="flex items-center gap-1 px-3 py-1.5 text-xs bg-green-500 text-white rounded-lg hover:bg-green-600"><MessageSquare size={12} /> WhatsApp</button>
              <button onClick={() => sendEmail(lead.email, lead.name, lead.route)} className="flex items-center gap-1 px-3 py-1.5 text-xs bg-blue-500 text-white rounded-lg hover:bg-blue-600"><Mail size={12} /> Email</button>
              <select value={lead.status} onChange={e => setLeads(prev => prev.map(l => l.id === lead.id ? { ...l, status: e.target.value as Lead['status'] } : l))} className="text-xs border border-slate-300 rounded-lg px-2 py-1.5 ml-auto focus:outline-none focus:ring-2 focus:ring-blue-500">
                {['New', 'Contacted', 'Quoted', 'Won', 'Lost'].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
        ))}
      </div>

      {showAdd && <LeadForm onClose={() => setShowAdd(false)} onSubmit={handleAdd} />}
    </div>
  );
}

function LeadForm({ onClose, onSubmit }: { onClose: () => void; onSubmit: (lead: Omit<Lead, 'id'>) => void }) {
  const [form, setForm] = useState<Omit<Lead, 'id'>>({
    name: '', phone: '', email: '', source: 'Website', route: '', budget: 0,
    status: 'New', date: new Date().toISOString().split('T')[0], notes: ''
  });

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-slate-200">
          <h3 className="text-lg font-bold text-slate-900">Add Lead</h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded"><X size={20} /></button>
        </div>
        <div className="p-5 space-y-3">
          <input placeholder="Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <input placeholder="Phone" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <input placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <select value={form.source} onChange={e => setForm({...form, source: e.target.value})} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            {['Website', 'Referral', 'Social Media', 'Cold Call', 'Walk-in', 'Corporate'].map(s => <option key={s}>{s}</option>)}
          </select>
          <input placeholder="Route (e.g., DEL-BOM)" value={form.route} onChange={e => setForm({...form, route: e.target.value})} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <input type="number" placeholder="Budget" value={form.budget || ''} onChange={e => setForm({...form, budget: parseInt(e.target.value) || 0})} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <textarea placeholder="Notes" value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" rows={3} />
          <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
            <button onClick={onClose} className="px-5 py-2 text-sm border border-slate-300 rounded-lg hover:bg-slate-50">Cancel</button>
            <button onClick={() => onSubmit(form)} className="px-5 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">Add Lead</button>
          </div>
        </div>
      </div>
    </div>
  );
}
