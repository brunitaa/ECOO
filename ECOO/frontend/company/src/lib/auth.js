import { consumeAuthCallback } from './authCallback.js';

const PORTAL = 'https://ecoo-pgpk.onrender.com';
const EXPECTED_ROL = 'comercio';

export function getSession() {
  const token = localStorage.getItem('ecoo_token');
  const rol = localStorage.getItem('ecoo_rol');
  const user = localStorage.getItem('ecoo_user');
  if (!token || rol !== EXPECTED_ROL) return null;
  return { token, user: user ? JSON.parse(user) : null };
}

export function initSession() {
  consumeAuthCallback(EXPECTED_ROL);
  return getSession();
}

export function redirectToLogin() {
  window.location.replace(`${PORTAL}/login`);
}

export function logout() {
  localStorage.clear();
  window.location.replace(`${PORTAL}/login`);
}
