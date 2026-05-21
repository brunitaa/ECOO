import { useEffect } from 'react';
import { consumeAuthCallback } from '../lib/authCallback';
import { getSession, redirectToLogin } from '../lib/auth';
import Spinner from '../components/Spinner';

export default function AuthCallback() {
  useEffect(() => {
    consumeAuthCallback('comercio');
    if (getSession()) window.location.replace('/');
    else redirectToLogin();
  }, []);

  return <Spinner label="Completando inicio de sesión…" />;
}
