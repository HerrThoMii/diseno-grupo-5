import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import './AgregarTrabajoRealizado.css';
import { actualizarTrabajoPublicado, listarGrupos, listarAutores, listarTiposTrabajoPublicado, isAuthenticated } from '../services/api';

export default function EditarTrabajoModal({ isOpen, onClose, onUpdate, trabajo }) {
  const [formData, setFormData] = useState({
    titulo: '',
    ISSN: '',
    editorial: '',
    nombreRevista: '',
    pais: '',
    tipoTrabajoPublicado: '',
    Autor: '',
    GrupoInvestigacion: ''
  });
  const [grupos, setGrupos] = useState([]);
  const [autores, setAutores] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    let mounted = true;
    if (!isAuthenticated()) {
      setGrupos([]);
      setAutores([]);
      setTipos([]);
      return () => { mounted = false };
    }

    if (!isOpen) return () => { mounted = false };

    console.log('Cargando datos del modal de edición...');
    setLoadingData(true);
    Promise.all([listarGrupos(), listarAutores(), listarTiposTrabajoPublicado()])
      .then(([gr, au, tp]) => {
        if (!mounted) return;
        setGrupos(Array.isArray(gr) ? gr : []);
        setAutores(Array.isArray(au) ? au : []);
        setTipos(Array.isArray(tp) ? tp : []);
      })
      .catch((err) => { 
        if (!mounted) return; 
        console.error('Error cargando listas:', err);
        setGrupos([]); 
        setAutores([]); 
        setTipos([]); 
      })
      .finally(() => {
        if (mounted) setLoadingData(false);
      });
    return () => { mounted = false };
  }, [isOpen]);

  // Cargar datos del trabajo cuando se abre el modal
  useEffect(() => {
    if (trabajo && isOpen) {
      setFormData({
        titulo: trabajo.titulo || '',
        ISSN: trabajo.ISSN || '',
        editorial: trabajo.editorial || '',
        nombreRevista: trabajo.nombreRevista || '',
        pais: trabajo.pais || '',
        tipoTrabajoPublicado: trabajo.tipoTrabajoPublicado || '',
        Autor: trabajo.Autor || '',
        GrupoInvestigacion: trabajo.GrupoInvestigacion || ''
      });
    }
  }, [trabajo, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.Autor) newErrors.Autor = 'Seleccione un autor';
    if (!formData.titulo.trim()) newErrors.titulo = 'El título es requerido';
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
      titulo: formData.titulo,
      ISSN: formData.ISSN || '',
      editorial: formData.editorial || '',
      nombreRevista: formData.nombreRevista || '',
      pais: formData.pais || '',
      tipoTrabajoPublicado: parseInt(formData.tipoTrabajoPublicado, 10) || null,
      Autor: parseInt(formData.Autor, 10),
      GrupoInvestigacion: parseInt(formData.GrupoInvestigacion, 10)
    };

    const trabajoId = trabajo.oidTrabajoPublicado || trabajo.id;
    
    actualizarTrabajoPublicado(trabajoId, payload)
      .then(updated => {
        if (onUpdate) onUpdate(updated);
        onClose && onClose();
      })
      .catch(err => {
        let msg = err.message || 'Error al actualizar trabajo';
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
    <div className="atr-overlay">
      <div className="atr-modal">
        <div className="atr-header">
          <h2>Editar Trabajo</h2>
          <button className="atr-close" onClick={onClose}><X size={24} /></button>
        </div>

        {loadingData && (
          <div style={{ padding: '10px', textAlign: 'center', color: '#666' }}>
            Cargando datos...
          </div>
        )}

        <form className="atr-form" onSubmit={handleSubmit}>
          <div className="atr-form-group">
            <label htmlFor="Autor">Autor</label>
            <select id="Autor" name="Autor" value={formData.Autor || ''} onChange={handleChange} className={errors.Autor ? 'error' : ''}>
              <option value="">-- Seleccione autor --</option>
              {autores.map(a => {
                const pk = a.oidAutor ?? a.id;
                return <option key={pk} value={pk}>{`${a.nombre} ${a.apellido}`}</option>;
              })}
            </select>
            {errors.Autor && <div className="atr-error">{errors.Autor}</div>}
          </div>

          <div className="atr-form-group">
            <label htmlFor="titulo">Título del Trabajo</label>
            <input id="titulo" name="titulo" value={formData.titulo} onChange={handleChange} className={errors.titulo ? 'error' : ''} />
            {errors.titulo && <div className="atr-error">{errors.titulo}</div>}
          </div>

          <div className="atr-form-group">
            <label htmlFor="ISSN">ISSN</label>
            <input id="ISSN" name="ISSN" value={formData.ISSN} onChange={handleChange} />
          </div>

          <div className="atr-form-group">
            <label htmlFor="editorial">Editorial</label>
            <input id="editorial" name="editorial" value={formData.editorial} onChange={handleChange} />
          </div>

          <div className="atr-form-group">
            <label htmlFor="nombreRevista">Nombre Revista</label>
            <input id="nombreRevista" name="nombreRevista" value={formData.nombreRevista} onChange={handleChange} />
          </div>

          <div className="atr-form-group">
            <label htmlFor="pais">País</label>
            <input id="pais" name="pais" value={formData.pais} onChange={handleChange} />
          </div>

          <div className="atr-form-group">
            <label htmlFor="tipoTrabajoPublicado">Tipo de Trabajo</label>
            <select id="tipoTrabajoPublicado" name="tipoTrabajoPublicado" value={formData.tipoTrabajoPublicado || ''} onChange={handleChange}>
              <option value="">-- Seleccione tipo --</option>
              {tipos.map(t => {
                const pk = t.oidTipoTrabajoPublicado ?? t.id;
                return <option key={pk} value={pk}>{t.nombre ?? `#${pk}`}</option>;
              })}
            </select>
          </div>

          <div className="atr-form-group">
            <label htmlFor="GrupoInvestigacion">Grupo de Investigación</label>
            <select id="GrupoInvestigacion" name="GrupoInvestigacion" value={formData.GrupoInvestigacion || ''} onChange={handleChange} className={errors.GrupoInvestigacion ? 'error' : ''}>
              <option value="">-- Seleccione grupo --</option>
              {grupos.map(g => {
                const pk = g.oidGrupoInvestigacion ?? g.id;
                return <option key={pk} value={pk}>{g.nombre ?? `#${pk}`}</option>;
              })}
            </select>
            {errors.GrupoInvestigacion && <div className="atr-error">{errors.GrupoInvestigacion}</div>}
          </div>

          {submitError && <div className="atr-submit-error">{submitError}</div>}

          <div className="atr-buttons">
            <button type="button" className="atr-btn-cancel" onClick={onClose} disabled={loading}>Cancelar</button>
            <button type="submit" className="atr-btn-submit" disabled={loading}>{loading ? 'Actualizando...' : 'Guardar Cambios'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
