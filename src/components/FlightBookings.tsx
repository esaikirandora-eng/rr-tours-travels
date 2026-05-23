import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { formatCurrency, formatDate } from '../utils/cn';
import { Booking } from '../types';
import { useState } from 'react';
import { Search, Filter, Plus, X, Download, Eye, AlertTriangle, ChevronDown } from 'lucide-react';

const bookingStatuses = ['All', 'Confirmed', 'Cancelled', 'Hold', 'Refunded', 'Travelled'];
const bookingTypes = ['All', 'Domestic', 'International'];
const sources = ['All', 'Direct', 'Website', 'Agent', 'Corporate'];

export default function FlightBookings() {
  const { bookings } = useApp();
  const { isStaff } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [sourceFilter, setSourceFilter] = useState('All');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showDetail, setShowDetail] = useState<Booking | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const filtered = bookings.filter(b => {
    const matchSearch = searchTerm === '' ||
      b.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.pnr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.sector.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.airline.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'All' || b.bookingStatus === statusFilter;
    const matchType = typeFilter === 'All' || b.type === typeFilter;
    const matchSource = sourceFilter === 'All' || b.source === sourceFilter;
    return matchSearch && matchStatus && matchType && matchSource;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed': return 'bg-green-100 text-green-700 border-green-200';
      case 'Cancelled': return 'bg-red-100 text-red-700 border-red-200';
      case 'Hold': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Refunded': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Travelled': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(filtered.map(b => b.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Flight Booking Master</h2>
          <p className="text-sm text-slate-500 mt-1">{bookings.length} total bookings</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => {
            const csv = ['ID,Date,PNR,Customer,Airline,Sector,Departure,Status,Total,Profit,Pending'].join(',') + '\n' +
              bookings.map(b => [b.id, b.bookingDate, b.pnr, b.customerName, b.airline, b.sector, b.departureDate, b.bookingStatus, b.totalCharged, b.profitEarned, b.pendingAmount].join(',')).join('\n');
            const blob = new Blob([csv], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'bookings.csv';
            a.click();
          }} className="flex items-center gap-2 px-4 py-2 text-sm bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
            <Download size={14} /> Export CSV
          </button>
          {isStaff && (
            <button onClick={() => setShowAddForm(true)} className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Plus size={14} /> New Booking
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="relative flex-1 min-w-[250px]">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by ID, name, PNR, sector, airline..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-slate-400" />
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="text-sm border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
              {bookingStatuses.map(s => <option key={s} value={s}>{s === 'All' ? 'All Status' : s}</option>)}
            </select>
            <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="text-sm border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
              {bookingTypes.map(t => <option key={t} value={t}>{t === 'All' ? 'All Types' : t}</option>)}
            </select>
            <select value={sourceFilter} onChange={e => setSourceFilter(e.target.value)} className="text-sm border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
              {sources.map(s => <option key={s} value={s}>{s === 'All' ? 'All Sources' : s}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-3 py-3 text-left">
                  <input type="checkbox" onChange={e => handleSelectAll(e.target.checked)} className="rounded" />
                </th>
                <th className="px-3 py-3 text-left font-medium text-slate-600">Booking ID</th>
                <th className="px-3 py-3 text-left font-medium text-slate-600">Customer</th>
                <th className="px-3 py-3 text-left font-medium text-slate-600">PNR</th>
                <th className="px-3 py-3 text-left font-medium text-slate-600">Route</th>
                <th className="px-3 py-3 text-left font-medium text-slate-600">Departure</th>
                <th className="px-3 py-3 text-left font-medium text-slate-600">Total</th>
                <th className="px-3 py-3 text-left font-medium text-slate-600">Profit</th>
                <th className="px-3 py-3 text-left font-medium text-slate-600">Pending</th>
                <th className="px-3 py-3 text-left font-medium text-slate-600">Status</th>
                <th className="px-3 py-3 text-left font-medium text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(b => (
                <tr key={b.id} className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${b.pendingAmount > 0 ? 'bg-red-50/50' : ''}`}>
                  <td className="px-3 py-3"><input type="checkbox" checked={selectedIds.includes(b.id)} onChange={() => handleSelect(b.id)} className="rounded" /></td>
                  <td className="px-3 py-3 font-mono text-xs font-medium text-blue-600">{b.id}</td>
                  <td className="px-3 py-3">
                    <div>
                      <p className="font-medium text-slate-900">{b.customerName}</p>
                      <p className="text-xs text-slate-500">{b.airline} • {b.type}</p>
                    </div>
                  </td>
                  <td className="px-3 py-3 font-mono text-xs">{b.pnr}</td>
                  <td className="px-3 py-3 font-medium text-slate-700">{b.sector}</td>
                  <td className="px-3 py-3 text-xs">{formatDate(b.departureDate)}</td>
                  <td className="px-3 py-3 font-medium">{formatCurrency(b.totalCharged)}</td>
                  <td className="px-3 py-3 font-medium text-green-600">{formatCurrency(b.profitEarned)}</td>
                  <td className="px-3 py-3">
                    {b.pendingAmount > 0 ? (
                      <span className="text-red-600 font-bold flex items-center gap-1"><AlertTriangle size={12} />{formatCurrency(b.pendingAmount)}</span>
                    ) : (
                      <span className="text-green-600 text-xs">Paid</span>
                    )}
                  </td>
                  <td className="px-3 py-3"><span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(b.bookingStatus)}`}>{b.bookingStatus}</span></td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => setShowDetail(b)} className="p-1.5 hover:bg-blue-50 rounded text-blue-600"><Eye size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-slate-200 bg-slate-50 text-sm text-slate-500 flex items-center justify-between">
          <span>Showing {filtered.length} of {bookings.length} bookings</span>
          {selectedIds.length > 0 && <span className="text-blue-600">{selectedIds.length} selected</span>}
        </div>
      </div>

      {/* Detail Modal */}
      {showDetail && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowDetail(null)}>
          <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-slate-200 sticky top-0 bg-white z-10">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-bold text-slate-900">Booking Details</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(showDetail.bookingStatus)}`}>{showDetail.bookingStatus}</span>
              </div>
              <button onClick={() => setShowDetail(null)} className="p-1 hover:bg-slate-100 rounded"><X size={20} /></button>
            </div>
            <div className="p-5 space-y-6">
              {/* Booking Info */}
              <div>
                <h4 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2"><ChevronDown size={14} className="text-blue-500" />Booking Information</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    ['Booking ID', showDetail.id],
                    ['Date', formatDate(showDetail.bookingDate)],
                    ['PNR', showDetail.pnr],
                    ['Ticket No.', showDetail.ticketNumber],
                    ['Source', showDetail.source],
                    ['Type', showDetail.type],
                    ['Airline', showDetail.airline],
                    ['Flight', showDetail.flightNumber],
                    ['Sector', showDetail.sector],
                    ['Class', showDetail.travelClass],
                    ['Passengers', showDetail.passengerCount],
                    ['Staff', showDetail.staffName],
                  ].map(([label, value]) => (
                    <div key={label} className="bg-slate-50 p-2.5 rounded-lg">
                      <p className="text-xs text-slate-500">{label}</p>
                      <p className="text-sm font-medium text-slate-900">{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Travel Dates */}
              <div>
                <h4 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2"><ChevronDown size={14} className="text-blue-500" />Travel Dates</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-xs text-blue-600">Departure</p>
                    <p className="text-sm font-medium text-slate-900">{formatDate(showDetail.departureDate)}</p>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <p className="text-xs text-purple-600">Return</p>
                    <p className="text-sm font-medium text-slate-900">{formatDate(showDetail.returnDate)}</p>
                  </div>
                </div>
              </div>

              {/* Financial Details */}
              <div>
                <h4 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2"><ChevronDown size={14} className="text-blue-500" />Financial Details</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    ['Airline Fare', formatCurrency(showDetail.airlineFare)],
                    ['Taxes', formatCurrency(showDetail.taxes)],
                    ['Service Charge', formatCurrency(showDetail.serviceCharge)],
                    ['Convenience Fee', formatCurrency(showDetail.convenienceFee)],
                    ['Markup', formatCurrency(showDetail.markupAdded)],
                    ['Total Charged', formatCurrency(showDetail.totalCharged)],
                    ['Ticket Cost', formatCurrency(showDetail.actualTicketCost)],
                    ['Profit', formatCurrency(showDetail.profitEarned)],
                    ['Received', formatCurrency(showDetail.paymentReceived)],
                    ['Pending', showDetail.pendingAmount > 0 ? formatCurrency(showDetail.pendingAmount) : '₹0'],
                    ['Mode', showDetail.paymentMode],
                    ['Refund', showDetail.refundAmount > 0 ? formatCurrency(showDetail.refundAmount) : '₹0'],
                  ].map(([label, value]) => (
                    <div key={label} className="bg-slate-50 p-2.5 rounded-lg">
                      <p className="text-xs text-slate-500">{label}</p>
                      <p className={`text-sm font-medium ${label === 'Profit' ? 'text-green-600' : label === 'Pending' && value !== '₹0' ? 'text-red-600 font-bold' : 'text-slate-900'}`}>{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Customer Info */}
              <div>
                <h4 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2"><ChevronDown size={14} className="text-blue-500" />Customer Details</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    ['Name', showDetail.customerName],
                    ['Phone', showDetail.customerPhone],
                    ['WhatsApp', showDetail.customerWhatsapp],
                    ['Email', showDetail.customerEmail],
                    ['City', showDetail.city],
                    ['Company', showDetail.companyName || '-'],
                  ].map(([label, value]) => (
                    <div key={label} className="bg-slate-50 p-2.5 rounded-lg">
                      <p className="text-xs text-slate-500">{label}</p>
                      <p className="text-sm font-medium text-slate-900">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Booking Form Modal */}
      {showAddForm && <BookingForm onClose={() => setShowAddForm(false)} />}
    </div>
  );
}

function BookingForm({ onClose }: { onClose: () => void }) {
  const { bookings, setBookings } = useApp();
  const [formData, setFormData] = useState({
    customerName: '', customerPhone: '', customerEmail: '', airline: 'IndiGo', sector: '',
    departureDate: '', returnDate: '', travelClass: 'Economy' as Booking['travelClass'],
    passengerCount: 1, type: 'Domestic' as Booking['type'], source: 'Direct' as Booking['source'],
    airlineFare: 0, taxes: 0, serviceCharge: 500, convenienceFee: 200, markupAdded: 0,
    staffName: 'Arjun Mehta', remarks: ''
  });

  const totalCharged = formData.airlineFare + formData.taxes + formData.serviceCharge + formData.convenienceFee + formData.markupAdded;
  const nextId = `BK-${String(bookings.length + 1).padStart(4, '0')}`;

  const handleSubmit = () => {
    const newBooking: Booking = {
      id: nextId,
      bookingDate: new Date().toISOString().split('T')[0],
      pnr: Math.random().toString(36).substring(2, 8).toUpperCase(),
      ticketNumber: Math.floor(Math.random() * 9000000000 + 1000000000).toString(),
      flightNumber: '',
      customerId: '',
      ...formData,
      customerWhatsapp: formData.customerPhone,
      customerDob: '', passportNumber: '', passportExpiry: '', gstNumber: '',
      companyName: '', city: '', emergencyContact: '',
      actualTicketCost: formData.airlineFare + formData.taxes,
      profitEarned: formData.serviceCharge + formData.convenienceFee + formData.markupAdded,
      totalCharged,
      paymentReceived: 0, paymentMode: 'UPI' as Booking['paymentMode'],
      pendingAmount: totalCharged,
      refundAmount: 0, refundStatus: 'N/A' as Booking['refundStatus'],
      bookingStatus: 'Hold' as Booking['bookingStatus'],
      followUpRequired: true,
    };
    setBookings(prev => [...prev, newBooking]);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-slate-200 sticky top-0 bg-white z-10">
          <h3 className="text-lg font-bold text-slate-900">New Booking <span className="text-sm font-normal text-slate-500">({nextId})</span></h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded"><X size={20} /></button>
        </div>
        <div className="p-5 space-y-5">
          {/* Customer */}
          <div>
            <h4 className="text-sm font-semibold text-slate-900 mb-3">Customer Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input placeholder="Customer Name" value={formData.customerName} onChange={e => setFormData({...formData, customerName: e.target.value})} className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <input placeholder="Phone" value={formData.customerPhone} onChange={e => setFormData({...formData, customerPhone: e.target.value})} className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <input placeholder="Email" value={formData.customerEmail} onChange={e => setFormData({...formData, customerEmail: e.target.value})} className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          {/* Flight Details */}
          <div>
            <h4 className="text-sm font-semibold text-slate-900 mb-3">Flight Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <select value={formData.airline} onChange={e => setFormData({...formData, airline: e.target.value})} className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                {['IndiGo', 'Air India', 'SpiceJet', 'Vistara', 'Emirates', 'Singapore Airlines', 'Lufthansa', 'Qatar Airways', 'British Airways'].map(a => <option key={a}>{a}</option>)}
              </select>
              <input placeholder="Sector (e.g., DEL-BOM)" value={formData.sector} onChange={e => setFormData({...formData, sector: e.target.value})} className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <input type="date" value={formData.departureDate} onChange={e => setFormData({...formData, departureDate: e.target.value})} className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <input type="date" value={formData.returnDate} onChange={e => setFormData({...formData, returnDate: e.target.value})} className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <select value={formData.travelClass} onChange={e => setFormData({...formData, travelClass: e.target.value as Booking['travelClass']})} className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                {['Economy', 'Premium Economy', 'Business', 'First Class'].map(c => <option key={c}>{c}</option>)}
              </select>
              <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value as Booking['type']})} className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                {['Domestic', 'International'].map(t => <option key={t}>{t}</option>)}
              </select>
              <select value={formData.source} onChange={e => setFormData({...formData, source: e.target.value as Booking['source']})} className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                {['Direct', 'Website', 'Agent', 'Corporate'].map(s => <option key={s}>{s}</option>)}
              </select>
              <input type="number" placeholder="Passengers" value={formData.passengerCount} onChange={e => setFormData({...formData, passengerCount: parseInt(e.target.value) || 1})} className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          {/* Financial */}
          <div>
            <h4 className="text-sm font-semibold text-slate-900 mb-3">Financial Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              <input type="number" placeholder="Airline Fare" value={formData.airlineFare || ''} onChange={e => setFormData({...formData, airlineFare: parseInt(e.target.value) || 0})} className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <input type="number" placeholder="Taxes" value={formData.taxes || ''} onChange={e => setFormData({...formData, taxes: parseInt(e.target.value) || 0})} className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <input type="number" placeholder="Service Charge" value={formData.serviceCharge || ''} onChange={e => setFormData({...formData, serviceCharge: parseInt(e.target.value) || 0})} className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <input type="number" placeholder="Markup" value={formData.markupAdded || ''} onChange={e => setFormData({...formData, markupAdded: parseInt(e.target.value) || 0})} className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <div className="bg-blue-50 p-2.5 rounded-lg flex flex-col justify-center">
                <p className="text-xs text-blue-600">Total Charged</p>
                <p className="text-lg font-bold text-blue-700">{formatCurrency(totalCharged)}</p>
              </div>
            </div>
          </div>

          <input placeholder="Remarks" value={formData.remarks} onChange={e => setFormData({...formData, remarks: e.target.value})} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
            <button onClick={onClose} className="px-5 py-2 text-sm border border-slate-300 rounded-lg hover:bg-slate-50">Cancel</button>
            <button onClick={handleSubmit} className="px-5 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">Create Booking</button>
          </div>
        </div>
      </div>
    </div>
  );
}
