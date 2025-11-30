import React, { useState } from 'react';
import './MemoriaAnual.css';
import { ChevronDown, Plus, Trash2, Edit } from 'lucide-react';

const MemoriaAnual = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [editingIndex, setEditingIndex] = useState({ integrantes: null, trabajos: null, proyectos: null });
  const [modalField, setModalField] = useState({ show: false, index: null, field: '', value: '', title: '', type: '' });
  const [formData, setFormData] = useState({
    memorias: [],
    integrantes: [],
    trabajos: [],
    actividades: [],
    publicaciones: [],
    patentes: [],
    proyectos: [],
  });

  const tabs = [
    { id: 'general', label: 'General' },
    { id: 'integrantes', label: 'Integrantes' },
    { id: 'trabajos', label: 'Trabajos' },
    { id: 'actividades', label: 'Actividades' },
    { id: 'publicaciones', label: 'Publicaciones' },
    { id: 'patentes', label: 'Patentes' },
    { id: 'proyectos', label: 'Proyectos' },
  ];

  const handleAddMemoria = () => {
    setFormData({
      ...formData,
      memorias: [...formData.memorias, { ano: '', grupo: '', director: '', vicedirector: '' }],
    });
  };

  const handleRemoveMemoria = (index) => {
    setFormData({
      ...formData,
      memorias: formData.memorias.filter((_, i) => i !== index),
    });
  };

  const handleMemoriaChange = (index, field, value) => {
    const updated = [...formData.memorias];
    updated[index][field] = value;
    setFormData({ ...formData, memorias: updated });
  };

