import { useState } from 'react';
import { Icon } from './icons';
import { Button } from '@ecoo/ui';
import './ActionCard.css';

export default function ActionCard({ accion, onAprobar, onRechazar, removing }) {
  const [showReject, setShowReject] = useState(false);
  const [motivo, setMotivo] = useState('');

  const handleRechazar = () => {
    if (!motivo.trim()) return;
    onRechazar(accion.id_accion, motivo.trim());
  };

  return (
    <article className={`action-card${removing ? ' fade-out' : ''}`}>
      <header className="action-card__header">
        <div className="action-card__avatar">
          {accion.usuario_nombre?.slice(0, 2).toUpperCase()}
        </div>
        <div className="action-card__info">
          <h3>{accion.usuario_nombre}</h3>
          <p>{accion.punto_nombre} - {accion.tipo_accion_permitida}</p>
          {accion.respuesta_resumen && (
            <p className="action-card__respuesta">{accion.respuesta_resumen}</p>
          )}
        </div>
        <span className="action-card__coins">+{accion.ecocoins_propuestos} EC</span>
        <span className="action-card__badge"><Icon name="clock" size={12} /> Pendiente</span>
      </header>
      <div className="action-card__body">
        <div className="action-card__photo-wrap">
          {accion.foto_url ? (
            <img src={accion.foto_url} alt="Evidencia" className="action-card__photo" />
          ) : (
            <div className="action-card__photo-placeholder">
              <Icon name="camera" size={28} /><span>Sin foto</span>
            </div>
          )}
        </div>
        <div className="action-card__grid">
          <div><span className="action-card__label">Declaracion</span><strong>{accion.respuesta_resumen || '-'}</strong></div>
          <div><span className="action-card__label">Cantidad</span><strong>{accion.cantidad_declarada ?? '-'}</strong></div>
          <div><span className="action-card__label">EcoCoins</span><strong className="action-card__ec">+{accion.ecocoins_propuestos} EC</strong></div>
          <div><span className="action-card__label">Historial</span><strong><Icon name="check" size={14} /> {accion.historial_aprobadas} verificadas</strong></div>
        </div>
        {showReject ? (
          <div className="action-card__reject">
            <textarea value={motivo} onChange={(e) => setMotivo(e.target.value)} placeholder="Motivo del rechazo" rows={3} />
            <div className="action-card__actions">
              <Button variant="danger" onClick={handleRechazar}>Confirmar rechazo</Button>
              <Button variant="ghost" onClick={() => setShowReject(false)}>Cancelar</Button>
            </div>
          </div>
        ) : (
          <div className="action-card__actions">
            <Button variant="primary" icon="check" onClick={() => onAprobar(accion.id_accion)}>Aprobar +{accion.ecocoins_propuestos} EC</Button>
            <Button variant="ghost" icon="x" onClick={() => setShowReject(true)}>Rechazar</Button>
          </div>
        )}
      </div>
    </article>
  );
}
