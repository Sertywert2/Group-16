// frontend/src/pages/CreateAccount.jsx
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../api';
import Header from '../components/Header';
import Footer from '../components/Footer';

const CreateAccount = ({ darkMode, setDarkMode }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
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

    if (!formData.name || !formData.email || !formData.password) {
      setError(t('allFieldsRequired') || 'All fields are required.');
      setLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError(
        t('passwordTooShort') || 'Password must be at least 8 characters long.'
      );
      setLoading(false);
      return;
    }

    try {
      const response = await api.post('/auth/register', formData);
      console.log('Registration response:', response.data);
      setSuccess(t('registrationSuccess') || 'Account created successfully!');
      navigate('/activate', {
        state: {
          email: formData.email,
          from: location.state?.from || '/dashboard',
        },
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          t('registrationFailed') ||
          'Registration failed. Please try again.'
      );
      console.error('Registration error:', {
        message: err.response?.data?.message,
        status: err.response?.status,
        data: err.response?.data,
      });
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
          <h2 className="text-2xl font-bold mb-4">
            {t('createAccount')}
          </h2>

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

          {/* Name Field */}
          <div className="mb-4">
            <label className="block mb-2" htmlFor="name">
              {t('name')}
            </label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="input-field"
              required
              aria-label={t('name')}
            />
          </div>

          {/* Email Field */}
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

          {/* Password Field */}
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

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full disabled:opacity-50"
          >
            {loading
              ? t('creating') || 'Creating account...'
              : t('createAccount')}
          </button>
        </form>
      </main>
      <Footer />
    </div>
  );
};

export default CreateAccount;
