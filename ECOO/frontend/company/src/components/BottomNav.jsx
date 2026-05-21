import { NavLink } from "react-router-dom";
import { Icon } from "@ecoo/ui";
import "./BottomNav.css";

const items = [
  { to: "/", label: "Inicio", icon: "home" },
  { to: "/escanear", label: "Escanear", icon: "qr" },
  { to: "/premios", label: "Premios", icon: "gift" },
  { to: "/roles", label: "Más", icon: "menu" },
];

export default function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="Navegación principal">
      {items.map(({ to, label, icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `bottom-nav__item${isActive ? " bottom-nav__item--active" : ""}`
          }
          end={to === "/"}
        >
          <Icon name={icon} size={20} className="bottom-nav__icon" />
          <span className="bottom-nav__label">{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
