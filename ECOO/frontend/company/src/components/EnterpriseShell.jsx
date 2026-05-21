import { Button } from "@ecoo/ui";
import { Icon } from "./icons";
import "./EnterpriseShell.css";

const navItems = [
  {
    key: "kpis",
    label: "Dashboard",
    icon: "chart",
    description: "Impacto RSE",
  },
  {
    key: "qrs",
    label: "Puntos QR",
    icon: "qr",
    description: "Códigos activos",
  },
  {
    key: "caja",
    label: "Validar cupones",
    icon: "gift",
    description: "Escaneo y canje",
  },
];

export default function EnterpriseShell({
  session,
  activeKey,
  onSelect,
  onLogout,
  children,
}) {
  const esPatrocinador = session.user?.tipo_empresa === "patrocinador_rse";
  const displayItems = esPatrocinador
    ? navItems
    : navItems.filter((item) => item.key === "caja");
  const roleLabel = esPatrocinador ? "RSE Premium" : "Comercio";

  return (
    <div className="enterprise-shell">
      <aside className="enterprise-shell__sidebar">
        <div className="enterprise-shell__brand">
          <span>EC</span>
          <strong>OO</strong>
        </div>

        <div className="enterprise-shell__intro">
          <p className="enterprise-shell__eyebrow">
            Administración empresarial
          </p>
          <h1 className="enterprise-shell__title">Panel de control</h1>
          <p className="enterprise-shell__desc">
            Gestiona escaneos, códigos QR y métricas de impacto desde un solo
            lugar.
          </p>
        </div>

        <div className="enterprise-shell__user-card">
          <div className="enterprise-shell__user-top">
            <div>
              <p className="enterprise-shell__user-label">Empresa</p>
              <strong>{session.user?.nombre || "Comercio"}</strong>
            </div>
            <span className="enterprise-shell__user-role">{roleLabel}</span>
          </div>
          <p className="enterprise-shell__user-meta">
            ID: {session.user?.id_empresa || "---"}
          </p>
        </div>

        <nav
          className="enterprise-shell__nav"
          aria-label="Navegación de la empresa"
        >
          {displayItems.map((item) => (
            <button
              key={item.key}
              type="button"
              className={`enterprise-shell__nav-item ${activeKey === item.key ? "enterprise-shell__nav-item--active" : ""}`}
              onClick={() => onSelect(item.key)}
            >
              <span className="enterprise-shell__nav-icon" aria-hidden>
                <Icon name={item.icon} size={18} />
              </span>
              <span>
                {item.label}
                <small>{item.description}</small>
              </span>
            </button>
          ))}
        </nav>

        <div className="enterprise-shell__footer">
          <div className="enterprise-shell__status">
            <span className="enterprise-shell__status-dot" />
            <span>Activo</span>
          </div>
          <Button variant="secondary" size="sm" onClick={onLogout}>
            Cerrar sesión
          </Button>
        </div>
      </aside>

      <main className="enterprise-shell__content">{children}</main>
    </div>
  );
}