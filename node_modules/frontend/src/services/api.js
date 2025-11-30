// Configuración base de la API
const API_BASE_URL = 'http://127.0.0.1:8000/api';

// Función para hacer login
export const login = async (email, password) => {
  const loginData = {
    correo: email,
    contrasena: password
  };

  console.log('=== LOGIN REQUEST ===');
  console.log('URL:', `${API_BASE_URL}/auth/login/`);
  console.log('Datos enviados:', loginData);

  try {
    const response = await fetch(`${API_BASE_URL}/auth/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData),
    });

    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);

    const data = await response.json();
    console.log('Response data:', data);

    if (!response.ok) {
      throw new Error(data.error || 'Error en el login');
    }

    // Guardar tokens en localStorage
    if (data.tokens) {
      localStorage.setItem('access_token', data.tokens.access);
      localStorage.setItem('refresh_token', data.tokens.refresh);
      console.log('Tokens guardados en localStorage');
    }

    // Guardar datos del usuario
    if (data.persona) {
      localStorage.setItem('user', JSON.stringify(data.persona));
      console.log('Datos de usuario guardados');
    }

    console.log('=== LOGIN SUCCESS ===');
    return data;

  } catch (error) {
    console.error('=== LOGIN ERROR ===');
    console.error('Error:', error);
    throw error;
  }
};

// Función para logout
export const logout = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user');
  console.log('Sesión cerrada y tokens eliminados');
};

// Función para obtener el token de acceso
export const getAccessToken = () => {
  return localStorage.getItem('access_token');
};

// Función para verificar si hay sesión activa
export const isAuthenticated = () => {
  return !!getAccessToken();
};

// Función para obtener datos del usuario
export const getUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

// Función para obtener el perfil completo del usuario desde el backend
export const getPerfil = async (oidpersona) => {
  const token = getAccessToken();
  
  if (!token) {
    throw new Error('No hay sesión activa');
  }

  try {
    const response = await fetch(`${API_BASE_URL}/auth/perfil/${oidpersona}/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Error al obtener el perfil');
    }

    const data = await response.json();
    return data.persona || data;
  } catch (error) {
    console.error('Error obteniendo perfil:', error);
    throw error;
  }
};

// Función para actualizar el perfil del usuario
export const actualizarPerfil = async (oidpersona, perfilData) => {
  const token = getAccessToken();
  
  if (!token) {
    throw new Error('No hay sesión activa');
  }

  try {
    const response = await fetch(`${API_BASE_URL}/auth/perfil/${oidpersona}/actualizar/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(perfilData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al actualizar el perfil');
    }

    const data = await response.json();
    
    // Actualizar datos en localStorage
    if (data.persona) {
      localStorage.setItem('user', JSON.stringify(data.persona));
    }
    
    return data;
  } catch (error) {
    console.error('Error actualizando perfil:', error);
    throw error;
  }
};

// Función para obtener opciones de perfil
export const getOpcionesPerfil = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/opciones-perfil/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Error al obtener opciones de perfil');
    }

    return await response.json();
  } catch (error) {
    console.error('Error obteniendo opciones:', error);
    throw error;
  }
};

export default {
  login,
  logout,
  getAccessToken,
  isAuthenticated,
  getUser,
  getPerfil,
  actualizarPerfil,
  getOpcionesPerfil
};
