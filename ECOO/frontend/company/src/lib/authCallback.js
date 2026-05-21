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
      localStorage.setItem('ecoo_user', decodeURIComponent(atob(userEnc)));
    } catch {
      /* ignore */
    }
  }

  window.history.replaceState({}, '', '/');
  return true;
}
