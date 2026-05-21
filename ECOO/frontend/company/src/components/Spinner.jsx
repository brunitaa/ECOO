import './Spinner.css';

export default function Spinner({ label = 'Cargando...' }) {
  return (
    <div className="spinner-wrap" role="status" aria-live="polite">
      <div className="spinner" />
      {label && <span className="spinner-label">{label}</span>}
    </div>
  );
}
