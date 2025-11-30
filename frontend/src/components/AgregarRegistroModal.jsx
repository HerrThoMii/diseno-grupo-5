import React, { useState } from 'react';
import { X } from 'lucide-react';
import './AgregarRegistroModal.css';

export default function AgregarRegistroModal({ isOpen, onClose, onAdd }) {
  const [formData, setFormData] = useState({
    nombre: '',
    tipo: 'Patente Nacional',
    fecha: '',
    descripcion: ''
  });

  const [errors, setErrors] = useState({});

  const tiposRegistro = ['Patente Nacional', 'Patente Internacional', 'Registro Marcario'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }

    if (!formData.fecha) {
      newErrors.fecha = 'La fecha es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    onAdd({
      id: Date.now(),
      ...formData
    });

    setFormData({
      nombre: '',
      tipo: 'Patente Nacional',
      fecha: '',
      descripcion: ''
    });
  };

  if (!isOpen) return null;

  return (
    <div className="arm-overlay">
      <div className="arm-modal">
        <div className="arm-header">
          <h2>Agregar Registro de Propiedad</h2>
          <button className="arm-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="arm-form">
          <div className="arm-form-group">
            <label htmlFor="nombre">Nombre del Registro</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Ej: Patente de Invención 2024"
              className={errors.nombre ? 'error' : ''}
            />
            {errors.nombre && <span className="arm-error">{errors.nombre}</span>}
          </div>

          <div className="arm-form-group">
            <label htmlFor="tipo">Tipo de Registro</label>
            <select
              id="tipo"
              name="tipo"
              value={formData.tipo}
              onChange={handleChange}
            >
              {tiposRegistro.map(tipo => (
                <option key={tipo} value={tipo}>{tipo}</option>
              ))}
            </select>
          </div>

          <div className="arm-form-group">
            <label htmlFor="fecha">Fecha de Registro</label>
            <input
              type="date"
              id="fecha"
              name="fecha"
              value={formData.fecha}
              onChange={handleChange}
              className={errors.fecha ? 'error' : ''}
            />
            {errors.fecha && <span className="arm-error">{errors.fecha}</span>}
          </div>

          <div className="arm-form-group">
            <label htmlFor="descripcion">Descripción (Opcional)</label>
            <textarea
              id="descripcion"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              placeholder="Detalles adicionales sobre el registro"
              rows="4"
            />
          </div>

          <div className="arm-buttons">
            <button type="button" className="arm-btn-cancel" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="arm-btn-submit">
              Agregar Registro
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
