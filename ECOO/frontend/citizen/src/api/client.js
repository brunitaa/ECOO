import { clearSession } from '../lib/session.js';

const BASE = import.meta.env.VITE_API_URL || '/api';

function headers() {
  const token = localStorage.getItem('ecoo_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

function handleUnauthorized() {
  clearSession();
  window.dispatchEvent(new CustomEvent('ecoo:unauthorized'));
}

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: { ...headers(), ...options.headers },
  });
  const data = await res.json().catch(() => ({}));

  if (res.status === 401) {
    handleUnauthorized();
    const err = new Error('Tu sesión expiró. Inicia sesión nuevamente.');
    err.status = 401;
    throw err;
  }

  if (!res.ok) {
    const err = new Error(data.error || 'Error en la solicitud');
    err.status = res.status;
    err.details = data.details;
    throw err;
  }
  return data;
}

export const api = {
  login: (body) => request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  register: (body) => request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  getSaldo: (id) => request(`/usuarios/${id}/saldo`),
  getUsuario: (id) => request(`/usuarios/${id}`),
  getAcciones: (id) => request(`/usuarios/${id}/acciones`),
  getRecompensas: () => request('/recompensas'),
  getPunto: (codigo) => request(`/puntos/qr/${encodeURIComponent(codigo)}`),
  estimarPunto: (codigo, cantidad) =>
    request(`/puntos/qr/${encodeURIComponent(codigo)}/estimar?cantidad=${cantidad}`),
  getRanking: () => request('/usuarios/ranking/ecologico'),
  canjear: (body) => request('/recompensas/canjear', { method: 'POST', body: JSON.stringify(body) }),
  registrarAccion: (body) =>
    request('/acciones/registrar', { method: 'POST', body: JSON.stringify(body) }),
};