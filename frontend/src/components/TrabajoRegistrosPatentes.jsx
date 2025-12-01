import React, { useState, useEffect } from 'react';
import './TrabajoRegistrosPatentes.css';
import { Search, Plus } from 'lucide-react';
import AgregarRegistroModal from './AgregarRegistroModal';
import AgregarPatenteModal from './AgregarPatenteModal';
import AgregarTrabajoModal from './AgregarTrabajoModal';
import { listarRegistros, listarPatentes, listarTipoRegistros, listarTrabajosPresentados } from '../services/api';

const TrabajoRegistrosPatentes = () => {
  // Estados para modales
  const [showRegistroModal, setShowRegistroModal] = useState(false);
  const [showPatenteModal, setShowPatenteModal] = useState(false);
  const [showTrabajoModal, setShowTrabajoModal] = useState(false);
  
  // Estados para búsqueda y filtros
  const [trabajoSearch, setTrabajoSearch] = useState('');
  const [registroSearch, setRegistroSearch] = useState('');
  const [patenteSearch, setPatenteSearch] = useState('');
  
  const [registroTipo, setRegistroTipo] = useState('');
  const [patenteTipo, setPatenteTipo] = useState('');

  // Trabajos cargados desde backend
  const [trabajos, setTrabajos] = useState([]);

  const [registros, setRegistros] = useState([]);

  useEffect(() => {
    let mounted = true;
    // load trabajos, registros, patentes and tipo registros from backend
    Promise.all([listarTrabajosPresentados(), listarRegistros(), listarPatentes(), listarTipoRegistros()])
      .then(([trabajosData, registrosData, patentesData, tiposData]) => {
        if (!mounted) return;
        const trabajosArrRaw = Array.isArray(trabajosData) ? trabajosData : [];
            // normalize trabajos (trabajosArrRaw ya contiene los datos crudos)
        const patentesArrRaw = Array.isArray(patentesData) ? patentesData : [];
        // normalize patentes to UI shape: { id, descripcion, tipo, fecha, raw }
        const patentesArr = patentesArrRaw.map(p => ({
          id: p?.oidPatente ?? p?.id,
          numero: p?.numero ?? p?.descripcion ?? '',
          descripcion: p?.descripcion ?? '',
          tipo: p?.tipo ?? '',
          fecha: p?.fecha ?? '',
          raw: p
        }));
        const tiposArr = Array.isArray(tiposData) ? tiposData : [];

        // Normalize trabajos from backend to UI friendly objects
        const trabajosMapped = trabajosArrRaw.map(t => ({
          id: t?.oidTrabajoPresentado ?? t?.id,
          ciudad: t?.ciudad ?? '',
          fechaInicio: t?.fechaInicio ? String(t.fechaInicio).slice(0, 16) : '',
          nombreReunion: t?.nombreReunion ?? '',
          tituloTrabajo: t?.tituloTrabajo ?? '',
          raw: t
        }));

        // Map backend registros to UI-friendly objects
        const records = Array.isArray(registrosData) ? registrosData.map(r => {
          const id = r?.oidRegistro ?? r?.id;
          const nombre = r?.descripcion ?? '';
          const tipoId = r?.TipoDeRegistro ?? r?.tipoRegistro ?? null;
          const tipoObj = tiposArr.find(t => (t.oidTipoDeRegistro === tipoId) || (t.id === tipoId));
          const tipo = tipoObj ? (tipoObj.nombre || '') : (r?.tipoRegistro || '');
          const patenteId = r?.Patente ?? null;
          const patenteObj = patentesArr.find(p => (p.oidPatente === patenteId) || (p.id === patenteId));
          const fecha = r?.fecha ?? (patenteObj?.fecha ?? '');

          return { id, nombre, tipo, fecha, raw: r };
        }) : [];

        setTrabajos(trabajosMapped);
        setPatentes(patentesArr);
        setTipoRegistros(tiposArr);
        setRegistros(records);
      })
      .catch(() => {
        if (!mounted) return;
        setRegistros([]);
        setPatentes([]);
        setTipoRegistros([]);
        setTrabajos([]);
      });
    return () => { mounted = false };
  }, []);

  const [patentes, setPatentes] = useState([]);
  const [tipoRegistros, setTipoRegistros] = useState([]);

  // Filtrar datos
  const trabajosFiltrados = trabajos.filter(t =>
    (String(t.ciudad || '').toLowerCase().includes(String(trabajoSearch || '').toLowerCase())) ||
    (String(t.tituloTrabajo || '').toLowerCase().includes(String(trabajoSearch || '').toLowerCase()))
  );

  const registrosFiltrados = registros.filter(r =>
    (registroTipo === '' || r.tipo === registroTipo) &&
    (String(r.nombre || '').toLowerCase().includes(String(registroSearch || '').toLowerCase()))
  );

  const patentesFiltradas = patentes.filter(p =>
    (patenteTipo === '' || p.tipo === patenteTipo) &&
    (String(p.descripcion || '').toLowerCase().includes(String(patenteSearch || '').toLowerCase()))
  );

  // Opciones para dropdowns
  const tiposRegistro = ['Patente Nacional', 'Patente Internacional', 'Registro Marcario'];
  const tiposPatente = ['Patente Activa', 'Patente en Trámite', 'Patente Expirada'];

  // Handlers para agregar registro y patente
  const handleRegistroCreado = (nuevoRegistro) => {
    setRegistros(prev => [...prev, nuevoRegistro]);
    setShowRegistroModal(false);
  };

  const handleAddPatente = (nuevaPatente) => {
    setPatentes(prev => [...prev, nuevaPatente]);
    setShowPatenteModal(false);
  };

  const handleAddTrabajo = (nuevoTrabajo) => {
    setTrabajos(prev => [...prev, nuevoTrabajo]);
    setShowTrabajoModal(false);
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
            </tr>
          </thead>
          <tbody>
            {trabajosFiltrados.length > 0 ? (
              trabajosFiltrados.map(trabajo => (
                <tr key={trabajo.id}>
                  <td>{trabajo.ciudad}</td>
                  <td>{trabajo.fechaInicio}</td>
                  <td>{trabajo.nombreReunion}</td>
                  <td>{trabajo.tituloTrabajo}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="trp-empty">No hay trabajos</td>
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
                </div>
              ))
            ) : (
              <div className="trp-empty">No hay patentes</div>
            )}
          </div>
        </section>
      </div>

      <AgregarRegistroModal 
        isOpen={showRegistroModal}
        onClose={() => setShowRegistroModal(false)}
        onRegistroCreado={handleRegistroCreado}
      />

      <AgregarPatenteModal 
        isOpen={showPatenteModal}
        onClose={() => setShowPatenteModal(false)}
        onAdd={handleAddPatente}
      />
      
      <AgregarTrabajoModal
        isOpen={showTrabajoModal}
        onClose={() => setShowTrabajoModal(false)}
        onAdd={handleAddTrabajo}
      />
    </div>
  );
};

export default TrabajoRegistrosPatentes;
