import { useEffect, useState } from "react";
import { initSession, redirectToLogin, logout } from "./lib/auth";
import CashierView from "./pages/CashierView";
import EmpresaKpiDashboard from "./pages/EmpresaKpiDashboard";
import EmpresaQrPanel from "./pages/EmpresaQrPanel";
import Spinner from "./components/Spinner";
import EnterpriseShell from "./components/EnterpriseShell";
import "./styles/global.css";

export default function App() {
  const [session, setSession] = useState(null);
  const [tab, setTab] = useState("caja");

  useEffect(() => {
    const s = initSession();
    if (!s) {
      redirectToLogin();
      return;
    }
    setSession(s);
    if (s.user?.tipo_empresa === "patrocinador_rse") {
      setTab("kpis");
    }
  }, []);

  if (!session) {
    return <Spinner label="Verificando sesión…" />;
  }

  const esPatrocinador = session.user?.tipo_empresa === "patrocinador_rse";
  const empresaId = Number(session.user?.id_empresa || 0);

  // Note: We removed the lines creating 'menuItems' and 'tabs' entirely!

  return (
    <EnterpriseShell
      session={session}
      activeKey={tab}
      onSelect={setTab}
      onLogout={logout}
    >
      {tab === "kpis" && esPatrocinador && (
        <EmpresaKpiDashboard empresaId={empresaId} />
      )}
      {tab === "qrs" && esPatrocinador && (
        <EmpresaQrPanel empresaId={empresaId} />
      )}
      {(tab === "caja" || !esPatrocinador) && <CashierView />}
    </EnterpriseShell>
  );
}
