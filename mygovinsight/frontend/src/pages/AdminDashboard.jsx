import { useTranslation } from 'react-i18next';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';

const AdminDashboard = ({ darkMode, setDarkMode }) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col min-h-screen bg-[var(--bg)]">
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />
      <main className="flex-grow p-8">
        <h1 className="text-3xl font-bold mb-4">{t('adminDashboard')}</h1>
        <p className="text-[var(--text)] mb-4">{t('adminWelcome')}</p>
        <Link to="/admin/services" className="text-[var(--primary)] hover:underline">{t('manageServices')}</Link>
      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboard;