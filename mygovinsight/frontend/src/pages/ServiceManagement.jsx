import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../api';
import { useAuth } from '../hooks/useAuth';
import Header from '../components/Header';
import Footer from '../components/Footer';

const ServiceManagement = ({ darkMode, setDarkMode }) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [services, setServices] = useState([]);
  const [feedbackList, setFeedbackList] = useState([]);
  const [newService, setNewService] = useState({ name: '', description: '', files: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesResponse, feedbackResponse] = await Promise.all([
          api.get('/services'),
          api.get('/feedback')
        ]);
        setServices(servicesResponse.data);
        setFeedbackList(feedbackResponse.data);
        setLoading(false);
      } catch (err) {
        setError(t('errorLoadingData'));
        setLoading(false);
        console.error('Error loading data:', err);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleAddService = async () => {
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
    } catch (err) {
      console.error('Error adding service:', err);
      setError(t('errorAddingService'));
    }
  };

  const handleFileChange = (e) => {
    setNewService({ ...newService, files: Array.from(e.target.files) });
  };

  if (!user) return <div className="text-center p-4 text-[var(--text)]">{t('pleaseSignIn')}</div>;
  if (loading) return <div className="text-center p-4 text-[var(--text)]">{t('loading')}</div>;
  if (error) return <div className="text-center p-4 text-[var(--error)]">{error}</div>;

  return (
    <div className="flex flex-col min-h-screen bg-[var(--bg)]">
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />
      <main className="flex-grow p-8">
        <h1 className="text-3xl font-bold mb-4">{t('dashboard')}</h1>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">{t('serviceManagement')}</h2>
          <div className="mb-4">
            <input
              type="text"
              value={newService.name}
              onChange={(e) => setNewService({ ...newService, name: e.target.value })}
              placeholder={t('serviceName')}
              className="dashboard-input mr-2"
            />
            <input
              type="text"
              value={newService.description}
              onChange={(e) => setNewService({ ...newService, description: e.target.value })}
              placeholder={t('description')}
              className="dashboard-input mr-2"
            />
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="dashboard-input mr-2"
            />
            <button
              onClick={handleAddService}
              className="dashboard-button"
            >
              {t('addService')}
            </button>
          </div>
          <ul className="space-y-2">
            {services.map((service) => (
              <li key={service._id} className="card">
                <span className="font-medium text-[var(--text)]">{service.name}</span> - {service.description}
                {service.files.length > 0 && (
                  <div>
                    <strong className="text-[var(--text)]">{t('files')}:</strong>
                    {service.files.map(f => (
                      <img key={f.filename} src={`/uploads/${f.filename}`} alt={f.originalname} className="w-32 h-32 object-cover inline-block mr-2" />
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">{t('feedback')}</h2>
          {feedbackList.length === 0 ? (
            <p className="text-[var(--text)]">{t('noFeedback')}</p>
          ) : (
            <ul className="space-y-4">
              {feedbackList.map((feedback) => (
                <li key={feedback._id} className="card">
                  <p><strong className="text-[var(--text)]">{t('user')}:</strong> {feedback.user.name} ({feedback.user.email})</p>
                  <p><strong className="text-[var(--text)]">{t('rating')}:</strong> {feedback.rating}/5</p>
                  <p><strong className="text-[var(--text)]">{t('comment')}:</strong> {feedback.comment || t('noComment')}</p>
                  {feedback.files.length > 0 && (
                    <div>
                      <strong className="text-[var(--text)]">{t('files')}:</strong>
                      {feedback.files.map(f => (
                        <img key={f.filename} src={`/uploads/${f.filename}`} alt={f.originalname} className="w-32 h-32 object-cover inline-block mr-2" />
                      ))}
                    </div>
                  )}
                  <p><strong className="text-[var(--text)]">{t('date')}:</strong> {new Date(feedback.date).toLocaleString()}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ServiceManagement;