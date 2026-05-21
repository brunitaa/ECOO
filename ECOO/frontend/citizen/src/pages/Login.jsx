import { useState } from "react";
import {
  Link,
  useSearchParams,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { api } from "../api/client";
import { saveSession } from "../lib/auth";
import { BrandLogo, EcoPointIcon } from "@ecoo/ui";
import { Button } from "@ecoo/ui";
import "./AuthPages.css";

export default function Login() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const returnUrl = params.get("return") || location.state?.from || "/";

  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      const data = await api.login({ correo, password, tipo: "ciudadano" });
      saveSession({ token: data.token, user: data.user, rol: "ciudadano" });
      const target = returnUrl.startsWith("/") ? returnUrl : "/";
      navigate(target, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page ec-waves-bg">
      <div className="auth-card ec-glass">
        <BrandLogo height={52} className="auth-brand-logo" />
        <p className="auth-tagline">
          <EcoPointIcon size={28} />
          Convierte tus acciones sostenibles en recompensas reales
        </p>

        <form onSubmit={submit} className="auth-form">
          <label>
            Correo
            <input
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
              autoComplete="email"
            />
          </label>
          <label>
            Contraseña
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </label>
          {error && (
            <p className="auth-error" role="alert">
              {error}
            </p>
          )}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={loading}
            className="auth-submit"
          >
            Iniciar sesión
          </Button>
        </form>

        <p className="auth-footer">
          ¿No tienes cuenta?{" "}
          <Link to={`/register?return=${encodeURIComponent(returnUrl)}`}>
            Regístrate
          </Link>
        </p>
        <p className="auth-demo">Demo: juan@upsa.edu / demo123</p>
      </div>
    </div>
  );
}
