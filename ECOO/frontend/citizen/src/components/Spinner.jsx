import EcoPointIcon from './brand/EcoPointIcon';
import './Spinner.css';

export default function Spinner({ label = 'Cargando...', fullScreen = false }) {
  return (
    <div
      className={`spinner-wrap${fullScreen ? ' spinner-wrap--fullscreen' : ''}`}
      role="status"
      aria-live="polite"
    >
      <EcoPointIcon size={40} className="spinner-wrap__icon" />
      {label && <span className="spinner-label">{label}</span>}
    </div>
  );
}