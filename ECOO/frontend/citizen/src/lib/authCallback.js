/** Lee token del callback del portal (otro puerto = otro localStorage) */
export function consumeAuthCallback(expectedRol) {
  if (!window.location.pathname.endsWith('/auth/callback')) return false;

  const params = new URLSearchParams(window.location.search);
  const token = params.get('token');
  const rol = params.get('rol');
  const userEnc = params.get('user');

  if (!token || rol !== expectedRol) return false;

  localStorage.setItem('ecoo_token', token);
  localStorage.setItem('ecoo_rol', rol);
  if (userEnc) {
    try {
      const userJson = decodeURIComponent(atob(userEnc));
      localStorage.setItem('ecoo_user', userJson);
    } catch {
      /* ignore decode errors */
    }
  }

  window.history.replaceState({}, '', '/');
  return true;
}
