/** Claves de sesión ECOO — ciudadano */
export const SESSION_KEYS = ['ecoo_token', 'ecoo_rol', 'ecoo_user'];
export const RETURN_KEY = 'ecoo_return_to';

export function clearSession() {
  SESSION_KEYS.forEach((k) => localStorage.removeItem(k));
  sessionStorage.removeItem(RETURN_KEY);
  window.dispatchEvent(new CustomEvent('ecoo:session-cleared'));
}

export function isPortalLoginUrl(url) {
  try {
    const u = new URL(url, window.location.origin);
    const portalPorts = ['5170'];
    const portalHosts = (import.meta.env.VITE_PORTAL_URL || '').replace(/\/$/, '');
    if (portalHosts && url.startsWith(portalHosts)) return true;
    return portalPorts.includes(u.port) && u.pathname.includes('/login');
  } catch {
    return false;
  }
}

/** Siempre login local de la app ciudadano — nunca portal */
export function getAppLoginUrl() {
  return `${window.location.origin}/login`;
}