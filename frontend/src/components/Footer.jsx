import React, { useState } from 'react';
import ContactoModal from './ContactoModal';
import './Footer.css';

function Footer() {
  const [showContactoModal, setShowContactoModal] = useState(false);

  return (
    <>
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-left">
            <p className="footer-copyright">© 2025 Universidad Tecnológica Nacional</p>
          </div>
          <div className="footer-right">
            <button 
              className="footer-link-btn" 
              onClick={() => setShowContactoModal(true)}
            >
              Contacto
            </button>
            <span className="footer-separator">|</span>
            <a href="#" className="footer-link">Políticas de Privacidad</a>
            <span className="footer-separator">|</span>
            <a href="#" className="footer-link">Términos y Condiciones</a>
          </div>
        </div>
      </footer>
      
      <ContactoModal 
        isOpen={showContactoModal} 
        onClose={() => setShowContactoModal(false)} 
      />
    </>
  );
}

export default Footer;
