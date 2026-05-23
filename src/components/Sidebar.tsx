import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { Page } from '../types';
import {
  LayoutDashboard, Plane, Users, CreditCard, TrendingUp, Receipt,
  RefreshCw, Building2, BarChart3, FileText, MessageSquare,
  ChevronLeft, ChevronRight, Bell, LogOut, Shield, HelpCircle
} from 'lucide-react';
import { cn } from '../utils/cn';
import { useState } from 'react';

interface NavItem {
  page: Page;
  label: string;
  icon: React.ReactNode;
  adminOnly?: boolean;
}

const navItems: NavItem[] = [
  { page: 'dashboard',   label: 'Dashboard',         icon: <LayoutDashboard size={18} /> },
  { page: 'bookings',    label: 'Flight Bookings',    icon: <Plane size={18} /> },
  { page: 'customers',   label: 'Customer Database',  icon: <Users size={18} /> },
  { page: 'payments',    label: 'Payment Tracker',    icon: <CreditCard size={18} /> },
  { page: 'profit-loss', label: 'Profit & Loss',      icon: <TrendingUp size={18} />, adminOnly: true },
  { page: 'expenses',    label: 'Expense Tracker',    icon: <Receipt size={18} />, adminOnly: true },
  { page: 'refunds',     label: 'Refund Tracker',     icon: <RefreshCw size={18} /> },
  { page: 'corporate',   label: 'Corporate Clients',  icon: <Building2 size={18} /> },
  { page: 'reports',     label: 'Reports',            icon: <BarChart3 size={18} />, adminOnly: true },
  { page: 'invoice',     label: 'Invoice Generator',  icon: <FileText size={18} /> },
  { page: 'leads',       label: 'Lead Management',    icon: <MessageSquare size={18} /> },
  { page: 'deploy',      label: 'How to Deploy',      icon: <HelpCircle size={18} />, adminOnly: true },
];

const roleColors: Record<string, string> = {
  admin: 'bg-red-500',
  staff: 'bg-blue-500',
  viewer: 'bg-slate-500',
};

const roleLabels: Record<string, string> = {
  admin: 'Admin',
  staff: 'Staff',
  viewer: 'Viewer',
};

export default function Sidebar() {
  const { currentPage, setCurrentPage, bookings } = useApp();
  const { user, logout, isAdmin } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const pendingPayments = bookings.reduce((sum, b) => sum + b.pendingAmount, 0);
  const pendingCount    = bookings.filter(b => b.pendingAmount > 0).length;

  const visibleItems = navItems.filter(item => !item.adminOnly || isAdmin);

  return (
    <div
      className={cn(
        'fixed left-0 top-0 h-screen flex flex-col transition-all duration-300 z-50 shadow-2xl',
        'bg-gradient-to-b from-[#0d1b3e] via-[#122347] to-[#0d1b3e]',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* ── Brand ── */}
      <div className={cn(
        'flex items-center gap-3 px-4 py-4 border-b border-white/10',
        collapsed ? 'justify-center' : ''
      )}>
        <div className="w-9 h-9 bg-amber-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
          <Plane size={18} className="text-[#0d1b3e]" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <h1 className="font-extrabold text-base leading-tight text-amber-400 truncate">
              RR Tours & Travels
            </h1>
            <p className="text-[9px] text-blue-300/50 uppercase tracking-widest truncate">
              Your Journey, Our Responsibility
            </p>
          </div>
        )}
      </div>

      {/* ── Pending alert ── */}
      {!collapsed && pendingPayments > 0 && (
        <div className="mx-3 mt-3 flex items-center gap-2 px-3 py-2 bg-amber-500/10 border border-amber-500/25 rounded-lg">
          <Bell size={13} className="text-amber-400 flex-shrink-0" />
          <span className="text-[11px] text-amber-300">
            {pendingCount} booking{pendingCount > 1 ? 's' : ''} · ₹{Math.floor(pendingPayments / 1000)}K pending
          </span>
        </div>
      )}

      {/* ── Navigation ── */}
      <nav className="flex-1 py-3 overflow-y-auto">
        {visibleItems.map(item => (
          <button
            key={item.page}
            onClick={() => setCurrentPage(item.page as Page)}
            className={cn(
              'w-full flex items-center gap-3 px-4 py-2.5 text-[13px] transition-all duration-150 relative group',
              collapsed ? 'justify-center' : '',
              currentPage === item.page
                ? 'bg-amber-500/20 text-amber-400 border-r-2 border-amber-400'
                : 'text-blue-200/70 hover:bg-white/5 hover:text-white'
            )}
            title={collapsed ? item.label : undefined}
          >
            <span className="flex-shrink-0">{item.icon}</span>
            {!collapsed && (
              <span className="truncate font-medium">{item.label}</span>
            )}
            {!collapsed && item.adminOnly && (
              <Shield size={10} className="ml-auto flex-shrink-0 text-amber-500/60" />
            )}
          </button>
        ))}
      </nav>

      {/* ── User info ── */}
      {user && !collapsed && (
        <div className="mx-3 mb-3 p-3 bg-white/5 border border-white/10 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ${roleColors[user.role]}`}>
              {user.avatar}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white truncate">{user.name}</p>
              <p className="text-[10px] text-blue-300/50 truncate">{user.email}</p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full text-white ${roleColors[user.role]}`}>
              {roleLabels[user.role]}
            </span>
            <button onClick={logout} className="flex items-center gap-1 text-[11px] text-blue-300/60 hover:text-red-400 transition-colors">
              <LogOut size={12} />Logout
            </button>
          </div>
        </div>
      )}

      {user && collapsed && (
        <div className="flex flex-col items-center gap-2 pb-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${roleColors[user.role]}`}>
            {user.avatar}
          </div>
          <button onClick={logout} className="text-blue-300/60 hover:text-red-400 transition-colors p-1">
            <LogOut size={14} />
          </button>
        </div>
      )}

      {/* ── Collapse toggle ── */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center justify-center gap-2 px-4 py-3 border-t border-white/10 text-blue-300/50 hover:text-white hover:bg-white/5 transition-all text-xs"
      >
        {collapsed
          ? <ChevronRight size={16} />
          : <><ChevronLeft size={16} /><span>Collapse</span></>
        }
      </button>
    </div>
  );
}
