import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { formatCurrency, formatDate } from '../utils/cn';
import { Customer } from '../types';
import { useState } from 'react';
import {
  Search, UserPlus, X, Mail, Phone, Trash2, Edit2,
  ShieldOff, Save, AlertTriangle, CheckCircle, Tag
} from 'lucide-react';

// ─── helpers ───────────────────────────────────────────────────────────────
function initials(name: string) {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
}
function avatarColor(tag: string) {
  return tag === 'Corporate' ? 'bg-violet-600' : 'bg-blue-600';
}

// ─── Confirm Delete Dialog ──────────────────────────────────────────────────
function ConfirmDialog({
  customer, onConfirm, onCancel,
}: { customer: Customer; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-6">
        <div className="flex items-center justify-center w-14 h-14 rounded-full bg-red-100 mx-auto mb-4">
          <AlertTriangle size={28} className="text-red-500" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 text-center mb-1">Delete Customer?</h3>
        <p className="text-sm text-slate-500 text-center mb-6">
          Are you sure you want to permanently delete{' '}
          <span className="font-semibold text-slate-800">{customer.fullName}</span>?
          This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-2.5 text-sm border border-slate-300 rounded-xl hover:bg-slate-50 font-medium">
            Cancel
          </button>
          <button onClick={onConfirm} className="flex-1 py-2.5 text-sm bg-red-600 text-white rounded-xl hover:bg-red-700 font-medium">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Customer Edit / Add Form ───────────────────────────────────────────────
function CustomerForm({
  initial, onClose, onSubmit, title,
}: {
  initial?: Partial<Customer>;
  onClose: () => void;
  onSubmit: (data: Partial<Customer>) => void;
  title: string;
}) {
  const [form, setForm] = useState<Partial<Customer>>(
    initial ?? {
      fullName: '', phone: '', whatsapp: '', email: '', dob: '',
      passportNumber: '', passportExpiry: '', city: '', address: '',
      companyName: '', gstNumber: '', preferredAirline: '',
      frequentRoutes: '', tag: 'Individual', notes: '',
    }
  );

  const set = (key: keyof Customer, val: string) =>
    setForm(prev => ({ ...prev, [key]: val }));

  const fieldClass =
    'w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500';

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-slate-200 sticky top-0 bg-white z-10">
          <h3 className="text-lg font-bold text-slate-900">{title}</h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg">
            <X size={20} />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Basic */}
          <section>
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-3">
              Basic Information
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input className={fieldClass} placeholder="Full Name *" value={form.fullName ?? ''} onChange={e => set('fullName', e.target.value)} />
              <input className={fieldClass} placeholder="Phone *" value={form.phone ?? ''} onChange={e => set('phone', e.target.value)} />
              <input className={fieldClass} placeholder="WhatsApp Number" value={form.whatsapp ?? ''} onChange={e => set('whatsapp', e.target.value)} />
              <input className={fieldClass} type="email" placeholder="Email" value={form.email ?? ''} onChange={e => set('email', e.target.value)} />
              <input className={fieldClass} type="date" placeholder="Date of Birth" value={form.dob ?? ''} onChange={e => set('dob', e.target.value)} />
              <input className={fieldClass} placeholder="City" value={form.city ?? ''} onChange={e => set('city', e.target.value)} />
              <input className={`${fieldClass} md:col-span-2`} placeholder="Address" value={form.address ?? ''} onChange={e => set('address', e.target.value)} />
            </div>
          </section>

          {/* Travel */}
          <section>
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-3">
              Travel Details
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input className={fieldClass} placeholder="Passport Number" value={form.passportNumber ?? ''} onChange={e => set('passportNumber', e.target.value)} />
              <input className={fieldClass} type="date" placeholder="Passport Expiry" value={form.passportExpiry ?? ''} onChange={e => set('passportExpiry', e.target.value)} />
              <input className={fieldClass} placeholder="Preferred Airline" value={form.preferredAirline ?? ''} onChange={e => set('preferredAirline', e.target.value)} />
              <input className={fieldClass} placeholder="Frequent Routes (e.g. DEL-BOM)" value={form.frequentRoutes ?? ''} onChange={e => set('frequentRoutes', e.target.value)} />
            </div>
          </section>

          {/* Corporate */}
          <section>
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-3">
              Corporate / GST
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <select className={fieldClass} value={form.tag ?? 'Individual'} onChange={e => set('tag', e.target.value)}>
                <option value="Individual">Individual</option>
                <option value="Corporate">Corporate</option>
              </select>
              <input className={fieldClass} placeholder="Company Name" value={form.companyName ?? ''} onChange={e => set('companyName', e.target.value)} />
              <input className={`${fieldClass} md:col-span-2`} placeholder="GST Number" value={form.gstNumber ?? ''} onChange={e => set('gstNumber', e.target.value)} />
            </div>
          </section>

          <textarea
            className={`${fieldClass} resize-none`}
            rows={3}
            placeholder="Notes"
            value={form.notes ?? ''}
            onChange={e => set('notes', e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-3 px-5 py-4 border-t border-slate-200 bg-slate-50 rounded-b-2xl">
          <button onClick={onClose} className="px-5 py-2 text-sm border border-slate-300 rounded-xl hover:bg-white font-medium">
            Cancel
          </button>
          <button
            onClick={() => { if (form.fullName && form.phone) onSubmit(form); }}
            className="flex items-center gap-2 px-5 py-2 text-sm bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium"
          >
            <Save size={14} /> Save Customer
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────
export default function CustomerDatabase() {
  const { customers, setCustomers, bookings } = useApp();
  const { isAdmin, isStaff } = useAuth();

  const [searchTerm, setSearchTerm]       = useState('');
  const [tagFilter, setTagFilter]         = useState<'All' | 'Individual' | 'Corporate'>('All');
  const [selectedId, setSelectedId]       = useState<string | null>(null);
  const [showAddForm, setShowAddForm]     = useState(false);
  const [editCustomer, setEditCustomer]   = useState<Customer | null>(null);
  const [deleteTarget, setDeleteTarget]   = useState<Customer | null>(null);
  const [toast, setToast]                 = useState<{ msg: string; ok: boolean } | null>(null);

  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };

  const filtered = customers.filter(c => {
    const q = searchTerm.toLowerCase();
    const matchSearch =
      c.fullName.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.phone.includes(q) ||
      c.id.toLowerCase().includes(q) ||
      (c.companyName ?? '').toLowerCase().includes(q);
    const matchTag = tagFilter === 'All' || c.tag === tagFilter;
    return matchSearch && matchTag;
  });

  const selected        = customers.find(c => c.id === selectedId);
  const customerBookings = bookings.filter(
    b => b.customerId === selectedId || b.customerName === selected?.fullName
  );

  // ── Add ──
  const handleAdd = (data: Partial<Customer>) => {
    const id = `CUST-${String(customers.length + 1).padStart(4, '0')}`;
    const newCust: Customer = {
      id,
      fullName: data.fullName!,
      phone: data.phone!,
      whatsapp: data.whatsapp ?? data.phone!,
      email: data.email ?? '',
      dob: data.dob ?? '',
      passportNumber: data.passportNumber ?? '',
      passportExpiry: data.passportExpiry ?? '',
      frequentRoutes: data.frequentRoutes ?? '',
      totalBookings: 0,
      totalRevenue: 0,
      preferredAirline: data.preferredAirline ?? '',
      tag: (data.tag as 'Corporate' | 'Individual') ?? 'Individual',
      companyName: data.companyName ?? '',
      gstNumber: data.gstNumber ?? '',
      city: data.city ?? '',
      address: data.address ?? '',
      notes: data.notes ?? '',
    };
    setCustomers(prev => [...prev, newCust]);
    setShowAddForm(false);
    showToast(`${newCust.fullName} added successfully.`);
  };

  // ── Edit ──
  const handleEdit = (data: Partial<Customer>) => {
    if (!editCustomer) return;
    setCustomers(prev =>
      prev.map(c => c.id === editCustomer.id ? { ...c, ...data } : c)
    );
    setEditCustomer(null);
    if (selectedId === editCustomer.id) setSelectedId(null);
    showToast('Customer updated successfully.');
  };

  // ── Delete ──
  const handleDelete = () => {
    if (!deleteTarget) return;
    setCustomers(prev => prev.filter(c => c.id !== deleteTarget.id));
    if (selectedId === deleteTarget.id) setSelectedId(null);
    showToast(`${deleteTarget.fullName} deleted.`, false);
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-4 relative">

      {/* ── Toast ── */}
      {toast && (
        <div className={`fixed top-6 right-6 z-[70] flex items-center gap-2 px-4 py-3 rounded-xl shadow-xl text-white text-sm font-medium transition-all ${toast.ok ? 'bg-green-600' : 'bg-red-600'}`}>
          {toast.ok ? <CheckCircle size={16} /> : <AlertTriangle size={16} />}
          {toast.msg}
        </div>
      )}

      {/* ── Header ── */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Customer Database</h2>
          <p className="text-sm text-slate-500 mt-0.5">{customers.length} registered customers</p>
        </div>
        {isStaff && (
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium shadow-sm"
          >
            <UserPlus size={14} /> Add Customer
          </button>
        )}
      </div>

      {/* ── Filters ── */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 flex gap-3 flex-wrap items-center">
        <div className="relative flex-1 min-w-[220px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search name, email, phone, ID..."
            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex gap-2">
          {(['All', 'Individual', 'Corporate'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTagFilter(t)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${tagFilter === t ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              {t}
            </button>
          ))}
        </div>
        <span className="text-xs text-slate-400 ml-auto">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      {/* ── Access notice for non-admins ── */}
      {!isAdmin && (
        <div className="flex items-center gap-2 px-4 py-2.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-700 text-xs font-medium">
          <ShieldOff size={14} />
          You have <strong>{isStaff ? 'staff' : 'view-only'}</strong> access.
          {!isStaff && ' Contact the admin to modify customer data.'}
          {isStaff && ' You can add customers. Only Admins can edit or delete.'}
        </div>
      )}

      {/* ── Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(c => {
          const custBookings = bookings.filter(b => b.customerId === c.id || b.customerName === c.fullName);
          const totalRevenue = custBookings.reduce((s, b) => s + b.totalCharged, 0);
          const totalProfit  = custBookings.reduce((s, b) => s + b.profitEarned, 0);
          const hasPending   = custBookings.some(b => b.pendingAmount > 0);

          return (
            <div
              key={c.id}
              className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-lg transition-all cursor-pointer group"
              onClick={() => setSelectedId(c.id)}
            >
              {/* Card header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 ${avatarColor(c.tag)}`}>
                    {initials(c.fullName)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 leading-tight">{c.fullName}</h3>
                    <p className="text-[11px] text-slate-400 font-mono">{c.id}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${c.tag === 'Corporate' ? 'bg-violet-100 text-violet-700' : 'bg-blue-100 text-blue-700'}`}>
                    {c.tag}
                  </span>
                  {hasPending && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-red-100 text-red-600 flex items-center gap-0.5">
                      <AlertTriangle size={9} />Due
                    </span>
                  )}
                </div>
              </div>

              {/* Contact */}
              <div className="space-y-1 text-sm mb-3">
                <div className="flex items-center gap-2 text-slate-500"><Phone size={11} /><span className="text-xs">{c.phone}</span></div>
                <div className="flex items-center gap-2 text-slate-500"><Mail size={11} /><span className="text-xs truncate">{c.email || '—'}</span></div>
                {c.companyName && <div className="flex items-center gap-2 text-violet-500"><Tag size={11} /><span className="text-xs truncate">{c.companyName}</span></div>}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 text-center pt-3 border-t border-slate-100">
                <div><p className="text-[10px] text-slate-400">Bookings</p><p className="font-bold text-slate-900 text-sm">{custBookings.length}</p></div>
                <div><p className="text-[10px] text-slate-400">Revenue</p><p className="font-bold text-green-600 text-xs">₹{Math.round(totalRevenue / 1000)}K</p></div>
                <div><p className="text-[10px] text-slate-400">Profit</p><p className="font-bold text-blue-600 text-xs">₹{Math.round(totalProfit / 1000)}K</p></div>
              </div>

              {/* Admin action buttons */}
              {isAdmin && (
                <div className="mt-3 pt-3 border-t border-slate-100 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={e => { e.stopPropagation(); setEditCustomer(c); }}
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <Edit2 size={12} /> Edit
                  </button>
                  <button
                    onClick={e => { e.stopPropagation(); setDeleteTarget(c); }}
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    <Trash2 size={12} /> Delete
                  </button>
                </div>
              )}
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="col-span-3 py-16 text-center text-slate-400">
            <Users size={36} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">No customers found.</p>
          </div>
        )}
      </div>

      {/* ── Detail Modal ── */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedId(null)}>
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-slate-200 sticky top-0 bg-white z-10">
              <h3 className="text-lg font-bold text-slate-900">Customer Profile</h3>
              <div className="flex items-center gap-2">
                {isAdmin && (
                  <>
                    <button onClick={() => { setEditCustomer(selected); setSelectedId(null); }} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100">
                      <Edit2 size={12} /> Edit
                    </button>
                    <button onClick={() => { setDeleteTarget(selected); setSelectedId(null); }} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-red-50 text-red-600 rounded-lg hover:bg-red-100">
                      <Trash2 size={12} /> Delete
                    </button>
                  </>
                )}
                <button onClick={() => setSelectedId(null)} className="p-1 hover:bg-slate-100 rounded-lg"><X size={20} /></button>
              </div>
            </div>

            <div className="p-5 space-y-6">
              {/* Avatar + name */}
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl ${avatarColor(selected.tag)}`}>
                  {initials(selected.fullName)}
                </div>
                <div>
                  <h4 className="text-xl font-bold text-slate-900">{selected.fullName}</h4>
                  <p className="text-sm text-slate-500">{selected.id} · {selected.tag}</p>
                  {selected.companyName && <p className="text-sm text-violet-600">{selected.companyName}</p>}
                </div>
              </div>

              {/* Info grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {([
                  ['Phone', selected.phone],
                  ['WhatsApp', selected.whatsapp],
                  ['Email', selected.email],
                  ['DOB', formatDate(selected.dob)],
                  ['City', selected.city],
                  ['Preferred Airline', selected.preferredAirline],
                  ['Frequent Routes', selected.frequentRoutes],
                  ['Passport No.', selected.passportNumber || '—'],
                  ['Passport Expiry', selected.passportExpiry ? formatDate(selected.passportExpiry) : '—'],
                  ['GST Number', selected.gstNumber || '—'],
                ] as [string, string][]).map(([label, value]) => (
                  <div key={label} className="bg-slate-50 p-3 rounded-lg">
                    <p className="text-[10px] text-slate-400 uppercase tracking-wide">{label}</p>
                    <p className="text-sm font-medium text-slate-900 truncate">{value || '—'}</p>
                  </div>
                ))}
              </div>

              {selected.notes && (
                <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg">
                  <p className="text-xs text-amber-600 font-medium mb-1">Notes</p>
                  <p className="text-sm text-slate-700">{selected.notes}</p>
                </div>
              )}

              {/* Booking history */}
              <div>
                <h4 className="text-sm font-semibold text-slate-900 mb-3">
                  Booking History ({customerBookings.length})
                </h4>
                {customerBookings.length > 0 ? (
                  <div className="space-y-2">
                    {customerBookings.map(b => (
                      <div key={b.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div>
                          <p className="text-sm font-medium text-slate-900">{b.id} · {b.sector}</p>
                          <p className="text-xs text-slate-500">{b.airline} · {formatDate(b.departureDate)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-slate-900">{formatCurrency(b.totalCharged)}</p>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${b.bookingStatus === 'Confirmed' ? 'bg-green-100 text-green-700' : b.bookingStatus === 'Travelled' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}`}>
                            {b.bookingStatus}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-400">No bookings found for this customer.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Add Form ── */}
      {showAddForm && (
        <CustomerForm
          title="Add New Customer"
          onClose={() => setShowAddForm(false)}
          onSubmit={handleAdd}
        />
      )}

      {/* ── Edit Form ── */}
      {editCustomer && (
        <CustomerForm
          title={`Edit — ${editCustomer.fullName}`}
          initial={editCustomer}
          onClose={() => setEditCustomer(null)}
          onSubmit={handleEdit}
        />
      )}

      {/* ── Delete Confirm ── */}
      {deleteTarget && (
        <ConfirmDialog
          customer={deleteTarget}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}

function Users({ size, className }: { size: number; className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      className={className}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
