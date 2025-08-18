import { useTranslation } from 'react-i18next';

const Contact = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center p-2">
      <div className="card w-full max-w-md p-2">
        <h1 className="text-xl font-bold mb-1">{t('contact')}</h1>
        <p className="text-[var(--text)]">{t('contactUsMessage')}</p>
      </div>
    </div>
  );
};

export default Contact;