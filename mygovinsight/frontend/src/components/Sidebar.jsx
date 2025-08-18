import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTranslation } from 'react-i18next';

const Sidebar = () => {
  const { user } = useAuth();
  const { t } = useTranslation();

  if (!user || !user.isAdmin) return null;

  return (
    <div className="w-64 p-2 bg-[var(--card-bg)] shadow-lg h-screen fixed md:static md:block hidden md:w-64">
      <ul className="space-y-1">
        <li><Link to="/admin/dashboard" className="flex items-center p-1 rounded hover:bg-[var(--card-bg)] text-[var(--primary)] hover:text-[var(--primary)]">🏠 {t('dashboard')}</Link></li>
        <li><Link to="/admin/services" className="flex items-center p-1 rounded hover:bg-[var(--card-bg)] text-[var(--primary)] hover:text-[var(--primary)]">🛠️ {t('services')}</Link></li>
        <li><Link to="/analytics" className="flex items-center p-1 rounded hover:bg-[var(--card-bg)] text-[var(--primary)] hover:text-[var(--primary)]">📊 {t('analytics')}</Link></li>
        <li><Link to="/split-view" className="flex items-center p-1 rounded hover:bg-[var(--card-bg)] text-[var(--primary)] hover:text-[var(--primary)]">🔍 {t('splitView')}</Link></li>
      </ul>
    </div>
  );
};

export default Sidebar;