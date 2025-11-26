import React, { useState } from 'react';
import './MemoriaAnual.css';
import { ChevronDown, Plus, Trash2 } from 'lucide-react';

const MemoriaAnual = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [formData, setFormData] = useState({
    ano: '2025',
    grupo: '',
    director: '',
    vicedirector: '',
    integrantes: [],
    trabajosPresentados: [],
    programaActividades: '',
    descripcion: '',
    tipo: '',
    vinculacionSocoProductiva: '',
    trabajoPublicado: '',
    documentacionBiblioteca: '',
    ano_bib: '',
    editorial: '',
    titulo_bib: '',
    patente: '',
    descripcion_patente: '',
    tipo_patente: '',
    proyectos: [],
  });

  const tabs = [
    { id: 'general', label: 'General', icon: '📋' },
    { id: 'integrantes', label: 'Integrantes', icon: '👥' },
    { id: 'trabajos', label: 'Trabajos', icon: '📄' },
    { id: 'actividades', label: 'Actividades', icon: '📅' },
    { id: 'publicaciones', label: 'Publicaciones', icon: '📚' },
    { id: 'patentes', label: 'Patentes', icon: '🔬' },
    { id: 'proyectos', label: 'Proyectos', icon: '🎯' },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddIntegrante = () => {
    setFormData(prev => ({
      ...prev,
      integrantes: [...prev.integrantes, { nombre: '', apellido: '', rol: '', horas: '', acciones: '' }],
    }));
  };

  const handleRemoveIntegrante = (index) => {
    setFormData(prev => ({
      ...prev,
      integrantes: prev.integrantes.filter((_, i) => i !== index),
    }));
  };

  const handleIntegranteChange = (index, field, value) => {
    const newIntegrantes = [...formData.integrantes];
    newIntegrantes[index][field] = value;
    setFormData(prev => ({
      ...prev,
      integrantes: newIntegrantes,
    }));
  };

  const handleAddTrabajo = () => {
    setFormData(prev => ({
      ...prev,
      trabajosPresentados: [...prev.trabajosPresentados, { ciudad: '', fechaInicio: '', nombreReunion: '', titulo: '' }],
    }));
  };

  const handleRemoveTrabajo = (index) => {
    setFormData(prev => ({
      ...prev,
      trabajosPresentados: prev.trabajosPresentados.filter((_, i) => i !== index),
    }));
  };

  const handleTrabajoChange = (index, field, value) => {
    const newTrabajos = [...formData.trabajosPresentados];
    newTrabajos[index][field] = value;
    setFormData(prev => ({
      ...prev,
      trabajosPresentados: newTrabajos,
    }));
  };

  const handleAddProyecto = () => {
    setFormData(prev => ({
      ...prev,
      proyectos: [...prev.proyectos, { codigo: '', nombre: '', estado: '', descripcion: '', tipo: '', fechaInicio: '', fechaFin: '' }],
    }));
  };

  const handleRemoveProyecto = (index) => {
    setFormData(prev => ({
      ...prev,
      proyectos: prev.proyectos.filter((_, i) => i !== index),
    }));
  };

  const handleProyectoChange = (index, field, value) => {
    const newProyectos = [...formData.proyectos];
    newProyectos[index][field] = value;
    setFormData(prev => ({
      ...prev,
      proyectos: newProyectos,
    }));
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div className="tab-content">
            <h2>Información General</h2>
            <div className="form-grid-2">
              <div className="form-group">
                <label>Año</label>
                <select name="ano" value={formData.ano} onChange={handleInputChange} className="form-select">
                  <option>2025</option>
                  <option>2024</option>
                  <option>2023</option>
                </select>
              </div>
              <div className="form-group">
                <label>Grupo</label>
                <select name="grupo" value={formData.grupo} onChange={handleInputChange} className="form-select">
                  <option value="">Grupo</option>
                </select>
              </div>
              <div className="form-group">
                <label>Director</label>
                <select name="director" value={formData.director} onChange={handleInputChange} className="form-select">
                  <option value="">Director</option>
                </select>
              </div>
              <div className="form-group">
                <label>Vicedirector</label>
                <select name="vicedirector" value={formData.vicedirector} onChange={handleInputChange} className="form-select">
                  <option value="">Vicedirector</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 'integrantes':
        return (
          <div className="tab-content">
            <div className="section-header">
              <h2>Integrantes</h2>
              <button className="btn-add" onClick={handleAddIntegrante} title="Agregar integrante">
                <Plus size={18} />
              </button>
            </div>
            <div className="table-responsive">
              <table className="form-table">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Apellido</th>
                    <th>Rol</th>
                    <th>Horas semanales</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.integrantes.length > 0 ? (
                    formData.integrantes.map((integrante, index) => (
                      <tr key={index}>
                        <td>
                          <input
                            type="text"
                            placeholder="Nombre"
                            value={integrante.nombre}
                            onChange={(e) => handleIntegranteChange(index, 'nombre', e.target.value)}
                            className="form-input-small"
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            placeholder="Apellido"
                            value={integrante.apellido}
                            onChange={(e) => handleIntegranteChange(index, 'apellido', e.target.value)}
                            className="form-input-small"
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            placeholder="Rol"
                            value={integrante.rol}
                            onChange={(e) => handleIntegranteChange(index, 'rol', e.target.value)}
                            className="form-input-small"
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            placeholder="Horas"
                            value={integrante.horas}
                            onChange={(e) => handleIntegranteChange(index, 'horas', e.target.value)}
                            className="form-input-small"
                          />
                        </td>
                        <td>
                          <button
                            className="btn-delete"
                            onClick={() => handleRemoveIntegrante(index)}
                            title="Eliminar"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="empty-cell">No hay integrantes agregados</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'trabajos':
        return (
          <div className="tab-content">
            <div className="section-header">
              <h2>Trabajos Presentados</h2>
              <button className="btn-add" onClick={handleAddTrabajo} title="Agregar trabajo">
                <Plus size={18} />
              </button>
            </div>
            <div className="table-responsive">
              <table className="form-table">
                <thead>
                  <tr>
                    <th>Ciudad</th>
                    <th>Fecha Inicio</th>
                    <th>Nombre de la Reunión</th>
                    <th>Título Trabajo</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.trabajosPresentados.length > 0 ? (
                    formData.trabajosPresentados.map((trabajo, index) => (
                      <tr key={index}>
                        <td>
                          <input
                            type="text"
                            placeholder="Ciudad"
                            value={trabajo.ciudad}
                            onChange={(e) => handleTrabajoChange(index, 'ciudad', e.target.value)}
                            className="form-input-small"
                          />
                        </td>
                        <td>
                          <input
                            type="date"
                            value={trabajo.fechaInicio}
                            onChange={(e) => handleTrabajoChange(index, 'fechaInicio', e.target.value)}
                            className="form-input-small"
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            placeholder="Nombre reunión"
                            value={trabajo.nombreReunion}
                            onChange={(e) => handleTrabajoChange(index, 'nombreReunion', e.target.value)}
                            className="form-input-small"
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            placeholder="Título"
                            value={trabajo.titulo}
                            onChange={(e) => handleTrabajoChange(index, 'titulo', e.target.value)}
                            className="form-input-small"
                          />
                        </td>
                        <td>
                          <button
                            className="btn-delete"
                            onClick={() => handleRemoveTrabajo(index)}
                            title="Eliminar"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="empty-cell">No hay trabajos agregados</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'actividades':
        return (
          <div className="tab-content">
            <h2>Actividades</h2>
            <div className="form-grid-2">
              <div className="form-group">
                <label>Programa de Actividades</label>
                <select name="programaActividades" value={formData.programaActividades} onChange={handleInputChange} className="form-select">
                  <option value="">Programa de Actividades</option>
                </select>
              </div>
            </div>
            <div className="form-group full-width">
              <label>Descripción</label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleInputChange}
                placeholder="Descripción"
                className="form-textarea"
                rows="4"
              />
            </div>
            <div className="form-group full-width">
              <label>Tipo</label>
              <input
                type="text"
                name="tipo"
                value={formData.tipo}
                onChange={handleInputChange}
                placeholder="Tipo"
                className="form-input"
              />
            </div>
            <div className="form-group full-width">
              <label>Vinculación Socio Productiva</label>
              <select name="vinculacionSocoProductiva" value={formData.vinculacionSocoProductiva} onChange={handleInputChange} className="form-select">
                <option value="">Vinculación Socio Productiva</option>
              </select>
            </div>
          </div>
        );

      case 'publicaciones':
        return (
          <div className="tab-content">
            <h2>Publicaciones</h2>
            <div className="form-section">
              <h3>Trabajo Publicado</h3>
              <div className="form-group full-width">
                <label>Trabajo publicado</label>
                <select name="trabajoPublicado" value={formData.trabajoPublicado} onChange={handleInputChange} className="form-select">
                  <option value="">Trabajo publicado</option>
                </select>
              </div>
              <div className="form-group full-width">
                <label>Título</label>
                <input
                  type="text"
                  name="trabajoPublicado_titulo"
                  placeholder="Título"
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-section">
              <h3>Documentación Bibliográfica</h3>
              <div className="form-group full-width">
                <label>Documentación bibliográfica</label>
                <select name="documentacionBiblioteca" value={formData.documentacionBiblioteca} onChange={handleInputChange} className="form-select">
                  <option value="">Documentación bibliográfica</option>
                </select>
              </div>
              <div className="form-grid-3">
                <div className="form-group">
                  <label>Año</label>
                  <input
                    type="text"
                    name="ano_bib"
                    value={formData.ano_bib}
                    onChange={handleInputChange}
                    placeholder="Año"
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>Editorial</label>
                  <input
                    type="text"
                    name="editorial"
                    value={formData.editorial}
                    onChange={handleInputChange}
                    placeholder="Editorial"
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>Título</label>
                  <input
                    type="text"
                    name="titulo_bib"
                    value={formData.titulo_bib}
                    onChange={handleInputChange}
                    placeholder="Título"
                    className="form-input"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 'patentes':
        return (
          <div className="tab-content">
            <h2>Patentes</h2>
            <div className="form-group full-width">
              <label>Patente desarrollo certificado</label>
              <select name="patente" value={formData.patente} onChange={handleInputChange} className="form-select">
                <option value="">Patente desarrollo certificado</option>
              </select>
            </div>
            <div className="form-grid-2">
              <div className="form-group">
                <label>Descripción</label>
                <input
                  type="text"
                  name="descripcion_patente"
                  value={formData.descripcion_patente}
                  onChange={handleInputChange}
                  placeholder="Descripción"
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Tipo</label>
                <input
                  type="text"
                  name="tipo_patente"
                  value={formData.tipo_patente}
                  onChange={handleInputChange}
                  placeholder="Tipo"
                  className="form-input"
                />
              </div>
            </div>
          </div>
        );

      case 'proyectos':
        return (
          <div className="tab-content">
            <div className="section-header">
              <h2>Proyectos de Investigación</h2>
              <button className="btn-add" onClick={handleAddProyecto} title="Agregar proyecto">
                <Plus size={18} />
              </button>
            </div>
            <div className="table-responsive">
              <table className="form-table">
                <thead>
                  <tr>
                    <th>Código ID</th>
                    <th>Nombre</th>
                    <th>Estado</th>
                    <th>Descripción</th>
                    <th>Tipo</th>
                    <th>Fecha Inicio</th>
                    <th>Fecha Fin</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.proyectos.length > 0 ? (
                    formData.proyectos.map((proyecto, index) => (
                      <tr key={index}>
                        <td>
                          <input
                            type="text"
                            placeholder="Código"
                            value={proyecto.codigo}
                            onChange={(e) => handleProyectoChange(index, 'codigo', e.target.value)}
                            className="form-input-small"
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            placeholder="Nombre"
                            value={proyecto.nombre}
                            onChange={(e) => handleProyectoChange(index, 'nombre', e.target.value)}
                            className="form-input-small"
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            placeholder="Estado"
                            value={proyecto.estado}
                            onChange={(e) => handleProyectoChange(index, 'estado', e.target.value)}
                            className="form-input-small"
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            placeholder="Descripción"
                            value={proyecto.descripcion}
                            onChange={(e) => handleProyectoChange(index, 'descripcion', e.target.value)}
                            className="form-input-small"
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            placeholder="Tipo"
                            value={proyecto.tipo}
                            onChange={(e) => handleProyectoChange(index, 'tipo', e.target.value)}
                            className="form-input-small"
                          />
                        </td>
                        <td>
                          <input
                            type="date"
                            value={proyecto.fechaInicio}
                            onChange={(e) => handleProyectoChange(index, 'fechaInicio', e.target.value)}
                            className="form-input-small"
                          />
                        </td>
                        <td>
                          <input
                            type="date"
                            value={proyecto.fechaFin}
                            onChange={(e) => handleProyectoChange(index, 'fechaFin', e.target.value)}
                            className="form-input-small"
                          />
                        </td>
                        <td>
                          <button
                            className="btn-delete"
                            onClick={() => handleRemoveProyecto(index)}
                            title="Eliminar"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="empty-cell">No hay proyectos agregados</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const handleSave = () => {
    console.log('Datos guardados:', formData);
    alert('Memoria anual guardada exitosamente');
  };

  const handleCancel = () => {
    if (window.confirm('¿Estás seguro de que deseas descartar los cambios?')) {
      window.location.reload();
    }
  };

  return (
    <div className="memoria-anual-container">
      <div className="memoria-header">
        <h1>Crear Memoria Anual</h1>
      </div>

      <div className="tabs-container">
        <div className="tabs-header">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
              title={tab.label}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="tab-panel">
          {renderTabContent()}
        </div>
      </div>

      <div className="form-actions">
        <button className="btn-cancel" onClick={handleCancel}>
          Cancelar
        </button>
        <button className="btn-save" onClick={handleSave}>
          Guardar
        </button>
      </div>
    </div>
  );
};

export default MemoriaAnual;
