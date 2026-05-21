const BASE = import.meta.env.VITE_API_URL || '/api';

function headers() {
  const token = localStorage.getItem('ecoo_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: { ...headers(), ...options.headers },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Error');
  return data;
}

export const api = {
  getDashboard: () => request('/admin/dashboard'),
  getPendientes: () => request('/admin/acciones/pendientes'),
  getProcesadas: () => request('/admin/acciones/procesadas'),
  verificarAccion: (body) =>
    request('/admin/verificar-accion', { method: 'POST', body: JSON.stringify(body) }),
  getEmpresas: () => request('/admin/empresas'),
  patchEmpresa: (id, body) =>
    request(`/admin/empresas/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  getTipos: () => request('/admin/tipos-reciclaje'),
  getReglas: () => request('/admin/reglas'),
  crearRegla: (body) => request('/admin/reglas', { method: 'POST', body: JSON.stringify(body) }),
  patchRegla: (id, body) =>
    request(`/admin/reglas/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  getQrs: () => request('/admin/qrs'),
  crearQr: (body) => request('/admin/qrs', { method: 'POST', body: JSON.stringify(body) }),
  patchQr: (id, body) =>
    request(`/admin/qrs/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
};