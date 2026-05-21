import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { initSession, getSession } from '../lib/auth';
import { AppProvider } from '../context/AppContext';
import Spinner from './Spinner';

export default function ProtectedApp({ children }) {
  const location = useLocation();
  const [session, setSession] = useState(() => initSession() || getSession());
  const [booting, setBooting] = useState(!session);

  useEffect(() => {
    const refresh = () => {
      const s = getSession();
      setSession(s);
      setBooting(false);
    };

    refresh();

    const onCleared = () => {
      setSession(null);
      setBooting(false);
    };
    const onUnauthorized = () => {
      setSession(null);
      setBooting(false);
    };

    window.addEventListener('ecoo:session-cleared', onCleared);
    window.addEventListener('ecoo:unauthorized', onUnauthorized);
    return () => {
      window.removeEventListener('ecoo:session-cleared', onCleared);
      window.removeEventListener('ecoo:unauthorized', onUnauthorized);
    };
  }, []);

  if (booting) {
    return <Spinner label="Verificando sesión…" fullScreen />;
  }

  if (!session) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: `${location.pathname}${location.search}` }}
      />
    );
  }

  return <AppProvider session={session}>{children}</AppProvider>;
}