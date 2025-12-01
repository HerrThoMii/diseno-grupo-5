import React, { useState } from 'react';
import { X, User, Mail, Clock, Briefcase, Building2, Lock, ChevronDown } from 'lucide-react';
import './PerfilModal.css';

const PerfilModal = ({ isOpen, onClose, userData }) => {
  if (!isOpen) return null;

  // Datos de ejemplo basados en el modelo Persona del backend
  const defaultUserData = {
    nombreCompleto: 'Juan Pérez',
    correo: 'juan.perez@utn.edu.ar',
    imagenPerfil: null,
    horasSemanales: 40,
    tipoDePersonal: ['Investigador'], // Array para múltiples selecciones
    grupoInvestigacion: ['Grupo de Investigación en IA'],
    // Datos adicionales si es InvestigadorDocente
    gradoAcademico: ['Doctor en Ciencias de la Computación'],
    categoriaUtn: ['Categoría I'],
    dedicacion: 'Exclusiva',
    programaDeInsentivos: 'Sí',
    // Si tiene actividad docente
    denominacionCursoCatedra: ['Inteligencia Artificial'],
    fechaPeriodoDictadoInicio: '2024-03-01',
    fechaPeriodoDictadoFin: '2024-07-31',
    rolDesenpeniado: ['Profesor Titular']
  };

  const [formData, setFormData] = useState(userData || defaultUserData);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showTipoPersonalDropdown, setShowTipoPersonalDropdown] = useState(false);
  const [showGrupoDropdown, setShowGrupoDropdown] = useState(false);
  const [showGradoDropdown, setShowGradoDropdown] = useState(false);
  const [showCategoriaDropdown, setShowCategoriaDropdown] = useState(false);
  const [showDedicacionDropdown, setShowDedicacionDropdown] = useState(false);
  const [showCursoDropdown, setShowCursoDropdown] = useState(false);
  const [showRolDropdown, setShowRolDropdown] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [imagePreview, setImagePreview] = useState(null);

  const user = formData;

  const tipoPersonalOptions = [
    'Investigador',
    'Investigador Docente',
    'Becario',
    'Personal de Apoyo',
    'Técnico',
    'Administrativo'
  ];

  const grupoInvestigacionOptions = [
    'Grupo de Investigación en IA',
    'Grupo de Sistemas Distribuidos',
    'Grupo de Bases de Datos',
    'Grupo de Ingeniería de Software',
    'Grupo de Redes y Comunicaciones'
  ];

  const gradoAcademicoOptions = [
    'Licenciado',
    'Ingeniero',
    'Magister',
    'Doctor',
    'Posdoctorado'
  ];

  const categoriaUtnOptions = [
    'Categoría I',
    'Categoría II',
    'Categoría III',
    'Categoría IV',
    'Categoría V'
  ];

  const dedicacionOptions = [
    'Exclusiva',
    'Semi-exclusiva',
    'Simple'
  ];

  const cursoOptions = [
    'Inteligencia Artificial',
    'Bases de Datos',
    'Programación',
    'Sistemas Operativos',
    'Redes de Computadoras',
    'Arquitectura de Computadoras'
  ];

  const rolDocenteOptions = [
    'Profesor Titular',
    'Profesor Adjunto',
    'Jefe de Trabajos Prácticos',
    'Ayudante de Primera',
    'Ayudante de Segunda'
  ];

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleMultiSelectToggle = (field, value) => {
    const currentValues = formData[field] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    setFormData({ ...formData, [field]: newValues });
  };

  const handleTipoPersonalToggle = (tipo) => {
    handleMultiSelectToggle('tipoDePersonal', tipo);
  };

  const handleSave = () => {
    // Aquí se enviarían los datos al backend
    console.log('Guardando datos:', formData);
    onClose();
  };

  const handlePasswordChange = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }
    // Aquí se enviaría el cambio de contraseña al backend
    console.log('Cambiando contraseña');
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

  const MultiSelect = ({ label, field, options, showDropdown, setShowDropdown }) => (
    <div className="perfil-field">
      <label>{label}</label>
      <div className="multi-select-container">
        <div 
          className="multi-select-display"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          <span className="multi-select-text">
            {(user[field] && user[field].length > 0) 
              ? user[field].join(', ') 
              : `Seleccionar ${label.toLowerCase()}...`}
          </span>
          <ChevronDown size={18} className={`multi-select-chevron ${showDropdown ? 'rotated' : ''}`} />
        </div>
        {showDropdown && (
          <div className="multi-select-dropdown">
            {options.map(option => (
              <label key={option} className="multi-select-option">
                <input
                  type="checkbox"
                  checked={(user[field] || []).includes(option)}
                  onChange={() => handleMultiSelectToggle(field, option)}
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );

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
                <label>Nombre Completo</label>
                <input
                  type="text"
                  value={user.nombreCompleto}
                  className="perfil-input"
                  onChange={(e) => handleInputChange('nombreCompleto', e.target.value)}
                />
              </div>
              <div className="perfil-field full-width">
                <label>Correo Electrónico</label>
                <input
                  type="email"
                  value={user.correo}
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
              <MultiSelect 
                label="Tipo de Personal"
                field="tipoDePersonal"
                options={tipoPersonalOptions}
                showDropdown={showTipoPersonalDropdown}
                setShowDropdown={setShowTipoPersonalDropdown}
              />
              <div className="perfil-field">
                <label>Horas Semanales</label>
                <input
                  type="number"
                  value={user.horasSemanales}
                  className="perfil-input"
                  onChange={(e) => handleInputChange('horasSemanales', e.target.value)}
                />
              </div>
              <MultiSelect 
                label="Grupo de Investigación"
                field="grupoInvestigacion"
                options={grupoInvestigacionOptions}
                showDropdown={showGrupoDropdown}
                setShowDropdown={setShowGrupoDropdown}
              />
            </div>
          </div>

          {/* Información Académica (si aplica) */}
          {user.gradoAcademico && (
            <div className="perfil-section">
              <h3 className="perfil-section-title">Información Académica</h3>
              <div className="perfil-grid">
                <MultiSelect 
                  label="Grado Académico"
                  field="gradoAcademico"
                  options={gradoAcademicoOptions}
                  showDropdown={showGradoDropdown}
                  setShowDropdown={setShowGradoDropdown}
                />
                <MultiSelect 
                  label="Categoría UTN"
                  field="categoriaUtn"
                  options={categoriaUtnOptions}
                  showDropdown={showCategoriaDropdown}
                  setShowDropdown={setShowCategoriaDropdown}
                />
                <div className="perfil-field">
                  <label>Dedicación</label>
                  <select
                    value={user.dedicacion}
                    className="perfil-input"
                    onChange={(e) => handleInputChange('dedicacion', e.target.value)}
                  >
                    <option value="Exclusiva">Exclusiva</option>
                    <option value="Semi-exclusiva">Semi-exclusiva</option>
                    <option value="Simple">Simple</option>
                  </select>
                </div>
                <div className="perfil-field">
                  <label>Programa de Incentivos</label>
                  <select
                    value={user.programaDeInsentivos}
                    className="perfil-input"
                    onChange={(e) => handleInputChange('programaDeInsentivos', e.target.value)}
                  >
                    <option value="Sí">Sí</option>
                    <option value="No">No</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Actividad Docente (si aplica) */}
          {user.denominacionCursoCatedra && (
            <div className="perfil-section">
              <h3 className="perfil-section-title">Actividad Docente</h3>
              <div className="perfil-grid">
                <MultiSelect 
                  label="Curso/Cátedra"
                  field="denominacionCursoCatedra"
                  options={cursoOptions}
                  showDropdown={showCursoDropdown}
                  setShowDropdown={setShowCursoDropdown}
                />
                <MultiSelect 
                  label="Rol Desempeñado"
                  field="rolDesenpeniado"
                  options={rolDocenteOptions}
                  showDropdown={showRolDropdown}
                  setShowDropdown={setShowRolDropdown}
                />
                <div className="perfil-field">
                  <label>Período Inicio</label>
                  <input
                    type="date"
                    value={user.fechaPeriodoDictadoInicio}
                    className="perfil-input"
                    onChange={(e) => handleInputChange('fechaPeriodoDictadoInicio', e.target.value)}
                  />
                </div>
                <div className="perfil-field">
                  <label>Período Fin</label>
                  <input
                    type="date"
                    value={user.fechaPeriodoDictadoFin}
                    className="perfil-input"
                    onChange={(e) => handleInputChange('fechaPeriodoDictadoFin', e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="perfil-modal-footer">
          <button className="btn-perfil-cancel" onClick={onClose}>
            Cancelar
          </button>
          <button className="btn-perfil-save" onClick={handleSave}>
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
};

export default PerfilModal;
