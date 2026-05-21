import EcoCoinBadge from './EcoCoinBadge';
import { Icon } from './icons';
import './RewardCard.css';

export default function RewardCard({ recompensa, saldo, onCanjear, loading }) {
  const costo = recompensa.costo_ecocoins;
  const stock = recompensa.stock_disponible;
  const sinStock = stock <= 0;
  const puede = saldo >= costo && !sinStock;
  const faltan = Math.max(0, costo - saldo);
  const progreso = saldo > 0 ? Math.min(100, (saldo / costo) * 100) : 0;
  const iconName = recompensa.iconName || 'gift';

  return (
    <article
      className={`reward-card ${!puede ? 'reward-card--disabled' : ''} ${recompensa.destacado ? 'reward-card--featured' : ''}`}
    >
      <div className="reward-card__icon" aria-hidden>
        <Icon name={iconName} size={24} />
      </div>

      <div className="reward-card__body">
        <h3 className="reward-card__title" title={recompensa.titulo}>
          {recompensa.titulo}
        </h3>
        <p className="reward-card__desc">
          {recompensa.descripcion}
        </p>
        
        <div className="reward-card__meta">
          <EcoCoinBadge size="sm" amount={costo} />
          <span className="reward-card__stock">
            {sinStock ? 'Agotado' : `${stock} disponibles`}
          </span>
        </div>

        {!puede && !sinStock && faltan > 0 && (
          <div className="reward-card__progress-container">
            <p className="reward-card__faltan">Faltan {faltan} EC</p>
            <div className="reward-card__bar">
              <div className="reward-card__bar-fill" style={{ width: `${progreso}%` }} />
            </div>
          </div>
        )}
      </div>

      <button
        type="button"
        className="reward-card__btn"
        disabled={!puede || loading}
        onClick={() => onCanjear(recompensa)}
        aria-label={sinStock ? 'Premio agotado' : puede ? 'Canjear premio' : 'Premio bloqueado'}
      >
        {loading ? (
          '...'
        ) : sinStock ? (
          'Agotado'
        ) : puede ? (
          'Canjear'
        ) : (
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Icon name="lock" size={14} />
            <span>Candado</span>
          </span>
        )}
      </button>
    </article>
  );
}
