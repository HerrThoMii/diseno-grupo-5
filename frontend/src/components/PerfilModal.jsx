import React, { useState, useEffect } from 'react';
import { X, User, Mail, Clock, Briefcase, Building2, Lock, ChevronDown } from 'lucide-react';
import './PerfilModal.css';
import { getPerfil, actualizarPerfil, getUser, getOpcionesPerfil } from '../services/api';

const PerfilModal = ({ isOpen, onClose, userData, onUpdateUserData = () => {} }) => {
  const [formData, setFormData] = useState(null);
  const [opciones, setOpciones] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showTipoPersonalDropdown, setShowTipoPersonalDropdown] = useState(false);
  const [showGradoDropdown, setShowGradoDropdown] = useState(false);
  const [showCategoriaDropdown, setShowCategoriaDropdown] = useState(false);
  const [showDedicacionDropdown, setShowDedicacionDropdown] = useState(false);
  const [showIncentivosDropdown, setShowIncentivosDropdown] = useState(false);
  const [showCursoDropdown, setShowCursoDropdown] = useState(false);
  const [showRolDropdown, setShowRolDropdown] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (isOpen && userData) {
      loadPerfil();
      loadOpciones();
    }
  }, [isOpen, userData]);

  const loadOpciones = async () => {
    try {
      const data = await getOpcionesPerfil();
      setOpciones(data);
    } catch (err) {
      console.error('Error cargando opciones:', err);
    }
  };

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

  if (!formData || !opciones) return null;

  const user = formData;

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleMultiSelectToggle = (field, valueId) => {
    const currentValues = formData[field] || [];
    const newValues = currentValues.includes(valueId)
      ? currentValues.filter(v => v !== valueId)
      : [...currentValues, valueId];
    setFormData({ ...formData, [field]: newValues });
  };

  const handleSingleSelectChange = (field, valueId) => {
    setFormData({ ...formData, [field]: valueId });
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        handleInputChange('imagenPerfil', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const MultiSelect = ({ label, field, backendOptions, currentIds, onToggle, showDropdown, setShowDropdown, isMulti = true }) => {
    if (!backendOptions) return null;

    const displayValue = currentIds && currentIds.length > 0
      ? backendOptions.filter(opt => currentIds.includes(opt.id)).map(opt => opt.nombre).join(', ')
      : `Seleccionar ${label.toLowerCase()}...`;

    const handleSelect = (optionId) => {
      onToggle(field, optionId);
      // Cerrar dropdown para radio buttons (single-select) después de seleccionar
      if (!isMulti) {
        setShowDropdown(false);
      }
    };

    return (
      <div className="perfil-field">
        <label>{label}</label>
        <div className="multi-select-container">
          <div 
            className="multi-select-display"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <span className="multi-select-text">
              {displayValue}
            </span>
            <ChevronDown size={18} className={`multi-select-chevron ${showDropdown ? 'rotated' : ''}`} />
          </div>
          {showDropdown && (
            <div className="multi-select-dropdown">
              {backendOptions.map(option => (
                <label key={option.id} className="multi-select-option">
                  <input
                    type={isMulti ? "checkbox" : "radio"}
                    checked={currentIds ? currentIds.includes(option.id) : false}
                    onChange={() => handleSelect(option.id)}
                  />
                  <span>{option.nombre}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>
    );
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
            <div className="perfil-image-section">
              <div className="perfil-image-container">
                {imagePreview || user.imagenPerfil ? (
                  <img src={imagePreview || user.imagenPerfil} alt="Perfil" className="perfil-image" />
                ) : (
                  <div className="perfil-image-placeholder">
                    <User size={40} />
                  </div>
                )}
              </div>
              <div className="perfil-image-actions">
                <label htmlFor="image-upload" className="btn-upload-image">
                  Subir Imagen
                </label>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                />
              </div>
            </div>
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

          {/* Información Laboral */}
          <div className="perfil-section">
            <h3 className="perfil-section-title">
              <Briefcase size={20} />
              Información Laboral
            </h3>
            <div className="perfil-grid">
              {opciones && (
                <MultiSelect
                  label="Tipo de Personal"
                  field="tipoDePersonal"
                  backendOptions={opciones.tipos_personal}
                  currentIds={user.tipoDePersonal || []}
                  onToggle={handleMultiSelectToggle}
                  showDropdown={showTipoPersonalDropdown}
                  setShowDropdown={setShowTipoPersonalDropdown}
                  isMulti={true}
                />
              )}
              <div className="perfil-field">
                <label>Horas Semanales</label>
                <input
                  type="number"
                  value={user.horasSemanales || ''}
                  className="perfil-input"
                  onChange={(e) => handleInputChange('horasSemanales', e.target.value)}
                />
              </div>
              <div className="perfil-field full-width">
                <label>Grupo de Investigación</label>
                <input
                  type="text"
                  value={user.GrupoInvestigacion || ''}
                  className="perfil-input"
                  onChange={(e) => handleInputChange('GrupoInvestigacion', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Información Académica */}
          <div className="perfil-section">
            <h3 className="perfil-section-title">
              <Building2 size={20} />
              Información Académica
            </h3>
            <div className="perfil-grid">
              {opciones && (
                <>
                  <MultiSelect
                    label="Grado Académico"
                    field="gradoAcademico"
                    backendOptions={opciones.grados_academicos}
                    currentIds={user.gradoAcademico || []}
                    onToggle={handleMultiSelectToggle}
                    showDropdown={showGradoDropdown}
                    setShowDropdown={setShowGradoDropdown}
                    isMulti={true}
                  />
                  <MultiSelect
                    label="Categoría UTN"
                    field="categoriaUtn"
                    backendOptions={opciones.categorias_utn}
                    currentIds={user.categoriaUtn || []}
                    onToggle={handleMultiSelectToggle}
                    showDropdown={showCategoriaDropdown}
                    setShowDropdown={setShowCategoriaDropdown}
                    isMulti={true}
                  />
                  <MultiSelect
                    label="Dedicación"
                    field="dedicacion"
                    backendOptions={opciones.dedicaciones}
                    currentIds={user.dedicacion ? [user.dedicacion] : []}
                    onToggle={handleSingleSelectChange}
                    showDropdown={showDedicacionDropdown}
                    setShowDropdown={setShowDedicacionDropdown}
                    isMulti={false}
                  />
                  <MultiSelect
                    label="Programa de Incentivos"
                    field="programaDeIncentivos"
                    backendOptions={opciones.programas_incentivos}
                    currentIds={user.programaDeIncentivos ? [user.programaDeIncentivos] : []}
                    onToggle={handleSingleSelectChange}
                    showDropdown={showIncentivosDropdown}
                    setShowDropdown={setShowIncentivosDropdown}
                    isMulti={false}
                  />
                </>
              )}
            </div>
          </div>

          {/* Actividad Docente */}
          <div className="perfil-section">
            <h3 className="perfil-section-title">
              <Building2 size={20} />
              Actividad Docente
            </h3>
            <div className="perfil-grid">
              {opciones && (
                <>
                  <MultiSelect
                    label="Curso/Cátedra"
                    field="denominacionCursoCatedra"
                    backendOptions={opciones.cursos_catedras}
                    currentIds={user.denominacionCursoCatedra || []}
                    onToggle={handleMultiSelectToggle}
                    showDropdown={showCursoDropdown}
                    setShowDropdown={setShowCursoDropdown}
                    isMulti={true}
                  />
                  <MultiSelect
                    label="Rol Desempeñado"
                    field="rolDesempenado"
                    backendOptions={opciones.roles_desempenados}
                    currentIds={user.rolDesempenado || []}
                    onToggle={handleMultiSelectToggle}
                    showDropdown={showRolDropdown}
                    setShowDropdown={setShowRolDropdown}
                    isMulti={true}
                  />
                  <div className="perfil-field">
                    <label>Período Inicio</label>
                    <input
                      type="date"
                      value={user.fechaPeriodoDictadoInicio || ''}
                      className="perfil-input"
                      onChange={(e) => handleInputChange('fechaPeriodoDictadoInicio', e.target.value)}
                    />
                  </div>
                  <div className="perfil-field">
                    <label>Período Fin</label>
                    <input
                      type="date"
                      value={user.fechaPeriodoDictadoFin || ''}
                      className="perfil-input"
                      onChange={(e) => handleInputChange('fechaPeriodoDictadoFin', e.target.value)}
                    />
                  </div>
                </>
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
