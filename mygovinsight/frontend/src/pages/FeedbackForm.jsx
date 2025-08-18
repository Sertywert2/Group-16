// frontend/src/pages/FeedbackForm.jsx
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import FeedbackModal from '../components/FeedbackModal';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../hooks/useAuth';

const FeedbackForm = ({ darkMode, setDarkMode }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState('');

  if (authLoading) {
    return (
      <div className="text-center p-4 text-gray-900 dark:text-gray-100">
        {t('loading')}
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center p-4 text-gray-900 dark:text-gray-100">
        {t('pleaseSignIn')}
      </div>
    );
  }

  const handleSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append('rating', data.rating);
      formData.append('comment', data.comment);
      data.files.forEach((file) => formData.append('feedbackFiles', file));

      await api.post('/feedback', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setIsModalOpen(false);
      navigate('/confirmation', { state: { rating: data.rating } });
    } catch (err) {
      setError(t('submitFailed') || 'Failed to submit feedback.');
      console.error('Feedback submit error:', err);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />
      <main className="flex-grow p-8 flex items-center justify-center">
        <div className="card w-full max-w-md text-center">
          <h1 className="text-2xl font-bold mb-6">
            {t('feedback')}
          </h1>

          <button
            onClick={() => setIsModalOpen(true)}
            className="btn-primary w-full"
          >
            {t('openFeedback')}
          </button>

          {error && (
            <p
              className="text-red-500 dark:text-red-400 mt-4"
              aria-live="polite"
            >
              {error}
            </p>
          )}
        </div>

        {isModalOpen && (
          <FeedbackModal
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleSubmit}
            darkMode={darkMode}
          />
        )}
      </main>
      <Footer />
    </div>
  );
};

export default FeedbackForm;
