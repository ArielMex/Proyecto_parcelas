// Importa tu servicio de API (ajusta la ruta según tu estructura)
import { AuthService } from '../services/auth.service';
import { useState } from "react";
import "../styles/Login.css";

interface LoginFormData {
  email: string;
  password: string;
  dateOfBirth: string;
  rememberMe: boolean;
}

export default function LoginForm() {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
    dateOfBirth: "",
    rememberMe: false,
  });
  const [error, setError] = useState("");
  const [showDateModal, setShowDateModal] = useState(false);
  const [step, setStep] = useState(1);

  const validateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age >= 13;
  };

  const handleFirstStep = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      setError("Por favor ingresa email y contraseña");
      return;
    }
    setShowDateModal(true);
    setStep(2);
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateAge(formData.dateOfBirth)) {
      setError("Debes tener al menos 13 años");
      return;
    }

    try {
      // Llama al servicio de autenticación
      const { access_token } = await AuthService.login({
        email: formData.email,
        password: formData.password,
        date_birthday: formData.dateOfBirth, // Ajusta el nombre del campo
      });

      if (formData.rememberMe) {
        localStorage.setItem('access_token', access_token);
      } else {
        sessionStorage.setItem('access_token', access_token);
      }

      window.location.href = "/dashboard";
    } catch (err) {
      setError("Credenciales incorrectas o error del servidor");
      setShowDateModal(false);
      setStep(1);
    }
  };

  return (
    <div className="auth-container">
      <div className="form-section">
        <div className="form-container">
          <div className="logo">BIENVENIDO DE VUELTA</div>
          <h1 className="form-title">INICIA SESIÓN</h1>
          {error && <div className="error-message">{error}</div>}
          
          {step === 1 && (
            <form onSubmit={handleFirstStep}>
              <div className="input-group">
                <label htmlFor="email">Correo</label>
                <input
                  type="email"
                  id="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="input-group">
                <label htmlFor="password">Contraseña</label>
                <input
                  type="password"
                  id="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
              <button type="submit" className="submit-button">
                INICIAR SESIÓN
              </button>
            </form>
          )}
          
          {showDateModal && (
            <div className="date-modal-overlay">
              <div className="date-modal">
                <div className="date-modal-header">
                  <h2>Escribe tu fecha de cumpleaños</h2>
                </div>
                <form onSubmit={handleFinalSubmit}>
                  <div className="input-group">
                    <label htmlFor="dateOfBirth">Tu cumpleaños</label>
                    <input
                      type="date"
                      id="dateOfBirth"
                      required
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    />
                  </div>
                  <div className="date-modal-actions">
                    <button 
                      type="button" 
                      className="cancel-button"
                      onClick={() => {
                        setShowDateModal(false);
                        setStep(1);
                      }}
                    >
                      Regresar
                    </button>
                    <button type="submit" className="submit-button">INICIAR</button>
                  </div>
                </form>
              </div>
            </div>
          )}
          
          <div className="auth-links">
            <p>
              ¿No tienes una cuenta? <a href="/register">Regístrate</a>
            </p>
          </div>
        </div>
      </div>
      <div className="illustration-section" />
    </div>
  );
}