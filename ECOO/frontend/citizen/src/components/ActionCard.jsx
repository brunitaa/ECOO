import { useState } from 'react';
import './ActionCard.css';

export default function ActionCard({ accion, onAprobar, onRechazar, removing }) {
  const [expanded, setExpanded] = useState(false);
  const [motivo, setMotivo] = useState('');
  const [showReject, setShowReject] = useState(false);

  const handleRechazar = () => {
    if (!motivo.trim()) return;
    onRechazar(accion.id_accion, motivo.trim());
  };

  return (
    <article className={`action-card${expanded ? ' action-card--open' : ''}${removing ? ' fade-out' : ''}`}>
      <div className="action-card__header" onClick={() => setExpanded(!expanded)} role="button" tabIndex={0}>
        <div className="action-card__avatar">{accion.usuario_nombre?.slice(0, 2).toUpperCase()}</div>
        <div className="action-card__info">
          <h3>{accion.usuario_nombre}</h3>
          <p>
            {accion.tipo_accion_permitida} · {accion.punto_nombre}
          </p>
        </div>
        <span className="action-card__coins">+{accion.ecocoins_propuestos} EC</span>
        <span className="action-card__badge">Pendiente</span>
      </div>

      {expanded && (
        <div className="action-card__body">
          <div className="action-card__photo-wrap">
            {accion.foto_url ? (
              <img src={accion.foto_url} alt="Evidencia de acción" className="action-card__photo" />
            ) : (
              <div className="action-card__photo-placeholder">Sin foto</div>
            )}
          </div>
          <div className="action-card__grid">
            <div>
              <span className="action-card__label">Tipo</span>
              <strong>{accion.tipo_accion_permitida}</strong>
            </div>
            <div>
              <span className="action-card__label">EcoCoins</span>
              <strong className="action-card__ec">+{accion.ecocoins_propuestos} EC</strong>
            </div>
            <div>
              <span className="action-card__label">Sponsor</span>
              <strong>{accion.empresa_nombre || '—'}</strong>
            </div>
            <div>
              <span className="action-card__label">Historial</span>
              <strong>{accion.historial_aprobadas} verificadas ✓</strong>
            </div>
          </div>

          {showReject ? (
            <div className="action-card__reject">
              <textarea
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                placeholder="Motivo del rechazo (obligatorio)"
                rows={2}
              />
              <div className="action-card__actions">
                <button type="button" className="btn-danger" onClick={handleRechazar}>
                  Confirmar rechazo
                </button>
                <button type="button" className="btn-ghost" onClick={() => setShowReject(false)}>
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <div className="action-card__actions">
              <button type="button" className="btn-primary" onClick={() => onAprobar(accion.id_accion)}>
                ✓ Aprobar · +{accion.ecocoins_propuestos} EC
              </button>
              <button type="button" className="btn-ghost" onClick={() => setShowReject(true)}>
                ✕ Rechazar
              </button>
            </div>
          )}
        </div>
      )}
    </article>
  );
}
