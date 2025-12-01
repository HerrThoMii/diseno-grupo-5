import React, { useState, useEffect, useRef } from 'react';
import './MemoriaAnual.css';
import { ChevronDown, Plus, Trash2, Edit, Search } from 'lucide-react';
import { obtenerGrupos, obtenerPersonas, crearPersona, obtenerOpcionesPerfil, listarTrabajosPresentados, crearTrabajoPresentado, listarActividades, crearActividad, listarLineasInvestigacion, listarTrabajosPublicados, crearTrabajoPublicado } from '../services/api';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

const MemoriaAnual = () => {
  const integrantesSearchRef = useRef(null);
  const trabajosSearchRef = useRef(null);
  const actividadesSearchRef = useRef(null);
  const publicacionesSearchRef = useRef(null);
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
  const [integrantesPagination, setIntegrantesPagination] = useState({
    currentPage: 1,
    itemsPerPage: 3,
  });
  const [trabajosPagination, setTrabajosPagination] = useState({
    currentPage: 1,
    itemsPerPage: 5,
  });
  const [actividadesPagination, setActividadesPagination] = useState({
    currentPage: 1,
    itemsPerPage: 5,
  });
  const [publicacionesPagination, setPublicacionesPagination] = useState({
    currentPage: 1,
    itemsPerPage: 5,
  });
  const [showIntegranteModal, setShowIntegranteModal] = useState(false);
  const [showTrabajoModal, setShowTrabajoModal] = useState(false);
  const [showActividadModal, setShowActividadModal] = useState(false);
  const [showPublicacionModal, setShowPublicacionModal] = useState(false);
  const [showPersonaDropdown, setShowPersonaDropdown] = useState(false);
  const [showIntegrantesSearchDropdown, setShowIntegrantesSearchDropdown] = useState(false);
  const [showTrabajosSearchDropdown, setShowTrabajosSearchDropdown] = useState(false);
  const [showActividadesSearchDropdown, setShowActividadesSearchDropdown] = useState(false);
  const [showPublicacionesSearchDropdown, setShowPublicacionesSearchDropdown] = useState(false);
  const [personaSearchTerm, setPersonaSearchTerm] = useState('');
  const [selectedPersonaId, setSelectedPersonaId] = useState('');
  const [horasSemanales, setHorasSemanales] = useState(40);
  const [newPersonaData, setNewPersonaData] = useState({
    nombre: '',
    apellido: '',
    correo: '',
    contrasena: '',
    horasSemanales: 40,
    tipoDePersonal: '',
    GrupoInvestigacion: null
  });
  const [newTrabajoData, setNewTrabajoData] = useState({
    ciudad: '',
    fechaInicio: new Date().toISOString().split('T')[0],
    nombreReunion: '',
    tituloTrabajo: '',
    GrupoInvestigacion: null
  });
  const [newActividadData, setNewActividadData] = useState({
    descripcion: '',
    fechaInicio: new Date().toISOString().split('T')[0],
    fechaFin: new Date().toISOString().split('T')[0],
    nro: 0,
    presupuestoAsignado: 0,
    resultadosEsperados: '',
    LineaDeInvestigacion: null
  });
  const [grupos, setGrupos] = useState([]);
  const [personas, setPersonas] = useState([]);
  const [opcionesPerfil, setOpcionesPerfil] = useState(null);
  const [trabajosDisponibles, setTrabajosDisponibles] = useState([]);
  const [actividadesDisponibles, setActividadesDisponibles] = useState([]);
  const [lineasInvestigacion, setLineasInvestigacion] = useState([]);
  const [publicacionesDisponibles, setPublicacionesDisponibles] = useState([]);
  const [newPublicacionData, setNewPublicacionData] = useState({
    titulo: '',
    ISSN: '',
    editorial: '',
    nombreRevista: '',
    pais: '',
    estado: 'Publicado',
    tipoTrabajoPublicado: null,
    Autor: null,
    GrupoInvestigacion: null
  });
  const [formData, setFormData] = useState({
    ano: new Date().getFullYear().toString(),
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
    { id: 'general', label: 'General e Integrantes' },
    { id: 'trabajos', label: 'Trabajos' },
    { id: 'actividades', label: 'Actividades' },
    { id: 'publicaciones', label: 'Publicaciones' },
    { id: 'patentes', label: 'Patentes' },
    { id: 'proyectos', label: 'Proyectos' },
  ];

  // Cargar datos al montar el componente
  useEffect(() => {
    loadMemoriaData();
    loadGrupos();
    loadPersonas();
    loadOpcionesPerfil();
    loadTrabajosDisponibles();
    loadActividadesDisponibles();
    loadLineasInvestigacion();
    loadPublicacionesDisponibles();
  }, []);

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (integrantesSearchRef.current && !integrantesSearchRef.current.contains(event.target)) {
        setShowIntegrantesSearchDropdown(false);
      }
      if (trabajosSearchRef.current && !trabajosSearchRef.current.contains(event.target)) {
        setShowTrabajosSearchDropdown(false);
      }
      if (actividadesSearchRef.current && !actividadesSearchRef.current.contains(event.target)) {
        setShowActividadesSearchDropdown(false);
      }
      if (publicacionesSearchRef.current && !publicacionesSearchRef.current.contains(event.target)) {
        setShowPublicacionesSearchDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Función para cargar grupos
  const loadGrupos = async () => {
    try {
      const gruposData = await obtenerGrupos();
      setGrupos(gruposData);
    } catch (error) {
      console.error('Error cargando grupos:', error);
    }
  };

  // Función para cargar personas
  const loadPersonas = async () => {
    try {
      const personasData = await obtenerPersonas();
      console.log('Personas recibidas:', personasData);
      console.log('Directores:', personasData.filter(p => p.tipoDePersonalNombre && p.tipoDePersonalNombre.toLowerCase() === 'director'));
      console.log('Vicedirectores:', personasData.filter(p => p.tipoDePersonalNombre && p.tipoDePersonalNombre.toLowerCase() === 'vicedirector'));
      setPersonas(personasData);
    } catch (error) {
      console.error('Error cargando personas:', error);
    }
  };

  // Función para cargar opciones de perfil
  const loadOpcionesPerfil = async () => {
    try {
      const opciones = await obtenerOpcionesPerfil();
      console.log('Opciones de perfil:', opciones);
      setOpcionesPerfil(opciones);
    } catch (error) {
      console.error('Error cargando opciones de perfil:', error);
    }
  };

  // Función para cargar trabajos presentados
  const loadTrabajosDisponibles = async () => {
    try {
      const trabajosData = await listarTrabajosPresentados();
      console.log('Trabajos recibidos:', trabajosData);
      const trabajosArr = Array.isArray(trabajosData) ? trabajosData : [];
      setTrabajosDisponibles(trabajosArr);
    } catch (error) {
      console.error('Error cargando trabajos:', error);
    }
  };

  // Función para cargar actividades
  const loadActividadesDisponibles = async () => {
    try {
      const actividadesData = await listarActividades();
      console.log('Actividades recibidas:', actividadesData);
      const actividadesArr = Array.isArray(actividadesData) ? actividadesData : [];
      setActividadesDisponibles(actividadesArr);
    } catch (error) {
      console.error('Error cargando actividades:', error);
    }
  };

  // Función para cargar líneas de investigación
  const loadLineasInvestigacion = async () => {
    try {
      const lineasData = await listarLineasInvestigacion();
      console.log('Líneas de investigación recibidas:', lineasData);
      const lineasArr = Array.isArray(lineasData) ? lineasData : [];
      setLineasInvestigacion(lineasArr);
    } catch (error) {
      console.error('Error cargando líneas de investigación:', error);
    }
  };

  // Función para cargar publicaciones disponibles
  const loadPublicacionesDisponibles = async () => {
    try {
      const publicacionesData = await listarTrabajosPublicados();
      console.log('Trabajos publicados recibidos:', publicacionesData);
      const publicacionesArr = Array.isArray(publicacionesData) ? publicacionesData : [];
      // Filtrar solo los que tienen estado 'Publicado'
      const publicados = publicacionesArr.filter(p => p.estado === 'Publicado');
      setPublicacionesDisponibles(publicados);
    } catch (error) {
      console.error('Error cargando publicaciones:', error);
    }
  };

  // Filtrar personas disponibles para integrantes (sin Director ni Vicedirector)
  const getPersonasDisponibles = () => {
    const disponibles = personas.filter(p => 
      p.tipoDePersonalNombre && 
      p.tipoDePersonalNombre.toLowerCase() !== 'director' && 
      p.tipoDePersonalNombre.toLowerCase() !== 'vicedirector'
    );
    console.log('Personas disponibles:', disponibles);
    return disponibles;
  };

  // Filtrar personas por término de búsqueda
  const getPersonasFiltradas = () => {
    const disponibles = getPersonasDisponibles();
    if (!personaSearchTerm.trim()) {
      console.log('Sin término de búsqueda, mostrando todas:', disponibles);
      return disponibles;
    }
    
    const term = personaSearchTerm.toLowerCase();
    const filtradas = disponibles.filter(p =>
      (p.nombre && p.nombre.toLowerCase().includes(term)) ||
      (p.apellido && p.apellido.toLowerCase().includes(term))
    );
    console.log('Personas filtradas:', filtradas);
    return filtradas;
  };

  // Seleccionar una persona del dropdown
  const handleSelectPersona = (persona) => {
    setPersonaSearchTerm(`${persona.nombre} ${persona.apellido}`);
    setSelectedPersonaId(persona.oidpersona);
    setShowPersonaDropdown(false);
  };

  // Seleccionar persona desde el buscador de la tabla
  const handleSelectPersonaFromSearch = async (persona) => {
    console.log('Seleccionando persona:', persona);
    
    // Verificar si ya existe en la lista
    const yaExiste = formData.integrantes.some(i => i.persona === persona.oidpersona);
    if (yaExiste) {
      alert('Esta persona ya está agregada como integrante');
      setSearchTerms({...searchTerms, integrantes: ''});
      setShowIntegrantesSearchDropdown(false);
      return;
    }
    
    // Si no hay memoria creada, solo agregar a la lista local
    if (!memoriaId) {
      const nuevoIntegrante = {
        persona: persona.oidpersona,
        persona_nombre: persona.nombre,
        persona_apellido: persona.apellido,
        rol: persona.tipoDePersonalNombre,
        horasSemanales: 40,
        temp: true // Marcador temporal
      };
      
      setFormData(prev => ({
        ...prev,
        integrantes: [...prev.integrantes, nuevoIntegrante]
      }));
      
      setSearchTerms({...searchTerms, integrantes: ''});
      setShowIntegrantesSearchDropdown(false);
      return;
    }

    const nuevoIntegrante = {
      MemoriaAnual: memoriaId,
      persona: persona.oidpersona,
      horasSemanales: 40
    };

    console.log('Enviando integrante:', nuevoIntegrante);

    try {
      const res = await fetch(`${API_BASE_URL}/memorias-integrantes/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoIntegrante)
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error('Error del servidor:', errorText);
        alert('Error al agregar integrante: ' + errorText);
        return;
      }
      
      const data = await res.json();
      console.log('Respuesta del servidor:', data);
      
      await loadIntegrantes(memoriaId);
      setSearchTerms({...searchTerms, integrantes: ''});
      setShowIntegrantesSearchDropdown(false);
      console.log('Integrante agregado exitosamente');
    } catch (error) {
      console.error('Error agregando integrante:', error);
      alert('Error al agregar integrante: ' + error.message);
    }
  };

  // Función para cargar todos los datos de la memoria
  const loadMemoriaData = async () => {
    try {
      setLoading(true);
      
      // Primero obtenemos la memoria más reciente
      const memoriasRes = await fetch(`${API_BASE_URL}/memorias/`);
      const memorias = await memoriasRes.json();
      
      if (memorias.length > 0) {
        const currentMemoria = memorias[0]; // Tomar la primera memoria
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
        
        console.log('Memoria cargada:', currentMemoria);
      } else {
        console.log('No hay memorias creadas');
      }
    } catch (error) {
      console.error('Error cargando datos de memoria:', error);
    } finally {
      setLoading(false);
    }
  };

  // Función para guardar/crear la memoria anual
  const saveMemoriaData = async () => {
    const memoriaData = {
      anio: parseInt(formData.ano),
      GrupoInvestigacion: formData.grupo || null,
      director: formData.director || null,
      vicedirector: formData.vicedirector || null
    };

    try {
      if (memoriaId) {
        // Actualizar memoria existente
        const res = await fetch(`${API_BASE_URL}/memorias/${memoriaId}/`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(memoriaData)
        });
        
        if (res.ok) {
          const data = await res.json();
          console.log('Memoria actualizada:', data);
          alert('Memoria anual actualizada exitosamente');
        } else {
          const error = await res.text();
          console.error('Error actualizando memoria:', error);
          alert('Error al actualizar la memoria');
        }
      } else {
        // Crear nueva memoria
        const res = await fetch(`${API_BASE_URL}/memorias/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(memoriaData)
        });
        
        if (res.ok) {
          const data = await res.json();
          setMemoriaId(data.oidMemoriaAnual);
          console.log('Memoria creada:', data);
          alert('Memoria anual creada exitosamente');
        } else {
          const error = await res.text();
          console.error('Error creando memoria:', error);
          alert('Error al crear la memoria');
        }
      }
    } catch (error) {
      console.error('Error guardando memoria:', error);
      alert('Error al guardar la memoria: ' + error.message);
    }
  };

  const loadIntegrantes = async (memoriaId) => {
    console.log('Cargando integrantes para memoria:', memoriaId);
    const res = await fetch(`${API_BASE_URL}/memorias-integrantes/?memoria=${memoriaId}`);
    const data = await res.json();
    console.log('Integrantes cargados:', data);
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
  const handleAddIntegrante = () => {
    setShowIntegranteModal(true);
    setNewPersonaData({
      nombre: '',
      apellido: '',
      correo: '',
      contrasena: '',
      horasSemanales: 40,
      tipoDePersonal: '',
      GrupoInvestigacion: null
    });
  };

  const handleCreatePersona = async () => {
    // Validar campos requeridos
    if (!newPersonaData.nombre || !newPersonaData.apellido || !newPersonaData.correo || !newPersonaData.contrasena) {
      alert('Por favor completa todos los campos requeridos (nombre, apellido, correo, contraseña)');
      return;
    }

    try {
      // Crear la persona
      const personaCreada = await crearPersona(newPersonaData);
      console.log('Persona creada:', personaCreada);

      // Recargar la lista de personas
      await loadPersonas();

      // Agregar automáticamente como integrante
      if (!memoriaId) {
        // Si no hay memoria, agregar a la lista temporal
        const nuevoIntegrante = {
          persona: personaCreada.oidpersona,
          persona_nombre: personaCreada.nombre,
          persona_apellido: personaCreada.apellido,
          rol: personaCreada.tipoDePersonalNombre || 'Sin rol',
          horasSemanales: newPersonaData.horasSemanales,
          temp: true
        };
        setFormData(prev => ({
          ...prev,
          integrantes: [...prev.integrantes, nuevoIntegrante]
        }));
      } else {
        // Si hay memoria, guardar en el backend
        const response = await fetch(`${API_BASE_URL}/memorias-integrantes/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          },
          body: JSON.stringify({
            memoriaAnual: memoriaId,
            persona: personaCreada.oidpersona,
            rol: personaCreada.tipoDePersonalNombre || 'Sin rol',
            horasSemanales: newPersonaData.horasSemanales
          })
        });

        if (response.ok) {
          await loadMemoriaData();
        } else {
          throw new Error('Error al agregar integrante');
        }
      }

      // Cerrar modal y resetear
      setShowIntegranteModal(false);
      alert('Persona creada y agregada como integrante exitosamente');
    } catch (error) {
      console.error('Error creando persona:', error);
      alert('Error al crear la persona: ' + error.message);
    }
  };

  const handleSaveIntegrante = async () => {
    if (!memoriaId) {
      alert('Primero debes crear una memoria anual');
      return;
    }

    if (!selectedPersonaId) {
      alert('Debes seleccionar una persona');
      return;
    }

    const nuevoIntegrante = {
      MemoriaAnual: memoriaId,
      persona: selectedPersonaId,
      horasSemanales: horasSemanales
    };

    try {
      const res = await fetch(`${API_BASE_URL}/memorias-integrantes/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoIntegrante)
      });
      const data = await res.json();
      await loadIntegrantes(memoriaId);
      setShowIntegranteModal(false);
      console.log('Integrante agregado:', data);
    } catch (error) {
      console.error('Error agregando integrante:', error);
    }
  };

  const handleRemoveIntegrante = async (integrante) => {
    if (!window.confirm('¿Estás seguro de eliminar este integrante?')) return;

    // Si es temporal (no guardado aún), solo remover de la lista local
    if (integrante.temp || !memoriaId) {
      setFormData(prev => ({
        ...prev,
        integrantes: prev.integrantes.filter(i => i.persona !== integrante.persona)
      }));
      console.log('Integrante temporal eliminado');
      return;
    }

    // Si está guardado en el backend, eliminar vía API
    try {
      await fetch(`${API_BASE_URL}/memorias-integrantes/${integrante.oidIntegranteMemoria}/`, {
        method: 'DELETE'
      });
      await loadIntegrantes(memoriaId);
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
  const handleAddTrabajo = () => {
    setShowTrabajoModal(true);
    setNewTrabajoData({
      ciudad: '',
      fechaInicio: new Date().toISOString().split('T')[0],
      nombreReunion: '',
      tituloTrabajo: '',
      GrupoInvestigacion: formData.grupo || null
    });
  };

  const handleCreateTrabajo = async () => {
    // Validar campos requeridos
    if (!newTrabajoData.ciudad || !newTrabajoData.nombreReunion || !newTrabajoData.tituloTrabajo) {
      alert('Por favor completa todos los campos requeridos (ciudad, nombre reunión, título)');
      return;
    }

    try {
      // Crear el trabajo presentado
      const trabajoCreado = await crearTrabajoPresentado(newTrabajoData);
      console.log('Trabajo creado:', trabajoCreado);

      // Recargar la lista de trabajos disponibles
      await loadTrabajosDisponibles();

      // Agregar automáticamente a la lista local
      const nuevoTrabajo = {
        oidTrabajoPresentado: trabajoCreado.oidTrabajoPresentado,
        ciudad: trabajoCreado.ciudad,
        fechaInicio: trabajoCreado.fechaInicio,
        nombreReunion: trabajoCreado.nombreReunion,
        tituloTrabajo: trabajoCreado.tituloTrabajo,
        temp: true
      };
      
      setFormData(prev => ({
        ...prev,
        trabajos: [...prev.trabajos, nuevoTrabajo]
      }));

      // Cerrar modal y resetear
      setShowTrabajoModal(false);
      alert('Trabajo creado y agregado exitosamente');
    } catch (error) {
      console.error('Error creando trabajo:', error);
      alert('Error al crear el trabajo: ' + error.message);
    }
  };

  const handleRemoveTrabajo = async (index) => {
    const trabajo = formData.trabajos[index];
    
    // Si es temporal, solo eliminar de la lista local
    if (trabajo.temp) {
      setFormData(prev => ({
        ...prev,
        trabajos: prev.trabajos.filter((_, i) => i !== index)
      }));
      return;
    }

    // Si no es temporal, eliminar del backend
    if (!window.confirm('¿Estás seguro de eliminar este trabajo?')) return;

    try {
      await fetch(`${API_BASE_URL}/memorias-trabajos/${trabajo.oidTrabajoMemoria}/`, {
        method: 'DELETE'
      });
      setFormData(prev => ({
        ...prev,
        trabajos: prev.trabajos.filter((_, i) => i !== index)
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

  const handleAddActividad = () => {
    setShowActividadModal(true);
    setNewActividadData({
      descripcion: '',
      fechaInicio: new Date().toISOString().split('T')[0],
      fechaFin: new Date().toISOString().split('T')[0],
      nro: 0,
      presupuestoAsignado: 0,
      resultadosEsperados: '',
      LineaDeInvestigacion: null
    });
  };

  const handleCreateActividad = async () => {
    // Validar campos requeridos
    if (!newActividadData.descripcion || !newActividadData.fechaInicio || !newActividadData.LineaDeInvestigacion) {
      alert('Por favor completa los campos requeridos (descripción, fecha inicio, línea de investigación)');
      return;
    }

    try {
      // Crear la actividad
      const actividadCreada = await crearActividad(newActividadData);
      console.log('Actividad creada:', actividadCreada);

      // Recargar la lista de actividades disponibles
      await loadActividadesDisponibles();

      // Agregar automáticamente a la lista local
      const nuevaActividad = {
        oidActividad: actividadCreada.oidActividad,
        descripcion: actividadCreada.descripcion,
        fechaInicio: actividadCreada.fechaInicio,
        fechaFin: actividadCreada.fechaFin,
        temp: true
      };
      
      setFormData(prev => ({
        ...prev,
        actividades: [...prev.actividades, nuevaActividad]
      }));

      // Cerrar modal y resetear
      setShowActividadModal(false);
      alert('Actividad creada y agregada exitosamente');
    } catch (error) {
      console.error('Error creando actividad:', error);
      alert('Error al crear la actividad: ' + error.message);
    }
  };

  const handleCreatePublicacion = async () => {
    // Validar campos requeridos
    if (!newPublicacionData.titulo || !newPublicacionData.GrupoInvestigacion || !newPublicacionData.tipoTrabajoPublicado || !newPublicacionData.Autor) {
      alert('Por favor completa los campos requeridos (título, grupo, tipo de trabajo, autor)');
      return;
    }

    try {
      // Asegurar que estado sea 'Publicado'
      const dataToSend = {
        ...newPublicacionData,
        estado: 'Publicado'
      };

      // Crear la publicación
      const publicacionCreada = await crearTrabajoPublicado(dataToSend);
      console.log('Publicación creada:', publicacionCreada);

      // Recargar la lista de publicaciones disponibles
      await loadPublicacionesDisponibles();

      // Agregar automáticamente a la lista local
      const nuevaPublicacion = {
        oidTrabajoPublicado: publicacionCreada.oidTrabajoPublicado,
        titulo: publicacionCreada.titulo,
        nombreRevista: publicacionCreada.nombreRevista || '',
        temp: true
      };
      
      setFormData(prev => ({
        ...prev,
        publicaciones: [...prev.publicaciones, nuevaPublicacion]
      }));

      // Cerrar modal y resetear
      setShowPublicacionModal(false);
      setNewPublicacionData({
        titulo: '',
        ISSN: '',
        editorial: '',
        nombreRevista: '',
        pais: '',
        estado: 'Publicado',
        tipoTrabajoPublicado: null,
        Autor: null,
        GrupoInvestigacion: null
      });
      alert('Publicación creada y agregada exitosamente');
    } catch (error) {
      console.error('Error creando publicación:', error);
      alert('Error al crear la publicación: ' + error.message);
    }
  };

  const handleRemoveActividad = async (index) => {
    const actividad = formData.actividades[index];
    
    // Si es temporal, solo eliminar de la lista local
    if (actividad.temp) {
      setFormData(prev => ({
        ...prev,
        actividades: prev.actividades.filter((_, i) => i !== index)
      }));
      return;
    }

    // Si no es temporal, eliminar del backend
    if (!window.confirm('¿Estás seguro de eliminar esta actividad?')) return;

    try {
      await fetch(`${API_BASE_URL}/memorias-actividades/${actividad.oidActividadMemoria}/`, {
        method: 'DELETE'
      });
      setFormData(prev => ({
        ...prev,
        actividades: prev.actividades.filter((_, i) => i !== index)
      }));
      console.log('Actividad eliminada');
    } catch (error) {
      console.error('Error eliminando actividad:', error);
    }
  };

  const handleRemovePublicacion = async (index) => {
    const publicacion = formData.publicaciones[index];
    
    // Si es temporal, solo eliminar de la lista local
    if (publicacion.temp) {
      setFormData(prev => ({
        ...prev,
        publicaciones: prev.publicaciones.filter((_, i) => i !== index)
      }));
      return;
    }

    // Si no es temporal, eliminar del backend
    if (!window.confirm('¿Estás seguro de eliminar esta publicación?')) return;

    try {
      await fetch(`${API_BASE_URL}/memorias-publicaciones/${publicacion.oidPublicacionMemoria}/`, {
        method: 'DELETE'
      });
      setFormData(prev => ({
        ...prev,
        publicaciones: prev.publicaciones.filter((_, i) => i !== index)
      }));
      console.log('Publicación eliminada');
    } catch (error) {
      console.error('Error eliminando publicación:', error);
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

  // Funciones de filtrado para cada sección
  const filterIntegrantes = () => {
    if (!searchTerms.integrantes.trim()) return formData.integrantes;
    const term = searchTerms.integrantes.toLowerCase();
    return formData.integrantes.filter(integrante =>
      (integrante.persona_nombre && integrante.persona_nombre.toLowerCase().includes(term)) ||
      (integrante.persona_apellido && integrante.persona_apellido.toLowerCase().includes(term)) ||
      (integrante.rol && integrante.rol.toLowerCase().includes(term))
    );
  };

  // Seleccionar trabajo desde el buscador
  const handleSelectTrabajoFromSearch = (trabajo) => {
    console.log('Seleccionando trabajo:', trabajo);
    
    // Verificar si ya existe en la lista
    const yaExiste = formData.trabajos.some(t => 
      t.oidTrabajoPresentado === trabajo.oidTrabajoPresentado || t.id === trabajo.id
    );
    if (yaExiste) {
      alert('Este trabajo ya está agregado');
      setSearchTerms({...searchTerms, trabajos: ''});
      setShowTrabajosSearchDropdown(false);
      return;
    }
    
    // Agregar a la lista local
    const nuevoTrabajo = {
      oidTrabajoPresentado: trabajo.oidTrabajoPresentado || trabajo.id,
      ciudad: trabajo.ciudad || '',
      fechaInicio: trabajo.fechaInicio || '',
      nombreReunion: trabajo.nombreReunion || '',
      tituloTrabajo: trabajo.tituloTrabajo || '',
      temp: true
    };
    
    setFormData(prev => ({
      ...prev,
      trabajos: [...prev.trabajos, nuevoTrabajo]
    }));
    
    setSearchTerms({...searchTerms, trabajos: ''});
    setShowTrabajosSearchDropdown(false);
  };

  const getTrabajosDisponibles = () => {
    return trabajosDisponibles.filter(trabajo => {
      const yaAgregado = formData.trabajos.some(t => 
        t.oidTrabajoPresentado === trabajo.oidTrabajoPresentado || t.id === trabajo.id
      );
      return !yaAgregado;
    });
  };

  // Seleccionar actividad desde el buscador
  const handleSelectActividadFromSearch = (actividad) => {
    console.log('Seleccionando actividad:', actividad);
    
    // Verificar si ya existe en la lista
    const yaExiste = formData.actividades.some(a => 
      a.oidActividad === actividad.oidActividad || a.id === actividad.id
    );
    if (yaExiste) {
      alert('Esta actividad ya está agregada');
      setSearchTerms({...searchTerms, actividades: ''});
      setShowActividadesSearchDropdown(false);
      return;
    }
    
    // Agregar a la lista local
    const nuevaActividad = {
      oidActividad: actividad.oidActividad || actividad.id,
      descripcion: actividad.descripcion || '',
      fechaInicio: actividad.fechaInicio || '',
      fechaFin: actividad.fechaFin || '',
      temp: true
    };
    
    setFormData(prev => ({
      ...prev,
      actividades: [...prev.actividades, nuevaActividad]
    }));
    
    setSearchTerms({...searchTerms, actividades: ''});
    setShowActividadesSearchDropdown(false);
  };

  const getActividadesDisponibles = () => {
    return actividadesDisponibles.filter(actividad => {
      const yaAgregado = formData.actividades.some(a => 
        a.oidActividad === actividad.oidActividad || a.id === actividad.id
      );
      return !yaAgregado;
    });
  };

  // Seleccionar publicación desde el buscador
  const handleSelectPublicacionFromSearch = (publicacion) => {
    console.log('Seleccionando publicación:', publicacion);
    
    const yaExiste = formData.publicaciones.some(p => 
      p.oidTrabajoPublicado === publicacion.oidTrabajoPublicado || p.id === publicacion.id
    );
    if (yaExiste) {
      alert('Esta publicación ya está agregada');
      setSearchTerms({...searchTerms, publicaciones: ''});
      setShowPublicacionesSearchDropdown(false);
      return;
    }
    
    const nuevaPublicacion = {
      oidTrabajoPublicado: publicacion.oidTrabajoPublicado || publicacion.id,
      titulo: publicacion.titulo || '',
      anoPublicacion: publicacion.anoPublicacion || '',
      nombreRevista: publicacion.nombreRevista || '',
      temp: true
    };
    
    setFormData(prev => ({
      ...prev,
      publicaciones: [...prev.publicaciones, nuevaPublicacion]
    }));
    
    setSearchTerms({...searchTerms, publicaciones: ''});
    setShowPublicacionesSearchDropdown(false);
  };

  const getPublicacionesDisponibles = () => {
    return publicacionesDisponibles.filter(publicacion => {
      const yaAgregado = formData.publicaciones.some(p => 
        p.oidTrabajoPublicado === publicacion.oidTrabajoPublicado || p.id === publicacion.id
      );
      return !yaAgregado;
    });
  };

  const filterTrabajos = () => {
    if (!searchTerms.trabajos.trim()) return formData.trabajos;
    const term = searchTerms.trabajos.toLowerCase();
    return formData.trabajos.filter(trabajo =>
      (trabajo.ciudad && trabajo.ciudad.toLowerCase().includes(term)) ||
      (trabajo.nombreReunion && trabajo.nombreReunion.toLowerCase().includes(term)) ||
      (trabajo.tituloTrabajo && trabajo.tituloTrabajo.toLowerCase().includes(term))
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
      (publicacion.titulo && publicacion.titulo.toLowerCase().includes(term)) ||
      (publicacion.nombreRevista && publicacion.nombreRevista.toLowerCase().includes(term))
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
        <button 
          className="btn-add" 
          onClick={saveMemoriaData}
          style={{ 
            padding: '10px 20px',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          {memoriaId ? 'Actualizar Memoria Anual' : 'Guardar Memoria Anual'}
        </button>
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
              {/* Sección General */}
              <h3 style={{ marginBottom: '20px', color: '#333', borderBottom: '2px solid #e8d4f8', paddingBottom: '10px' }}>Información General</h3>
              <div className="form-section" style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                <div className="form-group" style={{ width: '150px' }}>
                  <label>Año</label>
                  <input
                    type="number"
                    value={formData.ano}
                    onChange={(e) => setFormData({ ...formData, ano: e.target.value })}
                  />
                </div>
                <div className="form-group" style={{ width: '250px' }}>
                  <label>Grupo</label>
                  <select value={formData.grupo} onChange={(e) => setFormData({ ...formData, grupo: e.target.value })}>
                    <option value="">Seleccionar grupo</option>
                    {grupos.map((grupo) => (
                      <option key={grupo.oidGrupoInvestigacion} value={grupo.oidGrupoInvestigacion}>
                        {grupo.sigla} - {grupo.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group" style={{ flex: 1, minWidth: '250px' }}>
                  <label>Director</label>
                  <select
                    value={formData.director}
                    onChange={(e) => setFormData({ ...formData, director: e.target.value })}
                  >
                    <option value="">Seleccionar Director</option>
                    {personas
                      .filter(p => p.tipoDePersonalNombre && p.tipoDePersonalNombre.toLowerCase() === 'director')
                      .map((persona) => (
                        <option key={persona.oidpersona} value={persona.oidpersona}>
                          {persona.nombre} {persona.apellido}
                        </option>
                      ))}
                  </select>
                </div>
                <div className="form-group" style={{ flex: 1, minWidth: '250px' }}>
                  <label>Vicedirector</label>
                  <select
                    value={formData.vicedirector}
                    onChange={(e) => setFormData({ ...formData, vicedirector: e.target.value })}
                  >
                    <option value="">Seleccionar Vicedirector</option>
                    {personas
                      .filter(p => p.tipoDePersonalNombre && p.tipoDePersonalNombre.toLowerCase() === 'vicedirector')
                      .map((persona) => (
                        <option key={persona.oidpersona} value={persona.oidpersona}>
                          {persona.nombre} {persona.apellido}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              {/* Sección Integrantes */}
              <div style={{ marginTop: '40px' }}>
                <h3 style={{ marginBottom: '20px', color: '#333', borderBottom: '2px solid #e8d4f8', paddingBottom: '10px' }}>Integrantes</h3>
                <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'stretch' }}>
                  <div ref={integrantesSearchRef} style={{ flex: 1, position: 'relative' }}>
                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: '4px', padding: '8px' }}>
                      <Search size={18} style={{ marginRight: '8px', color: '#666' }} />
                      <input
                        type="text"
                        placeholder="Buscar o agregar integrante..."
                        value={searchTerms.integrantes}
                        onChange={(e) => {
                          setSearchTerms({...searchTerms, integrantes: e.target.value});
                          setShowIntegrantesSearchDropdown(true);
                        }}
                        onFocus={() => setShowIntegrantesSearchDropdown(true)}
                        style={{ border: 'none', outline: 'none', flex: 1, fontSize: '14px' }}
                      />
                    </div>
                    {showIntegrantesSearchDropdown && searchTerms.integrantes.trim() === '' && (
                      <div style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        maxHeight: '280px',
                        overflowY: 'auto',
                        backgroundColor: '#fff',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        marginTop: '4px',
                        zIndex: 1000,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                      }}>
                        {getPersonasDisponibles().length > 0 ? (
                          getPersonasDisponibles().map((persona) => (
                            <div
                              key={persona.oidpersona}
                              onClick={() => handleSelectPersonaFromSearch(persona)}
                              style={{
                                padding: '10px',
                                cursor: 'pointer',
                                borderBottom: '1px solid #f0f0f0'
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
                              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fff'}
                            >
                              <div style={{ fontWeight: '500' }}>{persona.nombre} {persona.apellido}</div>
                              <div style={{ fontSize: '12px', color: '#666' }}>{persona.tipoDePersonalNombre || 'Sin tipo'}</div>
                            </div>
                          ))
                        ) : (
                          <div style={{ padding: '10px', color: '#999', textAlign: 'center' }}>
                            No hay personas disponibles
                          </div>
                        )}
                      </div>
                    )}
                    {showIntegrantesSearchDropdown && searchTerms.integrantes.trim() !== '' && (
                      <div style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        maxHeight: '280px',
                        overflowY: 'auto',
                        backgroundColor: '#fff',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        marginTop: '4px',
                        zIndex: 1000,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                      }}>
                        {(() => {
                          const term = searchTerms.integrantes.toLowerCase();
                          const filtradas = getPersonasDisponibles().filter(p =>
                            (p.nombre && p.nombre.toLowerCase().includes(term)) ||
                            (p.apellido && p.apellido.toLowerCase().includes(term))
                          );
                          return filtradas.length > 0 ? (
                            filtradas.map((persona) => (
                              <div
                                key={persona.oidpersona}
                                onClick={() => handleSelectPersonaFromSearch(persona)}
                                style={{
                                  padding: '10px',
                                  cursor: 'pointer',
                                  borderBottom: '1px solid #f0f0f0'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fff'}
                              >
                                <div style={{ fontWeight: '500' }}>{persona.nombre} {persona.apellido}</div>
                                <div style={{ fontSize: '12px', color: '#666' }}>{persona.tipoDePersonalNombre || 'Sin tipo'}</div>
                              </div>
                            ))
                          ) : (
                            <div style={{ padding: '10px', color: '#999', textAlign: 'center' }}>
                              No se encontraron personas
                            </div>
                          );
                        })()}
                      </div>
                    )}
                  </div>
                  <button className="btn-add" onClick={handleAddIntegrante} style={{ whiteSpace: 'nowrap' }}>
                    <Plus size={18} /> Crear Integrante
                  </button>
                </div>
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
                    {(() => {
                      const filteredIntegrantes = filterIntegrantes();
                      const { currentPage, itemsPerPage } = integrantesPagination;
                      const startIndex = (currentPage - 1) * itemsPerPage;
                      const endIndex = startIndex + itemsPerPage;
                      const paginatedIntegrantes = filteredIntegrantes.slice(startIndex, endIndex);
                      
                      return paginatedIntegrantes.length > 0 ? (
                        paginatedIntegrantes.map((integrante, index) => {
                        return (
                          <tr key={integrante.oidIntegranteMemoria}>
                            <td>{integrante.persona_nombre || 'N/A'}</td>
                            <td>{integrante.persona_apellido || 'N/A'}</td>
                            <td>{integrante.rol || 'N/A'}</td>
                            <td>{integrante.horasSemanales || 0}</td>
                            <td>
                              <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                <button 
                                  className="btn-delete" 
                                  onClick={() => handleRemoveIntegrante(integrante)}
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
                            <p>No se encontraron resultados para "{searchTerms.integrantes}"</p>
                          ) : (
                            <p>No hay integrantes registrados</p>
                          )}
                        </td>
                      </tr>
                    );
                    })()}
                  </tbody>
                </table>
                {(() => {
                  const filteredIntegrantes = filterIntegrantes();
                  const totalPages = Math.ceil(filteredIntegrantes.length / integrantesPagination.itemsPerPage);
                  
                  if (filteredIntegrantes.length <= integrantesPagination.itemsPerPage) return null;
                  
                  return (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginTop: '20px' }}>
                      <button
                        onClick={() => setIntegrantesPagination({ ...integrantesPagination, currentPage: integrantesPagination.currentPage - 1 })}
                        disabled={integrantesPagination.currentPage === 1}
                        style={{
                          padding: '8px 16px',
                          borderRadius: '4px',
                          border: '1px solid #ddd',
                          background: integrantesPagination.currentPage === 1 ? '#f5f5f5' : '#fff',
                          cursor: integrantesPagination.currentPage === 1 ? 'not-allowed' : 'pointer',
                          color: integrantesPagination.currentPage === 1 ? '#999' : '#333',
                        }}
                      >
                        Anterior
                      </button>
                      <span style={{ fontSize: '14px', color: '#666' }}>
                        Página {integrantesPagination.currentPage} de {totalPages}
                      </span>
                      <button
                        onClick={() => setIntegrantesPagination({ ...integrantesPagination, currentPage: integrantesPagination.currentPage + 1 })}
                        disabled={integrantesPagination.currentPage === totalPages}
                        style={{
                          padding: '8px 16px',
                          borderRadius: '4px',
                          border: '1px solid #ddd',
                          background: integrantesPagination.currentPage === totalPages ? '#f5f5f5' : '#fff',
                          cursor: integrantesPagination.currentPage === totalPages ? 'not-allowed' : 'pointer',
                          color: integrantesPagination.currentPage === totalPages ? '#999' : '#333',
                        }}
                      >
                        Siguiente
                      </button>
                    </div>
                  );
                })()}
              </div>
            </div>
          )}

          {activeTab === 'trabajos' && (
            <div className="tab-content">
              <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'stretch' }}>
                <div ref={trabajosSearchRef} style={{ flex: 1, position: 'relative' }}>
                  <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: '4px', padding: '8px' }}>
                    <Search size={18} style={{ marginRight: '8px', color: '#666' }} />
                    <input
                      type="text"
                      placeholder="Buscar o agregar trabajo..."
                      value={searchTerms.trabajos}
                      onChange={(e) => {
                        setSearchTerms({...searchTerms, trabajos: e.target.value});
                        setShowTrabajosSearchDropdown(true);
                      }}
                      onFocus={() => setShowTrabajosSearchDropdown(true)}
                      style={{ border: 'none', outline: 'none', flex: 1, fontSize: '14px' }}
                    />
                  </div>
                  {showTrabajosSearchDropdown && searchTerms.trabajos.trim() === '' && (
                    <div style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      right: 0,
                      maxHeight: '280px',
                      overflowY: 'auto',
                      backgroundColor: '#fff',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      marginTop: '4px',
                      zIndex: 1000,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}>
                      {getTrabajosDisponibles().length > 0 ? (
                        getTrabajosDisponibles().map((trabajo) => (
                          <div
                            key={trabajo.oidTrabajoPresentado || trabajo.id}
                            onClick={() => handleSelectTrabajoFromSearch(trabajo)}
                            style={{
                              padding: '10px',
                              cursor: 'pointer',
                              borderBottom: '1px solid #f0f0f0'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fff'}
                          >
                            <div style={{ fontWeight: '500' }}>{trabajo.tituloTrabajo}</div>
                            <div style={{ fontSize: '12px', color: '#666' }}>
                              {trabajo.ciudad} - {trabajo.nombreReunion}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div style={{ padding: '10px', color: '#999', textAlign: 'center' }}>
                          No hay trabajos disponibles
                        </div>
                      )}
                    </div>
                  )}
                  {showTrabajosSearchDropdown && searchTerms.trabajos.trim() !== '' && (
                    <div style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      right: 0,
                      maxHeight: '280px',
                      overflowY: 'auto',
                      backgroundColor: '#fff',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      marginTop: '4px',
                      zIndex: 1000,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}>
                      {(() => {
                        const term = searchTerms.trabajos.toLowerCase();
                        const filtrados = getTrabajosDisponibles().filter(t =>
                          (t.ciudad && t.ciudad.toLowerCase().includes(term)) ||
                          (t.nombreReunion && t.nombreReunion.toLowerCase().includes(term)) ||
                          (t.tituloTrabajo && t.tituloTrabajo.toLowerCase().includes(term))
                        );
                        return filtrados.length > 0 ? (
                          filtrados.map((trabajo) => (
                            <div
                              key={trabajo.oidTrabajoPresentado || trabajo.id}
                              onClick={() => handleSelectTrabajoFromSearch(trabajo)}
                              style={{
                                padding: '10px',
                                cursor: 'pointer',
                                borderBottom: '1px solid #f0f0f0'
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
                              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fff'}
                            >
                              <div style={{ fontWeight: '500' }}>{trabajo.tituloTrabajo}</div>
                              <div style={{ fontSize: '12px', color: '#666' }}>
                                {trabajo.ciudad} - {trabajo.nombreReunion}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div style={{ padding: '10px', color: '#999', textAlign: 'center' }}>
                            No se encontraron trabajos
                          </div>
                        );
                      })()}
                    </div>
                  )}
                </div>
                <button className="btn-add" onClick={handleAddTrabajo} style={{ whiteSpace: 'nowrap' }}>
                  <Plus size={18} /> Agregar Trabajo
                </button>
              </div>
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
                  {(() => {
                    const { currentPage, itemsPerPage } = trabajosPagination;
                    const startIndex = (currentPage - 1) * itemsPerPage;
                    const endIndex = startIndex + itemsPerPage;
                    const paginatedTrabajos = formData.trabajos.slice(startIndex, endIndex);
                    
                    return paginatedTrabajos.length > 0 ? (
                      paginatedTrabajos.map((trabajo, paginatedIndex) => {
                        const index = startIndex + paginatedIndex;
                        const trabajoId = trabajo.oidTrabajoPresentado || trabajo.id;
                        const fechaFormateada = trabajo.fechaInicio ? trabajo.fechaInicio.split('T')[0] : '';
                        return (
                          <tr key={trabajoId || index}>
                            <td>{trabajo.ciudad || '-'}</td>
                            <td>{fechaFormateada || '-'}</td>
                            <td>{trabajo.nombreReunion || '-'}</td>
                            <td>{trabajo.tituloTrabajo || '-'}</td>
                            <td>
                              <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
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
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>
                          <p>No hay trabajos agregados</p>
                        </td>
                      </tr>
                    );
                  })()}
                </tbody>
              </table>
              {formData.trabajos.length > trabajosPagination.itemsPerPage && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginTop: '20px' }}>
                  <button
                    onClick={() => setTrabajosPagination(prev => ({
                      ...prev,
                      currentPage: Math.max(1, prev.currentPage - 1)
                    }))}
                    disabled={trabajosPagination.currentPage === 1}
                    style={{
                      padding: '8px 16px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      backgroundColor: trabajosPagination.currentPage === 1 ? '#f5f5f5' : '#fff',
                      cursor: trabajosPagination.currentPage === 1 ? 'not-allowed' : 'pointer',
                      color: trabajosPagination.currentPage === 1 ? '#999' : '#333'
                    }}
                  >
                    Anterior
                  </button>
                  <span style={{ fontSize: '14px', color: '#666' }}>
                    Página {trabajosPagination.currentPage} de {Math.ceil(formData.trabajos.length / trabajosPagination.itemsPerPage)}
                  </span>
                  <button
                    onClick={() => setTrabajosPagination(prev => ({
                      ...prev,
                      currentPage: Math.min(
                        Math.ceil(formData.trabajos.length / prev.itemsPerPage),
                        prev.currentPage + 1
                      )
                    }))}
                    disabled={trabajosPagination.currentPage >= Math.ceil(formData.trabajos.length / trabajosPagination.itemsPerPage)}
                    style={{
                      padding: '8px 16px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      backgroundColor: trabajosPagination.currentPage >= Math.ceil(formData.trabajos.length / trabajosPagination.itemsPerPage) ? '#f5f5f5' : '#fff',
                      cursor: trabajosPagination.currentPage >= Math.ceil(formData.trabajos.length / trabajosPagination.itemsPerPage) ? 'not-allowed' : 'pointer',
                      color: trabajosPagination.currentPage >= Math.ceil(formData.trabajos.length / trabajosPagination.itemsPerPage) ? '#999' : '#333'
                    }}
                  >
                    Siguiente
                  </button>
                </div>
              )}
            </div>
          )}

        {activeTab === 'actividades' && (
          <div className="tab-content">
            <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'stretch' }}>
              <div ref={actividadesSearchRef} style={{ flex: 1, position: 'relative' }}>
                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: '4px', padding: '8px' }}>
                  <Search size={18} style={{ marginRight: '8px', color: '#666' }} />
                  <input
                    type="text"
                    placeholder="Buscar o agregar actividad..."
                    value={searchTerms.actividades}
                    onChange={(e) => {
                      setSearchTerms({...searchTerms, actividades: e.target.value});
                      setShowActividadesSearchDropdown(true);
                    }}
                    onFocus={() => setShowActividadesSearchDropdown(true)}
                    style={{ border: 'none', outline: 'none', flex: 1, fontSize: '14px' }}
                  />
                </div>
                {showActividadesSearchDropdown && searchTerms.actividades.trim() === '' && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    maxHeight: '280px',
                    overflowY: 'auto',
                    backgroundColor: '#fff',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    marginTop: '4px',
                    zIndex: 1000,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}>
                    {getActividadesDisponibles().length > 0 ? (
                      getActividadesDisponibles().map((actividad) => (
                        <div
                          key={actividad.oidActividad || actividad.id}
                          onClick={() => handleSelectActividadFromSearch(actividad)}
                          style={{
                            padding: '10px',
                            cursor: 'pointer',
                            borderBottom: '1px solid #f0f0f0'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fff'}
                        >
                          <div style={{ fontWeight: '500' }}>{actividad.descripcion}</div>
                          <div style={{ fontSize: '12px', color: '#666' }}>
                            {actividad.fechaInicio} - {actividad.fechaFin}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div style={{ padding: '10px', color: '#999', textAlign: 'center' }}>
                        No hay actividades disponibles
                      </div>
                    )}
                  </div>
                )}
                {showActividadesSearchDropdown && searchTerms.actividades.trim() !== '' && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    maxHeight: '280px',
                    overflowY: 'auto',
                    backgroundColor: '#fff',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    marginTop: '4px',
                    zIndex: 1000,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}>
                    {(() => {
                      const term = searchTerms.actividades.toLowerCase();
                      const filtrados = getActividadesDisponibles().filter(a =>
                        (a.descripcion && a.descripcion.toLowerCase().includes(term))
                      );
                      return filtrados.length > 0 ? (
                        filtrados.map((actividad) => (
                          <div
                            key={actividad.oidActividad || actividad.id}
                            onClick={() => handleSelectActividadFromSearch(actividad)}
                            style={{
                              padding: '10px',
                              cursor: 'pointer',
                              borderBottom: '1px solid #f0f0f0'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fff'}
                          >
                            <div style={{ fontWeight: '500' }}>{actividad.descripcion}</div>
                            <div style={{ fontSize: '12px', color: '#666' }}>
                              {actividad.fechaInicio} - {actividad.fechaFin}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div style={{ padding: '10px', color: '#999', textAlign: 'center' }}>
                          No se encontraron actividades
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>
              <button className="btn-add" onClick={handleAddActividad} style={{ whiteSpace: 'nowrap' }}>
                <Plus size={18} /> Agregar Actividad
              </button>
            </div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Descripción</th>
                  <th>Fecha Inicio</th>
                  <th>Fecha Fin</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {(() => {
                  const { currentPage, itemsPerPage } = actividadesPagination;
                  const startIndex = (currentPage - 1) * itemsPerPage;
                  const endIndex = startIndex + itemsPerPage;
                  const paginatedActividades = formData.actividades.slice(startIndex, endIndex);
                  
                  return paginatedActividades.length > 0 ? (
                    paginatedActividades.map((actividad, paginatedIndex) => {
                      const index = startIndex + paginatedIndex;
                      const actividadId = actividad.oidActividad || actividad.id;
                      const fechaInicio = actividad.fechaInicio ? actividad.fechaInicio.split('T')[0] : '-';
                      const fechaFin = actividad.fechaFin ? actividad.fechaFin.split('T')[0] : '-';
                      return (
                        <tr key={actividadId || index}>
                          <td>{actividad.descripcion || '-'}</td>
                          <td>{fechaInicio}</td>
                          <td>{fechaFin}</td>
                          <td>
                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                              <button 
                                className="btn-delete" 
                                onClick={() => handleRemoveActividad(index)}
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
                        <p>No hay actividades agregadas</p>
                      </td>
                    </tr>
                  );
                })()}
              </tbody>
            </table>
            {formData.actividades.length > actividadesPagination.itemsPerPage && (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginTop: '20px' }}>
                <button
                  onClick={() => setActividadesPagination(prev => ({
                    ...prev,
                    currentPage: Math.max(1, prev.currentPage - 1)
                  }))}
                  disabled={actividadesPagination.currentPage === 1}
                  style={{
                    padding: '8px 16px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    backgroundColor: actividadesPagination.currentPage === 1 ? '#f5f5f5' : '#fff',
                    cursor: actividadesPagination.currentPage === 1 ? 'not-allowed' : 'pointer',
                    color: actividadesPagination.currentPage === 1 ? '#999' : '#333'
                  }}
                >
                  Anterior
                </button>
                <span style={{ fontSize: '14px', color: '#666' }}>
                  Página {actividadesPagination.currentPage} de {Math.ceil(formData.actividades.length / actividadesPagination.itemsPerPage)}
                </span>
                <button
                  onClick={() => setActividadesPagination(prev => ({
                    ...prev,
                    currentPage: Math.min(
                      Math.ceil(formData.actividades.length / prev.itemsPerPage),
                      prev.currentPage + 1
                    )
                  }))}
                  disabled={actividadesPagination.currentPage >= Math.ceil(formData.actividades.length / actividadesPagination.itemsPerPage)}
                  style={{
                    padding: '8px 16px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    backgroundColor: actividadesPagination.currentPage >= Math.ceil(formData.actividades.length / actividadesPagination.itemsPerPage) ? '#f5f5f5' : '#fff',
                    cursor: actividadesPagination.currentPage >= Math.ceil(formData.actividades.length / actividadesPagination.itemsPerPage) ? 'not-allowed' : 'pointer',
                    color: actividadesPagination.currentPage >= Math.ceil(formData.actividades.length / actividadesPagination.itemsPerPage) ? '#999' : '#333'
                  }}
                >
                  Siguiente
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'publicaciones' && (
          <div className="tab-content">
            <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'stretch' }}>
              <div ref={publicacionesSearchRef} style={{ flex: 1, position: 'relative' }}>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: '4px', padding: '8px' }}>
                  <Search size={18} style={{ marginRight: '8px', color: '#666' }} />
                  <input
                    type="text"
                    placeholder="Buscar publicación por título o revista..."
                    value={searchTerms.publicaciones}
                    onChange={(e) => {
                      setSearchTerms({...searchTerms, publicaciones: e.target.value});
                      setShowPublicacionesSearchDropdown(e.target.value.trim().length > 0);
                    }}
                    onFocus={() => searchTerms.publicaciones.trim() && setShowPublicacionesSearchDropdown(true)}
                    style={{ border: 'none', outline: 'none', flex: 1, fontSize: '14px' }}
                  />
                </div>
                {showPublicacionesSearchDropdown && searchTerms.publicaciones.trim() && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    maxHeight: '280px',
                    overflowY: 'auto',
                    backgroundColor: '#fff',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    marginTop: '4px',
                    zIndex: 1000,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}>
                    {(() => {
                      const term = searchTerms.publicaciones.toLowerCase();
                      const filtrados = getPublicacionesDisponibles().filter(p =>
                        (p.titulo && p.titulo.toLowerCase().includes(term)) ||
                        (p.nombreRevista && p.nombreRevista.toLowerCase().includes(term))
                      );
                      return filtrados.length > 0 ? (
                        filtrados.map((publicacion) => (
                          <div
                            key={publicacion.oidTrabajoPublicado || publicacion.id}
                            onClick={() => handleSelectPublicacionFromSearch(publicacion)}
                            style={{
                              padding: '10px',
                              cursor: 'pointer',
                              borderBottom: '1px solid #f0f0f0'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fff'}
                          >
                            <div style={{ fontWeight: '500' }}>{publicacion.titulo}</div>
                            <div style={{ fontSize: '12px', color: '#666' }}>
                              {publicacion.nombreRevista || 'Sin revista'}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div style={{ padding: '10px', color: '#999', textAlign: 'center' }}>
                          No se encontraron publicaciones
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>
              <button className="btn-add" onClick={() => setShowPublicacionModal(true)} style={{ whiteSpace: 'nowrap' }}>
                <Plus size={18} /> Agregar Publicación
              </button>
            </div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Título</th>
                  <th>Revista</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {(() => {
                  const { currentPage, itemsPerPage } = publicacionesPagination;
                  const startIndex = (currentPage - 1) * itemsPerPage;
                  const endIndex = startIndex + itemsPerPage;
                  const filteredPublicaciones = filterPublicaciones();
                  const paginatedPublicaciones = filteredPublicaciones.slice(startIndex, endIndex);
                  
                  return paginatedPublicaciones.length > 0 ? (
                    paginatedPublicaciones.map((publicacion, paginatedIndex) => {
                      const originalIndex = formData.publicaciones.indexOf(publicacion);
                      const publicacionId = publicacion.oidTrabajoPublicado || publicacion.id;
                      return (
                        <tr key={publicacionId || originalIndex}>
                          <td>{publicacion.titulo || '-'}</td>
                          <td>{publicacion.nombreRevista || '-'}</td>
                          <td>
                            <button
                              type="button"
                              className="btn-delete"
                              onClick={() => handleRemovePublicacion(originalIndex)}
                              title="Eliminar"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="3" style={{ textAlign: 'center', padding: '20px' }}>
                        {searchTerms.publicaciones.trim() ? (
                          `No se encontraron resultados para "${searchTerms.publicaciones}"`
                        ) : (
                          'No hay publicaciones agregadas'
                        )}
                      </td>
                    </tr>
                  );
                })()}
              </tbody>
            </table>
            {(() => {
              const filteredPublicaciones = filterPublicaciones();
              return filteredPublicaciones.length > publicacionesPagination.itemsPerPage && (
                <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
                  <button
                    className="btn-pagination"
                    onClick={() => setPublicacionesPagination(prev => ({
                      ...prev,
                      currentPage: Math.max(1, prev.currentPage - 1)
                    }))}
                    disabled={publicacionesPagination.currentPage === 1}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: publicacionesPagination.currentPage === 1 ? '#ccc' : '#c49acc',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: publicacionesPagination.currentPage === 1 ? 'not-allowed' : 'pointer'
                    }}
                  >
                    Anterior
                  </button>
                  <span style={{ padding: '8px 16px', display: 'flex', alignItems: 'center' }}>
                    Página {publicacionesPagination.currentPage} de {Math.ceil(filteredPublicaciones.length / publicacionesPagination.itemsPerPage)}
                  </span>
                  <button
                    className="btn-pagination"
                    onClick={() => setPublicacionesPagination(prev => ({
                      ...prev,
                      currentPage: Math.min(Math.ceil(filteredPublicaciones.length / prev.itemsPerPage), prev.currentPage + 1)
                    }))}
                    disabled={publicacionesPagination.currentPage >= Math.ceil(filteredPublicaciones.length / publicacionesPagination.itemsPerPage)}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: publicacionesPagination.currentPage >= Math.ceil(filteredPublicaciones.length / publicacionesPagination.itemsPerPage) ? '#ccc' : '#c49acc',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: publicacionesPagination.currentPage >= Math.ceil(filteredPublicaciones.length / publicacionesPagination.itemsPerPage) ? 'not-allowed' : 'pointer'
                    }}
                  >
                    Siguiente
                  </button>
                </div>
              );
            })()}
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

        {/* Modal para agregar integrante */}
        {showIntegranteModal && (
          <div className="field-modal-overlay" onClick={() => setShowIntegranteModal(false)}>
            <div className="field-modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
              <div className="field-modal-header">
                <h3>Crear Integrante</h3>
                <button className="field-modal-close" onClick={() => setShowIntegranteModal(false)}>×</button>
              </div>
              <div className="field-modal-body">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label>Nombre *</label>
                    <input
                      type="text"
                      value={newPersonaData.nombre}
                      onChange={(e) => setNewPersonaData({...newPersonaData, nombre: e.target.value})}
                      placeholder="Nombre"
                      style={{ width: '100%', padding: '8px', fontSize: '14px' }}
                    />
                  </div>
                  <div className="form-group">
                    <label>Apellido *</label>
                    <input
                      type="text"
                      value={newPersonaData.apellido}
                      onChange={(e) => setNewPersonaData({...newPersonaData, apellido: e.target.value})}
                      placeholder="Apellido"
                      style={{ width: '100%', padding: '8px', fontSize: '14px' }}
                    />
                  </div>
                  <div className="form-group">
                    <label>Correo *</label>
                    <input
                      type="email"
                      value={newPersonaData.correo}
                      onChange={(e) => setNewPersonaData({...newPersonaData, correo: e.target.value})}
                      placeholder="correo@ejemplo.com"
                      style={{ width: '100%', padding: '8px', fontSize: '14px' }}
                    />
                  </div>
                  <div className="form-group">
                    <label>Contraseña *</label>
                    <input
                      type="password"
                      value={newPersonaData.contrasena}
                      onChange={(e) => setNewPersonaData({...newPersonaData, contrasena: e.target.value})}
                      placeholder="Contraseña"
                      style={{ width: '100%', padding: '8px', fontSize: '14px' }}
                    />
                  </div>
                  <div className="form-group">
                    <label>Horas Semanales</label>
                    <input
                      type="number"
                      value={newPersonaData.horasSemanales}
                      onChange={(e) => setNewPersonaData({...newPersonaData, horasSemanales: parseInt(e.target.value) || 0})}
                      min="1"
                      max="40"
                      style={{ width: '100%', padding: '8px', fontSize: '14px' }}
                    />
                  </div>
                  <div className="form-group">
                    <label>Tipo de Personal</label>
                    <select
                      value={newPersonaData.tipoDePersonal}
                      onChange={(e) => setNewPersonaData({...newPersonaData, tipoDePersonal: e.target.value})}
                      style={{ width: '100%', padding: '8px', fontSize: '14px' }}
                    >
                      <option value="">Seleccionar tipo</option>
                      {opcionesPerfil && opcionesPerfil.tiposPersonal && opcionesPerfil.tiposPersonal.map(tipo => (
                        <option key={tipo.id} value={tipo.id}>{tipo.nombre}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label>Grupo de Investigación</label>
                    <select
                      value={newPersonaData.GrupoInvestigacion || ''}
                      onChange={(e) => setNewPersonaData({...newPersonaData, GrupoInvestigacion: e.target.value ? parseInt(e.target.value) : null})}
                      style={{ width: '100%', padding: '8px', fontSize: '14px' }}
                    >
                      <option value="">Sin grupo</option>
                      {grupos.map(grupo => (
                        <option key={grupo.oidGrupoInvestigacion} value={grupo.oidGrupoInvestigacion}>
                          {grupo.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="field-modal-footer">
                <button className="btn-cancel" onClick={() => setShowIntegranteModal(false)}>Cancelar</button>
                <button className="btn-save" onClick={handleCreatePersona}>Crear y Agregar</button>
              </div>
            </div>
          </div>
        )}

        {/* Modal para agregar trabajo */}
        {showTrabajoModal && (
          <div className="field-modal-overlay" onClick={() => setShowTrabajoModal(false)}>
            <div className="field-modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
              <div className="field-modal-header">
                <h3>Crear Trabajo Presentado</h3>
                <button className="field-modal-close" onClick={() => setShowTrabajoModal(false)}>×</button>
              </div>
              <div className="field-modal-body">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label>Ciudad *</label>
                    <input
                      type="text"
                      value={newTrabajoData.ciudad}
                      onChange={(e) => setNewTrabajoData({...newTrabajoData, ciudad: e.target.value})}
                      placeholder="Ciudad"
                      style={{ width: '100%', padding: '8px', fontSize: '14px' }}
                    />
                  </div>
                  <div className="form-group">
                    <label>Fecha de Inicio *</label>
                    <input
                      type="date"
                      value={newTrabajoData.fechaInicio}
                      onChange={(e) => setNewTrabajoData({...newTrabajoData, fechaInicio: e.target.value})}
                      style={{ width: '100%', padding: '8px', fontSize: '14px' }}
                    />
                  </div>
                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label>Nombre de la Reunión *</label>
                    <input
                      type="text"
                      value={newTrabajoData.nombreReunion}
                      onChange={(e) => setNewTrabajoData({...newTrabajoData, nombreReunion: e.target.value})}
                      placeholder="Nombre de la reunión"
                      style={{ width: '100%', padding: '8px', fontSize: '14px' }}
                    />
                  </div>
                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label>Título del Trabajo *</label>
                    <input
                      type="text"
                      value={newTrabajoData.tituloTrabajo}
                      onChange={(e) => setNewTrabajoData({...newTrabajoData, tituloTrabajo: e.target.value})}
                      placeholder="Título del trabajo"
                      style={{ width: '100%', padding: '8px', fontSize: '14px' }}
                    />
                  </div>
                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label>Grupo de Investigación *</label>
                    <select
                      value={newTrabajoData.GrupoInvestigacion || ''}
                      onChange={(e) => setNewTrabajoData({...newTrabajoData, GrupoInvestigacion: e.target.value ? parseInt(e.target.value) : null})}
                      style={{ width: '100%', padding: '8px', fontSize: '14px' }}
                    >
                      <option value="">Seleccionar grupo</option>
                      {grupos.map(grupo => (
                        <option key={grupo.oidGrupoInvestigacion} value={grupo.oidGrupoInvestigacion}>
                          {grupo.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="field-modal-footer">
                <button className="btn-cancel" onClick={() => setShowTrabajoModal(false)}>Cancelar</button>
                <button className="btn-save" onClick={handleCreateTrabajo}>Crear y Agregar</button>
              </div>
            </div>
          </div>
        )}

        {/* Modal para agregar actividad */}
        {showActividadModal && (
          <div className="field-modal-overlay" onClick={() => setShowActividadModal(false)}>
            <div className="field-modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
              <div className="field-modal-header">
                <h3>Crear Actividad</h3>
                <button className="field-modal-close" onClick={() => setShowActividadModal(false)}>×</button>
              </div>
              <div className="field-modal-body">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label>Descripción *</label>
                    <textarea
                      value={newActividadData.descripcion}
                      onChange={(e) => setNewActividadData({...newActividadData, descripcion: e.target.value})}
                      placeholder="Descripción de la actividad"
                      rows="3"
                      style={{ width: '100%', padding: '8px', fontSize: '14px', resize: 'vertical' }}
                    />
                  </div>
                  <div className="form-group">
                    <label>Fecha de Inicio *</label>
                    <input
                      type="date"
                      value={newActividadData.fechaInicio}
                      onChange={(e) => setNewActividadData({...newActividadData, fechaInicio: e.target.value})}
                      style={{ width: '100%', padding: '8px', fontSize: '14px' }}
                    />
                  </div>
                  <div className="form-group">
                    <label>Fecha de Fin</label>
                    <input
                      type="date"
                      value={newActividadData.fechaFin}
                      onChange={(e) => setNewActividadData({...newActividadData, fechaFin: e.target.value})}
                      style={{ width: '100%', padding: '8px', fontSize: '14px' }}
                    />
                  </div>
                  <div className="form-group">
                    <label>Número</label>
                    <input
                      type="number"
                      value={newActividadData.nro}
                      onChange={(e) => setNewActividadData({...newActividadData, nro: parseInt(e.target.value) || 0})}
                      style={{ width: '100%', padding: '8px', fontSize: '14px' }}
                    />
                  </div>
                  <div className="form-group">
                    <label>Presupuesto Asignado</label>
                    <input
                      type="number"
                      step="0.01"
                      value={newActividadData.presupuestoAsignado}
                      onChange={(e) => setNewActividadData({...newActividadData, presupuestoAsignado: parseFloat(e.target.value) || 0})}
                      style={{ width: '100%', padding: '8px', fontSize: '14px' }}
                    />
                  </div>
                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label>Resultados Esperados</label>
                    <textarea
                      value={newActividadData.resultadosEsperados}
                      onChange={(e) => setNewActividadData({...newActividadData, resultadosEsperados: e.target.value})}
                      placeholder="Resultados esperados"
                      rows="2"
                      style={{ width: '100%', padding: '8px', fontSize: '14px', resize: 'vertical' }}
                    />
                  </div>
                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label>Línea de Investigación *</label>
                    <select
                      value={newActividadData.LineaDeInvestigacion || ''}
                      onChange={(e) => setNewActividadData({...newActividadData, LineaDeInvestigacion: e.target.value ? parseInt(e.target.value) : null})}
                      style={{ width: '100%', padding: '8px', fontSize: '14px' }}
                    >
                      <option value="">Seleccionar línea de investigación</option>
                      {lineasInvestigacion.map(linea => (
                        <option key={linea.oidLineaDeInvestigacion} value={linea.oidLineaDeInvestigacion}>
                          {linea.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="field-modal-footer">
                <button className="btn-cancel" onClick={() => setShowActividadModal(false)}>Cancelar</button>
                <button className="btn-save" onClick={handleCreateActividad}>Crear y Agregar</button>
              </div>
            </div>
          </div>
        )}

        {showPublicacionModal && (
          <div className="field-modal-overlay" onClick={() => setShowPublicacionModal(false)}>
            <div className="field-modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
              <div className="field-modal-header">
                <h3>Crear Publicación</h3>
                <button className="field-modal-close" onClick={() => setShowPublicacionModal(false)}>×</button>
              </div>
              <div className="field-modal-body">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label>Título *</label>
                    <input
                      type="text"
                      value={newPublicacionData.titulo}
                      onChange={(e) => setNewPublicacionData({...newPublicacionData, titulo: e.target.value})}
                      placeholder="Título de la publicación"
                      style={{ width: '100%', padding: '8px', fontSize: '14px' }}
                    />
                  </div>
                  <div className="form-group">
                    <label>ISSN</label>
                    <input
                      type="text"
                      value={newPublicacionData.ISSN}
                      onChange={(e) => setNewPublicacionData({...newPublicacionData, ISSN: e.target.value})}
                      placeholder="ISSN"
                      maxLength="55"
                      style={{ width: '100%', padding: '8px', fontSize: '14px' }}
                    />
                  </div>
                  <div className="form-group">
                    <label>Editorial</label>
                    <input
                      type="text"
                      value={newPublicacionData.editorial}
                      onChange={(e) => setNewPublicacionData({...newPublicacionData, editorial: e.target.value})}
                      placeholder="Nombre de la editorial"
                      maxLength="255"
                      style={{ width: '100%', padding: '8px', fontSize: '14px' }}
                    />
                  </div>
                  <div className="form-group">
                    <label>Nombre de Revista</label>
                    <input
                      type="text"
                      value={newPublicacionData.nombreRevista}
                      onChange={(e) => setNewPublicacionData({...newPublicacionData, nombreRevista: e.target.value})}
                      placeholder="Nombre de la revista"
                      maxLength="255"
                      style={{ width: '100%', padding: '8px', fontSize: '14px' }}
                    />
                  </div>
                  <div className="form-group">
                    <label>País</label>
                    <input
                      type="text"
                      value={newPublicacionData.pais}
                      onChange={(e) => setNewPublicacionData({...newPublicacionData, pais: e.target.value})}
                      placeholder="País de publicación"
                      maxLength="255"
                      style={{ width: '100%', padding: '8px', fontSize: '14px' }}
                    />
                  </div>
                  <div className="form-group">
                    <label>Tipo de Trabajo Publicado *</label>
                    <select
                      value={newPublicacionData.tipoTrabajoPublicado || ''}
                      onChange={(e) => setNewPublicacionData({...newPublicacionData, tipoTrabajoPublicado: e.target.value ? parseInt(e.target.value) : null})}
                      style={{ width: '100%', padding: '8px', fontSize: '14px' }}
                    >
                      <option value="">Seleccionar tipo</option>
                      {opcionesPerfil?.tiposTrabajoPublicado?.map(tipo => (
                        <option key={tipo.oidTipoDeTrabajoPublicado} value={tipo.oidTipoDeTrabajoPublicado}>
                          {tipo.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Autor *</label>
                    <select
                      value={newPublicacionData.Autor || ''}
                      onChange={(e) => setNewPublicacionData({...newPublicacionData, Autor: e.target.value ? parseInt(e.target.value) : null})}
                      style={{ width: '100%', padding: '8px', fontSize: '14px' }}
                    >
                      <option value="">Seleccionar autor</option>
                      {opcionesPerfil?.autores?.map(autor => (
                        <option key={autor.oidAutor} value={autor.oidAutor}>
                          {autor.nombre} {autor.apellido}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Grupo de Investigación *</label>
                    <select
                      value={newPublicacionData.GrupoInvestigacion || ''}
                      onChange={(e) => setNewPublicacionData({...newPublicacionData, GrupoInvestigacion: e.target.value ? parseInt(e.target.value) : null})}
                      style={{ width: '100%', padding: '8px', fontSize: '14px' }}
                    >
                      <option value="">Seleccionar grupo</option>
                      {grupos.map(grupo => (
                        <option key={grupo.oidGrupoInvestigacion} value={grupo.oidGrupoInvestigacion}>
                          {grupo.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="field-modal-footer">
                <button className="btn-cancel" onClick={() => setShowPublicacionModal(false)}>Cancelar</button>
                <button className="btn-save" onClick={handleCreatePublicacion}>Crear y Agregar</button>
              </div>
            </div>
          </div>
        )}

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
