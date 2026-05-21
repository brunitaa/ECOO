import EcoPointIcon from './brand/EcoPointIcon';
import './EcoCoinBadge.css';

export default function EcoCoinBadge({ amount, size = 'md' }) {
  const iconSize = size === 'lg' ? 36 : size === 'sm' ? 20 : 28;
  return (
    <span className={`ecoin-badge ecoin-badge--${size}`}>
      <EcoPointIcon size={iconSize} />
      {amount != null && <span className="ecoin-badge__amount">{amount}</span>}
    </span>
  );
}
