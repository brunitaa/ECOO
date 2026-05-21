import { Link } from 'react-router-dom';
import BrandLogo from './brand/BrandLogo';
import EcoCoinBadge from './EcoCoinBadge';
import { Icon } from './icons';
import './Navbar.css';

function initials(name = '') {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export default function Navbar({ nombre, saldo, fotoUrl, compact }) {
  return (
    <header className={`navbar ${compact ? 'navbar--compact' : ''}`}>
      <div className="navbar__top">
        <Link to="/" className="navbar__logo-link" aria-label="Ecoo inicio">
          <BrandLogo height={compact ? 28 : 36} />
        </Link>
        <div
          className="navbar__avatar"
          style={fotoUrl ? { backgroundImage: `url(${fotoUrl})` } : undefined}
        >
          {!fotoUrl && initials(nombre)}
        </div>
      </div>
      {!compact && (
        <>
          <p className="navbar__greet">
            <Icon name="leaf" size={14} /> Hola de nuevo,
          </p>
          <h1 className="navbar__name">{nombre || 'Ciudadano'}</h1>
          <div className="navbar__balance-card">
            <p className="navbar__balance-label">Tu saldo ECOO POINTS</p>
            <div className="navbar__balance-row">
              <EcoCoinBadge size="lg" amount={saldo ?? '—'} />
            </div>
          </div>
        </>
      )}
      {compact && saldo != null && (
        <div className="navbar__compact-saldo">
          <span>Tu saldo</span>
          <EcoCoinBadge amount={saldo} />
        </div>
      )}
    </header>
  );
}
