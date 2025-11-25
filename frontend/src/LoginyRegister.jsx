import React, { useState } from "react";

export default function App() {
  const [showPassword, setShowPassword] = useState(false);

  // Cambia vista login / register
  const [view, setView] = useState("login");

  // Estados del registro
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    telefono: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [showRegPass, setShowRegPass] = useState(false);
  const [showRegConfirmPass, setShowRegConfirmPass] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // VALIDACIÓN
  const validarCampos = () => {
    let newErrors = {};

    if (!form.nombre.trim()) newErrors.nombre = "ⓘ Este campo no puede estar vacio.";
    if (!form.email.trim()) newErrors.email = "ⓘ Este campo no puede estar vacio.";
    if (!form.telefono.trim()) newErrors.telefono = "ⓘ Este campo no puede estar vacio.";
    if (!form.password.trim()) newErrors.password = "ⓘ Este campo no puede estar vacio.";
    if (!form.confirmPassword.trim())
      newErrors.confirmPassword = "ⓘ Debe confirmar la contraseña";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (validarCampos()) {
      alert("Registro exitoso!");
    }
  };

  // =====================================================================================
  // LOGIN VIEW
  // =====================================================================================
  const LoginView = () => (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Iniciar Sesión</h1>

        {/* Email */}
        <label style={styles.label}>Correo electrónico</label>
        <input type="email" placeholder="Ingrese su correo" style={styles.input} />

        {/* Contraseña */}
        <label style={styles.label}>Contraseña</label>

        <div style={styles.passWrapper}>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Ingrese su contraseña"
            style={styles.input}
          />

          {/* ICONO OJO SVG */}
          <button
            onClick={() => setShowPassword(!showPassword)}
            style={styles.eyeBtn}
          >
            {!showPassword ? (
              /* OJO ABIERTO */
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#555"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            ) : (
              /* OJO CERRADO */
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#555"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-7 0-11-7-11-7a21.8 21.8 0 0 1 5.08-5.88" />
                <path d="M1 1l22 22" />
                <path d="M9.88 9.88A3 3 0 0 0 12 15c1.66 0 3-1.34 3-3 0-.8-.32-1.52-.84-2.04" />
                <path d="M16.82 12.82A10.94 10.94 0 0 0 23 12s-4-7-11-7c-1.33 0-2.6.22-3.78.63" />
              </svg>
            )}
          </button>
        </div>

        {/* Botón iniciar */}
        <button style={styles.btnPrimary}>Iniciar sesión</button>

        {/* divisor "o" */}
        <div style={styles.divider}>
          <div style={styles.line}></div>
          <div style={styles.circle}>o</div>
          <div style={styles.line}></div>
        </div>

        {/* Botón registrar */}
        <button style={styles.btnOutline} onClick={() => setView("register")}>
          Registrarse
        </button>

        {/* Olvidaste contraseña */}
        <p style={styles.forgot}>¿Olvidaste tu contraseña?</p>
      </div>
    </div>
  );

  // =====================================================================================
  // REGISTER VIEW
  // =====================================================================================
  const RegisterView = () => (
    <div style={styles.page}>
      <form style={styles.card} onSubmit={handleRegister}>
        <h1 style={styles.title}>Registrarse</h1>

        {/* Nombre */}
        <label style={styles.label}>Nombre completo</label>
        <input
          type="text"
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          style={styles.input}
        />
        {errors.nombre && <p style={styles.error}>{errors.nombre}</p>}

        {/* Email */}
        <label style={styles.label}>Email</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          style={styles.input}
        />
        {errors.email && <p style={styles.error}>{errors.email}</p>}

        {/* Telefono */}
        <label style={styles.label}>Telefono</label>
        <input
          type="text"
          name="telefono"
          value={form.telefono}
          onChange={handleChange}
          style={styles.input}
        />
        {errors.telefono && <p style={styles.error}>{errors.telefono}</p>}

        {/* Password */}
        <label style={styles.label}>Contraseña</label>
        <div style={styles.passWrapper}>
          <input
            type={showRegPass ? "text" : "password"}
            name="password"
            value={form.password}
            onChange={handleChange}
            style={styles.input}
          />

          <button
            type="button"
            onClick={() => setShowRegPass(!showRegPass)}
            style={styles.eyeBtn}
          >
            {!showRegPass ? (
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#555"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            ) : (
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#555"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-7 0-11-7-11-7a21.8 21.8 0 0 1 5.08-5.88" />
                <path d="M1 1l22 22" />
              </svg>
            )}
          </button>
        </div>
        {errors.password && <p style={styles.error}>{errors.password}</p>}

        {/* Confirmación */}
        <label style={styles.label}>Confirmar contraseña</label>
        <div style={styles.passWrapper}>
          <input
            type={showRegConfirmPass ? "text" : "password"}
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            style={styles.input}
          />

          <button
            type="button"
            onClick={() => setShowRegConfirmPass(!showRegConfirmPass)}
            style={styles.eyeBtn}
          >
            {!showRegConfirmPass ? (
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#555"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            ) : (
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#555"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-7 0-11-7-11-7a21.8 21.8 0 0 1 5.08-5.88" />
                <path d="M1 1l22 22" />
              </svg>
            )}
          </button>
        </div>
        {errors.confirmPassword && (
          <p style={styles.error}>{errors.confirmPassword}</p>
        )}

        {/* Botón registrar */}
        <button type="submit" style={styles.btnPrimary}>
          Registrarse
        </button>

        {/* Volver al login */}
        <button
          type="button"
          style={styles.btnOutline}
          onClick={() => setView("login")}
        >
          Iniciar sesión
        </button>
      </form>
    </div>
  );

  return view === "login" ? <LoginView /> : <RegisterView />;
}

/* ====================================================================== */
/* ============================ ESTILOS ================================= */
/* ====================================================================== */

const styles = {
  page: {
    background: "#f2f2f2",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  card: {
    width: "430px",
    padding: "36px",
    background: "white",
    borderRadius: "12px",
    boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },

  title: {
    textAlign: "center",
    margin: 0,
    fontSize: "22px",
    fontWeight: "bold",
  },

  label: {
    fontSize: "14px",
    color: "#444",
    marginTop: "8px",
  },

  input: {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #d0d0d0",
    fontSize: "15px",
  },

  passWrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },

  eyeBtn: {
    position: "absolute",
    right: "8px",
    top: "50%",
    transform: "translateY(-50%)",
    border: "none",
    background: "transparent",
    cursor: "pointer",
    padding: "4px",
  },

  btnPrimary: {
    background: "#6a0dad",
    color: "white",
    border: "none",
    padding: "12px",
    marginTop: "12px",
    borderRadius: "8px",
    fontSize: "15px",
    cursor: "pointer",
    fontWeight: 600,
  },

  btnOutline: {
    background: "transparent",
    color: "#6a0dad",
    border: "2px solid #6a0dad",
    padding: "12px",
    borderRadius: "8px",
    fontSize: "15px",
    cursor: "pointer",
    fontWeight: 600,
  },

  error: {
    color: "red",
    fontSize: "13px",
    marginTop: "-8px",
    marginBottom: "5px",
  },

  divider: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginTop: "14px",
  },

  line: {
    height: "1px",
    background: "#ddd",
    flex: 1,
  },

  circle: {
    width: "28px",
    height: "28px",
    borderRadius: "50%",
    border: "1px solid #eee",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    color: "#666",
    background: "white",
  },

  forgot: {
    marginTop: "10px",
    textAlign: "center",
    color: "#6a0dad",
    textDecoration: "underline",
    cursor: "pointer",
    fontSize: "14px",
  },
};
