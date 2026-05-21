import { useState } from "react";
import AdminDashboard from "./AdminDashboard";
import AdminPanel from "./AdminPanel";
import AdminEmpresas from "./AdminEmpresas";
import AdminReglas from "./AdminReglas";
import AdminQrs from "./AdminQrs";
import { BrandLogo } from "@ecoo/ui";
import { Icon } from "../components/icons";
import "./AdminHub.css";

const TABS = [
  { id: "dashboard", label: "Dashboard", icon: "chart" },
  { id: "moderacion", label: "Moderacion", icon: "shield" },
  { id: "empresas", label: "Empresas", icon: "building" },
  { id: "reglas", label: "Reglas", icon: "target" },
  { id: "qrs", label: "QR", icon: "qr" },
];

export default function AdminHub({ adminId }) {
  const [tab, setTab] = useState("dashboard");

  return (
    <div className="admin-hub">
      <aside className="admin-hub__sidebar ec-glass">
        <div className="admin-hub__brand">
          <BrandLogo height={32} />
          <span className="admin-hub__tag">Admin</span>
        </div>
        <nav className="admin-hub__nav">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              className={`admin-hub__tab${tab === t.id ? " admin-hub__tab--on" : ""}`}
              onClick={() => setTab(t.id)}
            >
              <Icon name={t.icon} size={18} />
              {t.label}
            </button>
          ))}
        </nav>
      </aside>
      <main className="admin-hub__main">
        {tab === "dashboard" && <AdminDashboard />}
        {tab === "moderacion" && <AdminPanel adminId={adminId} />}
        {tab === "empresas" && <AdminEmpresas />}
        {tab === "reglas" && <AdminReglas />}
        {tab === "qrs" && <AdminQrs />}
      </main>
    </div>
  );
}
