/** Construye URL de callback con token (localStorage NO se comparte entre puertos) */
export function buildAuthRedirectUrl(baseUrl, { token, rol, user }) {
  const url = new URL(baseUrl);
  const basePath = url.pathname.replace(/\/$/, '') || '';
  url.pathname = `${basePath}/auth/callback`;
  url.searchParams.set('token', token);
  url.searchParams.set('rol', rol);
  url.searchParams.set('user', btoa(encodeURIComponent(JSON.stringify(user))));
  return url.toString();
}

export function clearSession() {
  localStorage.removeItem('ecoo_token');
  localStorage.removeItem('ecoo_user');
  localStorage.removeItem('ecoo_rol');
}