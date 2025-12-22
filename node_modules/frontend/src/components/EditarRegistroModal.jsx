import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import './AgregarRegistroModal.css';
import { actualizarRegistro, listarPatentes, listarTipoRegistros } from '../services/api';

export default function EditarRegistroModal({ isOpen, onClose, onUpdate, registro }) {
  const [formData, setFormData] = useState({
    descripcion: '',
    TipoDeRegistro: '',
    Patente: ''
  });

  const [patentes, setPatentes] = useState([]);
  const [tipoRegistros, setTipoRegistros] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    let mounted = true;
    if (!isOpen) return () => { mounted = false };

    setLoadingData(true);
    Promise.all([listarPatentes(), listarTipoRegistros()])
      .then(([pat, tipos]) => {
        if (!mounted) return;
        setPatentes(Array.isArray(pat) ? pat : []);
        setTipoRegistros(Array.isArray(tipos) ? tipos : []);
      })
      .catch((err) => {
        if (!mounted) return;
        console.error('Error cargando datos:', err);
        setPatentes([]);
        setTipoRegistros([]);
      })
      .finally(() => {
        if (mounted) setLoadingData(false);
      });
    return () => { mounted = false };
  }, [isOpen]);

  // Cargar datos del registro cuando se abre el modal
  useEffect(() => {
    if (registro && isOpen) {
      setFormData({
        descripcion: registro.descripcion || registro.nombre || '',
        TipoDeRegistro: registro.TipoDeRegistro || '',
        Patente: registro.Patente || ''
      });
    }
  }, [registro, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.descripcion.trim()) newErrors.descripcion = 'La descripción es requerida';
    if (!formData.Patente) newErrors.Patente = 'Seleccione una patente';
    if (!formData.TipoDeRegistro) newErrors.TipoDeRegistro = 'Seleccione un tipo de registro';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setSubmitError('');

    const payload = {
      descripcion: formData.descripcion,
      TipoDeRegistro: parseInt(formData.TipoDeRegistro, 10),
      Patente: parseInt(formData.Patente, 10)
    };

    const registroId = registro.id || registro.oidRegistro;

    actualizarRegistro(registroId, payload)
      .then(updated => {
        if (onUpdate) onUpdate(updated);
        onClose && onClose();
      })
      .catch(err => {
        let msg = err.message || 'Error al actualizar registro';
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
    <div className="arm-overlay">
      <div className="arm-modal">
        <div className="arm-header">
          <h2>Editar Registro de Propiedad</h2>
          <button className="arm-close" onClick={onClose}><X size={24} /></button>
        </div>

        {loadingData && (
          <div style={{ padding: '10px', textAlign: 'center', color: '#666' }}>
            Cargando datos...
          </div>
        )}

        <form className="arm-form" onSubmit={handleSubmit}>
          <div className="arm-form-group">
            <label htmlFor="TipoDeRegistro">Tipo de Registro</label>
            <select
              id="TipoDeRegistro"
              name="TipoDeRegistro"
              value={formData.TipoDeRegistro || ''}
              onChange={handleChange}
              className={errors.TipoDeRegistro ? 'error' : ''}
            >
              <option value="">-- Seleccione --</option>
              {tipoRegistros.map(t => {
                const pk = t.oidTipoDeRegistro ?? t.id;
                return <option key={pk} value={pk}>{t.nombre ?? t.tipo ?? `#${pk}`}</option>;
              })}
            </select>
            {errors.TipoDeRegistro && <span className="arm-error">{errors.TipoDeRegistro}</span>}
          </div>

          <div className="arm-form-group">
            <label htmlFor="Patente">Patente asociada</label>
            <select
              id="Patente"
              name="Patente"
              value={formData.Patente || ''}
              onChange={handleChange}
              className={errors.Patente ? 'error' : ''}
            >
              <option value="">-- Seleccione --</option>
              {patentes.map(p => {
                const pk = p.oidPatente ?? p.id;
                return <option key={pk} value={pk}>{p.numero ?? p.descripcion ?? `#${pk}`}</option>;
              })}
            </select>
            {errors.Patente && <span className="arm-error">{errors.Patente}</span>}
          </div>

          <div className="arm-form-group">
            <label htmlFor="descripcion">Descripción</label>
            <textarea
              id="descripcion"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              placeholder="Detalles adicionales sobre el registro"
              className={errors.descripcion ? 'error' : ''}
              rows="4"
            />
            {errors.descripcion && <span className="arm-error">{errors.descripcion}</span>}
          </div>

          {submitError && <div className="arm-submit-error">{submitError}</div>}

          <div className="arm-buttons">
            <button type="button" className="arm-btn-cancel" onClick={onClose} disabled={loading}>
              Cancelar
            </button>
            <button type="submit" className="arm-btn-submit" disabled={loading}>
              {loading ? 'Actualizando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
