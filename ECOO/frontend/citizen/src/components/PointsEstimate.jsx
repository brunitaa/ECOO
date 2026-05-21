import EcoPointIcon from './brand/EcoPointIcon';
import './PointsEstimate.css';

export default function PointsEstimate({ cantidad, puntosPorUnidad, total, unidad, loading }) {
  if (loading) {
    return <div className="points-estimate points-estimate--loading">Calculando…</div>;
  }
  if (total == null) return null;

  return (
    <div className="points-estimate">
      <div className="points-estimate__row">
        <EcoPointIcon size={40} />
        <div>
          <span className="points-estimate__label">Total estimado</span>
          <strong className="points-estimate__total">{total} ECOO POINTS</strong>
        </div>
      </div>
      {cantidad != null && puntosPorUnidad != null && (
        <p className="points-estimate__breakdown">
          {cantidad} {unidad || 'unidad(es)'} × {puntosPorUnidad} pts = {total}
        </p>
      )}
      <p className="points-estimate__note">Se acreditan tras aprobación del administrador Ecoo</p>
    </div>
  );
}
