import { useEffect, useState } from "react";
import { initSession, redirectToLogin, logout } from "./lib/auth";
import AdminHub from "./pages/AdminHub";
import { BrandLogo } from "@ecoo/ui";
import Spinner from "./components/Spinner";
import "./styles/global.css";
import "./styles/admin-bar.css";

export default function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    const s = initSession();
    if (!s) {
      redirectToLogin();
      return;
    }
    setSession(s);
  }, []);

  if (!session) {
    return <Spinner label="Verificando sesión…" />;
  }

  return (
    <>
      <header className="admin-bar">
        <BrandLogo height={26} />
        <span>{session.user?.nombre}</span>
        <button type="button" onClick={logout}>
          Cerrar sesión
        </button>
      </header>
      <AdminHub adminId={session.user?.id_admin} />
    </>
  );
}
