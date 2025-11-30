import React, { useState, useEffect } from 'react';
import './MemoriaAnual.css';
import { ChevronDown, Plus, Trash2, Edit } from 'lucide-react';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

const MemoriaAnual = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [memoriaId, setMemoriaId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editingIndex, setEditingIndex] = useState({ integrantes: null, trabajos: null, proyectos: null });
  const [modalField, setModalField] = useState({ show: false, index: null, field: '', value: '', title: '', type: '' });
  const [formData, setFormData] = useState({
    ano: '',
    grupo: '',
    director: '',
    vicedirector: '',
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

  // Cargar datos al montar el componente
  useEffect(() => {
    loadMemoriaData();
  }, []);

  // Función para cargar todos los datos de la memoria
  const loadMemoriaData = async () => {
    try {
      setLoading(true);
      
      // Primero obtenemos la memoria más reciente o creamos una nueva
      const memoriasRes = await fetch(`${API_BASE_URL}/memorias/`);
      const memorias = await memoriasRes.json();
      
      let currentMemoria;
      if (memorias.length > 0) {
        currentMemoria = memorias[0]; // Tomar la primera memoria
        setMemoriaId(currentMemoria.oidMemoriaAnual);
        
        // Cargar todos los datos relacionados
        await Promise.all([
          loadIntegrantes(currentMemoria.oidMemoriaAnual),
          loadTrabajos(currentMemoria.oidMemoriaAnual),
          loadActividades(currentMemoria.oidMemoriaAnual),
          loadPublicaciones(currentMemoria.oidMemoriaAnual),
          loadPatentes(currentMemoria.oidMemoriaAnual),
          loadProyectos(currentMemoria.oidMemoriaAnual)
        ]);
        
        setFormData(prev => ({
          ...prev,
          ano: currentMemoria.anio,
          grupo: currentMemoria.GrupoInvestigacion,
          director: currentMemoria.director,
          vicedirector: currentMemoria.vicedirector
        }));
      }
      
      console.log('Datos de memoria cargados exitosamente');
    } catch (error) {
      console.error('Error cargando datos de memoria:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadIntegrantes = async (memoriaId) => {
    const res = await fetch(`${API_BASE_URL}/memorias-integrantes/?memoria=${memoriaId}`);
    const data = await res.json();
    setFormData(prev => ({ ...prev, integrantes: data }));
  };

  const loadTrabajos = async (memoriaId) => {
    const res = await fetch(`${API_BASE_URL}/memorias-trabajos/?memoria=${memoriaId}`);
    const data = await res.json();
    setFormData(prev => ({ ...prev, trabajos: data }));
  };

  const loadActividades = async (memoriaId) => {
    const res = await fetch(`${API_BASE_URL}/memorias-actividades/?memoria=${memoriaId}`);
    const data = await res.json();
    setFormData(prev => ({ ...prev, actividades: data }));
  };

  const loadPublicaciones = async (memoriaId) => {
    const res = await fetch(`${API_BASE_URL}/memorias-publicaciones/?memoria=${memoriaId}`);
    const data = await res.json();
    setFormData(prev => ({ ...prev, publicaciones: data }));
  };

  const loadPatentes = async (memoriaId) => {
    const res = await fetch(`${API_BASE_URL}/memorias-patentes/?memoria=${memoriaId}`);
    const data = await res.json();
    setFormData(prev => ({ ...prev, patentes: data }));
  };

  const loadProyectos = async (memoriaId) => {
    const res = await fetch(`${API_BASE_URL}/memorias-proyectos/?memoria=${memoriaId}`);
    const data = await res.json();
    setFormData(prev => ({ ...prev, proyectos: data }));
  };

  // Handlers para Integrantes
  const handleAddIntegrante = async () => {
    if (!memoriaId) {
      alert('Primero debes crear una memoria anual en la pestaña General');
      return;
    }

    const nuevoIntegrante = {
      MemoriaAnual: memoriaId,
      persona: 1, // Temporal, deberías obtener esto de un selector
      rol: 'Investigador',
      horasSemanales: 40
    };

    try {
      const res = await fetch(`${API_BASE_URL}/memorias-integrantes/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoIntegrante)
      });
      const data = await res.json();
      setFormData(prev => ({ ...prev, integrantes: [...prev.integrantes, data] }));
      console.log('Integrante agregado:', data);
    } catch (error) {
      console.error('Error agregando integrante:', error);
    }
  };

  const handleRemoveIntegrante = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este integrante?')) return;

    try {
      await fetch(`${API_BASE_URL}/memorias-integrantes/${id}/`, {
        method: 'DELETE'
      });
      setFormData(prev => ({
        ...prev,
        integrantes: prev.integrantes.filter(i => i.oidIntegranteMemoria !== id)
      }));
      console.log('Integrante eliminado');
    } catch (error) {
      console.error('Error eliminando integrante:', error);
    }
  };

  const handleIntegranteChange = async (id, field, value) => {
    const integrante = formData.integrantes.find(i => i.oidIntegranteMemoria === id);
    const updated = { ...integrante, [field]: value };

    try {
      const res = await fetch(`${API_BASE_URL}/memorias-integrantes/${id}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      const data = await res.json();
      setFormData(prev => ({
        ...prev,
        integrantes: prev.integrantes.map(i => i.oidIntegranteMemoria === id ? data : i)
      }));
    } catch (error) {
      console.error('Error actualizando integrante:', error);
    }
  };

  // Handlers para Trabajos
  const handleAddTrabajo = async () => {
    if (!memoriaId) {
      alert('Primero debes crear una memoria anual en la pestaña General');
      return;
    }

    const nuevoTrabajo = {
      MemoriaAnual: memoriaId,
      ciudad: 'Buenos Aires',
      fecha: new Date().toISOString().split('T')[0],
      nombreReunion: '',
      titulo: ''
    };

    try {
      const res = await fetch(`${API_BASE_URL}/memorias-trabajos/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoTrabajo)
      });
      const data = await res.json();
      setFormData(prev => ({ ...prev, trabajos: [...prev.trabajos, data] }));
      console.log('Trabajo agregado:', data);
    } catch (error) {
      console.error('Error agregando trabajo:', error);
    }
  };

  const handleRemoveTrabajo = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este trabajo?')) return;

    try {
      await fetch(`${API_BASE_URL}/memorias-trabajos/${id}/`, {
        method: 'DELETE'
      });
      setFormData(prev => ({
        ...prev,
        trabajos: prev.trabajos.filter(t => t.oidTrabajoMemoria !== id)
      }));
      console.log('Trabajo eliminado');
    } catch (error) {
      console.error('Error eliminando trabajo:', error);
    }
  };

  const handleTrabajoChange = async (id, field, value) => {
    const trabajo = formData.trabajos.find(t => t.oidTrabajoMemoria === id);
    const updated = { ...trabajo, [field]: value };

    try {
      const res = await fetch(`${API_BASE_URL}/memorias-trabajos/${id}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      const data = await res.json();
      setFormData(prev => ({
        ...prev,
        trabajos: prev.trabajos.map(t => t.oidTrabajoMemoria === id ? data : t)
      }));
    } catch (error) {
      console.error('Error actualizando trabajo:', error);
    }
  };

  const handleAddProyecto = async () => {
    if (!memoriaId) {
      alert('Primero debes crear una memoria anual en la pestaña General');
      return;
    }

    const nuevoProyecto = {
      MemoriaAnual: memoriaId,
      nombre: '',
      estado: 'En curso',
      fechaInicio: new Date().toISOString().split('T')[0],
      fechaFin: null,
      responsable: '',
      responsableTitulo: '',
      presupuesto: '',
      colaboradores: '',
      colaboradoresTitulo: '',
      objetivos: '',
      objetivosTitulo: '',
      resultados: '',
      resultadosTitulo: ''
    };

    try {
      const res = await fetch(`${API_BASE_URL}/memorias-proyectos/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoProyecto)
      });
      const data = await res.json();
      setFormData(prev => ({ ...prev, proyectos: [...prev.proyectos, data] }));
      console.log('Proyecto agregado:', data);
    } catch (error) {
      console.error('Error agregando proyecto:', error);
    }
  };

  const handleRemoveProyecto = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este proyecto?')) return;

    try {
      await fetch(`${API_BASE_URL}/memorias-proyectos/${id}/`, {
        method: 'DELETE'
      });
      setFormData(prev => ({
        ...prev,
        proyectos: prev.proyectos.filter(p => p.oidProyectoMemoria !== id)
      }));
      console.log('Proyecto eliminado');
    } catch (error) {
      console.error('Error eliminando proyecto:', error);
    }
  };

  const handleProyectoChange = async (id, field, value) => {
    const proyecto = formData.proyectos.find(p => p.oidProyectoMemoria === id);
    const updated = { ...proyecto, [field]: value };

    try {
      const res = await fetch(`${API_BASE_URL}/memorias-proyectos/${id}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      const data = await res.json();
      setFormData(prev => ({
        ...prev,
        proyectos: prev.proyectos.map(p => p.oidProyectoMemoria === id ? data : p)
      }));
    } catch (error) {
      console.error('Error actualizando proyecto:', error);
    }
  };

  const handleAddActividad = async () => {
    if (!memoriaId) {
      alert('Primero debes crear una memoria anual en la pestaña General');
      return;
    }

    const nuevaActividad = {
      MemoriaAnual: memoriaId,
      titulo: '',
      descripcion: '',
      fecha: new Date().toISOString().split('T')[0],
      tipo: 'Seminario'
    };

    try {
      const res = await fetch(`${API_BASE_URL}/memorias-actividades/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevaActividad)
      });
      const data = await res.json();
      setFormData(prev => ({ ...prev, actividades: [...prev.actividades, data] }));
      console.log('Actividad agregada:', data);
    } catch (error) {
      console.error('Error agregando actividad:', error);
    }
  };

  const handleRemoveActividad = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar esta actividad?')) return;

    try {
      await fetch(`${API_BASE_URL}/memorias-actividades/${id}/`, {
        method: 'DELETE'
      });
      setFormData(prev => ({
        ...prev,
        actividades: prev.actividades.filter(a => a.oidActividadMemoria !== id)
      }));
      console.log('Actividad eliminada');
    } catch (error) {
      console.error('Error eliminando actividad:', error);
    }
  };

  const handleActividadChange = async (id, field, value) => {
    const actividad = formData.actividades.find(a => a.oidActividadMemoria === id);
    const updated = { ...actividad, [field]: value };

    try {
      const res = await fetch(`${API_BASE_URL}/memorias-actividades/${id}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      const data = await res.json();
      setFormData(prev => ({
        ...prev,
        actividades: prev.actividades.map(a => a.oidActividadMemoria === id ? data : a)
      }));
    } catch (error) {
      console.error('Error actualizando actividad:', error);
    }
  };

  const handleAddPublicacion = async () => {
    if (!memoriaId) {
      alert('Primero debes crear una memoria anual en la pestaña General');
      return;
    }

    const nuevaPublicacion = {
      MemoriaAnual: memoriaId,
      titulo: '',
      autor: '',
      revista: '',
      anio: new Date().getFullYear()
    };

    try {
      const res = await fetch(`${API_BASE_URL}/memorias-publicaciones/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevaPublicacion)
      });
      const data = await res.json();
      setFormData(prev => ({ ...prev, publicaciones: [...prev.publicaciones, data] }));
      console.log('Publicación agregada:', data);
    } catch (error) {
      console.error('Error agregando publicación:', error);
    }
  };

  const handleRemovePublicacion = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar esta publicación?')) return;

    try {
      await fetch(`${API_BASE_URL}/memorias-publicaciones/${id}/`, {
        method: 'DELETE'
      });
      setFormData(prev => ({
        ...prev,
        publicaciones: prev.publicaciones.filter(p => p.oidPublicacionMemoria !== id)
      }));
      console.log('Publicación eliminada');
    } catch (error) {
      console.error('Error eliminando publicación:', error);
    }
  };

  const handlePublicacionChange = async (id, field, value) => {
    const publicacion = formData.publicaciones.find(p => p.oidPublicacionMemoria === id);
    const updated = { ...publicacion, [field]: value };

    try {
      const res = await fetch(`${API_BASE_URL}/memorias-publicaciones/${id}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      const data = await res.json();
      setFormData(prev => ({
        ...prev,
        publicaciones: prev.publicaciones.map(p => p.oidPublicacionMemoria === id ? data : p)
      }));
    } catch (error) {
      console.error('Error actualizando publicación:', error);
    }
  };

  const handleAddPatente = async () => {
    if (!memoriaId) {
      alert('Primero debes crear una memoria anual en la pestaña General');
      return;
    }

    const nuevaPatente = {
      MemoriaAnual: memoriaId,
      titulo: '',
      numero: '',
      fecha: new Date().toISOString().split('T')[0],
      estado: 'En trámite'
    };

    try {
      const res = await fetch(`${API_BASE_URL}/memorias-patentes/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevaPatente)
      });
      const data = await res.json();
      setFormData(prev => ({ ...prev, patentes: [...prev.patentes, data] }));
      console.log('Patente agregada:', data);
    } catch (error) {
      console.error('Error agregando patente:', error);
    }
  };

  const handleRemovePatente = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar esta patente?')) return;

    try {
      await fetch(`${API_BASE_URL}/memorias-patentes/${id}/`, {
        method: 'DELETE'
      });
      setFormData(prev => ({
        ...prev,
        patentes: prev.patentes.filter(p => p.oidPatenteMemoria !== id)
      }));
      console.log('Patente eliminada');
    } catch (error) {
      console.error('Error eliminando patente:', error);
    }
  };

  const handlePatenteChange = async (id, field, value) => {
    const patente = formData.patentes.find(p => p.oidPatenteMemoria === id);
    const updated = { ...patente, [field]: value };

    try {
      const res = await fetch(`${API_BASE_URL}/memorias-patentes/${id}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      const data = await res.json();
      setFormData(prev => ({
        ...prev,
        patentes: prev.patentes.map(p => p.oidPatenteMemoria === id ? data : p)
      }));
    } catch (error) {
      console.error('Error actualizando patente:', error);
    }
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
