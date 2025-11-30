import React, { useState } from 'react';
import './TrabajoRegistrosPatentes.css';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';
import AgregarRegistroModal from './AgregarRegistroModal';
import AgregarPatenteModal from './AgregarPatenteModal';
import AgregarTrabajoModal from './AgregarTrabajoModal';

const TrabajoRegistrosPatentes = () => {
  // Estados para modales
  const [showTrabajoModal, setShowTrabajoModal] = useState(false);
  const [showRegistroModal, setShowRegistroModal] = useState(false);
  const [showPatenteModal, setShowPatenteModal] = useState(false);
  
  // Estados para búsqueda y filtros
  const [trabajoSearch, setTrabajoSearch] = useState('');
  const [registroSearch, setRegistroSearch] = useState('');
  const [patenteSearch, setPatenteSearch] = useState('');
  
  const [registroTipo, setRegistroTipo] = useState('');
  const [patenteTipo, setPatenteTipo] = useState('');

  // Datos de ejemplo (puedes reemplazar con datos del backend)
  const [trabajos, setTrabajos] = useState([
    { id: 1, ciudad: 'Madrid', fechaInicio: '2024-01-15', nombreReunion: 'Reunion 1', titulo: 'Proyecto A' },
    { id: 2, ciudad: 'Barcelona', fechaInicio: '2024-02-20', nombreReunion: 'Reunion 2', titulo: 'Proyecto B' },
  ]);

  const [registros, setRegistros] = useState([
    { id: 1, tipo: 'Patente Nacional', nombre: 'Registro 1', fecha: '2024-01-10' },
    { id: 2, tipo: 'Patente Internacional', nombre: 'Registro 2', fecha: '2024-02-10' },
  ]);

  const [patentes, setPatentes] = useState([
    { id: 1, tipo: 'Patente Activa', numero: 'P-2024-001', fecha: '2024-01-01' },
    { id: 2, tipo: 'Patente en Trámite', numero: 'P-2024-002', fecha: '2024-02-01' },
  ]);

  // Filtrar datos
  const trabajosFiltrados = trabajos.filter(t =>
    t.ciudad.toLowerCase().includes(trabajoSearch.toLowerCase()) ||
    t.titulo.toLowerCase().includes(trabajoSearch.toLowerCase())
  );

  const registrosFiltrados = registros.filter(r =>
    (registroTipo === '' || r.tipo === registroTipo) &&
    (r.nombre.toLowerCase().includes(registroSearch.toLowerCase()))
  );

  const patentesFiltradas = patentes.filter(p =>
    (patenteTipo === '' || p.tipo === patenteTipo) &&
    (p.numero.toLowerCase().includes(patenteSearch.toLowerCase()))
  );

  // Opciones para dropdowns
  const tiposRegistro = ['Patente Nacional', 'Patente Internacional', 'Registro Marcario'];
  const tiposPatente = ['Patente Activa', 'Patente en Trámite', 'Patente Expirada'];

  // Handlers para agregar registro y patente
  const handleAddTrabajo = (nuevoTrabajo) => {
    setTrabajos(prev => [...prev, nuevoTrabajo]);
    setShowTrabajoModal(false);
  };

  const handleAddRegistro = (nuevoRegistro) => {
    setRegistros(prev => [...prev, nuevoRegistro]);
    setShowRegistroModal(false);
  };

  const handleAddPatente = (nuevaPatente) => {
    setPatentes(prev => [...prev, nuevaPatente]);
    setShowPatenteModal(false);
  };

  const handleDeleteTrabajo = (id) => {
    if (window.confirm('¿Está seguro de eliminar este trabajo?')) {
      setTrabajos(prev => prev.filter(t => t.id !== id));
    }
  };

  const handleEditTrabajo = (id) => {
    console.log('Editar trabajo:', id);
    // Implementar lógica de edición
  };

  const handleDeleteRegistro = (id) => {
    if (window.confirm('¿Está seguro de eliminar este registro?')) {
      setRegistros(prev => prev.filter(r => r.id !== id));
    }
  };

  const handleEditRegistro = (id) => {
    console.log('Editar registro:', id);
    // Implementar lógica de edición
  };

  const handleDeletePatente = (id) => {
    if (window.confirm('¿Está seguro de eliminar esta patente?')) {
      setPatentes(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleEditPatente = (id) => {
    console.log('Editar patente:', id);
    // Implementar lógica de edición
  };

  return (
    <div className="trp-container">
      {/* Sección de Trabajos */}
      <section className="trp-section">
        <div className="trp-header">
          <h2>Trabajos</h2>
          <div className="trp-search-bar">
            <Search size={20} />
            <input
              type="text"
              placeholder="Buscar trabajo"
              value={trabajoSearch}
              onChange={(e) => setTrabajoSearch(e.target.value)}
              className="trp-input"
            />
            <button className="trp-btn-add" title="Agregar trabajo" onClick={() => setShowTrabajoModal(true)}>
              <Plus size={20} />
            </button>
          </div>
        </div>

        <table className="trp-table">
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
            {trabajosFiltrados.length > 0 ? (
              trabajosFiltrados.map(trabajo => (
                <tr key={trabajo.id}>
                  <td>{trabajo.ciudad}</td>
                  <td>{trabajo.fechaInicio}</td>
                  <td>{trabajo.nombreReunion}</td>
                  <td>{trabajo.titulo}</td>
                  <td>
                    <div className="trp-action-buttons">
                      <button 
                        className="trp-btn-edit"
                        onClick={() => handleEditTrabajo(trabajo.id)}
                        title="Editar"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        className="trp-btn-delete"
                        onClick={() => handleDeleteTrabajo(trabajo.id)}
                        title="Eliminar"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="trp-empty">No hay trabajos</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      <div className="trp-row">
        {/* Sección de Registros */}
        <section className="trp-section trp-section-half">
          <div className="trp-header">
            <h3>Registro de Propiedad</h3>
            <div className="trp-search-bar">
              <Search size={18} />
              <input
                type="text"
                placeholder="Buscar registro"
                value={registroSearch}
                onChange={(e) => setRegistroSearch(e.target.value)}
                className="trp-input"
              />
              <button className="trp-btn-add" title="Agregar registro" onClick={() => setShowRegistroModal(true)}>
                <Plus size={18} />
              </button>
            </div>
          </div>

          <div className="trp-filter">
            <select
              value={registroTipo}
              onChange={(e) => setRegistroTipo(e.target.value)}
              className="trp-select"
            >
              <option value="">tipo</option>
              {tiposRegistro.map(tipo => (
                <option key={tipo} value={tipo}>{tipo}</option>
              ))}
            </select>
          </div>

          <div className="trp-items-list">
            {registrosFiltrados.length > 0 ? (
              registrosFiltrados.map(registro => (
                <div key={registro.id} className="trp-item">
                  <div className="trp-item-info">
                    <strong>{registro.nombre}</strong>
                    <small>{registro.tipo} • {registro.fecha}</small>
                  </div>
                  <div className="trp-action-buttons">
                    <button 
                      className="trp-btn-edit"
                      onClick={() => handleEditRegistro(registro.id)}
                      title="Editar"
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      className="trp-btn-delete"
                      onClick={() => handleDeleteRegistro(registro.id)}
                      title="Eliminar"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="trp-empty">No hay registros</div>
            )}
          </div>
        </section>

        {/* Sección de Patentes */}
        <section className="trp-section trp-section-half">
          <div className="trp-header">
            <h3>Patentes</h3>
            <div className="trp-search-bar">
              <Search size={18} />
              <input
                type="text"
                placeholder="Buscar patente"
                value={patenteSearch}
                onChange={(e) => setPatenteSearch(e.target.value)}
                className="trp-input"
              />
              <button className="trp-btn-add" title="Agregar patente" onClick={() => setShowPatenteModal(true)}>
                <Plus size={18} />
              </button>
            </div>
          </div>

          <div className="trp-filter">
            <select
              value={patenteTipo}
              onChange={(e) => setPatenteTipo(e.target.value)}
              className="trp-select"
            >
              <option value="">tipo</option>
              {tiposPatente.map(tipo => (
                <option key={tipo} value={tipo}>{tipo}</option>
              ))}
            </select>
          </div>

          <div className="trp-items-list">
            {patentesFiltradas.length > 0 ? (
              patentesFiltradas.map(patente => (
                <div key={patente.id} className="trp-item">
                  <div className="trp-item-info">
                    <strong>{patente.numero}</strong>
                    <small>{patente.tipo} • {patente.fecha}</small>
                  </div>
                  <div className="trp-action-buttons">
                    <button 
                      className="trp-btn-edit"
                      onClick={() => handleEditPatente(patente.id)}
                      title="Editar"
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      className="trp-btn-delete"
                      onClick={() => handleDeletePatente(patente.id)}
                      title="Eliminar"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="trp-empty">No hay patentes</div>
            )}
          </div>
        </section>
      </div>

      <AgregarTrabajoModal
        isOpen={showTrabajoModal}
        onClose={() => setShowTrabajoModal(false)}
        onAdd={handleAddTrabajo}
      />

      <AgregarRegistroModal 
        isOpen={showRegistroModal}
        onClose={() => setShowRegistroModal(false)}
        onAdd={handleAddRegistro}
      />

      <AgregarPatenteModal 
        isOpen={showPatenteModal}
        onClose={() => setShowPatenteModal(false)}
        onAdd={handleAddPatente}
      />
    </div>
  );
};

export default TrabajoRegistrosPatentes;
