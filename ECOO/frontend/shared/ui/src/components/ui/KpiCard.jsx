import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Icon from '../icons/Icon.jsx';
import Card from './Card.jsx';
import './KpiCard.css';

function useCountUp(target, duration = 800, enabled = true) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!enabled || target == null) return;
    const num = typeof target === 'number' ? target : parseFloat(String(target).replace(/[^\d.-]/g, '')) || 0;
    const start = performance.now();
    let frame;
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - (1 - t) ** 3;
      setValue(num * eased);
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, duration, enabled]);
  return value;
}

export default function KpiCard({
  label,
  value,
  suffix = '',
  icon = 'chart',
  trend,
  trendLabel,
  animate = true,
  className = '',
}) {
  const isNumeric = typeof value === 'number';
  const animated = useCountUp(isNumeric ? value : 0, 900, animate && isNumeric);
  const display = isNumeric && animate
    ? `${animated.toLocaleString('es-BO', { maximumFractionDigits: 1 })}${suffix}`
    : `${value}${suffix}`;

  return (
    <Card className={`ec-kpi ${className}`.trim()} hover>
      <motion.div
        className="ec-kpi__icon"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.05 }}
      >
        <Icon name={icon} size={22} />
      </motion.div>
      <div className="ec-kpi__body">
        <strong className="ec-kpi__value">{display}</strong>
        <span className="ec-kpi__label">{label}</span>
        {trend != null && (
          <span className={`ec-kpi__trend${trend >= 0 ? ' ec-kpi__trend--up' : ' ec-kpi__trend--down'}`}>
            <Icon name={trend >= 0 ? 'trending' : 'chart'} size={14} />
            {trendLabel || `${trend > 0 ? '+' : ''}${trend}%`}
          </span>
        )}
      </div>
    </Card>
  );
}