import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import './register.css';

export default function Register({ onRegister = () => {} }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    horasSemanales: '',
    tipoDePersonal: '',
    password: '',
    confirmPassword: '',
  });

  const [tiposPersonal, setTiposPersonal] = useState([]);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [generalError, setGeneralError] = useState('');

  // Cargar tipos de personal al montar el componente
  useEffect(() => {
    const fetchTiposPersonal = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/auth/tipos-personal/');
        if (response.ok) {
          const data = await response.json();
          setTiposPersonal(data);
        }
      } catch (error) {
        console.error('Error al cargar tipos de personal:', error);
      }
    };

    fetchTiposPersonal();
  }, []);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }

    if (!formData.apellido.trim()) {
      newErrors.apellido = 'El apellido es requerido';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.horasSemanales) {
      newErrors.horasSemanales = 'Las horas semanales son requeridas';
    } else if (isNaN(formData.horasSemanales) || formData.horasSemanales < 1 || formData.horasSemanales > 168) {
      newErrors.horasSemanales = 'Ingrese un número válido entre 1 y 168';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Debe confirmar la contraseña';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError('');

    if (!validateForm()) {
      return;
    }

    try {
      const requestBody = {
        nombre: formData.nombre,
        apellido: formData.apellido,
        correo: formData.email,
        contrasena: formData.password,
        horasSemanales: parseInt(formData.horasSemanales)
      };

      // Solo agregar tipoDePersonal si se seleccionó uno
      if (formData.tipoDePersonal) {
        requestBody.tipoDePersonal = parseInt(formData.tipoDePersonal);
      }

      const response = await fetch('http://localhost:8000/api/auth/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        alert('Registro exitoso. Por favor inicia sesión.');
        navigate('/');
      } else {
        setGeneralError(data.error || 'Error en el registro');
      }
    } catch (error) {
      console.error('Error al registrarse:', error);
      setGeneralError('Error al conectar con el servidor. Intenta de nuevo.');
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2>Registrarse</h2>
        
        {generalError && <div className="general-error">{generalError}</div>}

        <form className="register-form" onSubmit={handleSubmit}>
          <div className="register-form-group">
            <label htmlFor="nombre">Nombre</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Juan"
              className={errors.nombre ? 'error' : ''}
            />
            {errors.nombre && <span className="error-message">{errors.nombre}</span>}
          </div>

          <div className="register-form-group">
            <label htmlFor="apellido">Apellido</label>
            <input
              type="text"
              id="apellido"
              name="apellido"
              value={formData.apellido}
              onChange={handleChange}
              placeholder="Pérez"
              className={errors.apellido ? 'error' : ''}
            />
            {errors.apellido && <span className="error-message">{errors.apellido}</span>}
          </div>

          <div className="register-form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="tu@email.com"
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="register-form-group">
            <label htmlFor="horasSemanales">Horas Semanales de Dedicación</label>
            <input
              type="number"
              id="horasSemanales"
              name="horasSemanales"
              value={formData.horasSemanales}
              onChange={handleChange}
              placeholder="40"
              min="1"
              max="168"
              className={errors.horasSemanales ? 'error' : ''}
            />
            {errors.horasSemanales && <span className="error-message">{errors.horasSemanales}</span>}
          </div>

          <div className="register-form-group">
            <label htmlFor="tipoDePersonal">Tipo de Personal</label>
            <select
              id="tipoDePersonal"
              name="tipoDePersonal"
              value={formData.tipoDePersonal}
              onChange={handleChange}
              className={errors.tipoDePersonal ? 'error' : ''}
            >
              <option value="">Seleccione un tipo (opcional)</option>
              {tiposPersonal.map((tipo) => (
                <option key={tipo.id} value={tipo.id}>
                  {tipo.nombre}
                </option>
              ))}
            </select>
            {errors.tipoDePersonal && <span className="error-message">{errors.tipoDePersonal}</span>}
          </div>

          <div className="register-form-group">
            <label htmlFor="password">Contraseña</label>
            <div className="password-input-container">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className={errors.password ? 'error' : ''}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          <div className="register-form-group">
            <label htmlFor="confirmPassword">Confirmar Contraseña</label>
            <div className="password-input-container">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className={errors.confirmPassword ? 'error' : ''}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={showConfirmPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
          </div>

          <button type="submit" className="register-button">
            Registrarse
          </button>
        </form>

        <div className="register-footer">
          <p>
            ¿Ya tienes cuenta?{' '}
            <button
              className="login-link"
              onClick={() => navigate('/')}
            >
              Iniciar sesión
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
