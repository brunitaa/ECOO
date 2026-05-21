import { useState } from "react";
import { Link } from "react-router-dom";
import { apiRegister } from "../api/client";
import { buildAuthRedirectUrl } from "../lib/authStorage";
import { Icon } from "@ecoo/ui";
import "./Auth.css";

const URL_CIUDADANO =
  import.meta.env.VITE_URL_CIUDADANO || "http://localhost:5173";

export default function Register() {
  const [form, setForm] = useState({
    nombre: "",
    telefono: "",
    correo: "",
    password: "",
    universidad: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      const data = await apiRegister(form);
      const target = buildAuthRedirectUrl(data.redirectUrl || URL_CIUDADANO, {
        token: data.token,
        rol: data.rol,
        user: data.user,
      });
      window.location.replace(target);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const D = "div";

  return (
    <D className="auth-page">
      <D className="auth-card">
        <Link to="/" className="auth-back-link">
          <Icon name="arrowLeft" size={16} /> Volver al inicio
        </Link>
        <h1 className="auth-logo">Crear cuenta Ecoo</h1>
        <p className="auth-tagline">
          Registro para ciudadanos — estudiantes y usuarios B2C
        </p>

        <form onSubmit={submit} className="auth-form">
          <label>
            Nombre completo
            <input value={form.nombre} onChange={set("nombre")} required />
          </label>
          <label>
            Teléfono
            <input value={form.telefono} onChange={set("telefono")} required />
          </label>
          <label>
            Correo
            <input
              type="email"
              value={form.correo}
              onChange={set("correo")}
              required
            />
          </label>
          <label>
            Universidad (opcional)
            <input value={form.universidad} onChange={set("universidad")} />
          </label>
          <label>
            Contraseña (mín. 6)
            <input
              type="password"
              value={form.password}
              onChange={set("password")}
              minLength={6}
              required
            />
          </label>
          {error && <p className="auth-error">{error}</p>}
          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? "Redirigiendo…" : "Registrarme"}
          </button>
        </form>

        <p className="auth-footer">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </D>
    </D>
  );
}