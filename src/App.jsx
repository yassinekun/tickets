import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import MatchesPage from './pages/MatchesPage';
import TicketDetailsPage from './pages/TicketDetailsPage';
import DashboardPage from './pages/user/DashboardPage';
import SignupPage from './pages/user/SignupPage';
import LoginPage from './pages/user/LoginPage';
import TicketSwapPage from './pages/TicketSwapPage';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import LegalTerms from './pages/LegalTerms';
import LegalPrivacy from './pages/LegalPrivacy';
import { AuthProvider, useAuth } from './context/AuthContext';

// Protected Route Component
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, admin, loading } = useAuth();

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  if (requireAdmin) {
    if (!admin) return <Navigate to="/admin/login" replace />;
    return children;
  }

  if (!user) return <Navigate to="/login" replace />;

  return children;
};

// Layout wrapper to conditional render Navbar/Footer
const Layout = ({ children }) => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/signup' || location.pathname === '/login' || location.pathname === '/admin/login';
  const isAdminPage = location.pathname.startsWith('/admin');

  if (isAdminPage && location.pathname !== '/admin/login') {
    return <main>{children}</main>;
  }

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Background Pattern layer */}
      <div
        className="fixed inset-0 z-[-1] opacity-5 pointer-events-none"
        style={{
          backgroundImage: 'url("/pattern-01.png")',
          backgroundSize: '400px',
          backgroundRepeat: 'repeat'
        }}
      />

      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      {!isAuthPage && <Footer />}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/matches" element={<MatchesPage />} />
            <Route path="/tickets/:id" element={<TicketDetailsPage />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route path="/swap" element={<TicketSwapPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/terms" element={<LegalTerms />} />
            <Route path="/privacy" element={<LegalPrivacy />} />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminDashboardPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Layout>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
