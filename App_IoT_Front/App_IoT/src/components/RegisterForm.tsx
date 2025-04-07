import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthService } from "../services/auth.service";
import "../styles/Login.css";

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    dateOfBirth: "", // Formato DD/MM/YYYY
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    
    // Autoformato DD/MM/YYYY
    if (value.length > 2 && value.length <= 4) {
      value = `${value.slice(0, 2)}/${value.slice(2)}`;
    } else if (value.length > 4) {
      value = `${value.slice(0, 2)}/${value.slice(2, 4)}/${value.slice(4, 8)}`;
    }
    
    setFormData({...formData, dateOfBirth: value});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Validaciones
    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      setIsLoading(false);
      return;
    }

    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(formData.dateOfBirth)) {
      setError("Formato de fecha inválido (Use DD/MM/YYYY)");
      setIsLoading(false);
      return;
    }

    try {
      const response = await AuthService.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        date_birthday: formData.dateOfBirth // Enviará DD/MM/YYYY pero el servicio lo convertirá
      });
      
      if (response.access_token) {
        navigate("/");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error en el registro");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="form-section">
        <div className="form-container">
          <div className="logo">REGÍSTRATE</div>
          <h1 className="form-title">CREA UNA CUENTA</h1>
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="name">Nombre</label>
              <input
                type="text"
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
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
              <label htmlFor="dateOfBirth">Fecha de nacimiento (DD/MM/YYYY)</label>
              <input
                type="text"
                id="dateOfBirth"
                required
                placeholder="DD/MM/YYYY"
                value={formData.dateOfBirth}
                onChange={handleDateChange}
                maxLength={10}
              />
            </div>
            <div className="input-group">
              <label htmlFor="password">Contraseña (mínimo 8 caracteres)</label>
              <input
                type="password"
                id="password"
                required
                minLength={8}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
            <div className="input-group">
              <label>Confirmar Contraseña</label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => {
                  setFormData({...formData, confirmPassword: e.target.value});
                  if (error === "Las contraseñas no coinciden") {
                    setError("");
                  }
                }}
                required
              />
            </div>

            {error && <div className="error-message">{error}</div>}
            <button type="submit" className="submit-button" disabled={isLoading}>
              {isLoading ? "Registrando..." : "REGISTRARSE"}
            </button>
          </form>

          <div className="auth-links">
            <p>
              ¿Ya tienes una cuenta? <a href="/">Inicia Sesión</a>
            </p>
          </div>
        </div>
      </div>
      <div className="illustration-section" />
    </div>
  );
}