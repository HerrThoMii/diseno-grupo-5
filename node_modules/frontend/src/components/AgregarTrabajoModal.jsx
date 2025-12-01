import React, { useState } from 'react';
import './AgregarTrabajoModal.css';
import { X } from 'lucide-react';

const AgregarTrabajoModal = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    ciudad: '',
    fechaInicio: '',
    nombreReunion: '',
    titulo: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar error del campo cuando el usuario escribe
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.ciudad.trim()) {
      newErrors.ciudad = 'La ciudad es requerida';
    }
    
    if (!formData.fechaInicio) {
      newErrors.fechaInicio = 'La fecha de inicio es requerida';
    }
    
    if (!formData.nombreReunion.trim()) {
      newErrors.nombreReunion = 'El nombre de la reunión es requerido';
    }
    
    if (!formData.titulo.trim()) {
      newErrors.titulo = 'El título del trabajo es requerido';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validate()) {
      const nuevoTrabajo = {
        id: Date.now(),
        ...formData
      };
      
      onAdd(nuevoTrabajo);
      
      // Resetear formulario
      setFormData({
        ciudad: '',
        fechaInicio: '',
        nombreReunion: '',
        titulo: ''
      });
      setErrors({});
    }
  };

  const handleClose = () => {
    setFormData({
      ciudad: '',
      fechaInicio: '',
      nombreReunion: '',
      titulo: ''
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Agregar Trabajo</h2>
          <button className="modal-close" onClick={handleClose}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="ciudad">Ciudad *</label>
              <input
                type="text"
                id="ciudad"
                name="ciudad"
                value={formData.ciudad}
                onChange={handleChange}
                className={errors.ciudad ? 'error' : ''}
                placeholder="Ingrese la ciudad"
              />
              {errors.ciudad && <span className="error-message">{errors.ciudad}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="fechaInicio">Fecha de Inicio *</label>
              <input
                type="date"
                id="fechaInicio"
                name="fechaInicio"
                value={formData.fechaInicio}
                onChange={handleChange}
                className={errors.fechaInicio ? 'error' : ''}
              />
              {errors.fechaInicio && <span className="error-message">{errors.fechaInicio}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="nombreReunion">Nombre de la Reunión *</label>
              <input
                type="text"
                id="nombreReunion"
                name="nombreReunion"
                value={formData.nombreReunion}
                onChange={handleChange}
                className={errors.nombreReunion ? 'error' : ''}
                placeholder="Ingrese el nombre de la reunión"
              />
              {errors.nombreReunion && <span className="error-message">{errors.nombreReunion}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="titulo">Título del Trabajo *</label>
              <input
                type="text"
                id="titulo"
                name="titulo"
                value={formData.titulo}
                onChange={handleChange}
                className={errors.titulo ? 'error' : ''}
                placeholder="Ingrese el título del trabajo"
              />
              {errors.titulo && <span className="error-message">{errors.titulo}</span>}
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={handleClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-submit">
              Agregar Trabajo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AgregarTrabajoModal;