const handleAddIntegrante = () => {
    setFormData({
      ...formData,
      integrantes: [...formData.integrantes, { nombre: '', apellido: '', rol: '', horas: '' }],
    });
  };

  const handleRemoveIntegrante = (index) => {
    setFormData({
      ...formData,
      integrantes: formData.integrantes.filter((_, i) => i !== index),
    });
  };

  const handleIntegranteChange = (index, field, value) => {
    const updated = [...formData.integrantes];
    updated[index][field] = value;
    setFormData({ ...formData, integrantes: updated });
  };

  const handleAddTrabajo = () => {
    setFormData({
      ...formData,
      trabajos: [...formData.trabajos, { ciudad: '', fecha: '', reunion: '', titulo: '' }],
    });
  };

  const handleRemoveTrabajo = (index) => {
    setFormData({
      ...formData,
      trabajos: formData.trabajos.filter((_, i) => i !== index),
    });
  };

  const handleTrabajoChange = (index, field, value) => {
    const updated = [...formData.trabajos];
    updated[index][field] = value;
    setFormData({ ...formData, trabajos: updated });
  };

  const handleAddProyecto = () => {
    setFormData({
      ...formData,
      proyectos: [...formData.proyectos, { 
        nombre: '', 
        estado: '', 
        inicio: '', 
        fin: '', 
        responsable: '', 
        responsableTitulo: '',
        presupuesto: '', 
        colaboradores: '', 
        colaboradoresTitulo: '',
        objetivos: '', 
        objetivosTitulo: '',
        resultados: '',
        resultadosTitulo: ''
      }],
    });
  };

  const handleRemoveProyecto = (index) => {
    setFormData({
      ...formData,
      proyectos: formData.proyectos.filter((_, i) => i !== index),
    });
  };

  const handleProyectoChange = (index, field, value) => {
    const updated = [...formData.proyectos];
    updated[index][field] = value;
    setFormData({ ...formData, proyectos: updated });
  };

  const handleAddActividad = () => {
    setFormData({
      ...formData,
      actividades: [...formData.actividades, { titulo: '', descripcion: '', fecha: '', tipo: '' }],
    });
  };

  const handleRemoveActividad = (index) => {
    setFormData({
      ...formData,
      actividades: formData.actividades.filter((_, i) => i !== index),
    });
  };

  const handleActividadChange = (index, field, value) => {
    const updated = [...formData.actividades];
    updated[index][field] = value;
    setFormData({ ...formData, actividades: updated });
  };

  const handleAddPublicacion = () => {
    setFormData({
      ...formData,
      publicaciones: [...formData.publicaciones, { titulo: '', autor: '', revista: '', anio: '' }],
    });
  };

  const handleRemovePublicacion = (index) => {
    setFormData({
      ...formData,
      publicaciones: formData.publicaciones.filter((_, i) => i !== index),
    });
  };

  const handlePublicacionChange = (index, field, value) => {
    const updated = [...formData.publicaciones];
    updated[index][field] = value;
    setFormData({ ...formData, publicaciones: updated });
  };

  const handleAddPatente = () => {
    setFormData({
      ...formData,
      patentes: [...formData.patentes, { titulo: '', numero: '', fecha: '', estado: '' }],
    });
  };

  const handleRemovePatente = (index) => {
    setFormData({
      ...formData,
      patentes: formData.patentes.filter((_, i) => i !== index),
    });
  };

  const handlePatenteChange = (index, field, value) => {
    const updated = [...formData.patentes];
    updated[index][field] = value;
    setFormData({ ...formData, patentes: updated });
  };

  const openFieldModal = (index, field, value, title, type = 'proyecto') => {
    setModalField({ show: true, index, field, value, title, type });
  };

  const closeFieldModal = () => {
    setModalField({ show: false, index: null, field: '', value: '', title: '', type: '' });
  };

  const saveFieldModal = () => {
    if (modalField.type === 'actividad') {
      handleActividadChange(modalField.index, 'descripcion', modalField.value);
      handleActividadChange(modalField.index, 'titulo', modalField.title);
    } else {
      handleProyectoChange(modalField.index, modalField.field, modalField.value);
      if (modalField.field !== 'titulo') {
        const titleField = modalField.field + 'Titulo';
        handleProyectoChange(modalField.index, titleField, modalField.title);
      }
    }
    closeFieldModal();
  };

  return (
    <div className="memoria-anual-container">
      <div className="memoria-header">
        <h1>Crear Memoria Anual</h1>
      </div>

      <div className="tabs-container">
        <div className="tabs-header">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-label">{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="tab-panel">
          {activeTab === 'general' && (
            <div className="tab-content">
              <div className="form-section">
                <div className="form-group">
                  <label>Año</label>
                  <input
                    type="number"
                    value={formData.ano}
                    onChange={(e) => setFormData({ ...formData, ano: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Grupo</label>
                  <select value={formData.grupo} onChange={(e) => setFormData({ ...formData, grupo: e.target.value })}>
                    <option value="">Seleccionar</option>
                    <option value="grupo1">Grupo 1</option>
                    <option value="grupo2">Grupo 2</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Director</label>
                  <select
                    value={formData.director}
                    onChange={(e) => setFormData({ ...formData, director: e.target.value })}
                  >
                    <option value="">Seleccionar Director</option>
                    <option value="director1">Director 1</option>
                    <option value="director2">Director 2</option>
                    <option value="director3">Director 3</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Vicedirector</label>
                  <select
                    value={formData.vicedirector}
                    onChange={(e) => setFormData({ ...formData, vicedirector: e.target.value })}
                  >
                    <option value="">Seleccionar Vicedirector</option>
                    <option value="vice1">Vicedirector 1</option>
                    <option value="vice2">Vicedirector 2</option>
                    <option value="vice3">Vicedirector 3</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'integrantes' && (
            <div className="tab-content">
              <button className="btn-add" onClick={handleAddIntegrante}>
                <Plus size={18} /> Agregar Integrante
              </button>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Apellido</th>
                    <th>Rol</th>
                    <th>Horas</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.integrantes.map((integrante, index) => (
                    <tr key={index}>
                      <td>
                        <input
                          type="text"
                          value={integrante.nombre}
                          onChange={(e) => handleIntegranteChange(index, 'nombre', e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={integrante.apellido}
                          onChange={(e) => handleIntegranteChange(index, 'apellido', e.target.value)}
                        />
                      </td>
                      <td>
                        <select
                          value={integrante.rol}
                          onChange={(e) => handleIntegranteChange(index, 'rol', e.target.value)}
                        >
                          <option value="">Seleccionar rol</option>
                          <option value="Investigador">Investigador</option>
                          <option value="Investigador Docente">Investigador Docente</option>
                          <option value="Becario">Becario</option>
                          <option value="Personal de Apoyo">Personal de Apoyo</option>
                        </select>
                      </td>
                      <td>
                        <input
                          type="number"
                          value={integrante.horas}
                          onChange={(e) => handleIntegranteChange(index, 'horas', e.target.value)}
                        />
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                          <button 
                            className="btn-edit" 
                            onClick={() => setEditingIndex({ ...editingIndex, integrantes: index })}
                            title="Editar"
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            className="btn-delete" 
                            onClick={() => handleRemoveIntegrante(index)}
                            title="Eliminar"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'trabajos' && (
            <div className="tab-content">
              <button className="btn-add" onClick={handleAddTrabajo}>
                <Plus size={18} /> Agregar Trabajo
              </button>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Ciudad</th>
                    <th>Fecha</th>
                    <th>Reunión</th>
                    <th>Título</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.trabajos.map((trabajo, index) => (
                    <tr key={index}>
                      <td>
                        <select
                          value={trabajo.ciudad}
                          onChange={(e) => handleTrabajoChange(index, 'ciudad', e.target.value)}
                        >
                          <option value="">Seleccionar ciudad</option>
                          <option value="Buenos Aires">Buenos Aires</option>
                          <option value="Córdoba">Córdoba</option>
                          <option value="Rosario">Rosario</option>
                          <option value="Mendoza">Mendoza</option>
                          <option value="San Miguel de Tucumán">San Miguel de Tucumán</option>
                          <option value="La Plata">La Plata</option>
                          <option value="Mar del Plata">Mar del Plata</option>
                          <option value="Salta">Salta</option>
                          <option value="Santa Fe">Santa Fe</option>
                          <option value="San Juan">San Juan</option>
                          <option value="Resistencia">Resistencia</option>
                          <option value="Neuquén">Neuquén</option>
                          <option value="Posadas">Posadas</option>
                          <option value="Bahía Blanca">Bahía Blanca</option>
                        </select>
                      </td>
                      <td>
                        <input
                          type="date"
                          value={trabajo.fecha}
                          onChange={(e) => handleTrabajoChange(index, 'fecha', e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={trabajo.reunion}
                          onChange={(e) => handleTrabajoChange(index, 'reunion', e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={trabajo.titulo}
                          onChange={(e) => handleTrabajoChange(index, 'titulo', e.target.value)}
                        />
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                          <button 
                            className="btn-edit" 
                            onClick={() => setEditingIndex({ ...editingIndex, trabajos: index })}
                            title="Editar"
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            className="btn-delete" 
                            onClick={() => handleRemoveTrabajo(index)}
                            title="Eliminar"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        {activeTab === 'actividades' && (
          <div className="tab-content">
            <button className="btn-add" onClick={handleAddActividad}>
              <Plus size={18} /> Agregar Actividad
            </button>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Descripción</th>
                  <th>Fecha</th>
                  <th>Tipo</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {formData.actividades.map((actividad, index) => (
                  <tr key={index}>
                    <td>
                      <button
                        type="button"
                        className="btn-field-edit"
                        onClick={() => openFieldModal(index, 'descripcion', actividad.descripcion, actividad.titulo, 'actividad')}
                      >
                        {actividad.titulo || 'Descripción'}
                      </button>
                    </td>
                    <td>
                      <input
                        type="date"
                        value={actividad.fecha}
                        onChange={(e) => handleActividadChange(index, 'fecha', e.target.value)}
                      />
                    </td>
                    <td>
                      <select
                        value={actividad.tipo}
                        onChange={(e) => handleActividadChange(index, 'tipo', e.target.value)}
                      >
                        <option value="">Seleccionar tipo</option>
                        <option value="Congreso">Congreso</option>
                        <option value="Seminario">Seminario</option>
                        <option value="Taller">Taller</option>
                        <option value="Conferencia">Conferencia</option>
                        <option value="Curso">Curso</option>
                        <option value="Otro">Otro</option>
                      </select>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                        <button
                          type="button"
                          className="btn-edit"
                          onClick={() => setEditingIndex(editingIndex === index ? null : index)}
                          title="Editar"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          type="button"
                          className="btn-delete"
                          onClick={() => handleRemoveActividad(index)}
                          title="Eliminar"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'publicaciones' && (
          <div className="tab-content">
            <button className="btn-add" onClick={handleAddPublicacion}>
              <Plus size={18} /> Agregar Publicación
            </button>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Título</th>
                  <th>Autor</th>
                  <th>Revista</th>
                  <th>Año</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {formData.publicaciones.map((publicacion, index) => (
                  <tr key={index}>
                    <td>
                      <input
                        type="text"
                        value={publicacion.titulo}
                        onChange={(e) => handlePublicacionChange(index, 'titulo', e.target.value)}
                        placeholder="Título"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={publicacion.autor}
                        onChange={(e) => handlePublicacionChange(index, 'autor', e.target.value)}
                        placeholder="Autor"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={publicacion.revista}
                        onChange={(e) => handlePublicacionChange(index, 'revista', e.target.value)}
                        placeholder="Revista"
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={publicacion.anio}
                        onChange={(e) => handlePublicacionChange(index, 'anio', e.target.value)}
                        placeholder="Año"
                      />
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                        <button
                          type="button"
                          className="btn-edit"
                          onClick={() => setEditingIndex(editingIndex === index ? null : index)}
                          title="Editar"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          type="button"
                          className="btn-delete"
                          onClick={() => handleRemovePublicacion(index)}
                          title="Eliminar"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

          {activeTab === 'patentes' && (
            <div className="tab-content">
              <button className="btn-add" onClick={handleAddPatente}>
                <Plus size={18} /> Agregar Patente
              </button>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Título</th>
                    <th>Número</th>
                    <th>Fecha</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.patentes.map((patente, index) => (
                    <tr key={index}>
                      <td>
                        <input
                          type="text"
                          value={patente.titulo}
                          onChange={(e) => handlePatenteChange(index, 'titulo', e.target.value)}
                          placeholder="Título"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={patente.numero}
                          onChange={(e) => handlePatenteChange(index, 'numero', e.target.value)}
                          placeholder="Número"
                        />
                      </td>
                      <td>
                        <input
                          type="date"
                          value={patente.fecha}
                          onChange={(e) => handlePatenteChange(index, 'fecha', e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={patente.estado}
                          onChange={(e) => handlePatenteChange(index, 'estado', e.target.value)}
                          placeholder="Estado"
                        />
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                          <button
                            type="button"
                            className="btn-edit"
                            onClick={() => setEditingIndex(editingIndex === index ? null : index)}
                            title="Editar"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            type="button"
                            className="btn-delete"
                            onClick={() => handleRemovePatente(index)}
                            title="Eliminar"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'proyectos' && (
            <div className="tab-content">
              <button className="btn-add" onClick={handleAddProyecto}>
                <Plus size={18} /> Agregar Proyecto
              </button>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Estado</th>
                    <th>Inicio</th>
                    <th>Fin</th>
                    <th>Responsable</th>
                    <th>Presupuesto</th>
                    <th>Colaboradores</th>
                    <th>Objetivos</th>
                    <th>Resultados</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.proyectos.map((proyecto, index) => (
                    <tr key={index}>
                      <td>
                        <input
                          type="text"
                          value={proyecto.nombre}
                          onChange={(e) => handleProyectoChange(index, 'nombre', e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={proyecto.estado}
                          onChange={(e) => handleProyectoChange(index, 'estado', e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="date"
                          value={proyecto.inicio}
                          onChange={(e) => handleProyectoChange(index, 'inicio', e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="date"
                          value={proyecto.fin}
                          onChange={(e) => handleProyectoChange(index, 'fin', e.target.value)}
                        />
                      </td>
                      <td>
                        <button
                          type="button"
                          className="btn-field-edit"
                          onClick={() => openFieldModal(index, 'responsable', proyecto.responsable, proyecto.responsableTitulo)}
                        >
                          {proyecto.responsableTitulo || 'Responsable'}
                        </button>
                      </td>
                      <td>
                        <input
                          type="text"
                          value={proyecto.presupuesto}
                          onChange={(e) => handleProyectoChange(index, 'presupuesto', e.target.value)}
                        />
                      </td>
                      <td>
                        <button
                          type="button"
                          className="btn-field-edit"
                          onClick={() => openFieldModal(index, 'colaboradores', proyecto.colaboradores, proyecto.colaboradoresTitulo)}
                        >
                          {proyecto.colaboradoresTitulo || 'Colaboradores'}
                        </button>
                      </td>
                      <td>
                        <button
                          type="button"
                          className="btn-field-edit"
                          onClick={() => openFieldModal(index, 'objetivos', proyecto.objetivos, proyecto.objetivosTitulo)}
                        >
                          {proyecto.objetivosTitulo || 'Objetivos'}
                        </button>
                      </td>
                      <td>
                        <button
                          type="button"
                          className="btn-field-edit"
                          onClick={() => openFieldModal(index, 'resultados', proyecto.resultados, proyecto.resultadosTitulo)}
                        >
                          {proyecto.resultadosTitulo || 'Resultados'}
                        </button>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                          <button 
                            className="btn-edit" 
                            onClick={() => setEditingIndex({ ...editingIndex, proyectos: index })}
                            title="Editar"
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            className="btn-delete" 
                            onClick={() => handleRemoveProyecto(index)}
                            title="Eliminar"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {modalField.show && (
          <div className="field-modal-overlay" onClick={closeFieldModal}>
            <div className="field-modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="field-modal-header">
                <h3>{modalField.field.charAt(0).toUpperCase() + modalField.field.slice(1)}</h3>
                <button className="field-modal-close" onClick={closeFieldModal}>×</button>
              </div>
              <div className="field-modal-body">
                <div className="form-group" style={{ marginBottom: '16px' }}>
                  <label>Título</label>
                  <input
                    type="text"
                    value={modalField.title}
                    onChange={(e) => setModalField({ ...modalField, title: e.target.value })}
                    placeholder="Ingrese un título breve..."
                  />
                </div>
                <div className="form-group">
                  <label>Contenido</label>
                  <textarea
                    value={modalField.value}
                    onChange={(e) => setModalField({ ...modalField, value: e.target.value })}
                    rows="10"
                    placeholder={`Ingrese ${modalField.field}...`}
                  />
                </div>
              </div>
              <div className="field-modal-footer">
                <button className="btn-cancel" onClick={closeFieldModal}>Cancelar</button>
                <button className="btn-save" onClick={saveFieldModal}>Guardar</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MemoriaAnual;
