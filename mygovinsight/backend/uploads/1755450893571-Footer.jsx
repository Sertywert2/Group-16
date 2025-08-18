// frontend/src/components/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="mt-6 bg-[var(--card-bg)] text-[var(--text)] p-6 text-center transition-colors duration-300">
      <p>
        &copy; {new Date().getFullYear()} MyApp. All rights reserved.
      </p>
      <div className="mt-2">
        <Link to="/about">{/* Using var(--link) color from CSS */}About</Link>
        <Link to="/contact" className="ml-4">
          Contact
        </Link>
        <Link to="/privacy" className="ml-4">
          Privacy
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
