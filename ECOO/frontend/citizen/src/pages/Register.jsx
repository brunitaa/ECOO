import { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { saveSession } from '../lib/auth';
import BrandLogo from '../components/brand/BrandLogo';
import { Button } from '@ecoo/ui';
import './AuthPages.css';

export default function Register() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const returnUrl = params.get('return') || '/';

  const [form, setForm] = useState({
    nombre: '',
    telefono: '',
    correo: '',
    password: '',
    universidad: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      const data = await api.register(form);
      saveSession({ token: data.token, user: data.user, rol: 'ciudadano' });
      navigate(returnUrl.startsWith('/') ? returnUrl : '/', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page ec-waves-bg">
      <div className="auth-card ec-glass">
        <BrandLogo height={48} className="auth-brand-logo" />
        <p className="auth-tagline">Únete a ECOO y gana ECOO POINTS</p>

        <form onSubmit={submit} className="auth-form">
          <label>
            Nombre
            <input value={form.nombre} onChange={set('nombre')} required />
          </label>
          <label>
            Teléfono
            <input value={form.telefono} onChange={set('telefono')} required />
          </label>
          <label>
            Correo
            <input type="email" value={form.correo} onChange={set('correo')} required />
          </label>
          <label>
            Universidad
            <input value={form.universidad} onChange={set('universidad')} />
          </label>
          <label>
            Contraseña (mín. 6)
            <input
              type="password"
              value={form.password}
              onChange={set('password')}
              minLength={6}
              required
            />
          </label>
          {error && <p className="auth-error" role="alert">{error}</p>}
          <Button type="submit" variant="primary" size="lg" loading={loading} className="auth-submit">
            Registrarme
          </Button>
        </form>

        <p className="auth-footer">
          ¿Ya tienes cuenta?{' '}
          <Link to={`/login?return=${encodeURIComponent(returnUrl)}`}>Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
}
