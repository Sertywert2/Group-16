import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/useAuth';

const Header = ({ darkMode, setDarkMode }) => {
  const { user, logout } = useAuth();
  const { t, i18n } = useTranslation();

  // Toggle language between English and Amharic
  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'am' : 'en';
    i18n.changeLanguage(newLang);
    localStorage.setItem('language', newLang);
  };

  return (
    <header className="bg-[var(--card-bg)] shadow-md p-4 flex justify-between items-center sticky top-0 z-10 transition-colors duration-300">
      <Link
        to="/"
        className="text-2xl font-bold hover:text-[var(--primary-hover)] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
        aria-label={t('home')}
      >
        {t('myGovInsightsPro')}
      </Link>

      <nav className="flex space-x-4 items-center">
        {!user && (
          <>
            <Link
              to="/signin"
              className="text-[var(--text)] hover:text-[var(--primary)] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              aria-label={t('signIn')}
            >
              {t('signIn')}
            </Link>
            <Link
              to="/create-account"
              className="text-[var(--text)] hover:text-[var(--primary)] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              aria-label={t('createAccount')}
            >
              {t('createAccount')}
            </Link>
          </>
        )}

        {user && (
          <>
            <button
              onClick={logout}
              className="text-[var(--text)] hover:text-[var(--primary)] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              aria-label={t('logout')}
            >
              {t('logout')}
            </button>
            {user.isAdmin && (
              <Link
                to="/dashboard"
                className="text-[var(--text)] hover:text-[var(--primary)] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                aria-label={t('adminDashboard')}
              >
                {t('adminDashboard')}
              </Link>
            )}
          </>
        )}

        <div className="relative inline-flex items-center">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="relative w-12 h-6 bg-[var(--card-bg)] rounded-full p-1 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            aria-label={darkMode ? t('lightMode') : t('darkMode')}
            title={darkMode ? t('lightMode') : t('darkMode')}
          >
            <span
              className={`absolute w-4 h-4 bg-[var(--text)] rounded-full transition-transform duration-300 transform ${
                darkMode ? 'translate-x-6' : 'translate-x-0'
              } flex items-center justify-center`}
            >
              <span className="text-xs">{darkMode ? '🌙' : '☀️'}</span>
            </span>
          </button>
        </div>

        <button
          onClick={toggleLanguage}
          className="ml-2 px-3 py-1 rounded border border-[var(--text)] text-[var(--text)] hover:bg-[var(--card-bg)] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          aria-label={t('toggleLanguage')}
          title={t('toggleLanguage')}
        >
          {i18n.language === 'en' ? 'AM' : 'EN'}
        </button>
      </nav>
    </header>
  );
};

export default Header;