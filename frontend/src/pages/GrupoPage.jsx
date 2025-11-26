import React, { useState } from 'react';
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
                  <h3>{grupo.nombreGrupo}</h3>
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
