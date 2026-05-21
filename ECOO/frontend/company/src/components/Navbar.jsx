import { Link } from 'react-router-dom';
import EcoCoinBadge from './EcoCoinBadge';
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
        <Link to="/" className="navbar__logo" aria-label="Ecoo inicio">
          EC<span className="navbar__logo-o" />
          <span className="navbar__logo-o" />
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
          <p className="navbar__greet">Hola de nuevo,</p>
          <h1 className="navbar__name">{nombre || 'Ciudadano'} 👋</h1>
          <div className="navbar__balance-card">
            <p className="navbar__balance-label">Tu saldo actual</p>
            <div className="navbar__balance-row">
              <EcoCoinBadge size="lg" amount={saldo ?? '—'} />
              <span className="navbar__ecoin-tag">EcoCoins</span>
            </div>
          </div>
        </>
      )}
      {compact && saldo != null && (
        <div className="navbar__compact-saldo">
          <span>Tu saldo</span>
          <EcoCoinBadge amount={saldo} />
          <span className="navbar__ecoin-tag">EcoCoins</span>
        </div>
      )}
    </header>
  );
}
