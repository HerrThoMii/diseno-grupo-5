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
    trabajos: [],
    actividades: '',
    publicaciones: '',
    patentes: '',
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
      proyectos: [...formData.proyectos, { nombre: '', estado: '', inicio: '', fin: '', responsable: '', presupuesto: '', colaboradores: '', objetivos: '', resultados: '' }],
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
                  <input
                    type="text"
                    value={formData.director}
                    onChange={(e) => setFormData({ ...formData, director: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Vicedirector</label>
                  <input
                    type="text"
                    value={formData.vicedirector}
                    onChange={(e) => setFormData({ ...formData, vicedirector: e.target.value })}
                  />
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
                        <input
                          type="text"
                          value={integrante.rol}
                          onChange={(e) => handleIntegranteChange(index, 'rol', e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={integrante.horas}
                          onChange={(e) => handleIntegranteChange(index, 'horas', e.target.value)}
                        />
                      </td>
                      <td>
                        <button className="btn-delete" onClick={() => handleRemoveIntegrante(index)}>
                          <Trash2 size={16} />
                        </button>
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
                        <input
                          type="text"
                          value={trabajo.ciudad}
                          onChange={(e) => handleTrabajoChange(index, 'ciudad', e.target.value)}
                        />
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
                        <button className="btn-delete" onClick={() => handleRemoveTrabajo(index)}>
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'actividades' && (
            <div className="tab-content">
              <div className="form-group">
                <label>Actividades</label>
                <textarea
                  value={formData.actividades}
                  onChange={(e) => setFormData({ ...formData, actividades: e.target.value })}
                  rows="10"
                />
              </div>
            </div>
          )}

          {activeTab === 'publicaciones' && (
            <div className="tab-content">
              <div className="form-group">
                <label>Publicaciones</label>
                <textarea
                  value={formData.publicaciones}
                  onChange={(e) => setFormData({ ...formData, publicaciones: e.target.value })}
                  rows="10"
                />
              </div>
            </div>
          )}

          {activeTab === 'patentes' && (
            <div className="tab-content">
              <div className="form-group">
                <label>Patentes</label>
                <textarea
                  value={formData.patentes}
                  onChange={(e) => setFormData({ ...formData, patentes: e.target.value })}
                  rows="10"
                />
              </div>
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
                        <input
                          type="text"
                          value={proyecto.responsable}
                          onChange={(e) => handleProyectoChange(index, 'responsable', e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={proyecto.presupuesto}
                          onChange={(e) => handleProyectoChange(index, 'presupuesto', e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={proyecto.colaboradores}
                          onChange={(e) => handleProyectoChange(index, 'colaboradores', e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={proyecto.objetivos}
                          onChange={(e) => handleProyectoChange(index, 'objetivos', e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={proyecto.resultados}
                          onChange={(e) => handleProyectoChange(index, 'resultados', e.target.value)}
                        />
                      </td>
                      <td>
                        <button className="btn-delete" onClick={() => handleRemoveProyecto(index)}>
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MemoriaAnual;
