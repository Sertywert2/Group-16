import { Routes, Route, Navigate } from 'react-router-dom'
import Landing from './pages/Landing'
import AdminLoginPage from './pages/AdminLogin'
import LoginPage from './pages/login'
import RegisterPage from './pages/signup'
import ServicesPage from './pages/services'
import AdminDashboard from './pages/AdminDashboard'
import FeedbackPage from './pages/Feedback'
import ProtectedRoute from './components/ProtectedRoute'
import { LanguageProvider } from './contexts/LanguageContext'
import './styles/amharic-fix.css'



function App() {


  return (
    <LanguageProvider>
       <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] transition-colors duration-300">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/admin-login" element={<AdminLoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
         
          <Route path="/listings" element={<ServicesPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute adminOnly>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/feedback"
            element={
              <ProtectedRoute>
                <FeedbackPage />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </LanguageProvider>
  )
}

export default App
