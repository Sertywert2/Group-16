import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../hooks/useAuth';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Dashboard = ({ darkMode, setDarkMode }) => {
  const { t } = useTranslation();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [feedbackList, setFeedbackList] = useState([]);
  const [analytics, setAnalytics] = useState({ users: 0, sessions: 0, revenue: 0 });
  const [newService, setNewService] = useState({ name: '', description: '', files: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showServices, setShowServices] = useState(true);
  const [showFeedback, setShowFeedback] = useState(true);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      navigate('/signin');
      return;
    }

    const fetchData = async () => {
      try {
        const [servicesResponse, feedbackResponse, analyticsResponse] = await Promise.all([
          api.get('/services'),
          api.get('/feedback'),
          api.get('/analytics'),
        ]);
        setServices(servicesResponse.data);
        setFeedbackList(feedbackResponse.data.feedback); // Fixed: Access the 'feedback' array
        setAnalytics(analyticsResponse.data);
        setLoading(false);
      } catch (err) {
        setError(t('errorLoadingData') || 'Failed to load data.');
        setLoading(false);
        console.error('Error loading data:', err);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, [user, authLoading, navigate, t]);

  const handleAddService = async () => {
    if (!newService.name) {
      setError(t('serviceNameRequired') || 'Service name is required.');
      return;
    }
    try {
      const formData = new FormData();
      formData.append('name', newService.name);
      formData.append('description', newService.description);
      newService.files.forEach(file => formData.append('serviceFiles', file));
      const response = await api.post('/services', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setServices([...services, response.data]);
      setNewService({ name: '', description: '', files: [] });
      setError(null);
    } catch (err) {
      console.error('Error adding service:', err);
      setError(t('errorAddingService') || 'Failed to add service.');
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      setError(t('maxFilesExceeded') || 'Maximum 5 files allowed.');
      return;
    }
    setNewService({ ...newService, files });
  };

  if (authLoading) return <div className="text-center p-4 text-gray-900 dark:text-gray-100">{t('loading')}</div>;
  if (!user) return null;
  if (loading) return <div className="text-center p-4 text-gray-900 dark:text-gray-100">{t('loading')}</div>;
  if (error) return <div className="text-center p-4 text-red-500 dark:text-red-400">{error}</div>;

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />
      <main className="flex-grow p-8">
        <h1 className="text-3xl font-bold text-[#009739] dark:text-[#FCD200] mb-4 transition-colors duration-200">
          {user.isAdmin ? t('adminDashboard') : t('dashboard')}
        </h1>
        <p className="text-gray-700 dark:text-gray-200 mb-8 transition-colors duration-200">
          {user.isAdmin ? t('adminWelcome') : t('welcomeDashboard')}, {user.name}!
        </p>

        {/* Analytics Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-[#009739] dark:text-[#FCD200] mb-4 transition-colors duration-200">
            {t('analytics')}
          </h2>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg transition-colors duration-300">
            <p className="text-gray-700 dark:text-gray-200"><strong>{t('users')}:</strong> {analytics.users}</p>
            <p className="text-gray-700 dark:text-gray-200"><strong>{t('sessions')}:</strong> {analytics.sessions}</p>
            <p className="text-gray-700 dark:text-gray-200"><strong>{t('revenue')}:</strong> ${analytics.revenue}</p>
          </div>
        </section>

        {/* Service Management */}
        {user.isAdmin && (
          <section className="mb-8">
            <h2
              className="text-2xl font-semibold text-[#009739] dark:text-[#FCD200] mb-4 cursor-pointer transition-colors duration-200"
              onClick={() => setShowServices(!showServices)}
            >
              {t('serviceManagement')} {showServices ? '▲' : '▼'}
            </h2>
            {showServices && (
              <div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg mb-4 transition-colors duration-300">
                  <input
                    type="text"
                    value={newService.name}
                    onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                    placeholder={t('serviceName')}
                    className="p-2 border rounded-lg w-full mb-2 text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-[#009739] dark:focus:ring-[#FCD200] transition-colors duration-200"
                  />
                  <input
                    type="text"
                    value={newService.description}
                    onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                    placeholder={t('description')}
                    className="p-2 border rounded-lg w-full mb-2 text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-[#009739] dark:focus:ring-[#FCD200] transition-colors duration-200"
                  />
                  <input
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    onChange={handleFileChange}
                    className="p-2 border rounded-lg w-full mb-2 text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700"
                  />
                  <button
                    onClick={handleAddService}
                    className="bg-[#009739] dark:bg-[#FCD200] text-white dark:text-gray-900 px-4 py-2 rounded-lg shadow-md hover:bg-[#007B2F] dark:hover:bg-[#DAA520] transition-colors duration-200 w-full"
                  >
                    {t('addService')}
                  </button>
                </div>
                <ul className="space-y-4">
                  {services.map((service) => (
                    <li key={service._id} className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg transition-colors duration-300">
                      <span className="font-medium text-gray-900 dark:text-gray-100">{service.name}</span>
                      <p className="text-gray-700 dark:text-gray-200">{service.description}</p>
                      {service.files.length > 0 && (
                        <div className="mt-2">
                          <strong className="text-gray-700 dark:text-gray-200">{t('files')}:</strong>
                          <div className="flex flex-wrap gap-2">
                            {service.files.map(f => (
                              <img
                                key={f.filename}
                                src={`/uploads/${f.filename}`}
                                alt={f.originalname}
                                className="w-24 h-24 object-cover rounded-lg"
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        )}

        {/* Feedback Section */}
        <section>
          <h2
            className="text-2xl font-semibold text-[#009739] dark:text-[#FCD200] mb-4 cursor-pointer transition-colors duration-200"
            onClick={() => setShowFeedback(!showFeedback)}
          >
            {t('feedback')} {showFeedback ? '▲' : '▼'}
          </h2>
          {showFeedback && (
            <div>
              {feedbackList.length === 0 ? (
                <p className="text-gray-600 dark:text-gray-300">{t('noFeedback')}</p>
              ) : (
                <ul className="space-y-4">
                  {feedbackList.map((feedback) => (
                    <li key={feedback._id} className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg transition-colors duration-300">
                      <p className="text-gray-700 dark:text-gray-200">
                        <strong>{t('user')}:</strong> {feedback.user.name} ({feedback.user.email})
                      </p>
                      <p className="text-gray-700 dark:text-gray-200">
                        <strong>{t('rating')}:</strong> {feedback.rating}/5
                      </p>
                      <p className="text-gray-700 dark:text-gray-200">
                        <strong>{t('comment')}:</strong> {feedback.comment || t('noComment')}
                      </p>
                      {feedback.files.length > 0 && (
                        <div className="mt-2">
                          <strong className="text-gray-700 dark:text-gray-200">{t('files')}:</strong>
                          <div className="flex flex-wrap gap-2">
                            {feedback.files.map(f => (
                              <img
                                key={f.filename}
                                src={`/uploads/${f.filename}`}
                                alt={f.originalname}
                                className="w-24 h-24 object-cover rounded-lg"
                              />
                            ))}
                          </div>
                        </div>
                      )}
                      <p className="text-gray-700 dark:text-gray-200">
                        <strong>{t('date')}:</strong> {new Date(feedback.date).toLocaleString()}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;