import { useLocation, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Header from '../components/Header';
import Footer from '../components/Footer';

const FeedbackConfirmation = ({ darkMode, setDarkMode }) => {
  const { t } = useTranslation();
  const { state } = useLocation();
  const { rating } = state || {};

  return (
    <div className="flex flex-col min-h-screen bg-[var(--bg)]">
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="card">
          <h1 className="text-2xl font-bold mb-4 text-center">{t('thankYou')}</h1>
          <p className="text-[var(--text)] mb-4 text-center">{t('feedbackSubmitted')}</p>
          {rating && <p className="text-[var(--text)] mb-4 text-center">{t('rating')}: {rating}/5</p>}
          <div className="flex justify-center space-x-4">
            <Link to="/feedback">
              <button className="btn-primary">
                {t('submitAnother')}
              </button>
            </Link>
            <Link to="/">
              <button className="btn-secondary">
                {t('backToHome')}
              </button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FeedbackConfirmation;