import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { login } from '../utils/auth';
import './login.css';

const Login = ({ onLogin = () => {} }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password:''
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.email) {
            newErrors.email = 'El email es requerido';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'El email no es valido';
        }

        if (!formData.password) {
            newErrors.password = 'La contrasena es requerida';
        } else if (formData.password.length < 6) {
            newErrors.password = 'La contrasena debe tener al menos 6 caracteres';
        }

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = validateForm();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        setIsLoading(true);

        try {
            const data = await login(formData.email, formData.password);
            
            // Validar que recibimos datos válidos del backend
            if (!data || !data.user || !data.token) {
                throw new Error('Respuesta invalida del servidor');
            }
            
            const userName = data.user.nombre || data.user.correo?.split('@')[0] || 'Usuario';
            onLogin(userName);
        } catch (error) {
            console.error('Error en login:', error);
            setErrors({ general: error.message || 'Error al iniciar sesion. Intenta nuevamente.'});
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2>Iniciar Sesion</h2>

                <form onSubmit={handleSubmit} className='login-form'>
                {errors.general && (
                    <div className="error-message general-error">
                    {errors.general}
                    </div>
                )}

                <div className="form-group">
                    <label htmlFor='email'>Email</label>
                    <input 
                        type='email' 
                        id='email' 
                        name='email' 
                        value={formData.email}
                        onChange={handleChange}
                        className={errors.email ? 'error' : ''} 
                        placeholder='Ingresa tu email'
                    />
                    {errors.email && (
                    <span className='error-message'>{errors.email}</span>
                    )}
                </div>
                <div className="form-group">
                    <label htmlFor="password">Contraseña</label>
                    <div className="password-input-container">
                        <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className={errors.password ? 'error' : ''}
                        placeholder="Ingrese su contraseña"
                        />
                        <button
                            type="button"
                            className="password-toggle"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                    {errors.password && (
                    <span className="error-message">{errors.password}</span>
                    )}
                </div>
                <button 
                    type="submit" 
                    className="login-button"
                    disabled={isLoading}
                >
                    {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                </button>
                </form>
                <div className="login-footer">
                    <p><a href="#">¿Olvidaste tu contraseña?</a></p>
                </div>
                <div className="login-divider">
                    <span>o</span>
                </div>
                <button 
                    type="button" 
                    className="register-button"
                    onClick={() => navigate('/register')}
                >
                    Registrarse
                </button>
            </div>
        </div>
    )
};

export default Login