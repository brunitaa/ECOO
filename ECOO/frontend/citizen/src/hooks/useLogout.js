import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { clearSession } from '../lib/session.js';

/**
 * Logout con navegación SPA (sin recargar si ya estamos en flujo React).
 * Limpia tokens y estados; fuerza /login en la app ciudadano.
 */
export function useLogout() {
  const navigate = useNavigate();

  return useCallback(() => {
    clearSession();
    navigate('/login', { replace: true });
    window.setTimeout(() => {
      if (window.location.pathname !== '/login') {
        window.location.replace(`${window.location.origin}/login`);
      }
    }, 50);
  }, [navigate]);
}