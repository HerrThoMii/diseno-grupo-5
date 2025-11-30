import React, { useState } from 'react';
import { Edit, Trash2 } from 'lucide-react';
import AgregarGrupoModal from '../components/AgregarGrupoModal';
import './Page.css';
import './GrupoPage.css';

function GrupoPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [grupos, setGrupos] = useState([]);

  const handleAbreModal = () => {
    setModalOpen(true);
  };

  const handleCerraModal = () => {
    setModalOpen(false);
  };

  const handleSubmitGrupo = (formData) => {
    console.log('Nuevo grupo:', formData);
    setGrupos([...grupos, { id: Date.now(), ...formData }]);
    alert('Grupo agregado exitosamente');
  };

  const handleDeleteGrupo = (id) => {
    if (window.confirm('¿Está seguro de eliminar este grupo?')) {
      setGrupos(grupos.filter(g => g.id !== id));
    }
  };

  const handleEditGrupo = (id) => {
    console.log('Editar grupo:', id);
    // Implementar lógica para editar grupo
    // Se podría abrir el modal con los datos del grupo a editar
  };

  return (
    <div className="page-container">
      <div className="page-content">
        <div className="grupo-header">
          <h1>Agregar Grupo</h1>
          <button 
            className="btn-agregar-grupo"
            onClick={handleAbreModal}
          >
            Agregar Grupo
          </button>
        </div>

        {grupos.length > 0 && (
          <div className="grupos-list">
            <h2>Grupos Registrados</h2>
            <div className="grupos-grid">
              {grupos.map((grupo) => (
                <div key={grupo.id} className="grupo-card">
                  <div className="grupo-card-header">
                    <h3>{grupo.nombreGrupo}</h3>
                    <div className="grupo-actions">
                      <button 
                        className="btn-edit-grupo"
                        onClick={() => handleEditGrupo(grupo.id)}
                        title="Editar grupo"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        className="btn-delete-grupo"
                        onClick={() => handleDeleteGrupo(grupo.id)}
                        title="Eliminar grupo"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <p><strong>Siglas:</strong> {grupo.siglasGrupo}</p>
                  <p><strong>Correo:</strong> {grupo.correo}</p>
                  <p><strong>Facultad:</strong> {grupo.facultad}</p>
                  <p><strong>Financiamiento:</strong> {grupo.financiamiento}</p>
                  <p><strong>Objetivos:</strong> {grupo.objetivos}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {grupos.length === 0 && (
          <div className="empty-state">
            <p>No hay grupos registrados aún.</p>
            <p>Haz clic en "Agregar Grupo" para crear uno.</p>
          </div>
        )}
      </div>

      <AgregarGrupoModal 
        isOpen={modalOpen}
        onClose={handleCerraModal}
        onSubmit={handleSubmitGrupo}
      />
    </div>
  );
}

export default GrupoPage;
