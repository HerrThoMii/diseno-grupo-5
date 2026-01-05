import React, { useState } from 'react';
import { X, Mail, AlertCircle, CheckCircle } from 'lucide-react';
import './RecuperarPasswordModal.css';

const RecuperarPasswordModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validar email
    if (!email) {
      setError('El email es requerido');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('El email no es válido');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/auth/recuperar-password/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ correo: email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al enviar el email');
      }

      console.log('Email de recuperación enviado:', data);
      setEmailSent(true);
    } catch (err) {
      console.error('Error:', err);
      setError('Error al enviar el email. Intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setEmail('');
    setError('');
    setEmailSent(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="rp-modal-overlay" onClick={handleClose}>
      <div className="rp-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="rp-modal-close" onClick={handleClose}>
          <X size={24} />
        </button>

        {!emailSent ? (
          <>
            <div className="rp-modal-header">
              <Mail size={48} className="rp-icon-mail" />
              <h2>Recuperar Contraseña</h2>
              <p>Ingresa tu email y te enviaremos un enlace para restablecer tu contraseña</p>
            </div>

            <form onSubmit={handleSubmit} className="rp-form">
              <div className="rp-form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={error ? 'error' : ''}
                  placeholder="tu@email.com"
                  disabled={isLoading}
                />
                {error && (
                  <span className="rp-error">
                    <AlertCircle size={16} />
                    {error}
                  </span>
                )}
              </div>

              <div className="rp-modal-actions">
                <button
                  type="button"
                  className="rp-btn-cancel"
                  onClick={handleClose}
                  disabled={isLoading}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rp-btn-submit"
                  disabled={isLoading}
                >
                  {isLoading ? 'Enviando...' : 'Enviar enlace'}
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="rp-success">
            <CheckCircle size={64} className="rp-icon-success" />
            <h2>¡Email enviado!</h2>
            <p>
              Hemos enviado un enlace de recuperación a <strong>{email}</strong>.
              Por favor revisa tu bandeja de entrada y sigue las instrucciones.
            </p>
            <button className="rp-btn-done" onClick={handleClose}>
              Entendido
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecuperarPasswordModal;
