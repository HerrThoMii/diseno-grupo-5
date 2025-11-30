import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

// Crear instancia de axios con configuración base
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token de autenticación si existe
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ========== Servicios de Autenticación ==========

export const authService = {
  login: async (correo, contrasena) => {
    const response = await api.post('/auth/login/', { correo, contrasena });
    if (response.data.tokens) {
      localStorage.setItem('access_token', response.data.tokens.access);
      localStorage.setItem('refresh_token', response.data.tokens.refresh);
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('access_token');
  },
};

// ========== Servicios de Memoria Anual ==========

export const memoriaAnualService = {
  // Obtener todas las memorias anuales
  getAll: async () => {
    const response = await api.get('/memorias-anuales/');
    return response.data;
  },

  // Obtener una memoria anual por ID
  getById: async (id) => {
    const response = await api.get(`/memorias-anuales/${id}/`);
    return response.data;
  },

  // Crear nueva memoria anual
  create: async (data) => {
    const response = await api.post('/memorias-anuales/', data);
    return response.data;
  },

  // Actualizar memoria anual
  update: async (id, data) => {
    const response = await api.put(`/memorias-anuales/${id}/`, data);
    return response.data;
  },

  // Eliminar memoria anual
  delete: async (id) => {
    const response = await api.delete(`/memorias-anuales/${id}/`);
    return response.data;
  },
};

// ========== Servicios de Integrantes ==========

export const integranteService = {
  getAll: async () => {
    const response = await api.get('/integrantes-memoria/');
    return response.data;
  },

  getByMemoriaId: async (memoriaId) => {
    const response = await api.get(`/integrantes-memoria/?memoria=${memoriaId}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/integrantes-memoria/', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/integrantes-memoria/${id}/`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/integrantes-memoria/${id}/`);
    return response.data;
  },
};

// ========== Servicios de Trabajos ==========

export const trabajoService = {
  getAll: async () => {
    const response = await api.get('/trabajos-memoria/');
    return response.data;
  },

  getByMemoriaId: async (memoriaId) => {
    const response = await api.get(`/trabajos-memoria/?memoria=${memoriaId}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/trabajos-memoria/', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/trabajos-memoria/${id}/`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/trabajos-memoria/${id}/`);
    return response.data;
  },
};

// ========== Servicios de Actividades ==========

export const actividadService = {
  getAll: async () => {
    const response = await api.get('/actividades-memoria/');
    return response.data;
  },

  getByMemoriaId: async (memoriaId) => {
    const response = await api.get(`/actividades-memoria/?memoria=${memoriaId}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/actividades-memoria/', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/actividades-memoria/${id}/`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/actividades-memoria/${id}/`);
    return response.data;
  },
};

// ========== Servicios de Publicaciones ==========

export const publicacionService = {
  getAll: async () => {
    const response = await api.get('/publicaciones-memoria/');
    return response.data;
  },

  getByMemoriaId: async (memoriaId) => {
    const response = await api.get(`/publicaciones-memoria/?memoria=${memoriaId}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/publicaciones-memoria/', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/publicaciones-memoria/${id}/`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/publicaciones-memoria/${id}/`);
    return response.data;
  },
};

// ========== Servicios de Patentes ==========

export const patenteService = {
  getAll: async () => {
    const response = await api.get('/patentes-memoria/');
    return response.data;
  },

  getByMemoriaId: async (memoriaId) => {
    const response = await api.get(`/patentes-memoria/?memoria=${memoriaId}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/patentes-memoria/', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/patentes-memoria/${id}/`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/patentes-memoria/${id}/`);
    return response.data;
  },
};

// ========== Servicios de Proyectos ==========

export const proyectoService = {
  getAll: async () => {
    const response = await api.get('/proyectos-memoria/');
    return response.data;
  },

  getByMemoriaId: async (memoriaId) => {
    const response = await api.get(`/proyectos-memoria/?memoria=${memoriaId}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/proyectos-memoria/', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/proyectos-memoria/${id}/`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/proyectos-memoria/${id}/`);
    return response.data;
  },
};

export default api;
