import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Plane, Eye, EyeOff, Lock, Mail, AlertCircle, Shield } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Please enter both email and password.'); return; }
    setLoading(true);
    setTimeout(() => {
      const result = login(email, password);
      if (!result.success) {
        setError(result.error || 'Login failed');
      }
      setLoading(false);
    }, 600);
  };

  const demoAccounts = [
    { label: 'Admin', email: 'admin@rrenterprises.in', password: 'admin@123', color: 'bg-red-50 border-red-200 text-red-700', badge: 'Full Access' },
    { label: 'Staff', email: 'arjun@rrenterprises.in', password: 'staff@123', color: 'bg-blue-50 border-blue-200 text-blue-700', badge: 'Edit Only' },
    { label: 'Viewer', email: 'view@rrenterprises.in', password: 'view@123', color: 'bg-slate-50 border-slate-200 text-slate-600', badge: 'Read Only' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0d1b3e] via-[#1a2f5a] to-[#0d1b3e] flex items-center justify-center p-4">
      {/* Background pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full translate-x-1/2 translate-y-1/2" />
        <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-blue-500/3 rounded-full -translate-x-1/2 -translate-y-1/2" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Company Logo & Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-amber-500 rounded-2xl shadow-2xl mb-4 rotate-3">
            <Plane size={36} className="text-[#0d1b3e] -rotate-3" />
          </div>
          <h1 className="text-3xl font-bold text-amber-400 tracking-wide">RR Tours & Travels</h1>
          <p className="text-blue-200/70 text-sm mt-1 uppercase tracking-widest">Your Journey, Our Responsibility</p>
          <div className="flex items-center justify-center gap-4 mt-2 text-xs text-blue-300/50">
            <span>+91 9827459223</span>
            <span>•</span>
            <span>Jharsuguda, Odisha</span>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8">
          <div className="flex items-center gap-2 mb-6">
            <Shield size={18} className="text-amber-400" />
            <h2 className="text-lg font-semibold text-white">Booking Management Login</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-blue-200/80 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-300/50" />
                <input
                  type="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setError(''); }}
                  placeholder="Enter your email"
                  className="w-full pl-10 pr-4 py-3 bg-white/8 border border-white/15 rounded-xl text-white placeholder-blue-300/30 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400/50 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-blue-200/80 mb-1.5">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-300/50" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(''); }}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-10 py-3 bg-white/8 border border-white/15 rounded-xl text-white placeholder-blue-300/30 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400/50 transition-all"
                />
                <button type="button" onClick={() => setShowPassword(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-300/50 hover:text-white transition-colors">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <AlertCircle size={14} className="text-red-400 flex-shrink-0" />
                <p className="text-xs text-red-300">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-[#0d1b3e] font-bold rounded-xl transition-all duration-200 text-sm shadow-lg shadow-amber-500/20 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <><span className="inline-block w-4 h-4 border-2 border-[#0d1b3e]/30 border-t-[#0d1b3e] rounded-full animate-spin" /> Signing in...</>
              ) : 'Sign In to Dashboard'}
            </button>
          </form>

          {/* Demo Accounts */}
          <div className="mt-6 pt-5 border-t border-white/10">
            <p className="text-xs text-blue-300/50 text-center mb-3 uppercase tracking-wider">Quick Demo Access</p>
            <div className="space-y-2">
              {demoAccounts.map(acc => (
                <button
                  key={acc.label}
                  onClick={() => { setEmail(acc.email); setPassword(acc.password); setError(''); }}
                  className="w-full flex items-center justify-between px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all text-left"
                >
                  <div>
                    <p className="text-xs font-medium text-white">{acc.label}</p>
                    <p className="text-[10px] text-blue-300/40">{acc.email}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${acc.color}`}>{acc.badge}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-blue-300/30 mt-6">
          © 2025 RR Tours & Travels · Jharsuguda-768201, Odisha, India
        </p>
      </div>
    </div>
  );
}
