import { Link } from "react-router-dom";
import "./RoleSelector.css";

export default function RoleSelector() {
  return (
    <div className="role-selector">
      <header className="role-selector__hero">
        <h1 className="role-selector__logo">
          EC
          <span className="role-selector__o" />
          <span className="role-selector__o" />
        </h1>
        <p className="role-selector__tagline">
          Convierte tus acciones sostenibles en recompensas reales
        </p>
      </header>

      <nav className="role-selector__grid" aria-label="Seleccionar rol">
        <Link to="/" className="role-card role-card--citizen">
          <span className="role-card__icon">🌱</span>
          <h2>Ciudadano</h2>
          <p>Registra acciones, gana EcoCoins y canjea premios</p>
        </Link>
        <Link to="/caja" className="role-card role-card--cashier">
          <span className="role-card__icon">🏪</span>
          <h2>Empresa / Comercio</h2>
          <p>Valida cupones QR en el punto de venta</p>
        </Link>
        <Link to="/admin" className="role-card role-card--admin">
          <span className="role-card__icon">🛡️</span>
          <h2>Administrador</h2>
          <p>Modera acciones pendientes y acredita EcoCoins</p>
        </Link>
      </nav>

      <p className="role-selector__hashtags">
        #AccionesQueTransforman · #EcooImpacta
      </p>
    </div>
  );
}