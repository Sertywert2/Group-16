import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const FeedbackModal = ({ onClose, onSubmit, darkMode }) => {
  const { t } = useTranslation();
  const [rating, setRating] = useState('');
  const [comment, setComment] = useState('');
  const [files, setFiles] = useState([]);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!rating || rating < 1 || rating > 5) {
      setError(t('ratingRequired') || 'Please provide a rating between 1 and 5.');
      return;
    }
    if (files.length > 5) {
      setError(t('maxFilesExceeded') || 'Maximum 5 files allowed.');
      return;
    }
    setError('');
    onSubmit({ rating, comment, files });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center transition-opacity duration-300">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full transition-colors duration-300">
        <h2 className="text-2xl font-bold text-[#009739] mb-4">
          {t('submitFeedback')}
        </h2>
        {error && <p className="text-red-500 dark:text-red-400 mb-4" aria-live="polite">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 dark:text-gray-200 mb-2">{t('rating')}</label>
            <input
              type="number"
              min="1"
              max="5"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              className="p-2 border rounded w-full text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-[#009739] transition-colors duration-200"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-200 mb-2">{t('comment')}</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="p-2 border rounded w-full text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-[#009739] transition-colors duration-200"
            />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-200 mb-2">{t('files')}</label>
            <input
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={(e) => setFiles(Array.from(e.target.files))}
              className="p-2 border rounded w-full text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 dark:bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-600 dark:hover:bg-gray-500 transition-colors duration-200"
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              className="bg-[#009739] text-white px-4 py-2 rounded hover:bg-[#007B2F] transition-colors duration-200"
            >
              {t('submit')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeedbackModal;
