import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import './AgregarPatenteModal.css';
import { actualizarPatente, listarGrupos } from '../services/api';

export default function EditarPatenteModal({ isOpen, onClose, onUpdate, patente }) {
  const [formData, setFormData] = useState({
    numero: '',
    descripcion: '',
    tipo: '',
    fecha: '',
    inventor: '',
    GrupoInvestigacion: ''
  });

  const [grupos, setGrupos] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    let mounted = true;
    if (!isOpen) return () => { mounted = false };

    setLoadingData(true);
    listarGrupos()
      .then(data => {
        if (!mounted) return;
        setGrupos(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        if (!mounted) return;
        console.error('Error cargando grupos:', err);
        setGrupos([]);
      })
      .finally(() => {
        if (mounted) setLoadingData(false);
      });
    return () => { mounted = false };
  }, [isOpen]);

  // Cargar datos de la patente cuando se abre el modal
  useEffect(() => {
    if (patente && isOpen) {
      setFormData({
        numero: patente.numero || '',
        descripcion: patente.descripcion || '',
        tipo: patente.tipo || '',
        fecha: patente.fecha || '',
        inventor: patente.inventor || '',
        GrupoInvestigacion: patente.GrupoInvestigacion || ''
      });
    }
  }, [patente, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.numero.trim()) newErrors.numero = 'El número de patente es requerido';
    if (!formData.descripcion.trim()) newErrors.descripcion = 'La descripción es requerida';
    if (!formData.tipo) newErrors.tipo = 'Seleccione un tipo de patente';
    if (!formData.GrupoInvestigacion) newErrors.GrupoInvestigacion = 'Seleccione un grupo';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setSubmitError('');

    const payload = {
      numero: formData.numero,
      descripcion: formData.descripcion,
      tipo: formData.tipo,
      fecha: formData.fecha || null,
      inventor: formData.inventor || '',
      GrupoInvestigacion: parseInt(formData.GrupoInvestigacion, 10)
    };

    const patenteId = patente.id || patente.oidPatente;

    actualizarPatente(patenteId, payload)
      .then(updated => {
        if (onUpdate) onUpdate(updated);
        onClose && onClose();
      })
      .catch(err => {
        let msg = err.message || 'Error al actualizar patente';
        try {
          const parsed = JSON.parse(msg);
          if (parsed.detail) msg = parsed.detail;
          else if (typeof parsed === 'object') msg = Object.entries(parsed).map(([k,v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`).join(' | ');
        } catch (e) {}
        setSubmitError(msg);
      })
      .finally(() => setLoading(false));
  };

  if (!isOpen) return null;

  return (
    <div className="apm-overlay">
      <div className="apm-modal">
        <div className="apm-header">
          <h2>Editar Patente</h2>
          <button className="apm-close" onClick={onClose}><X size={24} /></button>
        </div>

        {loadingData && (
          <div style={{ padding: '10px', textAlign: 'center', color: '#666' }}>
            Cargando datos...
          </div>
        )}

        <form className="apm-form" onSubmit={handleSubmit}>
          <div className="apm-form-group">
            <label htmlFor="numero">Número de Patente</label>
            <input 
              id="numero" 
              name="numero" 
              value={formData.numero} 
              onChange={handleChange} 
              placeholder="P-2024-01"
              className={errors.numero ? 'error' : ''} 
            />
            {errors.numero && <div className="apm-error">{errors.numero}</div>}
          </div>

          <div className="apm-form-group">
            <label htmlFor="tipo">Tipo de Patente</label>
            <select 
              id="tipo" 
              name="tipo" 
              value={formData.tipo} 
              onChange={handleChange}
              className={errors.tipo ? 'error' : ''}
            >
              <option value="">-- Seleccione tipo --</option>
              <option value="Patente Activa">Patente Activa</option>
              <option value="Patente en Trámite">Patente en Trámite</option>
              <option value="Patente Vencida">Patente Vencida</option>
            </select>
            {errors.tipo && <div className="apm-error">{errors.tipo}</div>}
          </div>

          <div className="apm-form-group">
            <label htmlFor="descripcion">Descripción</label>
            <textarea 
              id="descripcion" 
              name="descripcion" 
              value={formData.descripcion} 
              onChange={handleChange}
              placeholder="Descripción detallada de la patente"
              className={errors.descripcion ? 'error' : ''}
              rows="4"
            />
            {errors.descripcion && <div className="apm-error">{errors.descripcion}</div>}
          </div>

          <div className="apm-form-group">
            <label htmlFor="fecha">Fecha</label>
            <input 
              type="date" 
              id="fecha" 
              name="fecha" 
              value={formData.fecha} 
              onChange={handleChange} 
            />
          </div>

          <div className="apm-form-group">
            <label htmlFor="inventor">Inventor</label>
            <input 
              id="inventor" 
              name="inventor" 
              value={formData.inventor} 
              onChange={handleChange}
              placeholder="Nombre del inventor"
            />
          </div>

          <div className="apm-form-group">
            <label htmlFor="GrupoInvestigacion">Grupo de Investigación</label>
            <select 
              id="GrupoInvestigacion" 
              name="GrupoInvestigacion" 
              value={formData.GrupoInvestigacion || ''} 
              onChange={handleChange}
              className={errors.GrupoInvestigacion ? 'error' : ''}
            >
              <option value="">-- Seleccione grupo --</option>
              {grupos.map(g => {
                const pk = g.oidGrupoInvestigacion ?? g.id;
                return <option key={pk} value={pk}>{g.nombre ?? `#${pk}`}</option>;
              })}
            </select>
            {errors.GrupoInvestigacion && <div className="apm-error">{errors.GrupoInvestigacion}</div>}
          </div>

          {submitError && <div className="apm-submit-error">{submitError}</div>}

          <div className="apm-buttons">
            <button type="button" className="apm-btn-cancel" onClick={onClose} disabled={loading}>
              Cancelar
            </button>
            <button type="submit" className="apm-btn-submit" disabled={loading}>
              {loading ? 'Actualizando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
