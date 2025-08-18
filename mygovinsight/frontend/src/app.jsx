// frontend/src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Landing from './pages/Landing';
import FeedbackForm from './pages/FeedbackForm';
import FeedbackConfirmation from './pages/FeedbackConfirmation';
import Contact from './pages/Contact';
import CreateAccount from './pages/CreateAccount';
import SignIn from './pages/SignIn';
import OTPActivation from './pages/OTPActivation';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import ServiceManagement from './pages/ServiceManagement';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import SplitView from './pages/SplitView';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Footer from './components/Footer';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();
  const { t } = useTranslation();

  if (loading) return <div className="text-center p-4">{t('loading') || 'Loading...'}</div>;
  if (!user) return <Navigate to="/signin" replace />;
  if (requiredRole && user.role !== requiredRole) return <Navigate to="/dashboard" replace />;
  return children;
};

function App() {
  const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') === 'true');
  const { t } = useTranslation();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  return (
    <AuthProvider>
      <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] transition-colors duration-300">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Landing darkMode={darkMode} setDarkMode={setDarkMode} />} />
          <Route path="/contact" element={<Contact darkMode={darkMode} setDarkMode={setDarkMode} />} />
          <Route path="/create-account" element={<CreateAccount darkMode={darkMode} setDarkMode={setDarkMode} />} />
          <Route path="/signin" element={<SignIn darkMode={darkMode} setDarkMode={setDarkMode} />} />
          <Route path="/activate" element={<OTPActivation darkMode={darkMode} setDarkMode={setDarkMode} />} />

          {/* Protected routes */}
          <Route path="/feedback" element={<ProtectedRoute><FeedbackForm darkMode={darkMode} setDarkMode={setDarkMode} /></ProtectedRoute>} />
          <Route path="/confirmation" element={<ProtectedRoute><FeedbackConfirmation darkMode={darkMode} setDarkMode={setDarkMode} /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard darkMode={darkMode} setDarkMode={setDarkMode} /></ProtectedRoute>} />
          <Route path="/admin/dashboard" element={<ProtectedRoute requiredRole="admin"><AdminDashboard darkMode={darkMode} setDarkMode={setDarkMode} /></ProtectedRoute>} />
          <Route path="/admin/services" element={<ProtectedRoute requiredRole="admin"><ServiceManagement darkMode={darkMode} setDarkMode={setDarkMode} /></ProtectedRoute>} />
          <Route path="/analytics" element={<ProtectedRoute><AnalyticsDashboard darkMode={darkMode} setDarkMode={setDarkMode} /></ProtectedRoute>} />
          <Route path="/split-view" element={<ProtectedRoute><SplitView darkMode={darkMode} setDarkMode={setDarkMode} /></ProtectedRoute>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;
