import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';

const OTPActivation = ({ darkMode, setDarkMode }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { state } = useLocation();
  const { login } = useAuth();

  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!otp || !state?.email) {
      setError(t('otpEmailRequired') || 'OTP and email are required.');
      setLoading(false);
      return;
    }

    try {
      const response = await api.post('/auth/activate', { email: state.email, otp });
      login(response.data.token, response.data.user);
      setSuccess(t('activationSuccess') || 'Account activated successfully!');
      const redirectTo = state?.from || '/dashboard';
      setTimeout(() => navigate(redirectTo, { replace: true }), 1500);
    } catch (err) {
      let errorMessage = t('activationFailed') || 'Activation failed. Please try again.';
      setError(errorMessage);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[var(--bg)]">
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />

      <main className="flex-grow p-8 flex items-center justify-center">
        <form
          onSubmit={handleSubmit}
          className="card"
        >
          <h2 className="text-2xl font-bold mb-4">{t('activateAccount')}</h2>

          <p className="text-[var(--text)] mb-4">
            {t('enterOTP')} {state?.email || t('yourEmail')}
          </p>

          {error && <p className="text-[var(--error)] mb-4" aria-live="polite">{error}</p>}
          {success && <p className="text-[var(--success)] mb-4" aria-live="polite">{success}</p>}

          <div className="mb-4">
            <label className="block text-[var(--text)] mb-2" htmlFor="otp">
              {t('otp')}
            </label>
            <input
              id="otp"
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="input-field"
              required
              aria-label={t('otp')}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary disabled:opacity-50"
          >
            {loading ? t('activating') || 'Activating...' : t('activate')}
          </button>
        </form>
      </main>

      <Footer />
    </div>
  );
};

export default OTPActivation;