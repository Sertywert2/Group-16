// frontend/src/pages/SignIn.jsx
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';

const SignIn = ({ darkMode, setDarkMode }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { state } = useLocation();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: state?.email || '',
    password: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!formData.email || !formData.password) {
      setError(t('emailPasswordRequired') || 'Email and password are required.');
      setLoading(false);
      return;
    }

    try {
      console.log('SignIn attempt:', { email: formData.email });
      const response = await api.post('/auth/login', {
        email: formData.email,
        password: formData.password,
      });
      console.log('SignIn response:', response.data);

      login(response.data.token, response.data.user);
      setSuccess(t('loginSuccess') || 'Signed in successfully!');
      const redirectTo = state?.from || '/dashboard';
      setTimeout(() => {
        navigate(redirectTo, { replace: true });
      }, 1500);
    } catch (err) {
      const isHtmlResponse =
        typeof err.response?.data === 'string' &&
        err.response?.data.includes('<!DOCTYPE html');
      let errorMessage;
      if (!err.response && err.code === 'ERR_NETWORK') {
        errorMessage =
          t('networkError') ||
          'Network error: Could not reach the server. Please ensure the backend is running on http://localhost:5000 and check your network connection.';
      } else if (!err.response && err.message.includes('Failed to fetch')) {
        errorMessage =
          t('corsError') ||
          'CORS error: The server may not be configured to allow requests from http://localhost:5173. Please check backend CORS settings or contact support.';
      } else if (err.response?.status === 404) {
        errorMessage =
          t('endpointNotFound') ||
          'Sign-in endpoint not found. The backend route /api/auth/login may be missing. Please check server configuration or contact support.';
      } else if (err.response?.status === 401) {
        errorMessage =
          err.response?.data?.message ||
          t('invalidCredentials') ||
          'Invalid email or password. Please try again or verify your account.';
      } else {
        errorMessage =
          err.response?.data?.message ||
          err.message ||
          t('loginFailed') ||
          'Login failed. Please try again later.';
      }
      setError(errorMessage);
      console.error('Login error:', {
        message: errorMessage,
        status: err.response?.status || 'N/A',
        code: err.code || 'N/A',
        data: isHtmlResponse
          ? 'HTML response received'
          : err.response?.data || 'N/A',
        stack: err.stack || 'N/A',
        requestUrl: '/auth/login',
        requestData: { email: formData.email },
        rawError: JSON.stringify(err, Object.getOwnPropertyNames(err), 2),
      });
      if (
        err.response?.status === 404 ||
        err.code === 'ERR_NETWORK' ||
        err.message.includes('Failed to fetch')
      ) {
        setTimeout(() => {
          navigate('/create-account', { replace: true });
        }, 1500);
      } else if (
        err.response?.status === 401 &&
        err.response?.data?.message?.includes('unverified')
      ) {
        setTimeout(() => {
          navigate('/activate', {
            state: { email: formData.email },
            replace: true,
          });
        }, 1500);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />
      <main className="flex-grow p-8 flex items-center justify-center">
        <form
          onSubmit={handleSubmit}
          className="card w-full max-w-md"
        >
          <h2 className="text-2xl font-bold mb-4">{t('signIn')}</h2>

          {error && (
            <p
              className="text-red-500 dark:text-red-400 mb-4"
              aria-live="polite"
            >
              {error}
            </p>
          )}
          {success && (
            <p
              className="text-green-600 dark:text-green-400 mb-4"
              aria-live="polite"
            >
              {success}
            </p>
          )}

          <div className="mb-4">
            <label className="block mb-2" htmlFor="email">
              {t('email')}
            </label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="input-field"
              required
              aria-label={t('email')}
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2" htmlFor="password">
              {t('password')}
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="input-field pr-10"
                required
                aria-label={t('password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-500 dark:text-gray-400"
                aria-label={showPassword ? t('hidePassword') : t('showPassword')}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full disabled:opacity-50"
          >
            {loading ? t('signingIn') || 'Signing In...' : t('signIn')}
          </button>
        </form>
      </main>
      <Footer />
    </div>
  );
};

export default SignIn;
