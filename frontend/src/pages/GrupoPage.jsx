import React, { useState, useEffect } from 'react';
import { Edit, Trash2 } from 'lucide-react';
import AgregarGrupoModal from '../components/AgregarGrupoModal';
import { crearGrupo, obtenerGrupos, actualizarGrupo, eliminarGrupo } from '../services/api';
import ConfirmModal from '../components/ConfirmModal';
import Alert from '../components/Alert';
import './Page.css';
import './GrupoPage.css';

function GrupoPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [grupos, setGrupos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [grupoToEdit, setGrupoToEdit] = useState(null);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, id: null });
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    cargarGrupos();
  }, []);

  const cargarGrupos = async () => {
    try {
      const gruposData = await obtenerGrupos();
      setGrupos(gruposData);
    } catch (error) {
      console.error('Error al cargar grupos:', error);
    }
  };

  const handleAbreModal = () => {
    setGrupoToEdit(null);
    setModalOpen(true);
  };

  const handleCerraModal = () => {
    setModalOpen(false);
    setGrupoToEdit(null);
  };

  const handleSubmitGrupo = async (formData) => {
    setIsLoading(true);
    try {
      if (grupoToEdit) {
        // Modo edición
        const grupoActualizado = await actualizarGrupo(grupoToEdit.oidGrupoInvestigacion, formData);
        console.log('Grupo actualizado exitosamente:', grupoActualizado);
        setGrupos(grupos.map(g =>
          g.oidGrupoInvestigacion === grupoActualizado.oidGrupoInvestigacion
            ? grupoActualizado
            : g
        ));
        setAlert({ type: 'success', message: 'Grupo actualizado exitosamente' });
      } else {
        // Modo creación
        const nuevoGrupo = await crearGrupo(formData);
        console.log('Grupo creado exitosamente:', nuevoGrupo);
        setGrupos([...grupos, nuevoGrupo]);
        setAlert({ type: 'success', message: 'Grupo agregado exitosamente' });
      }
    } catch (error) {
      console.error('Error al guardar grupo:', error);
      setAlert({ type: 'error', message: 'Error al guardar el grupo: ' + (error.message || 'Error desconocido') });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteGrupo = (id) => {
    setConfirmModal({ isOpen: true, id });
  };

  const confirmDeleteGrupo = async () => {
    const id = confirmModal.id;
    setConfirmModal({ isOpen: false, id: null });
    
    try {
      await eliminarGrupo(id);
      setGrupos(grupos.filter(g => g.oidGrupoInvestigacion !== id));
      setAlert({ type: 'success', message: 'Grupo eliminado exitosamente' });
    } catch (error) {
      console.error('Error al eliminar grupo:', error);
      setAlert({ type: 'error', message: 'Error al eliminar el grupo: ' + (error.message || 'Error desconocido') });
    }
  };

  const handleEditGrupo = (id) => {
    const grupo = grupos.find(g => g.oidGrupoInvestigacion === id);
    if (grupo) {
      setGrupoToEdit(grupo);
      setModalOpen(true);
    }
  };

  return (
    <div className="page-container">
      {alert && (
        <Alert 
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      <ConfirmModal 
        isOpen={confirmModal.isOpen}
        title="Eliminar Grupo"
        message="¿Está seguro que desea eliminar este grupo? Esta acción no se puede deshacer."
        type="danger"
        confirmText="Eliminar"
        cancelText="Cancelar"
        onConfirm={confirmDeleteGrupo}
        onCancel={() => setConfirmModal({ isOpen: false, id: null })}
      />

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
                <div key={grupo.oidGrupoInvestigacion} className="grupo-card">
                  <div className="grupo-card-header">
                    <h3>{grupo.nombre}</h3>
                    <div className="grupo-actions">
                      <button 
                        className="btn-edit-grupo"
                        onClick={() => handleEditGrupo(grupo.oidGrupoInvestigacion)}
                        title="Editar grupo"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        className="btn-delete-grupo"
                        onClick={() => handleDeleteGrupo(grupo.oidGrupoInvestigacion)}
                        title="Eliminar grupo"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <p><strong>Siglas:</strong> {grupo.sigla}</p>
                  <p><strong>Correo:</strong> {grupo.correo}</p>
                  <p><strong>Facultad:</strong> {grupo.facultadReginalAsignada}</p>
                  <p><strong>Financiamiento:</strong> {grupo.fuenteFinanciamiento}</p>
                  <p><strong>Objetivos:</strong> {grupo.organigrama}</p>
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
        grupoToEdit={grupoToEdit}
      />
    </div>
  );
}

export default GrupoPage;
