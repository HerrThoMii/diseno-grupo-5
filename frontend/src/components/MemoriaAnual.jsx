import React, { useState, useEffect } from 'react';
import './MemoriaAnual.css';
import { ChevronDown, Plus, Trash2, Edit, Search } from 'lucide-react';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

const MemoriaAnual = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [memoriaId, setMemoriaId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editingIndex, setEditingIndex] = useState({ integrantes: null, trabajos: null, proyectos: null });
  const [modalField, setModalField] = useState({ show: false, index: null, field: '', value: '', title: '', type: '' });
  const [searchTerms, setSearchTerms] = useState({
    integrantes: '',
    trabajos: '',
    actividades: '',
    publicaciones: '',
    patentes: '',
    proyectos: '',
  });
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

  // Funciones de filtrado para cada sección
  const filterIntegrantes = () => {
    if (!searchTerms.integrantes.trim()) return formData.integrantes;
    const term = searchTerms.integrantes.toLowerCase();
    return formData.integrantes.filter(integrante =>
      integrante.nombre.toLowerCase().includes(term) ||
      integrante.apellido.toLowerCase().includes(term) ||
      integrante.rol.toLowerCase().includes(term)
    );
  };

  const filterTrabajos = () => {
    if (!searchTerms.trabajos.trim()) return formData.trabajos;
    const term = searchTerms.trabajos.toLowerCase();
    return formData.trabajos.filter(trabajo =>
      trabajo.ciudad.toLowerCase().includes(term) ||
      trabajo.reunion.toLowerCase().includes(term) ||
      trabajo.titulo.toLowerCase().includes(term)
    );
  };

  const filterActividades = () => {
    if (!searchTerms.actividades.trim()) return formData.actividades;
    const term = searchTerms.actividades.toLowerCase();
    return formData.actividades.filter(actividad =>
      actividad.titulo.toLowerCase().includes(term) ||
      actividad.tipo.toLowerCase().includes(term) ||
      actividad.descripcion.toLowerCase().includes(term)
    );
  };

  const filterPublicaciones = () => {
    if (!searchTerms.publicaciones.trim()) return formData.publicaciones;
    const term = searchTerms.publicaciones.toLowerCase();
    return formData.publicaciones.filter(publicacion =>
      publicacion.titulo.toLowerCase().includes(term) ||
      publicacion.autor.toLowerCase().includes(term) ||
      publicacion.revista.toLowerCase().includes(term)
    );
  };

  const filterPatentes = () => {
    if (!searchTerms.patentes.trim()) return formData.patentes;
    const term = searchTerms.patentes.toLowerCase();
    return formData.patentes.filter(patente =>
      patente.titulo.toLowerCase().includes(term) ||
      patente.numero.toLowerCase().includes(term) ||
      patente.estado.toLowerCase().includes(term)
    );
  };

  const filterProyectos = () => {
    if (!searchTerms.proyectos.trim()) return formData.proyectos;
    const term = searchTerms.proyectos.toLowerCase();
    return formData.proyectos.filter(proyecto =>
      proyecto.nombre.toLowerCase().includes(term) ||
      proyecto.estado.toLowerCase().includes(term) ||
      proyecto.responsable.toLowerCase().includes(term)
    );
  };

  const handleAddPatente = () => {
    setFormData({
      ...formData,
      patentes: [...formData.patentes, { titulo: '', numero: '', fecha: '', estado: '' }],
    });
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
              <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: '4px', padding: '8px' }}>
                  <Search size={18} style={{ marginRight: '8px', color: '#666' }} />
                  <input
                    type="text"
                    placeholder="Buscar integrante por nombre, apellido o rol..."
                    value={searchTerms.integrantes}
                    onChange={(e) => setSearchTerms({...searchTerms, integrantes: e.target.value})}
                    style={{ border: 'none', outline: 'none', flex: 1, fontSize: '14px' }}
                  />
                </div>
              </div>
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
                  {filterIntegrantes().length > 0 ? (
                    filterIntegrantes().map((integrante, index) => {
                      const originalIndex = formData.integrantes.indexOf(integrante);
                      return (
                        <tr key={originalIndex}>
                          <td>
                            <input
                              type="text"
                              value={integrante.nombre}
                              onChange={(e) => handleIntegranteChange(originalIndex, 'nombre', e.target.value)}
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              value={integrante.apellido}
                              onChange={(e) => handleIntegranteChange(originalIndex, 'apellido', e.target.value)}
                            />
                          </td>
                          <td>
                            <select
                              value={integrante.rol}
                              onChange={(e) => handleIntegranteChange(originalIndex, 'rol', e.target.value)}
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
                              onChange={(e) => handleIntegranteChange(originalIndex, 'horas', e.target.value)}
                            />
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                              <button 
                                className="btn-edit" 
                                onClick={() => setEditingIndex({ ...editingIndex, integrantes: originalIndex })}
                                title="Editar"
                              >
                                <Edit size={16} />
                              </button>
                              <button 
                                className="btn-delete" 
                                onClick={() => handleRemoveIntegrante(originalIndex)}
                                title="Eliminar"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>
                        {searchTerms.integrantes.trim() ? (
                          <div>
                            <p style={{ marginBottom: '10px' }}>No se encontraron resultados para "{searchTerms.integrantes}"</p>
                            <button className="btn-add" onClick={handleAddIntegrante}>
                              <Plus size={18} /> Agregar Nuevo Integrante
                            </button>
                          </div>
                        ) : (
                          <p>No hay integrantes registrados</p>
                        )}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'trabajos' && (
            <div className="tab-content">
              <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: '4px', padding: '8px' }}>
                  <Search size={18} style={{ marginRight: '8px', color: '#666' }} />
                  <input
                    type="text"
                    placeholder="Buscar trabajo por ciudad, reunión o título..."
                    value={searchTerms.trabajos}
                    onChange={(e) => setSearchTerms({...searchTerms, trabajos: e.target.value})}
                    style={{ border: 'none', outline: 'none', flex: 1, fontSize: '14px' }}
                  />
                </div>
              </div>
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
                  {filterTrabajos().length > 0 ? (
                    filterTrabajos().map((trabajo, index) => {
                      const originalIndex = formData.trabajos.indexOf(trabajo);
                      return (
                        <tr key={originalIndex}>
                          <td>
                            <select
                              value={trabajo.ciudad}
                              onChange={(e) => handleTrabajoChange(originalIndex, 'ciudad', e.target.value)}
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
                              onChange={(e) => handleTrabajoChange(originalIndex, 'fecha', e.target.value)}
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              value={trabajo.reunion}
                              onChange={(e) => handleTrabajoChange(originalIndex, 'reunion', e.target.value)}
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              value={trabajo.titulo}
                              onChange={(e) => handleTrabajoChange(originalIndex, 'titulo', e.target.value)}
                            />
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                              <button 
                                className="btn-edit" 
                                onClick={() => setEditingIndex({ ...editingIndex, trabajos: originalIndex })}
                                title="Editar"
                              >
                                <Edit size={16} />
                              </button>
                              <button 
                                className="btn-delete" 
                                onClick={() => handleRemoveTrabajo(originalIndex)}
                                title="Eliminar"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>
                        {searchTerms.trabajos.trim() ? (
                          <div>
                            <p style={{ marginBottom: '10px' }}>No se encontraron resultados para "{searchTerms.trabajos}"</p>
                            <button className="btn-add" onClick={handleAddTrabajo}>
                              <Plus size={18} /> Agregar Nuevo Trabajo
                            </button>
                          </div>
                        ) : (
                          <p>No hay trabajos registrados</p>
                        )}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

        {activeTab === 'actividades' && (
          <div className="tab-content">
            <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
              <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: '4px', padding: '8px' }}>
                <Search size={18} style={{ marginRight: '8px', color: '#666' }} />
                <input
                  type="text"
                  placeholder="Buscar actividad por título, tipo o descripción..."
                  value={searchTerms.actividades}
                  onChange={(e) => setSearchTerms({...searchTerms, actividades: e.target.value})}
                  style={{ border: 'none', outline: 'none', flex: 1, fontSize: '14px' }}
                />
              </div>
            </div>
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
                {filterActividades().length > 0 ? (
                  filterActividades().map((actividad, index) => {
                    const originalIndex = formData.actividades.indexOf(actividad);
                    return (
                      <tr key={originalIndex}>
                        <td>
                          <button
                            type="button"
                            className="btn-field-edit"
                            onClick={() => openFieldModal(originalIndex, 'descripcion', actividad.descripcion, actividad.titulo, 'actividad')}
                          >
                            {actividad.titulo || 'Descripción'}
                          </button>
                        </td>
                        <td>
                          <input
                            type="date"
                            value={actividad.fecha}
                            onChange={(e) => handleActividadChange(originalIndex, 'fecha', e.target.value)}
                          />
                        </td>
                        <td>
                          <select
                            value={actividad.tipo}
                            onChange={(e) => handleActividadChange(originalIndex, 'tipo', e.target.value)}
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
                              onClick={() => setEditingIndex(editingIndex === originalIndex ? null : originalIndex)}
                              title="Editar"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              type="button"
                              className="btn-delete"
                              onClick={() => handleRemoveActividad(originalIndex)}
                              title="Eliminar"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>
                      {searchTerms.actividades.trim() ? (
                        <div>
                          <p style={{ marginBottom: '10px' }}>No se encontraron resultados para "{searchTerms.actividades}"</p>
                          <button className="btn-add" onClick={handleAddActividad}>
                            <Plus size={18} /> Agregar Nueva Actividad
                          </button>
                        </div>
                      ) : (
                        <p>No hay actividades registradas</p>
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'publicaciones' && (
          <div className="tab-content">
            <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
              <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: '4px', padding: '8px' }}>
                <Search size={18} style={{ marginRight: '8px', color: '#666' }} />
                <input
                  type="text"
                  placeholder="Buscar publicación por título, autor o revista..."
                  value={searchTerms.publicaciones}
                  onChange={(e) => setSearchTerms({...searchTerms, publicaciones: e.target.value})}
                  style={{ border: 'none', outline: 'none', flex: 1, fontSize: '14px' }}
                />
              </div>
            </div>
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
                {filterPublicaciones().length > 0 ? (
                  filterPublicaciones().map((publicacion, index) => {
                    const originalIndex = formData.publicaciones.indexOf(publicacion);
                    return (
                      <tr key={originalIndex}>
                        <td>
                          <input
                            type="text"
                            value={publicacion.titulo}
                            onChange={(e) => handlePublicacionChange(originalIndex, 'titulo', e.target.value)}
                            placeholder="Título"
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={publicacion.autor}
                            onChange={(e) => handlePublicacionChange(originalIndex, 'autor', e.target.value)}
                            placeholder="Autor"
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={publicacion.revista}
                            onChange={(e) => handlePublicacionChange(originalIndex, 'revista', e.target.value)}
                            placeholder="Revista"
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={publicacion.anio}
                            onChange={(e) => handlePublicacionChange(originalIndex, 'anio', e.target.value)}
                            placeholder="Año"
                          />
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                            <button
                              type="button"
                              className="btn-edit"
                              onClick={() => setEditingIndex(editingIndex === originalIndex ? null : originalIndex)}
                              title="Editar"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              type="button"
                              className="btn-delete"
                              onClick={() => handleRemovePublicacion(originalIndex)}
                              title="Eliminar"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>
                      {searchTerms.publicaciones.trim() ? (
                        <div>
                          <p style={{ marginBottom: '10px' }}>No se encontraron resultados para "{searchTerms.publicaciones}"</p>
                          <button className="btn-add" onClick={handleAddPublicacion}>
                            <Plus size={18} /> Agregar Nueva Publicación
                          </button>
                        </div>
                      ) : (
                        <p>No hay publicaciones registradas</p>
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

          {activeTab === 'patentes' && (
            <div className="tab-content">
              <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: '4px', padding: '8px' }}>
                  <Search size={18} style={{ marginRight: '8px', color: '#666' }} />
                  <input
                    type="text"
                    placeholder="Buscar patente por título, número o estado..."
                    value={searchTerms.patentes}
                    onChange={(e) => setSearchTerms({...searchTerms, patentes: e.target.value})}
                    style={{ border: 'none', outline: 'none', flex: 1, fontSize: '14px' }}
                  />
                </div>
              </div>
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
                  {filterPatentes().length > 0 ? (
                    filterPatentes().map((patente, index) => {
                      const originalIndex = formData.patentes.indexOf(patente);
                      return (
                        <tr key={originalIndex}>
                          <td>
                            <input
                              type="text"
                              value={patente.titulo}
                              onChange={(e) => handlePatenteChange(originalIndex, 'titulo', e.target.value)}
                              placeholder="Título"
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              value={patente.numero}
                              onChange={(e) => handlePatenteChange(originalIndex, 'numero', e.target.value)}
                              placeholder="Número"
                            />
                          </td>
                          <td>
                            <input
                              type="date"
                              value={patente.fecha}
                              onChange={(e) => handlePatenteChange(originalIndex, 'fecha', e.target.value)}
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              value={patente.estado}
                              onChange={(e) => handlePatenteChange(originalIndex, 'estado', e.target.value)}
                              placeholder="Estado"
                            />
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                              <button
                                type="button"
                                className="btn-edit"
                                onClick={() => setEditingIndex(editingIndex === originalIndex ? null : originalIndex)}
                                title="Editar"
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                type="button"
                                className="btn-delete"
                                onClick={() => handleRemovePatente(originalIndex)}
                                title="Eliminar"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>
                        {searchTerms.patentes.trim() ? (
                          <div>
                            <p style={{ marginBottom: '10px' }}>No se encontraron resultados para "{searchTerms.patentes}"</p>
                            <button className="btn-add" onClick={handleAddPatente}>
                              <Plus size={18} /> Agregar Nueva Patente
                            </button>
                          </div>
                        ) : (
                          <p>No hay patentes registradas</p>
                        )}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'proyectos' && (
            <div className="tab-content">
              <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: '4px', padding: '8px' }}>
                  <Search size={18} style={{ marginRight: '8px', color: '#666' }} />
                  <input
                    type="text"
                    placeholder="Buscar proyecto por nombre, estado o responsable..."
                    value={searchTerms.proyectos}
                    onChange={(e) => setSearchTerms({...searchTerms, proyectos: e.target.value})}
                    style={{ border: 'none', outline: 'none', flex: 1, fontSize: '14px' }}
                  />
                </div>
              </div>
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
                  {filterProyectos().length > 0 ? (
                    filterProyectos().map((proyecto, index) => {
                      const originalIndex = formData.proyectos.indexOf(proyecto);
                      return (
                        <tr key={originalIndex}>
                          <td>
                            <input
                              type="text"
                              value={proyecto.nombre}
                              onChange={(e) => handleProyectoChange(originalIndex, 'nombre', e.target.value)}
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              value={proyecto.estado}
                              onChange={(e) => handleProyectoChange(originalIndex, 'estado', e.target.value)}
                            />
                          </td>
                          <td>
                            <input
                              type="date"
                              value={proyecto.inicio}
                              onChange={(e) => handleProyectoChange(originalIndex, 'inicio', e.target.value)}
                            />
                          </td>
                          <td>
                            <input
                              type="date"
                              value={proyecto.fin}
                              onChange={(e) => handleProyectoChange(originalIndex, 'fin', e.target.value)}
                            />
                          </td>
                          <td>
                            <button
                              type="button"
                              className="btn-field-edit"
                              onClick={() => openFieldModal(originalIndex, 'responsable', proyecto.responsable, proyecto.responsableTitulo)}
                            >
                              {proyecto.responsableTitulo || 'Responsable'}
                            </button>
                          </td>
                          <td>
                            <input
                              type="text"
                              value={proyecto.presupuesto}
                              onChange={(e) => handleProyectoChange(originalIndex, 'presupuesto', e.target.value)}
                            />
                          </td>
                          <td>
                            <button
                              type="button"
                              className="btn-field-edit"
                              onClick={() => openFieldModal(originalIndex, 'colaboradores', proyecto.colaboradores, proyecto.colaboradoresTitulo)}
                            >
                              {proyecto.colaboradoresTitulo || 'Colaboradores'}
                            </button>
                          </td>
                          <td>
                            <button
                              type="button"
                              className="btn-field-edit"
                              onClick={() => openFieldModal(originalIndex, 'objetivos', proyecto.objetivos, proyecto.objetivosTitulo)}
                            >
                              {proyecto.objetivosTitulo || 'Objetivos'}
                            </button>
                          </td>
                          <td>
                            <button
                              type="button"
                              className="btn-field-edit"
                              onClick={() => openFieldModal(originalIndex, 'resultados', proyecto.resultados, proyecto.resultadosTitulo)}
                            >
                              {proyecto.resultadosTitulo || 'Resultados'}
                            </button>
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                              <button 
                                className="btn-edit" 
                                onClick={() => setEditingIndex({ ...editingIndex, proyectos: originalIndex })}
                                title="Editar"
                              >
                                <Edit size={16} />
                              </button>
                              <button 
                                className="btn-delete" 
                                onClick={() => handleRemoveProyecto(originalIndex)}
                                title="Eliminar"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="10" style={{ textAlign: 'center', padding: '20px' }}>
                        {searchTerms.proyectos.trim() ? (
                          <div>
                            <p style={{ marginBottom: '10px' }}>No se encontraron resultados para "{searchTerms.proyectos}"</p>
                            <button className="btn-add" onClick={handleAddProyecto}>
                              <Plus size={18} /> Agregar Nuevo Proyecto
                            </button>
                          </div>
                        ) : (
                          <p>No hay proyectos registrados</p>
                        )}
                      </td>
                    </tr>
                  )}
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
