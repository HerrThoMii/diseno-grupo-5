import React, { useState, useEffect } from 'react';
import { X, User, Lock } from 'lucide-react';
import './PerfilModal.css';
import { getPerfil, actualizarPerfil, getUser } from '../services/api';

const PerfilModal = ({ isOpen, onClose, userData, onUpdateUserData = () => {} }) => {
  const [formData, setFormData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (isOpen && userData) {
      loadPerfil();
    }
  }, [isOpen, userData]);

  const loadPerfil = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const user = getUser();
      if (user && user.oidpersona) {
        const perfilData = await getPerfil(user.oidpersona);
        setFormData(perfilData);
      } else {
        // Si no hay oidpersona, usar los datos básicos del localStorage
        setFormData(userData);
      }
    } catch (err) {
      console.error('Error cargando perfil:', err);
      setError('Error al cargar el perfil');
      // Usar datos del userData como fallback
      setFormData(userData);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;
  
  if (isLoading) {
    return (
      <div className="perfil-modal-overlay" onClick={onClose}>
        <div className="perfil-modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="perfil-loading">Cargando perfil...</div>
        </div>
      </div>
    );
  }

  if (!formData) return null;

  const user = formData;

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSave = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const user = getUser();
      if (user && user.oidpersona) {
        const response = await actualizarPerfil(user.oidpersona, formData);
        // Actualizar los datos del usuario en toda la aplicación
        onUpdateUserData(formData);
        alert('Perfil actualizado correctamente');
        onClose();
      } else {
        throw new Error('No se encontró el ID del usuario');
      }
    } catch (err) {
      console.error('Error guardando perfil:', err);
      setError(err.message || 'Error al guardar el perfil');
      alert('Error al guardar el perfil: ' + (err.message || 'Error desconocido'));
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }
    // TODO: Implementar cambio de contraseña en el backend
    console.log('Cambiando contraseña');
    alert('Funcionalidad de cambio de contraseña en desarrollo');
    setShowChangePassword(false);
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  return (
    <div className="perfil-modal-overlay" onClick={onClose}>
      <div className="perfil-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="perfil-modal-header">
          <h2>Perfil de Usuario</h2>
          <button className="perfil-close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="perfil-modal-body">
          {/* Información Personal */}
          <div className="perfil-section">
            <h3 className="perfil-section-title">
              <User size={20} />
              Información Personal
            </h3>
            <div className="perfil-grid">
              <div className="perfil-field">
                <label>Nombre</label>
                <input
                  type="text"
                  value={user.nombre || ''}
                  className="perfil-input"
                  onChange={(e) => handleInputChange('nombre', e.target.value)}
                />
              </div>
              <div className="perfil-field">
                <label>Apellido</label>
                <input
                  type="text"
                  value={user.apellido || ''}
                  className="perfil-input"
                  onChange={(e) => handleInputChange('apellido', e.target.value)}
                />
              </div>
              <div className="perfil-field full-width">
                <label>Correo Electrónico</label>
                <input
                  type="email"
                  value={user.correo || ''}
                  className="perfil-input perfil-email-input"
                  disabled
                />
              </div>
              <div className="perfil-field full-width">
                <button 
                  className="btn-change-password"
                  onClick={() => setShowChangePassword(!showChangePassword)}
                >
                  <Lock size={16} />
                  Cambiar Contraseña
                </button>
              </div>
              {showChangePassword && (
                <div className="perfil-field full-width password-section">
                  <div className="password-grid">
                    <div className="password-field">
                      <label>Contraseña Actual</label>
                      <input
                        type="password"
                        value={passwordData.currentPassword}
                        className="perfil-input"
                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      />
                    </div>
                    <div className="password-field">
                      <label>Nueva Contraseña</label>
                      <input
                        type="password"
                        value={passwordData.newPassword}
                        className="perfil-input"
                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      />
                    </div>
                    <div className="password-field">
                      <label>Confirmar Contraseña</label>
                      <input
                        type="password"
                        value={passwordData.confirmPassword}
                        className="perfil-input"
                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      />
                    </div>
                    <div className="password-actions">
                      <button className="btn-password-cancel" onClick={() => setShowChangePassword(false)}>
                        Cancelar
                      </button>
                      <button className="btn-password-save" onClick={handlePasswordChange}>
                        Guardar Contraseña
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="perfil-modal-footer">
          <button className="btn-perfil-cancel" onClick={onClose}>
            Cancelar
          </button>
          <button className="btn-perfil-save" onClick={handleSave} disabled={isLoading}>
            {isLoading ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PerfilModal;
