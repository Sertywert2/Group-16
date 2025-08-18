import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../hooks/useAuth';

const Landing = ({ darkMode, setDarkMode }) => {
  const { t } = useTranslation();
  const { user, loading: authLoading } = useAuth();

  if (authLoading) {
    return <div className="text-center p-4">{t('loading')}</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-[var(--bg)] text-[var(--text)] transition-colors">
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />

      <main className="flex-grow p-8 text-center">
        {/* Page Title */}
        <h1 className="text-4xl font-bold mb-4 transition-colors">
          {t('myGovInsightsPro')}
        </h1>

        {/* Sub Text */}
        <p className="text-lg mb-8 text-gray-700 dark:text-gray-300">
          {user
            ? `${t('welcomeDashboard')}, ${user.name}!`
            : t('myGovInsight')}
        </p>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
          <Link to="/feedback">
            <button className="btn-primary">
              {t('giveFeedback')}
            </button>
          </Link>

          {user ? (
            <Link to="/dashboard">
              <button className="btn-secondary">
                {t('dashboard')}
              </button>
            </Link>
          ) : (
            <Link to="/signin">
              <button className="btn-secondary">
                {t('signIn')}
              </button>
            </Link>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Landing;
