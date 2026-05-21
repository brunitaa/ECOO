import { NavLink } from 'react-router-dom';
import { Icon } from './icons';
import { useLogout } from '../hooks/useLogout';
import './BottomNav.css';

const items = [
  { to: '/', label: 'Inicio', icon: 'home' },
  { to: '/escanear', label: 'Escanear', icon: 'scan' },
  { to: '/premios', label: 'Premios', icon: 'gift' },
];

export default function BottomNav() {
  const doLogout = useLogout();

  const handleLogout = async () => {
    await doLogout();
  };

  return (
    <nav className="bottom-nav ec-glass" aria-label="Navegación principal">
      {items.map(({ to, label, icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `bottom-nav__item${isActive ? ' bottom-nav__item--active' : ''}`
          }
          end={to === '/'}
        >
          <Icon name={icon} size={22} className="bottom-nav__icon-svg" />
          <span className="bottom-nav__label">{label}</span>
        </NavLink>
      ))}
      <button type="button" className="bottom-nav__item bottom-nav__logout" onClick={handleLogout}>
        <Icon name="logout" size={22} className="bottom-nav__icon-svg" />
        <span className="bottom-nav__label">Salir</span>
      </button>
    </nav>
  );
}
