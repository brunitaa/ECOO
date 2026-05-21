import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { apiLogin } from "../api/client";
import { buildAuthRedirectUrl } from "../lib/authStorage";
import { BrandLogo } from '@ecoo/ui';
import { EcoPointIcon } from '@ecoo/ui';
import { Icon } from "@ecoo/ui";
import "./Auth.css";

const REDIRECTS = {
  ciudadano: import.meta.env.VITE_URL_CIUDADANO || "http://localhost:5173",
  comercio: import.meta.env.VITE_URL_CAJA || "http://localhost:5174",
  admin: import.meta.env.VITE_URL_ADMIN || "http://localhost:5175",
};

export default function Login() {
  const [searchParams] = useSearchParams();
  const initialTipo = ["ciudadano", "comercio", "admin"].includes(
    searchParams.get("tipo"),
  )
    ? searchParams.get("tipo")
    : "ciudadano";

  const [tipo, setTipo] = useState(initialTipo);
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      const data = await apiLogin({ correo, password, tipo });
      const base = data.redirectUrl || REDIRECTS[data.rol];
      if (!base) {
        throw new Error("No hay URL de destino para este rol");
      }
      const target = buildAuthRedirectUrl(base, {
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
        <BrandLogo height={52} className="auth-brand-logo" />
        <p className="auth-tagline">
          <EcoPointIcon size={28} /> Convierte acciones sostenibles en ECOO
          POINTS reales
        </p>

        <D className="auth-tabs">
          {[
            { id: "ciudadano", label: "Ciudadano" },
            { id: "comercio", label: "Empresa / Comercio" },
            { id: "admin", label: "Admin" },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              className={`auth-tab${tipo === t.id ? " auth-tab--on" : ""}`}
              onClick={() => setTipo(t.id)}
            >
              {t.label}
            </button>
          ))}
        </D>

        <form onSubmit={submit} className="auth-form">
          <label>
            Correo
            <input
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
            />
          </label>
          <label>
            Contraseña
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          {error && <p className="auth-error">{error}</p>}
          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? "Redirigiendo…" : "Iniciar sesión"}
          </button>
        </form>

        {tipo === "ciudadano" && (
          <p className="auth-footer">
            ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
          </p>
        )}

        <p className="auth-demo">
          Demo: juan@upsa.edu · canjes@tazaeco.bo · admin@ecoo.app — pass:
          demo123
        </p>
      </D>
    </D>
  );
}