import { Navigate, useLocation } from 'react-router-dom';
import { getSession } from '../lib/auth';

/** Rutas solo para usuarios no autenticados (login / register) */
export default function GuestRoute({ children }) {
  const location = useLocation();
  const session = getSession();

  if (session) {
    const fromState = location.state?.from;
    const returnParam = new URLSearchParams(location.search).get('return');
    const target = fromState || returnParam || '/';
    return <Navigate to={target.startsWith('/') ? target : '/'} replace />;
  }

  return children;
}
