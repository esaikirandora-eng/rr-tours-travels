import { useApp } from '../context/AppContext';
import { formatCurrency, daysUntil, formatDate } from '../utils/cn';
import {
  TrendingUp, TrendingDown, DollarSign, Plane, RefreshCw,
  AlertTriangle, Calendar, Clock, Award, Target, Activity,
  ChevronRight, Wallet, BarChart3
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area, Legend
} from 'recharts';

const COLORS = ['#3b82f6', '#8b5cf6', '#06b6d4', '#f59e0b', '#10b981', '#ef4444', '#ec4899', '#6366f1'];

function KPICard({ title, value, icon, color, change }: { title: string; value: string; icon: React.ReactNode; color: string; change?: { value: string; positive: boolean } }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{title}</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
          {change && (
            <div className="flex items-center gap-1 mt-2">
              {change.positive ? <TrendingUp size={12} className="text-green-500" /> : <TrendingDown size={12} className="text-red-500" />}
              <span className={`text-xs font-medium ${change.positive ? 'text-green-500' : 'text-red-500'}`}>{change.value}</span>
            </div>
          )}
        </div>
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { bookings } = useApp();

  const totalRevenue = bookings.reduce((sum, b) => sum + b.totalCharged, 0);
  const totalProfit = bookings.reduce((sum, b) => sum + b.profitEarned, 0);
  const totalPending = bookings.reduce((sum, b) => sum + b.pendingAmount, 0);
  const totalRefund = bookings.reduce((sum, b) => sum + b.refundAmount, 0);

  const monthlySales = [
    { month: 'Jan', revenue: 37300, profit: 2700, bookings: 3 },
    { month: 'Feb', revenue: 226520, profit: 25070, bookings: 7 },
    { month: 'Mar', revenue: 0, profit: 0, bookings: 0 },
  ];

  const airlineCount: Record<string, number> = {};
  bookings.forEach(b => { airlineCount[b.airline] = (airlineCount[b.airline] || 0) + 1; });
  const airlineData = Object.entries(airlineCount).map(([name, value]) => ({ name, value }));

  const statusCount: Record<string, number> = {};
  bookings.forEach(b => { statusCount[b.bookingStatus] = (statusCount[b.bookingStatus] || 0) + 1; });
  const statusData = Object.entries(statusCount).map(([name, value]) => ({ name, value }));

  const typeCount: Record<string, number> = {};
  bookings.forEach(b => { typeCount[b.type] = (typeCount[b.type] || 0) + 1; });
  const typeData = Object.entries(typeCount).map(([name, value]) => ({ name, value }));

  const staffPerf: Record<string, { bookings: number; revenue: number; profit: number }> = {};
  bookings.forEach(b => {
    if (!staffPerf[b.staffName]) staffPerf[b.staffName] = { bookings: 0, revenue: 0, profit: 0 };
    staffPerf[b.staffName].bookings++;
    staffPerf[b.staffName].revenue += b.totalCharged;
    staffPerf[b.staffName].profit += b.profitEarned;
  });
  const staffData = Object.entries(staffPerf).map(([name, data]) => ({ name, ...data }));

  const customerRev: Record<string, number> = {};
  bookings.forEach(b => { customerRev[b.customerName] = (customerRev[b.customerName] || 0) + b.totalCharged; });
  const topCustomers = Object.entries(customerRev)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([name, value]) => ({ name, value }));

  const upcoming = bookings
    .filter(b => b.bookingStatus === 'Confirmed' || b.bookingStatus === 'Hold')
    .filter(b => daysUntil(b.departureDate) > 0 && daysUntil(b.departureDate) <= 60)
    .sort((a, b) => daysUntil(a.departureDate) - daysUntil(b.departureDate))
    .slice(0, 5);

  const followUps = bookings.filter(b => b.followUpRequired && b.pendingAmount > 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            RR Tours &amp; Travels
            <span className="ml-3 text-sm font-normal text-slate-400 align-middle">Business Dashboard</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">+91 9827459223 · info.rrenterprises.in@gmail.com · Jharsuguda, Odisha</p>
        </div>
        <div className="text-xs text-slate-400 bg-white px-4 py-2 rounded-xl border border-slate-200">
          📅 {formatDate(new Date().toISOString())}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <KPICard title="Total Bookings" value={String(bookings.length)} icon={<Plane size={18} className="text-blue-600" />} color="bg-blue-50" change={{ value: '+12% vs last month', positive: true }} />
        <KPICard title="Total Revenue" value={formatCurrency(totalRevenue)} icon={<DollarSign size={18} className="text-green-600" />} color="bg-green-50" change={{ value: '+18.5%', positive: true }} />
        <KPICard title="Total Profit" value={formatCurrency(totalProfit)} icon={<TrendingUp size={18} className="text-emerald-600" />} color="bg-emerald-50" change={{ value: '+22.3%', positive: true }} />
        <KPICard title="Pending Payments" value={formatCurrency(totalPending)} icon={<AlertTriangle size={18} className="text-amber-600" />} color="bg-amber-50" change={{ value: '2 bookings', positive: false }} />
        <KPICard title="Refund Amount" value={formatCurrency(totalRefund)} icon={<RefreshCw size={18} className="text-red-600" />} color="bg-red-50" change={{ value: '1 refund', positive: false }} />
        <KPICard title="Net Profit" value={formatCurrency(totalProfit)} icon={<Wallet size={18} className="text-violet-600" />} color="bg-violet-50" change={{ value: 'Gross', positive: true }} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2"><BarChart3 size={16} />Monthly Sales & Profit</h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={monthlySales}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}K`} />
              <Tooltip formatter={(value: unknown) => [formatCurrency(Number(value)), '']} />
              <Legend />
              <Area type="monotone" dataKey="revenue" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} name="Revenue" />
              <Area type="monotone" dataKey="profit" stackId="2" stroke="#10b981" fill="#10b981" fillOpacity={0.2} name="Profit" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2"><Activity size={16} />Booking Status</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={statusData} cx="50%" cy="50%" outerRadius={70} innerRadius={35} dataKey="value" label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}>
                {statusData.map((_, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2"><Award size={16} />Top Customers</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={topCustomers} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" stroke="#64748b" fontSize={12} tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}K`} />
              <YAxis type="category" dataKey="name" stroke="#64748b" fontSize={11} width={90} />
              <Tooltip formatter={(value: unknown) => [formatCurrency(Number(value)), '']} />
              <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2"><Plane size={16} />Domestic vs International</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={typeData} cx="50%" cy="50%" outerRadius={75} dataKey="value" label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}>
                {typeData.map((_, index) => <Cell key={`cell-${index}`} fill={index === 0 ? '#06b6d4' : '#8b5cf6'} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2"><Target size={16} />Most Used Airlines</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={airlineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip />
              <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2"><Calendar size={16} />Upcoming Travel Dates</h3>
          {upcoming.length > 0 ? (
            <div className="space-y-3">
              {upcoming.map(b => (
                <div key={b.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${daysUntil(b.departureDate) <= 7 ? 'bg-red-500' : daysUntil(b.departureDate) <= 14 ? 'bg-amber-500' : 'bg-green-500'}`} />
                    <div>
                      <p className="text-sm font-medium text-slate-900">{b.customerName}</p>
                      <p className="text-xs text-slate-500">{b.sector} &bull; {b.airline}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-slate-900">{formatDate(b.departureDate)}</p>
                    <p className={`text-xs font-medium ${daysUntil(b.departureDate) <= 7 ? 'text-red-500' : 'text-slate-500'}`}>
                      {daysUntil(b.departureDate)} days left
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500 text-center py-8">No upcoming travels</p>
          )}
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2"><Clock size={16} />Follow-up Reminders</h3>
          {followUps.length > 0 ? (
            <div className="space-y-3">
              {followUps.map(b => (
                <div key={b.id} className="flex items-center justify-between p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-slate-900">{b.customerName}</p>
                    <p className="text-xs text-slate-500">{b.id} &bull; {b.sector}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-red-600">{formatCurrency(b.pendingAmount)}</p>
                    <button className="text-xs text-blue-600 hover:text-blue-800 font-medium mt-1 flex items-center gap-1 ml-auto">
                      Follow Up <ChevronRight size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500 text-center py-8">No pending follow-ups</p>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2"><Award size={16} />Agent-wise Performance</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={staffData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
            <YAxis stroke="#64748b" fontSize={12} tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}K`} />
            <Tooltip formatter={(value: unknown) => [formatCurrency(Number(value)), '']} />
            <Legend />
            <Bar dataKey="revenue" stackId="a" fill="#3b82f6" name="Revenue" radius={[4, 4, 0, 0]} />
            <Bar dataKey="profit" stackId="a" fill="#10b981" name="Profit" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
