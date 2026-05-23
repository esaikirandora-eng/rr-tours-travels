import { AppProvider } from './context/AppContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import FlightBookings from './components/FlightBookings';
import CustomerDatabase from './components/CustomerDatabase';
import PaymentTracker from './components/PaymentTracker';
import ProfitLoss from './components/ProfitLoss';
import ExpenseTracker from './components/ExpenseTracker';
import RefundTracker from './components/RefundTracker';
import CorporateClients from './components/CorporateClients';
import Reports from './components/Reports';
import Invoice from './components/Invoice';
import LeadManagement from './components/LeadManagement';
import DeployGuide from './components/DeployGuide';
import LoginPage from './components/LoginPage';
import { useApp } from './context/AppContext';

function AppContent() {
  const { currentPage } = useApp();
  const { user } = useAuth();

  if (!user) return <LoginPage />;

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':   return <Dashboard />;
      case 'bookings':    return <FlightBookings />;
      case 'customers':   return <CustomerDatabase />;
      case 'payments':    return <PaymentTracker />;
      case 'profit-loss': return <ProfitLoss />;
      case 'expenses':    return <ExpenseTracker />;
      case 'refunds':     return <RefundTracker />;
      case 'corporate':   return <CorporateClients />;
      case 'reports':     return <Reports />;
      case 'invoice':     return <Invoice />;
      case 'leads':       return <LeadManagement />;
      case 'deploy':      return <DeployGuide />;
      default:            return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <Sidebar />
      <main className="ml-64 p-6 min-h-screen transition-all duration-300">
        {renderPage()}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </AuthProvider>
  );
}
