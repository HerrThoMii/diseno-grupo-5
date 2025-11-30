import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';
import './TrabajosList.css';
import AgregarTrabajoRealizadoModal from './AgregarTrabajoRealizadoModal';
import AgregarTrabajoPublicadoModal from './AgregarTrabajoPublicadoModal';

function TrabajosList() {
  const [activeTab, setActiveTab] = useState('realizados');
  const [searchTerm, setSearchTerm] = useState('');
  const [showRealizadoModal, setShowRealizadoModal] = useState(false);
  const [showPublicadoModal, setShowPublicadoModal] = useState(false);

  const [trabajosRealizados, setTrabajosRealizados] = useState([
    {
      id: 1,
      nombre: 'Trabajo 1',
      titulo: 'Investigación en IA',
      issn: 'ISSN-001',
      editorial: 'Editorial A',
      pais: 'Argentina'
    },
    {
      id: 2,
      nombre: 'Trabajo 2',
      titulo: 'Machine Learning',
      issn: 'ISSN-002',
      editorial: 'Editorial B',
      pais: 'Chile'
    },
  ]);

  const [trabajosPublicados, setTrabajosPublicados] = useState([
    {
      id: 1,
      nombre: 'Paper 1',
      titulo: 'Cloud Computing',
      issn: 'ISSN-003',
      editorial: 'IEEE',
      pais: 'USA'
    },
    {
      id: 2,
      nombre: 'Paper 2',
      titulo: 'Blockchain Technology',
      issn: 'ISSN-004',
      editorial: 'ACM',
      pais: 'Canadá'
    },
  ]);

  const handleAddRealizado = (nuevoTrabajo) => {
    setTrabajosRealizados(prev => [...prev, nuevoTrabajo]);
    setShowRealizadoModal(false);
  };

  const handleAddPublicado = (nuevoTrabajo) => {
    setTrabajosPublicados(prev => [...prev, nuevoTrabajo]);
    setShowPublicadoModal(false);
  };

  const handleDeleteRealizado = (id) => {
    if (window.confirm('¿Está seguro de eliminar este trabajo?')) {
      setTrabajosRealizados(prev => prev.filter(trabajo => trabajo.id !== id));
    }
  };

  const handleDeletePublicado = (id) => {
    if (window.confirm('¿Está seguro de eliminar este trabajo?')) {
      setTrabajosPublicados(prev => prev.filter(trabajo => trabajo.id !== id));
    }
  };

  const handleEditRealizado = (id) => {
    console.log('Editar trabajo realizado:', id);
    // Aquí se implementaría la lógica para editar
  };

  const handleEditPublicado = (id) => {
    console.log('Editar trabajo publicado:', id);
    // Aquí se implementaría la lógica para editar
  };

  const trabajos = activeTab === 'realizados' ? trabajosRealizados : trabajosPublicados;

  const filteredTrabajos = trabajos.filter(trabajo =>
    trabajo.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trabajo.titulo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="trabajos-container">
      <div className="trabajos-header">
        <h2>Trabajos Realizados y Publicados</h2>
      </div>

      <div className="trabajos-tabs">
        <button
          className={`tab-button ${activeTab === 'realizados' ? 'active' : ''}`}
          onClick={() => setActiveTab('realizados')}
        >
          Trabajos Realizados.
        </button>
        <button
          className={`tab-button ${activeTab === 'publicados' ? 'active' : ''}`}
          onClick={() => setActiveTab('publicados')}
        >
          Trabajos Publicados.
        </button>
      </div>

      <div className="trabajos-section">
        <h3>{activeTab === 'realizados' ? 'Trabajos Realizados.' : 'Trabajos Publicados.'}</h3>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Buscar trabajo"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button className="search-button">
            <Search size={18} />
          </button>
          <button 
            className="add-button" 
            title={activeTab === 'realizados' ? 'Agregar trabajo realizado' : 'Agregar trabajo publicado'}
            onClick={() => activeTab === 'realizados' ? setShowRealizadoModal(true) : setShowPublicadoModal(true)}
          >
            <Plus size={18} />
          </button>
        </div>

        <div className="table-wrapper">
          <table className="trabajos-table">
            <thead>
              <tr>
                <th>Nombre Revista</th>
                <th>Título del Trabajo</th>
                <th>ISSN</th>
                <th>Editorial</th>
                <th>País</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredTrabajos.length > 0 ? (
                filteredTrabajos.map((trabajo) => (
                  <tr key={trabajo.id}>
                    <td>{trabajo.nombre}</td>
                    <td>{trabajo.titulo}</td>
                    <td>{trabajo.issn}</td>
                    <td>{trabajo.editorial}</td>
                    <td>{trabajo.pais}</td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          className="btn-edit"
                          onClick={() => activeTab === 'realizados' ? handleEditRealizado(trabajo.id) : handleEditPublicado(trabajo.id)}
                          title="Editar"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          className="btn-delete"
                          onClick={() => activeTab === 'realizados' ? handleDeleteRealizado(trabajo.id) : handleDeletePublicado(trabajo.id)}
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
                  <td colSpan="6" className="empty-message">
                    No hay trabajos para mostrar
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AgregarTrabajoRealizadoModal
        isOpen={showRealizadoModal}
        onClose={() => setShowRealizadoModal(false)}
        onAdd={handleAddRealizado}
      />

      <AgregarTrabajoPublicadoModal
        isOpen={showPublicadoModal}
        onClose={() => setShowPublicadoModal(false)}
        onAdd={handleAddPublicado}
      />
    </div>
  );
}

export default TrabajosList;
