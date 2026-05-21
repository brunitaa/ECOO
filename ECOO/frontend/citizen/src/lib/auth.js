import { consumeAuthCallback } from './authCallback.js';
import { clearSession, RETURN_KEY, getAppLoginUrl } from './session.js';

const EXPECTED_ROL = 'ciudadano';

export function getSession() {
  const token = localStorage.getItem('ecoo_token');
  const rol = localStorage.getItem('ecoo_rol');
  const userRaw = localStorage.getItem('ecoo_user');
  if (!token || rol !== EXPECTED_ROL) return null;
  let user = null;
  if (userRaw) {
    try {
      user = JSON.parse(userRaw);
    } catch {
      return null;
    }
  }
  return { token, user };
}

export function saveSession({ token, user, rol = EXPECTED_ROL }) {
  localStorage.setItem('ecoo_token', token);
  localStorage.setItem('ecoo_rol', rol);
  localStorage.setItem('ecoo_user', JSON.stringify(user));
}

export function setReturnPath(path) {
  if (path && path !== '/login' && path !== '/register') {
    sessionStorage.setItem(RETURN_KEY, path);
  }
}

export function consumeReturnPath() {
  const path = sessionStorage.getItem(RETURN_KEY);
  sessionStorage.removeItem(RETURN_KEY);
  if (!path || path.startsWith('/login') || path.startsWith('/register')) return '/';
  return path;
}

export function initSession() {
  consumeAuthCallback(EXPECTED_ROL);
  return getSession();
}

export function hasValidSession() {
  return Boolean(getSession());
}

/** Redirige al login de ESTA app (ciudadano), no al portal */
export function redirectToLogin(returnPath) {
  if (returnPath) setReturnPath(returnPath);
  const q = returnPath ? `?return=${encodeURIComponent(returnPath)}` : '';
  window.location.replace(`${getAppLoginUrl()}${q}`);
}

/**
 * Cierre de sesión ciudadano: limpia todo y vuelve al login local.
 * No redirige al portal principal.
 */
export function logout() {
  clearSession();

  const loginUrl = getAppLoginUrl();
  const onLogin =
    window.location.pathname === '/login' ||
    window.location.pathname === '/register';

  if (!onLogin) {
    window.location.replace(loginUrl);
  }
}

export { clearSession };