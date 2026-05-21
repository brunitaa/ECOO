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
  validarCupon: (codigo_unico) =>
    request('/cupones/validar-caja', {
      method: 'POST',
      body: JSON.stringify({ codigo_unico }),
    }),
  getEmpresaKpis: (id) => request(`/empresas/${id}/kpis`),
  getEmpresaAnalytics: (id) => request(`/empresas/${id}/analytics`),
  getEmpresaQrs: (id) => request(`/empresas/${id}/qrs`),
};
