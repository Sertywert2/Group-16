import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import { AuthProvider } from './context/AuthContext';
import Dashboard from './pages/Dashboard';
import FeedbackForm from './pages/FeedbackForm';
import FeedbackConfirmation from './pages/FeedbackConfirmation';
import OTPActivation from './pages/OTPActivation';
import SignIn from './pages/SignIn';
import CreateAccount from './pages/CreateAccount';
import Landing from './pages/Landing';
import './styles/global.css';

const App = () => {
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? savedTheme === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  return (
    <I18nextProvider i18n={i18n}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Landing darkMode={darkMode} setDarkMode={setDarkMode} />} />
            <Route path="/dashboard" element={<Dashboard darkMode={darkMode} setDarkMode={setDarkMode} />} />
            <Route path="/feedback" element={<FeedbackForm darkMode={darkMode} setDarkMode={setDarkMode} />} />
            <Route path="/confirmation" element={<FeedbackConfirmation darkMode={darkMode} setDarkMode={setDarkMode} />} />
            <Route path="/activate" element={<OTPActivation darkMode={darkMode} setDarkMode={setDarkMode} />} />
            <Route path="/signin" element={<SignIn darkMode={darkMode} setDarkMode={setDarkMode} />} />
            <Route path="/create-account" element={<CreateAccount darkMode={darkMode} setDarkMode={setDarkMode} />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </I18nextProvider>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<App />);

export default App;