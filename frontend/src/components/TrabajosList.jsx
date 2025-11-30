import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';
import './TrabajosList.css';
import AgregarTrabajoRealizado from './AgregarTrabajoRealizado';

function TrabajosList() {
  const [activeTab, setActiveTab] = useState('realizados');
  const [searchTerm, setSearchTerm] = useState('');
  const [showRealizadoModal, setShowRealizadoModal] = useState(false);
  const [showPublicadoModal, setShowPublicadoModal] = useState(false);

  // sample data shaped like backend model `TrabajoPublicado`: { id, autor, titulo, tipoTrabajoPublicado }
  const trabajosRealizados = [
    { id: 1, autor: 'Revista A', titulo: 'Investigación en IA', tipoTrabajoPublicado: 'Artículo' },
    { id: 2, autor: 'Revista B', titulo: 'Machine Learning', tipoTrabajoPublicado: 'Artículo' },
  ];

  const trabajosPublicados = [
    { id: 1, autor: 'IEEE', titulo: 'Cloud Computing', tipoTrabajoPublicado: 'Artículo' },
    { id: 2, autor: 'ACM', titulo: 'Blockchain Technology', tipoTrabajoPublicado: 'Artículo' },
  ];

  const [showAgregarRealizado, setShowAgregarRealizado] = useState(false);
  const [realizadosState, setRealizadosState] = useState(trabajosRealizados);
  const trabajos = activeTab === 'realizados' ? realizadosState : trabajosPublicados;

  const filteredTrabajos = trabajos.filter(trabajo =>
    (trabajo.autor || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (trabajo.titulo || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (<>
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
          <button className="add-button" title="Agregar nuevo trabajo" onClick={() => setShowAgregarRealizado(true)}>
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
    <AgregarTrabajoRealizado
      isOpen={showAgregarRealizado}
      onClose={() => setShowAgregarRealizado(false)}
      onAdd={(item) => { setRealizadosState(prev => [...prev, item]); setShowAgregarRealizado(false); }}
    />
  </>);
}

export default TrabajosList;
